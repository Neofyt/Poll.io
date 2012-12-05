<?php
header('Content-Type: application/json');

$file_votes = 'votes.json';
$file_persons = 'persons.json';

if (isSet($_GET['resto'])) {

	$votes = json_decode(file_get_contents($file_votes));

	if(isSet($_GET['type']) && $_GET['type'] === "add"){

		// Traitement du vote
		$votes->$_GET['resto']++;
		
		$result = '{"resto":"'.$_GET['resto'].'","votes":'.$votes->$_GET['resto']."}";

		file_put_contents($file_votes, json_encode($votes));

		
		// Affectation du vote à la personne
		$persons = json_decode(file_get_contents($file_persons));

		$persons->$_GET['who'] = $_GET['resto'];

		file_put_contents($file_persons, json_encode($persons));


		// On retourne la nombre de votes
		echo $result;


	} else if (isSet($_GET['type']) && $_GET['type'] === "consult"){
		
		$result = '{"resto":"'.$_GET['resto'].'","votes":'.$votes->$_GET['resto'].',"num":'.$_GET['num']."}";
		
		echo $result;
	}
    
} else {

	echo file_get_contents($file_votes);
}

?>