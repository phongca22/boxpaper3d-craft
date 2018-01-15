function getResourceUrl(path) {
    return APP_CONF.context + "/" + APP_CONF.directory + "/" + path;
}

function getScrollBarWidth(id) {
	var element = document.getElementById(id);
	return element && element.scrollHeight > element.clientHeight ?
		(element.offsetWidth - element.clientWidth) + 'px' : '';
}

function getImageResource(path) {
    return APP_CONF.context + "/images/" + path;
}

function getAPIUrl(path) {
	return APP_CONF.api + path;
}

function getScrollBarInVirtualRepeat(elementId){
	var elem = document.getElementById(elementId);
	if (!elem) return;
	var el = elem.querySelector(".md-virtual-repeat-scroller");
	return el && el.scrollHeight > el.clientHeight ? (el.offsetWidth - el.clientWidth) + 'px' : '0px';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
