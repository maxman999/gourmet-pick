import {useContext, useEffect, useState} from "react";
import MenuInput from "./MenuInput";
import {IRoom} from "../../interfaces/IRoom";
import {IMenu} from "../../interfaces/IMenu";
import axios from "axios";
import MenuDisplaySwiper from "./MenuDisplaySwiper";
import MenuDecisionSwiper from "./MenuDecisionSwiper";
import * as React from "react";
import menuContext from "../../store/menu-context";
import Modal from "../UI/Modal";

interface props {
    room: IRoom;
    isGourmetCalled: boolean;
    onGourmetCall: (isGourmetCalled: boolean) => void
}

const MenuList = (props: props) => {
    const [menuList, setMenuList] = useState<IMenu[]>();
    const [todayPick, setTodayPick] = useState('');
    const [isModalPopped, setIsModalPopped] = useState(false)

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

    const modalCloseHandler = () => {
        setIsModalPopped(false);
    }

    const menuDecisionHandler = (todayPick: string) => {
        setTodayPick(todayPick);
    }

    const modalPopHandler = (isModalPopped: boolean) => {
        setIsModalPopped(isModalPopped)
    }

    useEffect(() => {
        setDefaultMenuList();
    }, []);

    return (
        <div className='menu-container'>
            {props.isGourmetCalled &&
                <MenuDecisionSwiper
                    menuList={menuList}
                    onGourmetCall={props.onGourmetCall}
                    onMenuDecide={menuDecisionHandler}
                    onModalChange={modalPopHandler}
                />}
            {!props.isGourmetCalled &&
                <>
                    <MenuDisplaySwiper menuList={menuList} onDelete={deleteHandler}/>
                    <MenuInput room={props.room} onMenuAdding={menuAddingHandler}/>
                </>}
            {isModalPopped &&
                <Modal onClose={modalCloseHandler}>
                    <div>{todayPick}</div>
                </Modal>}
        </div>
    );
}

export default MenuList;