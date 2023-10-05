import * as React from "react";
import {useReducer} from "react";
import {Client, over} from "stompjs";
import WebsocketContext from "./websocket-context";

type props = {
    children: React.ReactNode;
}

interface websocketState {
    isVotingPossible: boolean;
    sessionList: [];
}

interface websocketAction {
    type: string,
    sessionInfo?: {
        topic: string,
        userId: string,
        roomId: string,
    },
    onMessageHandler?: (payload: any) => void
}

type message = {
    roomId: string,
    username: string,
    receiverName: string,
    message: string,
    connected: boolean,
    status: string
}

const WEBSOCKET_SERVER_URL: string = 'http://localhost:8080/ws'
const SockJS = require('sockjs-client');
let stompClient: Client = null;

// dummy
const connectionInformation: message = {
    roomId: "roomCode",
    username: 'kjy',
    receiverName: 'yjk',
    message: 'hello there?',
    connected: false,
    status: '',
}

const userJoin = (topic: string, userId: string, roomId: string) => {
    let chatMessage = {
        senderName: connectionInformation.username,
        status: 'JOIN',
    }
    stompClient.send(`/app/${topic}/seating/${userId}/${roomId}`, {}, JSON.stringify(chatMessage));
}

const onError = (err: any) => {
    console.log(err)
}


const websocketReducer = (state: websocketState, action: websocketAction): websocketState => {
    if (action.type === "REGISTER") {
        const {topic, userId, roomId} = action.sessionInfo

        let Sock = new SockJS(WEBSOCKET_SERVER_URL);
        stompClient = over(Sock);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/${topic}/${roomId}`, action.onMessageHandler);
            userJoin(topic, userId, roomId);
        }, onError);

        return {
            isVotingPossible: false,
            sessionList: [],
        }
    }

    if (action.type === "READY") {
        return {
            isVotingPossible: true,
            sessionList: [],
        }
    }

    return state;
}

const defaultWebsocketState: websocketState = {
    isVotingPossible: false,
    sessionList: []
}

const WebsocketProvider = (props: props) => {
    const [websocketState, dispatchWebsocketActions] = useReducer(websocketReducer, defaultWebsocketState);

    const registerHandler = (topic: string, userId: string, roomId: string, onMessageHandler: (payload: any) => void) => {
        dispatchWebsocketActions({
            type: 'REGISTER',
            sessionInfo: {topic, userId, roomId},
            onMessageHandler: onMessageHandler,
        });
    }

    const votingHandler = () => {
        dispatchWebsocketActions({
            type: 'READY',
        });
    }

    const websocketContext = {
        websocketState: websocketState,
        register: registerHandler,
        ready: votingHandler,
    }

    return (
        <WebsocketContext.Provider value={websocketContext}>
            {props.children}
        </WebsocketContext.Provider>
    )

}

export default WebsocketProvider