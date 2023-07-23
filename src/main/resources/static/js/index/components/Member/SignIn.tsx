import * as React from "react";
import axios from "axios";
import './SignIn.css';

type props = {
    onSignIn: (signInFlag: string) => void,
}

const SignIn = (props: props) => {
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
        const emailInput = document.getElementById("inputEmail") as HTMLInputElement;
        const passwordInput = document.getElementById("inputPassword") as HTMLInputElement;
        return {
            email: emailInput.value,
            password: passwordInput.value,
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
                        <input type="text" className="form-control" id="inputEmail"/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" autoComplete="false" className="form-control" id="inputPassword"/>
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