# 4tune - Trap Beat Production Studio

4tune is a browser-based beat production workspace built for trap producers, DJs, and beatmakers. It focuses on multilayered track creation, live pad triggering, sequencer control, and instant effects shaping.

## Features

- Multi-track layer mixer with drum, bass, synth, vocal and FX lanes
- 16-step sequencer for each track
- Live pad grid for voice stacking and layered performance
- Reverb, delay, filter and distortion effects rack
- Trap-ready sample kits and presets
- Save sessions locally and continue production later

## Getting Started

1. Open `index.html` in a browser or run a local server.
2. Use the `Add Layer` button to create new voice lanes.
3. Adjust tempo, volume and instrument types for each track.
4. Draw your pattern in the sequencer.
5. Use the pads to trigger layered sounds and performance voices.
6. Save your session with the `Save Session` button.

## Development

### Run locally
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` from the project folder.

## Notes

4tune is designed as a prototype studio environment. The audio engine uses the Web Audio API to create live synths, drums and effects in the browser.
