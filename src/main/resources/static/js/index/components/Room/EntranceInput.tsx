import {IRoom} from "../../types/IRoom";
import axios from "axios";
import './EntranceInput.css';
import {useContext, useRef} from "react";
import * as _ from "lodash";
import roomContext from "../../store/room-context";


const EntranceInput = () => {
    const roomCtx = useContext(roomContext);
    const invitationCodeRef = useRef(null);

    const clickHandler = async () => {
        roomCtx.enterRoom(invitationCodeRef.current.value);
    };

    return (
        <div className={'row'}>
            <div id={"invitationCodeInputWrapper"} className="card p-3">
                <label htmlFor="invitationCodeInput" className="form-label"># INVITATION CODE</label>
                <div className='row'>
                    <div className='col-sm-11 p-1'>
                        <input type="text"
                               className="form-control"
                               id="invitationCodeInput"
                               ref={invitationCodeRef}
                        />
                    </div>
                    <div className='col-sm-1 p-1'>
                        <button className='btn btn-outline-secondary' id="entranceBtn" onClick={clickHandler}> $
                        </button>
                    </div>
                </div>
                <div id="emailHelp" className="form-text">enter room code for service</div>
            </div>
        </div>
    );
};

export default EntranceInput;
