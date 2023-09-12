import * as React from "react";

const WebsocketContext = React.createContext({
    register: (topic:string, userId:string, roomId:string) => {},
    // onConnected: () => {},
    // disconnect: () => {},
    // userJoin: () => {},
    // onError: () => {},
    // sendPublicMessage: () => {},
    // onPublicMessageRecieved: () => {},
    // onPrivateMessageRecieved: () => {},
});
export default WebsocketContext;