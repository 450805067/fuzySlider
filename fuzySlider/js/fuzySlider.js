(function($) {
	$.fn.slider = function(options) {
		var defaults = {
			width: 640,
			height: 640,
			distance: 100,
			speed: 2
		}
		var options = $.extend({}, defaults, options);
		options.speed = options.speed * 100;
		var downX = 0;
		var sginLeft = 0;
		var index = 0;
		var sign = false;
		var ul = $(this).find(".fuzy-tab:eq(0) ul");
		var li = ul.children("li");
		var container = $(this).find(".fuzy-container:eq(0)");
		var wrapper = $(this).find(".fuzy-wrapper:eq(0)");
		var sliders = container.find(".fuzy-slider");
		var initialLeft = getLeft();
		ul.css({
			"list-style": "none",
			"text-align": "center",
			"color": "#FFF"
		});
		li.css({
			"float": "left",
			"display": "block",
			"width": (options.width / li.length) + "px",
			"cursor": "pointer"
		});
		container.css({
			overflow: "hidden",
			width: options.width + "px",
			height: options.height + "px",
			"display": "block"
		});
		sliders.css({
			width: options.width + "px",
			height: options.height + "px",
			float: "left"
		});
		wrapper.css({
			width: options.width * sliders.length,
			height: options.height + "px"
		})
		sliders.on("touchstart mousedown touchend mouseup", slide);

		function slide(e) {
			index = $(this).index();
			e = e || window.event;
			if(e.type == "touchstart" || e.type == "mousedown") {
				e.type == "touchstart" ? downX = e.originalEvent.changedTouches[0].clientX : downX = e.clientX;
				sginLeft = getLeft();
				sliders.bind("touchmove mousemove", move);
			} else if(e.type == "touchend" || e.type == "mouseup") {
				end();
			}
		}

		function move(e) {
			e = e || window.event;
			var moverX = e.type == "touchmove" ? e.originalEvent.changedTouches[0].clientX : e.clientX;
			var offset = (moverX) - downX;
			var left = getLeft();
			wrapper.css("margin-left", (left + offset) + "px");
			downX = moverX;
		}

		li.on("mousedown touchstart", function() {
			sign = true;
			var index = $(this).index();
			var offset = -options.width * index;
			wrapper.animate({
				"marginLeft": offset + "px"
			}, options.speed);
		});

		container.on("touchout mouseout", function() {
			if(!sign) {
				end();
			}
		});

		function end() {
			sliders.unbind("touchmove mousemove", move);
			var left = getLeft();
			var offset = sginLeft - left;
			if(offset > options.distance && index != (sliders.length - 1)) {
				wrapper.animate({
					"marginLeft": (left + offset - options.width) + "px"
				}, options.speed);
			} else if(offset < -options.distance && index != 0) {
				wrapper.animate({
					"marginLeft": (left + offset + options.width) + "px"
				}, options.speed);
			} else {
				if(offset > options.distance && index == (sliders.length - 1)) {
					wrapper.animate({
						"marginLeft": -options.width * (sliders.length - 1) + "px"
					}, options.speed);
				} else if(offset < -options.distance && index == 0) {
					wrapper.animate({
						"marginLeft": initialLeft + "px"
					}, options.speed);
				} else {
					wrapper.animate({
						"marginLeft": sginLeft + "px"
					}, options.speed);
				}
			}
			sign = false;
		}

		function getLeft() {
			return parseInt(wrapper.css("margin-left") == "" ? 0 : wrapper.css("margin-left"));
		}

		function isLtIE10() {
			var version = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
			if(navigator.appName == "Microsoft Internet Explorer" && (version == "MSIE6.0" || version == "MSIE7.0" || version == "MSIE8.0" || version == "MSIE9.0")) {
				return true;
			}
			return false;
		}

		return this;
	}
})(jQuery)