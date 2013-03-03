QuickWiki
=========

A Google Chrome extension that allows users to become wiki-ninjas overnight by making it dead-simple to explore Wikipedia (or any other wiki on the web).

To install, visit the [extension page on the Chrome Webstore][install].

First, a wacky analogy
----------------------

All you need to know, dear user, is the magic spell - **Shift + Left Click**. Cast the incantation on any inter-article link on a wiki and, lo and behold, the article appears!

Now the sane stuff
------------------

Yeah, I know. The magic analogy annoys the hell out of me, too. Time to ditch it and let the screenshots do the rest of the talking:

![Preview window (English Wikipedia)](screenshots/screen1.png "Preview window (English Wikipedia)")

![Expanded preview (English Wikipedia)](screenshots/screen2.png "Expanded preview (English Wikipedia)")

![Preview window (Japanese Wikipedia)](screenshots/screen3.png "Preview window (Japanese Wikipedia)")

![Minimized preview (English Wikipedia)](screenshots/screen4.png "Minimized preview (English Wikipedia)")

Features
--------

 - Preview articles in ANY language, on ANY wiki across the Internet
 - Fullscreen wiki-browsing, for times when you're deep down a rabbit hole
 - Minimize preview window to remove clutter without losing your position in the previewed article
 - Open article in a new tab directly from the preview
 - Intelligent window positioning
 - Cute interface :)

Source code layout
------------------

 - script.js - the core file, handles all operations on the preview
 - background.js - to show the [page action][pgac] on appropriate wiki pages, and to handle disabling / enabling of the extension
 - manifest.json - Packaging-related file, needed for publishing to the [webstore][]
 - *.css, *.png - look and feel, icons, etc.

See the [developer docs for Google Chrome Extensions][docs] to learn more about how they're structured.

Bugs? Feature requests?
-----------------------

[File an issue][issues] in this repository.


[pgac]: http://developer.chrome.com/extensions/pageAction.html
[issues]: https://github.com/vickychijwani/quickwiki/issues
[docs]: http://developer.chrome.com/extensions/getstarted.html
[webstore]: https://chrome.google.com/webstore
[install]: https://chrome.google.com/webstore/detail/quickwiki/bbidbpklpaghmdjnlkkhkkobcbjgbkbd
