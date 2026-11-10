import Phaser from 'phaser';
import { PHYSICS } from '../config/gameConfig';
import { InputState } from '../config/types';

interface WasdKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

export class InputSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: WasdKeys | null = null;
  private space: Phaser.Input.Keyboard.Key | null = null;
  private escKey: Phaser.Input.Keyboard.Key | null = null;
  private rKey: Phaser.Input.Keyboard.Key | null = null;

  private inputState: InputState = {
    left: false,
    right: false,
    flip: false,
    restart: false,
    pause: false,
  };

  private touchLeft: boolean = false;
  private touchRight: boolean = false;
  private touchFlip: boolean = false;
  private touchRestart: boolean = false;
  private touchPause: boolean = false;

  private spaceWasDown: boolean = false;
  private upWasDown: boolean = false;
  private wWasDown: boolean = false;
  private touchFlipHeld: boolean = false;
  private lastFlipTime: number = 0;

  constructor(private scene: Phaser.Scene) {
    if (this.scene.input && this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = this.scene.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
      }) as WasdKeys;
      this.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      this.rKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
  }

  public update(): void {
    const leftKeyboard =
      (this.cursors?.left.isDown ?? false) || (this.wasd?.A.isDown ?? false);
    const rightKeyboard =
      (this.cursors?.right.isDown ?? false) || (this.wasd?.D.isDown ?? false);

    const spacePressed = this.space?.isDown ?? false;
    const upPressed = this.cursors?.up.isDown ?? false;
    const wPressed = this.wasd?.W.isDown ?? false;

    const spaceJustDown = spacePressed && !this.spaceWasDown;
    const upJustDown = upPressed && !this.upWasDown;
    const wJustDown = wPressed && !this.wWasDown;

    const rJustDown = this.rKey ? Phaser.Input.Keyboard.JustDown(this.rKey) : false;
    const escJustDown = this.escKey ? Phaser.Input.Keyboard.JustDown(this.escKey) : false;

    const now = this.scene.time.now;
    const keyboardFlipPressed = spaceJustDown || upJustDown || wJustDown;
    const touchFlipPressed = this.touchFlip && !this.touchFlipHeld;

    const canStartNewFlip = now - this.lastFlipTime >= PHYSICS.FLIP_COOLDOWN;
    const flipTriggered = canStartNewFlip && (keyboardFlipPressed || touchFlipPressed);

    if (flipTriggered) {
      this.lastFlipTime = now;
    }

    const restartTriggered = rJustDown || this.touchRestart;
    const pauseTriggered = escJustDown || this.touchPause;

    this.inputState = {
      left: leftKeyboard || this.touchLeft,
      right: rightKeyboard || this.touchRight,
      flip: flipTriggered,
      restart: restartTriggered,
      pause: pauseTriggered,
    };

    this.spaceWasDown = spacePressed;
    this.upWasDown = upPressed;
    this.wWasDown = wPressed;
    this.touchFlipHeld = this.touchFlip;

    this.touchFlip = false;
    this.touchRestart = false;
    this.touchPause = false;
  }

  public getState(): InputState {
    return { ...this.inputState };
  }

  public setFlip(value: boolean): void {
    this.touchFlip = value;
  }

  public setLeft(value: boolean): void {
    this.touchLeft = value;
  }

  public setRight(value: boolean): void {
    this.touchRight = value;
  }

  public setPause(value: boolean): void {
    this.touchPause = value;
  }

  public setRestart(value: boolean): void {
    this.touchRestart = value;
  }

  public destroy(): void {
    // Clear references
    this.cursors = null;
    this.wasd = null;
    this.space = null;
    this.escKey = null;
    this.rKey = null;
  }
}
