import './SignIn.css';

const SignIn = () => {
    return (
        <>
            <div className="row">
                <div className="col-md-12 login-form">
                    <form className="form-group" action="/login" method="post">
                        <input type="hidden" name="username" value="GUEST"/>
                        <input type="hidden" name="password" value="GUEST"/>
                        <h1 className="text-center">Sign In</h1>
                        <div className="hint-text small">with your social media account</div>
                        <hr/>
                        <div className="row social-btn">
                            <div className="col-xs-6">
                                <a href="/oauth2/authorization/google" className="btn btn-block"><i
                                    className="fa fa-google"></i><p>Sign in
                                    with <b>Google</b></p></a>
                            </div>
                            <div className="col-xs-6">
                                <a href="/oauth2/authorization/kakao" className="btn btn-block"
                                ><i
                                    className="fa fa-kakao"><span>K</span></i>
                                    <p>Sign in with <b>Kakao</b></p></a>
                            </div>
                            <hr/>
                            <div className="col-xs-6">
                                <button type="submit" className="btn btn-block"
                                ><i
                                    className="fas fa-child"></i><p>Use as a <b>GUEST</b></p></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignIn;