//alert("newajax.js started loading");

function include(filename)
{
  var head = document.getElementsByTagName('head')[0];
  
  script = document.createElement('script');
  script.src = filename;
  script.type = 'text/javascript';
  
  head.appendChild(script);
}

var urlParams={}; //Global variable declaration attached to window , should be the same as (var urlParams;)
(window.onpopstate = function () {
  var match,
  pl     = new RegExp(/\+/g),
  pattern = new RegExp(/([^&=]+)=?([^&]*)/g),
  space=' ';
  //    var everything=window.location;
  /*
     this is a list of window.location
     constructor	Object {}
     hash	""
     host	"192.168.1.157"
     hostname	"192.168.1.157"
     href	"http://192.168.1.157/subassembly.php?subassembly_idx=9&order_by=ASC"
     origin	"http://192.168.1.157"
     pathname	"/subassembly.php"
     port	""
     protocol	"http:"
     search	"?subassembly_idx=9&order_by=ASC"
     assign	assign()
     reload	reload()
     replace	replace()
     valueOf	valueOf()
     __proto__	Object { reload=reload(), replace=replace(), assign=assign(), more...}
   */

  //var entire_string=window.location.search.substring(0);  // typically entire string to the right  ie. "?subassembly_idx=9&order_by=ASC"
  var query  = window.location.search.substring(1);          //  typical just the stuff to the right of ? ie.  "subassembly_idx=9&order_by=ASC"
  // decodeURIComponent
  //  a encode URl looks like http%3A%2F%2Fw3schools.com%2Fmy%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab
  // the same URl decode looks like http://w3schools.com/my test.asp?name=ståle&car=saab
  var mydecode=function (s){ return decodeURIComponent(s.replace(pl, space));};//strips any + signs and replaces with space then translate back to unencode 

  while (match = pattern.exec(query))
  {
    urlParams[mydecode(match[1])] = mydecode(match[2]);
  }
  //alert("onpopstate done");
})();




function myjavastrcmp(a, b) 
{
  if (a===undefined)
    return -1;
  if (b===undefined)
    return -1;
  if (a.toString() < b.toString()) return -1;
  if (a.toString() > b.toString()) return 1;
  return 0;
}

var timeOutMS = 15000; //ms
var ajaxList = new Array();
var ar=Array();
var datatable=[['TIME', 'COMMANDED', 'ACTUAL']];
var dateCurrentNetworkTime = new Date();
var dateLastSampleTime = new Date();
var dateNextSampleTime = new Date();
var dateFirstSampleTime= new Date();
var dateFinishTime=new Date();



function newAJAXCommand(url, container, repeat, data)
{
  // Set up our object
  var newAjax = new Object();
  var theTimer = new Date();
  newAjax.url = url;
  newAjax.container = container;
  newAjax.repeat = repeat;
  newAjax.ajaxReq = null;
  // Create and send the request
  if(window.XMLHttpRequest) {
    newAjax.ajaxReq = new XMLHttpRequest();
    newAjax.ajaxReq.open((data==null)?"GET":"POST", newAjax.url, true);
    if (data!=null)
      newAjax.ajaxReq.upload.onprogress = function(e) {
	if (e.lengthComputable) {
          var percentComplete = (e.loaded / e.total) * 100;
          console.log(percentComplete + '% uploaded');
	}
      };
    newAjax.ajaxReq.send(data);
    // If we're using IE6 style (maybe 5.5 compatible too)
  } else if(window.ActiveXObject) {
    newAjax.ajaxReq = new ActiveXObject("Microsoft.XMLHTTP");
    if(newAjax.ajaxReq) {
      newAjax.ajaxReq.open((data==null)?"GET":"POST", newAjax.url, true);
      newAjax.ajaxReq.send(data);
    }
  }
  newAjax.lastCalled = theTimer.getTime();
  ajaxList.push(newAjax);
}
function pollAJAX() {
  var curAjax = new Object();
  var theTimer = new Date();
  var elapsed;
  // Read off the ajaxList objects one by one
  for(i = ajaxList.length; i > 0; i--)  {
    curAjax = ajaxList.shift();
    if(!curAjax)      continue;
    elapsed = theTimer.getTime() - curAjax.lastCalled;
    // If we suceeded
    if(curAjax.ajaxReq.readyState == 4 && curAjax.ajaxReq.status == 200) {
      if(typeof(curAjax.container) == 'function'){
	if (curAjax.ajaxReq.responseXML)
	  curAjax.container(curAjax.ajaxReq.responseXML.documentElement); // xml ok call function
	else	{
	  // xml is screwed up by php program give helpful diagnostic message
	  show_error(curAjax.url+'->'+curAjax.container.name+' NO XML RETURNED?');
	  show_info("Something wrong with "+htmlentities(curAjax.ajaxReq.responseText));
	}
	curAjax.ajaxReq.abort();
	if(curAjax.repeat)	    newAJAXCommand(curAjax.url, curAjax.container, curAjax.repeat);
	delete curAjax.container;delete curAjax.ajaxReq;delete curAjax.url;delete curAjax.lastCalled;delete curAjax.repeat;
	continue;
      }
      else if(typeof(curAjax.container) == 'string') {	document.getElementById(curAjax.container).innerHTML = curAjax.ajaxReq.responseText;      } 
      // (otherwise do nothing for null values)
      curAjax.ajaxReq.abort();
      if(curAjax.repeat!=null)      {	setTimeout(function(){newAJAXCommand(curAjax.url, curAjax.container, curAjax.repeat);},curAjax.repeat);      }
      delete curAjax.container;delete curAjax.ajaxReq;delete curAjax.url;delete curAjax.lastCalled;delete curAjax.repeat;

      continue;
    }
    else if(curAjax.ajaxReq.readyState == 4 && curAjax.ajaxReq.status == 404) {
      // If it has a container, write the resul
      show_error('404 error '+curAjax.url+' status='+String(curAjax.ajaxReq.status));

      curAjax.ajaxReq.abort();
      if(curAjax.repeat!=null)      {	setTimeout(function(){newAJAXCommand(curAjax.url, curAjax.container, curAjax.repeat);},curAjax.repeat);      }
      delete curAjax.container;delete curAjax.ajaxReq;delete curAjax.url;delete curAjax.lastCalled;delete curAjax.repeat;

      continue;
    }
    else    if(elapsed > timeOutMS) {      // Invoke the user function with null input
      if(typeof(curAjax.container) == 'function'){	show_error('timeout error '+curAjax.url);      } 
      else {alert("Command failed.\nConnection to development board was lost.");      }

      curAjax.ajaxReq.abort();      // If it's a repeatable request, then do so
      if(curAjax.repeat) newAJAXCommand(curAjax.url, curAjax.container, curAjax.repeat);
      delete curAjax.container;delete curAjax.ajaxReq;delete curAjax.url;delete curAjax.lastCalled;delete curAjax.repeat;

      continue;
    }    // Otherwise, just keep waiting
    ajaxList.push(curAjax);
  }// end of for  i= ajaxList
  setTimeout("pollAJAX()",500);  // Call ourselves again in 500ms
}


function getXMLValue(xmlData, field) {
  try {
    if(xmlData.getElementsByTagName(field).length === undefined)
      return null;
    else
    {
      if(xmlData.getElementsByTagName(field).length>0)
      {
	if(xmlData.getElementsByTagName(field)[0].firstChild.nodeValue)
	  return xmlData.getElementsByTagName(field)[0].firstChild.nodeValue;
	else
	  return null;
      }
      else
	return null;
    }  
  } catch(err) { return null; }
}


function updateDatatable(xmlData) {
  // switch (Number(getXMLValue(xmlData, 'mode')))
  // {
  // case 0:
  // document.getElementById('km').innerHTML ='OFF';
  // break;
  // case 1:
  // document.getElementById('km').innerHTML ='RAMP FIRST TEMP';
  // break;
  // case 2:
  // document.getElementById('km').innerHTML ='HOLD FIRST TEMP';
  // break;
  // case 3:
  // document.getElementById('km').innerHTML ='RAMP SECOND TEMP';
  // break;
  // case 4:
  // document.getElementById('km').innerHTML ='HOLD SECOND TEMP';
  // break;
  // case 5:
  // document.getElementById('km').innerHTML ='RAMP THIRD TEMP';
  // break;
  // case 6:
  // document.getElementById('km').innerHTML ='HOLD THIRD TEMP';
  // break;
  // case 7:
  // document.getElementById('km').innerHTML ='RAMP DOWN TEMP';
  // break;
  // case 8:
  // document.getElementById('km').innerHTML ='HOLD DOWN TEMP';
  // break;
  // default:
  // document.getElementById('km').innerHTML ='BROKE????';
  // }
  sFirstSampleTime=getXMLValue(xmlData, 'fst');
  sSP=getXMLValue(xmlData, 'sp');
  sGP_updateDatatable=getXMLValue(xmlData, 'gp');
  sLastSampleTime=getXMLValue(xmlData, 'lst');
  sCapturedTime=sLastSampleTime;
  var dateLocalSampleTime= new Date(1000*Number(sFirstSampleTime) );
  var dateLocalLastSampleTime= new Date(1000*Number(sLastSampleTime) );
  usSamplePoints=Math.max(Number(sSP),Number(sGP_updateDatatable));
  document.getElementById('msg6').innerHTML ='update total points '+usSamplePoints+' first sample='+dateLocalSampleTime.toTimeString().substr(0,5)+' last sample'+dateLocalLastSampleTime.toTimeString().substr(0,5);
  var i=new Number(0)
  usIncrementBy=Math.max(1,Math.floor(usSamplePoints/50));
  dateLocalSampleTime.setTime( dateLocalSampleTime.getTime()-60000 );
  for (i=0;i<usSamplePoints;i++)
  {
    dateLocalSampleTime.setTime( dateLocalSampleTime.getTime()+60000 );
    sC=getXMLValue(xmlData, 'C'+i.toString());
    sT=getXMLValue(xmlData, 'T'+i.toString());
    if (!sC) continue;
    if (!sT) continue;
    datatable.push([dateLocalSampleTime.toTimeString().substr(0,5),Number(sC),Number(sT)]);
  }
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  var data = google.visualization.arrayToDataTable(datatable);
  chart.draw(data, options);
  document.getElementById('msg6').innerHTML=document.getElementById('msg2').innerHTML+' array length='+datatable.length
  document.getElementById('msg6').innerHTML+=' increment by='+usIncrementBy.toString()+' last entry ='+datatable[datatable.length-1].toString();
  dateNextSampleTime.setTime(dateLocalSampleTime.getTime()+(60000)*(usIncrementBy))
  bDone=true;
}
setTimeout("pollAJAX()",500);
//alert("newajax.js installed");


//this piece of code does not work if you put it here


//echo "<script type=\"text/javascript\">\n";
//echo "var urlParams;\n";
//echo " (window.onpopstate = function () {\n";
//echo "   var match,\n";
//echo "         pl     = /\+/g,\n";
//echo "          search = /([^&=]+)=?([^&]*)/g,\n";
//echo "        decode = function (s) { return decodeURIComponent(s.replace(pl, \" \")); },\n";
//echo "         query  = window.location.search.substring(1);\n";
//echo "    urlParams = {};\n";
//echo "   while (match = search.exec(query))\n";
//echo "  urlParams[decode(match[1])] = decode(match[2]);\n";
//echo " })();\n";
//echo "</script>\n";
