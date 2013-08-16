$.mobile.defaultPageTransition = 'pop'; // pages / popup transition
$.mobile.defaultDialogTransition = 'pop'; // dialogs

$(document).on('mobileinit', function() {
    $.mobile.defaultPageTransition = 'pop'; // pages / popup transition
    $.mobile.defaultDialogTransition = 'pop'; // dialogs
});
// jqm.page.params.js - version 0.1
// Copyright (c) 2011, Kin Blas
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the <organization> nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

(function($, window, undefined) {

// Given a query string, convert all the name/value pairs
// into a property/value object. If a name appears more than
// once in a query string, the value is automatically turned
// into an array.
    function queryStringToObject(qstr)
    {
        var result = {},
                nvPairs = ((qstr || "").replace(/^\?/, "").split(/&/)),
                i, pair, n, v;

        for (i = 0; i < nvPairs.length; i++) {
            var pstr = nvPairs[ i ];
            if (pstr) {
                pair = pstr.split(/=/);
                n = pair[ 0 ];
                v = pair[ 1 ];
                if (result[ n ] === undefined) {
                    result[ n ] = v;
                } else {
                    if (typeof result[ n ] !== "object") {
                        result[ n ] = [result[ n ]];
                    }
                    result[ n ].push(v);
                }
            }
        }

        return result;
    }

// The idea here is to listen for any pagebeforechange notifications from
// jQuery Mobile, and then muck with the toPage and options so that query
// params can be passed to embedded/internal pages. So for example, if a
// changePage() request for a URL like:
//
//    http://mycompany.com/myapp/#page-1?foo=1&bar=2
//
// is made, the page that will actually get shown is:
//
//    http://mycompany.com/myapp/#page-1
//
// The browser's location will still be updated to show the original URL.
// The query params for the embedded page are also added as a property/value
// object on the options object. You can access it from your page notifications
// via data.options.pageData.
    $(document).bind("pagebeforechange", function(e, data) {

        // We only want to handle the case where we are being asked
        // to go to a page by URL, and only if that URL is referring
        // to an internal page by id.

        if (typeof data.toPage === "string") {
            var u = $.mobile.path.parseUrl(data.toPage);
            if ($.mobile.path.isEmbeddedPage(u)) {

                // The request is for an internal page, if the hash
                // contains query (search) params, strip them off the
                // toPage URL and then set options.dataUrl appropriately
                // so the location.hash shows the originally requested URL
                // that hash the query params in the hash.

                var u2 = $.mobile.path.parseUrl(u.hash.replace(/^#/, ""));
                if (u2.search) {
                    if (!data.options.dataUrl) {
                        data.options.dataUrl = data.toPage;
                    }
                    data.options.pageData = queryStringToObject(u2.search);
                    data.toPage = u.hrefNoHash + "#" + u2.pathname;
                }
            }
        }
    });

})(jQuery, window);
$(document).ready(function() {
    jQuery('div[data-role="header"] div[data-role="navbar"]').append('<div class="orange-line"></div>');
});
var aj = false;
$(document).ajaxStart(function() {
    //aj = true;
});
$('*').live('pageshow', function() {
    if (aj)
        $.mobile.showPageLoadingMsg();
});
$(document).ajaxStop(function() {
    $.mobile.hidePageLoadingMsg();
    aj = false;
});
/////////////////////////////////////////////
function $_GET(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var serviceurl = "http://twunion.com/bbjson.php?m=";
$("#countries").live("pageinit", function(p) {
    $("#countries").live("pagebeforeshow", function() {
        $.getJSON(serviceurl + "getCountries", function(r) {
            var $html = '';
            $.each(r, function(k, v) {
                $("#country #contentlist").html('');
                $html += "<li><a href=\"#listshow?s=" + $_GET('s') + "&c=" + v.id + "\">" + v.ru_title + "</a></li>	";
            });
            $("#country #contentlist").html($html).listview('refresh');
        });
    });
});
$("#about").live("pageinit", function() {
    $("li").each(function(index) {
        var e = '#' + $(this).attr('id');
        $(function() {
            $(e).live('swipe', function(ev) {
                $.mobile.changePage(e, {transition: "slideup"});
            });
        });
    });

});
$("#listshow").live("pageinit", function(p) {
    $("#listshow").live("pagebeforeshow", function() {

        if ($_GET('s') == 'publishers' || $_GET('s') == 'literary_agents' || $_GET('s') == 'writers_translators') {
            // if(['publishers','literary_agents','writers_translators'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/staff/";
        }
        if ($_GET('s') == 'news' || $_GET('s') == 'events' || $_GET('s') == 'experience' || $_GET('s') == 'interview' || $_GET('s') == 'to_remember') {
            // if([ 'news', 'events' , 'experience', 'interview', 'to_remember'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/news/";
        }
        if ($_GET('s') == 'book_review') {
            // if(['book_review'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/books/";
        }
        if ($_GET('s') == 'partners') {
            // if(['partners'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/partners/";
        }
        $.getJSON(serviceurl + $_GET('s') + "&p[]=" + $_GET('c'), function(r) {
            $("#listshow #contentlist").html('');
            if (r == null) {
                $("#listshow #contentlist").html('Нет данных.');
                return;
            }
            var $html = '';
            $.each(r, function(k, v) {

                $html += '<li><a href="#contentshow?s=' +
                        $_GET('s') + '&i=' + v.id + '">';
                if (v.img)
                    $html += '<img src="' + $imgpath + v.img + '" />';
                else
                    $html += '<img src="" />';
                $html += '<h3>' + v.ru_title +
                        '</h3><p>' + v.ru_short_description + '</p></a></li>';
            });

            $("#listshow #contentlist").html($html).listview('refresh');

        });
        $("img").live('error', function() {
            this.hide();
        });
    });
});
$("#flistshow").live("pageinit", function(p) {
    $("#flistshow").live("pagebeforeshow", function() {
        if ($_GET('s') == 'publishers' || $_GET('s') == 'literary_agents' || $_GET('s') == 'writers_translators') {
            // if(['publishers','literary_agents','writers_translators'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/staff/";
        }
        if ($_GET('s') == 'news' || $_GET('s') == 'events' || $_GET('s') == 'experience' || $_GET('s') == 'interview' || $_GET('s') == 'to_remember') {
            // if([ 'news', 'events' , 'experience', 'interview', 'to_remember'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/news/";
        }
        if ($_GET('s') == 'book_review') {
            // if(['book_review'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/books/";
        }
        if ($_GET('s') == 'partners') {
            // if(['partners'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/partners/";
        }
        $.getJSON(serviceurl + $_GET('s') + "&p[]=" + $_GET('c'), function(r) {
            $("#flistshow #contentlist").html('');
            if (r == null) {
                $("#flistshow #contentlist").html('Нет данных.');
                return;
            }
            var $html = '';
            $.each(r, function(k, v) {

                $html += '<li><a href="#forumshow?s=' +
                        $_GET('s') + '&i=' + v.id + '">';
                if (v.img)
                    $html += '<img src="' + $imgpath + v.img + '" />';
                else
                    $html += '<img src="" />';
                $html += '<h3>' + v.ru_title +
                        '</h3><p>' + v.ru_short_description + '</p></a></li>';
            });

            $("#flistshow #contentlist").html($html).listview('refresh');

        });
        $("img").live('error', function() {
            this.hide();
        });
    });
});
$("#plistshow").live("pageinit", function(p) {

    $("#plistshow").live("pagebeforeshow", function() {
        if ($_GET('s') == 'publishers' || $_GET('s') == 'literary_agents' || $_GET('s') == 'writers_translators') {
            // if(['publishers','literary_agents','writers_translators'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/staff/";
        }
        if ($_GET('s') == 'news' || $_GET('s') == 'events' || $_GET('s') == 'experience' || $_GET('s') == 'interview' || $_GET('s') == 'to_remember') {
            // if([ 'news', 'events' , 'experience', 'interview', 'to_remember'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/news/";
        }
        if ($_GET('s') == 'book_review') {
            // if(['book_review'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/books/";
        }
        if ($_GET('s') == 'partners') {
            // if(['partners'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/partners/";
        }
        $.getJSON(serviceurl + $_GET('s') + "&p[]=" + $_GET('c'), function(r) {
            $("#plistshow #contentlist").html('');
            if (r == null) {
                $("#pflistshow #contentlist").html('Нет данных.');
                return;
            }
            var $html = '';
            $.each(r, function(k, v) {

                $html += '<li><a href="#contentshow?s=' +
                        $_GET('s') + '&i=' + v.id + '">';
                if (v.img)
                    $html += '<img src="' + $imgpath + v.img + '" />';
                else
                    $html += '<img src="" />';
                $html += '<h3>' + v.ru_title +
                        '</h3><p>' + v.ru_short_description + '</p></a></li>';
            });

            $("#plistshow #contentlist").html($html).listview('refresh');

        });
        $("img").live('error', function() {
            this.hide();
        });
    });
});
$("#contentshow").live("pageinit", function(p) {
    $("#contentshow").live("pagebeforeshow", function() {
        $("#contentshow #content").html('');
        $("#contentshow #titlehere").html('');
        if ($_GET('s') == 'publishers' || $_GET('s') == 'literary_agents' || $_GET('s') == 'writers_translators') {
            // if(['publishers','literary_agents','writers_translators'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/staff/";
        }
        if ($_GET('s') == 'news' || $_GET('s') == 'events' || $_GET('s') == 'experience' || $_GET('s') == 'interview' || $_GET('s') == 'to_remember') {
            // if([ 'news', 'events' , 'experience', 'interview', 'to_remember'].indexOf($_GET('s') != -1)){
            var $imgpath = "http://twunion.com/datas/news/";
        }
        if ($_GET('s') == 'book_review') {
            // if(['book_review'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/books/";
        }
        if ($_GET('s') == 'partners') {
            // if(['partners'].indexOf($_GET('s')) != -1){
            var $imgpath = "http://twunion.com/datas/partners/";
        }
        var s = "id_" + $_GET('s');
        var $html = '';
        $.getJSON(serviceurl + s + "&p[]=" + $_GET('i'), function(r) {
            if (r == null) {
                $("#contentshow #content").html('Нет данных.');
                return;
            }
            $("#contentshow #titlehere").html(r[0].ru_title);
            $html = '';
            if (r[0].img) {
                $html += '<img style="width:220px; float:left; padding-right:30px;" src="' + $imgpath + r[0].img + '" />';
            }
            $html += '' +
                    r[0].ru_description +
                    '';

            $("#contentshow #content").html($html);
            $("img").live('error', function() {
                this.hide();
            });
        });
    });
});
$("#forumshow").live("pageinit", function(p) {
    $("#forumshow").live("pagebeforeshow", function() {
        if (['publishers', 'literary_agents', 'writers_translators'].indexOf($_GET('s') != -1)) {
            var $imgpath = "http://twunion.com/datas/staff/";
        }
        if (['news', 'events', 'experience', 'interview', 'to_remember'].indexOf($_GET('s') != -1)) {
            var $imgpath = "http://twunion.com/datas/news/";
        }
        if (['book_review'].indexOf($_GET('s')) != -1) {
            var $imgpath = "http://twunion.com/datas/books/";
        }
        if (['partners'].indexOf($_GET('s')) != -1) {
            var $imgpath = "http://twunion.com/datas/partners/";
        }
        var $imgpath = "http://twunion.com/datas/gallery/";
        $("#forumshow #content").html('');
        $("#forumshow #titlehere").html('');

        var s = "id_" + $_GET('s');
        var $html = '';
        var $html1 = '';
        $.getJSON(serviceurl + "id_forumgallery&p[]=" + $_GET('i'), function(sr) {
            if (sr == null)
                return;
            $html1 += '<ul id="Gallery" class="gallery">';
            $.each(sr, function(sk, sv) {
                $html1 += '<li><a href="' + $imgpath + sv.img + '"><img src="' + $imgpath + sv.img + '" /></a></li>';
            });
            $html1 += "</ul>";
        });
        $.getJSON(serviceurl + s + "&p[]=" + $_GET('i'), function(r) {
            if (r == null) {
                $("#forumshow #content").html('Нет данных.');
                return;
            }
            $("#forumshow #titlehere").html(r[0].ru_title);
            $html = '<div class="ui-grid-a">' +
                    '<div class="ui-block-a" id="gallerycont">';
            $html += '</div><div class="ui-block-b">' +
                    r[0].ru_description +
                    '</div>';
            $("#forumshow #content").html($html);
            $("#gallerycont").html($html1);
            (function(window, $, PhotoSwipe) {

                $(document).ready(function() {

                    var options = {};
                    $("#Gallery a").photoSwipe(options);

                });


            }(window, window.jQuery, window.Code.PhotoSwipe));

            $("img").live('error', function() {
                this.hide();
            });
        });




    });
});

$("#flistshow7").live("pageinit", function(p) {
    $("li").each(function(index) {
        var e = '#' + $(this).attr('id');
        $(function() {
            $(e).live('swipe', function(ev) {
                $.mobile.changePage(e, {transition: "slideup"});
            });
        });
    });
});

$("#reslistshow").live("pageinit", function(p) {

    $("#reslistshow").live("pagebeforeshow", function() {
        $.getJSON(serviceurl + $_GET('s') + "&p[]=" + $_GET('c'), function(r) {
            $("#reslistshow #contentlist").html('');
            if (r == null) {
                $("#pflistshow #contentlist").html('Нет данных.');
                return;
            }
            var $html = '';
            $.each(r, function(k, v) {

                $html += '<li><a target="_blank" href="' + v.seats + '">';
                $html += '<h3>' + v.ru_title +'</h3></a></li>';
            });

            $("#reslistshow #contentlist").html($html).listview('refresh');

        });
        $("img").live('error', function() {
            this.hide();
        });
    });
});
        