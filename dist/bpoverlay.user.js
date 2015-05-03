// ==UserScript==
// @name         BombParty Overlay
// @version      1.5.4
// @description  Overlay + Utilities for BombParty!
// @icon         https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/icon.png
// @icon64       https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/icon64.png
// @downloadURL  https://github.com/MrInanimated/bp-overlay/raw/master/dist/bpoverlay.user.js
// @author       MrInanimated and Skandalabrandur
// @match        http://bombparty.sparklinlabs.com/play/*
// @resource     twitch_global http://twitchemotes.com/global.json
// @resource     twitch_subscriber http://twitchemotes.com/subscriber.json
// @resource     autoScrollOn https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/chatdown.png
// @resource     autoScrollOff https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/chatdownoff.png
// @resource     autoFocusOn https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/focusOn.png
// @resource     autoFocusOff https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/focusOff.png
// @resource     dragOff https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/dragOff.png
// @resource     dragOn https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/dragOn.png
// @resource     hideDeadOn https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/hideDeadOn.png
// @resource     hideDeadOff https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/dist/hideDeadOff.png
// @resource     contextMenuPlugin https://raw.githubusercontent.com/MrInanimated/bp-overlay/experimental2/dist/contextmenu.js
// @resource     contextMenuPluginCSS https://raw.githubusercontent.com/MrInanimated/bp-overlay/experimental2/dist/contextmenu.css
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

//@require is not allowed under chrome (according to stackoverflow) and other suggested solutions have yet to work for me
// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
	
	// Load the context menu plugin stuff
    // This is a pretty simple task to require a whole plugin for, but I want to futureproof for now
	var script = document.createElement("script");
	script.textContent = "(function(jQuery){" + GM_getResourceText("contextMenuPlugin") + ";})(jQ);";
	document.body.appendChild(script);
	
	var css = document.createElement("style");
	css.textContent = GM_getResourceText("contextMenuPluginCSS");
	document.head.appendChild(css);
  }, false);
  document.body.appendChild(script);
}

// an empty callback loader (also for main page)
function main() {
}

// load jQuery and execute the main function
addJQuery(main);

// Grab the twitch emotes
var tg = GM_getResourceText("twitch_global");
var ts = GM_getResourceText("twitch_subscriber");

var te = document.createElement('script');
te.setAttribute("type", "application/javascript");
te.textContent = '\
var twitch_global = ' + tg + ';\
var twitch_subscriber = ' + ts + ';\
var bpImgUrls = {\
	autoScrollOn : "' + GM_getResourceURL("autoScrollOn") + '",\
	autoScrollOff : "' + GM_getResourceURL("autoScrollOff") + '",\
	autoFocusOn : "' + GM_getResourceURL("autoFocusOn") + '",\
	autoFocusOff : "' + GM_getResourceURL("autoFocusOff") + '",\
	dragOff : "' + GM_getResourceURL("dragOff") + '",\
	dragOn : "' + GM_getResourceURL("dragOn") + '",\
	hideDeadOn : "' + GM_getResourceURL("hideDeadOn") + '",\
	hideDeadOff : "' + GM_getResourceURL("hideDeadOff") + '",\
};';
document.body.appendChild(te);
document.body.removeChild(te);

// All the code written within this function RUNS WITHIN THE SCOPE OF THE PAGE.
// Everything outside it do NOT have access to environment variables.
var source = function() {
	// If the window already has a BPOverlay, don't run again
	if (window.hasOwnProperty('BPOverlayHasRun')) {} else {
		window.BPOverlayHasRun = true;

		var main = function() {

			// Since this is running via a script loaded on page load, it's difficult ensure the overlay runs after everything has loaded
			// This piece of code makes sure that all relevant things are loaded before executing the rest of the code
			// We may need to add more to this long-ass if statement if we add more features in the future
			if (!(window.hasOwnProperty("channel") && channel.socket && channel.data && channel.appendToChat && channel.socket.listeners("chatMessage").length && channel.socket.listeners("setActivePlayerIndex").length && channel.socket.listeners("winWord").length && channel.socket.listeners("setPlayerLives").length && channel.socket.listeners("setPlayerState").length && channel.socket.listeners("endGame").length && window.hasOwnProperty("JST") && JST["nuclearnode/chatMessage"] && document.getElementById("Sidebar") && document.getElementById("ChatLog"))) {
				console.log("Everything's not loaded yet, trying again in a second...");
				setTimeout(main, 1000);
				return;
			}

			/*!
			 * Autolinker.js
			 * 0.15.0
			 *
			 * Copyright(c) 2014 Gregory Jacobs <greg@greg-jacobs.com>
			 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
			 *
			 * https://github.com/gregjacobs/Autolinker.js
			 */
			!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.returnExportsGlobal=b()}):"object"==typeof exports?module.exports=b():a.Autolinker=b()}(this,function(){var a=function(b){a.Util.assign(this,b),this.matchValidator=new a.MatchValidator};return a.prototype={constructor:a,urls:!0,email:!0,twitter:!0,newWindow:!0,stripPrefix:!0,className:"",htmlCharacterEntitiesRegex:/(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;)/gi,matcherRegex:function(){var a=/(^|[^\w])@(\w{1,15})/,b=/(?:[\-;:&=\+\$,\w\.]+@)/,c=/(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/,d=/(?:www\.)/,e=/[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,f=/\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,g=/[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;return new RegExp(["(",a.source,")","|","(",b.source,e.source,f.source,")","|","(","(?:","(",c.source,e.source,")","|","(?:","(.?//)?",d.source,e.source,")","|","(?:","(.?//)?",e.source,f.source,")",")","(?:"+g.source+")?",")"].join(""),"gi")}(),charBeforeProtocolRelMatchRegex:/^(.)?\/\//,link:function(b){var c=this,d=this.getHtmlParser(),e=this.htmlCharacterEntitiesRegex,f=0,g=[];return d.parse(b,{processHtmlNode:function(a,b,c){"a"===b&&(c?f=Math.max(f-1,0):f++),g.push(a)},processTextNode:function(b){if(0===f)for(var d=a.Util.splitAndCapture(b,e),h=0,i=d.length;i>h;h++){var j=d[h],k=c.processTextNode(j);g.push(k)}else g.push(b)}}),g.join("")},getHtmlParser:function(){var b=this.htmlParser;return b||(b=this.htmlParser=new a.HtmlParser),b},getTagBuilder:function(){var b=this.tagBuilder;return b||(b=this.tagBuilder=new a.AnchorTagBuilder({newWindow:this.newWindow,truncate:this.truncate,className:this.className})),b},processTextNode:function(a){var b=this;return a.replace(this.matcherRegex,function(a,c,d,e,f,g,h,i,j){var k=b.processCandidateMatch(a,c,d,e,f,g,h,i,j);if(k){var l=b.createMatchReturnVal(k.match,k.matchStr);return k.prefixStr+l+k.suffixStr}return a})},processCandidateMatch:function(b,c,d,e,f,g,h,i,j){var k,l=i||j,m="",n="";if(c&&!this.twitter||f&&!this.email||g&&!this.urls||!this.matchValidator.isValidMatch(g,h,l))return null;if(this.matchHasUnbalancedClosingParen(b)&&(b=b.substr(0,b.length-1),n=")"),f)k=new a.match.Email({matchedText:b,email:f});else if(c)d&&(m=d,b=b.slice(1)),k=new a.match.Twitter({matchedText:b,twitterHandle:e});else{if(l){var o=l.match(this.charBeforeProtocolRelMatchRegex)[1]||"";o&&(m=o,b=b.slice(1))}k=new a.match.Url({matchedText:b,url:b,protocolUrlMatch:!!h,protocolRelativeMatch:!!l,stripPrefix:this.stripPrefix})}return{prefixStr:m,suffixStr:n,matchStr:b,match:k}},matchHasUnbalancedClosingParen:function(a){var b=a.charAt(a.length-1);if(")"===b){var c=a.match(/\(/g),d=a.match(/\)/g),e=c&&c.length||0,f=d&&d.length||0;if(f>e)return!0}return!1},createMatchReturnVal:function(b,c){var d;if(this.replaceFn&&(d=this.replaceFn.call(this,this,b)),"string"==typeof d)return d;if(d===!1)return c;if(d instanceof a.HtmlTag)return d.toString();var e=this.getTagBuilder(),f=e.build(b);return f.toString()}},a.link=function(b,c){var d=new a(c);return d.link(b)},a.match={},a.Util={abstractMethod:function(){throw"abstract"},assign:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a},extend:function(b,c){var d=b.prototype,e=function(){};e.prototype=d;var f;f=c.hasOwnProperty("constructor")?c.constructor:function(){d.constructor.apply(this,arguments)};var g=f.prototype=new e;return g.constructor=f,g.superclass=d,delete c.constructor,a.Util.assign(g,c),f},ellipsis:function(a,b,c){return a.length>b&&(c=null==c?"..":c,a=a.substring(0,b-c.length)+c),a},indexOf:function(a,b){if(Array.prototype.indexOf)return a.indexOf(b);for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},splitAndCapture:function(a,b){if(!b.global)throw new Error("`splitRegex` must have the 'g' flag set");for(var c,d=[],e=0;c=b.exec(a);)d.push(a.substring(e,c.index)),d.push(c[0]),e=c.index+c[0].length;return d.push(a.substring(e)),d}},a.HtmlParser=a.Util.extend(Object,{htmlRegex:function(){var a=/[0-9a-zA-Z][0-9a-zA-Z:]*/,b=/[^\s\0"'>\/=\x01-\x1F\x7F]+/,c=/(?:".*?"|'.*?'|[^'"=<>`\s]+)/,d=b.source+"(?:\\s*=\\s*"+c.source+")?";return new RegExp(["(?:","<(!DOCTYPE)","(?:","\\s+","(?:",d,"|",c.source+")",")*",">",")","|","(?:","<(/)?","("+a.source+")","(?:","\\s+",d,")*","\\s*/?",">",")"].join(""),"gi")}(),parse:function(a,b){b=b||{};for(var c,d=b.processHtmlNode||function(){},e=b.processTextNode||function(){},f=this.htmlRegex,g=0;null!==(c=f.exec(a));){var h=c[0],i=c[1]||c[3],j=!!c[2],k=a.substring(g,c.index);k&&e(k),d(h,i.toLowerCase(),j),g=c.index+h.length}if(g<a.length){var l=a.substring(g);l&&e(l)}}}),a.HtmlTag=a.Util.extend(Object,{whitespaceRegex:/\s+/,constructor:function(b){a.Util.assign(this,b),this.innerHtml=this.innerHtml||this.innerHTML},setTagName:function(a){return this.tagName=a,this},getTagName:function(){return this.tagName||""},setAttr:function(a,b){var c=this.getAttrs();return c[a]=b,this},getAttr:function(a){return this.getAttrs()[a]},setAttrs:function(b){var c=this.getAttrs();return a.Util.assign(c,b),this},getAttrs:function(){return this.attrs||(this.attrs={})},setClass:function(a){return this.setAttr("class",a)},addClass:function(b){for(var c,d=this.getClass(),e=this.whitespaceRegex,f=a.Util.indexOf,g=d?d.split(e):[],h=b.split(e);c=h.shift();)-1===f(g,c)&&g.push(c);return this.getAttrs()["class"]=g.join(" "),this},removeClass:function(b){for(var c,d=this.getClass(),e=this.whitespaceRegex,f=a.Util.indexOf,g=d?d.split(e):[],h=b.split(e);g.length&&(c=h.shift());){var i=f(g,c);-1!==i&&g.splice(i,1)}return this.getAttrs()["class"]=g.join(" "),this},getClass:function(){return this.getAttrs()["class"]||""},hasClass:function(a){return-1!==(" "+this.getClass()+" ").indexOf(" "+a+" ")},setInnerHtml:function(a){return this.innerHtml=a,this},getInnerHtml:function(){return this.innerHtml||""},toString:function(){var a=this.getTagName(),b=this.buildAttrsStr();return b=b?" "+b:"",["<",a,b,">",this.getInnerHtml(),"</",a,">"].join("")},buildAttrsStr:function(){if(!this.attrs)return"";var a=this.getAttrs(),b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c+'="'+a[c]+'"');return b.join(" ")}}),a.MatchValidator=a.Util.extend(Object,{invalidProtocolRelMatchRegex:/^[\w]\/\//,hasFullProtocolRegex:/^[A-Za-z][-.+A-Za-z0-9]+:\/\//,uriSchemeRegex:/^[A-Za-z][-.+A-Za-z0-9]+:/,hasWordCharAfterProtocolRegex:/:[^\s]*?[A-Za-z]/,isValidMatch:function(a,b,c){return b&&!this.isValidUriScheme(b)||this.urlMatchDoesNotHaveProtocolOrDot(a,b)||this.urlMatchDoesNotHaveAtLeastOneWordChar(a,b)||this.isInvalidProtocolRelativeMatch(c)?!1:!0},isValidUriScheme:function(a){var b=a.match(this.uriSchemeRegex)[0];return"javascript:"!==b&&"vbscript:"!==b},urlMatchDoesNotHaveProtocolOrDot:function(a,b){return!(!a||b&&this.hasFullProtocolRegex.test(b)||-1!==a.indexOf("."))},urlMatchDoesNotHaveAtLeastOneWordChar:function(a,b){return a&&b?!this.hasWordCharAfterProtocolRegex.test(a):!1},isInvalidProtocolRelativeMatch:function(a){return!!a&&this.invalidProtocolRelMatchRegex.test(a)}}),a.AnchorTagBuilder=a.Util.extend(Object,{constructor:function(b){a.Util.assign(this,b)},build:function(b){var c=new a.HtmlTag({tagName:"a",attrs:this.createAttrs(b.getType(),b.getAnchorHref()),innerHtml:this.processAnchorText(b.getAnchorText())});return c},createAttrs:function(a,b){var c={href:b},d=this.createCssClass(a);return d&&(c["class"]=d),this.newWindow&&(c.target="_blank"),c},createCssClass:function(a){var b=this.className;return b?b+" "+b+"-"+a:""},processAnchorText:function(a){return a=this.doTruncate(a)},doTruncate:function(b){return a.Util.ellipsis(b,this.truncate||Number.POSITIVE_INFINITY)}}),a.match.Match=a.Util.extend(Object,{constructor:function(b){a.Util.assign(this,b)},getType:a.Util.abstractMethod,getMatchedText:function(){return this.matchedText},getAnchorHref:a.Util.abstractMethod,getAnchorText:a.Util.abstractMethod}),a.match.Email=a.Util.extend(a.match.Match,{getType:function(){return"email"},getEmail:function(){return this.email},getAnchorHref:function(){return"mailto:"+this.email},getAnchorText:function(){return this.email}}),a.match.Twitter=a.Util.extend(a.match.Match,{getType:function(){return"twitter"},getTwitterHandle:function(){return this.twitterHandle},getAnchorHref:function(){return"https://twitter.com/"+this.twitterHandle},getAnchorText:function(){return"@"+this.twitterHandle}}),a.match.Url=a.Util.extend(a.match.Match,{urlPrefixRegex:/^(https?:\/\/)?(www\.)?/i,protocolRelativeRegex:/^\/\//,protocolPrepended:!1,getType:function(){return"url"},getUrl:function(){var a=this.url;return this.protocolRelativeMatch||this.protocolUrlMatch||this.protocolPrepended||(a=this.url="http://"+a,this.protocolPrepended=!0),a},getAnchorHref:function(){var a=this.getUrl();return a.replace(/&amp;/g,"&")},getAnchorText:function(){var a=this.getUrl();return this.protocolRelativeMatch&&(a=this.stripProtocolRelativePrefix(a)),this.stripPrefix&&(a=this.stripUrlPrefix(a)),a=this.removeTrailingSlash(a)},stripUrlPrefix:function(a){return a.replace(this.urlPrefixRegex,"")},stripProtocolRelativePrefix:function(a){return a.replace(this.protocolRelativeRegex,"")},removeTrailingSlash:function(a){return"/"===a.charAt(a.length-1)&&(a=a.slice(0,-1)),a}}),a});

			// Let's write an additional thing for multi-language text strings!
			// I kinda wanted to call this i18n, but that's taken
			var tran = {
				strings: {
					en: {
						timeText: "Elapsed time | ",
						wordCountText: "Word Count: ",
						showHideButtonTitle: "Show/Hide dead players.",
						flipsText: "Flips",
						flipsTitle: "Lives gained by using all the bonus letters.",
						uFlipsText: "U-Flips",
						uFlipsTitle: "Lives gained whilst already at 3 lives, making the \"flip\" unnecessary",
						deathsText: "Deaths",
						deathsTitle: "Lives lost in this game",
						playersTitle: "Players:",
						alphaText: "Alpha",
						alphaTitle: "Which letter this player is on if he was playing alpha roulette. (The number is how many times they have completed the alphabet)",
						chatDownButtonTitle: "Automatically scroll the chat down whenever there is a new message.",
						autoFocusButtonTitle: "Automatically focus the chat box after your turn.",
						dragButtonTitle: "Have the scoreboard be in a draggable container instead.",
						overlaySettingsButtonTitle: "BombParty Overlay Settings",
						overlaySettingsText: "Overlay Settings",
						notificationsText: "Notifications",
						themeH2Text: "Themes",
						easterText: "Easter Eggs",
						chatOpText: "Chat Options",
						playerListText: "Current Players",
						creditsText: "Credits",
						credits1: "Code Monkey",
						credits2: "Code Amoeba",
						credits3: "Frenchifier",
						creditsContextMenu: "Context Menu",
						creditsAutolinker: "Autolinker",
						creditsTwitchEmotes: "Twitch Emotes",
						creditsTextText: "With thanks to the English BombParty community",
						containerSizeName: "Container Size",
						containerSizeOptions: {
							compact: "Compact Size",
							fitToPlayers: "Fit To Players",
						},
						twitchEmotesName: "Twitch Emotes",
						twitchEmotesOptions: {
							on: "On",
							off: "Off",
						},
						textAdventureName: "Text Adventure<sup>BETA</sup>",
						textAdventureOptions: {
							on: "On",
							off: "Off",
						},
						hardModesName: "Hard Modes",
						hardModesOptions: {
							none: "None",
							rev: "Reverse",
							jqv: "J/Q/V",
							az: "Alphabet",
							xz: "X/Z",
						},
						themeName: "Theme<sup>BETA</sup>",
						themeOptions: {
							none: "None",
							xmas: "Christmas",
							custom: "Custom",
						},
						customThemeName: "Custom Theme",
						particlesName: "Particles",
						particlesOptions: {
							high: "High",
							low: "Low",
							off: "Off",
						},
						notificationsName: "Notifications",
						notificationVolume: "Notification Volume",
						notificationOptions: {
							on: "On",
							off: "Off",
						},
						notificationAlias: "Aliases",
						notificationAliasTitle: "Custom names that also trigger a notification.",
						notificationAliasInputTitle: "Write your names one after another separated by semicolons here. e.g. MrInanimated;Inanimated;Animé;Inan",
						endGameNotification: "Notify when a game ends",
						endGameNotificationOptions: {
							on: "On",
							off: "Off",
						},
						alphaRouletteName: "Alpha Roulette Display",
						alphaRouletteOptions: {
							on: "On",
							off: "Off",
						},
						muted: "(muted)",
						muteUser: "Mute",
						unmuteUser: "Unmute",
						ignoringText: "Muted Users",
						ignoringEmpty: "Nobody is currently muted.",
						scoreName: "Leaderboard score",
						scoreOption: {
							on: "On",
							off: "Off",
						},
						jqvText: "That word didn't contain J, Q nor V!",
						azText: "You are on letter {l} Kappa!",
						xzText: "That word didn't contain X nor Z!",
						speechName: "Speech on Chrome<sup>BETA</sup>",
						speechOptions: {
							on: "On",
							off: "Off",
						},
						voiceSelect: "Voice",
						voiceOptions: {
							us: "US",
							ukMale: "GB Male",
							ukFem: "GB Female",
							fran: "FR",
						},
						updateText: "Experimental! (2015-05-03)<br />User context menu added.",
					},
					fr: {
						timeText: "Temps Écoulé : ",
						wordCountText: "Nombre de Mots : ",
						showHideButtonTitle: "Afficher/Masquer les joueurs morts.",
						flipsText: "V.R.",
						flipsTitle: "Vies récupérées en utilisant toutes les lettres bonus",
						uFlipsText: "V.R.I.",
						uFlipsTitle: "Vies récupérées inutiles : vies récupérées tandis qu'on en possède trois, ce qui les rend \"inutiles\"",
						deathsText: "Morts",
						deathsTitle: "Vies perdues dans cette partie",
						alphaText: "Alpha",
						alphaTitle: "La lettre à laquelle ce joueur serait si il jouait en mode alphabet. (Le chiffre entre parenthèses est le nombre de fois où il a complété l'alphabet)",
						playersTitle: "Joueurs :",
						chatDownButtonTitle: "Forcer le tchat à défiler vers le bas quand il y a un nouveau message.",
						autoFocusButtonTitle: "Positionner automatiquement le curseur sur le tchat après son tour",
						dragButtonTitle: "Détacher le tableau des scores.",
						overlaySettingsButtonTitle: "Paramètres de l'Overlay",
						overlaySettingsText: "Paramètres",
						notificationsText: "Notifications",
						themeH2Text: "Thèmes",
						easterText: "Easter eggs",
						chatOpText: "Paramètres du Tchat",
						playerListText: "Joueurs connectés",
						creditsText: "Crédits",
						credits1: "Code Monkey",
						credits2: "Code Amoeba",
						credits3: "Traduction",
						creditsContextMenu: "Menu Contextuel",
						creditsAutolinker: "Liens automatiques",
						creditsTwitchEmotes: "Emoticones Twitch",
						creditsTextText: "Remerciements à la communauté anglaise de BombParty",
						containerSizeName: "Taille du tableau",
						containerSizeOptions: {
							compact: "Compacte",
							fitToPlayers: "Ajustée selon les joueurs",
						},
						twitchEmotesName: "Emoticones Twitch",
						twitchEmotesOptions: {
							on: "Marche",
							off: "Arrêt",
						},
						textAdventureName: "Text Adventure<sup>BETA</sup>",
						textAdventureOptions: {
							on: "Marche",
							off: "Arrêt",
						},
						hardModesName: "Difficultés supplémentaires",
						hardModesOptions: {
							none: "Aucune",
							rev: "Inversé",
							jqv: "J/Q/V",
							az: "Alphabet",
							xz: "X/Z",
						},
						themeName: "Thème<sup>BETA</sup>",
						themeOptions: {
							none: "Aucun",
							xmas: "Noël",
							custom: "Personnalisé",
						},
						customThemeName: "Thème Personnalisé",
						particlesName: "Particules",
						particlesOptions: {
							high: "Elevé",
							low: "Faible",
							off: "Désactivé",
						},
						notificationsName: "Notifications",
						notificationVolume: "Volume de Notification",
						notificationOptions: {
							on: "Activé",
							off: "Désactivé",
						},
						notificationAlias: "Pseudonymes",
						notificationAliasTitle: "Noms personnalisés qui déclenchent également une notification.",
						notificationAliasInputTitle: "Ecrivez vos noms l'un après l'autre, séparés par un point virgule. Par ex. MrInanimated;Inanimated;Animé;Inan",
						endGameNotification: "Avertit quand une partie se termine",
						endGameNotificationOptions: {
							on: "Activé",
							off: "Désactivé",
						},
						alphaRouletteName: "Affichage Mode Alphabet",
						  alphaRouletteOptions: {
						   on: "Activé",
						   off: "Désactivé",
						  },
						muted: "(muted)",
						muteUser: "Ignorer",
						unmuteUser: "Autoriser",
						ignoringText: "Utilisateurs ignorés",
						ignoringEmpty: "Personne n'est ignoré actuellement.",
						scoreName: "Score Classement",
						scoreOption: {
							on: "Activé",
							off: "Désactivé",
						},
						jqvText: "Ce mot ne contient ni J, ni V, ni Q.",
						azText: "Au tour de la lettre {l} Kappa !",
						xzText: "Ce mot ne contient ni X, ni Z !",
						speechName: "Vocale sur Chrome<sup>BETA</sup>",
						speechOptions: {
							on: "Activé",
							off: "Désactivé",
						},
						voiceSelect: "Voix",
						voiceOptions: {
							us: "US",
							ukMale: "GB Homme",
							ukFem: "GB Femme",
							fran: "FR",
						},
						updateText: "Nouvelle mise à jour! (2015-03-141592653)<br />Tableau des scores, reconnaissance vocale dans le chat, réorganisation du BpOS, correction de bugs.",
					},
				},
				language: (document.cookie.indexOf("i18next=fr") !== -1 ? "fr" : "en"),
				fallback: "en",
				t: function (accessor) {
					var rStr;
					
					try {
						if ((rStr = eval("this.strings." + this.language + "." + accessor)) !== undefined) {
							return rStr;
						}
					}
					catch (e) {
						if (!(e instanceof TypeError)) {
							throw e;
						}
					}
					
					try {
						if ((rStr = eval("this.strings." + this.fallback + "." + accessor)) !== undefined) {
							return rStr;
						}		
					}
					catch (e) {
						if (!(e instanceof TypeError)) {
							throw e;
						}
					}
					
					return accessor;
				},
			};
			
			// Tidy container for storing "global" variables.
			bpOverlay = {
				playerNames: {}, // Stores player name by actor index
				playerScores: Array.apply(null, new Array(20)).map(Number.prototype.valueOf,0), // Stores player's score by actor index
				playerAuthId: {}, // Stores actor index by authId
				lostLives: {}, // Stores lost lives by actor index
				flips: {}, // Stores flips by actor index
				uFlips: {}, // Stores u-flips by actor index
				alpha: {}, // Stores progress across the alphabet
				wordCount: 0, // Stores word count for current round
				startTime: 0, // Stores (in milliseconds since the epoch) the starting time of the round
				timeText: "", // Stores the text used to display the time on the overlay

				dragBoxHasBeenCreated: false, //Indicates that the dragbox is 4 real
				boxHasBeenCreated: false, // True when a DOM object with the id "infoBox" exists
				firstRun: true, // Set to true every time a game ends. If this is true a new infoBox is created, and this is set to false

				prevPlayerNames: {}, // Stores player name by actor index
				prevLostLives: {}, // Stores lost lives by actor index
				prevFlips: {}, // Stores flips by actor index
				prevUFlips: {}, // Stores u-flips by actor index
				prevTimeText: "", // Stores the text used to display the time on the overlay
				prevWordCount: 0, // Stores the word count for the last round

				hideDead: false, // If true, hides dead players' rows on the scoreboard table
				dragonDrop: false, // If true, indicates that the user has a wish to become or remain a dragon.
				// dragBoxHasBeenCreated will not replace this

				autoScroll: true, // If true, automatically scrolls that chat down whenever there is a new chat message.
				autoFocus: true, // If true, automatically switches focus to the chatbox after the user's turn

				focusNext: false, // If true, it is the user's turn (and so we should focus to the chatBox if autoFocus is true after the user's turn)

				twitchOn: true,  // If true, twitch emoticons will be displayed.				

				markupOn: true,  // A dummy, nothing changes this setting just yet
				
				adventureTextMode: false,	//Self explanatory boolean for text adventure toggle
				
				adventureFirstRun: false,
				adventureLevels: ["A noob", "A beginner", "A novice", "A student of flips", "A graduated student of flips", "An expert flipper", "An incredible flipper", "A master flipper", "A scrub tier immortal", "A near immortal", "An immortal", "A massive flipping faggot", "A strong contender to the 'hang in there kitty'", "An immeasurable faggot of flips", "A blackhole tier faggot", "A legendary immortal faggot flipper", "A supermassive faggot with more flips than a herd of dolphins", "Silly rabbit. Flips are for kids!", "An undefeatable flipping gaylord of +5 anal strength", "An ascended immortal queen faggot cockmunch godly overlord of flips", "Zip zop zippety boop flip floop", "You're now the gayest man on earth", "Aren't you fagged out after all that flipping?", "A lifesize Johnboat", "A lifesize Catboat", "The Jesus figure in the underworld of extreme flip fetish", "On fliproids!", "Why don't you slip into something more comfortable... like a coma?", "A divine elder scrub god that manifests himself as fine-cuisine salt", "The nicest guy. Didn't expect that did you?", "Hungry hungry heart hoarder!", "A bird in the hand is worth zemstvo in the quush", "You're good. Actually very good. Goddamn", "Still going. Holy crap!", "Your Anaconda dont want none unless you got equivocations hun", "A budding plenipotentiary", "Antidisestablishmentarinism in the flesh", "Suffering from pseudopseudohypoparathyroidism", "Arrete les flips tu connard!", "A disciple of Pingu", "A man of a thousand flips... well... 40", "The god of bombparty", "Insert Douglas Adams reference here because 42 flips", "An Alpaca. Yes. An Alpaca. The flippest of animals besides giraffes", "A giraffe. The flippest of the animals in the animal kingdom", "You deserve a movie about you. The title 'Rainman' is taken though", "If faggots were mountains, you'd be a volcano!"],
				
				//The alphabet variables for alphabet hard mode				
				alphabet: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
				alphapos: 0,
				
				isThemed: false,  // Is the game currently themed
				particleSpawnRate: "high",
				
				alias: [],
				notificationSound: new Audio("http://bombparty.sparklinlabs.com/sounds/myTurn.wav"),
				notifications: true,
				
				endGameNotification: false,
				
				ignoring: {},
	
				speechName: "Google UK English Male",	//Default voice
				
				//Letter scores based on the formula ((10 - (pure integer value of percentage))*3). floored at 1. Why this formula? Just because. :D 
				letterScore: { a: 5, b: 25, c: 21, d: 17, e: 1, f: 23, g: 24, h: 12, i: 9, j: 30, k:27, l:18, m:22, n:10, o:7, p:24, q:30, r:12, s:11, t:3, u:22, v:27, w:23, x:30, y:24, z:30},
				scoreMode: false,
				
				is_hidden: false,
			};
			
			// Store all the game images so they can be changed
			gameImages = {};
			
			window.addEventListener("blur", function () { bpOverlay.is_hidden = true; });
			window.addEventListener("focus", function () { bpOverlay.is_hidden = false; });
			
			// So, um, the code here is pretty distributed, but I'll explain the "hack" I've found here
			// Elisee has *kindly* wrapped up all the images he used in a closure
			// (I totally didn't spend about 3 hours hunting how to do this before finding this hack)
			// Which means there's normally no way to get at those images and change them
			// The one point of contact those variables have with the outside environment is the context.drawImage method
			// So of course that's exploited.
			// Now, not all the images will be sent to drawImage at once
			// Hence the need for a missing game images list.
			var missingGameImgs = [
				"avatarShadow",
				"heart",
				"heartEmpty",
				"arrow",
				"bomb",
				"sparkle",
				"avatarPlaceHolder",
				"letter",
			]
			
			// Relacement src's go here
			var replacementImages = {
			};
			
			// Replacement offsets go here
			var replacementOffsets = {
			};
			
			// This is a backup of the original src's of the images
			// So if ever need to flip back to the default
			// We use the src's listed here
			var backupSources = {
			};
			
			var canvasContext = document.getElementById("GameCanvas").getContext("2d");
			
			// Adventure Mode Text formatter!
			// Use this to have a pool of text messages to randomly choose from. 
			
			// USAGE:
			// adventureTextFormat.chooseText(textBankName, *arguments)
			// 		textBankName: the text bank you want to choose the text from.
			// 		*arguments: The arguments you want to fill the empty spaces in your text with.
			//		(It's not tremendously clear what this does, but I'll try to explain it anyway)
			// You provide it with a string like this:
			// "The heroic, {0}, faces the mighty {1}."
			// And then you call adventureTextFormat.chooseText($TextBankWhichTheStringAboveIsIn, "Pingu", "GOS")
			// It returns "The heroic, Pingu, faces the mighty GOS."
			// It replaces the numbers inside the braces with the relevant text supplied.
			// You can have the numbers in any order, so:
			// "A fierce {1} roars greatly at {0}!" -> "A fierce GOS roars greatly at Pingu!"
			// You can miss out numbers all together, so:
			// "{0} takes their stand against the foul beast." -> "Pingu takes their stand against the foul beast."
			
			var adventureTextFormat = {
				format: function(format, args) {
							return format.replace(/{(\d+)}/g, function(match, number) {
								return typeof args[number] != 'undefined' ? args[number] : match;
							});
						},
				
				chooseText : function (textBankName) {
					var args = Array.prototype.slice.call(arguments, 1);
					var textBank = this.textBanks[textBankName];
					var chosenString = textBank[Math.floor(Math.random() * textBank.length)];
					return this.format(chosenString, args);
				},
				
				// These messages will be randomly selected.
                                // Note: I've never read Shakespeare. If you're a fan of his then you're not of this.
                                //       You'd think that someone good with words would be good with sentences but it ain't so
				textBanks : {
					newRound : [
						"Hark, the wheel turns yet again!",
						"Lo and behold, a new round has cometh!",
						"The crack of a new bomb, stand ready and begin the new day!",
						"The whole bomb's a stage, and all the men and women merely nerds!",
						"Give heed! The wordgrimage is set about, selectees!",
						"With thine vocable, set forth and slay that which is fragmentary!",
						"Words are swords, prompts be stomped!",
						"Sticks and stones will break thy bones / And prompts will surely kill thee!",
					],
					userTurn : [
						"It is thy turn, squire. You are facing off against {0}. Do thine worst!",
						"A vile horror seeks thee. What is thine plan for {0}?",
						"Nay, {0} fixes to tender thine flame. Take action!",
						"A wild {0} appears!",
						"Shalt thou stand and accomplish nothing against {0}?",
						"{0} is about to wound thee. Time for a curt attack!",
						"Heedeth thou the mighty {0}! Distress or scuffle is forthcoming!",
						"Art thou harefooted or harebrained! Observe, it is {0}!",
					],
					playerTurn : [
						"The heroic, {0}, faces the mighty {1}.",
						"A ferocious roar as {1} corners {0}!",
						"{0} needeth stand firm or be struck by {1}",
						"{1} hath hunger who {0} might satisfy, lest!",
						"{0} faces down the rat that is {1}!",
						"{0} challenges the verminous {1}!",
						"Behold the ravenous {1}! Will {0} succeed?",
						"{0} versus {1}! The trepidation is palpable!",
                                                
					],
					userLevelUp : [
						"LEVEL UP: Thou art now {0}",
						"UPLEVEL : Now thou art {0}",
						"RISE SIR, AS '{0}'",
						"YOU FIT A NEW TITLE: {0}",
						"THOU HAST EVOLVED INTO {0}",
						"EXPERIENCE MOLDS YOU INTO {0}",
						"YOU FEEL STRONGER: You become '{0}'",
						"REJOICE, YOU ARE: {0}",                                         
					],
					levelUp : [
						"{0} levelled up to {1}",
						"{0} has become {1}",
						"{0} is now titled {1}",
						"{0} has a new name: {1}",
						"There is now a '{1}' among us",
						"{0} is levelling up. What's your excuse, faggoth?",
						"Out of his cocoon, {0} crawls like a majestic buttefly. How can I compare 'levelling up' to a summer's day?",
						"{0} is evolving! Don't cream your pants, Pokémon faggots!",
					],
					userWinWord : [
						"Thou hast slain the beast with your {0} and gained {1} EXP!",
						"The hellion shatters for thine knowledge is vast. A well deserved {1} EXP!",
						"Smite triumphed over bite! The prompt is no more. You gain {1} EXP!",
						"Twas foolish of the beast to underestimate you. You gain {1} EXP",
						"By Jove, the miscreant is rend like a brittle biscuit from your wallop. I say, good show!",
						"No mercy have thou for these ogres. Let {0} be a lesson. You gain {1} EXP",
						"Blasted vermin recoil in fear at thine mighty {0}. {1} EXP to thee!",
						"Idle barking is met with a firm {0}.",
					],
					winWord : [
						"{0} has killed the beast with the mighty shout {1} and gained {2} EXP!",
						"{0} fears no ghosts. His guiding {1} has fled them from the shadows!",
						"{1}, an apt warcry from {0} who gained {2} EXP!",
						"{0} decimates the hoodlum with {1} and gains {2} EXP",
						"{1}, and then the dragon is no more! {0} feels stronger by {2} points!",
						"{0} delivers the final blow to the whale with his {1}!",
						"{1} was {0}'s weapon of choice and he earns {2} EXP",
						"{0} shows no mercy and swings his {1}!",
					],
					userLostLife : [
						"Thine ignorance woundeth and thou hast been hurt",
						"Incompetent fool, you were lacerated by a mere rodent!",
						"Thou areth assrapeth so fervently you lose heart!",
						"If thy stuttereth again, thou shalt surely receive another blow such as this!",
						"Nay, thou hast been set upon and crushed by that wild thing!",
						"Is thy fighting as good as thy 'not-being-a-faggot' skill? Thine heart bleeds!",
						"Thine tongue utters nothing and so thou art skewered like a pig! The agony!",
						"Thou art badly contused by the assailing prompt. Man up or die, cutter!",
					],
					lostLife : [
						"Alas... for poor {0} hath been hurt",
						"{0} has been struck to the ground!",  
						"{0} cries can be heard echoing through these halls!", 
						"{0} receives hefty damage!",
						"The horror kill and goes forth to claim its next victim",
						"Sacre bleu. Les monstrosite c'est trop. {0} ne pas victoirement!",
						"Don't look. {0} was badly mauled!",
						"Oh lord gawd. {0} got roughed up!",
						"{0} was generously harmed!",
					],
					userDeath : [
						"and a grave loss for thou art dead. {0}, may thee rest in peace!", 
						"yet-th, thineth lifeth hateth endeth. Noth. Whyth?",
						"but this is the end for you. Rest in pieces, sweet prince",
						"however you face oblivion.",
						"and thine life flasheth before thine eyes and thou realizes what a dead faggot thou art!",
						"now you have left the realm of the living and enter the realm of spectators!",
						"here, you expire like milk and smell like it too! Smelly dead {0}!",
						"but bonk bonk you conk into the casket. The wonk was too stronk!",
					],
					death : [
						"and weepeth, thee morn, for {0} hath left yonder mortal coil!",
						"{0} exits the stage!",
						"{0} is snuffed like a candle",
						"{0} is no more, like, jeez, got dun dead good!",
						"meow meow meow 'COMPLETELY DEAD' meow meow '{0}'",
						"{0} kicks the bucket, knocks it over and swallows shit!",
						"{0}, oh, in the prime of his 'not being able to answer prompts like the faggot he is', is deceased!",
						"{0}, bites the dust, goes the way of all flesh, gives up the ghost, drops off. You know what I mean",
					],
					endRound : [
						"All things must end and so it does with {0}!",
						"The ordeal is over!",
						"{0} was the death of all but one!",
						"The seemingly unending wave of prompts comes to a halt!",
						"Now, caged are the dogs of war!",     
						"And on that bombshell, {0}, we have to end!",
						"Many have fallen! But not all!",      
						"Nothing lasts forever!, Yet...",
                                            
					],
					winner : [
						"Rising from the ashes of felled brethren is the victorious {0}!",
						"A knight in tested armor, still breathing, the glorious {0}!",
						"Praise be the heroic {0} for that human/otherkin/refridgerator has not be vanquished!",
						"The surviving faggot was indeed {0}",
						"Ahoyhoy and a hullo for the indissoluble {0}",
						"Is it a bird? Is it a plane? Whatever it is, it's {0}",
						"Doctors hate {0}! The secret doctors don't want you to know is \"don't be a scrub\"!",
						"{0} the unending, the ceaseless, the permanent, the unfading; the sole survivor!",
					],
				},
			}
			
			
			//I'm so proud of this ugly node constructor
			//I'm certain it's unconventional, but it works so... yippee
			//It allows for creating images as nodes within an object and
			//defining attributes at the same time. LALALALALALALAL HAPPY HAPPY THIS
			//TOOK SO LONG TO FIGURE OUT!!!! AAAAAH. I'M DUMB AND SMART

			//USAGE: x = imNodeConstructor(type, attributes);
			//		'type' is the type of element on the form document.createElement("whatever");
			//		'attributes' are a list of attributes on the object form { att1: value1, att2: value2, ... , attN: valueN }
			// Post: x is of the type "whatever" with the attributes att1, att2, ... , attN
			var imgNodeConstructor = function(node, attributes) {
				for (x in attributes) {
					node[x] = attributes[x];
				}
				return node;
			};

			// Storage of images and their attributes used by the overlay.
			bpOverlayImgs = {

				//AutoScroll button on state
				on: imgNodeConstructor(document.createElement("img"), {
					width: 30,
					height: 30,
					src: bpImgUrls.autoScrollOn,
				}),

				//AutoScroll button off state
				off: imgNodeConstructor(document.createElement("img"), {
					width: 30,
					height: 30,
					src: bpImgUrls.autoScrollOff,
				}),

				//AutoFocus button on state
				autoFocusOn: imgNodeConstructor(document.createElement("img"), {
					width: 30,
					height: 30,
					src: bpImgUrls.autoFocusOn,
				}),

				//AutoFocus button off state
				autoFocusOff: imgNodeConstructor(document.createElement("img"), {
					width: 30,
					height: 30,
					src: bpImgUrls.autoFocusOff,
				}),

				//Dragon button off state
				dragOff: imgNodeConstructor(document.createElement("img"), {
					width: 30,
					height: 30,
					src: bpImgUrls.dragOff,
				}),

				//Dragon button on state                
				dragOn: imgNodeConstructor(document.createElement("img"), {
					width: 30,
					height: 30,
					src: bpImgUrls.dragOn,
				}),

				//These buttons not constructed because they appear solidary and have already been coded with the old method
				//No changes necessary unless we intend to add more buttons in the players window
				hideDeadOn: null, // HideDead button on state
				hideDeadOff: null, // HideDead button off state

			};


			//START - A collection of functions for the dragonDrop
			//The functions basically name themselves and do what they're told
			//They are then activated by listeneres when 	a)User starts dragging the 'draggable'
			//												b)User drags over to somewhere (not default behaviour of linkamajigging)
			//												c)User drops the box.

			//window resize meow
			window.onresize = resize;
			
			//Called when browser is resized
			function resize() {
				//Let's patch this to do nothing if the box hasn't been created. 
				//Hooray for avoiding erors. HOORAY!
				if(bpOverlay.dragboxHasBeenCreated) {
					//Let's get the window size
					var height = window.innerHeight,
						width = window.innerWidth;

					//Let's get the dragOn size
					var infoBox = document.getElementById("infoBox");
					var dragW = infoBox.clientWidth;
					var dragH = infoBox.clientHeight;
				
					//Let's get the dragOn... wrawrrr
					var dragOn = document.getElementById("dragonDrop");

					//... and his coordinates. Nifty. We can use parseInt direclty. directly*
					var dragX = parseInt(dragOn.style.left);
					var dragY = parseInt(dragOn.style.top);

					//Resize widthwise
					if(dragW + dragX > width) {
						dragOn.style.left = width - dragW + 'px';
					}

					//Resize heightwise (also pushing it beyond check which isn't needed on the widthwise
					if(dragY < 0) {
						dragOn.style.top = "0px";
					} else if (dragH + dragY > height) {
						dragOn.style.top = height - dragH + 'px';
					}
				}
			}

			//a: establish the drag and the starting parameters
			function drag_start(event) {
				var style = window.getComputedStyle(event.target, null);
				event.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
			}

			//b: strange shit wont happen because things wont interact
			//   you can however act as if you're dropping the boxonto the ad and it will revert
			//	so this bug is now a feature: "CANNOT ADBLOCK BY DESIGN"
			function drag_over(event) {
				event.preventDefault();
				return false;
			}

			//c: computes the offset from the drag and adds it to the style.top & style.left
			function drop(event) {
				var offset = event.dataTransfer.getData("text/plain").split(',');
				var dm = document.getElementById('dragonDrop');
				var addLeft = event.clientX + parseInt(offset[0], 10);
				var addTop = event.clientY + parseInt(offset[1], 10);

				//Let's see if we can prevent the jigger from flying offscreen by doing something lazy
				//heigt and width answer "what is the area considered not to be outside of the game?"
				var height = window.innerHeight,
					width = window.innerWidth;

				//((Resize friendly, that is, if we want to make this resizable in the future this should hold)).
				//We seem to need to acquire this through the document.getElementById, it returns 0 otherwise
				var dragH = document.getElementById("infoBox").clientHeight;
				var dragW = document.getElementById("infoBox").clientWidth;


				//If the drag sends the dragon offscreen, put it to the edge instead
				//Otherwise let the user do whatever
				if (addLeft < 0) {
					dm.style.left = "0px";
				} else if (addLeft + dragW > width) {
					dm.style.left = (width - dragW) + 'px';
				} else {
					dm.style.left = addLeft + 'px';
				}

				//Same but for the height
				if (addTop < 0) {
					dm.style.top = "0px";
				} else if (addTop + dragH > height) {
					dm.style.top = (height - dragH) + 'px';
				} else {
					dm.style.top = addTop + 'px';
				}
				event.preventDefault();
				return false;
			}




			//The body needs to be able to accept the new positions
			//So naturally the listeners are added to the body
			//(Imagine how weird this paragraph above would be in a medical paper)
			document.body.addEventListener('dragover', drag_over, false);
			document.body.addEventListener('drop', drop, false);


			//Configure and style the draggable box, then add to the body
			var dragAside = document.createElement("whatever");
			dragAside.id = "dragonDrop";
			dragAside.draggable = "true";
			dragAside.style.position = "absolute";
			dragAside.style.left = "100px"; //starting coordinates
			dragAside.style.top = "100px"; //eh whatevs, nice round number
			dragAside.style.width = "300px";
			dragAside.style.background = "rgb(20, 20, 20)";
			dragAside.addEventListener('dragstart', drag_start, false);
			document.body.appendChild(dragAside);

			//BEGIN: Functions for the adventureText thing
			//////////////////////////////////////////////

			var toggleTextAdventure = function(toggle) {

				if(toggle) {
	
					bpOverlay.adventureFirstRun = true;
					bpOverlay.adventureTextMode = true;

					//Hide the old
					var gameCanvas = document.getElementById("GameCanvas");
					gameCanvas.parentNode.style.backgroundColor="rgb(20,20,20)";
					gameCanvas.style.display="none";

					//In with the new
					var textAdventureDiv = document.createElement("DIV");
					textAdventureDiv.id="adventure";
					textAdventureDiv.className="adventureMeow";
					//textAdventureDiv.style="position: relative; padding: 0.25em; -webkit-box-flex: 1; -moz-box-flex: 1; -o-box-flex: 1; box-flex: 1;  -webkit-flex: 1;  -ms-flex: 1;  flex: 1;   -webkit-box-orient: vertical; -moz-box-orient: vertical; -o-box-orient: vertical; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; text-align: left;";
					textAdventureDiv.style.backgroundColor="rgb(20,20,20)";

					

					//Player info
					var textAdventurePINFO = document.createElement("P");
					textAdventurePINFO.id = "adventurePINFO";
					textAdventurePINFO.className = "adventureMeow";
					var playerLives=0;
					var playerLetters=["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v"];					
					//What level? How many letters?
					var playerIndex = 200;	//for undefined
					for(i=0; i < channel.data.actors.length; i++) {
						if(channel.data.actors[i].authId === window.app.user.authId) {
							playerLives = channel.data.actors[i].lives;
							playerLetters = channel.data.actors[i].lockedLetters;
							playerIndex = i;
						}
					}

					if(playerIndex == 200) {
						var level = 0;
					} else if(bpOverlay.flips[playerIndex] >= bpOverlay.adventureLevels.length) {
						var level = bpOverlay.adventureLevels.length - 1;
					} else {
						var level = bpOverlay.flips[playerIndex];
					}

					textAdventurePINFO.innerHTML = window.app.user.displayName + " : " + bpOverlay.adventureLevels[level];
					textAdventurePINFO.style.color="rgb(255, 255, 51)";

					var remaining="";					
					//Player remaining letters
					for(i in playerLetters) {
						remaining+=playerLetters[i].toUpperCase();
					}

					var textAdventureEXPINFO = document.createElement("DIV");
					textAdventureEXPINFO.id="adventureEXPINFO";
					textAdventureEXPINFO.className = "adventureMeow";
					
					textAdventureEXPINFO.innerHTML = "Experience needed: " + remaining;
					textAdventureEXPINFO.style.color="rgb(255,255,255)";


					textAdventureDiv.appendChild(textAdventureEXPINFO);
					textAdventureDiv.appendChild(textAdventurePINFO);

					//Player Container
					var textAdventurePlayer = document.createElement("DIV");
					textAdventurePlayer.id = "adventurePlayer";
					textAdventurePlayer.className="adventureMeow";
					textAdventurePlayer.style = "position: relative";
					textAdventureDiv.appendChild(textAdventurePlayer);

					//Player image container
					var textAdventureAvatar = document.createElement("IMG");
					textAdventureAvatar.id = "adventureAvatar";
					textAdventureAvatar.className = "adventureMeow";
					if(typeof window.app.user.pictureURL === "undefined") {
						textAdventureAvatar.src = "http://bombparty.sparklinlabs.com/images/AvatarPlaceholder.png";					
					} else {
						textAdventureAvatar.src = window.app.user.pictureURL;
					}					
					textAdventureAvatar.style = "position: relative; float: right";
					textAdventurePlayer.appendChild(textAdventureAvatar);

					//Player bar container
					var textAdventureBars = document.createElement("DIV");
					textAdventureBars.id = "adventureBars";
					textAdventureBars.className = "adventureMeow";
					textAdventureBars.style="position: relative; float: right;";
					textAdventurePlayer.appendChild(textAdventureBars);

					//Player health bar
					var textAdventureHealth = document.createElement("DIV");
					textAdventureHealth.id = "adventureHealth";
					textAdventureHealth.className = "adventureMeow";
					textAdventureHealth.style="position: absolute;";
					textAdventureHealth.style.width= (10 + playerLives * 70) + "px";
					textAdventureBars.appendChild(textAdventureHealth);

					//Player exp bar
					var textAdventureExp = document.createElement("DIV");
					textAdventureExp.id = "adventureExp";
					textAdventureExp.className = "adventureMeow";
					textAdventureExp.style="position: absolute;";
					textAdventureExp.style.width= (10 + (21 - playerLetters.length) * 10) + "px";
					textAdventureBars.appendChild(textAdventureExp);

					//Turn container
					var textAdventureTurns = document.createElement("DIV");
					textAdventureTurns.id = "adventureTurns";
					textAdventureTurns.className = "adventureMeow";
					textAdventureTurns.style = "position: relative; float: right; color: #FFF";
					textAdventurePlayer.appendChild(textAdventureTurns);

					//Message container
					var textAdventureMessages = document.createElement("DIV");
					textAdventureMessages.id = "adventureMessages";
					textAdventureMessages.className="adventureMeow";
					textAdventureMessages.align="center";
					textAdventureMessages.style="position: relative;";
					textAdventureDiv.appendChild(textAdventureMessages);

					//We need input... and on the project too. Like, comment and subscribe. How? Magic.
					//Or maybe not. Let's keep this though if we wanna customize more later.					
					//var textAdventureInput = document.createElement("INPUT");
					//textAdventureInput.id="adventureInput";
					//textAdventureInput.className="adventureMeow";
					//textAdventureInput.style.outline="none";
					//textAdventureInput.style.border="none";
					//textAdventureInput.style.backgroundColor="rgb(20,20,20)";
					//textAdventureInput.style.color="rgb(90, 249, 12)";
					//textAdventureMessages.appendChild(textAdventureInput);
				
					gameCanvas.parentNode.insertBefore(textAdventureDiv, gameCanvas);

					//I hate CSS. This seems to only work after
					textAdventureMessages.style.marginLeft="40px";
					textAdventureMessages.style.marginTop="40px";
					textAdventureMessages.style.clear="both";
					textAdventurePlayer.style.marginLeft="40px";
					textAdventurePlayer.style.marginTop="5px"
					textAdventurePlayer.style.overflow="hidden";
					textAdventurePINFO.style.marginLeft="40px";
					textAdventureEXPINFO.style.marginLeft="40px";
					textAdventureEXPINFO.style.marginTop="40px";
					textAdventureAvatar.style.height="76px";
					textAdventureAvatar.style.width="76px";		
					textAdventureAvatar.style.float="left";
					textAdventureBars.style.marginLeft="10px";
					textAdventureBars.style.height="75px";
					textAdventureBars.style.width="400px";
					textAdventureBars.style.border="1px solid #141414";
					textAdventureBars.style.float="left";
					textAdventureHealth.style.backgroundColor="rgb(255,255,0)";
					textAdventureHealth.style.border="10px solid red";
					textAdventureHealth.style.marginTop="8px";
					textAdventureHealth.style.marginBottom="14px";
					textAdventureExp.style.backgroundColor="rgb(0,0,204)";
					textAdventureExp.style.border="10px solid blue";
					textAdventureExp.style.marginTop="14px";
					textAdventureExp.style.marginBottom="8px";
					textAdventureTurns.style.marginLeft="20px";
					textAdventureTurns.style.float="left";		
					
				} else {
					
					bpOverlay.adventureTextMode = false;
					bpOverlay.adventureFirstRun = false; //Probably not needed but I like symmetry					
					
					//Out with the old
					var old = document.getElementsByClassName("adventureMeow");
					for(i = 0; i < old.length; i++) {	
						old[i].parentNode.removeChild(old[i]);
					}

					//In with the previously old, ehhh.... default.
					//Pretty neat that you can reset this with an empty string. Oh boy.		
					var gameCanvas = document.getElementById("GameCanvas");
					gameCanvas.parentNode.style.backgroundColor="";
					gameCanvas.style.display="";
				
				}

			}

			//msg is the string to be displayed
			//formatter is a color code on the form "rgb(x,y,z)" where 0<=x,y,z<=255
			var sendAdventureMessage = function(msg, formatter) {
				if(bpOverlay.adventureTextMode) {
					var textAdventureMessages = document.getElementById("adventureMessages");	
					var textAdventureMsg = document.createElement("P");
					textAdventureMsg.style.color=formatter;
					textAdventureMsg.innerHTML=msg;
				
					//We don't want the messages to extend out of the page... now do we?
					if(textAdventureMessages.children.length > 10) {
						textAdventureMessages.appendChild(textAdventureMsg);	
						textAdventureMessages.removeChild(textAdventureMessages.firstChild);
					} else {
						textAdventureMessages.appendChild(textAdventureMsg);
					}
				

				}
			}
			//////////////////////////////////////////////
			//END functions for the adventure text thing

			// It's my turn to write a long completely unnecessary feature!
			//////////////////////////////////////////////
			var particleEmitters = [];  // An array to store the emitters
			var particleArray = [];     // An array for actual particles
			var particleImgs = [];      // An array for particle images
			var rafID;                  // For storing the ID for requestAnimationFrame, so we can stop it
			
			var textColors = {          // For converting colours into text specifiers
				"#cccccc": "statusText",
				"#ffffff": "promptText",
				"#a0a0a0": "wordText",
				"#60aa60": "highlightedText",
				"#404040": "bonusLetterText",
			};
			
			// Bleh, it turns out that browsers haven't completely agreed on a single function for requestAnimationFrame/cancelAnimationFrame
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
			
			// This needs to be exposed because it needs to be called by the GM script
			loadCustomTheme = function (themeObj) {
				if (themeObj && !bpOverlay.isThemed) {
					bpOverlay.isThemed = true;
				
					// Grab the canvas and its context
					var canvas = document.getElementById("GameCanvas");
					var ctx = canvas.getContext("2d");
				
					// Add and replace images if necessary
					if (themeObj.images) {
						for (var i in themeObj.images) {
							// Validation
							if (!themeObj.images[i].src) {
								console.log("Error: source is not defined for image " + i + ". Will try to execute anyway");
							}
							
							replacementImages[i] = themeObj.images[i].src;
							
							if (themeObj.images[i].xOffset || themeObj.images[i].yOffset) {
								var offset = {x: 0, y: 0};
								if (themeObj.images[i].xOffset) {
									offset.x = themeObj.images[i].xOffset;
								}
								if (themeObj.images[i].yOffset) {
									offset.y = themeObj.images[i].yOffset
								}
								
								replacementOffsets[i] = offset;
							}
							
							replaceImage(i);
						}
					}
				
					// Create a style if there is one.
					if (themeObj.css) {
						if (themeObj.css.text) {
							var style = document.createElement('style');
							style.id = "customThemeStyle";
							style.appendChild(document.createTextNode(themeObj.css.text));
							document.getElementsByTagName('head')[0].appendChild(style);
						}
						else if (themeObj.css.src) {
							var style = document.createElement('link');
							style.id = "customThemeStyle";
							style.rel = "stylesheet";
							style.type = "text/css";
							style.href = themeObj.css.src;
							document.getElementsByTagName('head')[0].appendChild(style);
						}
						else {
							console.log("Error: css field declared but no valid css provided. Will try to execute anyway");
						}
					}
					
					// If there is particles, then do this whole canvas drawing shebang
					if (themeObj.particles) {
						// Load up the images
						if (themeObj.particles.images && themeObj.particles.images.length) {
							for (i = 0; i < themeObj.particles.images.length; i++) {
								var img = new Image;
								img.src = themeObj.particles.images[i];
								particleImgs.push(img);
							}
						}
						else {
							console.log("Error: no particle images defined. Will try to execute anyway");
						}
						
						var lastTime = (new Date).getTime();
						
						if (themeObj.particles.emitters && themeObj.particles.emitters.length) {
							var emitters = themeObj.particles.emitters;
							for (i = 0; i < emitters.length; i++) {
								var e = emitters[i];
								e.spawnParticle = function () {
									if (Math.random() < e.spawnRate[bpOverlay.particleSpawnRate]) {
										// This bit's quite involved because the data entered into the JSON could take quite a few forms...
									
										var rawSize = Math.random();
									
										// Determine x-position
										var pos_x = e.position.x * canvas.width;
										if (e.position.width) {
											pos_x += Math.random() * e.position.width * canvas.width;
										}
										
										// determine y-position
										var pos_y = e.position.y * canvas.height;
										if (e.position.height) {
											pos_y += Math.random() * e.position.height * canvas.height;
										}
										
										// Determine x-velocity
										var vel_x;
										if (typeof(e.velocity.x) === "number") {
											vel_x = e.velocity.x;
										}
										else {
											vel_x = e.velocity.x.min + (e.velocity.linkedToSize ? rawSize : Math.random()) * (e.velocity.x.max - e.velocity.x.min);
										}
										
										// Determine y-velocity
										var vel_y;
										if (typeof(e.velocity.y) === "number") {
											vel_y = e.velocity.y;
										}
										else {
											vel_y = e.velocity.y.min + (e.velocity.linkedToSize ? rawSize : Math.random()) * (e.velocity.y.max - e.velocity.y.min);
										}
										
										// Determine size
										var size;
										if (typeof(e.size) === "number") {
											size = e.size;
										}
										else {
											size = e.size.min + rawSize * (e.size.max - e.size.min);
										}
										
										// Determine rotation
										var rot;
										if (typeof(e.rotation) === "number") {
											rot = e.rotation;
										}
										else {
											rot = e.rotation.min + (e.rotation.linkedToSize ? rawSize : Math.random()) * (e.rotation.max - e.rotation.min);
										}
										
										// Determine angular velocity
										var rotV;
										if (typeof(e.angularVelocity) === "number") {
											rotV = e.angularVelocity;
										}
										else {
											rotV = e.angularVelocity.min + (e.angularVelocity.linkedToSize ? rawSize : Math.random()) * (e.angularVelocity.max - e.angularVelocity.min);
										}
										
										if (e.gravity) {
											// Determine x-gravity
											var grav_x = e.gravity.x;
											// Determine y-gravity
											var grav_y = e.gravity.y;
										}
										else {
											var grav_x = 0;
											var grav_y = 0;
										}
										
										// Put all of this into a particle object
										particleArray.push({
											imageId: Math.floor(Math.random() * particleImgs.length),
											position: {
												x: pos_x,
												y: pos_y,
											},
											velocity: {
												x: vel_x,
												y: vel_y,
											},
											size: size,
											rotation: rot,
											angularVelocity: rotV,
											gravity: {
												x: grav_x,
												y: grav_y,
											},
											alpha: 1,
										});
										
									}
								}
							}
						}
						else if (themeObj.particles.emitters === [] || !themeObj.particles.emitters) {
							console.log("Error: Particles declared but no emitters defined. Will try to execute anyway");
						}
						
						// Actual function used for drawing the particles
						particleAnimate = function () {
							// Run spawning thing on all the emitters
							var emitters = themeObj.particles.emitters;
							for (i = 0; i < emitters.length; i++) {
								emitters[i].spawnParticle();
							}
							
							// Time params
							var current = (new Date).getTime();
							var dt = Math.min((current - lastTime) / 1000, 1);
							lastTime = current;
							
							// Euh, reset the scaling
							ctx.setTransform(1, 0, 0, 1, 0, 0);
							
							// Loop through all the particles
							// We're looping backwards because we want to be able to remove particles
							// Without messing up list indices
							for (i = particleArray.length - 1; i >= 0; i--) {
								var particle = particleArray[i];
								var img = particleImgs[particle.imageId];
								
								// Update its parameters
								particle.position.x += particle.velocity.x * dt;
								particle.position.y += particle.velocity.y * dt;
								particle.rotation += particle.angularVelocity * dt;
								particle.rotation %= Math.PI * 2;
								particle.velocity.x += particle.gravity.x * dt;
								particle.velocity.y += particle.gravity.y * dt;
								
								// set the alpha to something lower if it's over the prompt or the locked letters.
								if (Math.abs(particle.position.x - canvas.width / 2) < 100 && Math.abs(particle.position.y - canvas.height /2) < 200 ||
									particle.position.x + width/2 > canvas.width - Math.min(100, canvas.height / 11 * 2)) {
									particle.alpha = Math.max(0.1, particle.alpha - 0.05);
								}
								else if (particle.alpha < 1) {
									particle.alpha = Math.min(1, particle.alpha + 0.05);
								}
								
								if (particle.alpha < 1) {
									var ga = ctx.globalAlpha;
									ctx.globalAlpha = particle.alpha;
								}
								
								var width = img.width * particle.size;
								var height = img.height * particle.size;
								
								// Draw the particle
								// Apparently, to rotate things, you have to transform the entire canvas context
								ctx.translate(particle.position.x, particle.position.y);
								ctx.rotate(particle.rotation);
								ctx.drawImage(img, -width/2, -height/2, width, height);
								ctx.rotate(-particle.rotation);
								ctx.translate(-particle.position.x, -particle.position.y);
								
								if (particle.alpha < 1) {
									ctx.globalAlpha = ga;
								}
								
								// Remove the particle if necessary
								if (particle.x < -0.2 * canvas.width || 
								    particle.position.y < -0.2 * canvas.height ||
									particle.position.x > 1.2 * canvas.width ||
									particle.position.y > 1.2 * canvas.height) {
									particleArray.splice(i, 1);
								}
							}
							
							// Request it again so 
							rafID = requestAnimationFrame(particleAnimate);
						}
						
						particleAnimate();
					}
					
					// Do the text styles
					if (themeObj.textStyles) {
						ctx.fillTextRedux = ctx.fillText;
						ctx.fillText = function () {
							var tc = ctx.shadowColor;
							var tb = ctx.shadowBlur;
							var fs = ctx.fillStyle;
							var f = ctx.font;
							
							var fontA = f.split("px ");
							var fontSize = fontA[0];
							var fontFamily = fontA[1];
							
							var thisStyle = themeObj.textStyles[textColors[fs]];
							if (thisStyle) {
								if (thisStyle.color) {
									ctx.fillStyle = thisStyle.color;
								}
								if (thisStyle.shadow) {
									ctx.shadowColor = "#000";
									ctx.shadowBlur = 10;
								}
								
								var newFont = [fontSize, fontFamily];
								
								if (textColors[fs] === "wordText" || textColors[fs] === "highlightedText") {
									if (fontSize === "20") {
										if (thisStyle.majorFontSize) {
											newFont[0] = thisStyle.majorFontSize;
										}
									}
									else if (fontSize === "14") {
										if (thisStyle.minorFontSize) {
											newFont[0] = thisStyle.minorFontSize;
										}
									}
								}
								else {
									if (thisStyle.fontSize) {
										newFont[0] = thisStyle.fontSize;
									}
								}
								
								if (thisStyle.fontFamily) {
									newFont[1] = thisStyle.fontFamily;
								}
								
								ctx.font = newFont.join("px ");
							}
							
							ctx.fillTextRedux.apply(this, arguments);
							
							ctx.font = f;
							ctx.fillStyle=fs;
							ctx.shadowColor=tc;
							ctx.shadowBlur=tb;
						};
					
						// Since I'm changing the text size and style sometimes, I need to adjust ctx.measureText
						ctx.measureTextRedux = ctx.measureText;
						ctx.measureText = function () {
							var f = ctx.font;
							var fs = ctx.fillStyle;
							
							var fontA = f.split("px ");
							var fontSize = fontA[0];
							var fontFamily = fontA[1];
							
							var thisStyle = themeObj.textStyles[textColors[fs]];
							if (thisStyle) {
								var newFont = [fontSize, fontFamily];
								
								// Helpfully, the only time the measureText is actually used
								// In Elisee's code is when the words below the players are being drawn
								if (textColors[fs] === "wordText" || textColors[fs] === "highlightedText") {
									if (fontSize === "20") {
										if (thisStyle.majorFontSize) {
											newFont[0] = thisStyle.majorFontSize;
										}
									}
									else if (fontSize === "14") {
										if (thisStyle.minorFontSize) {
											newFont[0] = thisStyle.minorFontSize;
										}
									}
								}
								
								if (thisStyle.fontFamily) {
									newFont[1] = thisStyle.fontFamily;
								}
								
								ctx.font = newFont.join("px ");
							}

							var result = ctx.measureTextRedux.apply(this, arguments);
							
							ctx.font = f;
							
							return result;
						}
						
					}
					
					for (var i in gameImages) {
						replaceImage(i);
					}
					
				}
				else if (!themeObj && bpOverlay.isThemed) {
					bpOverlay.isThemed = false;
				
					// Get rid of the custom style sheet if there is one
					if (style = document.getElementById("customThemeStyle")) {
						style.parentNode.removeChild(style);
					}
					
					// Cancel the particle animation
					if (rafID !== undefined) {
						cancelAnimationFrame(rafID);
						rafID = undefined;
					}
					
					var ctx = document.getElementById("GameCanvas").getContext("2d");
					
					if (ctx.fillTextRedux) {
						ctx.fillText = ctx.fillTextRedux;
					}
					if (ctx.measureTextRedux) {
						ctx.measureText = ctx.measureTextRedux;
					}
					
					for (var i in gameImages) {
						unreplaceImage(i);
					}
					
					particleImgs = [];
					particleArray = [];
					
					// Reset so nothing else gets replaced
					replacementImages = {};
					replacementOffsets = {};
				}
			};
			
			// Replace image function
			// Call this when a new image is being drawn or when custom theme mode is being activated
			var replaceImage = function (imageName) {
				if (replacementImages[imageName] && gameImages[imageName]) {
					gameImages[imageName].src = replacementImages[imageName];
				}
			};
			
			// Replace the images back with the originals
			// Call when custom theme mode is deactivated
			var unreplaceImage = function (imageName) {
				if (backupSources[imageName] && gameImages[imageName]) {
					gameImages[imageName].src = backupSources[imageName];
				}
			};
			
			//////////////////////////////////////////////
			// END of most of the custom theme code

			//Creates a score notifier in ca. the middle of the screen
			var scoreNotifier = function(points) {
				var scoreDiv = document.createElement("whatever");
				scoreDiv.innerHTML="<p style='color: yellow; font-size: 300%'>" + points;
				scoreDiv.id = "scoreDiv";
				scoreDiv.draggable = "true";
				scoreDiv.style.position = "absolute";
				scoreDiv.style.left = window.innerWidth / 3 + "px"; 
				scoreDiv.style.top = window.innerHeight / 2 + "px"; 
				scoreDiv.style.width = window.innerWidth / 2 + "px";
				scoreDiv.style.background = "rgb(20, 20, 20, 0)";
				document.body.appendChild(scoreDiv);
			
				jQ('#scoreDiv').animate({"top":"20px", "opacity":"0"}, 1000, function() {
					document.getElementById("scoreDiv").parentNode.removeChild(document.getElementById("scoreDiv"));
				});
			};

			var updateScores = function() {

				var stupidSort = [];
				for(i=0; i<Object.keys(bpOverlay.playerNames).length; i++) {
					var temp = {names: bpOverlay.playerNames[i], score: bpOverlay.playerScores[i]};
					stupidSort.push(temp);			
				}

				stupidSort.sort(function(a, b) {
					return b.score - a.score;		
				});

				var lTab = document.getElementById("LeaderboardTab");
				lTab.innerHTML = "<table>";
				var names="";
				for(i=0; i<Object.keys(bpOverlay.playerNames).length; i++) {
				if(stupidSort[i].names.length > 14) {
					names = stupidSort[i].names.substring(0,14);
				} else {
					names = stupidSort[i].names;
				}
					lTab.innerHTML += "<br><tr><td>" + names + "</td><td> --- </td><td>" + stupidSort[i].score + "</td></tr>";
				}
				lTab.innerHTML += "</table>";
			};

			
			// This function is called whenever a new round begins.
			var generateActorConditions = function() {
				// If there is already a box, get rid of it
				if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
					var infoBox = document.getElementById("infoBox");

					//remove infoBox from wherever it is
					var meow = infoBox.parentNode;
					meow.removeChild(infoBox);

					//If if then more lines hence both.
					bpOverlay.boxHasBeenCreated = false;
					bpOverlay.dragBoxHasBeenCreated = false;
				}

				// Shift current round's variables onto previous round's variables
				bpOverlay.prevPlayerNames = bpOverlay.playerNames;
				bpOverlay.prevLostLives = bpOverlay.lostLives;
				bpOverlay.prevFlips = bpOverlay.flips;
				bpOverlay.prevUFlips = bpOverlay.uFlips;
				bpOverlay.prevTimeText = bpOverlay.timeText;
				bpOverlay.prevWordCount = bpOverlay.wordCount;

				// Reset current round variables
				bpOverlay.playerNames = {};
				bpOverlay.playerAuthId = {};
				bpOverlay.lostLives = {};
				bpOverlay.flips = {};
				bpOverlay.uFlips = {};
				bpOverlay.alpha = {};

				actors = channel.data.actors;

				// Loop through current round's actors and log data accordingly
				for (i = 0; i < actors.length; i++) {
					bpOverlay.playerNames[i] = actors[i].displayName;
					bpOverlay.playerAuthId[actors[i].authId] = i;
					bpOverlay.flips[i] = 0;
					bpOverlay.uFlips[i] = 0;
					bpOverlay.lostLives[i] = 0;
					bpOverlay.alpha[i] = {progress: 0, completed: 0};
				}

				// More resetting...
				bpOverlay.wordCount = 0;
				bpOverlay.timeText = tran.t("timeText") + "0:00";

				var d = new Date();
				bpOverlay.startTime = d.getTime();

				// Create the infoBox.
				var infoBox = document.createElement("DIV");
				infoBox.id = "infoBox";

				// Create the time text display
				var timeElement = document.createElement("H2");
				timeElement.id = "infoBoxTimer";
				timeElement.align = "center"; //Might get overridden if not in drag-mode but who cares :D
				timeElement.style.color = "rgb(200,200,200)"; //this as well but that's a good thing
				timeElement.textContent = bpOverlay.timeText;
				infoBox.appendChild(timeElement);

				// Create the word counter display
				var wordCounterElement = document.createElement("H2");
				wordCounterElement.align = "center";
				wordCounterElement.id = "infoWordCounter";
				wordCounterElement.style.color = "rgb(200,200,200)";
				wordCounterElement.textContent = tran.t("wordCountText") + "0";
				infoBox.appendChild(wordCounterElement);

				// Oh boy, a horizontal rule!	Gee willikers!
				var horizontalRule = document.createElement("hr");
				infoBox.appendChild(horizontalRule);

				// Contain the scoreboard table in a div to allow for scrolling
				var infoTableDiv = document.createElement("DIV");
				infoTableDiv.className = "infoTableDiv";
				infoTableDiv.align = "center"
				
				//Retain choices between rounds from the settings meow
				//Ah... this may not exist. Let's patch it.
				if(document.getElementById("containerSelect")) {
					var cont = document.getElementById("containerSelect");
					if(cont.value === "fitToPlayers") {
						infoTableDiv.style.maxHeight = "1000px"; //autoflow hinders big meow meow meow yappety yak
					} else {
						infoTableDiv.style.maxHeight = "100px";				
					}
				}
				infoTableDiv.style.overflowY = "auto";

				// Make the actual scoreboard table
				var infoTable = document.createElement("table");
				infoTable.style.tableLayout = "fixed";
				infoTable.style.width = "100%";
				infoTableDiv.appendChild(infoTable);

				// First row is a button and column headers.
				var firstRow = document.createElement("tr");

				// The first element in the first row is a container for the show/hide button
				var showHideContainer = document.createElement("td");

				// Make the show_hide button
				var showHideButton = document.createElement("BUTTON");
				var showHideButtonDiv = document.createElement("DIV");
				showHideButtonDiv.className = "headerButtonDiv";
				showHideButton.id = "autoFocusButton";
				showHideButton.className = "headerButton";
				showHideButton.title = tran.t("showHideButtonTitle");

				showHideButton.onclick = function() {
					// Flip the state of hideDead
					bpOverlay.hideDead = !bpOverlay.hideDead;

					if (bpOverlay.hideDead) {
						// if hideDead is true, remove the off state image and add the on state image
						showHideButton.removeChild(bpOverlayImgs.hideDeadOff);
						showHideButton.appendChild(bpOverlayImgs.hideDeadOn);

						// Hide all the grayed out players
						// A bit of a hack, storing information in colours
						var rows = document.getElementsByClassName("playerRow");
						for (i = 0; i < rows.length; i++) {
							if (rows[i].style.color == "rgb(102, 102, 102)") {
								rows[i].style.display = "none";
							}
						}
					} else {			
						// if hideDead is false, remove the on state image and add the off state image
						showHideButton.removeChild(bpOverlayImgs.hideDeadOn);
						showHideButton.appendChild(bpOverlayImgs.hideDeadOff);

						// Since showing the overlay will scroll the chat up, we might want to check if
						// the user needs to have the chat scrolled down after expansion
						var chatLog = document.getElementById("ChatLog");
						var scrollDown = (bpOverlay.autoScroll || chatLog.scrollTop == chatLog.scrollHeight)

						// Show all the hidden rows
						var rows = document.getElementsByClassName("playerRow");
						for (i = 0; i < rows.length; i++) {
							if (rows[i].style.display == "none") {
								rows[i].style.display = "table-row";
							}
						}

						//Let's add a call to the window.onresize if this is done while the dragon is at the bottom
						//This prevents overflow
						var funky = window.onresize;
						funky();

						// If the chat does need scrolling down then scroll it down
						if (scrollDown) {
							chatLog.scrollTop = chatLog.scrollHeight;
						}
					}
				};

				// Add the appropriate image based on the current setting of hideDead
				if (bpOverlay.hideDead) {
					showHideButton.appendChild(bpOverlayImgs.hideDeadOn);
				} else {
					showHideButton.appendChild(bpOverlayImgs.hideDeadOff);
				}

				// ...and append it all into the first row. Phew!
				showHideButtonDiv.appendChild(showHideButton);
				showHideContainer.appendChild(showHideButtonDiv);
				firstRow.appendChild(showHideContainer);

				// Make headers for the columns, and append to the first row
				var flipColumnHeader = document.createElement("td");
				flipColumnHeader.textContent = tran.t("flipsText");;
				flipColumnHeader.style.color = "rgb(200,200,200)";
				flipColumnHeader.align = "center";
				flipColumnHeader.style.padding = "2px";
				flipColumnHeader.style.fontSize = "11px";
				flipColumnHeader.style.width = "40px";
				flipColumnHeader.title = tran.t("flipsTitle");
				firstRow.appendChild(flipColumnHeader);
				var uFlipColumnHeader = document.createElement("td");
				uFlipColumnHeader.textContent = tran.t("uFlipsText");
				uFlipColumnHeader.style.color = "rgb(200,200,200)";
				uFlipColumnHeader.align = "center";
				uFlipColumnHeader.style.padding = "2px";
				uFlipColumnHeader.style.fontSize = "11px";
				uFlipColumnHeader.style.width = "40px";
				uFlipColumnHeader.title = tran.t("uFlipsTitle");
				firstRow.appendChild(uFlipColumnHeader);
				var lostLivesColumnHeader = document.createElement("td");
				lostLivesColumnHeader.textContent = tran.t("deathsText");
				lostLivesColumnHeader.style.color = "rgb(200,200,200)";
				lostLivesColumnHeader.align = "center";
				lostLivesColumnHeader.style.padding = "2px";
				lostLivesColumnHeader.style.fontSize = "11px";
				lostLivesColumnHeader.style.width = "40px";
				lostLivesColumnHeader.title = tran.t("deathsTitle");
				firstRow.appendChild(lostLivesColumnHeader);
				infoTable.appendChild(firstRow);
				
				// add the alphabet thing
				var alphaColumnHeader = document.createElement("td");
				alphaColumnHeader.textContent = tran.t("alphaText");
				alphaColumnHeader.className = "alphaColumn";
				alphaColumnHeader.style.color = "rgb(200,200,200)";
				alphaColumnHeader.align = "center";
				alphaColumnHeader.style.padding = "2px";
				alphaColumnHeader.style.fontSize = "11px";
				alphaColumnHeader.style.width = "40px";
				alphaColumnHeader.title = tran.t("alphaTitle");
				firstRow.appendChild(alphaColumnHeader);
				
				// Loop through the players, making a new row for each one
				for (i = 0; i < actors.length; i++) {
					var playerRow = document.createElement("tr");
					playerRow.id = i + " row"; // Used to reference this row later on
					playerRow.className = "playerRow";

					if (actors[i].authId === app.user.authId) {
						playerRow.style.background = "rgba(255,0,0,0.1)";
					}
					
					// If the player this row represents is dead, grey it out
					if (actors[i].state == "dead") {
						playerRow.style.color = "#666";
						if (bpOverlay.hideDead) {
							playerRow.style.display = "none";
						}
					} else {
						playerRow.style.color = "rgb(210,210,210)";
					}

					// Make the cell containing the name
					var nameData = document.createElement("td");
					var name = bpOverlay.playerNames[i];

					nameData.textContent = name;
					nameData.align = "center";
					nameData.style.whiteSpace = "nowrap";
					nameData.style.overflow = "hidden";
					nameData.style.textOverflow = "ellipsis";
					playerRow.appendChild(nameData)

					// Make the cell containing the number of flips
					var flipData = document.createElement("td");
					flipData.id = i + " flips"; // used to reference this cell later
					flipData.textContent = "0";
					flipData.align = "center";
					playerRow.appendChild(flipData);

					// Make the cell containing the # of u-flips
					var uFlipData = document.createElement("td");
					uFlipData.id = i + " uFlips"; // used to reference this cell later
					uFlipData.textContent = "0";
					uFlipData.align = "center";
					playerRow.appendChild(uFlipData);

					// Make the cell containing the # of deaths
					var lostLivesData = document.createElement("td");
					lostLivesData.id = i + " lives"; // used to reference this cell later
					lostLivesData.textContent = "0";
					lostLivesData.align = "center";
					playerRow.appendChild(lostLivesData);

					// Make the alpha thing
					var alphaData = document.createElement("td");
					alphaData.className = "alphaColumn";
					alphaData.id = i + " alpha"; // used to reference this cell later
					alphaData.innerHTML = "A (0)";
					alphaData.align = "center";
					playerRow.appendChild(alphaData);
					
					// Append the row to the table
					infoTable.appendChild(playerRow);
				}

				// Append the table to the container...
				infoBox.appendChild(infoTableDiv);



				//Creates either a docked infoBox or a draggable one
				if (bpOverlay.dragonDrop) {
					//Created if user wishes dragonDrop
					var deDragonDrop = document.getElementById("dragonDrop");
					deDragonDrop.appendChild(infoBox);
					bpOverlay.dragBoxHasBeenCreated = true;
					

				} else {
					//otherwise this is created
					var sideBar = document.getElementById("Sidebar");
					sideBar.insertBefore(infoBox, sideBar.firstChild);

					bpOverlay.boxHasBeenCreated = true;
				}

				//And yet another check of overflow needed in case the dragon is on the bottom and a new round starts
				//with more players than the previous round. This is outside the if(bpOverlay.dragonDrop) because the user might wish
				//to switch sides after starting a new round in docked mode. Bugfixes ahoy hoy yay yay
				var funky = window.onresize;
				funky();

				// ..and finally, if autoScrolling is on, scroll the chat back down since this would've caused the chat to scroll up
				if (bpOverlay.autoScroll) {
					var chatLog = document.getElementById("ChatLog");
					chatLog.scrollTop = chatLog.scrollHeight;
				}

			}
			
			//Usage: 	generateSettingsElement(itemText, options, selectId, settingsFunction)
			//string	'itemText' is the text to the right of the drop down options pane
			//object	'options' is an object {value: Text, value2: Text2, ... , valueN: TextN}
			//			'value, ..., valueN' are the value we can compare from selectElement.value
			//			'Text, ..., TextN' are the strings that the user see when selecting options
			//string	'selectId': for your function you probably want to use document.getElementById(selectId)
			//function	'settingsFunction' is the function that is called on selectElement.onchange
			var generateSettingsElement = function(itemText, options, selectId, locatorId, settingsFunction) {
				//Create the text item
				//Oh god the horrors of navigating the dom DOM DOOOOM
				
				// Made it so it keeps appending rows to the same table
				// As far as I'm aware, I don't think you need a tbody element here
				var sTabTable = document.getElementById(locatorId);
				var sTabTr = document.createElement("TR");
				sTabTable.appendChild(sTabTr);
				var sTabTd = document.createElement("TD");
				sTabTd.innerHTML = itemText;
				sTabTr.appendChild(sTabTd);
		
				//Create the options DOM DOM POMPOM
				var sTabOptionsTd = document.createElement("TD");
				sTabTr.appendChild(sTabOptionsTd);
				var sTabSelect = document.createElement("SELECT");
				sTabSelect.id = selectId;
				sTabOptionsTd.appendChild(sTabSelect);
	
				//Populate the select field with {Value: text} from options which is an object
				for(x in options) {
					var op = document.createElement("OPTION");
					op.textContent = options[x];
					op.value = x;
					sTabSelect.appendChild(op);	
				}

				//Add the function to the onchange listener for the newly created select
				sTabSelect.onchange = settingsFunction;
			
				//OPTIONAL: Reflect on your lifechoices, such as programming when you should be studying	
			}

			//Usage: function(onSrc, offSrc, buttonId, buttonMessage, defaultState, buttonFunction)
			//img		onSrc  is the image for the on- state
			//img		offSrc is the image for the off-state
			//string	buttonId is the id for the created button item in the header
			//string	buttonMessage is the hovermessage presented by the button
			//boolean	defaultState: if true, then the button is created with the onSrc image, else the offSrc image
			//function	buttonFunction is the function that is called when the button is clicked
			var makeHeaderButton = function(onSrc, offSrc, buttonId, buttonMessage, defaultState, buttonFunction) {

				// Actually make the button, and its container div
				var button = document.createElement("BUTTON");
				var buttonDiv = document.createElement("DIV");
				buttonDiv.className = "headerButtonDiv";

				// Insert the button container div into the header
				var header = document.getElementsByTagName("header")[0];
				var lastChild = header.lastChild;
				header.insertBefore(buttonDiv, lastChild);

				var onElement = document.createElement("img");
				onElement = onSrc;

				var offElement = document.createElement("img");
				offElement = offSrc;

				// General "stylistic touches"
				button.id = buttonId;
				button.className = "headerButton";
				button.title = buttonMessage;

				button.onclick = buttonFunction;

				//Depending on defaultState, have the button start with the "on" image or the "off"
				if (defaultState) {
					button.appendChild(onSrc);
					button.dataset.state = true;  // Turns out, data attributes are pretty useful in storing state
				} else {
					button.appendChild(offSrc);
					button.dataset.state = false;
				}

				buttonDiv.appendChild(button);
			};


			// This function is called regularly to update the time text
			var updateTime = function() {
				// Don't bother doing anything if there's no game or the infoBox hasn't been created
				if (channel.data.state === 'playing' && (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated)) {
					// Timer code
					// Copied directly from Ice's bot
					var d = new Date();
					var seconds = Math.floor((d.getTime() - bpOverlay.startTime) / 1000);
					if ((seconds % 60) < 10) {
						var formatter = "0";
					} else {
						var formatter = "";
					}

					bpOverlay.timeText = tran.t("timeText") + Math.floor(seconds / 60) + ":" + formatter + "" + (seconds % 60) + "";

					// Umm, hmm, this if statement is redundant.
					// It looks like it anyway.
					// Yus - It most certainly is. I don't know what was going on
					//if (bpOverlay.boxHasBeenCreated) {
					// Update the infoBox timer text
					document.getElementById("infoBoxTimer").textContent = bpOverlay.timeText;
					//}
				}
			}

			// It now makes more sense to have the twitch emotes in a separate function
			var twitchify = function (message) {
				if (bpOverlay.twitchOn) {
					if (window.hasOwnProperty("twitch_global")) {
						for (i in twitch_global) {
							message = message.replace(new RegExp("\\b" + i + "\\b", "g"), "<img src=\"http:" + twitch_global[i].url + "\" title=\"" + i + "\" style=\"margin-bottom:-6px\"><\/img>");
						}
					}
					
					if (window.hasOwnProperty("twitch_subscriber")) {
						// Match subscriber emote patterns
						var matches = [];
						var found;
						var reg = /\b\w+:\w+\b/g
						while (found = reg.exec(message)) {
							matches.push(found[0]);
						}
						
						// Check if any of the patterns we've found are actual emotes
						toReplace = {};
						for (i = 0; i < matches.length; i++) {
							var split = matches[i].split(":");
							var s = split[0].toLowerCase();
							var e = split[1];
							if (!toReplace[matches[i]]) {
								if (twitch_subscriber[s]) {
									if (twitch_subscriber[s].emotes[e]) {
										toReplace[s+":"+e] = twitch_subscriber[s].emotes[e];
									}
								}
							}
						}
						
						// Finally, do any replacements
						for (i in toReplace) {
							message = message.replace(new RegExp(i, "g"), "<img src=\"http:" + toReplace[i] + "\" title=\"" + i + "\" style=\"margin-bottom:-6px\"><\/img>");
						}
					}
					
				}
				if (bpOverlay.markupOn) {
					// Quick and dirty
					// Undo the escaping the <b> <i> <s> and <u> tags.
					// Not sure if this is completely okay, but whatever for now
					message = message.replace(/&lt;(\/?[BISUbisu])&gt;/g, "<$1>");
				}
				return message;
			};
			
			// Since a lot of the functions the bot needs to do has to happen before the game updates the state of everything
			// We wrap the default game functions to force them to be called after our custom code.
			var wrapGameFunctions = function() {

				// Context Menus!
				jQ(function () {
					jQ.contextMenu({
						selector: ".User",
						items: {
							"ban": {
								name: i18n.t("nuclearnode:chat.ban"),
								className: "contextMenuBanButton",
								callback: function () {
									var button = jQ(".contextMenuBanButton")[0];
									if (button.dataset.state === "1") {
										channel.socket.emit("banUser", {displayName: channel.data.usersByAuthId[this[0].dataset.authId].displayName, authId: this[0].dataset.authId});
										return true;
									}
									else {
										button.dataset.state = "1";
										button.textContent = "Are you sure?";
										return false;
									}
								},
								disabled: function (key, opt) {
									return !(this[0].dataset.authId && channel.data.usersByAuthId[this[0].dataset.authId] && ["host", "moderator", "hubAdministrator"].indexOf(app.user.role) >= 0)
								},
							},
							"mod": {
								name: i18n.t("nuclearnode:chat.mod"),
								className: "contextMenuModButton",
								callback: function () {
									var button = jQ(".contextMenuModButton")[0];
									if (button.dataset.state === "1") {
										channel.socket.emit("modUser", {displayName: channel.data.usersByAuthId[this[0].dataset.authId].displayName, authId: this[0].dataset.authId});
										return true;
									}
									else {
										button.dataset.state = "1";
										button.textContent = "Are you sure?";
										return false;
									}
								},
								disabled: function (key, opt) {
									return !(this[0].dataset.authId && channel.data.usersByAuthId[this[0].dataset.authId] && ["host", "hubAdministrator"].indexOf(app.user.role) >= 0)
								},
							},
							"mute": {
								name: "Mute",
								callback: function () {
									bpOverlay.ignoring[this[0].dataset.authId] = channel.data.usersByAuthId[this[0].dataset.authId].displayName;
									var toMute = jQ(".Author-" + this[0].dataset.authId.replace(/:/g, "_"));
									for (var i = 0; i < toMute.length; i++) {
										toMute[i].style.opacity = .4;
									}
									updateMuted();
									return true;
								},
								disabled: function (key, opt) {
									return !(this[0].dataset.authId && channel.data.usersByAuthId[this[0].dataset.authId])
								},
							},
						}
					});
					
					jQ(document.body).on("contextmenu:blur", ".context-menu-item",
						function (e) {
							var contextMenuItems = jQ(".context-menu-item");
							for (var i = 0; i < contextMenuItems.length; i++) {
								var item = contextMenuItems[i];
								if (item.classList.contains("contextMenuBanButton")) {
									item.dataset.state = "0";
									item.textContent = i18n.t("nuclearnode:chat.ban");
								}
								else if (item.classList.contains("contextMenuModButton")) {
									item.dataset.state = "0";
									item.textContent = i18n.t("nuclearnode:chat.mod");
								}
							}
						}
					);
				});
			
				// A little wrapper thing to make the canvas fill up the gameImages object
				var ctx = canvasContext;
				ctx.drawImageRedux = ctx.drawImage; // Do a little wrapping
				ctx.drawImage = function () {
					for (i = 0; i < missingGameImgs.length; i++) {
						if (arguments[0].src.toLowerCase().indexOf("/images/" + missingGameImgs[i].toLowerCase() + ".png") != -1) {
							// Fill up gameImages
							gameImages[missingGameImgs[i]] = arguments[0];
							backupSources[missingGameImgs[i]] = arguments[0].src;
							if (bpOverlay.isThemed) {
								replaceImage(missingGameImgs[i]);
							}
							
							missingGameImgs.splice(i, 1);
							break;
						}
					}
				
					// If there has been an offset specified, apply it
					var replaced = false;
					for (var i in replacementOffsets) {
						if (gameImages[i] && gameImages[i].src === arguments[0].src) {
							replaced = replacementOffsets[i];
							ctx.translate(replaced.x, replaced.y);
							break;
						}
					}
				
					// Of course, we need to call the actual function first
					var val = ctx.drawImageRedux.apply(this, arguments);
					
					// reset the offset
					if (replaced) {
						ctx.translate(-replaced.x, -replaced.y);
					}
					return val;
				};
			
				// I guess I'm wrapping this as well
				channel.socket.listeners("chatMessage").pop();
				channel.socket.on("chatMessage", function(e) {
					if (!bpOverlay.ignoring[e.userAuthId]) {
						var notified = false;
						var index;
						if (e.text) {
							var lowercaseText = e.text.toLowerCase();
							if (bpOverlay.notifications) {
								if ((index = lowercaseText.indexOf(app.user.displayName.toLowerCase())) !== -1) {
									if ((index === 0 || lowercaseText[index-1].search(/\W/) !== -1) &&
										(index + app.user.displayName.length >= lowercaseText.length || lowercaseText[index + app.user.displayName.length].search(/\W/) !== -1)) {
										if (bpOverlay.is_hidden) {
											bpOverlay.notificationSound.play();
										}
										notified = true;
									}
								}
								else {
									var i = 0;
									for (; i < bpOverlay.alias.length; i++) {
										if ((index = lowercaseText.indexOf(bpOverlay.alias[i])) !== -1) {
											if ((index === 0 || lowercaseText[index-1].search(/\W/) !== -1) &&
												(index + bpOverlay.alias[i].length >= lowercaseText.length || lowercaseText[index + bpOverlay.alias[i].length].search(/\W/) !== -1)) {
												if (bpOverlay.is_hidden) {
													bpOverlay.notificationSound.play();
												}
												notified = true;
												break;
											}
										}
									}
								}
							}
						}
					
						null != e.userAuthId ? channel.appendToChat("Message Author-" + e.userAuthId.replace(/:/g, "_") + (notified ? " highlighted" : ""), JST["nuclearnode/chatMessage"]({
							text: e.text,
							author: JST["nuclearnode/chatUser"]({
								user: channel.data.usersByAuthId[e.userAuthId],
								i18n: i18n,
								app: app
							})
						})) : channel.appendToChat("Info" + (notified ? " highlighted" : ""), i18n.t("nuclearnode:chat." + e.text))
					}
				});
			
				// Screw your function for handling chat messages, Elisee
				// I'm going to make a better one! With blackjack! And hookers!
				JST["nuclearnode/chatMessage"] = function (e) {
					var t;
					var a = [];
					var n = e || {};
					
					return function (e, n) {
						a.push(
							(null == (t = e) ? "" : t) +
							':  <span class="Content">' +
							twitchify(jade.escape(null == (t = n) ? "" : t)) +  // This function is literally the exact same as before except for this line
							"</span>")
					}.call(this, "author" in n ? n.author : "undefined" != typeof author ? author : void 0, "text" in n ? n.text : "undefined" != typeof text ? text : void 0), a.join("")
				};

				// Get rid of the annoying Ban and Mod buttons next to the chat message.
				JST["nuclearnode/chatUser"] = function (e) {
					// Again, this is just elisee's code with like just a tiny bit changed
					var t, a = [],
						n = e || {};
					return function (e, n, r) {
						var l = [];
						(function () {
							var t = e.serviceHandles;
							if ("number" == typeof t.length)
								for (var a = 0, r = t.length; r > a; a++) {
									var s = t[a];
									null == s && (s = n.t("nuclearnode:serviceHandlePlaceholder")), "guest" != a && l.push(n.t("nuclearnode:userHandleOnService", {
										handle: s,
										service: n.t("nuclearnode:loginServices." + a)
									}))
								} else {
									var r = 0;
									for (var a in t) {
										r++;
										var s = t[a];
										null == s && (s = n.t("nuclearnode:serviceHandlePlaceholder")), "guest" != a && l.push(n.t("nuclearnode:userHandleOnService", {
											handle: s,
											service: n.t("nuclearnode:loginServices." + a)
										}))
									}
								}
						})
						.call(this), a.push("<span" + jade.attr("title", l.join(", "), !0, !1) + (e.authId ? jade.attr("data-auth-id", e.authId, !0, !1) : "") + ' class="User">'), "" != e.role && a.push("<span" + jade.attr("title", n.t("nuclearnode:userRoles." + e.role), !0, !1) + jade.cls(["UserRole_" + e.role], [!0]) + "></span> "), a.push(jade.escape(null == (t = e.displayName) ? "" : t)), a.push("</span>")
						// Got rid of the Ban and Mod buttons from the line above
					}.call(this, "user" in n ? n.user : "undefined" != typeof user ? user : void 0, "i18n" in n ? n.i18n : "undefined" != typeof i18n ? i18n : void 0, "app" in n ? n.app : "undefined" != typeof app ? app : void 0), a.join("")
				}
				// Those buttons are being rid of so we don't accidentally ban people when trying to chat
				// A list of people that you can ban will be provided
			
				// Chat message wrapper
				var gameChat = channel.appendToChat;
				channel.appendToChat = function(header, message) {
					// This stuff's in a try block because I want the default functions to go through even if my custom code fails
					try {
						// Link using the autolinker library any links in the message.
						message = Autolinker.link(message, {
							className: "chatMessageLink"
						});
						// That should be fine, because I don't think the Autolinker library disturbs existing tags
						
						// Since Info messages don't go through JST
						// This is needed
						if (header === "Info" && message.indexOf("class=\"User\"") === -1) {
							message = twitchify(message);
						}
						
						// Scroll the chat down.
						if (bpOverlay.autoScroll) {
							var chatLog = document.getElementById("ChatLog");
							chatLog.scrollTop = chatLog.scrollHeight;
						}
					} finally {
						// Do the actual default chat message function
						gameChat(header, message);
					}
				};

				// setActivePlayerIndex wrapper
				var gameSetActivePlayerIndex = channel.socket.listeners("setActivePlayerIndex").shift();
				channel.socket.on("setActivePlayerIndex", function(actor) {
					try {
						// Since the first event that fires when a game starts is the setActivePlayerIndex event,
						// We create the infoBox and any other first-run procedures here
						if (bpOverlay.firstRun) {
							generateActorConditions();

							//reset the alphabet
							bpOverlay.alphapos=0;


							// Set firstRun to false so a new box is not created every time there's a turn change
							bpOverlay.firstRun = false;

							if(bpOverlay.adventureTextMode) {
								document.getElementById("adventureMessages").innerHTML="";
								sendAdventureMessage(adventureTextFormat.chooseText("newRound"), "rgb(10,200,150)");					
							}
							
							bpOverlay.adventureFirstRun=true;
						}

						// Hide the context menu if it is the user's turn
						if (channel.data.actors[actor].authId === window.app.user.authId) {
							jQ('#context-menu-layer').trigger('mousedown');
						}
						
						//invisible break
						sendAdventureMessage("break", "rgb(20,20,20");
												

						// Chatbox autofocus code && hijacked for textAdventure
						// Which creates a strange conundrum of double checking the bpOverlay.autoFocus, but hey. Smaller code.
						// Nested checks ahoy because laziness.
						if (bpOverlay.autoFocus || bpOverlay.adventureTextMode) {

							if(bpOverlay.adventureTextMode) {
								//I'm afraid to have these recalculations elsewhere, they aren't that costly anyhow.
								//Player info
								var playerLives=0;
								var playerLetters=["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v"];					
								var playerIndex = 200;
								//What level? How many letters?
								for(i=0; i < channel.data.actors.length; i++) {
									if(channel.data.actors[i].authId === window.app.user.authId) {
										playerLives = channel.data.actors[i].lives;
										playerLetters = channel.data.actors[i].lockedLetters;
										playerIndex = i;
									}
								}

								if(playerIndex == 200) {
									var level = 0;
								} else if(bpOverlay.flips[playerIndex] >= bpOverlay.adventureLevels.length) {
									var level = bpOverlay.adventureLevels.length - 1;
								} else {
									var level = bpOverlay.flips[playerIndex];
								}

								var textAdventurePINFO = document.getElementById("adventurePINFO");
								textAdventurePINFO.innerHTML = window.app.user.displayName + " : " + bpOverlay.adventureLevels[level];

								var textAdventureEXPINFO = document.getElementById("adventureEXPINFO");
								var remaining="";					
								//Player remaining letters
								for(i in playerLetters) {
									remaining+=playerLetters[i].toUpperCase();
								}

								textAdventureEXPINFO.innerHTML = "Experience needed: " + remaining;

								

								
								//Player health bar
								var textAdventureHealth = document.getElementById("adventureHealth");
								textAdventureHealth.style.width = (10 + playerLives * 70) + "px";
								
								//Player exp bar
								var textAdventureExp = document.getElementById("adventureExp");
								textAdventureExp.style.width= (10 + (21 - playerLetters.length) * 10) + "px";
								
							}


							//There is a very very very small chance that this will not work for the "first shift" of the "first round"
							//It does work as expected after that though. Almost flawless. People will probably not notice.
							//Either that or change the code... but who's unlazy enough? I mean
							//This works 90% of the time for the first shift and 100% after that.
							if (bpOverlay.focusNext && bpOverlay.autoFocus) {
								// If focusNext is true (i.e. it's immediately after the player's turn)
								// We set the focus to the chatbox, and reset focusNext.
								setTimeout(function() {
									document.getElementById("ChatInputBox").focus();
								}, 400);
								bpOverlay.focusNext = false;
							
							}
							//If first-run, then a small delay is needed to get a correct wordRoot.	
							if(!bpOverlay.adventureFirstRun) {
								if (channel.data.actors[actor].authId === window.app.user.authId) {
									// If it's the user's turn, set focusNext to true so the next time
									// setActivePlayerIndex fires, we set focus to the chatbox
									if(bpOverlay.autoFocus) {
										bpOverlay.focusNext = true;
									}
									
									sendAdventureMessage(
										adventureTextFormat.chooseText("userTurn", channel.data.wordRoot),
										"rgb(90, 250, 0)"
									);
		
								
								} else {
							
									sendAdventureMessage(
										adventureTextFormat.chooseText("playerTurn", channel.data.actors[actor].displayName, channel.data.wordRoot),
										"rgb(255, 165, 0)"
									);

								}
							}

						}
					} finally {
						// Call the actual game function						
						gameSetActivePlayerIndex(actor);
						if(bpOverlay.adventureFirstRun) {
							bpOverlay.adventureFirstRun = false;
							//The channel.data.wordRoot needs to update in the first run
							setTimeout(function() {
									if (channel.data.actors[actor].authId === window.app.user.authId) {
										// If it's the user's turn, set focusNext to true so the next time
										// setActivePlayerIndex fires, we set focus to the chatbox
										if(bpOverlay.autoFocus) {
											bpOverlay.focusNext = true;
										}

										sendAdventureMessage(
											adventureTextFormat.chooseText("userTurn", channel.data.wordRoot),
											"rgb(90, 250, 0)"
										);
			
								
									} else {
							
										sendAdventureMessage(
											adventureTextFormat.chooseText("playerTurn", channel.data.actors[actor].displayName, channel.data.wordRoot),
											"rgb(255, 165, 0)"
										);

									}
							}, 100);
						}
						//We need to do this shortly after a shift because the channel needs to be updated first, every time.
						if(bpOverlay.adventureTextMode) {
						setTimeout(function() {
							for(i=0; i < channel.data.actors.length; i++) {

									var turns = document.getElementById("adventureTurns");
									var index = channel.data.activePlayerIndex;
									if( index == i ) {
										if(typeof channel.data.actors[index].pictureURL === "undefined") {
											var imgSource = "http://bombparty.sparklinlabs.com/images/AvatarPlaceholder.png";					
										} else {
											var imgSource = channel.data.actors[index].pictureURL;
										}					
					
										var EXP = (21 - channel.data.actors[index].lockedLetters.length);
										var hearts="";
										for(j=0; j < channel.data.actors[index].lives; j++) {
											hearts+="♥";
										}
										turns.innerHTML="<img src=' "+ imgSource + "' height='70px' width='70px' style='float:left; margin-right: 10px'></img><div style='float:right;'><p style='color: #DFA'>" + channel.data.actors[i].displayName + "<p style='color: orange'>Lives: <span style='color: red'>" + hearts + "</span></p><p style='color: #A746C7'>EXP: <span style='color: #7D8ADB'>" + EXP + "/21</div>";	
									}
								}
							}, 
						100);
	
						}	
					}	
				});

				// winWord wrapper
				var gameWinWord = channel.socket.listeners("winWord").shift();
				channel.socket.on("winWord", function(actor) {
					try {
						// We have to manually determine if the user flips, because apparently there's no event
						// that fires when a player flips.

						// t is the player we're considering.
						// Why t? I have no idea.
						var t = channel.data.actorsByAuthId[actor.playerAuthId];
						var playerNum = bpOverlay.playerAuthId[actor.playerAuthId];
						var lockedLetters = t.lockedLetters.slice();
						var lastWord = t.lastWord.toLowerCase();
						var prevExp = lockedLetters.length;
						var scoreSum = 0;
						// Remove the letters of the last word that a person used
						// from the letters they need to flip
						for (i = 0; i < lastWord.length; i++) {
							var index;
							if ((index = lockedLetters.indexOf(lastWord[i])) != -1) {
								lockedLetters.splice(index, 1);
							}

							if(bpOverlay.scoreMode) {
								scoreSum += bpOverlay.letterScore[lastWord[i]];
							}

							
						}
						var experience = prevExp - lockedLetters.length;

						if(bpOverlay.scoreMode) {
							scoreNotifier(bpOverlay.playerNames[playerNum] + " " + scoreSum);
							bpOverlay.playerScores[playerNum] += scoreSum;
							updateScores();
						}

						// Update the alpha thing
						if (lastWord[0].toLowerCase() === bpOverlay.alphabet[bpOverlay.alpha[playerNum].progress]) {
							bpOverlay.alpha[playerNum].progress++;
							if (bpOverlay.alpha[playerNum].progress >= bpOverlay.alphabet.length) {
								bpOverlay.alpha[playerNum].progress = 0;
								bpOverlay.alpha[playerNum].completed++;
							}
							
								if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
									document.getElementById(playerNum + " alpha").textContent = bpOverlay.alphabet[bpOverlay.alpha[playerNum].progress].toUpperCase() + " (" + bpOverlay.alpha[playerNum].completed + ")";
								}
						}
						
						// If the lockedLetters is empty after removing all those, letters, the player has flipped
						var flipped = (lockedLetters.length === 0);

						if (flipped) {
							// Append one to the flip counter
							bpOverlay.flips[playerNum] += 1;

							if(bpOverlay.scoreMode) {
								bpOverlay.playerScores[playerNum] += 100;
								scoreNotifier(bpOverlay.playerNames[playerNum] + " FLIP BONUS");
							}

							// If the box is created, update it too
							if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
								document.getElementById(playerNum + " flips").textContent = bpOverlay.flips[playerNum];
							}

							if (t.lives === 3) {
								// If the flip happened when the player's lives is already at three, it's an u-flip
								// Increment and update
								bpOverlay.uFlips[playerNum] += 1;
								if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
									document.getElementById(playerNum + " uFlips").textContent = bpOverlay.uFlips[playerNum];
								}

							}

							if(bpOverlay.flips[playerNum] >= bpOverlay.adventureLevels.length) {
								var level = bpOverlay.adventureLevels.length - 1;
							} else {
								var level = bpOverlay.flips[playerNum];
							}

							if(channel.data.actors[playerNum].displayName === window.app.user.displayName) {
								sendAdventureMessage(
									adventureTextFormat.chooseText("userLevelUp", bpOverlay.adventureLevels[level]),
									"rgb(200, 200, 0"
								); 							
							} else {
								sendAdventureMessage(
									adventureTextFormat.chooseText("levelUp", channel.data.actors[playerNum].displayName, bpOverlay.adventureLevels[level]),
									"rgb(200, 200, 0)"
								);							
							}

						} else {
							if(channel.data.actors[playerNum].displayName === window.app.user.displayName) {
								sendAdventureMessage(adventureTextFormat.chooseText("userWinWord", t.lastWord.toUpperCase(), experience),
								"rgb(250, 0, 250)"
								); 						

							} else {							
								sendAdventureMessage(adventureTextFormat.chooseText("winWord", t.displayName, t.lastWord.toUpperCase(), experience), 
								"rgb(250, 0, 250)"
								);
							} 						
						}

						// Add one to the word count, and update the box if it's been created
						bpOverlay.wordCount += 1;
						if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
							document.getElementById("infoWordCounter").textContent = tran.t("wordCountText") + bpOverlay.wordCount;
						}

						//Let the player get more alphabets
						if(channel.data.actors[playerNum].displayName === window.app.user.displayName) {
							if(bpOverlay.alphabet.length <= bpOverlay.alphapos) {
										bpOverlay.alphapos = 0;
									} else {
										bpOverlay.alphapos++;
							}
						}
					} finally {
						// Call the actual game function
						gameWinWord(actor);
					}
				});

				// setPlayerLives wrapper
				var gameSetPlayerLives = channel.socket.listeners("setPlayerLives").shift();
				channel.socket.on("setPlayerLives", function(actor) {
					try {
						// Apparently, setPlayerLives is only used for decreasing a player's lives.
						// It unfortunately doesn't fire when a player flips.

						
						if(actor.playerAuthId === window.app.user.authId) {
							sendAdventureMessage(adventureTextFormat.chooseText("userLostLife"), "rgb(255,20,10)");
						} else {						
							sendAdventureMessage(adventureTextFormat.chooseText("lostLife", channel.data.actorsByAuthId[actor.playerAuthId].displayName),
							"rgb(255,20,10)");
						}
						
						var t = channel.data.actorsByAuthId[actor.playerAuthId];
						var playerNum = bpOverlay.playerAuthId[actor.playerAuthId];

						// if the game data's lives is larger than the updated actor's lives, then the player lost a life
						if (t.lives > actor.lives) {
							// Increment and update
							bpOverlay.lostLives[playerNum] += 1;
							if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
								document.getElementById(playerNum + " lives").textContent = bpOverlay.lostLives[playerNum];
							}
						}
					} finally {
						// Call the actual game function
						gameSetPlayerLives(actor);
					}
				});

				// setPlayerState wrapper
				var gameSetPlayerState = channel.socket.listeners("setPlayerState").shift();
				channel.socket.on("setPlayerState", function(actor) {
					// setPlayerState is really only used to make a player dead.
					try {
						if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
							if (actor.state == "dead") {
								// This code basically just greys out the dead player's row on the scoreboard
								var playerNum = bpOverlay.playerAuthId[actor.playerAuthId];
								var tableRow = document.getElementById(playerNum + " row");
								tableRow.style.color = "#666";

								// and if hideDead is true, it hides 'em too
								if (bpOverlay.hideDead) {
									tableRow.style.display = "none";
								}
								if(actor.playerAuthId === window.app.user.authId) {
									sendAdventureMessage(adventureTextFormat.chooseText("userDeath", channel.data.actorsByAuthId[actor.playerAuthId].displayName)
									, "rgb(255,255,255"); 
								} else {
									sendAdventureMessage(adventureTextFormat.chooseText("death", channel.data.actorsByAuthId[actor.playerAuthId].displayName),
									"rgb(255,255,255");
								}							
							}
						}
					} finally {
						// Call the actual game function
						gameSetPlayerState(actor);
					}
				});

				// endGame wrapper
				var gameEndGame = channel.socket.listeners("endGame").shift();
				channel.socket.on("endGame", function(actorName) {
					try {
						// Set firstRun to true, because we want the box to be redraw next round
						bpOverlay.firstRun = true;

						if(bpOverlay.adventureTextMode) {
							document.getElementById("adventureMessages").innerHTML="";
							document.getElementById("adventureTurns").innerHTML="";
							sendAdventureMessage(adventureTextFormat.chooseText("endRound", channel.data.wordRoot.toUpperCase()),
							"rgb(204, 255, 204)");
						}

						

						// Oh, and set the focus to the chatBox if you need to as well
						if (bpOverlay.autoFocus) {
							if (bpOverlay.focusNext) {
								setTimeout(function() {
									document.getElementById("ChatInputBox").focus();
								}, 400);
								bpOverlay.focusNext = false;
							}
						}

						// Play the notification sound if specified
						if (bpOverlay.endGameNotification && bpOverlay.is_hidden) {
							bpOverlay.notificationSound.play();
						}
						
						
						// Update the time timer as it might be 1 second behind
						updateTime();

						//Reset the playerScores
						bpOverlay.playerScores = Array.apply(null, new Array(20)).map(Number.prototype.valueOf,0);

					} finally {
						// Call the actual game function
						gameEndGame(actorName);
						setTimeout(function() {
							sendAdventureMessage(adventureTextFormat.chooseText("winner", channel.data.lastWinner),
							"rgb(24, 24, 255)");
						}, 100);
					}
				});

				// This function makes the tooltip text that lists all the players in the room
				// when you hover over the player count.
				// Double function: construct the player list in the leaderboards tab
				var changePlayerText = function() {
					var playerCount = document.getElementsByClassName("ChannelUsers")[0];
					var title = tran.t("playersTitle");
					for (var i in channel.data.users) {
						title += "\n" + channel.data.users[i].displayName;
					}
					playerCount.title = title;
					
					// Get the playerListDiv
					var playerListDiv = document.getElementById("PlayerList");
					
					// Make the innerHTML
					var PDIH = "";
					for (var i in channel.data.users) {
						// e is our lucky letter today
						var e = channel.data.users[i];
						var t = e.serviceHandles;
						var a = [];
						var n = i18n;
						var r = app;
						var l = [];
						
						// At this point, I kinda said eff it
						// So we'll just use Elisee's obfuscated code because it works perfectly well
						(function () {
							var t = e.serviceHandles;
							if ("number" == typeof t.length)
								for (var a = 0, r = t.length; r > a; a++) {
									var s = t[a];
									null == s && (s = n.t("nuclearnode:serviceHandlePlaceholder")), "guest" != a && l.push(n.t("nuclearnode:userHandleOnService", {
										handle: s,
										service: n.t("nuclearnode:loginServices." + a)
									}))
								} else {
									var r = 0;
									for (var a in t) {
										r++;
										var s = t[a];
										null == s && (s = n.t("nuclearnode:serviceHandlePlaceholder")), "guest" != a && l.push(n.t("nuclearnode:userHandleOnService", {
											handle: s,
											service: n.t("nuclearnode:loginServices." + a)
										}))
									}
								}
						})
						 .call(this), a.push("<span" + jade.attr("title", l.join(", "), !0, !1) + ' class="BpOS-User">'), "" != e.role && a.push("<span" + jade.attr("title", n.t("nuclearnode:userRoles." + e.role), !0, !1) + jade.cls(["UserRole_" + e.role], [!0]) + "></span> "), a.push(jade.escape(null == (t = e.displayName) ? "" : t)), a.push('<span class="Actions">'), ("moderator" == r.user.role || "host" == r.user.role || "hubAdministrator" == r.user.role) && (a.push('<button' + jade.attr("data-auth-id", e.authId, !0, !1) + jade.attr("data-display-name", e.displayName, !0, !1) + ' class="BanUser">' + jade.escape(null == (t = n.t("nuclearnode:chat.ban")) ? "" : t) + "</button>"), ("host" == r.user.role || "hubAdministrator" == r.user.role) && a.push("<button" + jade.attr("data-auth-id", e.authId, !0, !1) + jade.attr("data-display-name", e.displayName, !0, !1) + ' class="ModUser">' + jade.escape(null == (t = n.t("nuclearnode:chat.mod")) ? "" : t) + "</button>")), a.push("<button" + jade.attr("data-auth-id", e.authId, !0, !1) + jade.attr("data-display-name", e.displayName, !0, !1) + ' class="MuteUser">' + tran.t("muteUser") + "</button>"), a.push("</span>"), a.push("</span>")
						
						PDIH += a.join("");
						PDIH += "<br />";
					}
					
					playerListDiv.innerHTML = PDIH;
				};

				// We want it to fire now, when a user is added, and when a users is removed.
				channel.socket.on("addUser", changePlayerText);
				channel.socket.on("removeUser", changePlayerText);
				channel.socket.on("setUserRole", changePlayerText);
				changePlayerText();
				
				// Update the muted player text
				var updateMuted = function () {
					var ignoringDiv = jQ("#IgnoringListDiv")[0];
					var innerHTML = "";
					var ignoring_any = false;
					for (var i in bpOverlay.ignoring) {
						innerHTML += "<span title=\"" + i + "\">" + bpOverlay.ignoring[i] + "<span class=\"Actions\"><button class=\"UnmuteUser\" data-auth-id=\"" + i + "\">" + tran.t("unmuteUser") + "</button></span></span><br />"
						ignoring_any = true;
					}
					if (!ignoring_any) {
						innerHTML = tran.t("ignoringEmpty");
					}
					ignoringDiv.innerHTML = innerHTML;
					ignoringDiv.dataset.json = JSON.stringify(bpOverlay.ignoring);
				}
				
				// Expose this to the globals so the GM script has access to it
				setMuted = function (jsonString) {
					bpOverlay.ignoring = JSON.parse(jsonString);
					for (var i in bpOverlay.ignoring) {
						var toMute = jQ(".Author-" + i.replace(/:/g, "_"));
						for (var j = 0; j < toMute.length; i++) {
							toMute[j].style.opacity = .4;
						}
					}
					updateMuted();
				}
				
				// Click wrapper
				// Pls put any document.click actions in here
				document.addEventListener("click", function (e) {
					if ("BUTTON" === e.target.tagName) {
						if (e.target.className === "MuteUser") {
							bpOverlay.ignoring[e.target.dataset.authId] = e.target.dataset.displayName;
							var toMute = jQ(".Author-" + e.target.dataset.authId.replace(/:/g, "_"));
							for (var i = 0; i < toMute.length; i++) {
								toMute[i].style.opacity = .4;
							}
							updateMuted();
							return;
						}
						else if (e.target.className === "UnmuteUser") {
							delete bpOverlay.ignoring[e.target.dataset.authId];
							updateMuted();
							return;
						}
					}
				});
			};

			// Code that needs to be run when the bot activates.
			var firstRunProcs = function() {
				// The entire styleshee for the bot is wrapper up in this long string.
				// Probably a better way of doing this
				// Lol. TFW web-console css is hard
				var style = document.createElement('style');
				style.appendChild(document.createTextNode('.headerButtonDiv {  display: -webkit-box;  display: -moz-box;  display: -webkit-flex;  display: -ms-flexbox;  display: box;  display: flex;  opacity: 0.3;  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)";  filter: alpha(opacity=30);} .headerButtonDiv:hover {  opacity: 1;  -ms-filter: none;  filter: none;} button.headerButton {  border: none;  background: none;  cursor: pointer;  opacity: 0.5;  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";  filter: alpha(opacity=50);  display: -webkit-box;  display: -moz-box;  display: -webkit-flex;  display: -ms-flexbox;  display: box;  display: flex;} button.headerButton:hover {  opacity: 0.8;  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";  filter: alpha(opacity=80);} button.headerButton:active {  opacity: 1;  -ms-filter: none;  filter: none;} .infoTableDiv::-webkit-scrollbar { width: 15px; height: 15px; } .infoTableDiv::-webkit-scrollbar-button { height: 0px; width: 0px; } .infoTableDiv::-webkit-scrollbar-track { background-color: rgba(0,0,0,0.05); } .infoTableDiv::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border: 3px solid transparent; -webkit-border-radius: 6px; border-radius: 6px; -webkit-background-clip: content; -moz-background-clip: content; background-clip: content-box; } .infoTableDiv::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.15); } .infoTableDiv::-webkit-scrollbar-corner { background-color: rgba(255,255,255,0.1); }#overlaySettingsTab{text-align:left;overflow-y:auto}#overlaySettingsTab h2{padding:.5em .5em 0;opacity:.5;-ms-filter:"alpha(Opacity=50)";filter:alpha(opacity=50)}#overlaySettingsTab h3{padding:.5em .5em 0;opacity:.5;-ms-filter:"alpha(Opacity=50)";filter:alpha(opacity=50)}#overlaySettingsTab table{width:100%;padding:.5em}#overlaySettingsTab table tr td:nth-child(1){width:40%}#overlaySettingsTab table tr td:nth-child(2){width:60%}#overlaySettingsTab table button:not(.UnbanUser),#overlaySettingsTab table input,#overlaySettingsTab table select,#overlaySettingsTab table textarea{width:100%;background:#444;border:none;padding:.25em;color:#fff;font:inherit}#overlaySettingsTab table textarea{resize:vertical;min-height:3em}#overlaySettingsTab table ul{list-style:none}#overlaySettingsTab .BpOS-User .UserRole_hubAdministrator:before{content:\'[★]\';cursor:default;color:#c63}#overlaySettingsTab .BpOS-User .UserRole_host:before{content:\'★\';cursor:default;color:#dc8}#overlaySettingsTab .BpOS-User .UserRole_administrator:before{content:\'☆\';cursor:default;color:#dc8}#overlaySettingsTab .BpOS-User .UserRole_moderator:before{content:\'●\';cursor:default;color:#346192}#overlaySettingsTab .Actions button{border:none;background:0 0;cursor:pointer;margin:0 .25em;outline:0;font-weight:400;font-size:smaller;opacity:.8;-ms-filter:"alpha(Opacity=80)";filter:alpha(opacity=80)}#overlaySettingsTab .Actions button.BanUser{color:#a00}#overlaySettingsTab .Actions button.ModUser,#overlaySettingsTab .Actions button.UnmodUser{color:#2a3} .Actions button.MuteUser{color:#ddd} .Actions button.UnmuteUser{color:#eee} #overlaySettingsTab .Actions button:hover{opacity:1;-ms-filter:none;filter:none}#overlaySettingsTab .Actions button:active{background:rgba(255,0,0,.2)}#overlaySettingsTab input{-moz-user-select:text;-webkit-user-select:text;-ms-user-select:text}#ChatLog .highlighted{background: rgba(255, 0, 0, 0.05);}#ChatLog .highlighted:hover {background: rgba(255, 0, 0, 0.1);}'));
				document.getElementsByTagName('head')[0].appendChild(style);
				
				// Load the hideDead on/off images
				var hideDeadOn = document.createElement("img");
				hideDeadOn.width = 15;
				hideDeadOn.height = 15;
				hideDeadOn.src = bpImgUrls.hideDeadOn;
				bpOverlayImgs.hideDeadOn = hideDeadOn;

				var hideDeadOff = document.createElement("img");
				hideDeadOff.width = 15;
				hideDeadOff.height = 15;
				hideDeadOff.src = bpImgUrls.hideDeadOff;
				bpOverlayImgs.hideDeadOff = hideDeadOff;

				//AutoScrollButton made with makeHeaderButton Function
				//See usage in the declaration-meow for makeHeaderButton
				makeHeaderButton(bpOverlayImgs.on,
					bpOverlayImgs.off,
					"chatDownButton",
					tran.t("chatDownButtonTitle"),
					true, //Because we want the onImg displayed at creation
					//Then the function within this function
					function() {
						// Flip the autoScroll property
						bpOverlay.autoScroll = !bpOverlay.autoScroll;

						if (bpOverlay.autoScroll) {
							// if autoScroll is true, remove the off image and add the on image...
							document.getElementById("chatDownButton").removeChild(bpOverlayImgs.off);
							document.getElementById("chatDownButton").appendChild(bpOverlayImgs.on);
							document.getElementById("chatDownButton").dataset.state = true;
						} else {
							// ...and vice versa if autoScroll is false
							document.getElementById("chatDownButton").removeChild(bpOverlayImgs.on);
							document.getElementById("chatDownButton").appendChild(bpOverlayImgs.off);
							document.getElementById("chatDownButton").dataset.state = false;
						}
					}
				);

				//autoFocus button made 
				makeHeaderButton(bpOverlayImgs.autoFocusOn,
					bpOverlayImgs.autoFocusOff,
					"autoFocusButton",
					tran.t("autoFocusButtonTitle"),
					true,
					function() {
						// Flip the autoFocus property
						bpOverlay.autoFocus = !bpOverlay.autoFocus;

						if (bpOverlay.autoFocus) {
							// You must know the drill by now
							document.getElementById("autoFocusButton").removeChild(bpOverlayImgs.autoFocusOff);
							document.getElementById("autoFocusButton").appendChild(bpOverlayImgs.autoFocusOn);
							document.getElementById("autoFocusButton").dataset.state = true;
						} else {
							// I'm not even going to bother
							document.getElementById("autoFocusButton").removeChild(bpOverlayImgs.autoFocusOn);
							document.getElementById("autoFocusButton").appendChild(bpOverlayImgs.autoFocusOff);
							document.getElementById("autoFocusButton").dataset.state = false;
						}
					}
				);

				//dragOn button made                
				makeHeaderButton(bpOverlayImgs.dragOn,
					bpOverlayImgs.dragOff,
					"dragButton",
					tran.t("dragButtonTitle"),
					false,
					function() {
						//We don't want the button to react if the neither of the boxes have been created
						
						// Well, because generateActorConditions checks bpOverlay.dragOn, I don't think it matters anymore
						// So I'm just going to override it :P (no offense)
						// This is in preparation for saving settings across bombparty sessions
						// Because if the user was to prefer the drag box, that should be the default
						// Which means it bpOverlay.dragOn needs to be true from the get-go
						if (bpOverlay.boxHasBeenCreated || bpOverlay.dragBoxHasBeenCreated) {
							bpOverlay.dragonDrop = !bpOverlay.dragonDrop; //Flippety flop the boolean be bop

							var button = document.getElementById("dragButton");
							var sideBar = document.getElementById("Sidebar");
							var infoBox = document.getElementById("infoBox");
							var dragOnDrop = document.getElementById("dragonDrop");

							//In short, this is a switch between docked and dragon mode. Ugly and intuitive                
							if (bpOverlay.dragonDrop) {

								sideBar.removeChild(infoBox);
								dragOnDrop.appendChild(infoBox);

								button.removeChild(bpOverlayImgs.dragOff);
								button.appendChild(bpOverlayImgs.dragOn);
								bpOverlay.dragBoxHasBeenCreated = true;
								bpOverlay.boxHasBeenCreated = false;
								button.dataset.state = true;
							} else {

								dragOnDrop.removeChild(infoBox);
								sideBar.insertBefore(infoBox, sideBar.firstChild);
								bpOverlay.dragBoxHasBeenCreated = false;
								bpOverlay.boxHasBeenCreated = true;

								button.removeChild(bpOverlayImgs.dragOn);
								button.appendChild(bpOverlayImgs.dragOff);
								button.dataset.state = false;
							}
						} else {
							// The subverting begins
							bpOverlay.dragonDrop = !bpOverlay.dragonDrop; //Flippety flop the boolean be bop

							var button = document.getElementById("dragButton");
							
							if (bpOverlay.dragonDrop) {

								button.removeChild(bpOverlayImgs.dragOff);
								button.appendChild(bpOverlayImgs.dragOn);
								button.dataset.state = true;
								
							} else {

								button.removeChild(bpOverlayImgs.dragOn);
								button.appendChild(bpOverlayImgs.dragOff);
								button.dataset.state = false;
								
							}
						
							//alert("Didn't find the infoBox.\n\nIf you're running this for the first time and the round hasn't started or if it's the same player's turn from when you started the overlay then this is normal.\n\nYou impatient flap :D");
						}
					}
				);
				
				
				//Add the fourth button on the settingsTab that hopefully doesn't interfere with the others.
				var sideButtons = document.getElementById("SidebarTabButtons");
				var sideTabs    = document.getElementById("SidebarTabs");

				//Make a clone of the settingstab and change it to what we want
				var overlaySettingsTab = sideTabs.children[1].cloneNode(true);	//clone settings tab
				overlaySettingsTab.id="overlaySettingsTab";
				overlaySettingsTab.setAttribute("class", "");
				overlaySettingsTab.innerHTML="";	//Empty the innerHTML
				
				//Make a clone of a tab button and change it to what we want
				var overlaySettingsButton = sideButtons.children[0].cloneNode(true);	//clone whatever
				overlaySettingsButton.id="overlaySettingsButton";
				overlaySettingsButton.setAttribute("class", "");					//We don't want it to start active
				overlaySettingsButton.innerHTML="BpOS";
				overlaySettingsButton.title=tran.t("overlaySettingsButtonTitle"); 

				//Appendum les shittendum
				sideButtons.appendChild(overlaySettingsButton);
				sideTabs.appendChild(overlaySettingsTab);

				//Define and activate the onclick function for our fourth button
				function overlaySettingsFunction() {
					for(i=0; i<=2; i++) {
						document.getElementById("SidebarTabButtons").children[i].classList.remove("Active");	//Prevent two active classes
					}
					for(i=0; i<=2; i++) {
						document.getElementById("SidebarTabs").children[i].classList.remove("Active");		//Prevent two active classes
					}

					document.getElementById("overlaySettingsButton").setAttribute("class", "Active");
					document.getElementById("overlaySettingsTab").setAttribute("class", "Active");

				}
				overlaySettingsButton.onclick=overlaySettingsFunction;

				
				//We only want this once (I believe) so this is outside of a function
				//Generate the overlay section and append it to the SettingsTab
				var bpOverlayH2 = document.createElement("H2");
				
				//We add an id for the jq to recognize the object
				bpOverlayH2.id="bpOverlayH2";
				bpOverlayH2.onclick=function() {
					jQ('#overlaySettingsTableWrapper').slideToggle('slow');				
				};


				//Since we can't require any styles nor anything (cross browser), we're just going to quickly write
				//a mouseover and mouseout hacks so that this is nice and responsive
				bpOverlayH2.onmouseover=function() {
					jQ('#bpOverlayH2').css("text-shadow", "0 0 24px white");
				};

				bpOverlayH2.onmouseout=function() {
					jQ('#bpOverlayH2').css("text-shadow", "0 0 0px black");
				};

				bpOverlayH2.textContent = tran.t("overlaySettingsText");
				var settingsTab = document.getElementById("overlaySettingsTab");
				settingsTab.appendChild(bpOverlayH2);
				
				// Moved over the settings tab things to here
				// We wrap everything in a div because jquery doesn't handle table smoothly
				var sTabTableWrapper = document.createElement("DIV");
				// Wrapper starts hidden
				sTabTableWrapper.style.display="none";
				sTabTableWrapper.id="overlaySettingsTableWrapper";
				var sTabTable = document.createElement("TABLE");
				sTabTable.id = "overlaySettingsTable";
				sTabTableWrapper.appendChild(sTabTable);
				settingsTab.appendChild(sTabTableWrapper);

				//Notifications h2
				var notificationsH2 = document.createElement("H2");
				notificationsH2.id = "notificationsH2";
				notificationsH2.textContent = tran.t("notificationsText");
				notificationsH2.onmouseover=function() {
					jQ('#notificationsH2').css("text-shadow", "0 0 24px white");
				};

				notificationsH2.onmouseout=function() {
					jQ('#notificationsH2').css("text-shadow", "0 0 0px black");
				};

				notificationsH2.onclick=function() {
					jQ('#notificationsWrapper').slideToggle('slow');				
				};

				settingsTab.appendChild(notificationsH2);



				// Moved over the settings tab things to here
				// We wrap everything in a div because jquery doesn't handle table smoothly
				var notTabTableWrapper = document.createElement("DIV");
				// Wrapper starts hidden
				notTabTableWrapper.style.display="none";
				notTabTableWrapper.id="notificationsWrapper";
				var notTabTable = document.createElement("TABLE");
				notTabTable.id = "notificationsTable";
				notTabTableWrapper.appendChild(notTabTable);
				settingsTab.appendChild(notTabTableWrapper);

				//Chat options h2
				var chatH2 = document.createElement("H2");
				chatH2.id = "chatH2";
				chatH2.textContent = tran.t("chatOpText");
				chatH2.onmouseover=function() {
					jQ('#chatH2').css("text-shadow", "0 0 24px white");
				};

				chatH2.onmouseout=function() {
					jQ('#chatH2').css("text-shadow", "0 0 0px black");
				};

				chatH2.onclick=function() {
					jQ('#chatWrapper').slideToggle('slow');				
				};

				settingsTab.appendChild(chatH2);

				// Wrapper starts hidden
				var chatTabTableWrapper = document.createElement("DIV");
				chatTabTableWrapper.style.display="none";
				chatTabTableWrapper.id="chatWrapper";
				var chatTabTable = document.createElement("TABLE");
				chatTabTable.id = "chatOpTable";
				chatTabTableWrapper.appendChild(chatTabTable);
				settingsTab.appendChild(chatTabTableWrapper);

				//Themes h2
				var themeH2 = document.createElement("H2");
				themeH2.id = "themeH2";
				themeH2.textContent = tran.t("themeH2Text");
				themeH2.onmouseover=function() {
					jQ('#themeH2').css("text-shadow", "0 0 24px white");
				};

				themeH2.onmouseout=function() {
					jQ('#themeH2').css("text-shadow", "0 0 0px black");
				};

				themeH2.onclick=function() {
					jQ('#themeWrapper').slideToggle('slow');				
				};

				settingsTab.appendChild(themeH2);

				// Wrapper starts hidden
				var themeTabTableWrapper = document.createElement("DIV");
				themeTabTableWrapper.style.display="none";
				themeTabTableWrapper.id="themeWrapper";
				var themeTabTable = document.createElement("TABLE");
				themeTabTable.id = "themeOpTable";
				themeTabTableWrapper.appendChild(themeTabTable);
				settingsTab.appendChild(themeTabTableWrapper);

				//Easter h2
				var easterH2 = document.createElement("H2");
				easterH2.id = "easterH2";
				easterH2.textContent = tran.t("easterText");
				easterH2.onmouseover=function() {
					jQ('#easterH2').css("text-shadow", "0 0 24px white");
				};

				easterH2.onmouseout=function() {
					jQ('#easterH2').css("text-shadow", "0 0 0px black");
				};

				easterH2.onclick=function() {
					jQ('#easterWrapper').slideToggle('slow');				
				};

				settingsTab.appendChild(easterH2);

				// Wrapper starts hidden
				var easterTabTableWrapper = document.createElement("DIV");
				easterTabTableWrapper.style.display="none";
				easterTabTableWrapper.id="easterWrapper";
				var easterTabTable = document.createElement("TABLE");
				easterTabTable.id = "easterTable";
				easterTabTableWrapper.appendChild(easterTabTable);
				settingsTab.appendChild(easterTabTableWrapper);




				// Might as well have the current players in here
				var playerListH2 = document.createElement("H2");
				playerListH2.id ="PlayerListH2";
				playerListH2.textContent = tran.t("playerListText");
				playerListH2.onclick = function() {
					jQ('#PlayerListWrapper').slideToggle('slow');				
				};


				playerListH2.onmouseover=function() {
					jQ('#PlayerListH2').css("text-shadow", "0 0 24px white");
				};

				playerListH2.onmouseout=function() {
					jQ('#PlayerListH2').css("text-shadow", "0 0 0px black");
				};

				settingsTab.appendChild(playerListH2);
				var playerListWrapper = document.createElement("DIV");
				playerListWrapper.id = "PlayerListWrapper";
				playerListWrapper.style.display = "none";
				playerListWrapper.style.marginLeft = "8px";
				settingsTab.appendChild(playerListWrapper)
				
				var playerListDiv = document.createElement("DIV");
				playerListDiv.id = "PlayerList";
				playerListWrapper.appendChild(playerListDiv);
				
				var ignoringListH3 = document.createElement("H3");
				ignoringListH3.id = "IgnoringListH3";
				ignoringListH3.textContent = tran.t("ignoringText");
				ignoringListH3.onclick = function () {
					jQ('#IgnoringListDiv').slideToggle('slow');
				};
				ignoringListH3.onmouseover=function() {
					jQ('#IgnoringListH3').css("text-shadow", "0 0 24px white");
				};

				ignoringListH3.onmouseout=function() {
					jQ('#IgnoringListH3').css("text-shadow", "0 0 0px black");
				};
				playerListWrapper.appendChild(ignoringListH3);
				
				var ignoringListDiv = document.createElement("DIV");
				ignoringListDiv.id = "IgnoringListDiv";
				ignoringListDiv.style.display = "none";
				ignoringListDiv.marginLeft = "8px";
				playerListWrapper.appendChild(ignoringListDiv);
				ignoringListDiv.textContent = tran.t("ignoringEmpty");
				
				// A little attribution table
				var creditsH2 = document.createElement("H2");
				creditsH2.id="creditsH2";
				creditsH2.onclick = function() {
					jQ('#creditsTableWrapper').slideToggle('slow');
					jQ('#creditsTextDiv').slideToggle('slow');				
				};

				creditsH2.onmouseover=function() {
					jQ('#creditsH2').css("text-shadow", "0 0 24px white");
				};

				creditsH2.onmouseout=function() {
					jQ('#creditsH2').css("text-shadow", "0 0 0px black");
				};
				creditsH2.textContent = tran.t("creditsText");
				settingsTab.appendChild(creditsH2);
				
				var creditsTable = document.createElement("TABLE");
				var creditsTableWrapper = document.createElement("DIV");
				creditsTableWrapper.style.display="none";
				creditsTableWrapper.id = "creditsTableWrapper";
				creditsTable.id = "creditsTable";
				creditsTable.innerHTML = "\
				<tr><td>" + tran.t("credits1") + "</td><td>MrInanimated</td></tr>\
				<tr><td>" + tran.t("credits2") + "</td><td>Skandalabrandur</td></tr>\
				<tr><td>" + tran.t("credits3") + "</td><td>Sanc</td></tr>\
				<tr><td>" + tran.t("creditsAutolinker") + "</td><td><a href=\"https://github.com/gregjacobs/Autolinker.js\">Autolinker.js</a></td></tr>\
				<tr><td>" + tran.t("creditsTwitchEmotes") + "</td><td><a href=\"http://twitchemotes.com/\">twitchemotes.com</a></td></tr>\
				<tr><td>" + tran.t("creditsContextMenu") + "</td><td><a href=\"http://medialize.github.io/jQuery-contextMenu/\">Medialize</a></td></tr>";
				creditsTableWrapper.appendChild(creditsTable);				
				settingsTab.appendChild(creditsTableWrapper);
				
				var creditsText = document.createElement("DIV");
				creditsText.textContent = tran.t("creditsTextText");
				creditsText.style.marginLeft = "8px";
				creditsText.id="creditsTextDiv";
				creditsText.style.display="none";
				settingsTab.appendChild(creditsText);

				
				generateSettingsElement(tran.t("containerSizeName"),
					{
						compact: tran.t("containerSizeOptions.compact"),
						fitToPlayers: tran.t("containerSizeOptions.fitToPlayers")
					},
					"containerSelect", "overlaySettingsTable",
					function () {
						//Get the infoTableDiv element and the selector created with the id 'containerSelect'
						var infoTableDiv = document.getElementsByClassName("infoTableDiv")[0];
						var sTabSelect = document.getElementById("containerSelect");
						
						// Enclosed this in an if in case those were not created
						if (infoTableDiv && sTabSelect) {
						
							//Change container.style.maxHeight depending on user choice
							if(sTabSelect.value === "compact") {
								infoTableDiv.style.maxHeight = "100px";					
							} else if (sTabSelect.value === "fitToPlayers") {
								infoTableDiv.style.maxHeight = "1000px";	//The autoflow whatever takes care of this.

								//Prevent flowing out of page
								//Let's be lazy and get the window.onresize and run it.
								var funky = window.onresize;
								funky();
							} else {
								//Do nothing
							}
						}

					}
				);
				
				// Twitch Emote settings
				generateSettingsElement(
					tran.t("twitchEmotesName"),
					{
						on: tran.t("twitchEmotesOptions.on"),
						off: tran.t("twitchEmotesOptions.off")
					},
					"twitchEmoteSelect", "chatOpTable",
					function () {
						var teSelect = document.getElementById("twitchEmoteSelect");
						
						if (teSelect.value === "on") {
							bpOverlay.twitchOn = true;
						}
						else if (teSelect.value === "off") {
							bpOverlay.twitchOff = false;
						}
						else {
						}
					}
				);
		
			
				//The text adventure setting
				generateSettingsElement(
					tran.t("textAdventureName"),
					{
						off: tran.t("textAdventureOptions.off"),
						on: tran.t("textAdventureOptions.on")
					},
					"adventureSetting", "easterTable",
					function() {
						var sTabSelect = document.getElementById("adventureSetting");
						if(sTabSelect.value === "on") {
							toggleTextAdventure(true);
						} else if(sTabSelect.value === "off") {
							toggleTextAdventure(false);
						} else {
							toggleTextAdventure(false);
						}
					}
				);

				//Score setting
				generateSettingsElement(
					tran.t("scoreName"),
					{
						off: tran.t("scoreOption.off"),
						on: tran.t("scoreOption.on"),
					},
					"scoreSetting", "easterTable",
					function() {
						var sTabSelect = document.getElementById("scoreSetting");
						if(sTabSelect.value === "on") {
							bpOverlay.scoreMode=true;
						} else {
							bpOverlay.scoreMode=false;
							var meowswitch = document.getElementById("LeaderboardTab");
							meowswitch.innerHTML=" ";
						}
					}
				);
				//Hard modes
				generateSettingsElement(
					tran.t("hardModesName"),
					{
						none: tran.t("hardModesOptions.none"),
						rev: tran.t("hardModesOptions.rev"),
						jqv: tran.t("hardModesOptions.jqv"),
						az: tran.t("hardModesOptions.az"),
						xz: tran.t("hardModesOptions.xz")
					},
					"hardModes", "easterTable",
					function() {
						var sTabSelect = document.getElementById("hardModes");
						if(sTabSelect.value === "rev") {
							var wordInputBox = document.getElementById("WordInputBox");

							var checkLetter = function() {
								document.getElementById("WordInputBox").value = document.getElementById("WordInputBox").value.split("").reverse().join("");
							}
							wordInputBox.onchange=checkLetter;
						} else if (sTabSelect.value === "jqv") {
							var wordInputBox = document.getElementById("WordInputBox");

							var checkLetter = function() {
								var inValue = document.getElementById("WordInputBox").value.toLowerCase();
								if(!((inValue.indexOf("q") > -1) || (inValue.indexOf("v") > -1) || (inValue.indexOf("j") > -1))) {
									document.getElementById("WordInputBox").value = tran.t("jqvText");
								}
								
							}
							wordInputBox.onchange=checkLetter;						
						} else if (sTabSelect.value === "az") {
							bpOverlay.alphapos=0;
							var wordInputBox = document.getElementById("WordInputBox");

							var checkLetter = function() {
								var inValue = document.getElementById("WordInputBox").value.toLowerCase();
								if(!(inValue[0] === bpOverlay.alphabet[bpOverlay.alphapos])) {
									document.getElementById("WordInputBox").value=tran.t("azText").replace("{l}", bpOverlay.alphabet[bpOverlay.alphapos]);
								} 
							}
							wordInputBox.onchange=checkLetter;
						} else if (sTabSelect.value === "xz") {
							var wordInputBox = document.getElementById("WordInputBox");

							var checkLetter = function() {
								var inValue = document.getElementById("WordInputBox").value.toLowerCase();
								if(!((inValue.indexOf("x") > -1) || (inValue.indexOf("z") > -1))) {
									document.getElementById("WordInputBox").value = tran.t("xzText");
								}
								
							}
							wordInputBox.onchange=checkLetter;
								
						} else {
							document.getElementById("WordInputBox").onchange="";
						}
					}
				);							
				
				//Theme element
				generateSettingsElement(
					tran.t("themeName"),
					{
						none: tran.t("themeOptions.none"),
						"https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/xmas.json": tran.t("themeOptions.xmas"),
						custom: tran.t("themeOptions.custom"),
					},
					"themeSelect", "themeOpTable",
					function () {
						var themeSelect = document.getElementById("themeSelect");
						if (themeSelect.value === "none") {
							loadCustomTheme(false);
							document.getElementById("customThemeRow").style.display = "none";
						}
						else if (themeSelect.value === "custom") {
							document.getElementById("customThemeRow").style.display = "";
						}
						else {
							document.getElementById("customThemeRow").style.display = "none";
						}
						
						// Handling the URLs have to be done outside this code
						// Because it needs access to GM_xmlhttpRequest
					
				});
				
				// Manual settings creation because it's an input and not a select
				// It's wrapped in a anonymous function because
				// I can't be bothered to make sure the variable names don't conflict
				(function () {
					var sTabTable = document.getElementById("themeOpTable");
					var sTabTr = document.createElement("TR");
					sTabTr.id = "customThemeRow";
					sTabTr.style.display = "none";
					sTabTable.appendChild(sTabTr);
					var sTabTd = document.createElement("TD");
					sTabTd.innerHTML = tran.t("customThemeName");
					sTabTr.appendChild(sTabTd);
					var sTabOptionsTd = document.createElement("TD");
					sTabTr.appendChild(sTabOptionsTd);
					var sTabInput = document.createElement("INPUT");
					sTabInput.id = "customThemeInput";
					sTabOptionsTd.appendChild(sTabInput);
				})();
				
				//Particle settings
				generateSettingsElement(
					tran.t("particlesName"),
					{
						high: tran.t("particlesOptions.high"),
						low: tran.t("particlesOptions.low"),
						off: tran.t("particlesOptions.off")
					},
					"particleSelect", "themeOpTable",
					function () {
						var sTabSelect = document.getElementById("particleSelect");
						if(sTabSelect.value === "high") {
							bpOverlay.particleSpawnRate = "high";
						} else if(sTabSelect.value === "low") {
							bpOverlay.particleSpawnRate = "low";
						} else {
							bpOverlay.particleSpawnRate = "none";
						}
					}
				);
				
				//Notifies
				generateSettingsElement(
					tran.t("notificationsName"),
					{
						on: tran.t("notificationOptions.on"),
						off: tran.t("notificationOptions.off"),
					},
					"notificationsSelect", "notificationsTable",
					function () {
						var sTabSelect = document.getElementById("notificationsSelect");
						if (sTabSelect.value == "on") {
							bpOverlay.notifications = true;
						}
						else {
							bpOverlay.notifications = false;
						}
					}
				);
				
				// This one's a slider!
				(function () {
					var sTabTable = document.getElementById("notificationsTable");
					var sTabTr = document.createElement("TR");
					sTabTable.appendChild(sTabTr);
					var sTabTd = document.createElement("TD");
					sTabTd.innerHTML = tran.t("notificationVolume");
					sTabTr.appendChild(sTabTd);
					var sTabOptionsTd = document.createElement("TD");
					sTabTr.appendChild(sTabOptionsTd);
					var sTabInput = document.createElement("INPUT");
					sTabInput.id = "notificationVolumeSlider";
					sTabInput.type = "range";
					sTabInput.min = 0;
					sTabInput.max = 100;
					sTabInput.value = 100;
					sTabInput.addEventListener("change", function (e) {
						bpOverlay.notificationSound.volume = sTabInput.value / 100;
						bpOverlay.notificationSound.play();
					});
					sTabInput.title = tran.t("notificationAliasInputTitle");
					sTabOptionsTd.appendChild(sTabInput);
				})();
				
				// And another, because this one's an input
				(function () {
					var sTabTable = document.getElementById("notificationsTable");
					var sTabTr = document.createElement("TR");
					sTabTr.id = "notificationSettingsRow";
					sTabTable.appendChild(sTabTr);
					var sTabTd = document.createElement("TD");
					sTabTd.innerHTML = tran.t("notificationAlias");
					sTabTd.title = tran.t("notificationAliasTitle");
					sTabTr.appendChild(sTabTd);
					var sTabOptionsTd = document.createElement("TD");
					sTabTr.appendChild(sTabOptionsTd);
					var sTabInput = document.createElement("INPUT");
					sTabInput.id = "notificationAliasInput";
					sTabInput.addEventListener("change", function (e) {
						var n = sTabInput.value.toLowerCase().split(";");
						bpOverlay.alias = [];
						var i = 0;
						for (; i < n.length; i++) {
							if (n[i] !== "") {
								bpOverlay.alias.push(n[i]);
							}
						}
					});
					sTabInput.title = tran.t("notificationAliasInputTitle");
					sTabOptionsTd.appendChild(sTabInput);
				})();
				
				//Notification meow
				generateSettingsElement(
					tran.t("endGameNotification"),
					{
						on: tran.t("endGameNotificationOptions.on"),
						off: tran.t("endGameNotificationOptions.off"),
					},
					"endGameNotificationSelect", "notificationsTable",
					function () {
						var sTabSelect = document.getElementById("endGameNotificationSelect");
						if (sTabSelect.value == "on") {
							bpOverlay.endGameNotification = true;
						}
						else {
							bpOverlay.endGameNotification = false;
						}
					}
				);
				
				document.getElementById("endGameNotificationSelect").value = "off";
				
				var alphaColumnStyle = document.createElement("STYLE");
				alphaColumnStyle.textContent = ".alphaColumn{display:none;}";
				document.head.appendChild(alphaColumnStyle);
				
				//Alpha display
				generateSettingsElement(
					tran.t("alphaRouletteName"),
					{
						on: tran.t("alphaRouletteOptions.on"),
						off: tran.t("alphaRouletteOptions.off"),
					},
					"alphaRouletteSelect", "overlaySettingsTable",
					function () {
						var sTabSelect = document.getElementById("alphaRouletteSelect");
						if (sTabSelect.value == "on") {
							alphaColumnStyle.textContent = "";
						}
						else {
							alphaColumnStyle.textContent = ".alphaColumn{display:none;}";
						}
					}
				);
				
				// Only add this if speech synthesis is supported by the browser
				if (window.speechSynthesis) {
					var speechListener = function (e) {
						var iterator=0;
						for(i=200; i<e.text.length; i+= 200) {
							for(j=i; j >= iterator; j -= 1) {	
								if(e.text[j] === " ") {
									barkmeow = new SpeechSynthesisUtterance(e.text.substring(iterator, j));
									barkmeow.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == bpOverlay.speechName; })[0];
									barkmeow.onstart = function() { startPing() };
									barkmeow.onend = function() { pingSuccess(); };
									speechSynthesis.speak(barkmeow);
									iterator=j;
									break;
								} else if(j == iterator) {
									barkmeow = new SpeechSynthesisUtterance(e.text.substring(iterator, i));
									barkmeow.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == bpOverlay.speechName; })[0];
									barkmeow.onstart = function() { startPing() };
									barkmeow.onend = function() { pingSuccess(); };
									iterator=i;
								}					
							}	
						}		
						barkmeow = new SpeechSynthesisUtterance(e.text.substring(iterator, e.text.length));
						barkmeow.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == bpOverlay.speechName; })[0];
						barkmeow.onstart = function() { startPing() };
						barkmeow.onend = function() { pingSuccess(); };speechSynthesis.speak(barkmeow);
						console.log(barkmeow);	//fix for onend not being called at the very end. See stackoverflow. Weird
					}
					
					//oh boy. Here we go with the speech element
					generateSettingsElement(
						tran.t("speechName"),
						{
							off: tran.t("speechOptions.off"),
							on: tran.t("speechOptions.on"),
						},
						"speechSelect", "chatOpTable",
						function() {
							var sTabSelect = document.getElementById("speechSelect");
							if(sTabSelect.value == "on") {
								//The name of the ping function that we will reference
								var pingu;

								//Starts the ping. If a pingSuccess isn't received within 13 seconds (approx time of 31 w's which break this) after starting a chunk,
								//then speechSynthesis.cancel() is called. Dirty workaround.
								//it throws out a lot of text if an error occurs, but at least it restarts this whole mess for you
								var startPing = function() {
									pingu = setTimeout(function(){ speechSynthesis.cancel(); }, 13000);
								};

								//calling this function signifies that a speecherror has not occurred.
								var pingSuccess = function() {
									clearTimeout(pingu);
								};

								//the speecher barkmeow
								channel.socket.on("chatMessage", speechListener);
							} else {
								channel.socket.removeListener("chatMessage", speechListener);
							}
						}
					);

					generateSettingsElement(
						tran.t("voiceSelect"),
						{
							us: tran.t("voiceOptions.us"),
							ukMale: tran.t("voiceOptions.ukMale"),
							ukFem: tran.t("voiceOptions.ukFem"),
							fran: tran.t("voiceOptions.fran"),
						},
						"voiceSelect", "chatOpTable",
						function () {
							var sTabSelect = document.getElementById("voiceSelect");
							if (sTabSelect.value == "us") {
								bpOverlay.speechName = "Google US English";
							}
							else if(sTabSelect.value == "ukMale") {
								bpOverlay.speechName = "Google UK English Male";
							} else if(sTabSelect.value == "ukFem") {
								bpOverlay.speechName = "Google UK English Female";
							} else {
								bpOverlay.speechName = "Google Français";
							}
						}
					
					);
				}
				
				document.getElementById("alphaRouletteSelect").value = "off";
				
				// Wrap game functions, make the autoscroll/focus buttons.
				wrapGameFunctions();
				
				if (channel.data.state === "playing") {
					generateActorConditions();
				}
			}
			
			firstRunProcs();
			
			// Make updateTime fire every second.
			setInterval(updateTime, 1000);

			// "Update Text"
			channel.appendToChat("Info", tran.t("updateText"));
		}
		main();
	}
}

var s = document.createElement('script');
s.setAttribute("type", "application/javascript");
s.textContent = '(' + source + ')();';

document.body.appendChild(s);
document.body.removeChild(s);

// Function to validate the theme object
// This won't catch everything, but it should prevent future errors
// By making sure all the variables are the right type
// This is two hundred lines of inefficiency :D
var validateThemeObj = function (themeObj) {
	var valid = true;
	
	// Validate images
	if (typeof(themeObj.images) === "object") {
		for (var i in themeObj.images) {
			if (typeof(themeObj.images[i]) !== "object") {
				console.log("Error: image " + i + " is not an object.");
				valid = false;
			}
			else {
				if (typeof(themeObj.images[i].src) !== "string") {
					console.log("Error: invalid src provided in image " + i + ".");
					valid = false;
				}
				
				if (typeof(themeObj.images[i].xOffset) !== "number" && typeof(themeObj.images[i].xOffset) !== "undefined") {
					console.log("Error: invalid xOffset in image " + i + ".");
					valid = false;
				}
				
				if (typeof(themeObj.images[i].yOffset) !== "number" && typeof(themeObj.images[i].yOffset) !== "undefined") {
					console.log("Error: invalid yOffset in image " + i + ".");
					valid = false;
				}
			}
		}
	}
	else if (typeof(themeObj.images) !== "undefined") {
		console.log("Error: images is not an object.");
		valid = false;
	}
	
	// Validate css
	if (typeof(themeObj.css) === "object") {
		if (themeObj.css.text) {
			if (typeof(themeObj.css.text) !== "string") {
				console.log("Error: invalid css.text provided");
				valid = false;
			}
		}
		else if (themeObj.css.src) {
			if (typeof(themeObj.css.src) !== "string") {
				console.log("Error: invalid css source provided");
				valid = false;
			}
		}
		else {	
			console.log("Error: css field declared, but no css provided");
			valid = false;
		}
	}
	else if (typeof(themeObj.css) !== "undefined") {
		console.log("Error: css is not an object.");
		valid = false;
	}
	
	var minMaxOrNumber = function (value) {
		if (typeof(value) === "object") {
			if (typeof(value.min) !== "number") {
				return false;
			}
			if (typeof(value.max) !== "number") {
				return false;
			}
		}
		else if (typeof(value) !== "number") {
			return false;
		}
		return true;
	}
	
	// Validate particles
	if (typeof(themeObj.particles) === "object") {
		if (Object.prototype.toString.call(themeObj.particles.emitters) === "[object Array]") {  // Arrays are weird
			for (i = 0; i < themeObj.particles.emitters.length; i++) {
				var e = themeObj.particles.emitters[i];
				// Oh god there's so much to validate aaaaaaaaa
				
				// validate position
				if (typeof(e.position) === "object") {
					if (typeof(e.position.x) !== "number") {
						console.log("Error: particle.emitters[" + i + "].position.x is not a number");
						valid = false;
					}
					
					if (typeof(e.position.y) !== "number") {
						console.log("Error: particle.emitters[" + i + "].position.y is not a number");
						valid = false;
					}
					
					if (typeof(e.position.width) !== "undefined" && typeof(e.position.width) !== "number") {
						console.log("Error: particle.emitters[" + i + "].position.width is not a number");
						valid = false;
					}
					
					if (typeof(e.position.height) !== "undefined" && typeof(e.position.height) !== "number") {
						console.log("Error: particle.emitters[" + i + "].position.height is not a number");
						valid = false;
					}
				}
				else {
					console.log("Error: particles.emitters[" + i + "].position is not an object");
					valid = false;
				}
				
				// Validate velocity
				if (typeof(e.velocity) === "object") {
					if (!minMaxOrNumber(e.velocity.x)) {
						console.log("Error: particles.emitters[" + i + "].velocity.x is invalid");
						valid = false;
					}
					if (!minMaxOrNumber(e.velocity.y)) {
						console.log("Error: particles.emitters[" + i + "].velocity.y is invalid");
						valid = false;
					}
				}
				else {
					console.log("Error: particles.emitters[" + i + "].velocity is not an object");
					valid = false;
				}
				
				// Validate size
				if (!minMaxOrNumber(e.size)) {
					console.log("Error: particles.emitters[" + i + "].size is invalid");
					valid = false;
				}
				
				// Validate rotation
				if (!minMaxOrNumber(e.rotation)) {
					console.log("Error: particles.emitters[" + i + "].rotation is invalid");
					valid = false;
				}
				
				// Validate angularVelocity
				if (!minMaxOrNumber(e.angularVelocity)) {
					console.log("Error: particles.emitters[" + i + "].angularVelocity is invalid");
					valid = false;
				}
				
				// Validate spawnRate
				if (typeof(e.spawnRate) === "object") {	
					if (typeof(e.spawnRate.high) !== "number") {
						console.log("Error: particles.emitters[" + i + "].spawnRate.high is invalid");
						valid = false;
					}
					if (typeof(e.spawnRate.low) !== "number") {
						console.log("Error: particles.emitters[" + i + "].spawnRate.low is invalid");
						valid = false;
					}
				}
				else {
					console.log("Error: particle.emitters[" + i + "].spawnRate is not an object");
					valid = false;
				}
				
				// Validate gravity
				if (typeof(e.gravity) === "object") {
					if (!minMaxOrNumber(e.gravity.x)) {
						console.log("Error: particles.emitters[" + i + "].gravity.x is invalid");
						valid = false;
					}
					if (!minMaxOrNumber(e.gravity.y)) {
						console.log("Error: particles.emitters[" + i + "].gravity.y is invalid");
						valid = false;
					}
				}
				else {
					console.log("Error: particles.emitters[" + i + "].gravity is not an object");
					valid = false;
				}
				
				// Effing hell!
			}
		}
		else {
			console.log("Error: particles.emitters is not an array");
			valid = false;
		}
		
		if (Object.prototype.toString.call(themeObj.particles.images) === "[object Array]") {
			for (i = 0; i < themeObj.particles.images.length; i++) {
				if (typeof(themeObj.particles.images[i]) !== "string") {
					console.log("Error: particles.images[" + i + "] is not a string");
					valid = false;
				}
			}
		}
	}
	else if (typeof(themeObj.particles) !== "undefined") {
		console.log("Error: particles is not an object");
		valid = false;
	}
	
	var validateTextStyle = function (textStyle) {
		if (textStyle === undefined) {
			return true;
		}
		if (typeof(textStyle) === "object") {
			if (typeof(textStyle.color) !== "undefined") {
				if (typeof(textStyle.color) !== "string") {
					return false;
				}
			}
			
			if (typeof(textStyle.fontFamily) !== "undefined") {
				if (typeof(textStyle.fontFamily) !== "string") {
					return false;
				}
			}
			
			if (typeof(textStyle.fontSize) !== "undefined") {
				if (typeof(textStyle.fontSize) !== "number") {
					return false;
				}
			}
			
			if (typeof(textStyle.majorFontSize) !== "undefined") {
				if (typeof(textStyle.majorFontSize) !== "number") {
					return false;
				}
			}
			
			if (typeof(textStyle.minorFontSize) !== "undefined") {
				if (typeof(textStyle.minorFontSize) !== "number") {
					return false;
				}
			}
		}
		else if (typeof(textStyle !== "undefined")) {
			return false;
		}
		return true;
	}
	
	var ts = ["statusText", "promptText", "wordText", "highlightedText", "bonusLetterText"];
	
	// Validate textStyles
	if (typeof(themeObj.textStyles) === "object") {
		for (i = 0; i < ts.length; i++) {
			if (!validateTextStyle(themeObj.textStyles[ts[i]])) {
				console.log("Error: textStyles." + ts[i] + " is invalid or has some invalid parameters.");
				valid = false;
			}
		}
	}
	else if (typeof(themeObj.textStyles) !== "undefined") {
		console.log("Error: textStyles is not an object.");
		valid = false;
	}
	
	return valid;
};

// JSON Parser, by Douglas Crockford
// This is necessary because in this environment I don't have access to the JSON object
var json_parse=function(){"use strict";var e,t,n={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"	"},r,i=function(t){throw{name:"SyntaxError",message:t,at:e,text:r}},s=function(n){if(n&&n!==t){i("Expected '"+n+"' instead of '"+t+"'")}t=r.charAt(e);e+=1;return t},o=function(){var e,n="";if(t==="-"){n="-";s("-")}while(t>="0"&&t<="9"){n+=t;s()}if(t==="."){n+=".";while(s()&&t>="0"&&t<="9"){n+=t}}if(t==="e"||t==="E"){n+=t;s();if(t==="-"||t==="+"){n+=t;s()}while(t>="0"&&t<="9"){n+=t;s()}}e=+n;if(!isFinite(e)){i("Bad number")}else{return e}},u=function(){var e,r,o="",u;if(t==='"'){while(s()){if(t==='"'){s();return o}if(t==="\\"){s();if(t==="u"){u=0;for(r=0;r<4;r+=1){e=parseInt(s(),16);if(!isFinite(e)){break}u=u*16+e}o+=String.fromCharCode(u)}else if(typeof n[t]==="string"){o+=n[t]}else{break}}else{o+=t}}}i("Bad string")},a=function(){while(t&&t<=" "){s()}},f=function(){switch(t){case"t":s("t");s("r");s("u");s("e");return true;case"f":s("f");s("a");s("l");s("s");s("e");return false;case"n":s("n");s("u");s("l");s("l");return null}i("Unexpected '"+t+"'")},l,c=function(){var e=[];if(t==="["){s("[");a();if(t==="]"){s("]");return e}while(t){e.push(l());a();if(t==="]"){s("]");return e}s(",");a()}}i("Bad array")},h=function(){var e,n={};if(t==="{"){s("{");a();if(t==="}"){s("}");return n}while(t){e=u();a();s(":");if(Object.hasOwnProperty.call(n,e)){i('Duplicate key "'+e+'"')}n[e]=l();a();if(t==="}"){s("}");return n}s(",");a()}}i("Bad object")};l=function(){a();switch(t){case"{":return h();case"[":return c();case'"':return u();case"-":return o();default:return t>="0"&&t<="9"?o():f()}};return function(n,s){var o;r=n;e=0;t=" ";o=l();a();if(t){i("Syntax error")}return typeof s==="function"?function u(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=u(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return s.call(e,t,i)}({"":o},""):o}}()
// I'm sorry for introducing more foreign code, but I've decided to stand strong against jQuery

var loadAndApplyTheme = function (url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function (resp) {
			try {
				var themeObj = json_parse(resp.responseText);
			}
			catch (e) {
				alert("Invalid JSON.");
				console.log(e);
				return;
			}
			
			if (validateThemeObj(themeObj)) {
				var s = document.createElement('script');
				s.setAttribute("type", "application/javascript");
				s.textContent = "loadCustomTheme(false); loadCustomTheme(" + resp.responseText + ")";
				
				document.body.appendChild(s);
				document.body.removeChild(s);
			}
			else {
				alert("Invalid theme specified. Check the console for what is invalid.");
			}
		},
		onerror: function (resp) {
			alert("Error loading " + url);
		},
	});
};

// This code attaches listeners to relevant settings objects to make them persistent
// Process to attach to things in the DOM from the sandboxed environment
// This needs to happen in this environment because I need access to the GM functions
var attachToSettings = function () {
	if (!(document.getElementById("containerSelect") &&
	      document.getElementById("twitchEmoteSelect") &&
		  document.getElementById("adventureSetting") &&
		  document.getElementById("themeSelect") &&
		  document.getElementById("customThemeInput") &&
		  document.getElementById("notificationsSelect") &&
		  document.getElementById("notificationVolumeSlider") &&
		  document.getElementById("notificationAliasInput") &&
		  document.getElementById("endGameNotificationSelect") &&
		  document.getElementById("particleSelect") &&
		  document.getElementById("chatDownButton") &&
		  document.getElementById("autoFocusButton") &&
		  document.getElementById("dragButton") &&
		  document.getElementById("alphaRouletteSelect"))) {
		console.log("Cannot attach, trying again in a second");
		setTimeout(attachToSettings, 1000);
	}
	else {
		// Whoo look at them variables
		var cs = document.getElementById("containerSelect");
		var tes = document.getElementById("twitchEmoteSelect");
		var as = document.getElementById("adventureSetting");
		var ts = document.getElementById("themeSelect");
		var cti = document.getElementById("customThemeInput");
		var ns = document.getElementById("notificationsSelect");
		var nai = document.getElementById("notificationAliasInput");
		var nvs = document.getElementById("notificationVolumeSlider");
		var egns = document.getElementById("endGameNotificationSelect");
		var ps = document.getElementById("particleSelect");
		var cdb = document.getElementById("chatDownButton");
		var afb = document.getElementById("autoFocusButton");
		var db = document.getElementById("dragButton");
		var ars = document.getElementById("alphaRouletteSelect");
		
		var loadAndChangeSelect = function (element, valueName, defaultValue) {
			if (GM_getValue(valueName, defaultValue) !== element.value) {
				element.value = GM_getValue(valueName, defaultValue);
				var event = new Event("change");
				element.dispatchEvent(event);
			}
		}
		
		var loadAndChangeButton = function (element, valueName, defaultValue) {
			if (GM_getValue(valueName, defaultValue) !== element.dataset.state) {
				var event = new MouseEvent("click");
				element.dispatchEvent(event);
			}
		}
		
		loadAndChangeSelect(cs, "containerState", "compact");
		loadAndChangeSelect(tes, "twitchEmoteState", "on");
		loadAndChangeSelect(as, "adventureState", "off");
		loadAndChangeSelect(ns, "notificationsState", "on");
		loadAndChangeSelect(nai, "notificationAlias", "");  // Yay duck typing
		loadAndChangeSelect(egns, "endGameNotificationSetting", "off");
		loadAndChangeSelect(ars, "alphaRouletteState", "off");
		loadAndChangeSelect(ps, "particleState", "high");
		loadAndChangeButton(cdb, "chatDownState", "true");  // String booleans because of the way data attributes work in HTML :(
		                                                    // Trust me, I don't like being stringly typed either
		loadAndChangeButton(afb, "autoFocusState", "true");
		loadAndChangeButton(db, "dragState", "false");
		
		// Have to handle this one slightly differently
		if (GM_getValue("notificationVolume", 100) !== nvs.value) {
			nvs.value = GM_getValue("notificationVolume", 100);
			var s = document.createElement("script");
			s.textContent = "bpOverlay.notificationSound.volume=" + (nvs.value / 100);
			document.body.appendChild(s);
			document.body.removeChild(s);
		};
		
		cs.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("containerState", cs.value);
			}, 100);
		});
		
		tes.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("twitchEmoteState", tes.value);
			}, 100);
		});
		
		as.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("adventureState", as.value);
			}, 100);
		});
		
		ns.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("notificationsState", ns.value);
			}, 100);
		});
		
		nai.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("notificationAlias", nai.value);
			}, 100);
		});
		
		nvs.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("notificationVolume", nvs.value);
			}, 100);
		});
		
		egns.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("endGameNotificationSetting", egns.value);
			}, 100);
		});
		
		ps.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("particleState", ps.value);
			}, 100);
		});
	
		ars.addEventListener("change", function () {
			setTimeout(function () {
				GM_setValue("alphaRouletteState", ars.value);
			}, 100);
		});
	
		cdb.addEventListener("click", function () {
			setTimeout(function () {
				GM_setValue("chatDownState", cdb.dataset.state);
			}, 100);
		});
		
		afb.addEventListener("click", function () {
			setTimeout(function () {
				GM_setValue("autoFocusState", afb.dataset.state);
			}, 100);
		});
		
		db.addEventListener("click", function () {
			setTimeout(function () {
				GM_setValue("dragState", db.dataset.state);
			}, 100);
		});
		
		// These ones are special!
		ts.addEventListener("change", function () {
			if (ts.value !== "none" && ts.value !== "custom") {
				loadAndApplyTheme(ts.value);
				GM_setValue("theme", ts.value);
				GM_setValue("customTheme", "none");
				cti.value = "";
			}
			else if (ts.value === "none") {
				GM_setValue("theme", "none");
				GM_setValue("customTheme", "none");
			}
		});
		
		cti.addEventListener("keypress", function (e) {
			if (e.keyCode === 13) {
				loadAndApplyTheme(cti.value);
				GM_setValue("theme", "custom");
				GM_setValue("customTheme", cti.value);
			}
		});
		
		loadAndChangeSelect(ts, "theme", "none");
		
		if (GM_getValue("customTheme", "none") !== "none") {
			GM_setValue("theme", "custom");
			cti.value = GM_getValue("customTheme", "none");
			loadAndApplyTheme(cti.value);
		}
		
	}
}

attachToSettings();
