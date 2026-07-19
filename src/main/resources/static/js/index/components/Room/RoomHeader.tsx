import './RoomHeader.css';
import {useContext, useState} from "react";
import RoomConsole from "./RoomConsole";
import Modal from "../UI/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faPen, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import roomContext from "../../store/room-context";
import axios from "axios";
import CommonUtils from "../../utils/CommonUtils";
import RoomPhase from "../../types/RoomPhase";
import SimpleUpdateForm from "../UI/SimpleUpdateForm";
import {IUser} from "../../types/IUser";
import Swal from "sweetalert2";
import * as _ from "lodash";
import Gourmet from "../VotingTable/Gourmet";
import {useNavigate} from "react-router-dom";

interface props {
    isConsoleActive: boolean;
    todayPickPopupFlag?: boolean;
    todayPickPopupFlagHandler?: (popupFlag: boolean) => void
}

const RoomHeader = (props: props) => {
    const roomCtx = useContext(roomContext);
    const navigate = useNavigate();

    const [isTitleUpdateModalPopped, setIsTitleUpdateModalPopped] = useState(false);
    const [currentRoomName, setCurrentRoomName] = useState(roomCtx.roomInfo.name);

    const user = CommonUtils.getUserFromSession();
    const isManager = roomCtx.roomInfo.managerId === user.id;
    const gourmetSeats = [0, 1, 2, 3, 4];

    const nameUpdatePopUpHandler = async () => {
        setIsTitleUpdateModalPopped(true);
    }

    const modalCloseHandler = () => {
        setIsTitleUpdateModalPopped(false);
    }

    const nameUpdateHandler = async (newRoomName: string) => {
        newRoomName = CommonUtils.filterHtmlTags(newRoomName.trim());
        if (newRoomName.length === 0) {
            await CommonUtils.toaster('변경할 이름을 입력해주세요.', 'top', 'warning');
            return;
        }

        if (newRoomName.length > 10) {
            await CommonUtils.toaster('허용되지 않은 문자가 포함됐습니다.', 'top', 'warning');
            return;
        }

        const roomId = roomCtx.roomInfo.id;
        const {data: result} = await axios.post('/api/room/modifyRoomName', {
            id: roomId,
            name: newRoomName,
        });
        if (result === 0) {
            alert("변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
            document.location.reload();
        }
        setCurrentRoomName(newRoomName);
        setIsTitleUpdateModalPopped(false);
    }

    const roomDeleteHandler = async () => {
        const confirmResult = await CommonUtils.confirm('방을 삭제하시겠습니까?', '메뉴 정보도 함께 삭제되며, 복구할 수 없습니다.', '삭 제');
        if (!confirmResult.isConfirmed) return;

        const targetRoomId = roomCtx.roomInfo.id;
        const {data: result} = await axios.delete(`/api/room/${targetRoomId}`);
        if (result === -1) {
            await Swal.fire({
                title: '방을 삭제할 수 없습니다.',
                text: '현재 진행 중인 투표가 있습니다.',
                icon: 'info'
            });
            return;
        } else if (result === 0) {
            alert("방을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.")
        }
    }

    const linkClipHandler = _.debounce(() => {
        CommonUtils.copyInvitationCode(roomCtx.roomInfo.invitationCode);
    }, 200);

    const menuAddHandler = async () => {
        const {data: totalCount} = await axios.get(`/api/room/menuCount/${roomCtx.roomInfo.id}`);
        if (Number(totalCount) > 15) {
            await Swal.fire({title: '메뉴는 15개 이상 등록할 수 없습니다.', icon: 'warning'});
            return;
        }
        navigate(`/rooms/${roomCtx.roomInfo.invitationCode}/menus/new`);
    }

    return (
        <>
            <header className='roomHeader card'>
                <div className='roomHeading' data-room-id={roomCtx.roomInfo.id}>
                    <div className='roomHeadingText'>
                        <div className={'roomTitleRow'}>
                            <h1 className='room-title'>{CommonUtils.bringBackHtmlTags(currentRoomName)}</h1>
                            <button className={'roomTitleLinkBtn'}
                                    title={'초대 코드 복사'} aria-label={'초대 코드 복사'}
                                    onClick={linkClipHandler}>
                                <FontAwesomeIcon icon={faLink}/>
                            </button>
                        </div>
                        <span className='room-code'>초대 코드 · {roomCtx.roomInfo?.invitationCode}</span>
                        {roomCtx.roomPhase !== RoomPhase.DEFAULT && roomCtx.roomPhase !== RoomPhase.UPDATING &&
                            <div className={'roomTitleGourmets'} aria-label={'투표 참여자'}>
                                {gourmetSeats.map((seat, index) =>
                                    <Gourmet key={seat}
                                             isActive={index < roomCtx.votingGourmets?.length}
                                             nickname={roomCtx.votingGourmets[index]?.nickname}/>
                                )}
                            </div>
                        }
                    </div>
                    <div className='roomManagementActions'>
                        {roomCtx.roomPhase === RoomPhase.DEFAULT &&
                            <>
                                {isManager &&
                                    <>
                                        <button className={'gp-icon-button roomManagementBtn roomTitleUpdateBtn'}
                                                title={'방 이름 수정'} aria-label={'방 이름 수정'}
                                                onClick={nameUpdatePopUpHandler}>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </button>
                                        <button className={'gp-icon-button roomManagementBtn roomDeleteBtn'}
                                                title={'방 삭제'} aria-label={'방 삭제'}
                                                onClick={roomDeleteHandler}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                    </>
                                }
                            </>
                        }
                        {roomCtx.roomPhase === RoomPhase.DEFAULT &&
                            <>
                                <span className={'roomManagementDivider'} aria-hidden={'true'}></span>
                                <button className={'gp-icon-button roomManagementBtn menuAddHeaderBtn'}
                                        title={'메뉴 추가'} aria-label={'메뉴 추가'}
                                        onClick={menuAddHandler}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                    <span>메뉴 추가</span>
                                </button>
                            </>
                        }
                    </div>
                </div>
                {props.isConsoleActive &&
                    <div className={"roomConsoleWrapper"}>
                        <RoomConsole todayPickPopupFlag={props.todayPickPopupFlag}
                                     todayPickPopupFlagHandler={props.todayPickPopupFlagHandler}/>
                    </div>
                }
            </header>
            {isTitleUpdateModalPopped &&
                <Modal onClose={modalCloseHandler} height={"140px"}>
                    <SimpleUpdateForm title={'변경할 방 이름을 입력해주세요.'}
                                      placeholder={roomCtx.roomInfo.name}
                                      updateHandler={nameUpdateHandler}/>
                </Modal>
            }
        </>
    );
}

export default RoomHeader;
