import {useContext, useEffect, useState} from "react";
import RoomHeader from "./RoomHeader";
import MenuList from "../Menu/MenuList";
import './Room.css';
import websocketContext from "../../store/websocket-context";
import Modal from "../UI/Modal";
import roomContext from "../../store/room-context";
import MenuUpdateForm from "../Menu/MenuUpdateForm";
import RoomContainer from "./RoomContainer";
import RoomPhase from "../../types/RoomPhase";
import VotingStatus from "../../types/VotingStatus";
import {IMenu} from "../../types/IMenu";
import TodayPick from "../Menu/TodayPick";
import * as _ from "lodash";
import {IUser} from "../../types/IUser";
import roomPhase from "../../types/RoomPhase";

const Room = () => {
    const roomCtx = useContext(roomContext);
    const websocketAPIs = useContext(websocketContext);

    const [isTodayPickElected, setIsTodayPickElected] = useState(false)
    const [todayPickPopupFlag, setTodayPickPopupFlag] = useState(!_.isEmpty(roomCtx.roomInfo.todayPick));

    const voteFinishingModalCloseHandler = () => {
        roomCtx.changeVotingStatus(VotingStatus.GATHERING);
        roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
        setIsTodayPickElected(false);
        setTodayPickPopupFlag(false);
    }

    const voteFinishingModalPopHandler = (isTodayPickElected: boolean) => {
        setIsTodayPickElected(isTodayPickElected);
    }

    const todayPickPopupFlagHandler = (popupFlag: boolean) => {
        setTodayPickPopupFlag(popupFlag)
    }

    const onMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "CREATE":
                websocketAPIs.seat();
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                break;
            case 'SEATING':
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                roomCtx.setVotingGourmets(payloadData.data);
                break;
            case 'CANCEL':
                roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
                roomCtx.setVotingGourmets([]);
                break;
            case 'READY':
                roomCtx.changeRoomPhase(RoomPhase.READY);
                break;
            case 'START':
                websocketAPIs.start();
                roomCtx.changeRoomPhase(RoomPhase.STARTING);
                roomCtx.changeVotingStatus(VotingStatus.VOTING);
                break
            case 'FINISH':
                const votingResult = payloadData.data as IMenu;
                roomCtx.setTodayPick(votingResult);
                roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
                roomCtx.setVotingGourmets([]);
                voteFinishingModalPopHandler(true);
                break;
            case 'EXILE':
                alert("방이 삭제되었습니다. 메인 화면으로 돌아갑니다.")
                document.location.reload();
                break
            case 'DISCONNECT':
                // 임시로직
                const users = payloadData.data;
                const currentUserCnt = users.length;
                if (currentUserCnt < 2) {
                    if (roomCtx.roomPhase === RoomPhase.STARTING) roomCtx.changeRoomPhase(RoomPhase.CALLING);
                }
                roomCtx.setVotingGourmets(users);
                break
            case 'FAIL':
                alert("결과를 집계할 수 없습니다. 메인 화면으로 돌아갑니다.");
                document.location.reload();
                break;
            default :
                break;
        }
    }

    const onPrivateMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case 'SYNC':
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                roomCtx.setVotingGourmets(payloadData.data);
                break
            default :
                break;
        }
    }

    useEffect(() => {
        const sessionInfo = {
            topic: 'voting',
            roomId: roomCtx.roomInfo.id,
            user: JSON.parse(sessionStorage.getItem('user')),
        }

        if (!sessionInfo.user) {
            alert("인증 정보를 받아올 수 없습니다. 다시 시도해주세요.")
            document.location.reload();
        }
        websocketAPIs.register(sessionInfo, onMessageHandler, onPrivateMessageHandler);

        return () => {
            websocketAPIs.disconnect();
        };
    }, []);


    return (
        <>
            <RoomContainer>
                {roomCtx.roomInfo && (roomCtx.roomPhase !== RoomPhase.UPDATING) &&
                    <>
                        <RoomHeader room={roomCtx.roomInfo}
                                    isConsoleActive={true}
                                    todayPickPopupFlag={todayPickPopupFlag}
                                    todayPickPopupFlagHandler={todayPickPopupFlagHandler}
                        />
                        <MenuList room={roomCtx.roomInfo}/>
                    </>
                }
                {roomCtx.roomInfo && (roomCtx.roomPhase === RoomPhase.UPDATING) &&
                    <>
                        <RoomHeader room={roomCtx.roomInfo} isConsoleActive={false}/>
                        <MenuUpdateForm/>
                    </>
                }
            </RoomContainer>
            {(todayPickPopupFlag || isTodayPickElected) &&
                <Modal onClose={voteFinishingModalCloseHandler} top={"10%"}>
                    <TodayPick menu={roomCtx.roomInfo.todayPick} modalCloseHandler={voteFinishingModalCloseHandler}/>
                </Modal>
            }
        </>
    )
        ;
}

export default Room;