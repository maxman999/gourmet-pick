import "./MyRoomList.css"
import MyRoom from "./MyRoom";
import {IRoom} from "../../interfaces/IRoom";
import EmptyBox from "../UI/EmptyBox";
import MyRoomContainer from "./MyRoomContainer";
import axios from "axios";
import {useContext, useState} from "react";
import roomContext from "../../store/room-context";
import Modal from "../UI/Modal";

type props = {
    myRoomList: IRoom[]
}

const MyRoomList = (props: props) => {
    const roomCtx = useContext(roomContext);
    const [roomName, setRoomName] = useState(null);

    const createRoomHandler = async () => {
        const randomNumber = Math.floor(Math.random() * 99) + 1;
        const {data: invitationCode} = await axios.post("/api/room/make", {name: `냉정한 미식방 ${randomNumber}`});
        if (invitationCode) {
            roomCtx.enterRoom(invitationCode);
        }
    }

    return (
        <>
            <div className={'row mt-3'}>
                {props.myRoomList.map(myRoom => {
                    return <MyRoom key={myRoom.id} myRoom={myRoom}/>
                })}
                <MyRoomContainer>
                    <EmptyBox clickHandler={createRoomHandler} minHeight={"100%"} caption={"투표방 새로 만들기"}/>
                </MyRoomContainer>
            </div>
        </>

    )
}

export default MyRoomList;