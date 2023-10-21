import * as React from "react";
import {useReducer} from "react";
import RoomContext from "./room-context";
import {IRoom} from "../types/IRoom";
import axios from "axios";
import * as _ from "lodash";
import RoomPhase from "../types/RoomPhase";
import VotingStatus from "../types/VotingStatus";

type roomState = {
    roomInfo: IRoom;
    isMenuListEmpty: boolean;
    roomPhase: string;
    updateTargetMenuId: number
    votingStatus: string;
    callerFlag: boolean;
}

type roomAction =
    | {
    type: "DEFAULT_ROOM_SETTING";
    roomInfo: IRoom;
}
    | {
    type: "SET_MENU_EMPTY_FLAG";
    isMenuListEmpty: boolean
}
    | {
    type: "SET_ROOM_PHASE";
    roomPhase: string;
}
    | {
    type: "SET_UPDATE_TARGET_MENU";
    menuId: number;
}
    | {
    type: "SET_CALLER_FLAG";
    callerFlag: boolean;
}
    | {
    type: "SET_VOTING_STATUS";
    votingStatus: string;
}

type props = {
    children: React.ReactNode;
}

const inspectSessionDuplication = async () => {
    const {data: isSessionDuplicated} = await axios.get("/voting/isSessionDuplicated");
    return isSessionDuplicated;
}

const getRoom = async (code: string = "") => {
    const fetchRes = await axios.get(`/api/room/${code}`);
    if (fetchRes.status === 200) {
        return fetchRes.data
    }
};

const enterRoom = async (userId: number, roomId: number) => {
    const fetchResult = await axios.post(`api/room/enter/${userId}/${roomId}`);
    return Number(fetchResult.data) >= 0;
};

const getRoomWithInspection = async (roomCode: string, userId: number) => {
    const isSessionDuplicated = await inspectSessionDuplication();
    if (isSessionDuplicated) {
        alert("이미 사용 중인 투표 세션이 있습니다. 먼저 해당 세션을 종료해주세요.");
        return;
    }

    const room: IRoom = await getRoom(roomCode);
    if (_.isEmpty(room)) {
        alert("해당 방이 존재하지 않습니다.");
        return;
    }

    const isEntranceSuccess = await enterRoom(userId, room.id);
    if (isEntranceSuccess) {
        return room;
    } else {
        alert("방 입장 실패");
        return;
    }
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

    if (roomAction.type === "SET_UPDATE_TARGET_MENU") {
        return {
            ...state,
            updateTargetMenuId: roomAction.menuId,
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
    roomInfo: null,
    isMenuListEmpty: true,
    roomPhase: RoomPhase.DEFAULT,
    updateTargetMenuId: null,
    callerFlag: false,
    votingStatus: VotingStatus.GATHERING,
}

const RoomProvider = (props: props) => {
    const [roomState, dispatchMenuActions] = useReducer(roomReducer, defaultRoomState);

    const roomSettingHandler = (room: IRoom) => {
        dispatchMenuActions({
            type: 'DEFAULT_ROOM_SETTING',
            roomInfo: room,
        });
    }

    const enterRoomHandler = async (roomCode: string) => {
        const userId = Number(sessionStorage.getItem("userId"));
        const room = await getRoomWithInspection(roomCode, userId);
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

    const setUpdateTargetMenuHandler = (menuId: number) => {
        dispatchMenuActions({
            type: 'SET_UPDATE_TARGET_MENU',
            menuId: menuId,
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
        isMenuListEmpty: roomState.isMenuListEmpty,
        setMenuEmptyFlag: menuEmptyFlagSettingHandler,
        roomPhase: roomState.roomPhase,
        changeRoomPhase: roomPhaseChangeHandler,
        callerFlag: roomState.callerFlag,
        setCallerFlag: callerFlagChangeHandler,
        votingStatus: roomState.votingStatus,
        changeVotingStatus: votingStatusChangeHandler,
        updateTargetMenuId: roomState.updateTargetMenuId,
        setUpdateTargetMenu: setUpdateTargetMenuHandler,
        enterRoom: enterRoomHandler,
    }

    return (
        <RoomContext.Provider value={roomContext}>
            {props.children}
        </RoomContext.Provider>
    )
}

export default RoomProvider;