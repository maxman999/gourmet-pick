import EntranceInput from "./EntranceInput";
import {useState} from "react";
import {IRoom} from "../../interfaces/IRoom";
import RoomConfirm from "./RoomConfirm";
import MenuList from "../menu/MenuList";
import './Room.css';
import MenuProvider from "../../store/MenuProvider";

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
                <div className={`row room-container card mt-3 p-3 ${isBusterCalled ? 'room-buster':''}`}>
                    <RoomConfirm room={room} onBusterCall={busterCallHandler}/>
                    <MenuProvider>
                        <MenuList room={room} isBusterCalled={isBusterCalled}/>
                    </MenuProvider>
                </div>
            }
        </>
    );
}

export default Room;