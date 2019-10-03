

window.addEventListener('load', function() {
    console.log('All assets are loaded')
    fetch('/images').then(body => body.json()).then(response => {
        console.log(response)
        response.forEach(element => {
            const img = document.createElement('div');
            img.setAttribute('class', 'slide');
            img.setAttribute('style', `background-image: url(${'/bilder/' + element})`);
            document.querySelector('.slider-container').appendChild(img);
        });
        const slides = document.querySelectorAll('.slider-container .slide'); // get all the slides
const eraser = document.querySelector('.eraser'); // the eraser
const prev = document.getElementById('previous'); // previous button
const next = document.getElementById('next'); // next button
const intervalTime = 6000; // time until nextSlide triggers in miliseconds
const eraserActiveTime = 500; // time to wait until the .eraser goes all the way
let sliderInterval; // variable used to save the setInterval and clear it when needed


const nextSlide = () => {
  // Step 1. Add the .active class to the eraser - this will trigger the eraser to move to the left.
	eraser.classList.add('active');
   // Step 2. Set a timeout that will allow the eraser to move all the way to the left. This is where we'll use the eraserActiveTime - it has to be the same as the CSS value we mentioned above.
	setTimeout(() => {
    // Step 3. Get the active .slide and toggle the .active class on it (in this case, remove it).
		const active = document.querySelector('.slide.active');
		active.classList.toggle('active');
    // Step 4. Check to see if the .slide has a next element sibling available. If it has, add the .active class to it.
		if(active.nextElementSibling) {
			active.nextElementSibling.classList.toggle('active');
		} else {
      // Step 5. If it's the last element in the list, add the .active class to the first slide (the one with index 0).
			slides[0].classList.toggle('active');
		}
    // Step 6.Remove the .active class from the eraser - this will trigger the eraser to move back to the right. It also waits 200 ms before doing this (just to give enough time for the next .slide to move in place).
		setTimeout(() => {
			eraser.classList.remove('active');
		}, 180);
	}, eraserActiveTime);
}

//Button functionality
const prevSlide = () => {
	eraser.classList.add('active');
	setTimeout(() => {
		const active = document.querySelector('.slide.active');
		active.classList.toggle('active');
    // The *changed* part from the nextSlide code
		if(active.previousElementSibling) {
			active.previousElementSibling.classList.toggle('active');
		} else {
			slides[slides.length-1].classList.toggle('active');
		}
    // End of the changed part
		setTimeout(() => {
			eraser.classList.remove('active');
		}, 180);
	}, eraserActiveTime);
}

next.addEventListener('click', () => {
	nextSlide();
	clearInterval(sliderInterval);
	sliderInterval = setInterval(nextSlide, intervalTime);
});

prev.addEventListener('click', () => {
	prevSlide();
	clearInterval(sliderInterval);
	sliderInterval = setInterval(nextSlide, intervalTime);
});

sliderInterval = setInterval(nextSlide, intervalTime);

// Initial slide
setTimeout(nextSlide, 500);
    })
})

