import * as React from "react";

const WebsocketContext = React.createContext({
    websocketState: {
        isVotingPossible: false
    },
    register: (topic: string, userId: string, roomId: string, onMessage: (payload: any) => void) => {
    },
    ready: () => {
    },
    // onConnected: () => {},
    // disconnect: () => {},
    // userJoin: () => {},
    // onError: () => {},
    // sendPublicMessage: () => {},
    // onPublicMessageRecieved: () => {},
    // onPrivateMessageRecieved: () => {},
});
export default WebsocketContext;