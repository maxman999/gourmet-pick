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

const App = () => {
    const roomCtx = useContext(roomContext);
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
                            {!roomCtx.roomInfo &&
                                <div id={'roomEntranceContainer'} className={`container`}>
                                    <EntranceInput/>
                                    <MyRoomList myRoomList={myRoomList} myRoomDeleteHandler={myRoomDeleteHandler}/>
                                </div>
                            }
                            {roomCtx.roomInfo &&
                                <Room/>
                            }
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