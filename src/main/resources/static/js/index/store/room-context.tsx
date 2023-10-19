import * as React from "react";
import {IRoom} from "../interfaces/IRoom";

const RoomContext = React.createContext({
    roomInfo: null,
    setRoomInfo: (room: IRoom) => {
    },
    isMenuListEmpty: true,
    setMenuEmptyFlag: (isMenuListEmpty: boolean) => {
    },
    roomPhase: 'default',
    changeRoomPhase: (roomPhase: string) => {
    },
    callerFlag: false,
    setCallerFlag: (callerFlag: boolean) => {
    },
    votingStatus: 'gathering',
    changeVotingStatus: (votingStatus: string) => {
    },
});

export default RoomContext;