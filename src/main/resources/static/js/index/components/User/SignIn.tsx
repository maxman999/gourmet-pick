import './SignIn.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faChildReaching, faK} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef} from "react";

const SignIn = () => {
    const guestLoginIdInputRef = useRef(null);
    const guestLoginInputPwRef = useRef(null);

    const googleLoginHandler = async () => {
        document.location = "/oauth2/authorization/google";
    }

    const kakaoLoginHandler = async () => {
        document.location = "/oauth2/authorization/kakao";
    }

    const generateGuest = () => {
        // 일단 공유하는 아이디는 10개로 제한
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        const accountStr = `GUEST#${randomNumber}`;
        guestLoginIdInputRef.current.value = guestLoginInputPwRef.current.value = accountStr;
    }

    const rememberInvitationCode = () => {
        const params = new URLSearchParams(window.location.search);
        const invitationCode = params.get('code');
        if (invitationCode) {
            sessionStorage.setItem('invitationCode', invitationCode);
        }
    }

    useEffect(() => {
        generateGuest();
        rememberInvitationCode();
    }, []);

    return (
        <div className={"signIn-wrap row"}>
            <div className="login-title-wrap">
                <div className={'login-title'}>
                    GOURMET PICK
                </div>
                <div className={'login-title-sub'}>
                    냉정한 미식가들의 소중한 한끼를 위한 선택
                </div>
            </div>
            <div className={"signIn-form card shadow p-3"}>
                <div className="row social-btn-wrap">
                    <div>
                        <button className={"social-btn google-btn"}
                                onClick={googleLoginHandler}>
                            <FontAwesomeIcon icon={faGoogle}/>
                            <span className={"social-btn-text"}>
                                    Sign in with <b>Google</b>
                                </span>
                        </button>
                    </div>
                    <div>
                        <button className="social-btn kakao-btn"
                                onClick={kakaoLoginHandler}>
                            <FontAwesomeIcon icon={faK}/>
                            <span className={"social-btn-text"}>
                                    Sign in with <b>Kakao</b>
                                </span>
                        </button>
                    </div>
                    <div>
                        <form className="form-group" action="/login" method="post">
                            <input type="hidden" name="username" ref={guestLoginIdInputRef}/>
                            <input type="hidden" name="password" ref={guestLoginInputPwRef}/>
                            <button className="social-btn guest-btn" type={"submit"}>
                                <FontAwesomeIcon icon={faChildReaching}/>
                                <span className={"social-btn-text"}>
                                    Use as a <b>GUEST</b>
                                    </span>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="signIn-hint">서비스를 이용하시려면 계정을 등록해주세요.</div>
            </div>
        </div>
    );
}

export default SignIn;