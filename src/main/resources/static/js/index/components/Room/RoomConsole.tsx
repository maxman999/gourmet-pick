import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {Tooltip} from "react-tooltip";
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";

const RoomConsole = () => {
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext);

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


    function exitHandler() {
        document.location.reload();
    }

    return (
        <>
            <div className={"row"}>
                <div className={"col"}>
                    <button
                        className='phaseBtn btn btn-sm btn-outline-success phase-call-btn'
                        data-next-phase='calling'
                        disabled={roomCtx.roomPhase !== 'default' || roomCtx.isMenuListEmpty}
                        onClick={gourmetCallHandler}> 미 식 콜
                    </button>
                </div>
                <div className={"col"}>
                    <button
                        className='phaseBtn btn btn-sm btn-outline-success phase-seat-btn'
                        data-next-phase='seating'
                        disabled={roomCtx.roomPhase !== 'calling'}
                        onClick={gourmetSeatingHandler}> 착 석
                    </button>
                </div>
                <div className={"col"}>
                    <button
                        className='phaseBtn btn btn-sm btn-outline-success phase-start-btn'
                        data-next-phase='starting'
                        disabled={roomCtx.roomPhase !== 'ready'}
                        onClick={gourmetVotingHandler}> 투 표 시 작
                    </button>
                </div>
                {(roomCtx.roomPhase !== 'default' && roomCtx.votingStatus === 'gathering') &&
                    <div className={"col"}>
                        <button
                            className='phaseBtn btn btn-sm btn-outline-success phase-cancel-btn'
                            data-next-phase='starting'
                            onClick={cancelVotingHandler}> 투 표 취 소
                        </button>
                    </div>
                }
                <div className={"col"}>
                    <button
                        className={"phaseBtn btn btn-sm btn-outline-danger"}
                        onClick={exitHandler}
                    >
                        나가기 <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                    </button>
                </div>
            </div>
            <Tooltip anchorSelect=".phaseBtn" place="top">
                Hello world!
            </Tooltip>
        </>
    )
}

export default RoomConsole;