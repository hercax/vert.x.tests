load('vertx.js');
load('web/js/lib/underscore.js');
load('chat.js');
var eb = vertx.eventBus;

var webServerConf = {
	port: 81,
	host: '192.168.1.135',
	bridge: true,
	permitted: [{
		address: 'hercaxbus.chat.sendMessage'
	}]
}

vertx.deployVerticle('web-server', webServerConf);

