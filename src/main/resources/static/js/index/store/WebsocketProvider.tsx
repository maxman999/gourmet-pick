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

type sessionInfo = {
    topic: string,
    userId: string,
    roomId: string,
}

interface websocketAction {
    type: string,
    sessionInfo?: sessionInfo
    onMessageHandler?: (payload: any) => void
    menuName?: string
    preference?: number
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
    }

    if (action.type === "READY") {
        return {
            isVotingPossible: true,
            sessionList: [],
        }
    }

    if (action.type === "VOTE") {
        const {topic, userId, roomId} = action.sessionInfo
        const chatMessage = {
            senderName: connectionInformation.username,
            status: 'VOTE',
            menuName: action.menuName,
            preference: action.preference,
        }
        stompClient.send(`/app/${topic}/decide/${userId}/${roomId}`, {}, JSON.stringify(chatMessage));
    }

    return state;
}

const defaultWebsocketState: websocketState = {
    isVotingPossible: false,
    sessionList: []
}

const WebsocketProvider = (props: props) => {
    const [websocketState, dispatchWebsocketActions] = useReducer(websocketReducer, defaultWebsocketState);

    const registerHandler = (sessionInfo: sessionInfo, onMessageHandler: (payload: any) => void) => {
        dispatchWebsocketActions({
            type: 'REGISTER',
            sessionInfo: sessionInfo,
            onMessageHandler: onMessageHandler,
        });
    }

    const readyHandler = () => {
        dispatchWebsocketActions({
            type: 'READY',
        });
    }

    const votingHandler = (sessionInfo: sessionInfo, menuName: string, preference: number) => {
        dispatchWebsocketActions({
            type: 'VOTE',
            sessionInfo: sessionInfo,
            menuName: menuName,
            preference: preference,
        });
    }

    const websocketContext = {
        websocketState: websocketState,
        register: registerHandler,
        ready: readyHandler,
        vote: votingHandler,
    }

    return (
        <WebsocketContext.Provider value={websocketContext}>
            {props.children}
        </WebsocketContext.Provider>
    )

}

export default WebsocketProvider