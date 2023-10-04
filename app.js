// create the variables
const main_timer = document.getElementById('main_timer');
const main_label = document.getElementById('main_label');
const beep = document.getElementById('beep');
const low_beep = document.getElementById('low_beep');
const user_submit = document.getElementById('user_submit');
const reset_intervals = document.getElementById('reset_intervals');
const interval_label = document.getElementById('interval_label');
const interval_description = document.getElementById('interval_description');
const rest_period = document.getElementById('rest_period');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const intervals_ui = document.getElementById('intervals_ui');
const total_time = document.getElementById('total_time');
const close_modal = document.getElementById('close');
const modal = document.getElementById('modal_for_display');
const stop_button = document.getElementById('stop');
const pause_button = document.getElementById('pause_intervals');
const resume_button = document.getElementById('resume_intervals');
let pause = false;
let total_minutes = 0;
let total_seconds = 0;
let remaining_seconds = 0;
let intervals_total_time = 0;
let timers = [];

// functions to pause and resume the intervals
const pause_the_intervals = () => {
	pause = true;
};

const resume_the_intervals = () => {
	pause = false;
};

// the function call from the start button
const start_the_intervals = (num) => {
	modal.style.setProperty('display', 'block');
	let intervals_count = timers.length;
	let count = null;
	if (num < intervals_count) {
		count = Number(timers[num].totalSeconds);
	} else if (num === intervals_count--) {
		reset_the_intervals();
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


		if (!pause) {
			count--;

			// if countdown is ending...
			if (count <= 3 && count > 0) {
				low_beep.play();
			} else if (count === 0) {
				beep.play();
				main_timer.textContent = 0;
				clearInterval(countdown);

				if (num === intervals_count + 1) {
					reset_the_intervals();
					return;
				}
				// check the index parameter value and use for recursion
				start_the_intervals(num + 1);
			}
			// update the UI counter
			main_timer.textContent = count;
			main_label.textContent = timers[num].interval;
		}
	}, 1000);
};

// send the intervals entered into the array
const push_timer_options = (e) => {
	e.preventDefault();

	// transform the time entry into seconds
	let totalSeconds = parseInt(seconds.value) + parseInt(minutes.value) * 60;

	// is this a rest period?
	let rest = rest_period.value === 'true' ? true : false;

	// increase the total seconds for each interval submitted
	intervals_total_time += totalSeconds;
	// console.log(intervals_total_time);

	// function to create total time with minutes and remaining seconds
	const create_total_time_for_ui = (seconds) => {
		// console.log(`Passed in: ${seconds}`);

		total_minutes = Math.floor(parseInt(seconds) / 60);

		// console.log(total_minutes);

		remaining_seconds = seconds %= 60;

		return `Total time: ${total_minutes}m : ${remaining_seconds}s`;
	};

	// update the total time in ui
	total_time.innerHTML = create_total_time_for_ui(intervals_total_time);

	// send the interval content to the array
	timers.push({
		interval: rest ? 'Rest' : interval_description.value,
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
	console.log(timers);
};

const reset_the_intervals = () => {
	timers = [];
	intervals_ui.innerHTML = 'Waiting for your intervals';
};

const show_interval_description = () => {
	rest_period.value === 'false'
		? (interval_label.className = 'show') && (interval_description.className = 'show')
		: (interval_label.className = 'hidden') && (interval_label.className = 'hidden');
};

const close_the_modal = () => {
	modal.style.setProperty('display', 'none');
};

// create the event listeners
user_submit.addEventListener('click', push_timer_options, false);
reset_intervals.addEventListener('click', reset_the_intervals, false);
rest_period.addEventListener('change', show_interval_description, false);
pause_button.addEventListener('click', pause_the_intervals, false);
resume_button.addEventListener('click', resume_the_intervals, false);
close_modal.addEventListener('click', close_the_modal, false);
reset_intervals.addEventListener('click', reset_the_intervals, false);
