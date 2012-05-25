var eb = vertx.eventBus;
var messages = [];
var messageExample = {
	user: "hercax",
	timestamp: new Date(),
	message: "Hi everyone!"
}

eb.registerHandler("hercaxbus.chat.sendMessage", function(message, replier) {
	messages.push(message);

	var sortedMessages = _.sortBy(messages, function (msg) { return 'timestamp'; });

	eb.send("hercaxbus.chat.newMessages", {messages: sortedMessages}, null);
});
