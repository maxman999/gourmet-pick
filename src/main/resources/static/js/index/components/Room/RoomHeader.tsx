import {IRoom} from "../../interfaces/IRoom";
import './RoomHeader.css';
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";

interface props {
    room: IRoom;
}

const RoomHeader = (props: props) => {
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext)

    const gourmetCallHandler = () => {
        roomCtx.changeRoomPhase('seating');
        websocketAPIs.seat();
    }

    const gourmetSeatingHandler = () => {
        roomCtx.changeRoomPhase('seating');
        websocketAPIs.seat();
    }

    const gourmetVotingHandler = () => {
        websocketAPIs.boot();
    }

    return (
        <div className='row m-0 p-0'>
            <div className='col-md-8'>
                <button
                    className='btn phase-call-btn'
                    data-next-phase='calling'
                    disabled={roomCtx.roomPhase !== 'default'}
                    onClick={gourmetCallHandler}> 미 식 콜
                </button>
                <button
                    className='btn phase-seat-btn'
                    data-next-phase='seating'
                    disabled={roomCtx.roomPhase !== 'calling'}
                    onClick={gourmetSeatingHandler}> 착 석
                </button>
                <button
                    className='btn phase-start-btn'
                    data-next-phase='starting'
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

export default RoomHeader;
