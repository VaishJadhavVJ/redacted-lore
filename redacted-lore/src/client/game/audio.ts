// src/client/game/audio.ts

// Paper & Ink Audio Engine
// Uses Web Audio API to synthesize organic paper sounds without MP3 files.

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playSound = (type: 'page-turn' | 'tape' | 'error' | 'click') => {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  // Create a noise buffer for paper textures
  const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // White noise
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = audioCtx.createBiquadFilter();
  const noiseGain = audioCtx.createGain();

  // --- SOUND PROFILES ---

  if (type === 'page-turn') {
    // Sliding paper sound (Filtered Noise Sweep)
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, t);
    noiseFilter.frequency.linearRampToValueAtTime(1000, t + 0.1);
    
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(t);
    noise.stop(t + 0.3);
  } 

  else if (type === 'tape') {
    // Sticker peeling sound (High pitched rip)
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2000, t);
    
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(t);
    noise.stop(t + 0.1);
  }

  else if (type === 'error') {
    // Dull thud (Low sine wave)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
    
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }
};