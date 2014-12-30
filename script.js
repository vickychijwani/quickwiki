$(function () {
  chrome.extension.sendRequest({ localstorage: 'disabled'}, function (response) {
    if (response.disabled == 0 || response.disabled == undefined) {
      QuickWiki();
    }
  });
});

function quickwiki_close() {
  $('#wiki-preview, #wiki-curtain').remove();
  $('.wiki-highlight').removeClass('wiki-highlight');
}

function QuickWiki() {
  $('a[href^=/wiki/]')
  //.not('a[href*=:]')
  //.not('a[href^=/wiki/Main_Page]')
    .each(function (i) {
      // tips on hover
      var link_title = $(this).attr('title');
      $(this).attr('title', 'Shift + Left Click to open this article ("' + link_title + '") with QuickWiki');

      $(this).unbind('click').click(function (e) {
        if (e.shiftKey == 1) {
          // prevent the link from opening
          e.preventDefault();

          // un-highlight previously-clicked links, and highlight current link
          $('.wiki-highlight').removeClass('wiki-highlight');
          $(this).addClass('wiki-highlight');

          // remove other QuickWiki windows, if any
          $('#wiki-preview').remove();

          // get the position, height, and width of the link on the page
          var o = $(this).offset();
          var w = $(this).width();
          var h = $(this).height();
          var top, left, minimize_to; 

          // calculate the position of the QuickWiki window in such a way that it never goes out of the browser's current view
          if (h <= 16) {
            if ($(document).height() - o.top < 560) {
              top = $(document).height() - 570;
            }
            else {
              top = o.top-20;
            }

            if (o.left + w + 525 >= $(window).width()) {
              left = o.left - 515;
              minimize_to = 'top right';
            }
          }
          else {
            left = o.left;
            top = o.top + 40;
            minimize_to = 'top left'; 
          }
            
          // always keep the modal within the browser viewport in respect to height  
          var diff = (top+550-$(document).scrollTop())-$(window).height();
            
          if(diff > 0) {
            top = top - diff - 20;                  //extra padding of 20
          }

          if (o.left + w + 525 < $(window).width()) {
            left = o.left + w + 5;
            minimize_to = 'top left';
          }

          // create the QuickWiki "window" and curtain
          $('body')
            .append('<div id="wiki-preview"></div>')
            .append('<div id="wiki-curtain"></div>');

          // get handles for QuickWiki DOM elements
          var wiki = $('#wiki-preview');
          var curtain = $('#wiki-curtain');

          wiki
            .css({
              'top': top,
              'left': left
            })
            .append('<div id="wiki-title"><div id="wiki-title-info" title="Drag to move"></div></div><div id="wiki-content"></div>');

          // get handles for the children divs of the QuickWiki "window"
          var title = $('#wiki-title');
          var content = $('#wiki-content');

          // add stuff to the "title bar"
          title
            .append('<div id="controls"><p></p></div>')
            .find('#controls > p')
            .append('<i class="icon-resize-full" id="wiki-expand" title="Expand this preview window"></i>')
            .append('<a target="_blank" href="'+window.location.protocol+'//'+window.location.host+$(this).attr('href')+'"><i class="icon-share-alt" id="wiki-open" title="Open this article in a new tab"></i></a>')
            .append('<i class="icon-minus" id="wiki-minimize" title="Minimize QuickWiki"></i>')
            .append('<i class="icon-remove" id="wiki-close" title="Close QuickWiki"></i>');

          var old_pos, old_size, expanded = false;
          $('#wiki-expand').click(function () {
            if ($(this).hasClass('icon-resize-full')) {
              // save current position and size
              old_pos = wiki.offset();
              old_size = { 'height': wiki.height(), 'width': wiki.width() };

              height_percent = 0.90;
              width_percent = 0.90;
              css_animate = {
                'top': ((1-height_percent) / 2.0) * $(window).height(),
                'left': ((1-width_percent) / 2.0) * $(window).width(),
                'height': height_percent * $(window).height(),
                'width': width_percent * $(window).width()
              };
              css_static = {
                'position': 'fixed',
                'top': wiki.offset().top - $(window).scrollTop(),
                'left': wiki.offset().left - $(window).scrollLeft()
              }
              wiki.css(css_static).animate(css_animate, 'fast');
              curtain.show();
              $("#wiki-expand").removeClass("icon-resize-full").addClass("icon-resize-small");
              expanded = true;
            } else if ($(this).hasClass('icon-resize-small')) {
              css_animate = {
                'top': old_pos.top,
                'left': old_pos.left,
                'height': old_size.height,
                'width': old_size.width
              };
              css_static = {
                'position': 'absolute',
                'top': wiki.offset().top,
                'left': wiki.offset().left
              }
              wiki.css(css_static).animate(css_animate, 'fast');
              curtain.hide();
              $("#wiki-expand").removeClass("icon-resize-small").addClass("icon-resize-full");
              expanded = false;
            }
          });
          $('#wiki-minimize').unbind('click').click(function () {
            if (expanded) {
              $("#wiki-expand.icon-resize-small").click();
            }
            toggle(0, minimize_to);
          });
          $('#wiki-close, #wiki-open').live('click', quickwiki_close);

            
          // load the content from the link into the QuickWiki "window"
          loadContent(window.location.protocol+'//'+window.location.host+$(this).attr('href')+' ' + getIdTag());

          // make the QuickWiki "window" draggable
          title
            .mousedown(function (e) {
              var d = $(this).parent();
              var dx = d.offset().left;
              var dy = d.offset().top;
              var xgap = e.pageX - dx;
              var ygap = e.pageY - dy;
              if (!$.browser.msie) {
                e.preventDefault();
              }
              $(document).mousemove(function (e) {
                var x = e.pageX - xgap;
                var y = e.pageY - ygap;
                if ($.browser.msie) {
                  // IE only here
                  e.preventDefault();
                  if (e.pageX >= 0 && e.pageY >= 0) d.css({ left: x, top: y });
                  return false;
                }
                // FF only here
                if (e.pageX >= 0 && e.pageY >= 0) d.css({ left: x, top: y });
                return true;
              });
            })
            .mouseup(function (e) {
              $(document).unbind('mousedown');
              $(document).unbind('mousemove');
            });
        }
      });
    });
}

var title_temp, content_temp;

function toggle(direction, minimize_to) {
  var wiki = $('#wiki-preview');
  var title = $('#wiki-title');
  var content = $('#wiki-content');
  var opacity = 0.5;
  var css;
  if (direction === 0) {
    $("#wiki-curtain").hide();
    title_temp = title.detach();
    content_temp = content.detach();
    css = {
      'height': '14px',
      'width': '36px',
      'padding': '5px',
      'opacity': opacity
    };
    if (minimize_to === 'top right') {
      css.left = wiki.offset().left + 452;
    }
    wiki.animate(css, 'fast', function () {
      wiki
        .html('')
        .append('<i class="icon-plus" id="wiki-restore" title="Restore QuickWiki"></i>')
        .append('<i class="icon-remove" id="wiki-close" title="Close QuickWiki"></i>')
        .hover(function () {
          wiki.css('opacity', '1.0');
        }, function () {
          wiki.css('opacity', opacity);
        });
      $('#wiki-restore').unbind('click').click(function () {
        toggle(1, minimize_to);
      });
    });
  }
  else {
    css = {
      'height': '550px',
      'width': '500px',
      'padding': '0px',
      'opacity': '1.0'
    };
    if (minimize_to === 'top right') {
      css.left = wiki.offset().left - 452;
    }
    wiki.html('').animate(css, 'fast', function () {
      wiki.append(title_temp)
        .append(content_temp)
        .unbind('mouseenter')
        .unbind('mouseleave');
    });
  }
}

function loadContent(url) {
  var wiki = $('#wiki-preview');
  var title = $('#wiki-title');
  var content = $('#wiki-content');
  $('#wiki-title-info').html(get_loader_html());
  content.load(url, function (res, status, xhr) {
    $('#wiki-title-info').remove('');
    $("#wiki-title").prepend('<div id="wiki-title-info"></div>');
    if (status != 'error') {
      var heading = content
        .find('div'+getIdTag())
        .css({ 'margin-left': '0px' })
        .find('h1:eq(0)')
        .text();
      $('#wiki-title-info').html('QuickWiki: ' + heading);
      if(isWikia()) {
          content.find('div' +getIdTag())
                 .css({ 'margin-right' : '0px', 'margin-top' : '5px'});
      }
      content.find('a[href^=/wiki/]').each(function () {
        // tips on hover
        var link_title = $(this).attr('title');
        $(this).attr('title', 'Left Click to open this article ("' + link_title + '") with QuickWiki');

        $(this).unbind('click').click(function (e) {
          e.preventDefault();
          loadContent(window.location.protocol+'//'+window.location.host+$(this).attr('href')+' ' + getIdTag());
        });
      });
      //always render scroll to top, specially added to handle in modal window navigations
      $(this).scrollTop(0);    
      
    }
  });
}

chrome.extension.onRequest.addListener(
  function (request, sender, sendResponse) {
    if (request.disable === 1) {
      quickwiki_close();
      $('a[href^=/wiki/]').each(function () {
        $(this).unbind('click');
      });
      sendResponse({});
    }
    else if (request.disable === 0) {
      QuickWiki();
      sendResponse({}); // snub them.
    }
  }
);

function get_image(image) {
  return chrome.extension.getURL("images/" + image);
}

function get_loader_html() {
  return '' +
    '<div class="wiki-loader">' +
      '<div id="followingBallsG_1" class="followingBallsG"></div>' +
      '<div id="followingBallsG_2" class="followingBallsG"></div>' +
      '<div id="followingBallsG_3" class="followingBallsG"></div>' +
      '<div id="followingBallsG_4" class="followingBallsG"></div>' +
    '</div>';
}

//check whether the url is from wikia.com

function isWikia() {
  var host = window.location.host;
  if(host.indexOf("wikia.com") > -1) 
      return true;
  else
      return false;
}

//set appropriate content id for url type

function getIdTag() {
  var idTag = '';     
  if(isWikia()) {
      //the link is from wikia.com, set appropriate id tag
      idTag = "#WikiaMainContentContainer";
  }
  else {
      //the link is from wikimedia, set appropriate id tag
      idTag = "#content";
  }
  return idTag;
}
