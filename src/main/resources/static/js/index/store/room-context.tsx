import * as React from "react";

const RoomContext = React.createContext({
    roomPhase: 'default',
    changeRoomPhase: (roomPhase: string) => {
    },
    votingStatus: 'gathering',
    changeVotingStatus: (votingStatus: string) => {
    },
});

export default RoomContext;