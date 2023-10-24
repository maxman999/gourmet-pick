import {createRoot} from 'react-dom/client';
import App from "./App";
import RoomProvider from "./store/RoomProvider";
import WebsocketProvider from "./store/WebsocketProvider";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <>
        <WebsocketProvider>
            <RoomProvider>
                <App/>
            </RoomProvider>
        </WebsocketProvider>


    </>
);
