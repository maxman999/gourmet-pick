import './Room.css';
import {useContext, useEffect, useState} from "react";
import RoomHeader from "./RoomHeader";
import MenuList from "../Menu/MenuList";
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
import Swal from 'sweetalert2'
import CommonUtils from "../../utils/CommonUtils";

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

    const onMessageHandler = async (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        const user = CommonUtils.getUserFromSession();
        switch (payloadData.status) {
            case 'CREATE':
                websocketAPIs.seat();
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                break;
            case 'SEATING':
                const seatingUsers = payloadData.data as string[];
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                roomCtx.setVotingGourmets(seatingUsers);
                if (user.id !== payloadData.senderId) {
                    CommonUtils.toaster(`${seatingUsers[seatingUsers.length - 1]}님이 입장하셨습니다.`, 'top');
                }
                break;
            case 'CANCEL':
                roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
                roomCtx.setVotingGourmets([]);
                break;
            case 'READY':
                roomCtx.changeRoomPhase(RoomPhase.READY);
                break;
            case 'START':
                await Swal.fire({
                    title: '잠시 후 투표가 시작됩니다.',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                })
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
                await Swal.fire({title: "방이 삭제되었습니다.", icon: 'warning'});
                document.location.reload();
                break
            case 'DISCONNECT':
                const users = payloadData.data;
                const currentUserCnt = users.length;
                if (currentUserCnt < 2) {
                    if (roomCtx.roomPhase === RoomPhase.STARTING) roomCtx.changeRoomPhase(RoomPhase.CALLING);
                }
                roomCtx.setVotingGourmets(users);
                break
            case 'FAIL':
                await Swal.fire({
                    title: '투표 결과를 집계할 수 없습니다',
                    text: '아무도 투표하지 않은 것으로 보입니다.',
                    icon: 'warning',
                });
                roomCtx.changeVotingStatus(VotingStatus.GATHERING);
                roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
                break;
            default :
                break;
        }
    }

    const onPrivateMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            default :
                break;
        }
    }

    useEffect(() => {
        const sessionInfo = {
            topic: 'voting',
            roomId: roomCtx.roomInfo.id,
            user: CommonUtils.getUserFromSession(),
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
                        <RoomHeader isConsoleActive={true}
                                    todayPickPopupFlag={todayPickPopupFlag}
                                    todayPickPopupFlagHandler={todayPickPopupFlagHandler}
                        />
                        <MenuList/>
                    </>
                }
                {roomCtx.roomInfo && (roomCtx.roomPhase === RoomPhase.UPDATING) &&
                    <>
                        <RoomHeader isConsoleActive={false}/>
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
    );
}

export default Room;