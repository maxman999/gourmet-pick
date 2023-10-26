import './MenuDisplaySwiper.css';
import "swiper/css";
import "swiper/css/effect-cube";
import {IMenu} from "../../types/IMenu";
import {useContext} from "react";
import RoomPhase from "../../types/RoomPhase";
import roomContext from "../../store/room-context";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectCube} from "swiper";
import MenuItem from "./MenuItem";
import EmptyBox from "../UI/EmptyBox";
import MenuInput from "./MenuInput";

interface props {
    menuList: IMenu[];
    onMenuDelete?: (menuId: number) => void;
}

const MenuDisplaySwiper = (props: props) => {
    const roomCtx = useContext(roomContext);

    const menuAddingHandler = () => {
        roomCtx.changeRoomPhase(RoomPhase.UPDATING);
    }

    return (
        <>
            {props.menuList !== null && roomCtx.isMenuListEmpty &&
                <div className='menuEmptyBox card mt-5 p-3'>
                    <div className='row mb-2 align-self-center w-100'>
                        <EmptyBox minHeight={"400px"}
                                  width={"100%"}
                                  clickHandler={menuAddingHandler}
                                  caption={"등록된 메뉴가 없습니다."}/>
                    </div>
                </div>
            }
            {!roomCtx.isMenuListEmpty &&
                <>
                    <Swiper
                        key={Math.random()}
                        effect={"cube"}
                        grabCursor={true}
                        autoplay={{delay: 4000}}
                        lazy={true}
                        modules={[Autoplay, EffectCube]}
                        className={'menuDisplaySwiper'}
                    >
                        {props.menuList?.map((menuItem: IMenu) => {
                            return (
                                <SwiperSlide key={menuItem.id}>
                                    <MenuItem menu={menuItem}
                                              onMenuDelete={props.onMenuDelete}/>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <MenuInput/>
                </>
            }
        </>
    );
}

export default MenuDisplaySwiper;