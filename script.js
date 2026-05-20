const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioReady = false;
let playbackTimer = null;

const state = {
    bpm: 140,
    isPlaying: false,
    stepIndex: 0,
    metronome: true,
    masterVolume: 0.92,
    masterPan: 0,
    savedSessions: [],
    tracks: [
        { id: 1, name: 'Kick', instrument: 'drums', active: true, volume: 0.95, pattern: Array(16).fill(false), color: '#3b82f6' },
        { id: 2, name: 'Snare', instrument: 'drums', active: true, volume: 0.92, pattern: Array(16).fill(false), color: '#ef4444' },
        { id: 3, name: 'Hi-Hat', instrument: 'drums', active: true, volume: 0.88, pattern: Array(16).fill(false), color: '#fbbf24' },
        { id: 4, name: '808 Bass', instrument: 'bass', active: true, volume: 0.9, pattern: Array(16).fill(false), color: '#8b5cf6' },
        { id: 5, name: 'Synth Lead', instrument: 'synth', active: true, volume: 0.75, pattern: Array(16).fill(false), color: '#0ea5e9' },
        { id: 6, name: 'Vocal Chop', instrument: 'vocal', active: true, volume: 0.65, pattern: Array(16).fill(false), color: '#ec4899' }
    ],
    effects: {
        delay: 0.18,
        reverb: 0.22,
        filter: 1400,
        distortion: 0.05
    },
    sampleVoices: [
        '808 Kick',
        'Snare',
        'Hi-Hat',
        '808 Bass',
        'Synth Stab',
        'Vocal Chop',
        'Melody',
        'FX Sweep'
    ],
    selectedVoice: '808 Kick',
    sampleKits: [
        { title: 'Trap Kit', description: '808s, claps, hi-hats and vocal stabs.', preset: 'Trap' },
        { title: 'Vocal Kit', description: 'Chops, ad-libs, and cut-up textures.', preset: 'Future Bass' },
        { title: 'Synth Kit', description: 'Leads, pads, and ambient sweeps.', preset: 'Hybrid' },
        { title: 'FX Kit', description: 'Risers, impacts and transitions.', preset: 'Lo-Fi' }
    ]
};

const effectsChain = createEffectsChain();

window.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeSession();
    bindUIEvents();
});

window.addEventListener('click', () => {
    if (!audioReady) {
        audioContext.resume().then(() => {
            audioReady = true;
        });
    }
});

function createEffectsChain() {
    const masterGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();
    const distortion = audioContext.createWaveShaper();
    const dryGain = audioContext.createGain();
    const wetGain = audioContext.createGain();

    filter.type = 'lowpass';
    filter.frequency.value = state.effects.filter;

    delay.delayTime.value = state.effects.delay;
    feedback.gain.value = 0.4;

    distortion.curve = makeDistortionCurve(state.effects.distortion * 100);
    distortion.oversample = '4x';

    dryGain.gain.value = 1;
    wetGain.gain.value = state.effects.reverb;
    masterGain.gain.value = state.masterVolume;

    const panner = audioContext.createStereoPanner();

    filter.connect(distortion);
    distortion.connect(dryGain);
    distortion.connect(wetGain);
    wetGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);
    dryGain.connect(masterGain);
    masterGain.connect(panner);
    panner.connect(audioContext.destination);

    return { filter, delay, feedback, distortion, dryGain, wetGain, masterGain, panner };
}

function makeDistortionCurve(amount) {
    const n = 44100;
    const curve = new Float32Array(n);
    const k = typeof amount === 'number' ? amount : 50;
    const deg = Math.PI / 180;
    for (let i = 0; i < n; ++i) {
        const x = (i * 2) / n - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

function initializeUI() {
    renderTrackRows();
    renderPadGrid();
    renderSequencer();
    renderSampleLibrary();
    renderSavedSessions();
    updateDashboard();
    updateEffectsUI();
    updateMasterUI();
}

function bindUIEvents() {
    document.getElementById('bpmInput').addEventListener('input', (event) => {
        state.bpm = Number(event.target.value);
        updateDashboard();
    });

    document.getElementById('playBtn').addEventListener('click', startPlayback);
    document.getElementById('stopBtn').addEventListener('click', stopPlayback);
    document.getElementById('clearBtn').addEventListener('click', clearSequencer);
    document.getElementById('addLayerBtn').addEventListener('click', addLayer);
    document.getElementById('saveSessionBtn').addEventListener('click', saveSession);
    document.getElementById('savePresetBtn').addEventListener('click', saveSession);
    document.getElementById('clearSessionBtn').addEventListener('click', resetSession);
    document.getElementById('newSessionBtn').addEventListener('click', resetSession);
    document.getElementById('masterVolumeSlider').addEventListener('input', (event) => {
        state.masterVolume = Number(event.target.value);
        effectsChain.masterGain.gain.setValueAtTime(state.masterVolume, audioContext.currentTime);
        updateMasterUI();
    });
    document.getElementById('masterPanSlider').addEventListener('input', (event) => {
        state.masterPan = Number(event.target.value);
        effectsChain.panner.pan.setValueAtTime(state.masterPan, audioContext.currentTime);
        updateMasterUI();
    });
    document.querySelectorAll('.nav-item, .section-btn').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const section = item.dataset.section;
            if (!section) return;
            showSection(section);
            document.querySelectorAll('.nav-item, .section-btn').forEach((button) => button.classList.remove('active'));
            item.classList.add('active');
        });
    });
    document.getElementById('delaySlider').addEventListener('input', (event) => {
        state.effects.delay = Number(event.target.value);
        effectsChain.delay.delayTime.setValueAtTime(state.effects.delay, audioContext.currentTime);
        updateEffectsUI();
    });
    document.getElementById('reverbSlider').addEventListener('input', (event) => {
        state.effects.reverb = Number(event.target.value);
        effectsChain.wetGain.gain.setValueAtTime(state.effects.reverb, audioContext.currentTime);
        updateEffectsUI();
    });
    document.getElementById('filterSlider').addEventListener('input', (event) => {
        state.effects.filter = Number(event.target.value);
        effectsChain.filter.frequency.setValueAtTime(state.effects.filter, audioContext.currentTime);
        updateEffectsUI();
    });
    document.getElementById('distortionSlider').addEventListener('input', (event) => {
        state.effects.distortion = Number(event.target.value);
        effectsChain.distortion.curve = makeDistortionCurve(state.effects.distortion * 100);
        updateEffectsUI();
    });
    document.getElementById('toggleMetronomeBtn').addEventListener('click', toggleMetronome);
    document.getElementById('randomLayerBtn').addEventListener('click', randomizeLayer);

    document.querySelectorAll('.preset-buttons button').forEach((button) => {
        button.addEventListener('click', () => applyPreset(button.dataset.preset));
    });
}

function initializeSession() {
    const saved = localStorage.getItem('fourTuneSession');
    const savedList = localStorage.getItem('fourTuneSavedSessions');
    if (saved) {
        const loaded = JSON.parse(saved);
        state.bpm = loaded.bpm || state.bpm;
        state.tracks = loaded.tracks || state.tracks;
        state.effects = loaded.effects || state.effects;
        state.metronome = loaded.metronome ?? state.metronome;
    }
    if (savedList) {
        state.savedSessions = JSON.parse(savedList);
    }
    document.getElementById('bpmInput').value = state.bpm;
    document.getElementById('masterVolumeSlider').value = state.masterVolume;
    document.getElementById('masterPanSlider').value = state.masterPan;
    effectsChain.masterGain.gain.setValueAtTime(state.masterVolume, audioContext.currentTime);
    effectsChain.panner.pan.setValueAtTime(state.masterPan, audioContext.currentTime);
    renderTrackRows();
    renderSequencer();
    updateEffectsUI();
    updateMasterUI();
    renderSavedSessions();
}

function renderTrackRows() {
    const container = document.getElementById('trackRows');
    container.innerHTML = '';

    state.tracks.forEach((track) => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <div class="track-meta">
                <strong>${track.name}</strong>
                <label>
                    <span>Voice</span>
                    <select data-track-id="${track.id}" class="track-instrument">
                        <option value="drums">Drums</option>
                        <option value="bass">808 Bass</option>
                        <option value="synth">Synth Lead</option>
                        <option value="vocal">Vocal Chop</option>
                        <option value="keys">Keys</option>
                        <option value="fx">FX Layer</option>
                    </select>
                </label>
            </div>
            <div class="track-controls">
                <label class="track-switch">
                    <input type="checkbox" data-track-id="${track.id}" class="track-active" ${track.active ? 'checked' : ''}>
                    Active
                </label>
                <label>
                    Volume
                    <input type="range" min="0" max="1" step="0.01" value="${track.volume}" data-track-id="${track.id}" class="track-volume">
                </label>
            </div>
        `;

        container.appendChild(row);
    });

    document.querySelectorAll('.track-instrument').forEach((select) => {
        select.value = state.tracks.find((track) => track.id === Number(select.dataset.trackId)).instrument;
        select.addEventListener('change', (event) => {
            const track = state.tracks.find((track) => track.id === Number(event.target.dataset.trackId));
            track.instrument = event.target.value;
            track.name = instrumentLabel(track.instrument, track.id);
            renderTrackRows();
            renderSequencer();
        });
    });

    document.querySelectorAll('.track-active').forEach((input) => {
        input.addEventListener('change', (event) => {
            const track = state.tracks.find((track) => track.id === Number(event.target.dataset.trackId));
            track.active = event.target.checked;
        });
    });

    document.querySelectorAll('.track-volume').forEach((input) => {
        input.addEventListener('input', (event) => {
            const track = state.tracks.find((track) => track.id === Number(event.target.dataset.trackId));
            track.volume = Number(event.target.value);
        });
    });
}

function renderPadGrid() {
    const grid = document.getElementById('padGrid');
    grid.innerHTML = '';

    state.sampleVoices.forEach((voice, index) => {
        const pad = document.createElement('button');
        pad.className = 'pad-card';
        pad.textContent = voice;
        pad.dataset.voice = voice;
        pad.addEventListener('click', () => {
            state.selectedVoice = voice;
            document.getElementById('selectedVoiceLabel').textContent = voice;
            triggerVoice(voice);
        });
        grid.appendChild(pad);
    });
}

function renderSequencer() {
    const container = document.getElementById('trackSequencer');
    container.innerHTML = '';

    state.tracks.forEach((track) => {
        const trackSegment = document.createElement('div');
        trackSegment.className = 'track-segment';
        trackSegment.innerHTML = `
            <div class="track-header">
                <div class="track-title"><strong>${track.name}</strong></div>
                <span>${track.instrument.toUpperCase()}</span>
            </div>
        `;

        const stepRow = document.createElement('div');
        stepRow.className = 'step-row';

        track.pattern.forEach((active, stepIndex) => {
            const stepCell = document.createElement('button');
            stepCell.className = 'step-cell';
            if (active) stepCell.classList.add('active');
            stepCell.addEventListener('click', () => togglePattern(track.id, stepIndex, stepCell));
            stepRow.appendChild(stepCell);
        });

        trackSegment.appendChild(stepRow);
        container.appendChild(trackSegment);
    });
}

function renderSampleLibrary() {
    const library = document.getElementById('sampleLibrary');
    library.innerHTML = '';

    state.sampleKits.forEach((kit) => {
        const card = document.createElement('div');
        card.className = 'sample-card';
        card.innerHTML = `
            <h3>${kit.title}</h3>
            <p>${kit.description}</p>
            <button type="button">Load Kit</button>
        `;
        card.querySelector('button').addEventListener('click', () => {
            loadSampleKit(kit.title);
        });
        library.appendChild(card);
    });
}

function loadSampleKit(title) {
    const kit = state.sampleKits.find((kit) => kit.title === title);
    if (!kit) return;
    const preset = {
        Trap: { bpm: 140, delay: 0.18, reverb: 0.2, filter: 1400, distortion: 0.06 },
        'Future Bass': { bpm: 130, delay: 0.25, reverb: 0.35, filter: 1800, distortion: 0.02 },
        'Lo-Fi': { bpm: 88, delay: 0.15, reverb: 0.45, filter: 1000, distortion: 0.1 },
        Hybrid: { bpm: 150, delay: 0.22, reverb: 0.3, filter: 2200, distortion: 0.08 }
    }[kit.preset] || state.effects;

    state.bpm = preset.bpm;
    state.effects = { ...state.effects, ...preset };
    document.getElementById('bpmInput').value = state.bpm;
    document.getElementById('delaySlider').value = state.effects.delay;
    document.getElementById('reverbSlider').value = state.effects.reverb;
    document.getElementById('filterSlider').value = state.effects.filter;
    document.getElementById('distortionSlider').value = state.effects.distortion;
    effectsChain.delay.delayTime.setValueAtTime(state.effects.delay, audioContext.currentTime);
    effectsChain.wetGain.gain.setValueAtTime(state.effects.reverb, audioContext.currentTime);
    effectsChain.filter.frequency.setValueAtTime(state.effects.filter, audioContext.currentTime);
    effectsChain.distortion.curve = makeDistortionCurve(state.effects.distortion * 100);
    updateDashboard();
    updateEffectsUI();
}

function updateDashboard() {
    document.getElementById('tempoValue').textContent = `${state.bpm} BPM`;
    document.getElementById('layerCount').textContent = state.tracks.length;
    document.getElementById('liveMode').textContent = state.metronome ? 'Enabled' : 'Disabled';
    document.getElementById('effectCount').textContent = `${Object.keys(state.effects).length} active`;
}

function updateMasterUI() {
    document.getElementById('masterVolumeLabel').textContent = `${Math.round(state.masterVolume * 100)}%`;
    document.getElementById('masterPanLabel').textContent = state.masterPan === 0 ? 'Center' : state.masterPan > 0 ? `R${Math.round(state.masterPan * 100)}%` : `L${Math.round(Math.abs(state.masterPan) * 100)}%`;
    document.getElementById('busGainLabel').textContent = state.masterVolume.toFixed(2);
    document.getElementById('busWetDryLabel').textContent = `${Math.round(state.effects.reverb * 100)}%`;
}

function updateEffectsUI() {
    document.getElementById('delayValue').textContent = `${state.effects.delay.toFixed(2)}s`;
    document.getElementById('reverbValue').textContent = `${Math.round(state.effects.reverb * 100)}%`;
    document.getElementById('filterValue').textContent = `${Math.round(state.effects.filter / 1000 * 10) / 10}kHz`;
    document.getElementById('distortionValue').textContent = `${Math.round(state.effects.distortion * 100)}%`;
}

function togglePattern(trackId, stepIndex, stepElement) {
    const track = state.tracks.find((track) => track.id === trackId);
    track.pattern[stepIndex] = !track.pattern[stepIndex];
    stepElement.classList.toggle('active', track.pattern[stepIndex]);
}

function instrumentLabel(instrument, id) {
    const map = {
        drums: 'Drums',
        bass: '808 Bass',
        synth: 'Synth Lead',
        vocal: 'Vocal Chop',
        keys: 'Keys',
        fx: 'FX Layer'
    };
    return map[instrument] || `Layer ${id}`;
}

function startPlayback() {
    if (state.isPlaying) {
        stopPlayback();
        return;
    }
    state.isPlaying = true;
    const playBtn = document.getElementById('playBtn');
    playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    const stepDuration = (60 / state.bpm) * 1000 / 4;

    playbackTimer = setInterval(() => {
        stepTick();
    }, stepDuration);
}

function stopPlayback() {
    state.isPlaying = false;
    clearInterval(playbackTimer);
    playbackTimer = null;
    const playBtn = document.getElementById('playBtn');
    playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
    state.stepIndex = 0;
}

function clearSequencer() {
    state.tracks.forEach((track) => {
        track.pattern.fill(false);
    });
    renderSequencer();
}

function stepTick() {
    state.tracks.forEach((track) => {
        if (track.active && track.pattern[state.stepIndex]) {
            triggerTrackSound(track);
        }
    });

    if (state.metronome) {
        if (state.stepIndex % 4 === 0) {
            triggerMetronomeClick();
        }
    }

    highlightStep(state.stepIndex);
    state.stepIndex = (state.stepIndex + 1) % 16;
}

function highlightStep(stepIndex) {
    document.querySelectorAll('.track-segment').forEach((segment) => {
        const cells = segment.querySelectorAll('.step-cell');
        cells.forEach((cell, index) => {
            cell.style.opacity = index === stepIndex ? '1' : '0.7';
        });
    });
}

function triggerTrackSound(track) {
    const frequencyMap = {
        drums: 55,
        bass: 45,
        synth: 220,
        vocal: 330,
        keys: 196,
        fx: 110
    };
    playTone(track.instrument, frequencyMap[track.instrument] || 220, 0.16, track.volume);
}

function playTone(type, frequency, duration, volume) {
    if (!audioReady) audioContext.resume().then(() => (audioReady = true));

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type === 'bass' ? 'sine' : type === 'synth' ? 'sawtooth' : type === 'vocal' ? 'square' : type === 'triangle';
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(effectsChain.filter);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function triggerVoice(voice) {
    const voiceMap = {
        '808 Kick': { type: 'drums', frequency: 50, duration: 0.18 },
        Snare: { type: 'drums', frequency: 165, duration: 0.14 },
        'Hi-Hat': { type: 'drums', frequency: 880, duration: 0.08 },
        '808 Bass': { type: 'bass', frequency: 45, duration: 0.35 },
        'Synth Stab': { type: 'synth', frequency: 220, duration: 0.22 },
        'Vocal Chop': { type: 'vocal', frequency: 330, duration: 0.2 },
        Melody: { type: 'synth', frequency: 440, duration: 0.3 },
        'FX Sweep': { type: 'fx', frequency: 140, duration: 1.2 }
    }[voice];

    if (voiceMap) {
        playTone(voiceMap.type, voiceMap.frequency, voiceMap.duration, 0.88);
    }
}

function triggerMetronomeClick() {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.18, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.06);
}

function showSection(sectionId) {
    document.querySelectorAll('.tab-section').forEach((section) => {
        section.classList.toggle('active', section.id === sectionId);
    });
}

function renderSavedSessions() {
    const container = document.getElementById('savedSessions');
    if (!container) return;
    container.innerHTML = '';

    if (state.savedSessions.length === 0) {
        container.innerHTML = '<div class="saved-empty">No saved sessions yet. Use Save Session to store your beat setup.</div>';
        return;
    }

    state.savedSessions.forEach((session) => {
        const card = document.createElement('div');
        card.className = 'saved-session-card';
        card.innerHTML = `
            <div>
                <strong>${session.name}</strong>
                <small>${session.createdAt}</small>
            </div>
            <div class="session-controls">
                <button type="button" data-load="${session.id}">Load</button>
                <button type="button" data-delete="${session.id}">Delete</button>
            </div>
        `;

        card.querySelector('[data-load]').addEventListener('click', () => loadSession(session.id));
        card.querySelector('[data-delete]').addEventListener('click', () => deleteSession(session.id));
        container.appendChild(card);
    });
}

function loadSession(id) {
    const session = state.savedSessions.find((item) => item.id === id);
    if (!session) return;
    state.bpm = session.bpm;
    state.tracks = session.tracks.map((track) => ({ ...track }));
    state.effects = { ...session.effects };
    state.metronome = session.metronome;
    state.masterVolume = session.masterVolume;
    state.masterPan = session.masterPan;
    document.getElementById('bpmInput').value = state.bpm;
    document.getElementById('delaySlider').value = state.effects.delay;
    document.getElementById('reverbSlider').value = state.effects.reverb;
    document.getElementById('filterSlider').value = state.effects.filter;
    document.getElementById('distortionSlider').value = state.effects.distortion;
    document.getElementById('masterVolumeSlider').value = state.masterVolume;
    document.getElementById('masterPanSlider').value = state.masterPan;
    effectsChain.delay.delayTime.setValueAtTime(state.effects.delay, audioContext.currentTime);
    effectsChain.wetGain.gain.setValueAtTime(state.effects.reverb, audioContext.currentTime);
    effectsChain.filter.frequency.setValueAtTime(state.effects.filter, audioContext.currentTime);
    effectsChain.distortion.curve = makeDistortionCurve(state.effects.distortion * 100);
    effectsChain.masterGain.gain.setValueAtTime(state.masterVolume, audioContext.currentTime);
    effectsChain.panner.pan.setValueAtTime(state.masterPan, audioContext.currentTime);
    renderTrackRows();
    renderSequencer();
    updateDashboard();
    updateEffectsUI();
    updateMasterUI();
}

function deleteSession(id) {
    state.savedSessions = state.savedSessions.filter((session) => session.id !== id);
    localStorage.setItem('fourTuneSavedSessions', JSON.stringify(state.savedSessions));
    renderSavedSessions();
}

function toggleMetronome() {
    state.metronome = !state.metronome;
    document.getElementById('toggleMetronomeBtn').classList.toggle('active', state.metronome);
    updateDashboard();
}

function randomizeLayer() {
    const randomTrack = state.tracks[Math.floor(Math.random() * state.tracks.length)];
    if (!randomTrack) return;
    randomTrack.pattern = randomTrack.pattern.map(() => Math.random() > 0.6);
    renderSequencer();
}

function addLayer() {
    const newId = Math.max(...state.tracks.map((track) => track.id)) + 1;
    state.tracks.push({
        id: newId,
        name: `Layer ${newId}`,
        instrument: 'synth',
        active: true,
        volume: 0.75,
        pattern: Array(16).fill(false),
        color: '#22c55e'
    });
    renderTrackRows();
    renderSequencer();
    updateDashboard();
}

function saveSession() {
    const name = prompt('Name this session', `4tune Session ${new Date().toLocaleTimeString()}`);
    if (!name) return;
    const session = {
        id: Date.now(),
        name,
        createdAt: new Date().toLocaleString(),
        bpm: state.bpm,
        tracks: state.tracks,
        effects: state.effects,
        metronome: state.metronome,
        masterVolume: state.masterVolume,
        masterPan: state.masterPan
    };
    state.savedSessions.unshift(session);
    localStorage.setItem('fourTuneSavedSessions', JSON.stringify(state.savedSessions));
    localStorage.setItem('fourTuneSession', JSON.stringify(session));
    renderSavedSessions();
    alert(`Saved session: ${name}`);
}

function resetSession() {
    if (confirm('Start a fresh 4tune session? This will clear the current pattern.')) {
        state.tracks.forEach((track) => {
            track.pattern = Array(16).fill(false);
            track.active = true;
            track.volume = 0.8;
        });
        state.bpm = 140;
        state.metronome = true;
        state.masterVolume = 0.92;
        state.masterPan = 0;
        document.getElementById('bpmInput').value = state.bpm;
        document.getElementById('delaySlider').value = 0.18;
        document.getElementById('reverbSlider').value = 0.22;
        document.getElementById('filterSlider').value = 1400;
        document.getElementById('distortionSlider').value = 0.05;
        document.getElementById('masterVolumeSlider').value = state.masterVolume;
        document.getElementById('masterPanSlider').value = state.masterPan;
        state.effects = { delay: 0.18, reverb: 0.22, filter: 1400, distortion: 0.05 };
        effectsChain.delay.delayTime.setValueAtTime(state.effects.delay, audioContext.currentTime);
        effectsChain.wetGain.gain.setValueAtTime(state.effects.reverb, audioContext.currentTime);
        effectsChain.filter.frequency.setValueAtTime(state.effects.filter, audioContext.currentTime);
        effectsChain.distortion.curve = makeDistortionCurve(state.effects.distortion * 100);
        renderTrackRows();
        renderSequencer();
        updateDashboard();
        updateEffectsUI();
    }
}

function applyPreset(presetName) {
    const presets = {
        Trap: { bpm: 140, delay: 0.18, reverb: 0.2, filter: 1400, distortion: 0.06 },
        'Future Bass': { bpm: 132, delay: 0.24, reverb: 0.28, filter: 1800, distortion: 0.03 },
        'Lo-Fi': { bpm: 88, delay: 0.12, reverb: 0.42, filter: 1000, distortion: 0.1 },
        Hybrid: { bpm: 150, delay: 0.2, reverb: 0.3, filter: 2200, distortion: 0.08 }
    };
    const preset = presets[presetName];
    if (!preset) return;
    state.bpm = preset.bpm;
    state.effects = { ...state.effects, ...preset };
    document.getElementById('bpmInput').value = state.bpm;
    document.getElementById('delaySlider').value = state.effects.delay;
    document.getElementById('reverbSlider').value = state.effects.reverb;
    document.getElementById('filterSlider').value = state.effects.filter;
    document.getElementById('distortionSlider').value = state.effects.distortion;
    effectsChain.delay.delayTime.setValueAtTime(state.effects.delay, audioContext.currentTime);
    effectsChain.wetGain.gain.setValueAtTime(state.effects.reverb, audioContext.currentTime);
    effectsChain.filter.frequency.setValueAtTime(state.effects.filter, audioContext.currentTime);
    effectsChain.distortion.curve = makeDistortionCurve(state.effects.distortion * 100);
    updateDashboard();
    updateEffectsUI();
}
