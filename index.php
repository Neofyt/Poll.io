<?php
include("server/reader.php");

?>

<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Poll.io</title>
	<link rel="stylesheet" href="assets/css/style.css?v=1.5" />
	<link rel="shortcut icon" type="image/png" href="about:blank" />
</head>
<body>
    
	<div class="wrapper">
		<h1>Poll.io</h1>
		
		<h2>Question exemple</h2>
		
		<div class="wrapper">
			<section class="yes">Oui</section>
			<section class="mb">Peut-être</section>
			<section class="no">Non</section>
		</div>
		
		<p class="control-inline">
			<input class="styled-checkbox" id="features-lightweight" type="checkbox" value="lightweight"><label for="features-lightweight">Voir les résultats</label>
		</p>


	</div>

	

	
	<canvas></canvas>
	
	<script src="http://api.neofyt.com/jquery/?last"></script>
	<script src="assets/js/map.js"></script>

</body>
</html>