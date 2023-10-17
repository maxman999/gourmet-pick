import {IRoom} from "../../interfaces/IRoom";
import axios from "axios";
import './EntranceInput.css';
import {useRef} from "react";
import * as _ from "lodash";

interface props {
    onEntrance: (room: IRoom) => void;
    roomPhase: string;
}

const EntranceInput = (props: props) => {
    const invitationCodeRef = useRef(null);

    const getRoom = async (code: string = "") => {
        const fetchRes = await axios.get(`/api/room/${code}`);
        if (fetchRes.status === 200) {
            return fetchRes.data
        } else {
            alert("no code");
            return;
        }
    };

    const enterRoom = async (userId: number, roomId: number) => {
        const fetchResult = await axios.post(`api/room/enter/${userId}/${roomId}`);
        return Number(fetchResult.data) >= 0;
    };

    const clickHandler = async () => {
        const userId = Number(sessionStorage.getItem("userId"));
        const room: IRoom = await getRoom(invitationCodeRef.current.value || "noCode");
        if (!_.isEmpty(room)) {
            const isEntranceSuccess = await enterRoom(userId, room.id);
            isEntranceSuccess ? props.onEntrance(room) : alert("방 입장 실패");
        } else {
            alert("해당 방이 존재하지 않습니다.");
        }
    };

    return (
        <div id={'invitationCodeInput'}
             className={`row card mt-3 p-3 ${props.roomPhase === 'default' ? 'codeInput-show' : 'codeInput-hide'}`}>
            <div className="mb-3">
                <label htmlFor="invitationCode" className="form-label"># INVITATION CODE</label>
                <div className='row'>
                    <div className='col-sm-11'>
                        <input type="text"
                               className="form-control"
                               id="invitationCode"
                               ref={invitationCodeRef}
                        />
                    </div>
                    <div className='col-sm-1'>
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
