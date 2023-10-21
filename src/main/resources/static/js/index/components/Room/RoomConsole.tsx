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
        roomCtx.setCallerFlag(true);
        websocketAPIs.create();
    }

    const gourmetVotingHandler = () => {
        websocketAPIs.boot();
    }

    const cancelVotingHandler = () => {
        roomCtx.changeRoomPhase('default');
        websocketAPIs.cancel();
    }

    const isVoteStartingPossible = (roomCtx.callerFlag && (roomCtx.roomPhase !== 'starting'))
        || roomCtx.roomPhase === 'ready';


    const exitHandler = () => {
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
                        className='phaseBtn btn btn-sm btn-outline-success phase-start-btn'
                        data-next-phase='starting'
                        disabled={!isVoteStartingPossible}
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
            {roomCtx.roomPhase === 'default' && !roomCtx.isMenuListEmpty &&
                <Tooltip anchorSelect=".phase-call-btn" place="top" style={{zIndex: '9998'}}>
                    버튼을 누르면 투표를 진행할 수 있습니다.
                </Tooltip>
            }
            {roomCtx.roomPhase === 'calling' &&
                <Tooltip anchorSelect=".phase-start-btn" place="top" style={{zIndex: '9998'}}>
                    과반이상 입장했거나, 방장의 요청에 의해 투표를 시작할 수 있습니다.
                </Tooltip>
            }
        </>
    )
}

export default RoomConsole;