$(function() {

	var user = '';

	$('#btnLogin').hide();
	$('#message').hide();

	var eb = new vertx.EventBus('http://67.83.146.169:81/eventbus');

	eb.onopen = function() {
		$('#btnLogin').show();

		eb.registerHandler("hercaxbus.chat.newMessages", function(message, replier) {
			var html = '';
			var count = 0;

			_.each(_.last(message.messages,10), function(msg) {
				count ++;
				var timestamp = new Date(msg.timestamp);
				var string = timestamp.toLocaleTimeString() + ' <strong>' + msg.user + '</strong>> ' + msg.message;

				html += '<p>' + string + '</p>';
			});

			for (var i = count; count < 10; count++){
				html += '<p>&nbsp;</p>';
			}

			$('#chat').html(html);
		});
	};

	$('#btnLogin').click(function() {
		user = $('#txtUser').val();

		$('#login').hide();
		$('#message').show();
	})

	$('#btnSend').click(function() {
		var message = $('#txtMessage').val();

		eb.send("hercaxbus.chat.sendMessage", {
			user: user,
			timestamp: new Date(),
			message: message
		}, null);

		$('#txtMessage').val('');
	});

	$('#txtMessage').bind('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		 if(code == 13) { //Enter keycode
		   $('#btnSend').click();
		 }
	});

});
