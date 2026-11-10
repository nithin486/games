import Phaser from 'phaser';
import { DEPTH } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import { InputSystem } from '../systems/InputSystem';

export class TouchControls {
  private container: Phaser.GameObjects.Container;

  constructor(
    private scene: Phaser.Scene,
    private inputSystem: InputSystem
  ) {
    this.container = scene.add.container(0, 0);
    this.container.setDepth(DEPTH.TOUCH_CONTROLS);
    this.container.setScrollFactor(0);

    // Only display if touch is available or pointer has touch
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      // Hide touch controls on desktop unless desired
      this.container.setVisible(false);
    }

    this.createControls();
  }

  private createControls(): void {
    const bottomY = GAME_HEIGHT - 65;

    // ─── Left Button ──────────────────────────────────────────
    const leftBtn = this.createButton(
      70,
      bottomY,
      35,
      '<',
      () => this.inputSystem.setLeft(true),
      () => this.inputSystem.setLeft(false)
    );

    // ─── Right Button ─────────────────────────────────────────
    const rightBtn = this.createButton(
      155,
      bottomY,
      35,
      '>',
      () => this.inputSystem.setRight(true),
      () => this.inputSystem.setRight(false)
    );

    // ─── Flip Button ──────────────────────────────────────────
    const flipBtn = this.createButton(
      GAME_WIDTH - 85,
      bottomY,
      45,
      'FLIP',
      () => this.inputSystem.setFlip(true),
      () => {}
    );

    this.container.add([leftBtn, rightBtn, flipBtn]);
  }

  private createButton(
    x: number,
    y: number,
    radius: number,
    label: string,
    onDown: () => void,
    onUp: () => void
  ): Phaser.GameObjects.Container {
    const btnContainer = this.scene.add.container(x, y);

    const circle = this.scene.add.circle(0, 0, radius, COLORS.PRIMARY_PURPLE, 0.45);
    circle.setStrokeStyle(2, COLORS.NEON_CYAN, 0.8);
    circle.setInteractive({ useHandCursor: true });

    const fontSize = label.length > 2 ? '18px' : '26px';
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: FONTS.HEADING,
      fontSize,
      color: COLORS_STR.WHITE,
    });
    text.setOrigin(0.5);

    circle.on('pointerdown', () => {
      circle.setFillStyle(COLORS.NEON_CYAN, 0.7);
      onDown();
    });

    const release = () => {
      circle.setFillStyle(COLORS.PRIMARY_PURPLE, 0.45);
      onUp();
    };

    circle.on('pointerup', release);
    circle.on('pointerout', release);

    btnContainer.add([circle, text]);
    return btnContainer;
  }

  public setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }

  public destroy(): void {
    this.container.destroy();
  }
}
