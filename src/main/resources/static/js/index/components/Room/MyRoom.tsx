import "./MyRoom.css";
import {IRoom} from "../../types/IRoom";
import {faStar, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MyRoomContainer from "./MyRoomContainer";
import {useContext} from "react";
import roomContext from "../../store/room-context";
import {IUser} from "../../types/IUser";
import axios from "axios";

type props = {
    myRoom: IRoom,
    userId: number,
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
            alert("방장은 즐겨찾기를 해제할 수 없습니다.");
            return;
        }
        const targetRoomId = props.myRoom.id
        const user = JSON.parse(sessionStorage.getItem('user')) as IUser;
        const {data: result} = await axios.delete(`/api/room/exit/${user.id}/${targetRoomId}`);
        if (result === 0) {
            alert("방을 나가지 못했습니다. 잠시 후 다시 시도해주세요.");
            document.location.reload();
            return;
        }
        console.log("방삭제성공")
    }

    return (
        <MyRoomContainer>
            <div className={'roomInfo'}
                 data-room-id={props.myRoom.id}
                 onClick={enterRoomHandler}>
                <div className={'myRoomTitle'}>
                    {props.myRoom.name}
                    <button className={'roomManagementBtn roomLikeBtn'} onClick={roomLikeHandler}>
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