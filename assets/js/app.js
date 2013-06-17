// ============
// VARIABLES
// ============

var w = window,
	tpl,
	prev, 
	next,
	nombre,
	question,
	questionnaire,
	reponses,
	suites,
	goTo,
	max,
	Poll = {},
	hash = w.location.hash.replace("#",""),
	entityMap = {
		"[e1]": "&eacute;",
		"[e2]": "&egrave;",
		"[i1]": "&iuml;"
	},
	templates = {
		button : "<button class='{0}' data-go='{1}' onclick='proceed(this,{2})'>{3}</button>",
		range : "<input type='radio' name='r{0}' id='r{1}' value='{1}' /><label for='r{1}' class='r{2}' onclick='proceed(this,{0})' data-go='{3}'>{1}</label>"
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
	return String(string).replace(/\[(e1|e2|i1)\]/g, function(s){
		return entityMap[s];
	});
}

String.prototype.format = function(){
	var string = this;

	for (var i = 0, j = arguments.length; i < j; i++) {
		string = string.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}

	return string;
};


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

	w.i = (w.i + i <= 0) ? 0 : w.i + i; // beginning of object
	w.i = (w.i > nombre - 1) ? nombre - 1 : w.i; // end of object
	
	next = w.i;

	if(w.i === 0){
		display(0);
	} else if (next !== prev) {
		display(w.i);
	}
}

function display(i){
	if(questionnaire[i]){
		question = questionnaire[i];
		$("#holder").html(convertChar(question.q));
		$(".buttons").html(parseQ(question.a, i));	
		w.i = i;
		setProgress(i+1);
	}
}

function parseQ(a, n){
	tpl = "";

	// Range
	if(a.match(/range/g)){
		max = a.match(/\d/g) || 5;
		goTo = n + 2;

		for (var i = 0; i < max; i++){
			tpl += templates.range.format(n, i, max, goTo);
		}

	// Basic question
	} else {
		reponses = a.match(/[a-z]+/g);
		suites = a.match(/\d/g) || n+2; 

		for (var i = 0, length = reponses.length; i < length; i++) {
			goTo = suites[i] || suites;
			tpl += templates.button.format(reponses[i], goTo, n, upperCase(reponses[i]));
		}
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