# Cache busting

Cache busting urls by updating file names.

**Note**: This is work in progress. It is works but only cache busts upto a single css `<link>` in an HTML file.

### Example

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
const {replaceInHtml} = require('cache-buster');
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

### Use with [Eleventy](https://www.11ty.dev)

`.eleventy.js`

```javascript
const {replaceInHtml} = require('cache-buster');
module.exports = function(eleventyConfig) {
  eleventyConfig.on('afterBuild', function() {
    replaceInHtml("/my-project", "foo.css")
  });
};
```

#### Note

I am not well-versed with Eleventy. Hence it's more likely to find better ways to do cache-busting with eleventy.

Here is one such way which happens to be a nice read:

[codsen.com - Our cache busting setup on Eleventy](https://codsen.com/articles/our-cache-busting-setup-on-eleventy/)
