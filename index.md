---
layout: default
---

**Playing Fatal Flux on YouTube, Apple Music or Spotify feeds hungry people pizza.**

_Download the MP3 below and put it in your YouTube videos. Then your videos will buy pizza for hungry people too._ 

[@astrodroids](https://astrodroids.blogspot.com) blog.
 

There should be whitespace between paragraphs. We recommend including a README, or a file with information about your project.

# <center>Timeless Droid - Fatal Flux (single)</center>

<center><iframe src="https://blogger.googleusercontent.com/img/a/AVvXsEjvdFVeyyOoiFtMbrm9XLAsWlewczNH58MYQ5TTGcVXkxEL2vLSURBp1JxcL15S4HvtO1Yv3asOhOwiu8U_hknLev_ChK2JogD9LATiXpIHVC8cD6rPRZp6xFiaTCSOmJYuxTJWo3hKB25etpz1-_M5HgzTcxQUc86AnT1xAUwDkheK5Kl7Kgoh8ZoW3kBg=s500" align="center" width="500px" height="500px"></iframe></center>

## Header 2

>
> Timeless Droid donates all royalties to Slice Out Hunger through Artists For Change and DistroKid.
>

### Header 3

<script>
fetch('https://api.rss2json.com/v1/api.json?rss_url=astrodroids.blogspot.com/feeds/posts/default')
    .then(response => response.json())
    .then(data => {
        let html = '';
        data.items.forEach(item => {
            html += `<h3>${item.title}</h3>`;
            html += `<p>${item.content}</p>`;
        });
        document.getElementById('blog-feed').innerHTML = html;
    });
</script>

<div id="blog-feed"></div>

```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l)
  return true;
}
```

```ruby
# Ruby code with syntax highlighting
GitHubPages::Dependencies.gems.each do |gem, version|
  s.add_dependency(gem, "= #{version}")
end
```

#### Header 4

*   This is an unordered list following a header.
*   This is an unordered list following a header.
*   This is an unordered list following a header.

* * *


### Definition lists can be used with HTML syntax.

<dl>
<dt>Name</dt>
<dd>Timeless Droid</dd>
<dt>Born</dt>
<dd>1966</dd>
<dt>Birthplace</dt>
<dd>Kalamazoo, Michigan</dd>
<dt>Color</dt>
<dd>Orange</dd>
</dl>

```
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
```

```
The final element.
```
