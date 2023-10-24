import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Scrollbar, EffectCube} from "swiper";
import "swiper/css";
import "swiper/css/effect-cube";
import {IMenu} from "../../types/IMenu";
import MenuItem from "./MenuItem";
import './MenuDisplaySwiper.css';
import EmptyBox from "../UI/EmptyBox";
import {useContext} from "react";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";

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
            {roomCtx.isMenuListEmpty &&
                <div className='card mt-3 p-3'>
                    <div className='row mb-2 align-self-center'>
                        <EmptyBox minHeight={"360px"}
                                  width={"360px"}
                                  clickHandler={menuAddingHandler}
                                  caption={"등록된 메뉴가 없습니다."}/>
                    </div>
                </div>
            }
            {!roomCtx.isMenuListEmpty &&
                <Swiper
                    key={Math.random()}
                    effect={"cube"}
                    grabCursor={true}
                    cubeEffect={{
                        shadow: true,
                        slideShadows: true,
                        shadowOffset: 20,
                        shadowScale: 0.94,
                    }}
                    autoplay={{delay: 3000}}
                    scrollbar={{hide: true,}}
                    modules={[Autoplay, EffectCube, Scrollbar]}
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
            }
        </>
    );
}

export default MenuDisplaySwiper;