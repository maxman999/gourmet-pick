import {useReducer} from "react";
import {Client, over} from "stompjs";
import WebsocketContext from "./websocket-context";

const SockJS = require('sockjs-client');

// ToDo
//  1. 웹소켓 기능과 투표 기능 분리 시킬것.
//  2. interface, type 관리,,,

type props = {
    children: React.ReactNode;
}

type websocketState = {
    sessionInfo: sessionInfo,
    isVotingPossible: boolean;
}

type sessionInfo = {
    topic: string,
    userId: number,
    roomId: number,
}

type websocketAction =
    | {
    type: "REGISTER";
    sessionInfo: sessionInfo;
    onMessageHandler: (payload: any) => void;
    onPrivateMessageHandler: (payload: any) => void
}
    | { type: "CREATE" }
    | { type: "CANCEL" }
    | { type: "SEAT" }
    | { type: "BOOTING" }
    | { type: "START" }
    | { type: "VOTE"; menuName: string; preference: number }
    | { type: "FINISH" }
    | { type: "DISCONNECT" };

const WEBSOCKET_SERVER_URL: string = 'http://127.0.0.1:8080/ws'
let stompClient: Client = null;

const onError = (err: any) => {
    alert("에러 발생 잠시 후 다시 시도해주세요");
    document.location.reload();
}

const websocketReducer = (state: websocketState, action: websocketAction): websocketState => {
    if (action.type === "REGISTER") {
        const {topic, userId, roomId} = action.sessionInfo
        let Sock = new SockJS(WEBSOCKET_SERVER_URL);
        stompClient = over(Sock);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/${topic}/${roomId}`, action.onMessageHandler);
            stompClient.subscribe(`/user/${userId}/private`, action.onPrivateMessageHandler);

            stompClient.send(`/app/${topic}/register/${userId}/${roomId}`, {});
            stompClient.send(`/app/${topic}/sync/${userId}/${roomId}`, {});
        }, onError);

        return {
            ...state,
            sessionInfo: action.sessionInfo,
        }
    }

    if (action.type === "CREATE") {
        const {topic, userId, roomId} = state.sessionInfo
        stompClient.send(`/app/${topic}/create/${userId}/${roomId}`, {});
    }

    if (action.type === "CANCEL") {
        const {topic, roomId} = state.sessionInfo
        stompClient.send(`/app/${topic}/cancel/${roomId}`, {});
    }

    if (action.type === "SEAT") {
        const {topic, userId, roomId} = state.sessionInfo
        stompClient.send(`/app/${topic}/seating/${userId}/${roomId}`, {});
    }

    if (action.type === "BOOTING") {
        const {topic, roomId} = state.sessionInfo
        stompClient.send(`/app/${topic}/start/${roomId}`, {});
    }

    if (action.type === "START") {
        return {
            ...state,
            isVotingPossible: true,
        }
    }

    if (action.type === "VOTE") {
        const {topic, userId, roomId} = state.sessionInfo
        const chatMessage = {
            senderName: userId,
            status: 'VOTE',
            menuName: action.menuName,
            preference: action.preference,
        }
        stompClient.send(`/app/${topic}/decide/${userId}/${roomId}`, {}, JSON.stringify(chatMessage));
    }

    if (action.type === "FINISH") {
        const {topic, roomId} = state.sessionInfo;
        stompClient.send(`/app/${topic}/finish/${roomId}`);
        return {
            ...state,
            isVotingPossible: false,
        }
    }

    if (action.type === "DISCONNECT") {
        stompClient.disconnect(() => {
        });
    }

    return state;
}

const defaultWebsocketState: websocketState = {
    sessionInfo: {
        topic: '',
        roomId: null,
        userId: null,
    },
    isVotingPossible: false,
}

const WebsocketProvider = (props: props) => {
    const [websocketState, dispatchWebsocketActions] = useReducer(websocketReducer, defaultWebsocketState);

    const registerHandler = (
        sessionInfo: sessionInfo,
        onMessageHandler: (payload: any) => void,
        onPrivateMessageHandler: (payload: any) => void) => {
        dispatchWebsocketActions({
            type: 'REGISTER',
            sessionInfo: sessionInfo,
            onMessageHandler: onMessageHandler,
            onPrivateMessageHandler: onPrivateMessageHandler,
        });
    }

    const createHandler = () => {
        dispatchWebsocketActions({
            type: 'CREATE',
        });
    }

    const cancelHandler = () => {
        dispatchWebsocketActions({
            type: 'CANCEL',
        });
    }

    const seatHandler = () => {
        dispatchWebsocketActions({
            type: 'SEAT',
        });
    }

    const bootHandler = () => {
        dispatchWebsocketActions({
            type: 'BOOTING',
        });
    }

    const startHandler = () => {
        dispatchWebsocketActions({
            type: 'START',
        });
    }

    const votingHandler = (menuName: string, preference: number) => {
        dispatchWebsocketActions({
            type: 'VOTE',
            menuName: menuName,
            preference: preference,
        });
    }

    const finishVotingHandler = () => {
        dispatchWebsocketActions({
            type: 'FINISH',
        });
    }

    const disconnectHandler = () => {
        dispatchWebsocketActions({
            type: 'DISCONNECT',
        });
    }

    const websocketContext = {
        websocketState: websocketState,
        register: registerHandler,
        create: createHandler,
        cancel: cancelHandler,
        seat: seatHandler,
        boot: bootHandler,
        start: startHandler,
        vote: votingHandler,
        finishVoting: finishVotingHandler,
        disconnect: disconnectHandler,
    }

    return (
        <WebsocketContext.Provider value={websocketContext}>
            {props.children}
        </WebsocketContext.Provider>
    )
}

export default WebsocketProvider