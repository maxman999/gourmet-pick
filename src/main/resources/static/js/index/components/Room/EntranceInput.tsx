import './EntranceInput.css';
import {useContext, useEffect, useRef} from "react";
import roomContext from "../../store/room-context";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import CommonUtils from "../../utils/CommonUtils";
import {useNavigate} from "react-router-dom";


const EntranceInput = () => {
    const roomCtx = useContext(roomContext);
    const navigate = useNavigate();
    const invitationCodeRef = useRef(null);

    const clickHandler = async () => {
        const inputValue = invitationCodeRef.current.value.trim()
        if (inputValue.length === 0) {
            await Swal.fire({title: '초대 코드를 입력해주세요.', icon: 'warning'});
            return;
        }
        const room = await roomCtx.enterRoom(invitationCodeRef.current.value);
        if (room) navigate(`/rooms/${room.invitationCode}`);
    };

    const inspectInvitationCode = async () => {
        const invitationCodeInSession = sessionStorage.getItem('invitationCode')
        if (invitationCodeInSession) {
            const room = await roomCtx.enterRoom(invitationCodeInSession);
            if (room) navigate(`/rooms/${room.invitationCode}`, {replace: true});
            sessionStorage.removeItem('invitationCode');
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const invitationCode = params.get('code');
        if (invitationCode) {
            const room = await roomCtx.enterRoom(invitationCode);
            if (room) navigate(`/rooms/${room.invitationCode}`, {replace: true});
            return;
        }
    }

    useEffect(() => {
        inspectInvitationCode();
    }, []);

    return (
        <div id={"invitationCodeInputWrapper"} className="card p-3">
            <label htmlFor="invitationCodeInput" className="form-label"># INVITATION CODE</label>
            <div className='row'>
                <div className='invitationCodeInput-wrap col-sm-11 p-1'>
                    <input type="text"
                           className="form-control"
                           id="invitationCodeInput"
                           onKeyDown={(e) => CommonUtils.handleEnterKeyPress(e, clickHandler)}
                           ref={invitationCodeRef}
                    />
                </div>
                <div className='col-sm-1 p-1'>
                    <button className='btn btn-outline-secondary' id="entranceBtn"
                            onClick={clickHandler}
                    >
                        <FontAwesomeIcon icon={faDoorOpen}/>
                    </button>
                </div>
            </div>
            <div id="emailHelp" className="form-text">공유 받은 초대 코드를 입력해주세요.</div>
        </div>
    );
};

export default EntranceInput;
