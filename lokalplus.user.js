// ==UserScript==
// @name         Lokal+
// @homepage     https://github.com/michamilz/lokalplus
// @supportURL   https://github.com/michamilz/lokalplus/issues
// @updateURL    https://raw.githubusercontent.com/michamilz/lokalplus/master/lokalplus.user.js
// @downloadURL  https://raw.githubusercontent.com/michamilz/lokalplus/master/lokalplus.user.js
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  Dieses Userscript erlaubt dir, die Plus-Artikel von den weiter unten aufgeführten Lokalzeitungen ohne die sonst notwendige Anmeldung zu lesen.
// @author       Micha Milz & Murdoc Bates & Mr. Ronald
// @match        https://*.svz.de/*
// @match        https://www-svz-de.cdn.ampproject.org/*
// @match        https://*.nnn.de/*
// @match        https://www-nnn-de.cdn.ampproject.org/*
// @match        https://*.prignitzer.de/*
// @match        https://www-prignitzer-de.cdn.ampproject.org/*
// @match        https://*.shz.de/*
// @match        https://www-shz-de.cdn.ampproject.org/*
// @match        https://*.ostsee-zeitung.de/*
// @match        https://m-ostsee--zeitung-de.cdn.ampproject.org/*
// @match        https://*.ln-online.de/*
// @match        https://m-ln--online-de.cdn.ampproject.org/*
// @match        https://*.maz-online.de/*
// @match        https://m-maz--online-de.cdn.ampproject.org/*
// @match        https://*.lvz.de/*
// @match        https://m-lvz-de.cdn.ampproject.org/*
// @match        https://*.haz.de/*
// @match        https://m-haz-de.cdn.ampproject.org/*
// @match        https://*.neuepresse.de/*
// @match        https://m-neuepresse-de.cdn.ampproject.org/*
// @match        https://*.goettinger-tageblatt.de/*
// @match        https://m-goettinger--tageblatt-de.cdn.ampproject.org/*
// @match        https://*.paz-online.de/*
// @match        https://m-paz--online-de.cdn.ampproject.org/*
// @match        https://*.kn-online.de/*
// @match        https://m-kn--online-de.cdn.ampproject.org/*
// @match        https://*.sn-online.de/*
// @match        https://m-sn--online-de.cdn.ampproject.org/*
// @match        https://*.waz-online.de/*
// @match        https://m-waz--online-de.cdn.ampproject.org/*
// @match        https://*.dnn.de/*
// @match        https://m-dnn-de.cdn.ampproject.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      archive.org
// ==/UserScript==

(function() {
    'use strict';

    // ⚡ AMP - Darstellung
    if (document.querySelector("html[i-amphtml-layout='']") != null) {
        console.log('is ⚡');
        GM_addStyle('html { max-width: 75rem; margin-left: auto !important; margin-right: auto !important;}');
        // Remove Ads
        GM_addStyle('html body amp-ad { display: none !important;}');
        GM_addStyle('html body amp-fx-flying-carpet { display: none !important;}');
        GM_addStyle('html body amp-embed { display: none !important;}');
        // Subscriptions
        GM_addStyle('body .showContent[subscriptions-section="content"] { display: block !important;}');
        GM_addStyle('body [subscriptions-section="content-not-granted"] { display: none;}');
        // Access
        GM_addStyle('body [amp-access][amp-access-hide] { display: block !important;}');
        GM_addStyle('body [amp-access="NOT loggedIn"] { display: none;}');
    }

    // Existiert eine ⚡ AMP - Version?
    if (document.querySelector("link[rel='amphtml']") != 'null') {
        /*
        var ld_text = document.querySelector("script[type='application/ld+json']").textContent;
        var ld = JSON.parse(ld_text);
        console.log(ld);
        */
        var amphtml = document.querySelector("link[rel='amphtml']").getAttribute("href");
        console.log(amphtml);
        //if (ld['@type'] == 'NewsArticle') { // && ld.isAccessibleForFree == "False") {
            // Madsack
            if(document.querySelector("#erasmo.pdb-article-paidcontent-registration") !== null) {
                $('.pdb-parts-paidcontent-freeuntilbadge.pdb-parts-paidcontent-freeuntilbadge_article.pdb-parts-paidcontent-freeuntilbadge_close').prepend("<a href='https://cdn.ampproject.org/c/s/"+amphtml.substr(8)+"' target='_blank'>⚡</a> ");
                var content = $("<h2>Artikel ohne Registrierung <a href='https://cdn.ampproject.org/c/s/"+amphtml.substr(8)+"' target='_blank'>HIER lesen</a><br>");
                content.insertAfter('.pdb-article-body-paidcontentintro');
            }
            // SHZ
            if(document.querySelector(".paywall") !== null) {
                const div = document.createElement('div');
                div.innerHTML = "<a href='https://cdn.ampproject.org/c/s/"+amphtml.substr(8)+"' target='_blank'>⚡ - HIER Artikel ohne Registrierung lesen</a>";
                document.querySelector(".paywall").prepend(div);
            }
        //}
    }

    // Madsack
    if(document.querySelector("#erasmo.pdb-article-paidcontent-registration") !== null) {
        var datum = [...$(".pdb-article-publicationdate").text().matchAll(/(\d{2,4})/gm)];
        var timestamp = datum[4][0]+datum[3][0]+datum[2][0];
        var url = document.querySelector("link[rel='canonical']").getAttribute("href");
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://archive.org/wayback/available?timestamp="+timestamp+"&url="+encodeURIComponent(url),
            responseType: "json",
            onload: function(response) {
                if (typeof response.response.archived_snapshots.closest.url !== 'undefined') {
                    var content = $("<h2>Artikel im Internet Archiv <a href='"+response.response.archived_snapshots.closest.url+"' target='_blank'>lesen</a>.<br>Auf weitere Versionen <a href='http://web.archive.org/web/*/"+document.location.href+"' target='_blank'>prüfen</a>.<br>");
                    content.insertAfter('.pdb-article-body-paidcontentintro');
                    $('.pdb-parts-paidcontent-freeuntilbadge.pdb-parts-paidcontent-freeuntilbadge_article.pdb-parts-paidcontent-freeuntilbadge_close').prepend("<a href='"+response.response.archived_snapshots.closest.url+"' target='_blank'>🔓</a> ");
                }
                console.log(response);
            }
        });
    }

    // SHZ
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
