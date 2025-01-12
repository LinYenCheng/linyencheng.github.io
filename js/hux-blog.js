/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

// Tooltip Init
$(function () {
  $("[data-toggle='tooltip']").tooltip();
});

// make all images responsive
/*
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
// 	$("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function () {
  $("table").wrap("<div class='table-responsive'></div>");
  $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function () {
  $('iframe[src*="youtube.com"]').wrap(
    '<div class="embed-responsive embed-responsive-16by9"></div>'
  );
  $('iframe[src*="youtube.com"]').addClass("embed-responsive-item");
  $('iframe[src*="vimeo.com"]').wrap(
    '<div class="embed-responsive embed-responsive-16by9"></div>'
  );
  $('iframe[src*="vimeo.com"]').addClass("embed-responsive-item");
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function ($) {
  var MQL = 1170;

  //primary navigation slide-in effect
  if ($(window).width() > MQL) {
    var headerHeight = $(".navbar-custom").height();
    $(window).on(
      "scroll",
      {
        previousTop: 0,
      },
      function () {
        var currentTop = $(window).scrollTop();
        //check if user is scrolling up
        if (currentTop < this.previousTop) {
          //if scrolling up...
          if (currentTop > 0 && $(".navbar-custom").hasClass("is-fixed")) {
            $(".navbar-custom").addClass("is-visible");
          } else {
            $(".navbar-custom").removeClass("is-visible is-fixed");
          }
        } else {
          //if scrolling down...
          $(".navbar-custom").removeClass("is-visible");
          if (
            currentTop > headerHeight &&
            !$(".navbar-custom").hasClass("is-fixed")
          )
            $(".navbar-custom").addClass("is-fixed");
        }
        this.previousTop = currentTop;
      }
    );
  }
});

// yencheng custom
function removeFbclid(theWindow = window) {
  const currentHref = theWindow.location.href;
  if (!currentHref) return;
  if (typeof currentHref !== "string") return;

  const questionmarkIndex = currentHref.indexOf("?");
  if (questionmarkIndex === -1) return;

  const url = currentHref.substring(0, questionmarkIndex);
  const hashIndex = currentHref.indexOf("#");

  const query =
    hashIndex !== -1
      ? currentHref.substr(
          questionmarkIndex + 1,
          hashIndex - questionmarkIndex - 1
        )
      : currentHref.substr(questionmarkIndex + 1);

  const hash = hashIndex !== -1 ? currentHref.substr(hashIndex + 1) : undefined;

  const params = query
    .split("&")
    .filter((param) => !param.startsWith("fbclid="));

  const newHref =
    url +
    (params.length ? "?" + params.join("&") : "") +
    (hash !== undefined ? "#" + hash : "");
  if (currentHref === newHref) return;

  if (theWindow.history && theWindow.history.replaceState) {
    theWindow.history.replaceState(undefined, undefined, newHref);
  } else {
    theWindow.location.replace(newHref);
  }
}
removeFbclid();
window.fbAsyncInit = function () {
  FB.init({
    xfbml: true,
    version: "v8.0",
  });
};

/* Simple Lightbox */
(function ($) {
  // Open Lightbox
  $("img").on("click", function (e) {
    e.preventDefault();
    console.log($(this)[0].currentSrc);
    var image = $(this)[0].currentSrc;
    $("html").addClass("no-scroll");
    $("body").append(
      '<div class="lightbox-opened"><img src="' + image + '"></div>'
    );
  });

  // Close Lightbox
  $("body").on("click", ".lightbox-opened", function () {
    $("html").removeClass("no-scroll");
    $(".lightbox-opened").remove();
  });
})(jQuery);

// A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
//

var searchFunc = function (path, search_id, content_id) {
  "use strict";
  $.ajax({
    url: path,
    dataType: "xml",
    success: function (xmlResponse) {
      // get the contents from search data
      var datas = $("entry", xmlResponse)
        .map(function () {
          return {
            title: $("title", this).text(),
            content: $("content", this).text(),
            url: $("url", this).text(),
          };
        })
        .get();

      var $input = document.getElementById(search_id);
      if (!$input) return;
      var $resultContent = document.getElementById(content_id);
      if ($("#local-search-input").length > 0) {
        $input.addEventListener("input", function () {
          var str = '<ul class="search-result-list">';
          var keywords = this.value
            .trim()
            .toLowerCase()
            .split(/[\s\-]+/);
          $resultContent.innerHTML = "";
          if (this.value.trim().length <= 0) {
            return;
          }
          // perform local searching
          datas.forEach(function (data) {
            var isMatch = true;
            var content_index = [];
            if (!data.title || data.title.trim() === "") {
              data.title = "Untitled";
            }
            var data_title = data.title.trim();
            var data_content = data.content.trim().replace(/<[^>]+>/g, "");
            var data_url = data.url;
            var index_title = -1;
            var index_content = -1;
            var first_occur = -1;
            // only match artiles with not empty contents
            if (data_content !== "") {
              keywords.forEach(function (keyword, i) {
                index_title = data_title.indexOf(keyword);
                index_content = data_content.indexOf(keyword);

                if (index_title < 0 && index_content < 0) {
                  isMatch = false;
                } else {
                  if (index_content < 0) {
                    index_content = 0;
                  }
                  if (i == 0) {
                    first_occur = index_content;
                  }
                  // content_index.push({index_content:index_content, keyword_len:keyword_len});
                }
              });
            } else {
              isMatch = false;
            }
            // show search results
            if (isMatch) {
              str +=
                "<a href='" +
                data_url +
                "' class='search-result-title'><li>" +
                data_title;
              var content = data.content.trim().replace(/<[^>]+>/g, "");
              if (first_occur >= 0) {
                // cut out 100 characters
                var start = first_occur - 20;
                var end = first_occur + 80;

                if (start < 0) {
                  start = 0;
                }

                if (start == 0) {
                  end = 100;
                }

                if (end > content.length) {
                  end = content.length;
                }

                var match_content = content.substring(start, end);

                // highlight all keywords
                keywords.forEach(function (keyword) {
                  var regS = new RegExp(keyword, "gi");
                  match_content = match_content.replace(
                    regS,
                    '<em class="search-keyword">' + keyword + "</em>"
                  );
                });

                str += '<p class="search-result">' + match_content + "...</p>";
              }
              str += "</li></a>";
            }
          });
          str += "</ul>";
          $resultContent.innerHTML = str;
        });
      }
    },
  });
};

// 閱讀進度
$(document).ready(function () {
  var getMax = function () {
    return $(document).height() - $(window).height();
  };

  var getValue = function () {
    return $(window).scrollTop();
  };

  if ('max' in document.createElement('progress')) {
    // Browser supports progress element
    var progressBar = $('#progressBar');

    // Set the Max attr for the first time
    progressBar.attr({ max: getMax() });

    $(document).on('scroll', function () {
      // On scroll only Value attr needs to be calculated
      progressBar.attr({ value: getValue() });
    });

    $(window).resize(function () {
      // On resize, both Max/Value attr needs to be calculated
      progressBar.attr({ max: getMax(), value: getValue() });
    });
  } else {
    var progressBar = $('.progress-bar'),
      max = getMax(),
      value,
      width;

    var getWidth = function () {
      // Calculate width in percentage
      value = getValue();
      width = (value / max) * 100;
      width = width + '%';
      return width;
    };

    var setWidth = function () {
      progressBar.css({ width: getWidth() });
    };

    $(document).on('scroll', setWidth);
    $(window).on('resize', function () {
      // Need to reset the Max attr
      max = getMax();
      setWidth();
    });
  }
});

$(document).ready(function () {

  $(document).on('scroll', function () {
    maxAttr = $('#progressBar').attr('max');
    valueAttr = $('#progressBar').attr('value');
    percentage = (valueAttr / maxAttr) * 100;
  });
});

// 閱讀進度
