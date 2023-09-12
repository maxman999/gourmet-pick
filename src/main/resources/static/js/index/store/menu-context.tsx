import * as React from "react";
import {IMenu} from "../interfaces/IMenu";

const MenuContext = React.createContext({
    menuList: [],
    getMenu: (rooId: number) => {},
    addMenu: (menu:IMenu) => {},
    removeMenu: (menuId:number) => {},
});
export default MenuContext;