load('vertx.js');

var eb = vertx.eventBus;

var webServerConf = {
	port: 80,
	host:  'localhost',
	bridge: true
}

vertx.deployVerticle('web-server', webServerConf);

vertx.setPeriodic(1000, function() {
    eb.send('hercaxbus.timer', { date: new Date() });
});