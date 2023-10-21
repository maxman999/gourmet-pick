import * as React from "react";
import {IRoom} from "../interfaces/IRoom";

const RoomContext = React.createContext({
    roomInfo: {
        id: 0,
        invitationCode: '',
        name: '',
        hasVotingSession: false,
        currentVotingUserCnt: 0,
    },

    setRoomInfo: (room: IRoom) => {
    },

    enterRoom: (roomCode: string) => {
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