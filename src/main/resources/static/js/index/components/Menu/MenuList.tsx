import {useContext, useEffect, useState} from "react";
import MenuInput from "./MenuInput";
import {IRoom} from "../../interfaces/IRoom";
import {IMenu} from "../../interfaces/IMenu";
import axios from "axios";
import MenuDisplaySwiper from "./MenuDisplaySwiper";
import MenuDecisionSwiper from "./MenuDecisionSwiper";
import * as React from "react";
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

    const menuAddingHandler = async () => {
        const latestMenuList = await getMenuFromServer();
        setMenuList(latestMenuList);
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
                    <MenuInput room={props.room} onMenuAdding={menuAddingHandler}/>
                </>}
        </div>
    );
}

export default MenuList;