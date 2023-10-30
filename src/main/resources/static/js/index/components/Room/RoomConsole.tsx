import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faEye} from "@fortawesome/free-solid-svg-icons";
import {Tooltip} from "react-tooltip";
import {useContext, useEffect, useState} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";
import VotingStatus from "../../types/VotingStatus";
import * as _ from "lodash";
import CommonUtils from "../../utils/CommonUtils";
import Swal from "sweetalert2";

type props = {
    todayPickPopupFlag: boolean;
    todayPickPopupFlagHandler: (popupFlag: boolean) => void
}

const RoomConsole = (props: props) => {
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext);
    const [isPhaseCallTooltipOpen, setIsPhaseCallTooltipOpen] = useState(true);
    const [isPhaseStartTooltipOpen, setIsPhaseStartTooltipOpen] = useState(true);
    const isTodayPickTooltipShow = (roomCtx.roomPhase === RoomPhase.DEFAULT
        && !_.isEmpty(roomCtx.roomInfo.todayPick)
        && !props.todayPickPopupFlag
    );

    const gourmetCallHandler = () => {
        websocketAPIs.create();
        roomCtx.setCallerFlag(true);

        Swal.fire({
            title: '투표세션이 생성됐습니다',
            text: '냉정한 미식가들을 불러주세요',
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            didClose() {
                CommonUtils.copyInvitationCode(roomCtx.roomInfo.invitationCode);
            }
        });
    }

    const gourmetVotingHandler = () => {
        websocketAPIs.boot();
    }

    const cancelVotingHandler = () => {
        roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
        websocketAPIs.cancel();
    }

    const isGourmetCallPossible = roomCtx.roomPhase === RoomPhase.DEFAULT
        && !roomCtx.isMenuListEmpty
        && _.isEmpty(roomCtx.roomInfo.todayPick);


    const isVoteStartingPossible = (roomCtx.roomPhase === RoomPhase.CALLING && roomCtx.callerFlag);

    const isVotingCancelPossible = roomCtx.roomPhase !== RoomPhase.DEFAULT
        && roomCtx.votingStatus === VotingStatus.GATHERING
        && roomCtx.callerFlag;

    const exitHandler = () => {
        document.location.href = "/";
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
                {isVotingCancelPossible &&
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
            {roomCtx.roomPhase === RoomPhase.DEFAULT && !roomCtx.isMenuListEmpty && _.isEmpty(roomCtx.roomInfo.todayPick) &&
                <Tooltip anchorSelect=".phase-call-btn"
                         place="bottom"
                         isOpen={isPhaseCallTooltipOpen}
                         afterShow={() => setTimeout(() => setIsPhaseCallTooltipOpen(false), 4000)}
                         style={{zIndex: '1021'}}>
                    투표 세션을 생성하고, 투표를 진행할 수 있게 됩니다.
                </Tooltip>
            }
            {roomCtx.roomPhase === RoomPhase.CALLING &&
                <Tooltip anchorSelect=".phase-start-btn"
                         place="bottom"
                         isOpen={isPhaseStartTooltipOpen}
                         afterShow={() => setTimeout(() => setIsPhaseStartTooltipOpen(false), 4000)}
                         style={{zIndex: '1021'}}>
                    방장의 요청으로 투표를 시작할 수 있습니다.
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