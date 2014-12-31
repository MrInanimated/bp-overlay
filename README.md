BombParty Overlay
=================

A userscript that adds score-tracking and other utilities for BombParty.

http://bombparty.sparklinlabs.com/

Installation
------------

Currently, the overlay is available for Chrome and Firefox.

If you have chrome, you will require Tampermonkey, which you can find [here](http://tampermonkey.net/).  
If you have firefox, you will require Greasemonkey, which you can find [here](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).

If/once you have Tampermonkey/Greasemonkey installed, you can use this link to install the overlay:

[BombParty Overlay](../raw/master/dist/bpoverlay.min.user.js)

Tampermonkey/Greasemonkey should automatically pick it up as a userscript, and allow you to install it.

Features
--------

The overlay offers many features most of which are there to improve the BombParty experience.

  * **Score Box**: Keeps track of elapsed time and the word count for the current round, as well as the number of lives lost and gained for each player.  
  [Score Box](../raw/master/images/scoreboard.png)
  * **Force Chat Scroll**: Sometimes, the chat scrolls up by just a little bit and then the chat stops automatically scrolling down altogether. The overlay can force the chat to scroll every time a new message arrives. (Can be toggled on and off)
  * **Autofocus to Chat**: Whenever it's your turn, the game focuses to the input box automatically. However, this might mean you were typing a chat message before you were interrupted, and now you have to move your hands off the keyboard to click on the chat box again. Not anymore, because the overlay can automatically focus to the chat box after your turn! (Can be toggled on and off)
  * **Links in Chat**: Automatically parses any urls in chat and creates a link to them (via [Autolinker.js](https://github.com/gregjacobs/Autolinker.js))
  * **Twitch Emotes in Chat**: Add a little Kappa to your game experience (Can be turned off)
  * **Formatting**: Think your messages could do with a bit of _**SUPER-EMPHASIS**_? No? Well, you can use \<b\>, \<i\>, \<s\>, and \<u\> tags in your chat messages anyway.
  * **A Proper Player List**: The overlay puts all the players in the current room in a list (along with Ban/Mod buttons if you have the appropriate permissons) so you can see everyone in the room. Also, Ban/Mod buttons are removed from the chat to prevent the likelihood of accidental banning/modding.
  * **Hard Modes**: Think you're a pretty good player? Alright, how about if the overlay forces you to type in your words backwards? When your word has to always contain either J, Q, or V? When successive words have to start with each letter of the alphabet? When your word has to always contain X or Z?
  * **Text Adventure<sup>BETA</sup>**: Represent the game in a "text adventure" format. This is a silly and completely unnecessary easter egg.
  * **Custom Themes<sup>BETA</sup>**: Change the way BombParty looks! (Currently, there's only one theme. You can look into how to make your own [here](../tree/master/themes))  
  ["Christmas" Theme](../raw/master/images/xmas.png)
