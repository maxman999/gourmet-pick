import './EntranceInput.css';
import {useContext, useEffect, useRef} from "react";
import roomContext from "../../store/room-context";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import CommonUtils from "../../utils/CommonUtils";


const EntranceInput = () => {
    const roomCtx = useContext(roomContext);
    const invitationCodeRef = useRef(null);

    const clickHandler = async () => {
        const inputValue = invitationCodeRef.current.value.trim()
        if (inputValue.length === 0) {
            await Swal.fire({title: '투표방 코드를 입력해주세요.', icon: 'warning'});
            return;
        }
        roomCtx.enterRoom(invitationCodeRef.current.value);
    };

    const inspectInvitationCode = () => {
        const invitationCodeInSession = sessionStorage.getItem('invitationCode')
        if (invitationCodeInSession) {
            roomCtx.enterRoom(invitationCodeInSession);
            sessionStorage.removeItem('invitationCode');
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const invitationCode = params.get('code');
        if (invitationCode) {
            roomCtx.enterRoom(invitationCode);
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
                        <FontAwesomeIcon icon={faDoorOpen} style={{color: 'cornflowerblue'}}/>
                    </button>
                </div>
            </div>
            <div id="emailHelp" className="form-text">enter room code for service</div>
        </div>
    );
};

export default EntranceInput;
