import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Scrollbar, EffectCube} from "swiper";
import "swiper/css";
import "swiper/css/effect-cube";
import {IMenu} from "../../interfaces/IMenu";
import MenuItem from "./MenuItem";
import './MenuDisplaySwiper.css';

interface props {
    menuList: IMenu[];
    onDelete?: (menuId: number) => void;
}

const MenuDisplaySwiper = (props: props) => {

    return (
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
            className="menuDisplaySwiper"
        >
            {props.menuList?.map((menuItem: IMenu) => {
                return (
                    <SwiperSlide key={menuItem.id}>
                        <MenuItem menu={menuItem}
                                  onDelete={props.onDelete}/>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}

export default MenuDisplaySwiper;