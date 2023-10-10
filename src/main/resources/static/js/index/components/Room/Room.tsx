import EntranceInput from "./EntranceInput";
import {useEffect, useState} from "react";
import {IRoom} from "../../interfaces/IRoom";
import RoomConfirm from "./RoomConfirm";
import MenuList from "../Menu/MenuList";
import './Room.css';
import WebsocketProvider from "../../store/WebsocketProvider";

const Room = () => {
    const [room, setRoom] = useState<IRoom | null>();
    const [isGourmetCalled, setIsGourmetCalled] = useState(false);

    const entranceHandler = (room: IRoom) => {
        setRoom(room);
    }

    const gourmetCallHandler = async (isGourmetCalled: boolean) => {
        setIsGourmetCalled(isGourmetCalled);
    }

    return (
        <>
            <EntranceInput isGourmetCalled={isGourmetCalled} onEntrance={entranceHandler}/>
            {room &&
                <div className={`room-container ${isGourmetCalled ? 'room-buster' : ''} row card mt-3 p-3`}>
                    <RoomConfirm room={room} onGourmetCall={gourmetCallHandler}/>
                    <WebsocketProvider>
                        <MenuList room={room} isGourmetCalled={isGourmetCalled} onGourmetCall={gourmetCallHandler}/>
                    </WebsocketProvider>
                </div>
            }
        </>
    );
}

export default Room;