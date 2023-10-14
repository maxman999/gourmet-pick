import * as React from "react";
import {useReducer} from "react";
import RoomContext from "./room-context";
import {IRoom} from "../interfaces/IRoom";

type roomState = {
    roomInfo: IRoom;
    roomPhase: string;
    votingStatus: string;
    callerFlag: boolean;
}

type roomAction =
    | { type: "DEFAULT_ROOM_SETTING"; roomInfo: IRoom; }
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

    if (roomAction.type === "SET_ROOM_PHASE") {
        return {
            ...state,
            roomPhase: roomAction.roomPhase
        };
    }

    if (roomAction.type === "SET_CALLER_FLAG") {
        console.log("this")
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
        setRoomInfo: roomSettingHandler,
        roomPhase: roomState.roomPhase,
        callerFlag: roomState.callerFlag,
        setCallerFlag: callerFlagChangeHandler,
        votingStatus: roomState.votingStatus,
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