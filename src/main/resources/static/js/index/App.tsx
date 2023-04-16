import {useState} from "react";
import SignIn from "./components/member/SignIn";
import Room from "./components/room/Room";
import './App.css';

const App = () => {
    const [signInFlag, setSignInFlag] = useState(sessionStorage.getItem("isSignIn"));

    const signInHandler = (signInFlag: string) => {
        setSignInFlag(signInFlag);
    }

    return (
        <div className='main-container container-fluid'>
            {signInFlag === 'y' ? <Room/> : <SignIn onSignIn={signInHandler}/>}
        </div>
    );
}

export default App;