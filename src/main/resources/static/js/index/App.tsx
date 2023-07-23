import {useState} from "react";
import SignIn from "./components/Member/SignIn";
import Room from "./components/Room/Room";
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