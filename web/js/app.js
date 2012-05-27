$(function() {

	var User = Backbone.Model.extend({
		defaults: {
			nickname: '',
			joinedOn: new Date()
		}
	});

	var UserCollection = Backbone.Collection.extend({
		model: User
	});

	var Message = Backbone.Model.extend({
		defaults: {
			nickname: '',
			timestamp: '',
			message: ''
		}
	});

	var MessageCollection = Backbone.Collection.extend({
		model: Message
	})

	var AppModel = Backbone.Model.extend({
		users: new UserCollection(),

		messages: new MessageCollection(),

		user: new User(),

		initialize: function() {
			var that = this;

			this.eventBus = new vertx.EventBus('http://67.83.146.169:81/eventbus');
			this.eventBus.onopen = function() {
				that.initializeSocket();
			};

			this.eventBus.onclose = function() {};
		},

		initializeSocket: function() {
			var that = this;

			this.eventBus.registerHandler('hercaxbus.chat.newMessages', function(msg) {
				that.messages.reset(msg.messages);
			});

			this.eventBus.registerHandler('hercaxbus.chat.userJoined', function(msg) {
				that.users.reset(msg.users);
			});
		},

		sendMessage: function(message) {
			this.eventBus.send('hercaxbus.chat.sendMessage', {
				nickname: this.user.get('nickname'),
				timestamp: new Date(),
				message: message
			});
		},

		login: function(nickname) {
			this.user.set('nickname', nickname);
			this.user.set('timestamp', new Date());

			this.eventBus.send('hercaxbus.chat.login', this.user.toJSON());
		}
	});

	var UsersView = Backbone.View.extend({
		el: $('#usersPane'),

		initialize: function(options) {
			this.users = options;
			this.users.bind('reset', this.render, this);

			this.render();
		},

		render: function() {
			var html = '';
			var count = 0;

			_.each(this.users.models, function(usr) {
				count++;

				html += '<p>' + usr.get('nickname') + '</p>';
			});

			for (var i = count; count < 10; count++) {
				html += '<p>&nbsp;</p>';
			}

			this.$el.html(html);
		}
	});

	var MessagesView = Backbone.View.extend({
		el: $('#chatPane'),

		initialize: function(options) {
			this.messages = options;
			this.messages.bind('reset', this.render, this);

			this.render();
		},

		render: function() {
			var html = '';
			var count = 0;

			_.each(this.messages.models, function(msg) {
				count++;
				var timestamp = new Date(msg.get('timestamp'));
				var string = timestamp.toLocaleTimeString() + ' <strong>' + msg.get('nickname') + '</strong>> ' + msg.get('message');

				html += '<p>' + string + '</p>';
			});

			for (var i = count; count < 10; count++) {
				html += '<p>&nbsp;</p>';
			}

			this.$el.html(html);
		}
	});

	var AppView = Backbone.View.extend({
		el: $('#appView'),

		model: new AppModel(),

		events: {
			'click #btnLogin': 'login',
			'click #btnSend': 'sendMessage',
			'keypress #txtMessage': 'sendMessage',
			'keypress #txtUser': 'login'
		},

		initialize: function() {
			this.usersView = new UsersView(this.model.users);
			this.messagesView = new MessagesView(this.model.messages);

			$('#message').hide();
		},

		isKeyPressed: function(e, matchCode) {
			var code = (e.keyCode ? e.keyCode : e.which);
			return (code === matchCode)
		},

		login: function(e) {
			if (e === undefined || (e !== undefined && this.isKeyPressed(e, 13))) {
				this.model.login($('#txtUser').val());

				$('#login').hide();
				$('#message').show();
			}
		},

		sendMessage: function(e) {
			if (e === undefined || (e !== undefined && this.isKeyPressed(e, 13))) {
				this.model.sendMessage($('#txtMessage').val());
				$('#txtMessage').val('');
			}
		}
	});

	var app = new AppView();

});
