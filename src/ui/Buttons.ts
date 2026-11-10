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

  const shadow = scene.add.graphics();
  shadow.fillStyle(0x020617, 0.38);
  shadow.fillRoundedRect(-halfW + 7, -halfH + 7, width, height, radius);
  container.add(shadow);

  const bg = scene.add.graphics();
  const baseColor = Phaser.Display.Color.IntegerToColor(color);
  const darker = Phaser.Display.Color.ValueToColor(baseColor.color).darken(18);
  const lighter = Phaser.Display.Color.ValueToColor(baseColor.color).brighten(34);

  bg.fillStyle(darker.color, 1);
  bg.fillRoundedRect(-halfW, -halfH, width, height, radius);
  bg.fillStyle(lighter.color, 0.15);
  bg.fillRoundedRect(-halfW + 2, -halfH + 2, width - 4, height * 0.58, radius);
  bg.fillStyle(Phaser.Display.Color.ValueToColor(baseColor.color).brighten(88).color, 0.2);
  bg.fillRoundedRect(-halfW + 10, -halfH + 6, width - 20, 8, 5);

  const strokeColor = options?.strokeColor ?? Phaser.Display.Color.ValueToColor(baseColor.color).brighten(42).color;
  bg.lineStyle(options?.strokeWidth ?? 2, strokeColor, 1);
  bg.strokeRoundedRect(-halfW, -halfH, width, height, radius);
  container.add(bg);

  const fontSizeStr = typeof options?.fontSize === 'number'
    ? `${options.fontSize}px`
    : (options?.fontSize ?? '22px');
  const label = scene.add.text(0, 0, text, {
    fontFamily: options?.fontFamily ?? FONTS.BODY,
    fontSize: fontSizeStr,
    color: options?.fontColor ?? '#ffffff',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#0f172a',
    strokeThickness: 3,
    letterSpacing: 0.5,
  }).setOrigin(0.5);
  label.setShadow(0, 2, '#000000', 0.4, true);
  container.add(label);

  container.setSize(width, height);
  const hitRect = new Phaser.Geom.Rectangle(-halfW, -halfH, width, height);
  const hitZone = scene.add.rectangle(0, 0, width, height, 0x000000, 0);
  hitZone.setOrigin(0.5);
  hitZone.setInteractive({
    hitArea: hitRect,
    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    useHandCursor: true,
  });
  container.add(hitZone);

  let isHovered = false;
  let isPressed = false;

  const resetScale = (): void => {
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: isHovered ? 1.05 : 1.0,
      scaleY: isHovered ? 1.05 : 1.0,
      duration: 120,
      ease: 'Back.easeOut',
    });
  };

  const handlePointerOver = () => {
    isHovered = true;
    if (isPressed) return;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 120,
      ease: 'Cubic.easeOut',
    });
  };

  const handlePointerOut = () => {
    isHovered = false;
    if (!isPressed) {
      scene.tweens.killTweensOf(container);
      scene.tweens.add({
        targets: container,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 120,
        ease: 'Cubic.easeOut',
      });
    }
  };

  const handlePointerDown = () => {
    isPressed = true;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 0.96,
      scaleY: 0.96,
      duration: 60,
      ease: 'Quad.easeOut',
    });
  };

  const handlePointerUp = () => {
    if (isPressed) {
      isPressed = false;
      callback();
      resetScale();
      return;
    }
    isPressed = false;
    resetScale();
  };

  const handlePointerUpOutside = () => {
    isPressed = false;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: isHovered ? 1.05 : 1.0,
      scaleY: isHovered ? 1.05 : 1.0,
      duration: 120,
      ease: 'Back.easeOut',
    });
  };

  hitZone.on('pointerover', handlePointerOver);
  hitZone.on('pointerout', handlePointerOut);
  hitZone.on('pointerdown', handlePointerDown);
  hitZone.on('pointerup', handlePointerUp);
  hitZone.on('pointerupoutside', handlePointerUpOutside);

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

  const shadow = scene.add.graphics();
  shadow.fillStyle(0x000000, 0.18);
  shadow.fillCircle(5, 5, radius);
  container.add(shadow);

  const bg = scene.add.graphics();
  bg.fillStyle(Phaser.Display.Color.IntegerToColor(color).darken(12).color, 1);
  bg.fillCircle(0, 0, radius);
  bg.fillStyle(Phaser.Display.Color.IntegerToColor(color).brighten(30).color, 0.28);
  bg.fillCircle(0, 0, radius * 0.72);
  const strokeColor = options?.strokeColor ?? Phaser.Display.Color.IntegerToColor(color).brighten(45).color;
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
    stroke: '#0f172a',
    strokeThickness: 3,
  }).setOrigin(0.5);
  iconText.setShadow(0, 2, '#000000', 0.35, true);
  container.add(iconText);

  container.setSize(size, size);
  const hitCircle = new Phaser.Geom.Circle(0, 0, radius);
  container.setInteractive({
    hitArea: hitCircle,
    hitAreaCallback: Phaser.Geom.Circle.Contains,
    useHandCursor: true,
  });
  bg.setInteractive({
    hitArea: hitCircle,
    hitAreaCallback: Phaser.Geom.Circle.Contains,
    useHandCursor: true,
  });

  let isHovered = false;
  let isPressed = false;

  const resetScale = (): void => {
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: isHovered ? 1.08 : 1.0,
      scaleY: isHovered ? 1.08 : 1.0,
      duration: 100,
      ease: 'Back.easeOut',
    });
  };

  const isPointerInside = (pointer: Phaser.Input.Pointer): boolean => {
    const bounds = new Phaser.Geom.Circle(0, 0, radius);
    return Phaser.Geom.Circle.Contains(bounds, pointer.x - container.x, pointer.y - container.y);
  };

  const handlePointerOver = (pointer: Phaser.Input.Pointer) => {
    if (!isPointerInside(pointer)) return;
    isHovered = true;
    if (isPressed) return;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 80,
      ease: 'Quad.easeOut',
    });
  };

  const handlePointerOut = (pointer?: Phaser.Input.Pointer) => {
    if (pointer && isPointerInside(pointer)) return;
    isHovered = false;
    if (!isPressed) {
      scene.tweens.killTweensOf(container);
      scene.tweens.add({
        targets: container,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 100,
        ease: 'Quad.easeOut',
      });
    }
  };

  const handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    if (!isPointerInside(pointer)) return;
    isPressed = true;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: 0.92,
      scaleY: 0.92,
      duration: 50,
      ease: 'Quad.easeOut',
    });
  };

  const handlePointerUp = (pointer: Phaser.Input.Pointer) => {
    if (isPressed && isPointerInside(pointer)) {
      callback();
    }
    isPressed = false;
    resetScale();
  };

  const handlePointerUpOutside = (pointer?: Phaser.Input.Pointer) => {
    if (pointer && isPointerInside(pointer)) return;
    isPressed = false;
    scene.tweens.killTweensOf(container);
    scene.tweens.add({
      targets: container,
      scaleX: isHovered ? 1.08 : 1.0,
      scaleY: isHovered ? 1.08 : 1.0,
      duration: 100,
      ease: 'Back.easeOut',
    });
  };

  bg.on('pointerover', handlePointerOver);
  bg.on('pointerout', handlePointerOut);
  bg.on('pointerdown', handlePointerDown);
  bg.on('pointerup', handlePointerUp);
  bg.on('pointerupoutside', handlePointerUpOutside);

  container.on('pointerover', handlePointerOver);
  container.on('pointerout', handlePointerOut);
  container.on('pointerdown', handlePointerDown);
  container.on('pointerup', handlePointerUp);
  container.on('pointerupoutside', handlePointerUpOutside);

  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    if (isPointerInside(pointer)) {
      handlePointerDown(pointer);
    }
  });
  scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    if (isPressed && isPointerInside(pointer)) {
      handlePointerUp(pointer);
    }
  });
  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    if (isPointerInside(pointer)) {
      handlePointerOver(pointer);
    } else {
      handlePointerOut(pointer);
    }
  });

  return container;
}
