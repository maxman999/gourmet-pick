import "./MyRoomList.css"
import MyRoom from "./MyRoom";
import {IRoom} from "../../types/IRoom";
import EmptyBox from "../UI/EmptyBox";
import MyRoomContainer from "./MyRoomContainer";
import axios from "axios";
import {useContext, useState} from "react";
import roomContext from "../../store/room-context";
import Modal from "../UI/Modal";
import {IUser} from "../../types/IUser";

type props = {
    myRoomList: IRoom[]
}

const MyRoomList = (props: props) => {
    const roomCtx = useContext(roomContext);
    const user = JSON.parse(sessionStorage.getItem('user')) as IUser;

    const createRoomHandler = async () => {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const {data: invitationCode} = await axios.post("/api/room/make", {
            name: `냉정한 미식방 ${randomNumber}`,
            managerId: user.id
        });
        if (invitationCode) {
            roomCtx.enterRoom(invitationCode);
        }
    }

    return (
        <>
            <div className={'row mt-3'}>
                {props.myRoomList.map(myRoom => {
                    return <MyRoom key={myRoom.id} myRoom={myRoom} userId={user.id}/>
                })}
                <MyRoomContainer>
                    <EmptyBox clickHandler={createRoomHandler} minHeight={"100%"} caption={"투표방 새로 만들기"}/>
                </MyRoomContainer>
            </div>
        </>

    )
}

export default MyRoomList;