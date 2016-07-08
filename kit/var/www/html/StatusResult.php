<?php
//assembly
//subassembly
//subheader1
include_once ("functions.php");
show_xmlHeader();
    show_diagnostic("help");
//    show_error(__FILE__,__LINE__,"failed select " . "pdo->errorInfo()");
echo "<status>1</status>\n";


echo "</root>\n";
exit;
?> 
