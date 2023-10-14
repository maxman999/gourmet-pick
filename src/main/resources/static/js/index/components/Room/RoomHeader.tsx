import {IRoom} from "../../interfaces/IRoom";
import './RoomHeader.css';
import {useContext, useRef} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";
import {Tooltip} from 'react-tooltip'

interface props {
    room: IRoom;
}

const RoomHeader = (props: props) => {
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext);
    const headlineRef = useRef(null);

    const gourmetCallHandler = () => {
        roomCtx.changeRoomPhase('calling');
        websocketAPIs.create();
    }

    const gourmetSeatingHandler = () => {
        roomCtx.changeRoomPhase('seating');
        websocketAPIs.seat();
    }

    const gourmetVotingHandler = () => {
        websocketAPIs.boot();
    }

    const cancelVotingHandler = () => {
        roomCtx.changeRoomPhase('default');
        websocketAPIs.cancel();
    }

    return (
        <div className='row m-0 p-0' ref={headlineRef}>
            <div className='col-md-8'>
                <button
                    className='phaseBtn btn btn-outline-success phase-call-btn'
                    data-next-phase='calling'
                    disabled={roomCtx.roomPhase !== 'default'}
                    onClick={gourmetCallHandler}> 미 식 콜
                </button>
                <button
                    className='phaseBtn btn btn-outline-success phase-seat-btn'
                    data-next-phase='seating'
                    disabled={roomCtx.roomPhase !== 'calling'}
                    onClick={gourmetSeatingHandler}> 착 석
                </button>
                <button
                    className='phaseBtn btn btn-outline-success phase-start-btn'
                    data-next-phase='starting'
                    disabled={roomCtx.roomPhase !== 'ready'}
                    onClick={gourmetVotingHandler}> 투 표 시 작
                </button>
                {(roomCtx.roomPhase !== 'default' && roomCtx.votingStatus === 'gathering') &&
                    <button
                        className='phaseBtn btn btn-outline-success phase-cancel-btn'
                        data-next-phase='starting'
                        onClick={cancelVotingHandler}> 투 표 취 소
                    </button>
                }
                <Tooltip anchorSelect=".phaseBtn" place="top">
                    Hello world!
                </Tooltip>
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
