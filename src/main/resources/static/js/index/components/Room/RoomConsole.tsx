import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faEye} from "@fortawesome/free-solid-svg-icons";
import {Tooltip} from "react-tooltip";
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";
import VotingStatus from "../../types/VotingStatus";
import * as _ from "lodash";

type props = {
    todayPickPopupFlag: boolean;
    todayPickPopupFlagHandler: (popupFlag: boolean) => void
}

const RoomConsole = (props: props) => {
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext);

    const isTodayPickTooltipShow = (
        roomCtx.roomPhase === RoomPhase.DEFAULT &&
        !_.isEmpty(roomCtx.roomInfo.todayPick) &&
        !props.todayPickPopupFlag
    );

    const gourmetCallHandler = () => {
        roomCtx.changeRoomPhase(RoomPhase.CALLING);
        roomCtx.setCallerFlag(true);
        websocketAPIs.create();
    }

    const gourmetVotingHandler = () => {
        websocketAPIs.boot();
    }

    const cancelVotingHandler = () => {
        roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
        websocketAPIs.cancel();
    }

    const isGourmetCallPossible =
        roomCtx.roomPhase === RoomPhase.DEFAULT &&
        !roomCtx.isMenuListEmpty &&
        _.isEmpty(roomCtx.roomInfo.todayPick)


    const isVoteStartingPossible =
        roomCtx.roomPhase === RoomPhase.READY ||
        (roomCtx.roomPhase === RoomPhase.CALLING && roomCtx.callerFlag)

    const exitHandler = () => {
        document.location.reload();
    }

    const todayPickPopupHandler = () => {
        props.todayPickPopupFlagHandler(true)
    }


    return (
        <>
            <div className={"row"}>
                <div className={"col"}>
                    <button
                        className='phaseBtn btn btn-sm btn-outline-success phase-call-btn'
                        data-next-phase={RoomPhase.CALLING}
                        disabled={!isGourmetCallPossible}
                        onClick={gourmetCallHandler}> 미 식 콜
                    </button>
                </div>
                <div className={"col"}>
                    <button
                        className='phaseBtn btn btn-sm btn-outline-success phase-start-btn'
                        data-next-phase={RoomPhase.STARTING}
                        disabled={!isVoteStartingPossible}
                        onClick={gourmetVotingHandler}> 투 표 시 작
                    </button>
                </div>
                {(roomCtx.roomPhase !== RoomPhase.DEFAULT && roomCtx.votingStatus === VotingStatus.GATHERING) &&
                    <div className={"col"}>
                        <button
                            className='phaseBtn btn btn-sm btn-outline-success phase-cancel-btn'
                            data-next-phase={RoomPhase.STARTING}
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
            {roomCtx.roomPhase === RoomPhase.DEFAULT && !roomCtx.isMenuListEmpty &&
                <Tooltip anchorSelect=".phase-call-btn" place="top" style={{zIndex: '9998'}}>
                    버튼을 누르면 투표를 진행할 수 있습니다.
                </Tooltip>
            }
            {roomCtx.roomPhase === RoomPhase.CALLING &&
                <Tooltip anchorSelect=".phase-start-btn" place="top" style={{zIndex: '9998'}}>
                    과반이상 입장하거나, 방장의 요청에 의해 투표를 시작할 수 있습니다.
                </Tooltip>
            }
            {isTodayPickTooltipShow &&
                <Tooltip anchorSelect=".phase-call-btn"
                         place="bottom-start"
                         isOpen={true}
                         style={{zIndex: 10}}
                         clickable={true}>
                    <div className={'votingEndTooltip'} onClick={todayPickPopupHandler}>
                        <span className={'votingEndTooltip-title'}>
                            오늘 미식 투표는 종료되었습니다.
                        </span>
                        <span className={'votingEndTooltip-btn'}>
                            <FontAwesomeIcon icon={faEye} style={{marginRight: "5px"}}/>
                            <small>결과</small>
                        </span>
                    </div>
                </Tooltip>
            }


        </>
    )
}

export default RoomConsole;