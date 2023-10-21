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

const App = () => {
    const roomCtx = useContext(roomContext);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [myRoomList, setMyRoomList] = useState<IRoom[]>([]);


    const authenticateHandler = async () => {
        const {data: userId} = await axios.get("/getAuthenticatedUserId");
        const isAuthenticated = userId > 0;
        if (isAuthenticated) {
            sessionStorage.setItem('userId', userId);
            const {data: myRoomList}: { data: IRoom[] } = await axios.get(`/api/room/getMyRoomList?userId=${userId}`);
            setMyRoomList(myRoomList);
        }

        setIsAuthenticated(isAuthenticated);
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
                                    <MyRoomList myRoomList={myRoomList}/>
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