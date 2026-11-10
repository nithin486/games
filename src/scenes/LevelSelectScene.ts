import Phaser from 'phaser';
import { ASSETS, LEVELS_PER_WORLD, SCENES, TOTAL_LEVELS, WORLD_NAMES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH, WORLD_THEMES } from '../config/gameConfig';
import saveSystem from '../systems/SaveSystem';
import { createIconButton } from '../ui/Buttons';

export class LevelSelectScene extends Phaser.Scene {
  private currentWorldIndex: number = 0;
  private tabsContainer!: Phaser.GameObjects.Container;
  private gridContainer!: Phaser.GameObjects.Container;
  private starsText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENES.LEVEL_SELECT);
  }

  create(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x120b22, 0x120b22, 0x091624, 0x091624, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const glowA = this.add.graphics();
    glowA.fillStyle(0x7c3aed, 0.17);
    glowA.fillCircle(220, 160, 220);
    const glowB = this.add.graphics();
    glowB.fillStyle(0x06b6d4, 0.12);
    glowB.fillCircle(760, 200, 210);

    const panel = this.add.graphics();
    panel.fillStyle(0x0f172a, 0.28);
    panel.fillRoundedRect(80, 130, GAME_WIDTH - 160, 330, 28);
    panel.lineStyle(2, 0x7dd3fc, 0.35);
    panel.strokeRoundedRect(80, 130, GAME_WIDTH - 160, 330, 28);

    this.createBackgroundClouds();

    this.add.text(GAME_WIDTH / 2, 45, 'SELECT LEVEL', {
      fontFamily: FONTS.HEADING,
      fontSize: '36px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 5,
    }).setOrigin(0.5);

    // 5. Back Button (top-left)
    createIconButton(
      this,
      50,
      45,
      40,
      '←',
      0x1e293b,
      () => {
        this.scene.start(SCENES.MENU);
      },
      { fontSize: '20px' }
    );

    // 6. Total Stars Counter (top-right)
    const starsContainer = this.add.container(GAME_WIDTH - 100, 45);
    const starIcon = this.add.image(-20, 0, ASSETS.STAR).setScale(0.85);
    const totalStars = saveSystem.getTotalStars();
    this.starsText = this.add.text(4, 0, `${totalStars}/${TOTAL_LEVELS * 3}`, {
      fontFamily: FONTS.BODY,
      fontSize: '17px',
      color: COLORS_STR.GOLD,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    starsContainer.add([starIcon, this.starsText]);

    // Containers for dynamic content
    this.tabsContainer = this.add.container(0, 0);
    this.gridContainer = this.add.container(0, 0);

    // Default world tab based on highest unlocked level
    const unlockedLevel = saveSystem.getUnlockedLevel() || 1;
    this.currentWorldIndex = this.getWorldIndexForLevel(unlockedLevel);

    // 3. Render World Tabs
    this.renderWorldTabs();

    // 4. Render Level Grid
    this.renderLevelGrid();
  }

  private getWorldIndexForLevel(levelId: number): number {
    if (levelId <= 10) return 0;
    if (levelId <= 15) return 1;
    if (levelId <= 20) return 2;
    if (levelId <= 25) return 3;
    return 4;
  }

  private renderWorldTabs(): void {
    this.tabsContainer.removeAll(true);

    const tabWidth = 166;
    const tabHeight = 38;
    const spacing = 12;
    const totalW = 5 * tabWidth + 4 * spacing;
    const startX = (GAME_WIDTH - totalW) / 2 + tabWidth / 2;
    const tabY = 105;

    for (let i = 0; i < WORLD_NAMES.length; i++) {
      const x = startX + i * (tabWidth + spacing);
      const isActive = i === this.currentWorldIndex;
      const theme = WORLD_THEMES[i];
      const accent = theme?.accent ?? COLORS.PRIMARY_PURPLE;

      const tab = this.add.container(x, tabY);

      const bg = this.add.graphics();
      bg.fillStyle(isActive ? accent : 0x111827, 1);
      bg.fillRoundedRect(-tabWidth / 2, -tabHeight / 2, tabWidth, tabHeight, 10);
      bg.fillStyle(isActive ? 0xffffff : 0x334155, 0.12);
      bg.fillRoundedRect(-tabWidth / 2 + 4, -tabHeight / 2 + 3, tabWidth - 8, tabHeight * 0.4, 8);
      if (isActive) {
        bg.lineStyle(2, 0xffffff, 0.9);
        bg.strokeRoundedRect(-tabWidth / 2, -tabHeight / 2, tabWidth, tabHeight, 10);
      } else {
        bg.lineStyle(1, 0x475569, 0.8);
        bg.strokeRoundedRect(-tabWidth / 2, -tabHeight / 2, tabWidth, tabHeight, 10);
      }
      tab.add(bg);

      // Short label: W1: Islands etc.
      const shortTitle = `W${i + 1}: ${this.getShortWorldName(i)}`;
      const label = this.add.text(0, 0, shortTitle, {
        fontFamily: FONTS.BODY,
        fontSize: '14px',
        color: isActive ? '#ffffff' : '#94a3b8',
        fontStyle: isActive ? 'bold' : 'normal',
      }).setOrigin(0.5);
      tab.add(label);

      tab.setSize(tabWidth, tabHeight);
      const hitBox = this.add.graphics();
      hitBox.fillStyle(0x000000, 0);
      hitBox.fillRoundedRect(-tabWidth / 2, -tabHeight / 2, tabWidth, tabHeight, 10);
      hitBox.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(-tabWidth / 2, -tabHeight / 2, tabWidth, tabHeight),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true,
      });
      tab.add(hitBox);

      const targetIdx = i;
      let isPressed = false;

      hitBox.on('pointerdown', () => {
        isPressed = true;
      });

      hitBox.on('pointerup', () => {
        if (isPressed && this.currentWorldIndex !== targetIdx) {
          this.currentWorldIndex = targetIdx;
          this.renderWorldTabs();
          this.renderLevelGrid();
        }
        isPressed = false;
      });

      hitBox.on('pointerupoutside', () => {
        isPressed = false;
      });

      this.tabsContainer.add(tab);
    }
  }

  private getShortWorldName(idx: number): string {
    const shorts = ['Islands', 'Heights', 'Moving', 'Portal', 'Gravity'];
    return shorts[idx] ?? `World ${idx + 1}`;
  }

  private renderLevelGrid(): void {
    this.gridContainer.removeAll(true);

    const unlockedLevel = saveSystem.getUnlockedLevel() || 1;
    const worldIndex = this.currentWorldIndex;
    const theme = WORLD_THEMES[worldIndex];
    const accent = theme?.accent ?? COLORS.PRIMARY_PURPLE;

    // Calculate level start ID and count for this world
    let startLevelId = 1;
    for (let i = 0; i < worldIndex; i++) {
      startLevelId += LEVELS_PER_WORLD[i];
    }
    const levelCount = LEVELS_PER_WORLD[worldIndex];

    const cellSize = 88;
    const colSpacing = 24;
    const rowSpacing = 24;
    const cols = 5;

    const gridTotalWidth = cols * cellSize + (cols - 1) * colSpacing;
    const gridStartX = (GAME_WIDTH - gridTotalWidth) / 2 + cellSize / 2;
    const gridStartY = levelCount > 5 ? 200 : 260;

    for (let i = 0; i < levelCount; i++) {
      const levelId = startLevelId + i;
      const col = i % cols;
      const row = Math.floor(i / cols);

      const cellX = gridStartX + col * (cellSize + colSpacing);
      const cellY = gridStartY + row * (cellSize + rowSpacing);

      const isUnlocked = levelId <= unlockedLevel;
      const starsEarned = saveSystem.getStars(levelId);

      const cell = this.createLevelCell(cellX, cellY, cellSize, levelId, isUnlocked, starsEarned, accent);
      this.gridContainer.add(cell);
    }

    // Grid entrance animation
    this.gridContainer.setAlpha(0);
    this.gridContainer.setY(15);
    this.tweens.add({
      targets: this.gridContainer,
      alpha: 1,
      y: 0,
      duration: 250,
      ease: 'Quad.easeOut',
    });
  }

  private createLevelCell(
    x: number,
    y: number,
    size: number,
    levelId: number,
    isUnlocked: boolean,
    starsEarned: number,
    accentColor: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const half = size / 2;

    const bg = this.add.graphics();

    if (isUnlocked) {
      bg.fillStyle(0x111827, 0.96);
      bg.fillRoundedRect(-half, -half, size, size, 14);
      bg.fillStyle(accentColor, 0.14);
      bg.fillRoundedRect(-half + 2, -half + 2, size - 4, size - 4, 12);
      bg.lineStyle(2, accentColor, 0.9);
      bg.strokeRoundedRect(-half, -half, size, size, 14);
      container.add(bg);

      // Level number
      const numText = this.add.text(0, -10, `${levelId}`, {
        fontFamily: FONTS.HEADING,
        fontSize: '28px',
        color: COLORS_STR.WHITE,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      container.add(numText);

      // 3 mini star icons at bottom
      const starOffsets = [-18, 0, 18];
      const starY = 22;
      for (let s = 0; s < 3; s++) {
        const star = this.add.image(starOffsets[s], starY, ASSETS.STAR);
        star.setScale(0.48);
        if (s < starsEarned) {
          star.setTint(COLORS.GOLD);
          star.setAlpha(1);
        } else {
          star.setTint(0x475569);
          star.setAlpha(0.4);
        }
        container.add(star);
      }

      container.setSize(size, size);
      const hitBox = this.add.graphics();
      hitBox.fillStyle(0x000000, 0);
      hitBox.fillRoundedRect(-size / 2, -size / 2, size, size, 14);
      hitBox.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true,
      });
      container.add(hitBox);

      let isPressed = false;

      hitBox.on('pointerover', () => {
        if (isPressed) return;
        this.tweens.add({
          targets: container,
          scaleX: 1.08,
          scaleY: 1.08,
          duration: 100,
          ease: 'Quad.easeOut',
        });
      });

      hitBox.on('pointerout', () => {
        if (!isPressed) {
          this.tweens.add({
            targets: container,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 100,
            ease: 'Quad.easeOut',
          });
        }
      });

      hitBox.on('pointerdown', () => {
        isPressed = true;
        this.tweens.add({
          targets: container,
          scaleX: 0.94,
          scaleY: 0.94,
          duration: 80,
          ease: 'Quad.easeOut',
        });
      });

      hitBox.on('pointerup', () => {
        if (isPressed) {
          this.scene.start(SCENES.GAMEPLAY, { levelId });
        }
        isPressed = false;
      });

      hitBox.on('pointerupoutside', () => {
        isPressed = false;
        this.tweens.add({
          targets: container,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 100,
          ease: 'Quad.easeOut',
        });
      });
    } else {
      // Locked level cell
      bg.fillStyle(0x0f172a, 0.6);
      bg.fillRoundedRect(-half, -half, size, size, 14);
      bg.lineStyle(1.5, 0x334155, 0.5);
      bg.strokeRoundedRect(-half, -half, size, size, 14);
      container.add(bg);

      // Lock icon
      const lock = this.add.text(0, -6, '🔒', {
        fontSize: '22px',
      }).setOrigin(0.5);
      lock.setAlpha(0.5);
      container.add(lock);

      const numText = this.add.text(0, 20, `${levelId}`, {
        fontFamily: FONTS.BODY,
        fontSize: '13px',
        color: '#64748b',
      }).setOrigin(0.5);
      container.add(numText);
    }

    return container;
  }

  private createBackgroundClouds(): void {
    const cloudPositions = [
      { x: 120, y: 180, scale: 0.9, alpha: 0.15 },
      { x: 800, y: 220, scale: 1.1, alpha: 0.18 },
      { x: 450, y: 480, scale: 1.3, alpha: 0.12 },
    ];

    for (const pos of cloudPositions) {
      const cloud = this.add.image(pos.x, pos.y, ASSETS.CLOUD);
      cloud.setScale(pos.scale);
      cloud.setAlpha(pos.alpha);

      this.tweens.add({
        targets: cloud,
        x: pos.x + 30,
        duration: Phaser.Math.Between(6000, 10000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
