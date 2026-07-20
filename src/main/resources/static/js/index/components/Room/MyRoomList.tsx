import "./MyRoomList.css"
import MyRoom from "./MyRoom";
import {IRoom} from "../../types/IRoom";
import EmptyBox from "../UI/EmptyBox";
import MyRoomContainer from "./MyRoomContainer";
import axios from "axios";
import {useContext} from "react";
import roomContext from "../../store/room-context";
import CommonUtils from "../../utils/CommonUtils";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

type props = {
    myRoomList: IRoom[],
    myRoomDeleteHandler: (roomId: number) => void,
}

const MyRoomList = (props: props) => {
    const roomCtx = useContext(roomContext);
    const navigate = useNavigate();
    const user = CommonUtils.getUserFromSession();

    const createRoomHandler = async () => {
        if (props.myRoomList.length > 10) {
            await Swal.fire({title: '투표방은 최대 10개까지 개설할 수 있습니다.', icon: 'warning'});
            return;
        }
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const {data: invitationCode} = await axios.post("/api/room/make", {
            name: `냉정한 미식방 ${randomNumber}`,
            managerId: user.id
        });
        if (invitationCode) {
            const room = await roomCtx.enterRoom(invitationCode);
            if (room) navigate(`/rooms/${room.invitationCode}`);
            await CommonUtils.toaster('방이 생성되었습니다.\n 메뉴를 등록해주세요!', 'top');
        }
    }

    return (
        <section className={'myRoomSection'} aria-labelledby={'myRoomSectionTitle'}>
            <div className={'myRoomSectionHeader'}>
                <span className={'myRoomSectionLine'} aria-hidden={'true'}></span>
                <h2 id={'myRoomSectionTitle'}>내가 참여 중인 모임</h2>
                <span className={'myRoomSectionLine'} aria-hidden={'true'}></span>
            </div>
            <div className={'row myRoomGrid'}>
                {props.myRoomList.map(myRoom => {
                    return <MyRoom key={myRoom.id}
                                   myRoom={myRoom}
                                   myRoomDeleteHandler={props.myRoomDeleteHandler}
                                   userId={user.id}/>
                })}
                <MyRoomContainer>
                    <EmptyBox clickHandler={createRoomHandler} minHeight={"100%"} caption={"투표방 새로 만들기"}/>
                </MyRoomContainer>
            </div>
        </section>

    )
}

export default MyRoomList;
