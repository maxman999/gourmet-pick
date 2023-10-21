import "./MyRoom.css";
import {IRoom} from "../../types/IRoom";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MyRoomContainer from "./MyRoomContainer";
import {useContext} from "react";
import roomContext from "../../store/room-context";

type props = {
    myRoom: IRoom
}

const MyRoom = (props: props) => {
    const roomCtx = useContext(roomContext);

    const enterRoomHandler = () => {
        roomCtx.enterRoom(props.myRoom.invitationCode)
    }

    return (
        <MyRoomContainer>
            <div className={'roomInfo'}
                 data-room-id={props.myRoom.id}
                 onClick={enterRoomHandler}>
                <div className={'myRoomTitle'}>
                    {props.myRoom.name}
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
                            <div className={"float-end"}>
                                <FontAwesomeIcon icon={faUser}
                                                 style={{color: "gray"}}/> x{props.myRoom.currentVotingUserCnt}
                            </div>
                        </>
                    }
                </div>
            </div>
        </MyRoomContainer>
    )
}

export default MyRoom;