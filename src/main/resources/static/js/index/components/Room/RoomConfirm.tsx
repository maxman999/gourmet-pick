import {IRoom} from "../../interfaces/IRoom";
import './RoomConfirm.css';
import * as React from "react";
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";

interface props {
    room: IRoom;
}

const RoomConfirm = (props: props) => {
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext)

    const gourmetCallHandler = (e: React.MouseEvent) => {
        const clickedBtn = e.currentTarget as HTMLElement;
        const targetData = clickedBtn.dataset?.phase;
        roomCtx.changeRoomPhase(targetData);
    }

    const gourmetSeatingHandler = (e: React.MouseEvent) => {
        const clickedBtn = e.currentTarget as HTMLElement;
        const targetData = clickedBtn.dataset?.phase;
        roomCtx.changeRoomPhase(targetData);
        websocketAPIs.seat();
    }

    const gourmetVotingHandler = (e: React.MouseEvent) => {
        websocketAPIs.boot();
    }

    return (
        <div className='row m-0 p-0'>
            <div className='col-md-8'>
                <button
                    className='btn phase-call-btn'
                    data-phase='calling'
                    disabled={roomCtx.roomPhase !== 'default'}
                    onClick={gourmetCallHandler}> 미 식 콜
                </button>
                <button
                    className='btn phase-seat-btn'
                    data-phase='seating'
                    disabled={roomCtx.roomPhase !== 'calling'}
                    onClick={gourmetSeatingHandler}> 착 석
                </button>
                <button
                    className='btn phase-start-btn'
                    data-phase='starting'
                    disabled={roomCtx.roomPhase !== 'ready'}
                    onClick={gourmetVotingHandler}> 투 표 시 작
                </button>
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
