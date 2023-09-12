import EntranceInput from "./EntranceInput";
import {useState} from "react";
import {IRoom} from "../../interfaces/IRoom";
import RoomConfirm from "./RoomConfirm";
import MenuList from "../Menu/MenuList";
import './Room.css';
import MenuProvider from "../../store/MenuProvider";
import WebsocketProvider from "../../store/WebsocketProvider";

const Room = () => {
    const [room, setRoom] = useState<IRoom | null>();
    const [isBusterCalled, setIsBusterCalled] = useState(false);

    const entranceHandler = (room: IRoom) => {
        setRoom(room);
    }

    const busterCallHandler = async (isBusterCalled: boolean) => {
        setIsBusterCalled(isBusterCalled);
    }

    return (
        <>
            <EntranceInput isBusterCalled={isBusterCalled} onEntrance={entranceHandler}/>
            {room &&
                <div className={`room-container ${isBusterCalled ? 'room-buster':''} row card mt-3 p-3`}>
                    <RoomConfirm room={room} onBusterCall={busterCallHandler}/>
                    <WebsocketProvider>
                        <MenuList room={room} isBusterCalled={isBusterCalled}/>
                    </WebsocketProvider>
                </div>
            }
        </>
    );
}

export default Room;