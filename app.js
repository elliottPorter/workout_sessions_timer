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
const total_time = document.getElementById('total_time');
const close = document.getElementById('close');
const modal = document.getElementById('modal_for_display');
let total_minutes = 0;
let total_seconds = 0;
let remaining_seconds = 0;
let intervals_total_time = 0;
let timers = [];

// the function call from the start button
const start = (num) => {
	modal.style.setProperty('display', 'block');
	let intervals_count = timers.length;
	let count = null;
	if (num < intervals_count) {
		count = Number(timers[num].totalSeconds);
	} else if (num === intervals_count--) {
		resetIntervals();
		return;
	}

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
	let totalSeconds = parseInt(seconds.value) + parseInt(minutes.value) * 60;

	// is this a rest period?
	let rest = rest_period.value === 'true' ? true : false;

	// increase the total seconds for each interval submitted
	intervals_total_time += totalSeconds;
	console.log(intervals_total_time);

	// function to create total time with minutes and remaining seconds
	const create_total_time_for_ui = (seconds) => {
		console.log(`Passed in: ${seconds}`);

		total_minutes = Math.floor(parseInt(seconds) / 60);

		console.log(total_minutes);

		remaining_seconds = seconds %= 60;

		return `Total time: ${total_minutes}m : ${remaining_seconds}s`;
	};

	// update the total time in ui
	total_time.innerHTML = create_total_time_for_ui(intervals_total_time);

	// send the interval content to the array
	timers.push({
		interval: interval_description.value,
		rest: rest,
		minutes: minutes.value,
		seconds: seconds.value,
		totalSeconds: totalSeconds,
	});

	// send the intervals into a new array and create a total time for all intervals
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

const closeModal = () => {
	modal.style.setProperty('display', 'none')
};

// create the event listeners
user_submit.addEventListener('click', pushTimerOptions, false);
reset_intervals.addEventListener('click', resetIntervals, false);
rest_period.addEventListener('change', showIntervalDescription, false);
close.addEventListener('click', closeModal, false);
