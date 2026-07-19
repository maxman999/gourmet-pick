import {createRoot} from 'react-dom/client';
import App from "./App";
import RoomProvider from "./store/RoomProvider";
import WebsocketProvider from "./store/WebsocketProvider";
import {BrowserRouter} from "react-router-dom";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <BrowserRouter>
        <WebsocketProvider>
            <RoomProvider>
                <App/>
            </RoomProvider>
        </WebsocketProvider>
    </BrowserRouter>
);
