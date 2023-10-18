import './SignIn.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faChildReaching, faK} from "@fortawesome/free-solid-svg-icons";

const SignIn = () => {

    const googleLoginHandler = async () => {
        document.location = "/oauth2/authorization/google";
    }

    const kakaoLoginHandler = async () => {
        document.location = "/oauth2/authorization/kakao";
    }

    const guestLoginHandler = async () => {
        document.location = "/guest";
    }

    return (
        <div className="signIn-container">
            <div className={"signIn-wrap row"}>
                <div className="catchphrase">
                    "우리가 먹는 것이 곧 우리 자신이 된다"
                </div>
                <div className={"signIn-form card shadow p-3"}>
                    <h1 className="text-center signIn-header">Sign In</h1>
                    <div className="signIn-hint">미식가들의 냉정한 맛평가 서비스를 이용하시려면 계정을 등록해주세요.</div>
                    <hr/>
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
                                <input type="hidden" name="username" value="guest"/>
                                <input type="hidden" name="password" value="guest"/>
                                <button className="social-btn guest-btn">
                                    <FontAwesomeIcon icon={faChildReaching}/>
                                    <span className={"social-btn-text"}>
                                    Use as a <b>GUEST</b>
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
    );
}

export default SignIn;