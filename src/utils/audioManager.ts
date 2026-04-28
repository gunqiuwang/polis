type BgmType = 'menu' | 'game' | 'win';

interface AudioManagerState {
  enabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
}

class AudioManager {
  private bgmVolume = 0.5;
  private sfxVolume = 0.7;
  private enabled = false;
  private audioContext: AudioContext | null = null;
  private currentBgmNodes: OscillatorNode[] = [];
  private bgmGainNode: GainNode | null = null;
  private isPlaying = false;

  constructor() {
    this.loadSettings();
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.audioContext;
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('polis-audio-settings');
      if (saved) {
        const settings: AudioManagerState = JSON.parse(saved);
        this.enabled = settings.enabled;
        this.bgmVolume = settings.bgmVolume;
        this.sfxVolume = settings.sfxVolume;
      }
    } catch {
      // Ignore
    }
  }

  private saveSettings() {
    try {
      const settings: AudioManagerState = {
        enabled: this.enabled,
        bgmVolume: this.bgmVolume,
        sfxVolume: this.sfxVolume,
      };
      localStorage.setItem('polis-audio-settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }

  enable() {
    this.enabled = true;
    this.saveSettings();
  }

  disable() {
    this.enabled = false;
    this.stopBgm();
    this.saveSettings();
  }

  isEnabled() {
    return this.enabled;
  }

  setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = this.bgmVolume * 0.3;
    }
    this.saveSettings();
  }

  getBgmVolume() {
    return this.bgmVolume;
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  getSfxVolume() {
    return this.sfxVolume;
  }

  // Generate synthesized sound effects
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private playArpeggio(notes: number[], duration: number, type: OscillatorType = 'sine') {
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * (duration / notes.length);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration / notes.length);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration / notes.length);
    });
  }

  // Sound effects
  playClick() {
    this.playTone(800, 0.08, 'sine', 0.2);
  }

  playExplore() {
    this.playArpeggio([523, 659, 784], 0.3, 'triangle');
  }

  playBuild() {
    this.playArpeggio([392, 523, 659, 784], 0.4, 'triangle');
    setTimeout(() => this.playTone(1047, 0.2, 'sine', 0.3), 150);
  }

  playCollect() {
    this.playArpeggio([523, 587, 659, 784, 880], 0.5, 'sine');
  }

  playStar() {
    this.playTone(1319, 0.15, 'sine', 0.4);
    setTimeout(() => this.playTone(1568, 0.15, 'sine', 0.3), 100);
    setTimeout(() => this.playTone(1760, 0.2, 'sine', 0.25), 200);
  }

  playGod() {
    this.playArpeggio([659, 784, 880, 1047, 1175, 1319], 0.6, 'triangle');
  }

  playVictory() {
    this.playArpeggio([523, 659, 784, 1047, 1319, 1568], 0.8, 'triangle');
    setTimeout(() => this.playArpeggio([1047, 1319, 1568, 2093], 0.8, 'triangle'), 400);
  }

  playError() {
    this.playTone(200, 0.15, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.25), 100);
  }

  // Background music using Web Audio API
  playBgm(type: BgmType) {
    const ctx = this.getAudioContext();
    if (!ctx || !this.enabled) return;

    this.stopBgm();

    this.bgmGainNode = ctx.createGain();
    this.bgmGainNode.gain.value = this.bgmVolume * 0.3;
    this.bgmGainNode.connect(ctx.destination);

    this.isPlaying = true;

    if (type === 'win') {
      this.playVictoryBgm(ctx);
    } else {
      this.playLoopBgm(ctx, type);
    }
  }

  private playLoopBgm(ctx: AudioContext, type: BgmType) {
    // C major scale notes for magical Greek feel
    const scale = [523, 587, 659, 698, 784, 880, 988, 1047];
    const melodyPattern = type === 'menu'
      ? [0, 2, 4, 5, 4, 2, 0, 2, 4, 7, 5, 4, 2, 0]
      : [4, 5, 7, 5, 4, 2, 0, 2, 4, 2, 0, 2, 4, 5];

    const bassPattern = [0, 0, 2, 2, 4, 4, 2, 2];

    let step = 0;
    const bpm = type === 'menu' ? 100 : 90;
    const beatDuration = 60 / bpm;

    const playStep = () => {
      if (!this.isPlaying || !this.enabled) return;

      // Melody
      const melodyNote = scale[melodyPattern[step % melodyPattern.length]];
      this.playBgmNote(ctx, melodyNote, beatDuration * 0.8, 'triangle', 0.15);

      // Bass harmony
      const bassNote = scale[bassPattern[step % bassPattern.length]] / 2;
      this.playBgmNote(ctx, bassNote, beatDuration * 1.5, 'sine', 0.1);

      // Occasional bell-like accent
      if (step % 4 === 0) {
        this.playBgmNote(ctx, scale[7], beatDuration * 0.3, 'sine', 0.08);
      }

      step++;
      setTimeout(playStep, beatDuration * 1000);
    };

    playStep();
  }

  private playVictoryBgm(ctx: AudioContext) {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];

    melody.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.isPlaying || !this.enabled) return;
        this.playBgmNote(ctx, freq, 0.4, 'triangle', 0.2);
        this.playBgmNote(ctx, freq * 1.5, 0.4, 'sine', 0.1);
      }, i * 300);
    });

    // Loop after melody
    setTimeout(() => {
      if (this.isPlaying && this.enabled) {
        this.playVictoryBgm(ctx);
      }
    }, melody.length * 300);
  }

  private playBgmNote(ctx: AudioContext, freq: number, duration: number, type: OscillatorType, volume: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * this.bgmVolume, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(volume * this.bgmVolume, ctx.currentTime + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGainNode!);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  stopBgm() {
    this.isPlaying = false;
    this.currentBgmNodes.forEach(node => {
      try { node.stop(); } catch { /* ignore */ }
    });
    this.currentBgmNodes = [];
  }

  pauseBgm() {
    this.isPlaying = false;
  }

  resumeBgm() {
    if (this.enabled && this.isPlaying) {
      // Will restart on next playBgm call
    }
  }
}

export const audioManager = new AudioManager();
