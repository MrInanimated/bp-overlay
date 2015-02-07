Custom Themes Tutorial
======================

Because it seems that the readme for custom themes is too obtuse and confusing to understand, I've written a tutorial to help you understand how to put together your own custom theme.  
I will warn you though, this is less of a tutorial rather than a rough set of guidelines to help you make a theme.

Starting Out
------------

If you've ever looked a cookbook or some arts and crafts book, you'll know that they always start with some sort of list of ingredients or things you will need. This tutorial is no different, so without further ado, here are the ingredients you need to cook up your own custom theme for BombParty:  
   * The BombParty Overlay (why are you looking at this without having the overlay?)  
   * A text editor (Notepad will do just fine, but we all know Emacs is the best one)  
   * An image manipulation program (Try [Gimp] or [Paint.NET], but if you're really fancy, Photoshop)  
   * Basic image manipulation experience  
   * Some CSS knowledge  
   * A file hosting server (Try [Dropbox] or [Puush])  

First of all, as with making anything with any sort of structure, you have to decide what things you want to do. Do you want to...  
  1. Replace the images used by the game with your own?
  2. Change the general look and the backgrounds of the game webpage (with CSS)?
  3. Change the colors, fonts and sizes of the text used in the game?
  4. Add a fancy particle system to show how fancy you are?
  5. Do something else fabulous and creative entirely?

If you chose number 5, tough luck! Only options 1 to 4 are implemented in the overlay right now, but you are welcome to suggest new features that I may or may not be lazy enough to add to the overlay for further customization of BombParty.

Before we get going, it's a good idea to have some sort of plan to what you want to do (i.e. what kind of theme do you want to have to all of the images, what background images do you want to use, what fonts compliment your theme etc.) -- this will make your decision processes much easier in the future.

We will be covering the first four points above in this tutorial, starting with the most intuitive thing you could do to the game: replacing the default images used in the game.

The Split Between the Canvas and the Webpage
--------------------------------------------

This bit is just optional reading that you can skip entirely if you don't want to bother with it; it's just a bit of explanation as to how and why the custom theme "engine" works in this way.

If you've ever played BombParty (which I imagine is most people reading this tutorial right now) you might notice that there are two main layers to the game interface:  
  * The **Canvas**, which has the majority of the game's graphics drawn on it
  * The rest of the page, which includes the top bar, the left sidebar, the sidebars (chat, settings etc.) and basically everything else.

<center>![Image of a BombParty screen, with the canvas highlighted and pointed out]</center>
  
Things on the canvas are not rendered in the same way that the rest of the page is. If you're familiar to writing webpages to any degree, you'll know that webpages are governed by the familiar laws of HTML and CSS that we all know and love (well, that is, if you *love* CSS...), while inside the canvas we must head into the fantastical realm of Élisée's magical amazing Javascript code that I have only a few ways of changing.

To put it bluntly, the rendering of the game is done in a completely different way to the rendering of everything else that's not in the game and as a consequence there is a split where images must be specified in the JSON if they are to be drawn on the game and images must be specified in CSS if they are to be stored anywhere else.

Alright, random reading over, let's get back to the meat of the matter: replacing the default images.

Making Replacement Images
-------------------------

The [readme] gives a full list of all the images that you can replace, along with the names that they are referred by.

If the BombParty servers aren't down again, you can download the image that Élisée uses for the bomb from [here][Default Bomb Image]. You can see it below:

<center>![Default Bomb Image]</center>

So this bad boy is the actual image that ticks in your browser in a menacing way 60 times per second. We're going to replace it with something that we make ourselves. Either edit the image in your favorite image editor (hopefully not Windows' Paint), or start anew and get stuck into making your own bomb image.

It is worth noting that you don't have to replace the bomb image if you don't want to; in fact, you can replace as many or as few images as you like, including none if you decide that you think Élisée's default images are fine as they are.

I should point out that the replacement images should ideally be the same size as the originals. You're welcome to fiddle about with the different sizes, but there's no guarantee that the drawing code will handle weirdly sized images nicely.

You can repeat this process for all the images you want to have changed. You can see the images I've used for the Christmas theme here:  
<center>![Christmas Bomb]</center>  
<center>![Christmas Arrow]</center>  
<center>![Christmas Heart] ![Christmas HeartEmpty]</center>

Pretty uninspired, I know. But who knows? You might be a far better artist than me! (Actually, the chance of that is pretty high since I suck at any sort of artistic endeavor.)

Made all the images you need? We'll see about applying them to the overlay later. We're now going to move on to the next section...

Writing CSS
-----------

CSS is rather a bit more complicated than this simple tutorial is going to be able to cover, but we're going to look at how to change the colour of a background and add a simple background image, similar to the Christmas theme:

<center>![Christmas Theme Background]</center>

**WARNING TO ANYBODY THAT KNOWS ANY KIND OF CSS:**
If you know CSS, you *will* be annoyed by this "tutorial". So if you do know how to use CSS, you can just skip most of this section. There are two things you should know, however:  
  * The overlay can load any arbitrary CSS into the page. Go wild with your CSS animations and whatnot.
  * You can assume that this CSS is last in the loading order, which means it overrides any other CSS with the same specificness.

Often, the easiest way to mess around with your CSS is to open up your browser console (F12 in most browsers) and find the `div` with the ID `App` and try changing the styles in the style tab.

<center>![Browser Console with App and Styles highlighted]</center>

You'll see that Élisée has defined the background as a radial gradient, with a bunch of color hexcodes after it.  
<center>![Default Background Setting]</center>  
The four colors there represent the color at the center of the screen, the color 70% along the gradient, the color on the outside of the gradient, and the base color (to the best of my knowledge, the fourth color doesn't actually matter if you have a gradient defined).

(You may want to look at [a color code picker] to help you decide some colours.)

You can go ahead and try changing one of the colors to something else, and your browser window should update accordingly. Experiment a little with it to get something you like! Here's the final gradient that the Christmas theme ended up with:  
```CSS
background: radial-gradient(ellipse, #016cbe, #01266c), #01266c
```  
<center>![Christmas CSS Gradient]</center>  

Next, we're going to add a background image.

I'm just going to show you the process I went through when I wanted to add a few snow hills to the bottom of the screen, so it looks like the snow is falling onto the ground. First of all, we need a image that represents a snow hill:  
<center>![Snow Hills]</center>  
Perfect! If we repeat this image along the bottom of the screen, it'll look like one continuous graphic.

Go ahead and add the url of you background picture to the front `background` entry (to make it show up before the gradient), so it should now read something like this:
```CSS
background: url(https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/snow_backdrop.png), radial-gradient(ellipse, #016cbe, #01266c), #01266c
```  
<center>![Repeated snow hill image over game]</center>  
Oh, um, hmm. We didn't want it to cover the whole screen, we only wanted it to repeat in the horizontal direction, so we'll add the line `background-repeat: repeat-x` to the CSS.
```CSS
background: url(https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/snow_backdrop.png), radial-gradient(ellipse, #016cbe, #01266c), #01266c
background-repeat: repeat-x;
```  
(If you only want it to repeat in the vertical direction, you use `repeat-y` and if you don't want it to repeat at all, you use `none`.)

<center>![Repeated in x snow hill image over game]</center>

Also, we want to align the image at the bottom of the screen, so we'll add the line `background-position: center bottom` to center it along the bottom of the screen.  
(The `background-position` property takes two words, the left one being `left`, `center` or `right`, and the second one being `top`, `center`, or `bottom`.)

```CSS
background: url(https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/snow_backdrop.png), radial-gradient(ellipse, #016cbe, #01266c), #01266c
background-repeat: repeat-x;
background-position: center bottom;
```

<center>![Christmas Theme Background]</center>

There we go! That looks pretty nice! Now we have to put our CSS inside ```#App { }``` so the browser knows how to apply it, so open up your text editor and type in this:  
```CSS
#App {
    (put all the changes you made in here)
}
```

Your file should now look something like this:  
```CSS
#App {
    background: url(https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/snow_backdrop.png), radial-gradient(ellipse, #016cbe, #01266c), #01266c
    background-repeat: repeat-x;
    background-position: center bottom;
}
```

Save this as a .css file somewhere. Moving on to...

Particles
---------

Particles section under construction. It's... kinda complicated. If you're really impatient, uh... try to figure it out from the readme.

Text Styles
-----------

Text styles are the only thing that you can't do anything about before you start writing the JSON. So this section's just here to tell you what are the things that you can actually change.

<center>![Text Styles annotated on game screen]</center>

There are five different styles of text that you can change, as you can see in the picture above. Now, for every style of text, the overlay allows you to change their fonts, sizes, colors, and also allows you to add a shadow to the text.

The default font that Élisée uses is [Ubuntu], which in my opinion is a pretty nice font. You can think about what you might want to replace it with (or if you want to replace it at all), but remember that the user has to have whatever font you want to use installed on their computer. You can use one of the fonts common to most systems, or load a font in via the CSS. If you are going to do it, I recommend [google's font service], or you can look at loading in fonts hosted from other sources. This is beyond the scope of this quick guide.

You can change the size of the text as well. Of special mention is the `wordText` and `highlightedText` styles, which can have two font sizes depending on whether the current player is writing them or not. Also, it's recommended to not try changing the size of the `bonusLetterText` as the default drawing code varies the size when you use a letter, which a manually specified value would override.

You should also think about the colors you will use and whether or not to add a shadow (to help contrast the text against a lighter background).

Uploading the Assets
--------------------

Due to the security setups of browsers, you need to host all of your assets somewhere online for your browser to actually load the files in (it would be a huge security problem if browsers were able to access files on your computer, because it would mean that websites you visit could steal your stuff). If you're techy and have your own server, great! Upload the files on there. If you don't have a persistent server, you can use [Puush] or [Dropbox] to upload your files. If you have Puush, you can press Ctrl+Shift+U to upload arbitrary files, and if you have Dropbox you can drag stuff into the Public folder and then select "Copy Public Link" from the right-click menu. Keep track of all the URLs of all your files, as you will need them when you write your JSON file. Speaking of that...

Writing the JSON File
---------------------

Oh boy, JSON. Here we go:

[JSON]\(JavaScript Object Notation\) is a data format that stores data in a way that is hopefully fairly readable by humans as well as by a computer. JSON is comprised of "objects", which are denoted by `{ }` braces. Within the object, you have a name (which is a string of characters enclosed in quotes) which is tied to a value (which could be a number, an array, another object, `true`, `false`, or `null`). Each of these makes a name-value pair. If there are more than one name-value pair in an object, there needs to be a comma between each pair.

In this case, JSON is used to tell the overlay exactly where the images used in the theme are, the CSS to load in manually, the rules governing the particles, the text styles etc.

For example, if I wanted to store some information about this overlay in a JSON format, I could do it like this:  
```JSON
{
    "name": "BombParty Overlay",
    "description": "Overlay and Utilities for BombParty",
    "authors": ["MrInanimated", "Skandalabrandur"],
    "creationDate": 2014,
    "supportsThemes": true,
    "availableThemes": {
        "Default": {
            "url": null,
            "description": "The default BombParty theme.",
            "author": "Élisée"
        },
        "Christmas": {
            "url": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/xmas.json",
            "description": "A basic Christmas theme for BombParty.",
            "author": "MrInanimated"
        }
    }
}
```  
(You can add an arbitrary amount of spaces and newlines, and JSON won't care.)

I suggest you [read up a bit on JSON] before you proceed.

Open up a blank file on your favorite text editor. In it, type:  
```JSON
{

}
```  
This is an empty object. Now, depending on what you want in the custom theme, we are going to add more objects to this file to tell the overlay what to do.

### Replacement Images ###

If you are adding replacement images to your theme, you need an `images` object. Type this into your JSON file:  
```JSON
"images": { }
```

Your JSON file should now look something like this:  
```JSON
{
    "images": { }
}
```

Now, for every image that you want to replace, type the name of image you're replacing (enclosed by quotes) followed by ```: { "src": "http://url/to/your/image" }```. Add a comma to separate adjacent objects.  
Your JSON file should now look something like this:  
```JSON
{
    "images": {
        "bomb": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Bomb.png"
        },
        "arrow": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Arrow.png"
        },
        "heart": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Heart.png"
        },
        "heartEmpty": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/HeartEmpty.png"
        }
    }
}
```  
(Newlines have been added to help improve readability.)

### CSS ###

Remember that you need a comma to separate adjacent name-value pairs.

The CSS object is fairly simple: just write ```"css": { "url": "http://path/to/your/css/file" }``` after your `images` object.

Your JSON file should now look something like this:  
```JSON
{
    "images": {
        "bomb": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Bomb.png"
        },
        "arrow": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Arrow.png"
        },
        "heart": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Heart.png"
        },
        "heartEmpty": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/HeartEmpty.png"
        }
    },
    "css": {
        "url": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/style.css"
    }
}
``` 

You may want to [minify your CSS] and so instead use `"text": "#App{ ... }"` rather than specifying a url so you can host one less file.

### Particles ###

Aha, let's not worry about this right now.

### Text Styles ###

Remember you need a comma to separate adjacent name-value pairs.

Add an object in your outermost JSON object like thus: `"textStyles": { }"`

As discussed earlier, there are 5 different types of text: `statusText`, `promptText`, `wordText`, `highlightedText`, and `bonusLetterText`.

To change the style to any one of them, just add an object named the same as the style you want to change, and add the `color`, `shadow`, `fontFamily`, `fontSize`/`majorFontSize`/`minorFontSize` properties.

For example, let's say I was horrible and wanted to make the `statusText` into 20pt bright pink Comic Sans.  
I would add this object to the `textStyles` object:  
```JSON
"statusText": {
    "color": "#ff00ff",
    "fontFamily": "Comic Sans MS",
    "fontSize": 20
}
```

Note that if you want to change the sizes of `wordText` and `highlightedText`, you have to use `majorFontSize` and `minorFontSize` properties instead as there are two sizes that they can be.

So finally, you should have a file that looks like this:
```JSON
{
    "images": {
        "bomb": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Bomb.png"
        },
        "arrow": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Arrow.png"
        },
        "heart": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Heart.png"
        },
        "heartEmpty": {
            "src": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/HeartEmpty.png"
        }
    },
    "css": {
        "url": "https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/style.css"
    },
    "textStyles": {
        "statusText": {
            "color": "#ddd",
            "shadow": true
        },
        "promptText": {
            "shadow": true
        },
        "wordText": {
            "color": "#c0c0c0",
            "shadow": true
        },
        "highlightedText": {
            "color": "#80cc80",
            "shadow": true
        },
        "bonusLetterText": {
            "color": "#335"
        }
    }
}
```

Save it, upload it, then go into the overlay settings, and select "custom" on the theme selection. A input box will open below it; copy the link to this JSON file in, and press enter to apply the file.

From there, you can continue to tinker with the settings in the JSON file to fine-tune your theme a bit more.

If you have any questions, or want to show me a theme you've made, you're welcome to contact me. If I particularly like your theme, your theme may become one of the default themes available in the overlay, next to the Christmas theme.

[Gimp]: http://www.gimp.org/
[Paint.NET]: http://www.getpaint.net/
[Dropbox]: http://www.dropbox.com/
[Puush]: http://puush.me/
[Image of a BombParty screen, with the canvas highlighted and pointed out]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/bpcanvas.png
[readme]: https://github.com/MrInanimated/bp-overlay/blob/master/themes/README.md
[Default Bomb Image]: http://bombparty.sparklinlabs.com/images/Bomb.png
[Christmas Bomb]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Bomb.png
[Christmas Arrow]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Arrow.png
[Christmas Heart]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/Heart.png
[Christmas HeartEmpty]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/HeartEmpty.png
[Christmas Theme Background]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/christmasBackground.png
[a color code picker]: http://www.rapidtables.com/web/color/RGB_Color.htm
[Browser Console with App and Styles highlighted]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/bpconsole.png
[Default Background Setting]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/defaultbackground.png
[Christmas CSS Gradient]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/christmasGradient.png
[Snow Hills]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/snow_backdrop.png
[Repeated snow hill image over game]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/repeatedsnow.png
[Repeated in x snow hill image over game]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/repeatedxsnow.png
[Text Styles annotated on game screen]: https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/tutorialimages/textstyles.png
[Ubuntu]: https://www.google.com/fonts/specimen/Ubuntu
[google's font service]: https://www.google.com/fonts
[JSON]: http://www.json.org/
[read up a bit on JSON]: http://en.wikipedia.org/wiki/JSON
[minify your CSS]: http://cssminifier.com/
