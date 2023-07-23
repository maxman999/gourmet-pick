import {over, Client} from 'stompjs';

type message = {
    username: string,
    receiverName: string,
    message: string,
    connected: boolean,
    status: string
}

const WEBSOCKET_SERVER_URL: string = 'http://localhost:8080/ws';

const SockJS =  require('sockjs-client');
let stompClient: Client = null;

const connectionInformation: message = {
    username: 'kjy',
    receiverName: 'yjk',
    message: 'hello there?',
    connected: false,
    status: '',
}

const registerUser = (topic : string) => {
    let Sock = new SockJS(WEBSOCKET_SERVER_URL);
    stompClient = over(Sock);
    stompClient.connect({}, () => onConnected(topic), onError);
}

const onConnected = (topic : string) => {
    connectionInformation['connected'] = true;
    stompClient.subscribe(topic, onPublicMessageRecieved);
    // stompClient.subscribe('/user/' + connectionInformation.username + '/private', onPrivateMessageRecieved);
    // sendPublicMessage();
}

const disconnect = () => {
    stompClient.disconnect(()=>{
        console.log("webSocket disconnected");
    });
}

const userJoin = () => {
    let chatMessage = {
        senderName: connectionInformation.username,
        status: 'JOIN',
    }
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
}

const onError = (err: any) => {
    console.log(err)
}

const sendPublicMessage = (topic:string, message:string) => {
    if (stompClient.connected) {
        let chatMessage = {
            senderName: connectionInformation.username,
            message: message,
            status: 'MESSAGE',
        }
        stompClient.send(`/app/${topic}`, {}, JSON.stringify(chatMessage));
    }
}

const onPublicMessageRecieved = (payload: any) => {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
        case "JOIN":
            break;
        case "MESSAGE":
            console.log(JSON.stringify(payloadData))
            break;
    }
}

const onPrivateMessageRecieved = (payload: any) => {
    let payloadData = JSON.parse(payload);
}

const sendPrivateMessage = () => {
    if (stompClient) {
        let chatMessage = {
            senderName: connectionInformation.username,
            receiverName: connectionInformation.receiverName,
            message: connectionInformation.message,
            status: 'MESSAGE',
        }
        stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
    }
}

export const WebSocketUtil = {
    registerUser: registerUser,
    disconnect : disconnect,
    sendPublicMessage: sendPublicMessage,
    onPublicMessageReceived: onPublicMessageRecieved,
    onPrivateMessageReceived: onPrivateMessageRecieved,
    onError: onError,
}