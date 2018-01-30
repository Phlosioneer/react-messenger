
import React from 'react';
import {Panel} from 'react-bootstrap';

class ChatView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			messages: []
		};

		this.setupConnection(props.connection);
	}

	render() {
		return (
				<div>
					Chat:
					{this.state.textWall}
				</div>
			   );
	}

	componentWillReceiveProps(newProps) {
		console.log("willReceiveProps");
		console.log(newProps);
		this.teardownConnection(this.props.connection);
		this.setupConnection(newProps.connection);
	}

	setupConnection(conn) {
		console.log("setupConnection()");
		console.log(conn);

		if (conn === undefined || conn === null) {
			return;
		}

		conn.on('connect', this.handleConnect);
		conn.on('reconnect', this.handleReconnect);
		conn.on('close', this.handleConnectionClose);
		conn.on('offline', this.handleOffline);
		conn.on('error', this.handleConnectionError);
		conn.on('message', this.handleMessage);

		conn.subscribe("root/#");
	}

	teardownConnection(conn) {
		if (conn === undefined || conn === null) {
			return;
		}

		conn.removeListener('connect', this.handleConnect);
		conn.removeListener('reconnect', this.handleReconnect);
		conn.removeListener('close', this.handleConnectionClose);
		conn.removeListener('offline', this.handleOffline);
		conn.removeListener('error', this.handleConnectionError);
		conn.removeListener('message', this.handleMessage);
	}
	
	handleConnect = (connack) => {
		console.log("handleConnect()");
		console.log(connack);
	}

	handleReconnect = () => {
		console.log("handleReconnect()");
	}

	handleConnectionClose = () => {
		console.log("handleConnectionClose()");
	}

	handleOffline = () => {
		console.log("handleOffline()");
	}

	handleConnectionError = (error) => {
		console.log("handleConnectionError()");
		console.log(error);
	}

	handleMessage = (topic, message, packet) => {
		console.log("handleMessage()");
		console.log(topic);
		console.log(message);
		console.log(packet);
	}
}

export default ChatView;





