import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import saveSystem from '../systems/SaveSystem';
import { createIconButton } from '../ui/Buttons';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super(SCENES.SETTINGS);
  }

  create(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x120b24, 0x120b24, 0x091827, 0x091827, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const glowA = this.add.graphics();
    glowA.fillStyle(0x7c3aed, 0.18);
    glowA.fillCircle(180, 150, 220);
    const glowB = this.add.graphics();
    glowB.fillStyle(0x22d3ee, 0.12);
    glowB.fillCircle(820, 240, 200);

    this.add.text(GAME_WIDTH / 2, 50, 'SETTINGS', {
      fontFamily: FONTS.HEADING,
      fontSize: '40px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 6,
    }).setOrigin(0.5);

    // 6. Back Button (top-left)
    createIconButton(
      this,
      50,
      50,
      40,
      '←',
      0x1e293b,
      () => {
        this.scene.start(SCENES.MENU);
      },
      { fontSize: '20px' }
    );

    const card = this.add.graphics();
    card.fillStyle(0x111827, 0.6);
    card.fillRoundedRect(GAME_WIDTH / 2 - 280, 95, 560, 395, 18);
    card.lineStyle(2, 0x7dd3fc, 0.45);
    card.strokeRoundedRect(GAME_WIDTH / 2 - 280, 95, 560, 395, 18);

    // Current settings
    const settings = saveSystem.getSettings();

    // 3. Music Toggle
    this.createToggleRow(
      GAME_WIDTH / 2,
      140,
      'Music',
      settings.music,
      (newValue) => {
        const current = saveSystem.getSettings();
        current.music = newValue;
        saveSystem.setSettings(current);
      }
    );

    // 4. Sound Toggle
    this.createToggleRow(
      GAME_WIDTH / 2,
      195,
      'Sound Effects',
      settings.sound,
      (newValue) => {
        const current = saveSystem.getSettings();
        current.sound = newValue;
        saveSystem.setSettings(current);
      }
    );

    // Divider line
    const divider = this.add.graphics();
    divider.lineStyle(1, 0x334155, 0.8);
    divider.lineBetween(GAME_WIDTH / 2 - 240, 235, GAME_WIDTH / 2 + 240, 235);

    // 5. Difficulty selector (three pill buttons)
    this.add.text(GAME_WIDTH / 2 - 200, 260, 'Difficulty', {
      fontFamily: FONTS.BODY,
      fontSize: '20px',
      color: COLORS_STR.WHITE,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    const diffs: ('EASY' | 'NORMAL' | 'HARD')[] = ['EASY', 'NORMAL', 'HARD'];
    diffs.forEach((diff, idx) => {
      const btnX = GAME_WIDTH / 2 - 80 + idx * 80;
      const isActive = saveSystem.getDifficulty() === diff;
      const bgColor = isActive ? COLORS.SUCCESS_GREEN : 0x475569;
      const container = this.add.container(btnX, 260);
      const btnBg = this.add.graphics();
      btnBg.fillStyle(bgColor, 1);
      btnBg.fillRoundedRect(-30, -15, 60, 30, 12);
      container.add(btnBg);
      const txt = this.add.text(0, 0, diff[0], {
        fontFamily: FONTS.BODY,
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      container.add(txt);
      const hitBox = this.add.graphics();
      hitBox.fillStyle(0x000000, 0);
      hitBox.fillRoundedRect(-30, -15, 60, 30, 12);
      hitBox.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(-30, -15, 60, 30),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true,
      });
      container.add(hitBox);

      let isPressed = false;
      hitBox.on('pointerdown', () => {
        isPressed = true;
      });

      hitBox.on('pointerup', () => {
        if (isPressed) {
          saveSystem.setDifficulty(diff);
          this.scene.restart();
        }
        isPressed = false;
      });

      hitBox.on('pointerupoutside', () => {
        isPressed = false;
      });
    });

    // 6. Controls Help Section (moved down)
    this.createControlsHelp(GAME_WIDTH / 2, 300);
  }

  private createToggleRow(
    centerX: number,
    y: number,
    label: string,
    initialValue: boolean,
    onToggle: (val: boolean) => void
  ): void {
    // Label text
    this.add.text(centerX - 220, y, label, {
      fontFamily: FONTS.BODY,
      fontSize: '20px',
      color: COLORS_STR.WHITE,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    // Interactive Toggle button pill
    const btnWidth = 100;
    const btnHeight = 36;
    const btnX = centerX + 170;
    const container = this.add.container(btnX, y);

    let state = initialValue;

    const bg = this.add.graphics();
    const updateButtonGfx = () => {
      bg.clear();
      bg.fillStyle(state ? COLORS.SUCCESS_GREEN : 0x475569, 1);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 18);
      bg.lineStyle(2, 0xffffff, 0.4);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 18);
    };
    updateButtonGfx();
    container.add(bg);

    const text = this.add.text(0, 0, state ? 'ON' : 'OFF', {
      fontFamily: FONTS.BODY,
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(text);

    container.setSize(btnWidth, btnHeight);
    const hitBox = this.add.graphics();
    hitBox.fillStyle(0x000000, 0);
    hitBox.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 18);
    hitBox.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
    });
    container.add(hitBox);

    let isPressed = false;
    hitBox.on('pointerdown', () => {
      isPressed = true;
    });

    hitBox.on('pointerup', () => {
      if (!isPressed) {
        return;
      }
      isPressed = false;

      state = !state;
      text.setText(state ? 'ON' : 'OFF');
      updateButtonGfx();

      this.tweens.add({
        targets: container,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 80,
        yoyo: true,
        ease: 'Quad.easeInOut',
      });

      onToggle(state);
    });

    hitBox.on('pointerupoutside', () => {
      isPressed = false;
    });

    hitBox.on('pointerover', () => {
      container.setScale(1.05);
    });

    hitBox.on('pointerout', () => {
      container.setScale(1.0);
    });
  }

  private createControlsHelp(centerX: number, startY: number): void {
    this.add.text(centerX, startY, 'CONTROLS', {
      fontFamily: FONTS.HEADING,
      fontSize: '20px',
      color: COLORS_STR.NEON_CYAN,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const controls = [
      { action: 'Move Left / Right', key: 'A / D  or  ← / →' },
      { action: 'Flip Gravity', key: 'SPACE  or  ↑ / ↓' },
      { action: 'Restart Level', key: 'R' },
      { action: 'Pause Game', key: 'ESC  or  P' },
      { action: 'Touch Controls', key: 'On-Screen Buttons' },
    ];

    const rowStartY = startY + 28;
    const rowHeight = 32;

    controls.forEach((ctrl, idx) => {
      const rowY = rowStartY + idx * rowHeight;

      // Action name
      this.add.text(centerX - 220, rowY, ctrl.action, {
        fontFamily: FONTS.BODY,
        fontSize: '15px',
        color: '#94a3b8',
      }).setOrigin(0, 0.5);

      // Key badge background
      const badgeText = this.add.text(centerX + 220, rowY, ctrl.key, {
        fontFamily: FONTS.BODY,
        fontSize: '14px',
        color: COLORS_STR.WHITE,
        fontStyle: 'bold',
        backgroundColor: '#1e293b',
        padding: { x: 10, y: 4 },
      }).setOrigin(1, 0.5);

      // Subtle rounded border around badge
      const bounds = badgeText.getBounds();
      const badgeGfx = this.add.graphics();
      badgeGfx.lineStyle(1, 0x475569, 0.8);
      badgeGfx.strokeRoundedRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4, 6);
    });
  }
}
