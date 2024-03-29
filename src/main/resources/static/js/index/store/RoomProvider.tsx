import * as React from "react";
import {useReducer} from "react";
import RoomContext from "./room-context";
import {IRoom} from "../types/IRoom";
import axios from "axios";
import RoomPhase from "../types/RoomPhase";
import VotingStatus from "../types/VotingStatus";
import {IMenu} from "../types/IMenu";
import {IUser} from "../types/IUser";
import CommonUtils from "../utils/CommonUtils";
import Swal from "sweetalert2";

type roomState = {
    roomInfo: IRoom;
    isMenuListEmpty: boolean;
    roomPhase: string;
    updateTargetMenuId: number
    callerFlag: boolean;
    votingStatus: string;
    votingGourmets: IUser[];
}

type roomAction =
    | { type: "DEFAULT_ROOM_SETTING"; roomInfo: IRoom; }
    | { type: "SET_MENU_EMPTY_FLAG"; isMenuListEmpty: boolean }
    | { type: "SET_ROOM_PHASE"; roomPhase: string; }
    | { type: "SET_UPDATE_TARGET_MENU"; menuId: number; }
    | { type: "SET_CALLER_FLAG"; callerFlag: boolean; }
    | { type: "SET_VOTING_STATUS"; votingStatus: string; }
    | { type: "SET_VOTING_GOURMETS"; votingGourmets: IUser[]; }
    | { type: "SET_TODAY_PICK"; menu: IMenu; }
    | { type: "DELETE_TODAY_PICK"; roomId: number; }

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

    if (roomAction.type === "SET_VOTING_GOURMETS") {
        return {
            ...state,
            votingGourmets: roomAction.votingGourmets
        };
    }

    if (roomAction.type === "DELETE_TODAY_PICK") {
        delete state.roomInfo.todayPick
        return {
            ...state,
        };
    }

    if (roomAction.type === "SET_TODAY_PICK") {
        return {
            ...state,
            roomInfo: {
                ...state.roomInfo,
                todayPick: roomAction.menu,
            }
        };
    }
    return state;
}

const defaultRoomState: roomState = {
    roomInfo: null,
    isMenuListEmpty: null,
    roomPhase: RoomPhase.DEFAULT,
    updateTargetMenuId: null,
    callerFlag: false,
    votingStatus: VotingStatus.GATHERING,
    votingGourmets: [],
}

const getRoomWithInspection = async (roomCode: string, userId: number) => {
    const {data: resultMap} = await axios.post(`api/room/enterWithInspection/${userId}/${roomCode}`);
    switch (resultMap.code) {
        case -1:
            Swal.fire({title: '이미 사용 중인 투표 세션이 있습니다. 먼저 해당 세션을 종료해주세요.', icon: 'warning'});
            break;
        case -2:
            Swal.fire({title: '방이 존재하지 않습니다.', icon: 'warning'});
            break;
        case -3:
            Swal.fire({title: '이미 투표가 시작된 방은 들어갈 수 없습니다.', icon: 'warning'});
            break;
        case -4:
            Swal.fire({title: '입장할 수 있는 정원을 초과했습니다.', icon: 'warning'});
            break;
        case 1:
            const room = resultMap.room as IRoom;
            if (room.todayPick.id === 0) delete room.todayPick;
            return room;
        default:
            break;
    }
}

const deleteTodayPick = async (roomId: number) => {
    const {data: result} = await axios.delete(`/api/menu/todayPick/${roomId}`);
    return result;
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
        const user = CommonUtils.getUserFromSession();
        const room = await getRoomWithInspection(roomCode, user.id);
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

    const setVotingGourmetsHandler = (votingGourmets: IUser[]) => {
        dispatchMenuActions({
            type: 'SET_VOTING_GOURMETS',
            votingGourmets: votingGourmets,
        })
    }

    const setTodayPickHandler = async (menu: IMenu) => {
        dispatchMenuActions({
            type: 'SET_TODAY_PICK',
            menu: menu,
        });
    }

    const deleteTodayPickHandler = async (roomId: number) => {
        const result = await deleteTodayPick(roomId);
        if (result === 0) {
            alert("오늘의 메뉴를 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
        dispatchMenuActions({
            type: 'DELETE_TODAY_PICK',
            roomId: roomId,
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
        votingGourmets: roomState.votingGourmets,
        setVotingGourmets: setVotingGourmetsHandler,
        updateTargetMenuId: roomState.updateTargetMenuId,
        setUpdateTargetMenu: setUpdateTargetMenuHandler,
        enterRoom: enterRoomHandler,
        setTodayPick: setTodayPickHandler,
        deleteTodayPick: deleteTodayPickHandler,
    }

    return (
        <RoomContext.Provider value={roomContext}>
            {props.children}
        </RoomContext.Provider>
    )
}

export default RoomProvider;