import "./MenuDecisionSwiper.css"
import {IMenu} from "../../interfaces/IMenu.";
import MenuItem from "./MenuItem";
import {Scrollbar, EffectCube} from "swiper";
import {Swiper, SwiperSlide, useSwiper} from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import GourmetTable from "../gourmet/GourmetTable";
import * as React from "react";

interface props {
    menuList: IMenu[];
}

const MenuDecisionSwiper = (props: props) => {
    return (
        <>
            <Swiper
                key={Math.random()}
                effect={"cube"}
                cubeEffect={{
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                }}
                scrollbar={{hide: true,}}
                loop={false}
                allowTouchMove={false}
                modules={[Scrollbar, EffectCube]}
                className="menuDecisionSwiper"
            >
                {/* 메뉴 슬라이드 */}
                {props.menuList?.map((menuItem: IMenu) => {
                    return (
                        <SwiperSlide key={menuItem.id}>
                            <MenuItem menu={menuItem}/>
                        </SwiperSlide>
                    );
                })}
                {/* 투표 영역 */}
                <GourmetTable menuList={props.menuList} />
            </Swiper>
        </>
    );
}

export default MenuDecisionSwiper;