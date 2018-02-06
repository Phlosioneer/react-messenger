
class ConnectionManager {
	constructor(onGetMessage, onSent, onSubscribe, onUnsubscribe, onError, onInfo) {
		this.conn = null;

		// onGetMessage(topic, text)
		// Called whenever a message is recieved.
		this.onGetMessage = onGetMessage;

		// onSent()
		// Called when a message has been recieved by the server.
		// Only one message can be sent at a time.
		this.onSent = onSent;

		// onSubscribe(topic)
		// Called when a topic subscription is successful.
		this.onSubscribe = onSubscribe;

		// onUnsubscribe(topic)
		// Called when a unsubscription is successful.
		this.onUnsubscribe = onUnsubscribe;

		// onError(code, text)
		// Called whenever an error occurs. The text is formatted
		// for the user.
		// code 1: Failed to send message.
		// code 2: Failed to subscribe.
		// code 3: Failed to unsubscribe.
		// code 4: Connection error.
		// code 5: Client is now offline.
		this.onError = onError;
		this.ERR_SEND = 1;
		this.ERR_SUB = 2;
		this.ERR_UNSUB = 3;
		this.ERR_CONNECT = 4;
		this.ERR_OFFLINE = 5;

		// onInfo(code, text)
		// Called when non-error events occur that the user should
		// know about.
		// code 1: Connected to the server.
		// code 2: Reconnected to the server.
		// code 3: Connection closed.
		this.onInfo = onInfo;
		this.INFO_CONNECT = 1;
		this.INFO_RECONNECT = 2;
		this.INFO_CLOSE = 3;
	}


	setupConnection(conn) {
		console.log("setupConnection()");
		console.log(conn);

		if (this.conn !== null) {
			this.teardownConnection();
		}

		this.conn = conn;

		if (conn === undefined || conn === null) {
			return;
		}

		conn.on('connect', this.handleConnect);
		conn.on('reconnect', this.handleReconnect);
		conn.on('close', this.handleConnectionClose);
		conn.on('offline', this.handleOffline);
		conn.on('error', this.handleConnectionError);
		conn.on('message', this.handleGetMessage);
		
		//conn.subscribe("root/#", {qos: 2}, this.handleSubscribeCompleted);
	}

	teardownConnection() {
		if (this.conn === null) {
			return;
		}
		this.conn.end();

		this.conn.removeListener('connect', this.handleConnect);
		this.conn.removeListener('reconnect', this.handleReconnect);
		this.conn.removeListener('close', this.handleConnectionClose);
		this.conn.removeListener('offline', this.handleOffline);
		this.conn.removeListener('error', this.handleConnectionError);
		this.conn.removeListener('message', this.handleGetMessage);

	}

	subscribe(topic) {
		console.log("subscribe()");
		console.log(topic);
		this.conn.subscribe(topic, {qos: 2}, this.handleSubscribeCompleted);
	}

	unsubscribe(topic) {
		console.log("unsubscribe()");
		console.log(topic);
		this.conn.unsubscribe(topic, this.handleUnsubscribeCompleted);
	}

	publish(topic, message) {
		console.log("publish()");
		console.log(topic);
		console.log(message);
		console.log(this);
		this.conn.publish(topic, message, {qos: 2}, this.handleSendCompleted);
	}
	
	handleConnect = (connack) => {
		console.log("handleConnect()");
		console.log(connack);

		if (this.onInfo) {
			this.onInfo(this.INFO_CONNECT, "Connected to the server.");
		}
	}

	handleReconnect = () => {
		console.log("handleReconnect()");

		if (this.onInfo) {
			this.onInfo(this.INFO_RECONNECT, "Reconnected to the server.");
		}
	}

	handleConnectionClose = () => {
		console.log("handleConnectionClose()");

		if (this.onInfo) {
			this.onInfo(this.INFO_CLOSE, "The connection closed successfully.");
		}
	}

	handleOffline = () => {
		console.log("handleOffline()");

		if (this.onInfo) {
			this.onInfo(this.INFO_OFFLINE, "You are now offline.");
		}
	}

	handleConnectionError = (error) => {
		console.log("handleConnectionError()");
		console.log(error);

		if (error && this.onError) {
			// TODO: Change this message based on the error.
			this.onError(this.ERR_CONNECT, "Cannot connect to the server.");
		}
	}

	handleGetMessage = (topic, messageBytes, packet) => {
		console.log("handleGetMessage()");
		// Mqtt gives us a raw, UInt8Array of the bytes in the message.
		// This converts it into a string.
		var message = Array.from(messageBytes).map(c => String.fromCharCode(c)).join("");

		if (this.onGetMessage) {
			this.onGetMessage(topic, message);
		}
	}

	handleSendCompleted = (error) => {
		console.log("handleSendCompleted()");
		console.log(error);
		
		if (error) {
			// TODO: Change the message based on the error.
			if (this.onError) {
				this.onError(this.ERR_SEND, "Failed to send the message.");
			}

			// Return to avoid calling onSend().
			return;
		}

		if (this.onSent) {
			this.onSent();
		}
	}

	handleSubscribeCompleted = (error, grantedTopics) => {
		console.log("handleSubscribeCompleted()");
		console.log(error);
		console.log(grantedTopics);

		// TODO: Change the message based on the error.
		if (error && this.onError) {
			this.onError(this.ERR_SUB, "Failed to subscribe to topic.");
		}

		if (grantedTopics && this.onSubscribe) {
			for (var topic in grantedTopics) {
				this.onSubscribe(topic);
			}
		}
	}

	handleUnsubscribeCompleted = (error) => {
		console.log("handleUnsubscribeCompleted()");
		console.log(error);

		// TODO: Change the message based on the error.
		if (error && this.onError) {
			this.onError(this.ERR_UNSUB, "Failed to unsubscribe from topic.");
		}
	}

}

export default ConnectionManager;


