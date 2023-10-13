import * as React from "react";
import {IRoom} from "../interfaces/IRoom";

const RoomContext = React.createContext({
    roomInfo: undefined,
    setRoomInfo: (room: IRoom) => {
    },
    roomPhase: 'default',
    changeRoomPhase: (roomPhase: string) => {
    },
    votingStatus: 'gathering',
    changeVotingStatus: (votingStatus: string) => {
    },
});

export default RoomContext;