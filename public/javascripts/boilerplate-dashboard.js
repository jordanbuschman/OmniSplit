var omnisplitApp = angular.module('omnisplitApp', ['ngRoute']);

var opts = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 10, // The line thickness
    radius: 20, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 48, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

omnisplitApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'dashboard/menu',
            controller: 'menuController'
        })
        .when('/tables', {
            templateUrl : 'dashboard/tables',
            controller: 'tablesController'
        })
        .when('/orders', {
            templateUrl : 'dashboard/orders',
            controller: 'ordersController'
        })
        .when('/dashboard', {
            templateUrl : 'dashboard/dashboard',
            controller: 'dashboardController'
        })
        .when('/menu', {
            templateUrl : 'dashboard/menu',
            controller: 'menuController',
        })
        .when('/settings', {
            templateUrl : 'dashboard/settings',
            controller: 'settingsController'
        });
});

omnisplitApp.controller('tabController', function($scope) {
    this.tab = 4;
    this.setTab = function(tabId) {
        this.tab = tabId;
    };
    this.isSet = function(tabId) {
        return this.tab === tabId;
    };
});

omnisplitApp.controller('tablesController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');
});
omnisplitApp.controller('ordersController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');
});
omnisplitApp.controller('dashboardController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');
});
omnisplitApp.controller('menuController', function($scope, $window) {
	var w = angular.element($window);
    w.unbind('resize');

    $scope.items = [];
    $scope.foodItems = [];

    $scope.checkDuplicates = function(name, count) {
        var i=0;
        var content= "#left-sortable li#" + count;
        for (i=0; i<count; i++){
            content= "#left-sortable li#" + (i);
            if ($(content).text() == name){
                return false;
            }
        }
        return true;
    };

    $scope.clickItem = function(id) {
        var thisItem = angular.element("#item-" + id);
        $scope.foodItems = angular.copy($scope.items[id].item);
	    for (x in $scope.items) {
            $("#item-" + x + " p").css("color","black");
            $("#item-" + x).removeClass("activeCat1");
        }

	    $("#item-" + id + " p").css("color", "yellow");
	    thisItem.addClass("activeCat1");
	    $("#activeCat").html($(".activeCat1").html());
	    $("#activeCat p").css("color","black");
    };

    $scope.addFoodCategory = function() {
        var name = angular.copy($scope.category.name);
        var description = angular.copy($scope.category.description);

		//var content = "<li id='" + count + "' class='ui-state-default'><p>" + add + "</p></li>";
		$.ajax({
		    type: 'POST',
		    url: 'api/addCat',
		    data: {
                name : name,
                description: description
            },
		    beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
		    complete: function() {
		    	spinner.stop();
                $scope.category.name = '';
                $scope.category.description = '';
                $scope.items.push({
                    name: name,
                    description: description,
                    id: $scope.items.length,
                    item: []
                });
                $scope.$apply();
		    }
		});
    };

    $scope.addFoodItem = function() {
        var name = angular.copy($scope.newItem.itemLine1);
        var description = angular.copy($scope.newItem.itemLine2);
        var price = angular.copy($scope.newItem.itemLine3);
        var active = $("#activeCat").text();
        var id = $("li.activeCat1").attr("id").split("-")[1];

        $.ajax({
            type: 'POST',
            url: 'api/addItem',
            data: {
                name: name,
                price: price,
                description: description,
                active: active
            },
            beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            complete: function() {
                spinner.stop();
                $scope.foodItems.push({
                    "name": name,
                    "description": description,
                    "price": price
                });
                $scope.items[id].item.push({
                    "name": name,
                    "description": description,
                    "price": price
                });
                $scope.newItem.itemLine1 = '';
                $scope.newItem.itemLine2 = '';
                $scope.newItem.itemLine3 = '';
                $scope.$apply();
            }
        });
    };

	$scope.$on('$viewContentLoaded', function() {
		var spinner;
		$.ajax({
			type: 'POST',
			url: 'api/menuinfo',
			beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
			complete: function() {
				spinner.stop();
			},
			success: function(data) {
				for (x in data.group) {
                    $scope.items.push({
                        "id": x,
                        "name": data.group[x].name,
                        "description": data.group[x].description,
                        "item": data.group[x].item,
                        "step": data.group[x].step
                    });
				}
                $scope.$apply();
			}
		});
	});
});

omnisplitApp.controller('settingsController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');

    $scope.oldAddress = {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: ''
    };
    $scope.oldName = '';

    $scope.oldDescription = '';

    $scope.$on('$viewContentLoaded', function() {
        var spinner;
        $.ajax({
            type: 'POST',
            url: '/api/userinfo',
            beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            complete: function() {
                spinner.stop();
            },
            success: function(data) {
                $scope.name = angular.copy(data.name);
                $scope.address = angular.copy(data.address);
                $scope.description = angular.copy(data.description);
                $scope.oldName = angular.copy(data.name);
                $scope.oldAddress = angular.copy(data.address);
                $scope.oldDescription = angular.copy(data.description);
                $scope.$apply();
            }
        });
    });

    $scope.resetAddress = function() {
        $scope.address = angular.copy($scope.oldAddress);
    };

    $scope.resetName = function() {
        $scope.name = angular.copy($scope.oldName);
        $scope.description = angular.copy($scope.oldDescription);
    };

    $scope.submitName = function() {
        var spinner;
        $.ajax({
            type: 'POST',
            url: '/api/changeinfo',
            data: { name: $scope.name, description: $scope.description },
            beforeSend: function(xhrObj) {
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            complete: function() {
                spinner.stop();
            },
            success: function(data) {
                $scope.oldName = $scope.name;
                $scope.oldDescription = $scope.description;
            }
        });
    };

    $scope.submitAddress = function() {
        var spinner;
        $.ajax({
            type: 'POST',
            url: '/api/changeaddress',
            data: { address: JSON.stringify($scope.address) },
            beforeSend: function(xhrObj) {
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            error: function(xhr, status, error) {
                console.log(error);
            },
            complete: function() {
                spinner.stop();
            },
            success: function(data) {
                $scope.oldAddress = $scope.address;
            }
        });
    };
});

omnisplitApp.controller('phone', function($scope, $window) {
    var w = angular.element($window);
    w.bind('resize', function() {
        var phone = {
            top: $('#phone').position().top,
            left: $('#phone').position().left,
            height: $('#phone').height(),
            width: $('#phone').width(),
            paddingTop: parseFloat($('#phone').css('padding-top')),
            paddingLeft: parseFloat($('#phone-column').css('padding-left'))
        };

        $('#overlay').width(parseFloat(0.849 * phone.width) + 'px');
        $('#overlay').height(parseFloat(0.725 * phone.height) + 'px');
        $('#overlay').css('top', phone.top + phone.paddingTop + parseFloat(0.147 * phone.height));
        $('#overlay').css('left', $('#phone-column').width() / 2 - phone.width / 2 + parseFloat(0.0731 * phone.width) + phone.paddingLeft + 'px');
    });
});

omnisplitApp.directive('phoneLoaded', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var phone = {
                    top: $('#phone').position().top,
                    left: $('#phone').position().left,
                    height: $('#phone').height(),
                    width: $('#phone').width(),
                    paddingTop: parseFloat($('#phone').css('padding-top')),
                    paddingLeft: parseFloat($('#phone-column').css('padding-left'))
                };

                $('#overlay').width(parseFloat(0.849 * phone.width) + 'px');
                $('#overlay').height(parseFloat(0.725 * phone.height) + 'px');
                $('#overlay').css('top', phone.top + phone.paddingTop + parseFloat(0.147 * phone.height));
                $('#overlay').css('left', $('#phone-column').width() / 2 - phone.width / 2 + parseFloat(0.0731 * phone.width) + phone.paddingLeft + 'px');
            });
        }
    };
});

$(function() {
    $('#logout').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            type: 'POST',
            url: '/api/logout/',
            error: function(xhr, status, error) {
                console.log(error);
            },
            success: function() {
                window.location.href = '/login';
            }
        });
    });
});
