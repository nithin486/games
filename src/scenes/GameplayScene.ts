import Phaser from 'phaser';
import {
  ASSETS,
  DEATH_RESTART_DELAY,
  DEPTH,
  EVENTS,
  LEVEL_TRANSITION_DELAY,
  SCENES,
} from '../config/constants';
import { GAME_HEIGHT, GAME_WIDTH, WORLD_THEMES } from '../config/gameConfig';
import { getWorldForLevel, LevelData } from '../config/types';
import { Collectible } from '../entities/Collectible';
import { createHazards } from '../entities/Hazard';
import { createPlatforms } from '../entities/Platform';
import { Player } from '../entities/Player';
import { Portal } from '../entities/Portal';
import { CollisionSystem } from '../systems/CollisionSystem';
import { GravitySystem } from '../systems/GravitySystem';
import { InputSystem } from '../systems/InputSystem';
import { getLevelData } from '../systems/LevelSystem';
import {
  deathEffect,
  gravityFlipEffect,
  portalActivateEffect,
} from '../systems/ParticleEffects';
import { saveSystem } from '../systems/SaveSystem';
import { calculateResult } from '../systems/ScoreSystem';
import { HUD } from '../ui/HUD';
import { TouchControls } from '../ui/TouchControls';

export class GameplayScene extends Phaser.Scene {
  public player!: Player;
  public platforms!: Phaser.Physics.Arcade.StaticGroup;
  public movingPlatforms!: Phaser.Physics.Arcade.StaticGroup;
  public movingWalls!: Phaser.Physics.Arcade.StaticGroup;
  public hazards!: Phaser.Physics.Arcade.StaticGroup;
  public collectible: Collectible | null = null;
  public portal!: Portal;
  public gravitySystem!: GravitySystem;
  public inputSystem!: InputSystem;
  public collisionSystem!: CollisionSystem;
  public hud!: HUD;
  public touchControls!: TouchControls;
  public levelData!: LevelData;
  public levelId: number = 1;
  public startTime: number = 0;
  public elapsedTime: number = 0;
  public isComplete: boolean = false;
  public isDead: boolean = false;
  public starCollected: boolean = false;
  public background!: Phaser.GameObjects.Graphics;

  constructor() {
    super(SCENES.GAMEPLAY);
  }

  public init(data: { levelId?: number }): void {
    this.levelId = data?.levelId || 1;
  }

  public create(): void {
    // 1. Get level data
    const data = getLevelData(this.levelId);
    if (!data) {
      this.scene.start(SCENES.MENU);
      return;
    }
    this.levelData = data;

    // 2. Set world bounds
    const worldW = this.levelData.worldWidth ?? GAME_WIDTH;
    const worldH = this.levelData.worldHeight ?? GAME_HEIGHT;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // 3. Draw background
    const worldIndex = getWorldForLevel(this.levelId);
    this.drawBackground(worldIndex, worldW, worldH);

    // 4. Add floating clouds
    this.createDecorations(worldW, worldH);

    // 5. Create platforms, moving platforms & hazards
    this.platforms = createPlatforms(this, this.levelData.platforms, worldIndex);
    this.hazards = createHazards(this, this.levelData.hazards);

    // 6. Create collectible & portal
    this.collectible = Collectible.create(this, this.levelData.collectible);
    this.portal = new Portal(this, this.levelData.exit.x, this.levelData.exit.y);

    // 7. Create player
    this.player = new Player(
      this,
      this.levelData.playerStart.x,
      this.levelData.playerStart.y
    );

    // 8. Create systems
    this.gravitySystem = new GravitySystem(this);
    this.inputSystem = new InputSystem(this);
    this.gravitySystem.reset(this.levelData.gravity);

    // 9. Setup collisions
    this.collisionSystem = new CollisionSystem(
      this,
      this.player,
      this.platforms,
      this.hazards,
      this.collectible,
      this.portal,
      this.movingPlatforms,
      this.movingWalls,
      this.levelData.portalPairs ?? []
    );
    this.collisionSystem.setupCollisions();

    // 10. Create HUD & Touch Controls
    this.hud = new HUD(this, this.levelId, this.levelData.name, this.levelData.flipTarget);
    this.touchControls = new TouchControls(this, this.inputSystem);

    // 11. Setup event listeners
    this.events.on(EVENTS.PLAYER_DEATH, this.handleDeath, this);
    this.events.on(EVENTS.STAR_COLLECTED, this.handleStarCollected, this);
    this.events.on(EVENTS.LEVEL_COMPLETE, this.handleLevelComplete, this);
    this.events.on(EVENTS.FLIP_COUNT_CHANGED, this.onFlipCountChanged, this);

    // 12. Reset state & timer
    this.isComplete = false;
    this.isDead = false;
    this.starCollected = false;
    this.startTime = this.time.now;
    this.elapsedTime = 0;

    // 13. Camera setup
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Clean up on scene shutdown
    this.events.once('shutdown', this.shutdown, this);
  }

  public override update(_time: number, delta: number): void {
    if (this.isComplete || this.isDead) return;

    this.gravitySystem.update(delta);
    this.inputSystem.update();
    const input = this.inputSystem.getState();

    // Handle horizontal movement
    if (input.left) {
      this.player.moveLeft();
    } else if (input.right) {
      this.player.moveRight();
    } else {
      this.player.stopMoving();
    }

    // Handle gravity flip
    if (input.flip && this.gravitySystem.canFlip()) {
      const success = this.gravitySystem.flip();
      if (success) {
        const direction = this.gravitySystem.getDirection();
        this.player.onGravityFlip(direction);
        gravityFlipEffect(this, direction);

        if (this.gravitySystem.getFlipCount() > this.levelData.flipTarget) {
          this.handleDeath();
        }
      }
    }

    // Handle restart
    if (input.restart) {
      this.restartLevel();
      return;
    }

    // Handle pause
    if (input.pause) {
      this.launchPause();
      return;
    }

    // Update timer
    this.elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
    this.hud.updateTime(this.elapsedTime);
    this.hud.updateChallengeStatus(this.getRunStatusLabel());

    this.player.update();
  }

  private onFlipCountChanged(count: number): void {
    if (this.hud) {
      this.hud.updateFlips(count);
    }
  }

  public handleDeath(): void {
    if (this.isDead) return;
    this.isDead = true;

    deathEffect(this, this.player.x, this.player.y);

    this.time.delayedCall(DEATH_RESTART_DELAY, () => {
      this.restartLevel();
    });
  }

  public handleStarCollected(): void {
    this.starCollected = true;
    if (this.hud) {
      this.hud.showStarCollected();
    }
  }

  private getRunStatusLabel(): string {
    const flips = this.gravitySystem.getFlipCount();
    const underFlipTarget = flips <= this.levelData.flipTarget;
    const underTimeTarget = this.elapsedTime <= this.levelData.timeTarget;

    if (underFlipTarget && underTimeTarget) return 'Perfect Route';
    if (underFlipTarget) return 'Clean Control';
    if (underTimeTarget) return 'Speed Rush';
    return 'Chaos Loop';
  }

  public handleLevelComplete(): void {
    if (this.isComplete) return;
    this.isComplete = true;

    this.player.body.setVelocity(0, 0);
    this.player.body.setAcceleration(0, 0);
    this.portal.activate();
    portalActivateEffect(this, this.portal.x, this.portal.y);

    const result = calculateResult(
      this.levelData,
      this.elapsedTime,
      this.gravitySystem.getFlipCount(),
      this.starCollected
    );

    saveSystem.unlockLevel(this.levelId + 1);
    saveSystem.setStars(this.levelId, result.stars);
    saveSystem.setBestScore(this.levelId, result.score);
    saveSystem.setBestTime(this.levelId, result.time);
    saveSystem.setBestFlips(this.levelId, result.flips);

    this.time.delayedCall(LEVEL_TRANSITION_DELAY, () => {
      this.scene.start(SCENES.LEVEL_COMPLETE, {
        result,
        levelData: this.levelData,
      });
    });
  }

  public restartLevel(): void {
    this.scene.restart({ levelId: this.levelId });
  }

  public launchPause(): void {
    this.scene.pause();
    this.scene.launch(SCENES.PAUSE, { gameScene: SCENES.GAMEPLAY });
  }

  private drawBackground(worldIndex: number, width: number, height: number): void {
    this.background = this.add.graphics();
    this.background.setDepth(DEPTH.BACKGROUND);
    this.background.setScrollFactor(0);

    const themeIndex = Math.max(0, Math.min(worldIndex, WORLD_THEMES.length - 1));
    const theme = WORLD_THEMES[themeIndex] ?? WORLD_THEMES[0];

    this.background.fillGradientStyle(
      theme.skyTop,
      theme.skyTop,
      theme.skyBottom,
      theme.skyBottom,
      1
    );
    this.background.fillRect(0, 0, width, height);

    const glowA = this.add.graphics();
    glowA.fillStyle(theme.accent, 0.12);
    glowA.fillCircle(width * 0.25, height * 0.25, 180);
    const glowB = this.add.graphics();
    glowB.fillStyle(0x67e8f9, 0.08);
    glowB.fillCircle(width * 0.76, height * 0.3, 200);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x020617, 0.18);
    vignette.fillRect(0, 0, width, height);
    vignette.setDepth(DEPTH.BACKGROUND + 1);
  }

  private createDecorations(worldW: number, worldH: number): void {
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
      const cX = Phaser.Math.Between(50, worldW - 50);
      const cY = Phaser.Math.Between(40, worldH - 100);

      if (this.textures.exists(ASSETS.CLOUD)) {
        const cloud = this.add.sprite(cX, cY, ASSETS.CLOUD);
        cloud.setDepth(DEPTH.CLOUDS);
        cloud.setAlpha(0.35);
        cloud.setScale(Phaser.Math.FloatBetween(0.6, 1.2));

        this.tweens.add({
          targets: cloud,
          x: cX + Phaser.Math.Between(-30, 30),
          duration: Phaser.Math.Between(4000, 7000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      } else {
        // Fallback procedural soft cloud puffs
        const cloudGfx = this.add.graphics();
        cloudGfx.setDepth(DEPTH.CLOUDS);
        cloudGfx.fillStyle(0xffffff, 0.08);
        cloudGfx.fillCircle(cX, cY, 30);
        cloudGfx.fillCircle(cX + 20, cY - 10, 25);
        cloudGfx.fillCircle(cX + 40, cY, 28);
      }
    }
  }

  private shutdown(): void {
    this.events.off(EVENTS.PLAYER_DEATH, this.handleDeath, this);
    this.events.off(EVENTS.STAR_COLLECTED, this.handleStarCollected, this);
    this.events.off(EVENTS.LEVEL_COMPLETE, this.handleLevelComplete, this);
    this.events.off(EVENTS.FLIP_COUNT_CHANGED, this.onFlipCountChanged, this);

    if (this.collisionSystem) {
      this.collisionSystem.destroy();
    }
    if (this.movingPlatforms) {
      this.movingPlatforms.destroy(true);
    }
    if (this.movingWalls) {
      this.movingWalls.destroy(true);
    }
    if (this.inputSystem) {
      this.inputSystem.destroy();
    }
    if (this.hud) {
      this.hud.destroy();
    }
    if (this.touchControls) {
      this.touchControls.destroy();
    }
  }
}
