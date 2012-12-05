// ==========
// VARIABLES
// ==========

var canvas = document.getElementsByTagName('canvas')[0],
	ctx = canvas.getContext('2d'),
	fillColor = "#777",
	arrayVotes = [12,3,6];

	canvas.width = canvas.height = 16;


// ==========
// FUNCTIONS
// ==========

function getScore() {
	for (var i = 0, length = restos.length; i < length; i++) {
		$.get('http://neofyt.com/cmg/server/index.php', {"resto": restos[i].id, "type": "consult", "num": i}, function(data) {
			$("#"+data.resto+"count").text(data.votes);
			arrayVotes[data.num] = data.votes;
		}).complete(function() {
			drawFavicon();
		});
	}
}

function setFold(state) {
	var mL, w;

	if(state === "open") {
		mL = "400px";
		w = "600px";
		window.isOpened = true;
	} else {
		mL = "-200px";
		w = "500px";
		window.isOpened = false;
	}

	$("#fold").animate({
	   	marginLeft: mL,
	   	width: w
	}, 300);
}

function loadData(delay) {
	setTimeout(function() {
		$.get('http://neofyt.com/cmg/data/menus/index.php', {"resto": window.resto}, function(data) {
			$("#menu").empty().append(converter.makeHtml(data));
		}).complete(function() {
			setFold("open");
		});
	}, delay);
}

function voter() {
	var person = $("#confirmInput").val();

	if(person !== "") {
		if (people.has(person)) {
			$.get('http://neofyt.com/cmg/server/index.php', {"resto": window.resto, "type": "add", "who": escapeChar(person)}, function(data) {
				getScore();
			}).complete(function() {
				$("#form").fadeOut(200);
				$("#feedback").empty().append("<p class='success'>Vote enregistré.<br /><br />Merci " + keepFirstName(person) + " !!</p>").delay(200).fadeIn(200).delay(2000).fadeOut(200);
				$("#shadow").delay(2600).fadeOut('fast');
			});
		} else {
			console.log(person);
		}
	} else {
		console.log(person);
	}
}

function ulc(number) { // y position for Upper left corner of bar in the canvas histogram
	return parseInt(16 - ((((arrayVotes[number]*100)/arrayVotes.max())*16)/100));
	//return number;
}

function drawFavicon(a,b,c) {
	ctx.clearRect(0, 0, 16, 16);

	//ctx.fillStyle = "#fff"; // First restaurant
	//ctx.fillRect(0, 0, 16, 16);

	ctx.fillStyle = "#349534"; // First restaurant
	ctx.fillRect(0, ulc(0), 4, 16-ulc(0));

	ctx.fillStyle = "#656565"; // Second one
	ctx.fillRect(6, ulc(1), 4, 16-ulc(1));

	ctx.fillStyle = "#d12F19"; // Third one
	ctx.fillRect(12, ulc(2), 4, 16-ulc(2));

	$('link[rel="shortcut icon"]').prop('href', canvas.toDataURL());
}


// ==========
// HELPERS
// ==========

Array.prototype.has=function(v) {
	for (var i = 0, length = this.length; i < length; i++) {
		if (this[i] == v) return true;
	}
	return false;
};

Array.prototype.max = function() {
	var max = this[0];
	for (var i = 1, length = this.length; i < length; i++) {
		if (this[i] > max) {
			max = this[i];
		}
	} 
	return max;
}

var entityMap = {
    "é": "e",
    " ": "_",
    ".": "",
    "è": "e",
    "ï": "i"
};

function escapeChar(string) {
    return String(string).replace(/[é .èï]/g, function(s) {
        return entityMap[s];
    });
}

function keepFirstName(string) {
	return String(string).replace(/( \w\.$)/g, "");
}


// ==========
// ONLOAD
// ==========

(function() {

	window.onload = function() {

		drawFavicon(12,3,7);
	}
})();