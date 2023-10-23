import * as React from "react";
import {IUser} from "../types/IUser";

type sessionInfo = {
    topic: string,
    roomId: number,
    user: IUser,
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
    decide: (menuId: number, menuName: string, preference: number) => {
    },
    finishVoting: () => {
    },
    disconnect: () => {
    },
});
export default WebsocketContext;