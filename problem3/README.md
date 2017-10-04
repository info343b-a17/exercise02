# Problem 3

In this exercise, you'll practice working with CSS properties and layouts.

To complete the exercise, you will need to add rules to the included `css/style.css` file in order to style the included `index.html` so that it has a stylish navigation bar:

![Example of completed exercise](img/sample.gif)

(Note that because of how `<button>` elements are rendered, the appearance may be slightly different across browsers. This exercise is optimized for Chrome).

Instructions for achieving this appearance are detailed below. Note that you will need to edit both the CSS _and_ the HTML.

1. The first thing you should do is set your page's [`box-sizing`](https://info343.github.io/css-layouts.html#box-sizing) to be `border-box`. This will help with calculating measurements of the rest of the changes.

2. Add rules to give the page's content appropriate colors, fonts, and sizes:

    - The body text should be colored `#535353`, while the headers should use [UW purple](https://www.washington.edu/brand/graphic-elements/primary-color-palette/).
  
    - The body and headers should utilize the [UW Fonts](https://www.washington.edu/brand/graphic-elements/font-download/) for "Primary Headlines" and the "Body". You should access these fonts via a `<link>` to the [Google Fonts](https://fonts.google.com/) collection (be sure and get the correct weight for headers!)

        Yes, it is common to have to look up branding guidelines and adapt those to a web site!

    - Additionally, make the top-level header have a `font-size` of 2.5x the _root element's size_.

3. The navigation bar should be `fixed` to the top of the screen, and span `100%` of the page. 

    - The navbar should also have a background color of UW Purple.
    
    - Add `.75rem` of space between the sides of the navbar and its content (so the links aren't flush with the window)

    - To make sure the content sits below the fixed navbar, give the header a top margin of `3em`.

4. Now that you've colored the navbar, style the links so they show up. The links in the navbar should be colored `white` and _not_ be [underlined](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration).

5. The links should also be displayed as an undecorated _inline list_. Change the display of each list item so they are `inline`
 
    - Also add `1rem` of space between each item in the list. The overall list should have `0` extra spacing (margin _or_ padding), except for `.5rem` of padding at the top. 

6. The "search box" and its button should `float` to the right of the page. (Notice that there is a `<div>` that groups these items together for styling!)

    - You'll need to make the the list of links an `inline-block` element so that the search bar and links appear on the same line.

    - The input box should have a `font-size` of `1rem` and `.5rem` of space between the text and the box edge.

7. The search button should show a magnifying glass icon instead of the word "Search". You should replace the text with a [Font Awesome icon](http://fontawesome.io/icon/search/).
  
    - The icon should have a font-size of `1.5rem` and `.3rem` of padding. You should also [flip the fa icon](http://fontawesome.io/examples/#rotated-flipped) so it faces the right way.

        To make the button and the text input line up, you can make the text input [`bottom` aligned](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align).

    - Remember that purely-visual elements also need to be perceivable to screen readers! Give the button an `aria-label` attribute so that it will be properly read.

8. Add an effect to the links so that when the user hovers over them (or otherwise gives them `focus` or makes them `active`), they change color to `#b7a57a` and gain a thick (`.6rem`) underline of the same color in the form of a bottom border.

    - You'll need to add some space (`.65rem`) between the link text and its border to make the underline line up with the bottom of the nav bar. Note that measure is browser-dependent.

9. No navbar is complete without a logo, so add the iSchool logo (`img/ischool-symbol-white.png`) to the side of the word "Informatics" in the first link. But since adding this as an `<img>` tag will make things difficult to style, you should instead include the logo as part of a _background image_.

    - First, add a `<span>` (an empty inline element) directly before the word "Informatics". This `<span>` will have no content except the background image it displays. You can even give it an `aria-hidden` to ensure it isn't accidentally read by a screen reader!

        - You'll want to give it a CSS class (e.g., `logo`) to be able to style it.

    - Give the span `1em` of padding on either side of its "content" to give it some width. Note that you can't specify the width directly because it's an `inline` element (and making it `inline-block` would mess with the overall inline-ness of the list)!

    - Finally, give the span a background-image of `img/ischool-symbol-white.png`. Be sure and specify the `position` of the image (it should be left-aligned), the `size` of the background (it should be _contained_ in the element), and whether it should repeat (it should not).

10. As a final step, make the page more accessible by adding a [**skip link**](http://webaim.org/techniques/skipnav/) to the page. By putting a `"Skip to Content"` link at the very top of the page, screen readers and other keyboard based navigators will be able to jump past the navbar without needing to read/tab through all that extra content.

    - First, add an element (e.g., a `<div>`) at the very top of the `<nav>` that will contain the skip link. The element should contain an `<a>` tag that is a "bookmark link" to the `<main>` content of the page.
    
        Note that this link should _not_ be part of the list of navigation links.

    - While a visible skip link does indicate a commitment to accessibility, it would fit our layout better if it were [made invisible except to screen readers](http://webaim.org/techniques/css/invisiblecontent/). You can do this by giving the element an absolute position off screen, and making the element very very tiny (by not 0px, because then it won't be read)!

    - But we do want the element to appear for sighted, keyboard users when they select it. Add a rule so that when the skip link has `focus` or is `active`, it is positioned at the top of the nav bar, sized based on its content (`auto`), and allowed to `overflow`.

        Also make the focused element's color `white` and remove its border so it looks a bit nicer.

        You can test this out by using the `tab` key to cycle through the links, and `enter` to follow one.

## Testing
This exercise includes a test suite to verify that the outputted web page looks as expected. Note that this uses pixel-based image comparison, so may not fully reflect your solution's accuracy.

_This test suite has been tested on Mac machines_.

First, you will need to install an additional library called [Puppeteer](https://github.com/GoogleChrome/puppeteer). Note that this it will download a recent version of Chromium (~71Mb Mac, ~90Mb Linux, ~110Mb Win)

```bash
# install globally so only needed once
npm install -g puppeteer

# make available to this project
npm link puppeteer
```

You can then run the test suite with. Note that it can take around **30-60 seconds** for this suite to run completely.

```bsh
jest problem3
```