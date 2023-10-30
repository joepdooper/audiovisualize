const AudioVisualize = {
  audioContext: new AudioContext(),
  element: new Audio(),
  fftSize: 2048,
  sourceNode: null,
  analyserNode: null,
  bufferLength: null,
  spectrum: null,
  loading(src, callbackLoaded, callbackUpdate, callbackEnded) {
    this.element.src = src;
    const handleLoaded = () => {
      this.element.removeEventListener('loadedmetadata', handleLoaded);
      this.element.removeEventListener('canplaythrough', handleLoaded);
      this.initialize();
      callbackLoaded();
    }
    this.element.addEventListener('loadedmetadata', handleLoaded);
    this.element.addEventListener('canplaythrough', handleLoaded);
    this.element.addEventListener('progress', callbackUpdate);
    this.element.addEventListener('timeupdate', callbackUpdate);
    this.element.addEventListener('ended', callbackEnded);
  },
  initialize() {
    this.sourceNode = this.audioContext.createMediaElementSource(this.element);
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = this.fftSize;
    // this.sourceNode.connect(this.analyserNode);
    this.bufferLength = this.analyserNode.frequencyBinCount;
    this.spectrum = new Uint8Array(this.bufferLength);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  },
  getFrequencies(low, high) {
    this.analyserNode.getByteFrequencyData(this.spectrum);
    return this.calculateFrequencyRange(low, high, this.spectrum);
  },
  calculateFrequencyRange(minHz, maxHz, spectrum) {
    const minFrequencyIndex = Math.floor(minHz / (this.audioContext.sampleRate / this.bufferLength));
    const maxFrequencyIndex = Math.floor(maxHz / (this.audioContext.sampleRate / this.bufferLength));
    let total = 0;
    let count = 0;
    for (let i = minFrequencyIndex; i <= maxFrequencyIndex; i++) {
      total += spectrum[i];
      count++;
    }
    const average = total / count;
    return average;
  },
  async getAverageRange(low, high) {
    let total = 0;
    let count = 0;
    const duration = this.element.duration;
    for (let i = 0; i < duration; i++) {
      this.element.currentTime = i;
      const range = this.getFrequencies(low, high);
      total += range;
      count++;
    }
    const average = total / count;
    return average;
  }
};

export { AudioVisualize };
