/**
*
* volume_calc.js
* a configurable widget you can use to calculate the volume of a space in cubic feet
*
* @inputs script tag accepts title, font, width, margin, padding & background color parameters in standard CSS form, 
* length, width & depth fields are used for calculating volume
*
* @author Mark Thompson <mark@smithandthompson.net>
* @copyright Smith & Thompson, Inc. 2011
*
* Smith & Thompson, Inc.
* http://www.smithandthompson.net
* 
* Thanks to: 
*	Kent Brewster for his clear and inspiring examples <http://kentbrewster.com/case-hardened-javascript/>
* 	Eric Miraglia for the Javascript Module Pattern <http://yuiblog.com/blog/2007/06/12/module-pattern/>
* 	Dustin Diaz for the excellent JSON article <http://www.dustindiaz.com/json-for-the-masses/>
*	and James Edwards for his generic onload pattern <http://www.brothercake.com/site/resources/scripts/onload/>	
*
**/

// wrap everything in an anonymous function
( function() {

	// create a random character name to protect our root global namespace
	var randName = '';
	for (var i = 0; i < 16; i++) {
		randName += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
	}
	
	// create our namespace object
	window[randName] = {};
	var $ = window[randName];
	
	$.f = function() {
			return {
				
				// inititialize everything
				init : function(target) {
					var theScripts = document.getElementsByTagName('SCRIPT');
					for (var i = 0; i < theScripts.length; i++) {
						if (theScripts[i].src.match(target)) {
							$.w = document.createElement('DIV');
							
							// parse the script tag for params in json format
							$.a = {};
							if (theScripts[i].innerHTML) {
								$.a = $.f.parseJson(theScripts[i].innerHTML);
							}
							
							if ($.a.err) {
								alert('bad json!');
							}
							
							// set defaults & assign params where set
							
							// title
							$.w.title = "Garden Mix Calculator";
							if( typeof $.a.title == "string"){
								$.w.title = $.a.title;
							}
							
							// set the title
							$.w.td = document.createElement('DIV');
							$.w.td.style.textAlign = "left";
							$.w.appendChild($.w.td);
							$.w.td.t = document.createElement('H1');
							$.w.td.t.appendChild(document.createTextNode($.w.title));
							$.w.td.t.style.fontSize = "15px";
							$.w.td.t.style.fontWeight = "bold";
							$.w.td.t.style.margin = "0 0 15px 0";
							$.w.td.t.style.padding = "0";
							$.w.td.appendChild($.w.td.t);
							
							// font
							$.w.style.fontFamily = "Arial, Helvetica, sans-serif";
							if( typeof $.a.font == "string"){
								$.w.style.fontFamily = $.a.font;
							}
							
							// width
							$.w.style.width = "250px";
							if( typeof $.a.width == "string"){
								$.w.style.width = $.a.width;
							}
							
							// padding
							$.w.style.padding = "10px";
							if( typeof $.a.padding == "string"){
								$.w.style.padding = $.a.padding;
							}
							
							// margin
							$.w.style.margin = "10px";
							if( typeof $.a.margin == "string"){
								$.w.style.margin = $.a.margin;
							}
							
							// background color
							$.w.style.backgroundColor = "#fff";
							if( typeof $.a.bgcolor == "string"){
								$.w.style.backgroundColor = $.a.bgcolor;
							}
							
							$.w.labelVals = new Array('length','width','depth');
							$.w.labels = new Array();
							$.w.inputs = new Array();
							$.w.lbrs = new Array();
							$.w.ibrs = new Array();
							
							for(var l = 0; l<$.w.labelVals.length; l++){
								// create the label
								$.w.labels[l] = document.createElement('LABEL');
								$.w.labels[l].innerHTML = $.w.labelVals[l]+((l==2)?' (in)':' (ft)');
								$.w.labels[l].setAttribute("for", $.w.labelVals[l]);
								$.w.appendChild($.w.labels[l]);
								
								// <br /> it
								$.w.lbrs[l] = document.createElement('BR');
								$.w.appendChild($.w.lbrs[l]);
								
								$.w.inputs[l] = document.createElement('INPUT');
								$.w.inputs[l].setAttribute("id", randName+"_"+$.w.labelVals[l]);
								$.w.appendChild($.w.inputs[l]);
								$.w.inputs[l].style.marginTop = "3px";
								$.w.inputs[l].style.marginBottom = "10px";
								
								// <br /> it
								$.w.ibrs[l] = document.createElement('BR');
								$.w.appendChild($.w.ibrs[l]);								
							}

							// calculate button
							$.w.b = document.createElement('BUTTON');
							$.w.b.innerHTML = 'calculate';
							$.w.b.setAttribute("id", randName+"_calculate");
							$.w.b.style.marginBottom = "20px";
							$.w.b.onmouseup = function() {
								$.f.calc_volume($.w.inputs);
							};
							$.w.appendChild($.w.b);
							
							// create the holder div for the result of the calculation
							$.w.r = document.createElement('DIV');
							$.w.r.setAttribute("id", randName+"_result");
							$.w.r.style.height = "20px";
							$.w.appendChild($.w.r);

							// set the copyright & linkback
							$.w.cd = document.createElement('DIV');
							$.w.cd.style.textAlign = "left";
							$.w.appendChild($.w.cd);
							$.w.cd.c = document.createElement('A');
							$.w.cd.c.setAttribute("href", "http://www.mediamesis.net/widgets/volume_calc/demo.html");
							$.w.cd.c.appendChild(document.createTextNode("Widget by S & T, 2011"));
							$.w.cd.c.style.fontSize = "9px";
							$.w.cd.c.style.margin = "15px 0 0 0";
							$.w.cd.c.style.padding = "0";
							$.w.cd.appendChild($.w.cd.c);
							
							// set & clear script
							theScripts[i].parentNode.insertBefore($.w, theScripts[i]);
							theScripts[i].parentNode.removeChild(theScripts[i]);
							break;
						}
					}
				},
				
				// calculate & display the resulting volume
				calc_volume : function(vals) { 				
					var r = document.getElementById(randName+'_result');

					// validate length input
					var len = vals[0].value;

					// validate width input
					var width = vals[1].value;
				
					// validate depth input
					var depth = vals[2].value;
				
					// display result using this formula: l * w = sq ft * d = cubic ft / 27 cu ft = cubic yards
					var sqft = len * width;
					var depth_inches = depth / 12; //convert depth to inches by dividing by 12
					var cuft = sqft * depth_inches;
					var cuyds = cuft/27;
					
					r.innerHTML = Math.round(cuyds*100)/100 + ' cubic yds';
				},
				
				// parse the json script tag parameters
				parseJson : function(json) {
					this.parseJson.data = json;
					if ( typeof json !== 'string') {
						return {"err":"trying to parse a non-string JSON object"};
					}
					try {
						var f = Function(['var document,top,self,window,parent,Number,Date,Object,Function,',
								'Array,String,Math,RegExp,Image,ActiveXObject;',
								'return (' , json.replace(/<\!--.+-->/gim,'').replace(/\bfunction\b/g,'function­') , ');'].join(''));
						return f();
					} catch (e) {
						return {"err":"trouble parsing JSON object"};
					}
				}   
			};
	}();
	
	var thisScript = /volume_calc.js/;
	
	if(typeof window.addEventListener != 'undefined') {
		window.addEventListener('load', $.f.init(thisScript), false);
	} else if(typeof document.addEventListener != 'undefined') {
		// opera 
		document.addEventListener('load', $.f.init(thisScript), false);
	} else if(typeof window.attachEvent != 'undefined') {
		//.. win/ie
		window.attachEvent('onload', $.f.init(thisScript));
	}
	
})();