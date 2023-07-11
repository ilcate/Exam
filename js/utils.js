async function addLoading(loader){
	document.body.prepend(loader);
}

function buildDomImg (div, index, id, c, array, sprite){
	div.src = array[index].sprites[sprite];
	div.classList.add(c);
	qs(id).append(div);
	qs(id).dataset.index = index;
}
	

function betterRandom (min = 0, max = 1) {
	return Math.random() * max;
}

function betterRandomInt (min = 0, max = 1) {
	return Math.round(betterRandom(min, max));
}

function qs (selector) {
	return document.querySelector(selector);
}

function qsa (selector) {
	return document.querySelectorAll(selector);
}

function removeLoading(){
	document.body.removeChild(qs("#loader"));
}


export { betterRandom, betterRandomInt, qs, qsa, removeLoading, addLoading, buildDomImg};