import {useState} from "react";
import SignIn from "./components/Member/SignIn";
import Room from "./components/Room/Room";
import './App.css';
import WebsocketProvider from "./store/WebsocketProvider";
import * as React from "react";
import RoomProvider from "./store/RoomProvider";

const App = () => {
    const [signInFlag, setSignInFlag] = useState(sessionStorage.getItem("isSignIn"));

    const signInHandler = (signInFlag: string) => {
        setSignInFlag(signInFlag);
    }

    return (
        <div className='main-container container-fluid'>
            {signInFlag === 'y' ?
                <WebsocketProvider>
                    <RoomProvider>
                        <Room/>
                    </RoomProvider>
                </WebsocketProvider> :
                <SignIn onSignIn={signInHandler}/>}
        </div>
    );
}

export default App;