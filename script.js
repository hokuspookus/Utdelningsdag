function submitPostalCode() {
	const postalCode = document.getElementById('postalCodeInput').value;
	fetchData(postalCode);
}

const boxes = document.querySelectorAll('.box');

function handleMouseMove(event) {
	const box = event.currentTarget;
	const rect = box.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;
	const boxWidth = box.offsetWidth;
	const boxHeight = box.offsetHeight;

	const rotateX = (mouseY / boxHeight - 0.5) * 20 * -1;
	const rotateY = (mouseX / boxWidth - 0.5) * 20;

	box.style.setProperty('--rotate-x', `${rotateX}deg`);
	box.style.setProperty('--rotate-y', `${rotateY}deg`);
}


const date = new Date();

async function fetchData(postalCode) {
	const url = `https://portal.postnord.com/api/sendoutarrival/closest?postalCode=${postalCode}`;
	const response = await fetch(url);
	const data = await response.json();
	const delivery = data.delivery;
	const upcoming = data.upcoming;

	displayData(delivery, upcoming);
	calculateDue(delivery);
}

function displayData(delivery, upcoming) {
	document.getElementById('delivery').textContent = 'Leverans: ' + delivery;
	document.getElementById('upcoming').textContent = 'Kommande: ' + upcoming;
}

function calculateDue(delivery) {
	const dateParts = delivery.split(/[\s,]+/);
	const monthNames = {
		jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5,
		jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11
	};
	const deliveryDate = new Date(dateParts[2], monthNames[dateParts[1].toLowerCase()], dateParts[0]);

	const currentDate = new Date();
	const diffTime = Math.abs(deliveryDate - currentDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	document.getElementById('due').textContent = 'Leverans om: ' + diffDays + ' dagar';
}

fetchData('52130');
