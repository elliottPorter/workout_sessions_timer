const main_timer = document.getElementById('main_timer');
const beep = document.getElementById('beep');

const main_output = () => {
	main_timer.textContent = count;
};

const countdown = () => {
	console.log('button clicked');
	let count = 5;

	let countdown = setInterval(() => {
		console.log(count);
		main_timer.textContent = count--;
		if (count === -1) {
			beep.play();
			clearInterval(countdown);
		} else if (count === 0) {
		}
	}, 1000);
};
