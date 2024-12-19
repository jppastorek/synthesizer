const sine_button = document.getElementById("sine-button");
const saw_button = document.getElementById("saw-button");
const square_button = document.getElementById("square-button");
const triangle_button = document.getElementById("triangle-button");
const play_button = document.getElementById("play-button");
const stop_button = document.getElementById("stop-button");
const frequency_input = document.getElementById("frequency-input");
const gain_input = document.getElementById("gain-input");
const visualizer = document.getElementById("visualizer");
const attack_control = document.getElementById("attack");
const release_control = document.getElementById("release");
const waveform_buttons = [
  sine_button,
  saw_button,
  square_button,
  triangle_button,
];
let waveform = "sine";
let context;
let oscillator;
let gainNode;
let analyser;
let attack_time = 0.2;
let release_time = 0.5;

const deactivate_buttons = () => {
  waveform_buttons.forEach((button) => {
    if (button.classList.contains("active")) button.classList.remove("active");
  });
};

sine_button.addEventListener("click", () => {
  waveform = "sine";
  deactivate_buttons();
  sine_button.classList.add("active");
  if (oscillator != undefined) {
    oscillator.type = "sine";
  }
});

saw_button.addEventListener("click", () => {
  waveform = "sawtooth";
  deactivate_buttons();
  saw_button.classList.add("active");
  if (oscillator != undefined) {
    oscillator.type = "sawtooth";
  }
});

square_button.addEventListener("click", () => {
  waveform = "square";
  deactivate_buttons();
  square_button.classList.add("active");
  if (oscillator != undefined) {
    oscillator.type = "square";
  }
});

triangle_button.addEventListener("click", () => {
  waveform = "triangle";
  deactivate_buttons();
  triangle_button.classList.add("active");
  if (oscillator != undefined) {
    oscillator.type = "triangle";
  }
});

frequency_input.addEventListener("input", () => {
  oscillator.frequency.value = frequency_input.value;
});

attack_control.addEventListener("input", (e) => {
  attack_time = parseInt(e.target.value, 10);
}, false);

release_control.addEventListener("input", (e) => {
  release_time = parseInt(e.target.value, 10);
}, false);

play_button.addEventListener("click", () => {
  if (context === undefined) {
    context = new AudioContext();
  }
  if (oscillator === undefined) {
    oscillator = context.createOscillator();
    oscillator.start(context.currentTime);
  }
  if (context.state === "suspended") {
    context.state = "running";
  }
  if (gainNode === undefined) {
    gainNode = context.createGain();
  }
  if (analyser === undefined) {
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    drawVisualizer();
  }
  oscillator.type = waveform;
  gainNode.gain.value = gain_input.value;
  oscillator.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(context.destination);
  gainNode.gain.cancelScheduledValues(context.currentTime);
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, context.currentTime + attack_time);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 2 - release_time);
  oscillator.stop(context.currentTime + 2);
  play_button.classList.add("active");
});

stop_button.addEventListener("click", () => {
  oscillator.disconnect();
  if (play_button.classList.contains("active"))
    play_button.classList.remove("active");
});

gain_input.addEventListener("input", () => {
  gainNode.gain.value = gain_input.value;
});

const drawVisualizer = () => {
  requestAnimationFrame(drawVisualizer);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  const width = visualizer.width;
  const height = visualizer.height;
  const barWidth = 10;
  const canvasContext = visualizer.getContext("2d");
  canvasContext.clearRect(0, 0, width, height);
  let x = 0;
  dataArray.forEach((item, index, array) => {
    const y = (item / 255) * height * 1.1;
    canvasContext.strokeStyle = `blue`;
    x = x + barWidth;
    canvasContext.beginPath();
    canvasContext.lineCap = "round";
    canvasContext.lineWidth = 2;
    canvasContext.moveTo(x, height);
    canvasContext.lineTo(x, height - y);
    canvasContext.stroke();
  });
};

function playNote() {

}