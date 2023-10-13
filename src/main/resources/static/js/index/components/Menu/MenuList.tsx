import {useContext, useEffect, useState} from "react";
import MenuInput from "./MenuInput";
import {IRoom} from "../../interfaces/IRoom";
import {IMenu} from "../../interfaces/IMenu";
import axios from "axios";
import MenuDisplaySwiper from "./MenuDisplaySwiper";
import MenuDecisionSwiper from "./MenuDecisionSwiper";
import roomContext from "../../store/room-context";

interface props {
    room: IRoom;
    gourmet: number;
}

const MenuList = (props: props) => {
    const roomCtx = useContext(roomContext)
    const [menuList, setMenuList] = useState<IMenu[]>();

    const getMenuFromServer = async () => {
        const currentRoomId = props.room.id;
        const fetchRes = await axios.get(`/api/menu/${currentRoomId}`);
        return fetchRes.data;
    }

    const deleteHandler = (menuId: number) => {
        setMenuList((prevState => {
            return prevState.filter(menu => menu.id !== menuId);
        }));
    }

    const setDefaultMenuList = async () => {
        const latestMenuList = await getMenuFromServer();
        setMenuList(latestMenuList);
    }

    useEffect(() => {
        setDefaultMenuList().then();
    }, []);

    return (
        <div className='menu-container'>
            {!(roomCtx.roomPhase === 'default') &&
                <MenuDecisionSwiper
                    menuList={menuList}
                    gourmet={props.gourmet}
                />}
            {roomCtx.roomPhase === 'default' &&
                <>
                    <MenuDisplaySwiper menuList={menuList} onDelete={deleteHandler}/>
                    <MenuInput/>
                </>}
        </div>
    );
}

export default MenuList;