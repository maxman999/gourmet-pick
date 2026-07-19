import './MenuDisplaySwiper.css';
import "swiper/css";
import "swiper/css/effect-cube";
import {IMenu} from "../../types/IMenu";
import {useContext} from "react";
import roomContext from "../../store/room-context";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectCube} from "swiper";
import MenuItem from "./MenuItem";
import EmptyBox from "../UI/EmptyBox";
import {useLocation, useNavigate} from "react-router-dom";
import type {Swiper as SwiperInstance} from "swiper";

interface props {
    menuList: IMenu[];
    onMenuDelete?: (menuId: number) => void;
}

const MenuDisplaySwiper = (props: props) => {
    const roomCtx = useContext(roomContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoaded = props.menuList !== null;
    const isEmpty = isLoaded && props.menuList.length === 0;
    const swiperKey = `${location.key}-${props.menuList?.map(menu => menu.id).join('-') || 'menu-swiper'}`;

    const refreshSwiper = (swiper: SwiperInstance) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                if (!swiper.destroyed) {
                    swiper.updateSize();
                    swiper.updateSlides();
                    swiper.update();
                    swiper.slideTo(0, 0);
                }
            });
        });
    };

    const menuAddingHandler = () => {
        navigate(`/rooms/${roomCtx.roomInfo.invitationCode}/menus/new`);
    }

    return (
        <>
            {isEmpty &&
                <div className='menuEmptyBox card mt-5 p-3'>
                    <div className='row mb-2 align-self-center w-100'>
                        <EmptyBox minHeight={"100%"}
                                  width={"100%"}
                                  clickHandler={menuAddingHandler}
                                  caption={"등록된 메뉴가 없습니다."}/>
                    </div>
                </div>
            }
            {isLoaded && !isEmpty &&
                <>
                    <Swiper
                        key={swiperKey}
                        effect={"cube"}
                        grabCursor={true}
                        autoplay={{delay: 4000}}
                        lazy={true}
                        observer={true}
                        observeParents={true}
                        observeSlideChildren={true}
                        updateOnImagesReady={true}
                        onSwiper={refreshSwiper}
                        onImagesReady={refreshSwiper}
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
                </>
            }
        </>
    );
}

export default MenuDisplaySwiper;
