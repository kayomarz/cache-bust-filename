# Cache busting

Cache bust urls by including a hash in filenames.

**Note**: Currently, this library cache busts a single css `<link>`
found in an HTML file. This is sufficient for my current needs. If for
any reason it is of interest to others, please [create an
issue](https://github.com/kayomarz/cache-bust-filename/issues), I will
be glad to make it more useful.

# Install 

    npm i cache-bust-filename

# Example

`/my-project/foo.html`

```html
<html>
  <head>
    <link media="screen" href="foo.css" rel="stylesheet">
  </head>
</html>
```

`/my-project/foo.css`
```css
p{color:red;}
```

```javascript
const {replaceInHtml} = require('cache-bust-filename');
replaceInHtml("/my-project", "foo.css")
```

`/my-project/foo.html` **(file updated:heavy_exclamation_mark:)**

```html
<html>
  <head>
    <link media="screen" href="foo-99440565f57b1f0c23afb0e0e71ffa35.css" rel="stylesheet">
  </head>
</html>
```

`/my-project/foo-99440565f57b1f0c23afb0e0e71ffa35.css` **(file renamed:heavy_exclamation_mark:)**
```css
p{color:red;}
```

# Use with [Eleventy](https://www.11ty.dev)

`.eleventy.js`

```javascript
const {replaceInHtml} = require('cache-bust-filename');
module.exports = function(eleventyConfig) {
  eleventyConfig.on('afterBuild', function() {
    replaceInHtml("/my-project", "foo.css")
  });
};
```

## Note

I am not well-versed with Eleventy. Hence it's more likely to find better ways to do cache-busting with eleventy.

Here is one such way which happens to be a nice read:

[codsen.com - Our cache busting setup on Eleventy](https://codsen.com/articles/our-cache-busting-setup-on-eleventy/)

# Roadmap

    + Delete previously generated hashed filename if any.
    + Handle JavaScript <script> tags.
    + Handle multiple CSS <link> tags.

# Change log

## Version 0.1.2

    + Handle condition when no links are found.

## Version 0.1.0

    + Cache busts a single css `<link>` found in an HTML file.
