// ==========
// VARIABLES
// ==========

var w = window,
	prev, 
	next,
	nombre = Object.keys(questionnaire).length,
	question,
	reponses,
	suites,
	tpl,
	answers = {};


// ==========
// HELPERS
// ==========

function k(c, f, p) {
	if (w.c === c) {
		p ? f(p) : f();
	}
}

function upperCase(str){
	return str.charAt(0).toUpperCase() + str.substring(1);
}


// ==========
// FUNCTIONS
// ==========

function setI(i) {
	prev = w.i;
	w.i = (w.i + i === 0) ? 1 : w.i + i;

	if (w.i > nombre) w.i = nombre;
	next = w.i;
	if (next !== prev) {
		display(w.i);
	}
}

function display(i) {
	question = questionnaire[i];
	$("#question").text(question.q);
	$(".buttons").empty().html(parseQ(question.a, i));
}

function parseQ(q, n){
	reponses = q.match(/[a-z]+/g);
	suites = q.match(/\d/g) || next;

	tpl = "";

	for (var i = 0, length = reponses.length; i < length; i++) {
		tpl += '<button class="' + reponses[i] +'" data-go="' + suites[i] +'" onclick="treat(this,' + n +')">' + upperCase(reponses[i]) +'</button>';
	}

	return tpl;
}

function treat(q, n){
	$q = $(q);
	answers[n] = $q.text();

		console.log(answers);

	w.i = $(q).data("go");
	display(w.i);
}



$(document).ready(function () {
	w.i = 0;
	setI(1);

	$(this).keydown(function (e) {
		w.c = e.keyCode;
		k(37, setI, -1); // 37 = left
		k(39, setI, 1); // 39 = right
	});
});