import {useContext, useEffect, useState} from "react";
import SignIn from "./components/User/SignIn";
import Room from "./components/Room/Room";
import './App.css';
import axios from "axios";
import EntranceInput from "./components/Room/EntranceInput";
import roomContext from "./store/room-context";
import MainFrame from "./components/Frame/MainFrame";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const roomCtx = useContext(roomContext);

    const getSessionHandler = async () => {
        const {data: userId} = await axios.get("/getAuthenticatedUserId");
        const isAuthenticated = userId > 0;
        if (isAuthenticated) sessionStorage.setItem('userId', userId);
        setIsAuthenticated(isAuthenticated);
    }

    useEffect(() => {
        getSessionHandler();
    }, []);

    return (
        <>
            {isAuthenticated !== null &&
                <>
                    {isAuthenticated &&
                        <MainFrame>
                            <EntranceInput/>
                            {roomCtx.roomInfo && <Room/>}
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