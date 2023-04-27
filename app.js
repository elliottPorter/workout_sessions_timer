const main_timer = document.getElementById('main_timer');
const beep = document.getElementById('beep');
const userSubmit = document.getElementById('userSubmit');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const timers = [];

const main_output = () => {
	main_timer.textContent = count;
};

console.log('The array is ' + timers);

const start = () => {
	for (let i = 0; i < timers.length; i++) {
		countdown(i);
	}
};

const countdown = (i) => {
	let count = Number(timers[i]);
	console.log('The current count is ' + count);
	main_timer.textContent = count;
	let countdown = setInterval(() => {
		count--;
		if (count === 0) {
			beep.play();
			clearInterval(countdown);
		}
		main_timer.textContent = count;
	}, 1000);
	return;
};

const pushTimerOptions = (e) => {
	e.preventDefault();
	let totalSeconds = Number(minutes.value) * 60 + Number(seconds.value);
	timers.push(totalSeconds);
	console.log(timers);
	return totalSeconds;
};

// create the event listeners
userSubmit.addEventListener('click', pushTimerOptions, false);
