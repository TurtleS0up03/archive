//this is a ajax called function
function updateStatusResult(xmlData) {
  var x;
  var status;



  status=getXMLValue(xmlData, 'status');

    x=document.getElementById('idStatus');

  if (!x)
    document.getElementById('msg11').innerHTML="<p><b><font size=\"6\" color=\"red\">updateStatusResult.js bad idStatus</font></b></p>";


    if (!status)
	document.getElementById('idStatus').style.display='inline';
    else
	document.getElementById('idStatus').style.display='none';



}

