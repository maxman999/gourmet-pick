import * as React from "react";

type sessionInfo = {
    topic: string,
    userId: string,
    roomId: string,
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
    sync: () => {
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