import * as React from "react";
import axios from "axios";
import {IRoom} from "../../interfaces/IRoom";
import {IMenu} from "../../interfaces/IMenu";

interface props {
    room: IRoom;
    onMenuAdding: () => void;
}

const MenuInput = (props: props) => {

    const clickHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        const currentRoomId = props.room.id;
        const newMenu = getInputData();
        if (newMenu.name === "") {
            alert("메뉴 이름을 입력해주세요.");
            return;
        }
        const updateResult = await fetchData(newMenu, currentRoomId);
        if (updateResult !== 1) alert("메뉴 입력 실패. 잠시후 다시 시도해주세요.");
        props.onMenuAdding();
    }

    const getInputData = (): IMenu => {
        const menuNameInput = document.getElementById('menuName') as HTMLInputElement;
        return {
            name: menuNameInput.value,
        }
    }

    const fetchData = async (newMenu: IMenu, roomId: number) => {
        newMenu.roomId = roomId;
        const fetchRes = await axios.post("/api/menu/add", newMenu);
        return fetchRes.data;
    }

    return (
        <div className='card mt-3 p-3'>
            <form id='menuInputForm' className='p-3'>
                <div className='row mb-2'>
                    <input type="text" className="form-control" id="menuName"/>
                </div>
                <div className='row pl-3 pr-3'>
                    <button type='submit' className='btn btn-outline-primary' onClick={clickHandler}>ADD NEW MENU
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MenuInput;