import EntranceInput from "./EntranceInput";
import {useContext, useEffect, useState} from "react";
import {IRoom} from "../../interfaces/IRoom";
import RoomConfirm from "./RoomConfirm";
import MenuList from "../Menu/MenuList";
import './Room.css';
import websocketContext from "../../store/websocket-context";
import Modal from "../UI/Modal";
import * as React from "react";
import roomContext from "../../store/room-context";

const Room = () => {
    const roomCtx = useContext(roomContext);
    const websocketAPIs = useContext(websocketContext);
    const sessionInfo = {
        topic: 'voting',
        roomId: 'qwer1234',
        userId: 'kjy55&' + Math.random(),
    }

    const [room, setRoom] = useState<IRoom | null>();
    const [gourmet, setGourmet] = useState(0);
    const [isModalPopped, setIsModalPopped] = useState(false)
    const [todayPick, setTodayPick] = useState('');

    const entranceHandler = (room: IRoom) => {
        setRoom(room);
        websocketAPIs.sync();
    }

    const modalCloseHandler = () => {
        setIsModalPopped(false);
    }

    const modalPopHandler = (isModalPopped: boolean) => {
        setIsModalPopped(isModalPopped)
    }

    const onMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case 'JOIN':
                setGourmet(Number(payloadData.data));
                break;
            case 'READY':
                roomCtx.changeRoomPhase('ready');
                break;
            case 'START':
                roomCtx.changeRoomPhase('starting');
                roomCtx.changeVotingStatus('voting');
                websocketAPIs.start();
                break
            case 'END':
                setTodayPick([`${payloadData.data}`][0]);
                setGourmet(0);
                modalPopHandler(true);
                break;
            case 'DISCONNECT':
                setGourmet(Number(payloadData.data));
                break
            default :
                break;
        }
    }

    const onPrivateMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case 'SYNC':
                if (Number(payloadData.data) >= 1) {
                    roomCtx.changeRoomPhase('calling');
                    setGourmet(Number(payloadData.data));
                }
                break
            default :
                break;
        }
    }

    useEffect(() => {
        websocketAPIs.register(sessionInfo, onMessageHandler, onPrivateMessageHandler);
        return () => {
            websocketAPIs.disconnect();
        };
    }, []);

    useEffect(() => {
        if (roomCtx.votingStatus === 'closing') {
            websocketAPIs.finishVoting();
            roomCtx.changeVotingStatus('gathering');
            roomCtx.changeRoomPhase('default');
        }
    }, [roomCtx.votingStatus]);

    return (
        <>
            <EntranceInput roomPhase={roomCtx.roomPhase} onEntrance={entranceHandler}/>
            {room &&
                <div
                    className={`room-container ${roomCtx.roomPhase === 'default' ? '' : 'room-buster'} row card mt-3 p-3`}>
                    <RoomConfirm room={room}/>
                    <MenuList room={room} gourmet={gourmet}/>
                </div>
            }
            {isModalPopped &&
                <Modal onClose={modalCloseHandler}>
                    <div>{todayPick}</div>
                </Modal>
            }
        </>
    );
}

export default Room;