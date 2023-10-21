import {useContext} from "react";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";

const MenuInput = () => {
    const roomCtx = useContext(roomContext)

    const updateClickHandler = () => {
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