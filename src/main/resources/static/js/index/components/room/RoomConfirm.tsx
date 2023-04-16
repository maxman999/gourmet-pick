import {IRoom} from "../../interfaces/IRoom";
import './RoomConfirm.css';
import * as React from "react";

interface props {
    room : IRoom;
    onBusterCall : (isBusterCalled:boolean) => void
}

const RoomConfirm = (props : props) => {
    const busterCallHandler = (e:React.MouseEvent) => {
        props.onBusterCall(true);
    }

    return(
        <div className='row m-0 p-0'>
            <div className='col'>
                <button className='btn btn-outline-danger' onClick={busterCallHandler}>Buster Call</button>
            </div>
            <div className='col'>
                <div className='text-end' data-room-id={props.room?.id}>
                    <span className='room-title'> # {props.room?.name} </span>
                    <span className='room-code'>({props.room?.invitationCode})</span>
                </div>
            </div>
        </div>
    );
}

export default RoomConfirm;
