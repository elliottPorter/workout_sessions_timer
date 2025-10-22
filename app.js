// create the variables
//#region for variables
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
const stop_button = document.getElementById('stop');
const pause_button = document.getElementById('pause_timer');
const resume_button = document.getElementById('resume_timer');
const pause_resume_buttons = document.getElementById('buttons_container');
const next_timer = document.getElementById('next_timer');
const start_count = 5;
let pause = false;
let total_minutes = 0;
let total_seconds = 0;
let remaining_seconds = 0;
let interval_total_time = 0;
let timers = [];
//#endregion

// functions to pause and resume the intervals
const pause_the_intervals = () => {
  pause = true;
};

const resume_the_intervals = () => {
  pause = false;
};

// give 5 seconds to get ready for start
const countdown_start = (num) => {
  let starter = start_count;
  modal_start.style.setProperty('display', 'block');
  modal_start.innerHTML = `<div>First up<br><strong>${timers[num].interval_label}</strong><br>in ${starter} seconds...</div>`;
  let get_ready = setInterval(() => {
    starter--;
    if (starter >= 0) {
      modal_start.innerHTML = `<div>First up<br><strong>${timers[num].interval_label}</strong><br>in ${starter} seconds...</div>`;
      if (starter <= 3 && starter > 0) {
        low_beep.play();
      } else if (starter === 0) {
        beep.play();
      }
    } else {
      clearInterval(get_ready);
      start_the_intervals(num);
    }
  }, 1000);
};

// the function call from the start button
const start_the_intervals = (num) => {
  modal_start.style.setProperty('display', 'none');
  modal.style.setProperty('display', 'block');
  let interval_count = timers.length;
  let count = null;
  if (num < interval_count) {
    count = Number(timers[num].totalSeconds);
  }

  // create the minutes and seconds for the UI
  let ui_minutes = Math.floor(count / 60);
  let ui_seconds = Math.floor(count % 60);

  // the output for the UI minutes and seconds
  let count_for_ui = `${ui_minutes}m ${ui_seconds}s`;

  // update the UI counter
  main_label.textContent = timers[num].interval_label;
  main_timer.textContent = count_for_ui;

  // set the next interval UI
  if (num < interval_count - 1) {
    next_timer.textContent = `Up next: ${timers[num + 1].interval_label}`;
  } else if (num === interval_count - 1) {
    next_timer.textContent = `Final interval`;
  }

  // add a second to all but the first interval
  if (num !== 0) {
    count++;
  }

  // the timer countdown function
  let countdown = setInterval(() => {
    // check to ensure we are not paused first
    if (pause === false) {
      // decrease the total seconds by 1
      count--;

      // if countdown is ending ( 3 seconds left ) play beeps
      if (count <= 3 && count > 0) {
        low_beep.play();
      } else if (count === 0) {
        beep.play();
        // check the index parameter value and use for recursion
        if (num < interval_count - 1) {
          clearInterval(countdown);
          start_the_intervals(num + 1);
        } else if (num === interval_count - 1) {
          clearInterval(countdown);
          next_timer.textContent = `Session complete`;
          reset_the_intervals();
        }
      }
      let ui_minutes = Math.floor(count / 60);
      let ui_seconds = Math.floor(count % 60);

      let count_for_ui = `${ui_minutes}m ${ui_seconds}s`;

      // update the UI counter
      main_timer.textContent = count_for_ui;
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
  interval_total_time += totalSeconds;

  // function to create total time with minutes and remaining seconds
  const create_total_time_for_ui = (seconds) => {
    total_minutes = Math.floor(parseInt(seconds) / 60);
    remaining_seconds = seconds %= 60;

    return `Total time: ${total_minutes}m : ${remaining_seconds}s`;
  };

  // update the total time in ui
  total_time.innerHTML = create_total_time_for_ui(interval_total_time);

  // send the interval content to the array
  timers.push({
    interval_label: rest ? 'Rest' : interval_description.value,
    rest: rest,
    minutes: minutes.value,
    seconds: seconds.value,
    totalSeconds: totalSeconds,
  });

  // console.log(typeof interval_label);
  // reset the pause and resume buttons container to display after first sessions end
  pause_resume_buttons.style.setProperty('display', 'flex');

  // console.log('The timer array is ', timers);

  // call the intervals ui
  build_the_intervals_list_ui();
};

// function to create the intervals ui
const build_the_intervals_list_ui = () => {
  // hide the start button until there is an interval
  if (timers.length > 0) {
    start_button.style.setProperty('display', 'block');
  } else {
    reset_the_intervals();
  }

  const interval_output = timers.map((timer, index) => {
    return `<div id=${index} class="draggable" draggable="true">
		<div class="interval">
				${timer.interval_label}
			</div>
		<div class="min">
				${timer.minutes}m
			</div>
			<div class="sec">
				${timer.seconds}s
			</div>
			<div class="remove" id=${index}>
				X
			</div>
		</div>`;
  });

  // update the intervals ui
  interval_ui.innerHTML = interval_output.join('');

  // grab all of the remove buttons from the interval UI list
  let remove = document.querySelectorAll('.remove');

  // add an event listener to each remove button
  remove.forEach((item) => {
    item.addEventListener('click', remove_item_from_array, false);
  });

  // the drag and drop reorder code
  const container = document.getElementById('interval_ui');
let draggedItem = null; // To store the element being dragged

/**
 * Attaches drag and drop event listeners to all existing and new draggable items.
 */
function addDragListeners(draggableElement) {
    // DRAG START
    draggableElement.addEventListener('dragstart', (e) => {
        draggedItem = draggableElement;
        // The dataTransfer object is necessary for drag-and-drop to work,
        // even if no data is actually transferred.
        e.dataTransfer.setData('text/plain', e.target.id);
        // Add a class for visual feedback during the drag
        setTimeout(() => draggableElement.classList.add('dragging'), 0);
    });

    // DRAG END
    draggableElement.addEventListener('dragend', () => {
        draggedItem = null;
        // Remove the visual feedback class
        draggableElement.classList.remove('dragging');
    });

    // DRAG OVER (on the potential drop target)
    draggableElement.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevents default behavior (e.g., forbidding drop)

        if (draggedItem && draggedItem !== draggableElement) {
            // Determine if the dragged item is moving above or below the current element
            const boundary = e.target.offsetHeight / 2;
            const y = e.offsetY;
            const insertBefore = y < boundary;

            // Apply visual styling (optional, but helpful)
            container.querySelectorAll('.drop-target-above, .drop-target-below').forEach(el => {
                el.classList.remove('drop-target-above', 'drop-target-below');
            });

            if (insertBefore) {
                draggableElement.classList.add('drop-target-above');
            } else {
                draggableElement.classList.add('drop-target-below');
            }
        }
    });

    // DRAG LEAVE
    draggableElement.addEventListener('dragleave', (e) => {
        // Clear temporary drop visual indicators
        draggableElement.classList.remove('drop-target-above', 'drop-target-below');
    });

    // DROP
    draggableElement.addEventListener('drop', (e) => {
        e.preventDefault();

        if (draggedItem && draggedItem !== draggableElement) {
            const isTargetAbove = draggableElement.classList.contains('drop-target-above');

            if (isTargetAbove) {
                // Insert the dragged item before the current element
                container.insertBefore(draggedItem, draggableElement);
            } else {
                // Insert the dragged item after the current element
                container.insertBefore(draggedItem, draggableElement.nextSibling);
            }

            // Clear temporary drop visual indicators from all elements
            container.querySelectorAll('.drop-target-above, .drop-target-below').forEach(el => {
                el.classList.remove('drop-target-above', 'drop-target-below');
            });

            // *OPTIONAL: Update your application's underlying data model (e.g., the array of timers)
            // to reflect the new order, which is crucial for persistence.*
        }
    });
}

// Initial setup for existing items
document.querySelectorAll('.draggable').forEach(addDragListeners);


};

// remove the selected interval from the array
const remove_item_from_array = (e) => {
  const e_id = Number(e.target.getAttribute('id'));
  timers.splice(e_id, 1);
  build_the_intervals_list_ui();
};

const reset_the_intervals = () => {
  timers = [];
  start_button.style.setProperty('display', 'none');
  interval_ui.innerHTML = 'Waiting for your intervals';
  total_time.innerHTML = '';
  interval_total_time = 0;
  pause_resume_buttons.style.setProperty('display', 'none');
};

console.log(typeof pause_resume_buttons);

const show_interval_description = () => {
  rest_period.value === 'false'
    ? (interval_label.className = 'show') &&
      (interval_description.className = 'show')
    : (interval_label.className = 'hidden') &&
      (interval_label.className = 'hidden');
};

const close_the_modal = () => {
  modal.style.setProperty('display', 'none');
};

// create the event listeners
// #region for event listeners
user_submit.addEventListener('click', push_timer_options, false);
reset_intervals.addEventListener('click', reset_the_intervals, false);
rest_period.addEventListener('change', show_interval_description, false);
pause_button.addEventListener('click', pause_the_intervals, false);
resume_button.addEventListener('click', resume_the_intervals, false);
close_modal.addEventListener('click', close_the_modal, false);
reset_intervals.addEventListener('click', reset_the_intervals, false);
// #endregion
