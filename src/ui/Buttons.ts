import Phaser from 'phaser';
import { FONTS } from '../config/gameConfig';

export interface ButtonOptions {
  fontSize?: string | number;
  fontColor?: string;
  strokeColor?: number;
  strokeWidth?: number;
  radius?: number;
  fontFamily?: string;
  disabled?: boolean;
}

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  color: number,
  callback: () => void,
  options?: ButtonOptions
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const radius = options?.radius ?? 12;
  const halfW = width / 2;
  const halfH = height / 2;

  // Background
  const bg = scene.add.graphics();
  bg.fillStyle(color, 1);
  bg.fillRoundedRect(-halfW, -halfH, width, height, radius);
  const strokeColor = options?.strokeColor ?? Phaser.Display.Color.IntegerToColor(color).brighten(25).color;
  bg.lineStyle(options?.strokeWidth ?? 2, strokeColor, 1);
  bg.strokeRoundedRect(-halfW, -halfH, width, height, radius);
  container.add(bg);

  // Label
  const fontSizeStr = typeof options?.fontSize === 'number'
    ? `${options.fontSize}px`
    : (options?.fontSize ?? '22px');
  const label = scene.add.text(0, 0, text, {
    fontFamily: options?.fontFamily ?? FONTS.BODY,
    fontSize: fontSizeStr,
    color: options?.fontColor ?? '#ffffff',
    align: 'center',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  container.add(label);

  // Make the CONTAINER interactive (not a nested child)
  container.setSize(width, height);
  container.setInteractive({
    hitArea: new Phaser.Geom.Rectangle(-halfW, -halfH, width, height),
    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    useHandCursor: true,
  });

  let isHovered = false;

  container.on('pointerover', () => {
    isHovered = true;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 100,
      ease: 'Cubic.easeOut',
    });
  });

  container.on('pointerout', () => {
    isHovered = false;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 100,
      ease: 'Cubic.easeOut',
    });
  });

  container.on('pointerdown', () => {
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 0.94,
      scaleY: 0.94,
      duration: 50,
      ease: 'Quad.easeOut',
    });
  });

  container.on('pointerup', () => {
    callback();
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: isHovered ? 1.06 : 1.0,
      scaleY: isHovered ? 1.06 : 1.0,
      duration: 100,
      ease: 'Back.easeOut',
    });
  });

  return container;
}

export function createIconButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  icon: string,
  color: number,
  callback: () => void,
  options?: ButtonOptions
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const radius = size / 2;

  const bg = scene.add.graphics();
  bg.fillStyle(color, 1);
  bg.fillCircle(0, 0, radius);
  const strokeColor = options?.strokeColor ?? Phaser.Display.Color.IntegerToColor(color).brighten(30).color;
  bg.lineStyle(options?.strokeWidth ?? 2, strokeColor, 1);
  bg.strokeCircle(0, 0, radius);
  container.add(bg);

  const fontSizeStr = typeof options?.fontSize === 'number'
    ? `${options.fontSize}px`
    : (options?.fontSize ?? `${Math.round(size * 0.48)}px`);
  const iconText = scene.add.text(0, 0, icon, {
    fontFamily: options?.fontFamily ?? FONTS.BODY,
    fontSize: fontSizeStr,
    color: options?.fontColor ?? '#ffffff',
    align: 'center',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  container.add(iconText);

  container.setSize(size, size);
  container.setInteractive({
    hitArea: new Phaser.Geom.Circle(0, 0, radius),
    hitAreaCallback: Phaser.Geom.Circle.Contains,
    useHandCursor: true,
  });

  let isHovered = false;

  container.on('pointerover', () => {
    isHovered = true;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 80,
      ease: 'Quad.easeOut',
    });
  });

  container.on('pointerout', () => {
    isHovered = false;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 100,
      ease: 'Quad.easeOut',
    });
  });

  container.on('pointerdown', () => {
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 0.92,
      scaleY: 0.92,
      duration: 50,
      ease: 'Quad.easeOut',
    });
  });

  container.on('pointerup', () => {
    callback();
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: isHovered ? 1.08 : 1.0,
      scaleY: isHovered ? 1.08 : 1.0,
      duration: 100,
      ease: 'Back.easeOut',
    });
  });

  return container;
}
