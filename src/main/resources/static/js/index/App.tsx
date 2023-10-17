import {useEffect, useState} from "react";
import WebsocketProvider from "./store/WebsocketProvider";
import RoomProvider from "./store/RoomProvider";
import SignIn from "./components/User/SignIn";
import Room from "./components/Room/Room";
import './App.css';
import axios from "axios";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const getSessionHandler = async () => {
        const {data: userId} = await axios.get("/getAuthenticatedUserId");
        const isAuthenticated = Number(userId) > 0;
        if (isAuthenticated) sessionStorage.setItem('userId', userId);
        setIsAuthenticated(isAuthenticated);
    }

    useEffect(() => {
        getSessionHandler();
    }, [isAuthenticated]);

    return (
        <>
            {isAuthenticated !== null &&
                <div className='main-container container-fluid'>
                    {isAuthenticated &&
                        <WebsocketProvider>
                            <RoomProvider>
                                <Room/>
                            </RoomProvider>
                        </WebsocketProvider>
                    }
                    {!isAuthenticated &&
                        <SignIn/>
                    }
                </div>
            }
        </>
    );
}

export default App;