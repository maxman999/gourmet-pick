import * as React from "react";
import {IRoom} from "../types/IRoom";
import {IMenu} from "../types/IMenu";

const RoomContext = React.createContext({
    roomInfo: {
        id: 0,
        invitationCode: '',
        name: '',
        managerId: 0,
        hasVotingSession: false,
        currentVotingUserCnt: 0,
        todayPick: undefined,
    },

    setRoomInfo: (room: IRoom) => {
    },

    enterRoom: (roomCode: string) => {
    },

    isMenuListEmpty: true,

    setMenuEmptyFlag: (isMenuListEmpty: boolean) => {
    },

    roomPhase: undefined,

    changeRoomPhase: (roomPhase: string) => {
    },

    callerFlag: false,

    setCallerFlag: (callerFlag: boolean) => {
    },

    updateTargetMenuId: 0,

    setUpdateTargetMenu: (menuId: number) => {
    },

    votingStatus: undefined,

    changeVotingStatus: (votingStatus: string) => {
    },

    votingGourmets: [],

    setVotingGourmets: (gourmets: string[]) => {

    },

    setTodayPick: (menu: IMenu) => {

    },

    deleteTodayPick: (roomId: number) => {

    },
});

export default RoomContext;