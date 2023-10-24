import './RoomHeader.css';
import {useContext, useState} from "react";
import RoomConsole from "./RoomConsole";
import Modal from "../UI/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import roomContext from "../../store/room-context";
import axios from "axios";
import CommonUtils from "../../utils/CommonUtils";
import RoomPhase from "../../types/RoomPhase";
import SimpleUpdateForm from "../UI/SimpleUpdateForm";
import {IUser} from "../../types/IUser";

interface props {
    isConsoleActive: boolean;
    todayPickPopupFlag?: boolean;
    todayPickPopupFlagHandler?: (popupFlag: boolean) => void
}

const RoomHeader = (props: props) => {
    const roomCtx = useContext(roomContext);

    const [isTitleUpdateModalPopped, setIsTitleUpdateModalPopped] = useState(false);
    const [currentRoomName, setCurrentRoomName] = useState(roomCtx.roomInfo.name);

    const user = JSON.parse(sessionStorage.getItem('user')) as IUser;
    const isManager = roomCtx.roomInfo.managerId === user.id;

    const nameUpdatePopUpHandler = async () => {
        setIsTitleUpdateModalPopped(true);
    }

    const modalCloseHandler = () => {
        setIsTitleUpdateModalPopped(false);
    }

    const nameUpdateHandler = async (newRoomName: string) => {
        if (newRoomName.length === 0) {
            alert("변경할 이름을 입력해주세요.");
            return;
        }
        newRoomName = CommonUtils.filterHtmlTags(newRoomName)
        const roomId = roomCtx.roomInfo.id;
        const {data: result} = await axios.post(`/api/room/modifyRoomName/${roomId}/${newRoomName}`);
        if (result === 0) {
            alert("변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
            document.location.reload();
        }
        setCurrentRoomName(newRoomName);
        setIsTitleUpdateModalPopped(false);
    }

    const roomDeleteHandler = async () => {
        const targetRoomId = roomCtx.roomInfo.id;
        const {data: result} = await axios.delete(`/api/room/${targetRoomId}`);
        if (result === -1) {
            alert("현재 진행 중인 투표가 있습니다. 해당 투표 종료 후 시도해주세요.");
            return;
        } else if (result === 0) {
            alert("방을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.")
        }
        document.location.reload();
    }

    const linkClipHandler = () => {

    }

    return (
        <>
            <div className='row'>
                <div className='col-md-5 mt-2'>
                    <div data-room-id={roomCtx.roomInfo.id}>
                        <span className='room-title'> # {currentRoomName} </span>
                        <span className='room-code'>({roomCtx.roomInfo?.invitationCode})</span>
                        {roomCtx.roomPhase === RoomPhase.DEFAULT &&
                            <>
                                {isManager &&
                                    <>
                                        <button className={'roomManagementBtn roomTitleUpdateBtn'}
                                                onClick={nameUpdatePopUpHandler}>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </button>
                                        <button className={'roomManagementBtn roomDeleteBtn'}
                                                onClick={roomDeleteHandler}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                    </>
                                }
                                <button className={'roomManagementBtn linkClipBtn'}
                                        onClick={linkClipHandler}>
                                    <FontAwesomeIcon icon={faLink}/>
                                </button>
                            </>
                        }
                    </div>
                </div>
                {props.isConsoleActive &&
                    <div className={"col mt-2 text-end"}>
                        <RoomConsole todayPickPopupFlag={props.todayPickPopupFlag}
                                     todayPickPopupFlagHandler={props.todayPickPopupFlagHandler}/>
                    </div>
                }
            </div>
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
