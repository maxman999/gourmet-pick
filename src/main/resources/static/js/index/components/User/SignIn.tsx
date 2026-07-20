import './SignIn.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faChildReaching, faK} from "@fortawesome/free-solid-svg-icons";
import {FormEvent, useEffect, useRef, useState} from "react";

type LoginType = 'google' | 'kakao' | 'guest';

const SignIn = () => {
    const guestLoginIdInputRef = useRef(null);
    const guestLoginInputPwRef = useRef(null);
    const [loadingLogin, setLoadingLogin] = useState<LoginType | null>(null);

    const googleLoginHandler = () => {
        if (loadingLogin) return;
        setLoadingLogin('google');
        window.location.replace("/oauth2/authorization/google");
    }

    const kakaoLoginHandler = () => {
        if (loadingLogin) return;
        setLoadingLogin('kakao');
        window.location.replace("/oauth2/authorization/kakao");
    }

    const guestLoginHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loadingLogin) return;
        setLoadingLogin('guest');

        const credentials = new URLSearchParams({
            username: guestLoginIdInputRef.current.value,
            password: guestLoginInputPwRef.current.value,
        });

        try {
            await fetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: credentials,
                credentials: 'same-origin',
                redirect: 'manual',
            });

            window.location.replace('/');
        } catch (error) {
            setLoadingLogin(null);
        }
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
                                type={'button'}
                                disabled={loadingLogin !== null}
                                aria-busy={loadingLogin === 'google'}
                                onClick={googleLoginHandler}>
                            {loadingLogin === 'google'
                                ? <span className={'login-spinner'} aria-hidden={'true'}/>
                                : <FontAwesomeIcon icon={faGoogle}/>
                            }
                            <span className={"social-btn-text"}>
                                    {loadingLogin === 'google' ? '로그인 중...' : <>Sign in with <b>Google</b></>}
                                </span>
                        </button>
                    </div>
                    <div>
                        <button className="social-btn kakao-btn"
                                type={'button'}
                                disabled={loadingLogin !== null}
                                aria-busy={loadingLogin === 'kakao'}
                                onClick={kakaoLoginHandler}>
                            {loadingLogin === 'kakao'
                                ? <span className={'login-spinner'} aria-hidden={'true'}/>
                                : <FontAwesomeIcon icon={faK}/>
                            }
                            <span className={"social-btn-text"}>
                                    {loadingLogin === 'kakao' ? '로그인 중...' : <>Sign in with <b>Kakao</b></>}
                                </span>
                        </button>
                    </div>
                    <div>
                        <form className="form-group" onSubmit={guestLoginHandler}>
                            <input type="hidden" name="username" ref={guestLoginIdInputRef}/>
                            <input type="hidden" name="password" ref={guestLoginInputPwRef}/>
                            <button className="social-btn guest-btn"
                                    type={"submit"}
                                    disabled={loadingLogin !== null}
                                    aria-busy={loadingLogin === 'guest'}>
                                {loadingLogin === 'guest'
                                    ? <span className={'login-spinner'} aria-hidden={'true'}/>
                                    : <FontAwesomeIcon icon={faChildReaching}/>
                                }
                                <span className={"social-btn-text"}>
                                    {loadingLogin === 'guest' ? '로그인 중...' : <>Use as a <b>GUEST</b></>}
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
