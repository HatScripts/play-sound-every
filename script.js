const sndInput = document.getElementById("sound");
const secInput = document.getElementById("secs");
const volInput = document.getElementById("volume");
const startBtn = document.getElementById("start");
const startTxt = startBtn.querySelector("span");
const btnIcon = startBtn.querySelector("svg");
const volIcon = document.getElementById("volume-icon");
const countdown = document.getElementById("countdown");
const countdownCircle = countdown.querySelector("svg circle");
const clocks = '🕛 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚'.split(' ');
// TODO: Update the document title to prepend animated clock emoji
//       On Codepen you need to be in the debug view to see this:
//       https://codepen.io/HatScripts/debug/VXEyVB

let audio, soundInterval, countdownInterval, titleInterval;

const playIcon = { type: "polygon", points: "5 3 19 12 5 21" };
const stopIcon = { type: "rect", x: 3, y: 3, width: 18, height: 18 };
const originalTitle = document.title;

let animation = Wilderness.timeline(Wilderness.shape(playIcon, stopIcon));

Wilderness.render(btnIcon, animation);

function playSound() {
  if (!audio) {
    initAudio();
  } else if (!audio.ended) {
    audio.pause();
    initAudio();
  }
  audio.play();
  console.log("Played");
}

function start() {
  //secInput.disabled = true;
  //sndInput.disabled = true;
  startTxt.textContent = "Stop";
  Wilderness.play(animation, { duration: 400, reverse: false });
  soundInterval = setInterval(playSound, secInput.value * 1000);

  let countdownNum = countdown.querySelector(".num");
  let countdownVal = secInput.value;
  countdownNum.textContent = countdownVal;
  countdownCircle.style.animation = "countdown linear infinite " + secInput.value + "s";
  countdown.classList.remove("shrunken");

  countdownInterval = setInterval(function() {
    countdownVal = countdownVal <= 1 ? secInput.value : countdownVal - 1;
    countdownNum.textContent = countdownVal;
  }, 1000);
  let clockIndex = 0;
  updateTitle(clockIndex)
  titleInterval = setInterval(function() {
    clockIndex++
    if (clockIndex >= clocks.length) {
      clockIndex = 0
    }
    updateTitle(clockIndex)
  }, (secInput.value * 1000) / clocks.length);
}

function stop() {
  if (audio) {
    audio.pause();
  }
  //secInput.disabled = false;
  //sndInput.disabled = false;
  startTxt.textContent = "Start";
  Wilderness.play(animation, { duration: 400, reverse: true });
  clearInterval(soundInterval);
  clearInterval(countdownInterval);
  clearInterval(titleInterval);
  updateTitle(-1)
  countdown.classList.add("shrunken");
  setTimeout(function() {
    countdownCircle.style.animation = "none";
  }, 400);
}

function initAudio() {
  audio = new Audio("https://hatscripts.com/notifications/" + sndInput.value + ".mp3");
  audio.volume = volInput.value / 100;
}

function updateTitle(clockIndex) {
  document.title = clockIndex === -1 ? originalTitle : clocks[clockIndex] + ' ' + originalTitle;
}

startBtn.onclick = function() {
  if (startTxt.textContent === "Start") {
    start();
  } else {
    stop();
  }
};

sndInput.onchange = function() {
  initAudio();
  playSound();
  localStorage.setItem("sound", sndInput.value);
};

secInput.onchange = volInput.oninput = function() {
  countdownCircle.style.animation = "none";
  clearInterval(soundInterval);
  clearInterval(countdownInterval);
  clearInterval(titleInterval);
  updateTitle(0);
  setTimeout(function() {
    start();
  }, 400);
  localStorage.setItem("repeatEvery", secInput.value);
}

volInput.onchange = volInput.oninput = function() {
  let volume = volInput.value;
  if (audio) {
    audio.volume = volume / 100;
  }
  let icon = volume == 0 ? "volume-0" : volume < 50 ? "volume-1" : "volume-2";
  volIcon.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + icon);
  localStorage.setItem("volume", volInput.value);
};

document.getElementById("toggle-mute").onclick = function() {
  if (volInput.value > 0) {
    volInput.dataset.previousVolume = volInput.value;
    volInput.value = 0;
    volInput.onchange();
  } else {
    volInput.value = volInput.dataset.previousVolume || 50;
    volInput.onchange();
  }
};

sndInput.value = localStorage.getItem("sound") || sndInput.value;
secInput.value = localStorage.getItem("repeatEvery") || secInput.value;
volInput.value = localStorage.getItem("volume");
volInput.onchange();
