import {useContext} from "react";
import roomContext from "../../store/room-context";

const MenuInput = () => {
    const roomCtx = useContext(roomContext)

    const updateClickHandler = () => {
        roomCtx.changeRoomPhase('updating');
    }

    return (
        <div className='row mt-3 p-3'>
            <button className='btn btn-outline-primary' onClick={updateClickHandler}>ADD NEW MENU
            </button>
        </div>
    );
}

export default MenuInput;