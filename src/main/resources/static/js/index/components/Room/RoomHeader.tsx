import {IRoom} from "../../interfaces/IRoom";
import './RoomHeader.css';
import {useRef} from "react";
import RoomConsole from "./RoomConsole";

interface props {
    room: IRoom;
    isConsoleActive: boolean;
}

const RoomHeader = (props: props) => {
    const headlineRef = useRef(null);

    return (
        <div className='row' ref={headlineRef}>
            <div className='col-md-4 mt-2'>
                <div data-room-id={props.room?.id}>
                    <span className='room-title'> # {props.room?.name} </span>
                    <span className='room-code'>({props.room?.invitationCode})</span>
                </div>
            </div>
            {props.isConsoleActive &&
                <div className={"col mt-2 text-end"}>
                    <RoomConsole/>
                </div>
            }
        </div>
    );
}

export default RoomHeader;
