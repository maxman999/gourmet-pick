import {useContext, useEffect, useState} from "react";
import MenuInput from "./MenuInput";
import {IRoom} from "../../types/IRoom";
import {IMenu} from "../../types/IMenu";
import axios from "axios";
import MenuDisplaySwiper from "./MenuDisplaySwiper";
import MenuDecisionSwiper from "./MenuDecisionSwiper";
import roomContext from "../../store/room-context";
import MenuContainer from "./MenuContainer";
import * as _ from "lodash";
import RoomPhase from "../../types/RoomPhase";

type props = {
    room: IRoom,
    gourmet: number,
}

const MenuList = (props: props) => {
    const roomCtx = useContext(roomContext)
    const [menuList, setMenuList] = useState<IMenu[]>();
    const getMenuFromServer = async () => {
        const currentRoomId = props.room.id;
        const fetchRes = await axios.get(`/api/menu/all/${currentRoomId}`);
        return fetchRes.data;
    }

    const menuDeleteHandler = async (menuId: number) => {
        const {data: result} = await axios.delete(`/api/menu/${menuId}`);
        if (result === 0) {
            alert("메뉴 삭제 실패");
            return;
        }
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

    useEffect(() => {
        roomCtx.setMenuEmptyFlag(_.isEmpty(menuList))
    }, [menuList]);

    return (
        <MenuContainer>
            {roomCtx.roomPhase === RoomPhase.DEFAULT &&
                <>
                    <MenuDisplaySwiper
                        menuList={menuList}
                        onMenuDelete={menuDeleteHandler}
                    />
                    <MenuInput/>
                </>
            }
            {!(roomCtx.roomPhase === RoomPhase.DEFAULT) &&
                <MenuDecisionSwiper menuList={menuList} gourmet={props.gourmet}/>
            }
        </MenuContainer>
    );
}

export default MenuList;