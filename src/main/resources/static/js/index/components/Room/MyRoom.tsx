import "./MyRoom.css";
import {IRoom} from "../../types/IRoom";
import {faStar, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MyRoomContainer from "./MyRoomContainer";
import {useContext} from "react";
import roomContext from "../../store/room-context";
import {IUser} from "../../types/IUser";
import axios from "axios";
import Swal from 'sweetalert2'
import CommonUtils from "../../utils/CommonUtils";


type props = {
    myRoom: IRoom,
    userId: number,
    myRoomDeleteHandler: (roomId: number) => void,
}

const MyRoom = (props: props) => {
    const roomCtx = useContext(roomContext);
    const isManager = props.myRoom.managerId === props.userId;

    const enterRoomHandler = () => {
        roomCtx.enterRoom(props.myRoom.invitationCode)
    }

    const roomLikeHandler = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isManager) {
            await Swal.fire({title: '방장은 즐겨찾기를 해제할 수 없습니다.', icon: 'warning'});
            return;
        }
        const confirmResult = await CommonUtils.confirm(
            '내방 목록에서 제거됩니다',
            '목록에서 제거된 방은 코드가 없으면 들어갈 수 없습니다.',
            '삭 제'
        );
        if (!confirmResult.isConfirmed) return;
        const targetRoomId = props.myRoom.id
        const user = CommonUtils.getUserFromSession();
        const {data: result} = await axios.delete(`/api/room/exit/${user.id}/${targetRoomId}`);
        if (result === 0) {
            Swal.fire({title: '삭제하지 못했습니다. 잠시 후 다시 시도해주세요.'});
            document.location.reload();
            return;
        }

        CommonUtils.toaster('내방목록에서 제거되었습니다.', 'center');
        props.myRoomDeleteHandler(targetRoomId);
    }

    return (
        <MyRoomContainer>
            <div className={'roomInfo'}
                 data-room-id={props.myRoom.id}
                 onClick={enterRoomHandler}>
                <div className={'myRoomTitle'}>
                    {props.myRoom.name}
                    <button className={'roomLikeBtn'} onClick={roomLikeHandler}>
                        <FontAwesomeIcon icon={faStar} style={isManager && {color: 'cornflowerblue'}}/>
                    </button>
                </div>
                <div className={'myRoomCode'}>
                    ({props.myRoom.invitationCode})
                </div>
                <hr/>
                <div className={'myRoomSessionInfo'}>
                    {props.myRoom.hasVotingSession &&
                        <>
                            <div className={"mb-2"}>진행 가능한 투표가 있습니다! {props.myRoom.hasVotingSession}</div>
                            <div className={"float-end"}>
                                <FontAwesomeIcon icon={faUser}
                                                 style={{color: "darkseagreen"}}/> x {props.myRoom.currentVotingUserCnt}
                            </div>
                        </>
                    }
                    {!props.myRoom.hasVotingSession &&
                        <>
                            <div className={"mb-2"}>현재 진행중인 투표가 없습니다. {props.myRoom.hasVotingSession}</div>
                        </>
                    }
                </div>
            </div>
        </MyRoomContainer>
    )
}

export default MyRoom;