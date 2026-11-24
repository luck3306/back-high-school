const STORAGE_KEY = "back_high_school_audio_muted";

const TRACKS = {
  title: { step: 620, notes: [196, 247, 294, 330, 294, 247, 220, 262] },
  daily: { step: 430, notes: [262, 330, 392, 523, 392, 330, 294, 349] },
  romance: { step: 560, notes: [330, 392, 494, 587, 494, 392, 349, 440] },
  surprise: { step: 280, notes: [220, 262, 330, 392, 330, 262, 196, 247] },
  ending: { step: 760, notes: [262, 392, 330, 494, 440, 330, 294, 392] },
};

export class GameAudio {
  constructor() {
    this.context = null;
    this.master = null;
    this.timer = null;
    this.scene = "title";
    this.step = 0;
    this.muted = this.readMuted();
  }

  readMuted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  }

  saveMuted() {
    try {
      localStorage.setItem(STORAGE_KEY, this.muted ? "1" : "0");
    } catch {
      // 音频设置在隐私模式下仅保留在当前页面。
    }
  }

  init() {
    if (this.context) {
      if (this.context.state === "suspended") this.context.resume().catch(() => {});
      return true;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    try {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : 0.16;
      this.master.connect(this.context.destination);
      this.restart();
      return true;
    } catch {
      this.context = null;
      return false;
    }
  }

  isMuted() {
    return this.muted;
  }

  toggle() {
    this.muted = !this.muted;
    this.saveMuted();
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.16, this.context.currentTime, 0.03);
    }
    if (!this.muted) this.init();
    return this.muted;
  }

  setScene(scene) {
    const nextScene = TRACKS[scene] ? scene : "daily";
    if (this.scene === nextScene && this.timer) return;
    this.scene = nextScene;
    this.step = 0;
    if (this.context) this.restart();
  }

  restart() {
    clearInterval(this.timer);
    this.timer = null;
    if (!this.context || this.muted) return;
    this.playStep();
    const track = TRACKS[this.scene] || TRACKS.daily;
    this.timer = setInterval(() => this.playStep(), track.step);
  }

  playStep() {
    if (!this.context || !this.master || this.muted) return;
    const track = TRACKS[this.scene] || TRACKS.daily;
    const frequency = track.notes[this.step % track.notes.length];
    const now = this.context.currentTime;
    const duration = Math.max(0.18, (track.step / 1000) * 1.4);
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = this.scene === "surprise" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
    this.step += 1;
  }
}

export const gameAudio = new GameAudio();
