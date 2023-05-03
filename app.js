// create the variables
const main_timer = document.getElementById('main_timer');
const beep = document.getElementById('beep');
const user_submit = document.getElementById('user_submit');
const reset_intervals = document.getElementById('reset_intervals');
const interval_label = document.getElementById('interval_label');
const interval_description = document.getElementById('interval_description');
const rest_period = document.getElementById('rest_period');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const intervals_ui = document.getElementById('intervals_ui');
let timers = [];

// the function call from the start button
const start = (num) => {
	let intervals_count = timers.length;
	let count = null;
	if (num < intervals_count) {
		count = Number(timers[num].totalSeconds);
	} else if (num === intervals_count--) {
		resetIntervals();
		return;
	}

	console.log(intervals_count);

	// update the UI counter
	main_timer.textContent = count;

	// add a second to every interval after first interval...
	if (num !== 0) {
		count++;
	}

	// the timer countdown function
	let countdown = setInterval(() => {
		count--;

		// if countdown is ending...
		if (count === 0) {
			beep.play();
			main_timer.textContent = 0;
			clearInterval(countdown);

			if (num === intervals_count + 1) {
				resetIntervals();
				return;
			}
			// check the index parameter value and use for recursion
			start(num + 1);
		}
		// update the UI counter
		main_timer.textContent = count;
	}, 1000);
};

// send the intervals entered into the array
const pushTimerOptions = (e) => {
	e.preventDefault();

	// transform the time entry into seconds
	let totalSeconds = Number(minutes.value) * 60 + Number(seconds.value);

	// is this a rest period?
	let rest = rest_period.value === 'true' ? true : false;

	// send the interval content to the array
	timers.push({
		interval: interval_description.value,
		rest: rest,
		minutes: minutes.value,
		seconds: seconds.value,
		totalSeconds: totalSeconds,
	});

	// send the intervals into a new array
	let intervals_output = timers.map((timer) => {
		return `<div class="row">
<div class="interval">
				${timer.interval}
			</div>
		<div class="min">
				${timer.minutes}m
			</div>
			<div class="sec">
				${timer.seconds}s
			</div>

		</div>`;
	});

	// update the intervals ui
	console.log(timers);
	intervals_ui.innerHTML = intervals_output.join('');
};

const resetIntervals = () => {
	timers = [];
	intervals_ui.innerHTML = 'Waiting for your intervals';
};

const showIntervalDescription = () => {
	rest_period.value === 'false'
		? (interval_label.className = 'show') && (interval_description.className = 'show')
		: (interval_label.className = 'hidden') && (interval_label.className = 'hidden');
};

// create the event listeners
user_submit.addEventListener('click', pushTimerOptions, false);
reset_intervals.addEventListener('click', resetIntervals, false);
rest_period.addEventListener('change', showIntervalDescription, false);
