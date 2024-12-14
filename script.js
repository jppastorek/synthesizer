const sine_button = document.getElementById("sine-button");
const saw_button = document.getElementById("saw-button");
const square_button = document.getElementById("square-button");
const play_button = document.getElementById("play-button");
const stop_button = document.getElementById("stop-button");
const frequency_input = document.getElementById("frequency-input");
const waveform_buttons = [sine_button, saw_button, square_button];
let waveform;

let started = false;
console.log(started);

const deactivate_buttons = () => {
  waveform_buttons.forEach((button) => {
    if (button.classList.contains("active")) button.classList.remove("active");
  });
};

sine_button.addEventListener("click", () => {
  waveform = "sine";
  deactivate_buttons();
  sine_button.classList.add("active");
});

saw_button.addEventListener("click", () => {
  waveform = "sawtooth";
  deactivate_buttons();
  saw_button.classList.add("active");
});

square_button.addEventListener("click", () => {
  waveform = "square";
  deactivate_buttons();
  square_button.classList.add("active");
});

frequency_input.addEventListener("change", () => {
  oscillator.frequency.value = frequency_input.value;
});

play_button.addEventListener("click", () => {
  if (started == false) {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.start();
  } else {
    if (context.state === "suspended") context.state = "resume";
    oscillator.type = waveform;
    oscillator.connect(context.destination);
    play_button.classList.add("active");
  }
  started = true;
});

stop_button.addEventListener("click", () => {
  oscillator.disconnect();
  if (play_button.classList.contains("active"))
    play_button.classList.remove("active");
});
