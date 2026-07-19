import {useContext, useEffect, useState} from "react";
import SignIn from "./components/User/SignIn";
import Room from "./components/Room/Room";
import './App.css';
import axios from "axios";
import EntranceInput from "./components/Room/EntranceInput";
import roomContext from "./store/room-context";
import MainFrame from "./components/Frame/MainFrame";
import MyRoomList from "./components/Room/MyRoomList";
import {IRoom} from "./types/IRoom";
import {IUser} from "./types/IUser";
import {Navigate, Route, Routes, useNavigate, useParams} from "react-router-dom";
import RoomPhase from "./types/RoomPhase";

const Home = (props: { myRoomList: IRoom[], onRoomDelete: (roomId: number) => void }) => {
    const roomCtx = useContext(roomContext);

    useEffect(() => {
        if (roomCtx.roomInfo) roomCtx.leaveRoom();
    }, []);

    return (
        <div id={'roomEntranceContainer'} className={'container'}>
            <EntranceInput/>
            <MyRoomList myRoomList={props.myRoomList} myRoomDeleteHandler={props.onRoomDelete}/>
        </div>
    );
}

const RoomRoute = (props: { mode: 'room' | 'new' | 'edit' }) => {
    const roomCtx = useContext(roomContext);
    const navigate = useNavigate();
    const {invitationCode, menuId} = useParams();
    const isCurrentRoom = roomCtx.roomInfo?.invitationCode === invitationCode;

    useEffect(() => {
        if (isCurrentRoom) return;

        roomCtx.enterRoom(invitationCode).then(room => {
            if (!room) navigate('/', {replace: true});
        });
    }, [invitationCode]);

    useEffect(() => {
        if (props.mode === 'new') {
            roomCtx.setUpdateTargetMenu(0);
            roomCtx.changeRoomPhase(RoomPhase.UPDATING);
            return;
        }
        if (props.mode === 'edit') {
            roomCtx.setUpdateTargetMenu(Number(menuId));
            roomCtx.changeRoomPhase(RoomPhase.UPDATING);
            return;
        }
        if (roomCtx.roomPhase === RoomPhase.UPDATING) {
            roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
        }
    }, [props.mode, menuId]);

    return isCurrentRoom ? <Room/> : null;
}

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [myRoomList, setMyRoomList] = useState<IRoom[]>([]);

    const authenticateHandler = async () => {
        const {data: user}: { data: IUser } = await axios.get("/getAuthenticatedUserId");
        const isAuthenticated = !!user;
        if (user) {
            const {data: myRoomList}: { data: IRoom[] } = await axios.get(`/api/room/getMyRoomList?userId=${user.id}`);
            if (Array.isArray(myRoomList)) setMyRoomList(myRoomList);
            sessionStorage.setItem('user', JSON.stringify(user));
        }
        setIsAuthenticated(isAuthenticated);
    }

    const myRoomDeleteHandler = async (roomId: number) => {
        setMyRoomList((prevState => {
            return prevState.filter(room => room.id !== roomId);
        }));
    }

    useEffect(() => {
        authenticateHandler();
    }, []);

    return (
        <>
            {isAuthenticated !== null &&
                <>
                    {isAuthenticated &&
                        <MainFrame>
                            <Routes>
                                <Route path={'/'} element={<Home myRoomList={myRoomList} onRoomDelete={myRoomDeleteHandler}/>}/>
                                <Route path={'/rooms/:invitationCode'} element={<RoomRoute mode={'room'}/>}/>
                                <Route path={'/rooms/:invitationCode/menus/new'} element={<RoomRoute mode={'new'}/>}/>
                                <Route path={'/rooms/:invitationCode/menus/:menuId/edit'} element={<RoomRoute mode={'edit'}/>}/>
                                <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
                            </Routes>
                        </MainFrame>
                    }
                    {!isAuthenticated &&
                        <SignIn/>
                    }
                </>
            }
        </>
    );
}

export default App;
