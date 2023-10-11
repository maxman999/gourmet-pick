import * as React from "react";
import {IRoom} from "../../interfaces/IRoom";
import axios from "axios";
import './EntranceInput.css';
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";

interface props {
    onEntrance: (room: IRoom) => void;
    roomPhase: string;
}

const EntranceInput = (props: props) => {
    const getRoom = async (code: string = "") => {
        const fetchRes = await axios.get(`/api/room/${code}`);
        if (fetchRes.status === 200) {
            return fetchRes.data
        } else {
            alert("no code");
            return;
        }
    };

    const checkRoom = async (memberId: number, roomId: number): Promise<boolean> => {
        const fetchRes = await axios.get(`api/room/getList?memberId=${memberId}`);
        const result = [...fetchRes.data].filter(room => {
            return room.id == roomId;
        });
        return result.length > 0;
    }

    const enterRoom = async (memberId: number, roomId: number) => {
        await axios.post(`api/room/enter/${memberId}/${roomId}`);
    };

    const clickHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        const memberId = Number(sessionStorage.getItem("memNo"));
        const codeInput = document.getElementById("invitationCode") as HTMLInputElement;
        const room = await getRoom(codeInput.value || "noCode");
        if (room !== "") {
            const isAlreadyIn = await checkRoom(memberId, room.id);
            if (!isAlreadyIn) await enterRoom(memberId, room.id);
        }
        props.onEntrance(room);
    };

    return (
        <div className={`row card mt-3 p-3 ${props.roomPhase === 'default' ? '' : 'codeInput-buster'}`}>
            <form>
                <div className="mb-3">
                    <label htmlFor="invitationCode" className="form-label"># INVITATION CODE</label>
                    <div className='row'>
                        <div className='col-sm-11'>
                            <input type="text" className="form-control" id="invitationCode" />
                        </div>
                        <div className='col-sm-1'>
                            <button className='btn btn-outline-secondary' id="entranceBtn" onClick={clickHandler}> $
                            </button>
                        </div>
                    </div>
                    <div id="emailHelp" className="form-text">enter room code for service</div>
                </div>
            </form>
        </div>
    );
};

export default EntranceInput;
