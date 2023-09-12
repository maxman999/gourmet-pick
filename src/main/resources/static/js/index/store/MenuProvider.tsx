import {useReducer} from "react";
import MenuContext from "./menu-context";
import {IMenu} from "../interfaces/IMenu";
import axios from "axios";
import * as React from "react";
interface menuState {
    menuList: IMenu[];
}

interface menuAction {
    type: string;
    menuList?: IMenu[];
    menu?: IMenu;
    menuId?: number;
}

type props = {
    children: React.ReactNode;
}

const menuReducer = (state: menuState, menuAction: menuAction) => {
    if (menuAction.type === "GET") {
        return {
            menuList: menuAction.menuList,
        }
    }

    if (menuAction.type === "REMOVE") {
        const filteredMenuList = state.menuList.filter((menu) => menu.id !== menuAction.menuId);
        return {
            menuList: filteredMenuList,
        };
    }
    return state;
}

const defaultMenuState: menuState = {
    menuList: []
}

const MenuProvider = (props: props) => {
    const [menuState, dispatchMenuActions] = useReducer(menuReducer, defaultMenuState);

    const getMenuHandler = async (roomId: number) => {
        const fetchRes = await axios.get(`/api/menu/${roomId}`);
        dispatchMenuActions({type: 'GET', menuList: fetchRes.data});
    }

    const addMenuHandler = async (menu: IMenu) => {
        dispatchMenuActions({type: 'ADD', menu: menu});
    }

    const removeMenuHandler = (menuId: number) => {
        dispatchMenuActions({type: 'REMOVE', menuId: menuId});
    }

    const menuContext = {
        menuList: menuState.menuList,
        getMenu: getMenuHandler,
        addMenu: addMenuHandler,
        removeMenu: removeMenuHandler,
    }

    return (
        <MenuContext.Provider value={menuContext}>
            {props.children}
        </MenuContext.Provider>
    )
}

export default MenuProvider;