type WaveType = OscillatorType;

class AudioManager {
  private context?: AudioContext;
  private musicTimer?: number;
  private musicStep = 0;
  private muted = false;
  private readonly melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
  private readonly bass = [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 146.83, 146.83];

  startMusic(): void {
    const context = this.ensureContext();
    if (!context || this.musicTimer) {
      return;
    }

    this.musicTimer = window.setInterval(() => {
      const melodyNote = this.melody[this.musicStep % this.melody.length];
      const bassNote = this.bass[this.musicStep % this.bass.length];
      this.playTone(melodyNote, 0.12, 'square', 0.035);

      if (this.musicStep % 2 === 0) {
        this.playTone(bassNote, 0.16, 'triangle', 0.025);
      }

      this.musicStep += 1;
    }, 180);
  }

  toggleMute(): boolean {
    this.muted = !this.muted;

    if (this.muted && this.context) {
      void this.context.suspend();
    } else if (!this.muted) {
      const context = this.ensureContext();
      if (context?.state === 'suspended') {
        void context.resume();
      }
    }

    return this.muted;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  playMenuSelect(): void {
    this.playArpeggio([523.25, 659.25], 0.045, 'square', 0.05);
  }

  playJump(): void {
    this.playSweep(320, 580, 0.09, 'square', 0.055);
  }

  playLand(): void {
    this.playSweep(130, 80, 0.06, 'triangle', 0.035);
  }

  playCollectStar(): void {
    this.playArpeggio([784, 987.77, 1174.66], 0.04, 'square', 0.055);
  }

  playCollectShell(): void {
    this.playArpeggio([659.25, 880, 1318.51], 0.055, 'triangle', 0.06);
  }

  playPowerUse(): void {
    this.playSweep(440, 1108.73, 0.18, 'sawtooth', 0.04);
  }

  playEnemyStun(): void {
    this.playSweep(220, 110, 0.12, 'square', 0.05);
  }

  playDamage(): void {
    this.playSweep(196, 98, 0.2, 'sawtooth', 0.055);
  }

  playCheckpoint(): void {
    this.playArpeggio([392, 523.25, 783.99], 0.075, 'triangle', 0.06);
  }

  playGoalClear(): void {
    this.playArpeggio([523.25, 659.25, 783.99, 1046.5], 0.12, 'square', 0.07);
  }

  private playArpeggio(notes: number[], noteLength: number, wave: WaveType, gain: number): void {
    if (this.muted) {
      return;
    }

    notes.forEach((note, index) => {
      window.setTimeout(() => this.playTone(note, noteLength, wave, gain), index * noteLength * 1000);
    });
  }

  private playSweep(startFrequency: number, endFrequency: number, duration: number, wave: WaveType, gain: number): void {
    if (this.muted) {
      return;
    }

    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(startFrequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, context.currentTime + duration);
    envelope.gain.setValueAtTime(0.0001, context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(gain, context.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  private playTone(frequency: number, duration: number, wave: WaveType, gain: number): void {
    if (this.muted) {
      return;
    }

    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0.0001, context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(gain, context.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  private ensureContext(): AudioContext | undefined {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return undefined;
    }

    this.context ??= new AudioContextCtor();
    if (this.context.state === 'suspended') {
      void this.context.resume();
    }

    return this.context;
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const audioManager = new AudioManager();
