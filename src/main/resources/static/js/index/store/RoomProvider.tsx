import {useReducer} from "react";
import * as React from "react";
import RoomContext from "./room-context";

interface roomState {
    roomPhase: string;
    votingStatus: string;
}

interface roomAction {
    type: string;
    roomPhase?: string;
    votingStatus?: string;
}

type props = {
    children: React.ReactNode;
}

const roomReducer = (state: roomState, roomAction: roomAction) => {
    if (roomAction.type === "SET_ROOM_PHASE") {
        return {
            roomPhase: roomAction.roomPhase,
            votingStatus: state.votingStatus,
        }
    }

    if (roomAction.type === "SET_VOTING_STATUS") {
        return {
            roomPhase: state.roomPhase,
            votingStatus: roomAction.votingStatus,
        }
    }
    return state;
}

const defaultRoomState: roomState = {
    roomPhase: 'default',
    votingStatus: 'gathering',
}

const RoomProvider = (props: props) => {
    const [roomState, dispatchMenuActions] = useReducer(roomReducer, defaultRoomState);

    const roomPhaseChangeHandler = (roomPhase: string) => {
        dispatchMenuActions({
            type: 'SET_ROOM_PHASE',
            roomPhase: roomPhase,
        });
    }

    const votingStatusChangeHandler = (votingStatus: string) => {
        dispatchMenuActions({
            type: 'SET_VOTING_STATUS',
            votingStatus: votingStatus,
        });
    }


    const roomContext = {
        roomPhase: roomState.roomPhase,
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