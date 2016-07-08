<?php
# functions.php



function show_xmlHeader(){
header('Content-type: text/xml');
header('Pragma: public');
header('Cache-control: private');
header('Expires: -1');
echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<root>\n";
}
function show_info($string){  echo "<Info>".htmlentities(stripslashes(trim($string)))."</Info>\n";}
function show_diagnostic($string){ global $num; echo "<Diagnostic$num>".htmlentities(stripslashes(trim($string)))."</Diagnostic$num>\n";$num++;}
function show_clean_exit($string){  echo "<ShowCleanExit>".htmlentities(stripslashes(trim($string)))."</ShowCleanExit>\n</root>\n";  exit;}
function show_error($FILE,$LINE,$string){  echo "<ShowError>$FILE $LINE  HAS Error  ".htmlentities(stripslashes(trim($string)))."</ShowError>\n</root>\n";  exit;}
 function my_htmlentities($input){
       $string = htmlentities($input,ENT_NOQUOTES,'UTF-8');
       $string = str_replace('&euro;',chr(128),$string);
       $string = html_entity_decode($string,ENT_NOQUOTES,'ISO-8859-15');
       return $string;
   }




?>
