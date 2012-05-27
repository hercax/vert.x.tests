var eb = vertx.eventBus;
var messages = [];
var users = [];

eb.registerHandler('hercaxbus.chat.sendMessage', function(message) {
	messages.push(message);

	var sortedMessages = _.last(_.sortBy(messages, function (msg) { return 'timestamp'; }), 10);

	eb.send('hercaxbus.chat.newMessages', {messages: sortedMessages}, null);
});

eb.registerHandler('hercaxbus.chat.login', function(message) {
	users.push(message);

	stdout.println(message);

	var sortedUsers = _.sortBy(users, function (usr) { return 'nickname'});

	eb.send('hercaxbus.chat.userJoined', {users: sortedUsers}, null);
});
