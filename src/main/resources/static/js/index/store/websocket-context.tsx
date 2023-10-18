import * as React from "react";

type sessionInfo = {
    topic: string,
    userId: number,
    roomId: number,
}

const WebsocketContext = React.createContext({
    websocketState: {
        sessionInfo: {},
        isVotingPossible: false
    },
    register: (
        sessionInfo: sessionInfo,
        onMessage: (payload: any) => void,
        onPrivateMessage: (payload: any) => void
    ) => {
    },
    create: () => {
    },
    cancel: () => {
    },
    seat: () => {
    },
    boot: () => {
    },
    start: () => {
    },
    vote: (menuName: string, preference: number) => {
    },
    finishVoting: () => {
    },
    disconnect: () => {
    },
});
export default WebsocketContext;