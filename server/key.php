<?php

$char_1 = "abcdefghijklmnopqrstuvwxyz";
$char_2 = "abcdefghijklmnopqrstuvwxyzABCEDFGHIJKLMNOPRSTUVWYZ";
$char_3 = "abcdefghijklmnopqrstuvwxyzABCEDFGHIJKLMNOPRSTUVWYZ0123456789";

$charArray = str_split($char_3);
$length = sizeof($charArray);
$key = "";

for ($i = 1; $i <= 10; $i++) {
    $key .= $charArray[rand(0, $length)];
}

echo $key;

?>