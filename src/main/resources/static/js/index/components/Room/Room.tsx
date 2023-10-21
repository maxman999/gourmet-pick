import {useContext, useEffect, useState} from "react";
import RoomHeader from "./RoomHeader";
import MenuList from "../Menu/MenuList";
import './Room.css';
import websocketContext from "../../store/websocket-context";
import Modal from "../UI/Modal";
import roomContext from "../../store/room-context";
import MenuInsertForm from "../Menu/MenuInsertForm";
import RoomContainer from "./RoomContainer";

const Room = () => {
    const roomCtx = useContext(roomContext);
    const websocketAPIs = useContext(websocketContext);

    const [gourmet, setGourmet] = useState(0);
    const [isModalPopped, setIsModalPopped] = useState(false)
    const [todayPick, setTodayPick] = useState('');

    const sessionInfo = {
        topic: 'voting',
        roomId: roomCtx.roomInfo.id,
        userId: Number(sessionStorage.getItem('userId')),
    }

    const modalCloseHandler = () => {
        roomCtx.changeVotingStatus('gathering');
        roomCtx.changeRoomPhase('default');
        setIsModalPopped(false);
    }

    const modalPopHandler = (isModalPopped: boolean) => {
        setIsModalPopped(isModalPopped)
    }

    const onMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "CREATE":
                websocketAPIs.seat();
                roomCtx.changeRoomPhase('calling');
                break;
            case 'SEATING':
                roomCtx.changeRoomPhase('calling');
                setGourmet(Number(payloadData.data));
                break;
            case 'CANCEL':
                roomCtx.changeRoomPhase('default');
                setGourmet(0);
                break;
            case 'READY':
                roomCtx.changeRoomPhase('ready');
                break;
            case 'START':
                websocketAPIs.start();
                roomCtx.changeRoomPhase('starting');
                roomCtx.changeVotingStatus('voting');
                break
            case 'FINISH':
                setTodayPick([`${payloadData.data}`][0]);
                setGourmet(0);
                modalPopHandler(true);
                break;
            case 'EXILE':
                alert("방이 삭제되었습니다. 메인 화면으로 돌아갑니다.")
                document.location.reload();
                break
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
                roomCtx.changeRoomPhase('calling');
                setGourmet(Number(payloadData.data));
                break
            default :
                break;
        }
    }

    useEffect(() => {
        if (!sessionInfo.userId) {
            alert("인증 정보를 받아올 수 없습니다. 다시 시도해주세요.")
            document.location.reload();
        }
        websocketAPIs.register(sessionInfo, onMessageHandler, onPrivateMessageHandler);

        return () => {
            websocketAPIs.disconnect();
        };
    }, []);


    return (
        <>
            <RoomContainer>
                {roomCtx.roomInfo && (roomCtx.roomPhase !== 'updating') &&
                    <>
                        <RoomHeader room={roomCtx.roomInfo} isConsoleActive={true}/>
                        <MenuList room={roomCtx.roomInfo} gourmet={gourmet}/>
                    </>
                }
                {roomCtx.roomInfo && (roomCtx.roomPhase === 'updating') &&
                    <>
                        <RoomHeader room={roomCtx.roomInfo} isConsoleActive={false}/>
                        <MenuInsertForm/>
                    </>
                }
            </RoomContainer>
            {isModalPopped &&
                <Modal onClose={modalCloseHandler}>
                    <div>{todayPick}</div>
                </Modal>
            }
        </>
    );
}

export default Room;