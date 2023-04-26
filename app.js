const main_timer = document.getElementById('main_timer');
const beep = document.getElementById('beep');

const main_output = () => {
	main_timer.textContent = count;
};

const countdown = (num) => {
	let count = num;
	main_timer.textContent = count;
	let countdown = setInterval(() => {
		count--;
		if (count === 0) {
			beep.play();
			clearInterval(countdown);
		}
		main_timer.textContent = count;
	}, 1000);
};
