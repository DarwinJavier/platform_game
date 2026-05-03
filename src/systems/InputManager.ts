import Phaser from 'phaser';

export class InputManager {
  private readonly enterKey: Phaser.Input.Keyboard.Key;
  private readonly spaceKey: Phaser.Input.Keyboard.Key;
  private readonly shiftKey: Phaser.Input.Keyboard.Key;
  private readonly escapeKey: Phaser.Input.Keyboard.Key;
  private readonly leftKey: Phaser.Input.Keyboard.Key;
  private readonly rightKey: Phaser.Input.Keyboard.Key;
  private readonly aKey: Phaser.Input.Keyboard.Key;
  private readonly dKey: Phaser.Input.Keyboard.Key;
  private readonly eKey: Phaser.Input.Keyboard.Key;
  private readonly mKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.enterKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.escapeKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.leftKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.aKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.mKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  wasEnterPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.enterKey);
  }

  wasLeftPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.leftKey);
  }

  wasRightPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.rightKey);
  }

  wasEscapePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.escapeKey);
  }

  wasPowerPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.eKey);
  }

  wasMutePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.mKey);
  }

  getMovementState(): import('../types/game').PlayerInputState {
    return {
      left: this.leftKey.isDown || this.aKey.isDown,
      right: this.rightKey.isDown || this.dKey.isDown,
      jumpPressed: Phaser.Input.Keyboard.JustDown(this.spaceKey),
      run: this.shiftKey.isDown,
    };
  }
}
