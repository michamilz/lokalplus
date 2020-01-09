// ==UserScript==
// @name         SHZ+, SVZ+, NNN+, Prignitzer+
// @homepage     https://gist.github.com/michamilz/6c9c115606c64a4136ee4581d964fa46
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  SHZ+, SVZ+, NNN+, Prignitzer+ Artikel ohne Registrierung lesen
// @author       Micha Milz & Murdoc Bates & Mr. Ronald
// @match        https://www.svz.de/*
// @match        https://www.nnn.de/*
// @match        https://www.prignitzer.de/*
// @match        https://www.shz.de/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/michamilz/lokalplus/raw/master/lokalplus.user.js
// ==/UserScript==

(function() {
    'use strict';

    if($("#premium-container").length > 0) {
        $.ajax({
            url: window.location.href.replace('.html', '-amp.html'),
            xhr: function() {
                var xhr = jQuery.ajaxSettings.xhr();
                var setRequestHeader = xhr.setRequestHeader;
                xhr.setRequestHeader = function(name, value) {
                    if (name == 'X-Requested-With') return;
                    setRequestHeader.call(this, name, value);
                }
                return xhr;
            },
        })
        .done(function( data ) {

            var content = $('<div />').html(data).find("div[amp-access='NOT data.reduced']").addClass('article');
            if (content.get(0).innerHTML == 'null') {
                content = $("<h2>~~~ Leider kein AMP vorhanden ~~~</h2>");
            } else {
                $( "div.article > div.center-content-mobile" ).siblings("p:not(.lead)").hide();
                /* Werbung funktioniert ohne das JS nicht */
                content.find('#flying-carpet-wrapper').hide();
                /* Es gibt immer zwei gleich Bilder, abhängig der Bildschrimgröße, es wird jetzt nur das "kleinere" angezeigt  */
                content.find('amp-img[media="(min-width: 481px)"]').hide();
                content.find('amp-img').css('max-width', '100%').css('height', 'auto');
                /* Zitat richtig anpassen */
                content.find('svg.quote__icon').css({"height":"70px", "position":"absolute", "fill":"#eee", "z-index":"1", "top":"10px", "left":"10px"});
                /* Fotograf am Bild zeigen */
                content.find('.photographer').css({"font-size":"13px", "margin":"0", "position":"relative", "left":"10px", "top":"-20px", "color":"white", "text-shadow":"0px 0px 5px black"});
                content.find('.photographer svg').css({"height":"14px", "fill":"white"});

                /* 3Q Video */
                var video3qTag = content.find('amp-3q-player');
                if (typeof video3qTag !== "undefined") {
                    var video3qId = content.find('amp-3q-player').attr('data-id');
                    var video3qIframe = '<iframe width="640" height="320" src="https://playout.3qsdn.com/' + video3qId + '?autoplay=false"></iframe>';
                    video3qTag.replaceWith(video3qIframe);
                }

                /* YouTube Video */
                var youtubeTag = content.find('amp-youtube');
                if (typeof youtubeTag !== "undefined") {
                    var youtubeId = content.find('amp-youtube').attr('data-videoid');
                    console.log('TÄST', youtubeId);
                    var youtubeIframe = '<iframe width="640" height="320" src="https://www.youtube.com/embed/' + youtubeId + '" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                    youtubeTag.replaceWith(youtubeIframe);
                }

                var s = content.html();
                content = $(s.replace(/<amp-img /g, '<img '));
            }
            content.insertAfter('#article-wrapper .article > .center-content-mobile');
            $("#premium-container").css('margin-top', '75px');
        });
    }
})();

