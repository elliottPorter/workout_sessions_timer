/**
 * Jump Rope Timer Application
 * Countdown timer with audio notification
 */

const mainTimer = document.getElementById('main_timer');
const beep = document.getElementById('beep');
const startButton = document.getElementById('start_button');

let currentTimer = null;

/**
 * Starts a countdown timer
 * @param {number} seconds - Number of seconds to count down
 */
const countdown = (seconds) => {
	// Prevent multiple concurrent timers
	if (currentTimer !== null) {
		clearInterval(currentTimer);
	}

	// Disable button during countdown
	startButton.disabled = true;
	startButton.setAttribute('aria-busy', 'true');

	let count = seconds;
	mainTimer.textContent = count;

	currentTimer = setInterval(() => {
		count--;
		mainTimer.textContent = count;

		if (count === 0) {
			// Handle audio playback with error handling
			beep.play().catch(error => {
				console.error('Audio playback failed:', error);
				// Fallback: visual notification if audio fails
				mainTimer.style.color = '#ff0000';
				setTimeout(() => {
					mainTimer.style.color = '#eee';
				}, 500);
			});

			clearInterval(currentTimer);
			currentTimer = null;
			
			// Re-enable button
			startButton.disabled = false;
			startButton.removeAttribute('aria-busy');
		}
	}, 1000);
};

// Initialize event listener when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	startButton.addEventListener('click', () => {
		countdown(5);
	});
});
