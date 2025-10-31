// Constants
const COUNTDOWN_START_SECONDS = 5;
const BEEP_THRESHOLD_SECONDS = 3;

// DOM Elements
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
const interval_ui = document.getElementById('interval_ui');
const total_time = document.getElementById('total_time');
const close_modal = document.getElementById('close');
const modal = document.getElementById('modal_for_display');
const modal_start = document.getElementById('modal_start');
const start_button = document.getElementById('start');
const save_button = document.getElementById('save');
const stop_button = document.getElementById('stop');
const pause_button = document.getElementById('pause_timer');
const resume_button = document.getElementById('resume_timer');
const pause_resume_buttons = document.getElementById('buttons_container');
const next_timer = document.getElementById('next_timer');

// State variables
let pause = false;
let interval_total_time = 0;
let timers = [];
let updated_timers = [];
let currentIntervalId = null;
let countdownStartIntervalId = null;
let isTimerRunning = false;
let nextTimerId = 0; // Unique ID generator for timers

// Audio playback helper with error handling
const playAudio = (audioElement) => {
  if (audioElement) {
    audioElement.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }
};

// Pause and resume functions
const pause_the_intervals = () => {
  pause = true;
};

const resume_the_intervals = () => {
  pause = false;
};

// Stop/cancel functionality
const stop_the_intervals = () => {
  if (currentIntervalId) {
    clearInterval(currentIntervalId);
    currentIntervalId = null;
  }
  if (countdownStartIntervalId) {
    clearInterval(countdownStartIntervalId);
    countdownStartIntervalId = null;
  }
  isTimerRunning = false;
  pause = false;
  modal.style.setProperty('display', 'none');
  modal_start.style.setProperty('display', 'none');
  start_button.disabled = false;
};

// Give 5 seconds to get ready for start
const countdown_start = (intervalIndex) => {
  if (isTimerRunning) {
    alert('A timer is already running. Please stop it first.');
    return;
  }

  isTimerRunning = true;
  start_button.disabled = true;

  let starter = COUNTDOWN_START_SECONDS;
  modal_start.style.setProperty('display', 'block');
  modal_start.innerHTML = `<div>First up<br><strong>${timers[intervalIndex].interval_label}</strong><br>in ${starter} seconds...</div>`;

  countdownStartIntervalId = setInterval(() => {
    starter--;
    if (starter >= 0) {
      modal_start.innerHTML = `<div>First up<br><strong>${timers[intervalIndex].interval_label}</strong><br>in ${starter} seconds...</div>`;
      if (starter <= BEEP_THRESHOLD_SECONDS && starter > 0) {
        playAudio(low_beep);
      } else if (starter === 0) {
        playAudio(beep);
      }
    } else {
      clearInterval(countdownStartIntervalId);
      countdownStartIntervalId = null;
      start_the_intervals(intervalIndex);
    }
  }, 1000);
};

// The function call from the start button
const start_the_intervals = (intervalIndex) => {
  modal_start.style.setProperty('display', 'none');
  modal.style.setProperty('display', 'block');

  let interval_count = timers.length;
  let count = null;

  if (intervalIndex < interval_count) {
    count = Number(timers[intervalIndex].totalSeconds);
  }

  // Create the minutes and seconds for the UI
  let ui_minutes = Math.floor(count / 60);
  let ui_seconds = Math.floor(count % 60);
  let count_for_ui = `${ui_minutes}m ${ui_seconds}s`;

  // Update the UI counter
  main_label.textContent = timers[intervalIndex].interval_label;
  main_timer.textContent = count_for_ui;

  // Set the next interval UI
  if (intervalIndex < interval_count - 1) {
    next_timer.textContent = `Up next: ${timers[intervalIndex + 1].interval_label}`;
  } else if (intervalIndex === interval_count - 1) {
    next_timer.textContent = `Final interval`;
  }

  // Add a second to all but the first interval
  // This compensates for the initial display time
  if (intervalIndex !== 0) {
    count++;
  }

  // The timer countdown function
  currentIntervalId = setInterval(() => {
    // Check to ensure we are not paused first
    if (pause === false) {
      // Decrease the total seconds by 1
      count--;

      // If countdown is ending (3 seconds left) play beeps
      if (count <= BEEP_THRESHOLD_SECONDS && count > 0) {
        playAudio(low_beep);
      } else if (count === 0) {
        playAudio(beep);
        // Check the index parameter value and use for recursion
        if (intervalIndex < interval_count - 1) {
          clearInterval(currentIntervalId);
          currentIntervalId = null;
          start_the_intervals(intervalIndex + 1);
        } else if (intervalIndex === interval_count - 1) {
          clearInterval(currentIntervalId);
          currentIntervalId = null;
          isTimerRunning = false;
          start_button.disabled = false;
          next_timer.textContent = `Session complete`;
          reset_the_intervals();
        }
      }

      ui_minutes = Math.floor(count / 60);
      ui_seconds = Math.floor(count % 60);
      count_for_ui = `${ui_minutes}m ${ui_seconds}s`;

      // Update the UI counter
      main_timer.textContent = count_for_ui;
    }
  }, 1000);
};

// Send the intervals entered into the array
const push_timer_options = (e) => {
  e.preventDefault();

  // Validate input
  const minutesValue = parseInt(minutes.value) || 0;
  const secondsValue = parseInt(seconds.value) || 0;
  const totalSeconds = secondsValue + minutesValue * 60;

  if (totalSeconds <= 0) {
    alert('Please enter a duration greater than 0 seconds');
    return;
  }

  const isRest = rest_period.value === 'true';
  const labelValue = isRest ? 'Rest' : interval_description.value.trim();

  if (!isRest && !labelValue) {
    alert('Please enter an interval description');
    return;
  }

  // Increase the total seconds for each interval submitted
  interval_total_time += totalSeconds;

  // Function to create total time with minutes and remaining seconds
  const create_total_time_for_ui = (seconds) => {
    const total_minutes = Math.floor(parseInt(seconds) / 60);
    const remaining_seconds = seconds % 60;
    return `Total time: ${total_minutes}m : ${remaining_seconds}s`;
  };

  // Update the total time in ui
  total_time.innerHTML = create_total_time_for_ui(interval_total_time);

  // Send the interval content to the array with unique ID
  timers.push({
    id: nextTimerId++,
    interval_label: labelValue,
    rest: isRest,
    minutes: minutesValue,
    seconds: secondsValue,
    totalSeconds: totalSeconds,
  });

  // Reset the pause and resume buttons container to display after first sessions end
  pause_resume_buttons.style.setProperty('display', 'flex');

  // Call the intervals ui
  build_the_intervals_list_ui();

  // Reset form fields
  if (!isRest) {
    interval_description.value = '';
  }
  minutes.value = '0';
  seconds.value = '0';
};

// Function to create the intervals ui
const build_the_intervals_list_ui = () => {
  // Hide the start button until there is an interval
  if (timers.length > 0) {
    start_button.style.setProperty('display', 'block');
  } else {
    reset_the_intervals();
  }

  const interval_output = timers.map((timer) => {
    return `<div class="draggable" draggable="true" data-timer-id="${timer.id}">
		<div class="interval">
				${timer.interval_label}
			</div>
		<div class="min">
				${timer.minutes}m
			</div>
			<div class="sec">
				${timer.seconds}s
			</div>
			<div class="remove" data-timer-id="${timer.id}">
				X
			</div>
		</div>`;
  });

  // Update the intervals ui
  interval_ui.innerHTML = interval_output.join('');

  // Grab all of the remove buttons from the interval UI list
  let remove = document.querySelectorAll('.remove');

  // Add an event listener to each remove button
  remove.forEach((item) => {
    item.addEventListener('click', remove_item_from_array, false);
  });

  // The drag and drop reorder code
  const container = document.getElementById('interval_ui');
  let draggedItem = null; // To store the element being dragged

  /**
   * Attaches drag and drop event listeners to all existing and new draggable items.
   */
  function addDragListeners(draggableElement) {
    // Drag start
    draggableElement.addEventListener('dragstart', (e) => {
      draggedItem = draggableElement;
      e.dataTransfer.setData('text/plain', e.target.dataset.timerId);

      // Add a class for visual feedback during the drag
      setTimeout(() => draggableElement.classList.add('dragging'), 0);
    });

    // Drag end
    draggableElement.addEventListener('dragend', () => {
      draggedItem = null;
      draggableElement.classList.remove('dragging');
    });

    // Drag over (on the potential drop target)
    draggableElement.addEventListener('dragover', (e) => {
      e.preventDefault();

      if (draggedItem && draggedItem !== draggableElement) {
        const boundary = e.target.offsetHeight / 2;
        const y = e.offsetY;
        const insertBefore = y < boundary;

        container
          .querySelectorAll('.drop-target-above, .drop-target-below')
          .forEach((el) => {
            el.classList.remove('drop-target-above', 'drop-target-below');
          });

        if (insertBefore) {
          draggableElement.classList.add('drop-target-above');
        } else {
          draggableElement.classList.add('drop-target-below');
        }
      }
    });

    // Drag leave
    draggableElement.addEventListener('dragleave', () => {
      draggableElement.classList.remove(
        'drop-target-above',
        'drop-target-below',
      );
    });

    // Drop
    draggableElement.addEventListener('drop', (e) => {
      e.preventDefault();

      if (draggedItem && draggedItem !== draggableElement) {
        const isTargetAbove =
          draggableElement.classList.contains('drop-target-above');

        if (isTargetAbove) {
          container.insertBefore(draggedItem, draggableElement);
        } else {
          container.insertBefore(draggedItem, draggableElement.nextSibling);
        }

        save_button.style.display = 'block';

        container
          .querySelectorAll('.drop-target-above, .drop-target-below')
          .forEach((el) => {
            el.classList.remove('drop-target-above', 'drop-target-below');
          });
      }
      update_timers();
    });
  }

  // Initial setup for existing items
  document.querySelectorAll('.draggable').forEach(addDragListeners);
};

// Remove the selected interval from the array
const remove_item_from_array = (e) => {
  if (!confirm('Are you sure you want to delete this interval?')) {
    return;
  }

  const timerId = Number(e.target.getAttribute('data-timer-id'));
  const timerIndex = timers.findIndex(timer => timer.id === timerId);

  if (timerIndex !== -1) {
    // Subtract the time from total
    interval_total_time -= timers[timerIndex].totalSeconds;
    timers.splice(timerIndex, 1);

    // Update total time display
    if (interval_total_time > 0) {
      const total_minutes = Math.floor(interval_total_time / 60);
      const remaining_seconds = interval_total_time % 60;
      total_time.innerHTML = `Total time: ${total_minutes}m : ${remaining_seconds}s`;
    } else {
      total_time.innerHTML = '';
    }

    build_the_intervals_list_ui();
  }
};

const reset_the_intervals = () => {
  if (timers.length > 0 && !confirm('Are you sure you want to reset all intervals?')) {
    return;
  }

  timers = [];
  pause = false;
  start_button.style.setProperty('display', 'none');
  interval_ui.innerHTML = 'Waiting for your intervals';
  total_time.innerHTML = '';
  interval_total_time = 0;
  pause_resume_buttons.style.setProperty('display', 'none');
};

const show_interval_description = () => {
  rest_period.value === 'false'
    ? (interval_label.className = 'show') &&
      (interval_description.className = 'show')
    : (interval_label.className = 'hidden') &&
      (interval_description.className = 'hidden');
};

const close_the_modal = () => {
  modal.style.setProperty('display', 'none');
};

// Update the timers array with the new order
const update_timers = () => {
  updated_timers.length = 0;
  const updated_interval_list = document.querySelectorAll('.draggable');
  updated_interval_list.forEach((item) => {
    const timerId = Number(item.dataset.timerId);
    const timer = timers.find(t => t.id === timerId);
    if (timer) {
      updated_timers.push(timer);
    }
  });
  timers = [...updated_timers];
  build_the_intervals_list_ui();
};

const save_timers = () => {
  try {
    save_button.style.display = 'none';
    const timers_stringify = JSON.stringify(timers);
    localStorage.setItem('Timers', timers_stringify);
  } catch (error) {
    console.error('Failed to save timers to localStorage:', error);
    alert('Failed to save timers. Please check your browser settings.');
  }
};

// Check to see if we have a timer saved to local storage
try {
  if (localStorage.getItem('Timers')) {
    let stored_timers = localStorage.getItem('Timers');
    let retrieved_timers = JSON.parse(stored_timers);
    timers = [...retrieved_timers];

    // Ensure nextTimerId is higher than any existing ID
    if (timers.length > 0) {
      nextTimerId = Math.max(...timers.map(t => t.id || 0)) + 1;
    }

    // Recalculate total time
    interval_total_time = timers.reduce((sum, timer) => sum + timer.totalSeconds, 0);

    build_the_intervals_list_ui();

    // Update total time display
    if (interval_total_time > 0) {
      const total_minutes = Math.floor(interval_total_time / 60);
      const remaining_seconds = interval_total_time % 60;
      total_time.innerHTML = `Total time: ${total_minutes}m : ${remaining_seconds}s`;
    }
  }
} catch (error) {
  console.error('Failed to load timers from localStorage:', error);
}

// Create the event listeners
save_button.addEventListener('click', save_timers, false);
user_submit.addEventListener('click', push_timer_options, false);
reset_intervals.addEventListener('click', reset_the_intervals, false);
rest_period.addEventListener('change', show_interval_description, false);
pause_button.addEventListener('click', pause_the_intervals, false);
resume_button.addEventListener('click', resume_the_intervals, false);
close_modal.addEventListener('click', close_the_modal, false);

if (stop_button) {
  stop_button.addEventListener('click', stop_the_intervals, false);
}
