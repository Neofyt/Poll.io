<?php
header("Content-Type: text/plain");

function parse_query($query) {

    if (is_file($query.".md")){
        $menu = htmlentities(file_get_contents($query.".md"));
    } else {
        echo "Fichier de menu non encore créé."; 
    }
   
    echo $menu; 
}

$query = $_GET['resto'];

if ($query !== ""){
    parse_query($query);
} else {
    echo "Requête vide..."; 
}

?>