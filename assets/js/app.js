// ============
// VARIABLES
// ============

var w = window,
	prev, 
	next,
	nombre = lgth(questionnaire),
	question,
	reponses,
	suites,
	tpl,
	Poll = {};


// ============
// HELPERS
// ============

function k(c, f, p){
	if (w.c === c) {
		p ? f(p) : f();
	}
}

function upperCase(str){
	return str.charAt(0).toUpperCase() + str.substring(1);
}

function lgth(object){
	return Object.keys(object).length;
}


// ============
// POLL OBJECT
// ============

function isFirstRun(){
	localStorage.getItem("Poll") ? load() : save();
}

function load(){
	Poll = JSON.parse(localStorage.getItem("Poll"));
}

function save(){
	localStorage.setItem("Poll", JSON.stringify(Poll));
	load();
}

function set(num, val){
	Poll[num] = val;
	save();
}

function get(num){
	return Poll[num];
}


// ============
// INTERFACE
// ============

function setI(i){
	prev = w.i;
	w.i = (w.i + i === 0) ? 1 : w.i + i;

	if (w.i > nombre) w.i = nombre;
	next = w.i;
	if (next !== prev) {
		display(w.i);
	}
}

function display(i){
	if(questionnaire[i]){
		question = questionnaire[i];
		$("#question").text(question.q);
		$(".buttons").empty().html(parseQ(question.a, i));	
	}
}

function parseQ(q, n){
	reponses = q.match(/[a-z]+/g);
	suites = q.match(/\d/g) || next;

	tpl = "";

	for (var i = 0, length = reponses.length; i < length; i++) {
		tpl += '<button class="' + reponses[i] +'" data-go="' + suites[i] +'" onclick="proceed(this,' + n +')">' + upperCase(reponses[i]) +'</button>';
	}

	return tpl;
}

function proceed(q, n){
	$q = $(q);
	set(n, $q.text());
	setProgress();
	display($q.data("go"));
}

function setProgress(){
	$("#progress").text(lgth(Poll)+1 + "/" + lgth(questionnaire));
}


// ===================
// RUN YOU CLEVER BOY
// ===================

$(document).ready(function(){
	isFirstRun();

	w.i = 0;
	setI(1);

	$(this).keydown(function(e){
		w.c = e.keyCode;
		k(37, setI, -1); // 37 = left
		k(39, setI, 1); // 39 = right
	});
});