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
import {IUser} from "../../types/IUser";

const Room = () => {
    const roomCtx = useContext(roomContext);
    const websocketAPIs = useContext(websocketContext);

    const [isTodayPickElected, setIsTodayPickElected] = useState(false)
    const [todayPickPopupFlag, setTodayPickPopupFlag] = useState(!_.isEmpty(roomCtx.roomInfo.todayPick));

    const voteFinishingModalCloseHandler = () => {
        if (roomCtx.votingStatus !== VotingStatus.GATHERING) {
            roomCtx.changeVotingStatus(VotingStatus.GATHERING);
        }
        if (roomCtx.roomPhase !== RoomPhase.DEFAULT) {
            roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
        }
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
        const payloadData = JSON.parse(payload.body);
        const sessionUser = CommonUtils.getUserFromSession();
        const isMyMessage = sessionUser.id === payloadData.senderId;

        switch (payloadData.status) {
            case 'CREATE':
                websocketAPIs.seat();
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                break;
            case 'SEATING':
                const seatingUsers = payloadData.data as IUser[];
                roomCtx.changeRoomPhase(RoomPhase.CALLING);
                roomCtx.setVotingGourmets(seatingUsers);
                if (!isMyMessage) {
                    const filteredList = seatingUsers.filter(user => user.id !== sessionUser.id);
                    setTimeout(() => {
                        CommonUtils.toaster(`${payloadData.senderName}님이 입장하셨습니다.`, 'top');
                    }, 500);
                }
                break;
            case 'CANCEL':
                CommonUtils.toaster('투표가 취소되었습니다.', 'top', "info");
                roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
                roomCtx.setVotingGourmets([]);
                break;
            case 'READY':
                CommonUtils.toaster('투표를 시작할 수 있습니다!', 'top', "info");
                roomCtx.changeRoomPhase(RoomPhase.READY);
                break;
            case 'START':
                await Swal.fire({
                    title: '잠시 후 투표가 시작됩니다',
                    text: '방장이 투표를 시작했습니다!',
                    timer: 2000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
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
            case 'RESET':
                setTodayPickPopupFlag(false);
                setIsTodayPickElected(false);
                roomCtx.setTodayPick({} as IMenu);
                CommonUtils.toaster("투표 결과가 초기화됐습니다.", 'top', 'info');
                break
            case 'EXILE':
                await Swal.fire({title: "방이 삭제되었습니다.", icon: 'warning'});
                document.location.href = "/";
                break
            case 'DISCONNECT':
                const users = payloadData.data;
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

    const onPrivateMessageHandler = async (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case 'PROMOTION' :
                CommonUtils.toaster("방장이 나갔습니다. 권한을 위임받습니다.", "top", "info")

                roomCtx.setCallerFlag(true);
                break;
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
                    <TodayPick modalCloseHandler={voteFinishingModalCloseHandler}/>
                </Modal>
            }
        </>
    );
}

export default Room;