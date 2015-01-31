Custom Themes
=============

The overlay is able to to read custom themes and apply them to the game.

The way this works is that the overlay reads a JSON file which specifies the replacement images, replacement css, particles and text styles.

Making a custom theme
---------------------

To make your own custom theme, you will need:
  * Replacement images for the game assets
  * Some CSS which you may like to use to change the look of HTML elements
  * Some particles to draw on the canvas
  * Some text styles to format the text on the canvas

All of the above are *optional*, and strictly speaking, none of the above are actually necessary (especially not the particles).  
If you have finished making these assets, you will need to declare them in a JSON file so the overlay is able to read it.

You may want to <a href="http://en.wikipedia.org/wiki/JSON">get</a> <a href="http://www.json.org/">acquainted</a> with JSON before doing this.

Making replacement images
-------------------------

You may decide that for your custom theme you would like to replace some of the images used in the game.  
The images that are actually used as assets on the game are these:  
  * `avatarShadow` : http://bombparty.sparklinlabs.com/images/AvatarShadow.png
  * `heart`: http://bombparty.sparklinlabs.com/images/Heart.png
  * `heartEmpty`: http://bombparty.sparklinlabs.com/images/HeartEmpty.png
  * `arrow`: http://bombparty.sparklinlabs.com/images/Arrow.png
  * `bomb`: http://bombparty.sparklinlabs.com/images/Bomb.png
  * `sparkle`: http://bombparty.sparklinlabs.com/images/Sparkle.png
  * `avatarPlaceHolder`: http://bombparty.sparklinlabs.com/images/AvatarPlaceholder.png
  * `letter`: http://bombparty.sparklinlabs.com/images/Letter.png

The overlay supports the replacement of any one of these images.

Replacement images for these should ideally be of the same size, although you may experiment with different sizes of the images (keeping in mind that most of the drawing code is hard-coded into the game which I have no ability to change).

Writing CSS
-----------

This readme is far too small to contain a tutorial on how to write CSS. However, if you would to do the common task of setting the background to something else, the div that contains the game canvas is `#App > main`. For example, in [xmas.json](https://github.com/MrInanimated/bp-overlay/blob/master/themes/xmas/xmas.json) the gradient of the background was changed and a background image was added, which used the following CSS:  
```CSS
#App {
    background: url(https://raw.githubusercontent.com/MrInanimated/bp-overlay/master/themes/xmas/snow_backdrop.png), radial-gradient(ellipse,#016cbe,#01266c),#016cbe;
    background-repeat: repeat-x;
    background-position: center bottom;
}
```

You can make the assumption that this CSS will be last in the loading order, meaning that it overrides other css defined for the same specificity.

Writing the JSON file
---------------------

The JSON file should contain one object which contains some of the four following objects:

### `images` ###

The `images` object is a collection of images which are there to replace the existing default game assets.

To specify a image replacement, simply add a name-`image` object pair to the `images` object, like thus:  
```JSON
"images": {
    "bomb": {
        "src": "http://path/to/your/bomb/image.png"
    },
    "arrow": {
        "src": "http://path/to/your/arrow/image.png"
    }
}
```

#### `image` object ####
An `image` object goes in the `images` object (naming things is hard, okay?) and can contain three values:

`src`  
Specifies the source of your image.

`xOffset`  
*(optional)* Specifies an x-coordinate offset for alignment purposes. Be aware that this will behave weirdly with rotation and scaling.

`yOffset`  
*(optional)* Specifies a y-coordinate offset for alignment purposes. Be aware that this will behave weirdly with rotation and scaling.

------------

### `css` ###

The `css` object should contain any new CSS you would like to be part of the theme.  
You can either store the CSS within the JSON file itself, or specify an external CSS file. For example:  

```JSON
"css": {
    "text": "YOUR AWESOME CSS HERE"
}
```

or 

```JSON
"css": {
    "src": "http://path/to/your/css/file.css"
}
```

`src`  
Specifies an external CSS source. This property is overriden by the `text` property.

`text`  
Specifies some CSS right in the JSON file, and overrides the `src` property.

You can specify either a `src` or a `text`.

------------

### `particles` ###

The `particles` object has two parts, the `emitters` array and the `images` array.

#### `emitter` objects #####

The `emitters` array contains particle `emitter` objects. The `emitters` array can have as many `emitter`s as you like, just don't go a bit overboard with them.

`position`  
Specifies a rectangular area where the `emitter` is said to be. Particles can spawn anywhere in this area. The `position` object has these properties:
  * `x` - A number specifying the left side of the rectangle. 0 maps to the left side of the canvas, and 1 maps to the right.
  * `y` - A number specifying the top side of the rectangle. 0 maps to the top of the canvas, and 1 maps to the bottom.
  * `width` - *(optional)* A number specifying the width of the rectangle. 1 unit is equal to the width of the canvas.
  * `height` - *(optional)* A number specifying the height of the rectangle. 1 unit is equal to the height of the canvas.

`velocity`  
Specifies the velocities that particles created from this `emitter` may have, in pixels per second. It has these properties:
  * `x` - Specifies the initial horizontal velocity of a particle. It is either a numerical value, or an object with the numerical properties `min` and `max`.
  * `y` - Specifies the initial vertical velocity of a particle. It is either a numerical value, or an object with the numerical properties `min` and `max`.
  * `linkedToSize` - *(optional)* If `true`, the variation in velocity is directly proportional to the variation in size.

`size`  
Specifies the size multiplier that particles created from this `emitter` may have. It is either a numerical value or an object with the numerical properties `min` and `max`.

`rotation`  
Specifies the inital angle the particle is at, in radians. It is either a numerical value or an object with the numerical properties `min` and `max`. If it is an object, you can also specify an optional boolean `linkedToSize` to make the variation in rotation proportional to the variation in size.

`angularVelocity`  
Specifies the angular velocity of the particle, in radians per second. It is either a numerical value or an object with the numerical properties `min` and `max`. If it is an object, you can also specify an optional boolean `linkedToSize` to make the variation in angular velocity proportional to the variation in size.

`spawnRate`  
The chance that this emitter has every frame to create a particle, in chance per frame. This is an object with two numerical properties:  
  * `high` - The chance per frame that this emitter spawns a particle when the user puts the particle settings to "High".
  * `low` - The chance per frame that this emitter spawns a particle when the user puts the particle settings to "Low".

`gravity`  
The acceleration that particles from this emitter will experience, in pixels per second per second. This is an object with two numerical properties:  
  * `x` - The horizontal acceleration in pixels per second per second. This is a **fixed numerical value**.
  * `y` - The verical acceleration in pixels per second per second. This is a **fixed numerical value**.

#### `images` array ####

The `images` array within the `particles` object stores the sources of the images that are used.  
When a new particle is created, it has a random image from this array.

The array should be a list of sources, e.g.:  
```JSON
"images": [
    "http://path/to/particle/0.png",
    "http://path/to/particle/1.png",
    "http://path/to/particle/2.png"
]
```

------------

### `textStyles` ###

The `textStyles` object contains any formatting you may want on text drawn on the canvas.  
There are 5 styles which you can change:  
  * `statusText` - This is the first line in the two lines of text in the middle of the screen, and displays things such as "Waiting for 2 more players...", "X, type an English word containing" etc.
  * `promptText` - This is the second line in the two lines of text in the middle of the screen, and displays things such as the prompt, or "X won the last round!" etc.
  * `wordText` - This is the text used to display the words that are displayed under players as they type them.
  * `highlightedText` - This is the text used to highlight prompts in the words that players are typing.
  * `bonusLetterText` - This is the text used to draw the bonus letters on the tiles to the right.

To change the style of one of these texts, simply add a name-`textStyle` object pair to the `textStyles` object, like thus:  
```JSON
"textStyles": {
    "highlightedText" : {
        "color": "#aa6060",
        "shadow": true 
    }
}
```

#### `textStyle` object ####

The `textStyle` object contains the options to style the text drawn on the canvas. All of these options are optional.

`color`  
*(optional)* The color to set this style of text to. This is is a hexcode string.

`shadow`  
*(optional)* If true, a shadow will be displayed around this style of text. This may be useful for displaying light-colored text on light-colored backgrounds.

`fontFamily`  
*(optional)* The font family you want to display this text in. This is a string. Remember that the user has to have this font on their system to be able to use it.

`fontSize`  
*(optional)* The size of the font you want to display this text in. This is a number. This does not affect the `wordText` and the `highlightedText` styles.

`majorFontSize`  
*(optional)* The size of the `wordText` and `highlightedText` styles when they're under the current player (so when the font size of them is larger). Does not affect the other text styles.

`minorFontSize`  
*(optional)* The size of the `wordText` and `highlightedText` styles when they're not under the current player (so when the font size of them is smaller). Does not affect the other text styles.

Sample
------

The above may have seemed extremely confusing, which is not surprising because it's something that I wrote. If you would like a sample to better understand how this works, please take a look at [xmas.json](https://github.com/MrInanimated/bp-overlay/blob/master/themes/xmas/xmas.json), which demonstrates the majority of features documented here.
