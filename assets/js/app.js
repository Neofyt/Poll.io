// ============
// VARIABLES
// ============

var w = window,
	prev, 
	next,
	nombre,
	question,
	questionnaire,
	reponses,
	suites,
	goTo,
	tpl,
	Poll = {},
	hash = w.location.hash.replace("#",""),
	entityMap = {
		"[e1]": "&eacute;",
		"[e2]": "&egrave;",
		"[i]": "ï"
	};


// ============
// HELPERS
// ============

function k(c, f, p){
	if (w.c === c) {
		p ? f(p) : f();
	}
}

function lgth(object){
	return Object.keys(object).length;
}

function upperCase(str){
	return str.charAt(0).toUpperCase() + str.substring(1);
}

function convertChar(string){
	return String(string).replace(/\[(e1|e2|i)\]/g, function(s){
		return entityMap[s];
	});
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

function getQuestionnaire(id){
	$.get("https://api.github.com/gists/" + id, function(data){
		questionnaire = JSON.parse(data.files.questionnaire.content).questions;
	}).complete(function(){
		nombre = lgth(questionnaire);
		w.i = 0;
		setI(0);
	}).fail(function(){
		info("nf");
	});
}

function setI(i){
	prev = w.i;
	w.i = (w.i + i === 0) ? 0 : w.i + i;

	if (w.i > nombre - 1) w.i = nombre - 1;
	next = w.i;

	if(w.i === 0){
		display(0);
	} else if (next !== prev) {
		display(w.i);
	}
	console.log(prev, w.i, next);
}

function display(i){
	if(questionnaire[i]){
		question = questionnaire[i];
		$("#holder").html(convertChar(question.q));
		$(".buttons").empty().html(parseQ(question.a, i));	
		w.i = i;
		setProgress(i+1);
	}
}

function parseQ(q, n){
	reponses = q.match(/[a-z]+/g);
	suites = q.match(/\d/g) || n+2; 

	tpl = "";

	for (var i = 0, length = reponses.length; i < length; i++) {
		goTo = suites[i] || suites;
		tpl += '<button class="' + reponses[i] +'" data-go="' + goTo +'" onclick="proceed(this,' + n +')">' + upperCase(reponses[i]) +'</button>';
	}

	return tpl;
}

function proceed(q, n){
	$q = $(q);
	set(n+1, $q.text());
	display($q.data("go")-1);
}


// ================
// FEEDBACK TO USER
// ================

function setProgress(n){
	$("#indicator").css("width", (n*100) / nombre + "px");
}

function setMessage(cls, msg){
	$("#holder").addClass(cls).html(msg); 
}

var triggerInfo = {
	hash: function() { setMessage("red", "Oups !! Something went wrong &#9785;"); },
	nf: function() { setMessage("red", "Questionnaire was not found. Please check the URL."); }
}

function info(msg){
	triggerInfo[msg]();
}


// ===================
// RUN YOU CLEVER BOY
// ===================

$(document).ready(function(){
	isFirstRun();

	(hash !== "") ? getQuestionnaire(hash) : info("hash");

	$(this).keydown(function(e){
		w.c = e.keyCode;
		k(37, setI, -1); // 37 = left
		k(39, setI, 1); // 39 = right
	});
});