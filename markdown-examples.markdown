---
title: Markdown Banner Title
date: 2017-07-18 23:32:00 Z
Title: Markdown Styling Example Title.  A Title Should be used to change the Title
  in the page.
Highlight: Highlight text appears at the top of the page.  This content should be
  included on most pages to help highlight  the main focus for the article/page.
Banner Image: "/uploads/banner-monitor.jpg"
---

This page was created to highlight how meta fields and page styles can be used.

An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺



An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

Here's a code sample:

~~~
# Let me re-iterate ...
for i in 1 .. 10 { do-something(i) }
~~~

### An h3 header ###

Here's a link to [a website](http://google.com), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].

[^1]: Footnote text goes here.

A horizontal rule follows.

***

Here's a definition list:

apples
  : Good for making applesauce.

oranges
  : Citrus!

tomatoes
  : There's no "e" in tomatoe.

Again, text is indented 4 spaces.

Here's a table, colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

and images can be specified like so:

![example image](/uploads/author-thumbnail.jpg "An exemplary image")

or you can specify images with HTML so you can use float classes (pull-left, pull-right), like so:

<img src="/uploads/author-thumbnail.jpg" alt="example image" title="An exemplary image" class="pull-right"/>

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.