import {IRoom} from "../../interfaces/IRoom";
import './RoomConfirm.css';
import * as React from "react";

interface props {
    room: IRoom;
    onGourmetCall: (isGourmetCalled: boolean) => void
}

const RoomConfirm = (props: props) => {
    const gourmetCallHandler = () => {
        props.onGourmetCall(true);
    }

    return (
        <div className='row m-0 p-0'>
            <div className='col-md-8'>
                <button className='phaseBtn btn' onClick={gourmetCallHandler}>CALL</button>
                <button className='phaseBtn btn' onClick={gourmetCallHandler}>SEAT</button>
                <button className='phaseBtn btn' onClick={gourmetCallHandler}>START</button>
            </div>
            <div className='col-md-4'>
                <div className='text-end' data-room-id={props.room?.id}>
                    <span className='room-title'> # {props.room?.name} </span>
                    <span className='room-code'>({props.room?.invitationCode})</span>
                </div>
            </div>
        </div>
    );
}

export default RoomConfirm;
