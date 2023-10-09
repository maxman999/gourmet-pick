import * as React from "react";

type sessionInfo = {
    topic: string,
    userId: string,
    roomId: string,
}

const WebsocketContext = React.createContext({

    websocketState: {
        isVotingPossible: false
    },
    register: (sessionInfo: sessionInfo, onMessage: (payload: any) => void) => {
    },
    ready: () => {
    },
    vote: (sessionInfo: sessionInfo, menuName: string, preference: number) => {
    },
    finishVoting: (sessionInfo: sessionInfo) => {
    },
    disconnect: () => {
    },

    // onConnected: () => {},
    // userJoin: () => {},
    // onError: () => {},
    // sendPublicMessage: () => {},
    // onPublicMessageRecieved: () => {},
    // onPrivateMessageRecieved: () => {},
});
export default WebsocketContext;