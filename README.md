QuickWiki
=========

A Google Chrome extension that allows users to become wiki-ninjas overnight by making it dead-simple to explore Wikipedia (or any other wiki on the web). When browsing Wikipedia or most wikis, simply **Shift + Left Click** any link to another wiki article to open it in a popup.

To install, visit the [extension page on the Chrome Webstore][install].

Screenshots
-----------

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

Bugs? Feature requests? Pull requests?
--------------------------------------

All of those are welcome. You can [file issues][issues] or [submit pull requests][pulls] in this repository.


[pgac]: http://developer.chrome.com/extensions/pageAction.html
[issues]: https://github.com/vickychijwani/quickwiki/issues
[pulls]: https://github.com/vickychijwani/quickwiki/pulls
[docs]: https://developer.chrome.com/docs/extensions/mv3/getstarted/
[webstore]: https://chrome.google.com/webstore
[install]: https://chrome.google.com/webstore/detail/quickwiki/bbidbpklpaghmdjnlkkhkkobcbjgbkbd
