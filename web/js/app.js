$(function() {
	var eb = new vertx.EventBus('http://localhost/eventbus');

	eb.onopen = function() {

		eb.registerHandler("hercaxbus.timer", function(message, replier) {
			$('#timer').text(message.date);
		});
	}



});
