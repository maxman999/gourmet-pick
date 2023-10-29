import {useContext} from "react";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";
import axios from "axios";
import Swal from "sweetalert2";

const MenuInput = () => {
    const roomCtx = useContext(roomContext)

    const updateClickHandler = async () => {
        const {data: totCnt} = await axios.get(`api/room/menuCount/${roomCtx.roomInfo.id}`);
        if (Number(totCnt) > 15) {
            await Swal.fire({title: '메뉴는 15개 이상 등록할 수 없습니다.', icon: 'warning'});
            return;
        }
        window.scroll(0,0);
        roomCtx.changeRoomPhase(RoomPhase.UPDATING);
    }

    return (
        <div className='row mt-3 p-3'>
            <button className='btn btn-outline-primary' onClick={updateClickHandler}>ADD NEW MENU
            </button>
        </div>
    );
}

export default MenuInput;