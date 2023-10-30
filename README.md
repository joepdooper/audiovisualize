# AudioVisualize

**AudioVisualize** is a JavaScript module that leverages the power of the Web Audio API to visualize and analyze audio in your web applications. It provides an easy-to-use interface for loading audio, extracting audio data, and creating visualizations.

## Features

- **Real-time Visualization:** Create real-time visualizations of audio, including frequency spectrum analysis.
- **Customizable:** Adjust the audio analysis parameters to focus on the aspects that matter most to your application.

## Installation

Easily install **AudioVisualize** via npm…

```bash
npm i audiovisualize
```

…or include the script in your HTML file.

```html
<script src="https://unpkg.com/audiovisualize"></script>
```

## Usage

```javascript
// Create an instance of the AudioVisualize object.
const av = Object.create(AudioVisualize);

av.loading(
  // Path to your audio file
  'path-to-your-audio-file.mp3',
  () => {
    // Audio loaded callback
    console.log('Audio loaded');
  },
  (event) => {
    // Progress update callback
    console.log('Update event:', event);
  },
  () => {
    // Audio ended callback
    console.log('Audio ended');
    // Perform additional actions when audio playback ends
  }
);

av.initialize();

// Create your custom audio visualizations here
```

You can use the getFrequencies method to get the frequency data of the audio at any given moment. It returns an array of frequency values within a specified range.

```javascript
const lowFrequency = 20;  // Minimum frequency in Hz
const highFrequency = 20000;  // Maximum frequency in Hz

const frequencies = audioVisualizer.getFrequencies(lowFrequency, highFrequency); // `frequencies` is an array of frequency data.
```

If you want to get the average frequency range over the entire audio track, you can use the getAverageRange method. This method will analyze the audio frame by frame and calculate the average over the specified frequency range.

```javascript
const averageLowFrequency = 100;  // Minimum frequency in Hz
const averageHighFrequency = 2000;  // Maximum frequency in Hz

audioVisualizer.getAverageRange(averageLowFrequency, averageHighFrequency).then((average) => {
  console.log('Average range over time:', average);
});
```

## Example

```html
<canvas id="canvasElement"></canvas>

<script type="module">
import { AudioVisualize } from 'https://unpkg.com/audiovisualize';

const av = Object.create(AudioVisualize);

av.loading(
  'path-to-your-audio-file.mp3',
  () => {
    console.log('Audio duration', av.element.duration);
    // Add the audio element to the body
    document.body.appendChild(av.element);
    av.element.setAttribute('controls', 'controls');
  },
  () => {
    console.log('Buffered', av.element.buffered);
    console.log('Current time', av.element.currentTime);
  },
  () => {
    console.log('Audio ended', av.element.currentTime, av.element.duration);
  }
);

av.initialize();

const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext("2d");

function draw() {
  if(!av.element.paused){
    av.getFrequencies();
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the waveform
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < av.spectrum.length; i++) {
      const x = (canvas.width / av.spectrum.length) * i;
      const y = canvas.height - (canvas.height * av.spectrum[i]) / 255;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  // Request the next animation frame
  requestAnimationFrame(draw);
}

// Start the animation loop
draw();

</script>
```
