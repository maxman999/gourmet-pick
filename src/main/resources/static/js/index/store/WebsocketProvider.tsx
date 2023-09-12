import * as React from "react";
import {useReducer} from "react";
import {Client, over} from "stompjs";
import WebsocketContext from "./websocket-context";

type props = {
    children: React.ReactNode;
}

interface websocketState {
    sessionList: [];
}

interface websocketAction {
    type: string,
    sessionInfo: {
        topic: string,
        userId: string,
        roomId: string,
    }
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

const connectionInformation: message = {
    roomId: "roomCode",
    username: 'kjy',
    receiverName: 'yjk',
    message: 'hello there?',
    connected: false,
    status: '',
}

const onPublicMessageRecieved = (payload: any) => {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
        case "JOIN":
            const targetCnt = payloadData.userCnt;
            //ToDo react 답게 다시 짜자,,,,
            const targetElement = document.getElementsByClassName('gourmet-img');
            for (let i = 0; i <= targetCnt - 1; i++) {
                const element = targetElement[i] as HTMLElement;
                element.style.background = 'red';
            }
            break;
        case "READY":

        case "MESSAGE":
            console.log("?", JSON.stringify(payloadData))
            break;
    }
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


const websocketReducer = (state: websocketState, action: websocketAction) : websocketState => {
    if (action.type === "REGISTER") {
        const {topic, userId, roomId} = action.sessionInfo

        let Sock = new SockJS(WEBSOCKET_SERVER_URL);
        stompClient = over(Sock);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/${topic}/${roomId}`, onPublicMessageRecieved);
            userJoin(topic, userId, roomId);
        }, onError);

        return {
            sessionList: [],
        }
    }

    return state;
}

const defaultWebsocketState: websocketState = {
    sessionList: []
}

const WebsocketProvider = (props: props) => {
    const [websocketState, dispatchWebsocketActions] = useReducer(websocketReducer, defaultWebsocketState);

    const registerHandler = async (topic: string, userId: string, roomId: string) => {
        dispatchWebsocketActions({
            type: 'REGISTER',
            sessionInfo: {topic, userId, roomId}
        });
    }

    const websocketContext = {
        websocketState: websocketState,
        register: registerHandler
    }

    return (
        <WebsocketContext.Provider value={websocketContext}>
            {props.children}
        </WebsocketContext.Provider>
    )

}

export default WebsocketProvider