import {IRoom} from "../../types/IRoom";
import './RoomHeader.css';
import {useContext, useRef, useState} from "react";
import RoomConsole from "./RoomConsole";
import Modal from "../UI/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import roomContext from "../../store/room-context";
import axios from "axios";
import CommonUtils from "../../utils/websocket/CommonUtils";

interface props {
    room: IRoom;
    isConsoleActive: boolean;
}

const RoomHeader = (props: props) => {
    const roomCtx = useContext(roomContext);

    const [isTitleUpdateModalPopped, setIsTitleUpdateModalPopped] = useState(false);
    const [currentRoomName, setCurrentRoomName] = useState(roomCtx.roomInfo.name);
    const roomNameInputRef = useRef(null);

    const nameUpdatePopUpHandler = async () => {
        setIsTitleUpdateModalPopped(true);
    }

    const modalCloseHandler = () => {
        setIsTitleUpdateModalPopped(false);
    }

    const nameUpdateHandler = async () => {
        let newRoomName = roomNameInputRef.current.value.trim();
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

    return (
        <>
            <div className='row'>
                <div className='col-md-5 mt-2'>
                    <div data-room-id={props.room?.id}>
                        <span className='room-title'> # {currentRoomName} </span>
                        <span className='room-code'>({props.room?.invitationCode})</span>
                        {roomCtx.roomPhase === 'default' &&
                            <>
                                <button className={'roomTitleUpdateBtn'} onClick={nameUpdatePopUpHandler}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </button>
                                <button className={'roomDeleteBtn'} onClick={roomDeleteHandler}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </>
                        }
                    </div>
                </div>
                {props.isConsoleActive &&
                    <div className={"col mt-2 text-end"}>
                        <RoomConsole/>
                    </div>
                }
            </div>
            {isTitleUpdateModalPopped &&
                <Modal onClose={modalCloseHandler} height={"140px"}>
                    <div className="titleUpdateForm row">
                        <div className={'headline'}>변경할 방 이름을 입력해주세요.</div>
                        <div className={'col-md-9 mb-2'}>
                            <input type="text"
                                   className="form-control"
                                   id="titleUpdateInput"
                                   ref={roomNameInputRef}
                                   placeholder={props.room.name}/>
                        </div>
                        <div className={'col-md-3'}>
                            <button className="btn btn-outline-primary w-100"
                                    onClick={nameUpdateHandler}>
                                수 정 하 기
                            </button>
                        </div>
                    </div>
                </Modal>
            }
        </>
    );
}

export default RoomHeader;
