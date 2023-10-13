import axios from "axios";
import './SignIn.css';
import {useRef} from "react";

type props = {
    onSignIn: (signInFlag: string) => void,
}

const SignIn = (props: props) => {
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const clickHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        const memberInfo = getMemberInfo();
        const fetchRes = await signInFetch(memberInfo);
        if (fetchRes.data > 0) {
            sessionStorage.setItem("isSignIn", "y");
            sessionStorage.setItem("memNo", `${fetchRes.data}`);
            props.onSignIn("y");
        }
    }

    const getMemberInfo = () => {
        emailInputRef.current.value
        return {
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        };
    }

    const signInFetch = async (memberInfo: {}) => {
        return await axios.post("/api/member/signIn", memberInfo);
    }

    return (
        <div className='signIn-container row card mt-3 p-3'>
            <form>
                <div className="mb-3 row">
                    <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="text"
                               className="form-control"
                               id="inputEmail"
                               ref={emailInputRef}
                        />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password"
                               autoComplete="false"
                               className="form-control"
                               id="inputPassword"
                               ref={passwordInputRef}
                        />
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <button type="submit" className="btn btn-outline-secondary" onClick={clickHandler}>SignIn</button>
                </div>
            </form>
        </div>
    );
}

export default SignIn;