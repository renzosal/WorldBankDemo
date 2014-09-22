angular.module('worldBank').run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('templates/nav-item.html',
    "<!-- will expand in the future to handle children -->\n" +
    "<a ng-click=\"vm.select(item)\" ng-href=\"{{item.url}}\">\n" +
    "\t<i ng-if=\"item.iconClasses\" class=\"{{item.iconClasses}}\"></i><span>{{item.label}}</span>\n" +
    "</a>"
  );
}])