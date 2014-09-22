/*
 * Copyright (c) 2013 Shane Carr
 * https://github.com/vote539/placeholdr
 * 
 * HTML5 Placeholders for <IE10
 */

!function(a,b,c,d){var e=function(){var e=a(this);e[d]()||(e.addClass(b),"password"===e.attr("type")&&(e.attr("type","text"),e.data(b+"-pwd",!0)),e[d](e.attr(c)))},f=function(){var e=a(this);e.removeClass(b),e.data(b+"-pwd")&&e.attr("type","password"),e[d]()===e.attr(c)&&e[d]("")},g=function(){a(this).find("["+c+"]").each(function(){a(this).data(b)&&f.call(this)})};a.fn.placeholdr=function(){c in document.createElement("input")||(a(this).find("["+c+"]").each(function(){var c=a(this);c.data(b)||(c.data(b,!0),e.call(this),c.focus(f),c.blur(e))}),a(this).find("form").each(function(){var c=a(this);c.data(b)||(c.data(b,!0),c.submit(g))}))},a.fn[d]=a.fn.val,a.fn.val=function(e){var g=a(this);return"undefined"===a.type(e)&&g.data(b)&&g[d]()===g.attr(c)?"":("string"===a.type(e)&&f.call(this),a.fn[d].apply(this,arguments))},a(function(){a(document).placeholdr()}),document.write("<style>.placeholdr{color:#AAA;}</style>")}(jQuery,"placeholdr","placeholder","placeholdrVal");