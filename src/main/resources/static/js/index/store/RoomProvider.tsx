import * as React from "react";
import {useReducer} from "react";
import RoomContext from "./room-context";
import {IRoom} from "../interfaces/IRoom";

type roomState = {
    roomInfo: IRoom;
    isMenuListEmpty: boolean;
    roomPhase: string;
    votingStatus: string;
    callerFlag: boolean;
}

type roomAction =
    | { type: "DEFAULT_ROOM_SETTING"; roomInfo: IRoom; }
    | { type: "SET_MENU_EMPTY_FLAG"; isMenuListEmpty: boolean }
    | { type: "SET_ROOM_PHASE"; roomPhase: string; }
    | { type: "SET_CALLER_FLAG"; callerFlag: boolean; }
    | { type: "SET_VOTING_STATUS"; votingStatus: string; }

type props = {
    children: React.ReactNode;
}

const roomReducer = (state: roomState, roomAction: roomAction) => {
    if (roomAction.type === "DEFAULT_ROOM_SETTING") {
        return {
            ...state,
            roomInfo: roomAction.roomInfo
        };
    }

    if (roomAction.type === "SET_MENU_EMPTY_FLAG") {
        return {
            ...state,
            isMenuListEmpty: roomAction.isMenuListEmpty
        };
    }

    if (roomAction.type === "SET_ROOM_PHASE") {
        return {
            ...state,
            roomPhase: roomAction.roomPhase
        };
    }

    if (roomAction.type === "SET_CALLER_FLAG") {
        return {
            ...state,
            callerFlag: roomAction.callerFlag
        };
    }

    if (roomAction.type === "SET_VOTING_STATUS") {
        return {
            ...state,
            votingStatus: roomAction.votingStatus
        };
    }
    return state;
}

const defaultRoomState: roomState = {
    roomInfo: undefined,
    isMenuListEmpty: true,
    roomPhase: 'default',
    callerFlag: false,
    votingStatus: 'gathering',
}

const RoomProvider = (props: props) => {
    const [roomState, dispatchMenuActions] = useReducer(roomReducer, defaultRoomState);

    const roomSettingHandler = (room: IRoom) => {
        dispatchMenuActions({
            type: 'DEFAULT_ROOM_SETTING',
            roomInfo: room,
        });
    }

    const menuEmptyFlagSettingHandler = (isMenuListEmpty: boolean) => {
        dispatchMenuActions({
            type: 'SET_MENU_EMPTY_FLAG',
            isMenuListEmpty: isMenuListEmpty,
        });
    }

    const roomPhaseChangeHandler = (roomPhase: string) => {
        dispatchMenuActions({
            type: 'SET_ROOM_PHASE',
            roomPhase: roomPhase,
        });
    }

    const callerFlagChangeHandler = (callerFlag: boolean) => {
        dispatchMenuActions({
            type: 'SET_CALLER_FLAG',
            callerFlag: callerFlag,
        });
    }

    const votingStatusChangeHandler = (votingStatus: string) => {
        dispatchMenuActions({
            type: 'SET_VOTING_STATUS',
            votingStatus: votingStatus,
        });
    }


    const roomContext = {
        roomInfo: roomState.roomInfo,
        isMenuListEmpty: roomState.isMenuListEmpty,
        roomPhase: roomState.roomPhase,
        callerFlag: roomState.callerFlag,
        votingStatus: roomState.votingStatus,
        setRoomInfo: roomSettingHandler,
        setMenuEmptyFlag: menuEmptyFlagSettingHandler,
        setCallerFlag: callerFlagChangeHandler,
        changeRoomPhase: roomPhaseChangeHandler,
        changeVotingStatus: votingStatusChangeHandler,
    }

    return (
        <RoomContext.Provider value={roomContext}>
            {props.children}
        </RoomContext.Provider>
    )
}

export default RoomProvider;