import {useContext} from "react";
import roomContext from "../../store/room-context";

const MenuInput = () => {
    const roomCtx = useContext(roomContext)

    const updateClickHandler = () => {
        roomCtx.changeRoomPhase('updating');
    }

    return (
        <div className='card mt-3 p-3'>
            <form id='menuInputForm' className='p-2'>
                <div className='row'>
                    <button type='submit' className='btn btn-outline-primary' onClick={updateClickHandler}>ADD NEW MENU
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MenuInput;