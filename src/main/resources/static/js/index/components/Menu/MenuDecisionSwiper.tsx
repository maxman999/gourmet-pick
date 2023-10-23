import "./MenuDecisionSwiper.css"
import {IMenu} from "../../types/IMenu";
import MenuItem from "./MenuItem";
import {Scrollbar, EffectCube} from "swiper";
import {Swiper, SwiperSlide, useSwiper} from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import GourmetTable from "../VotingTable/GourmetTable";
import Timer from "../VotingTable/Timer";
import {memo} from "react";

interface props {
    menuList: IMenu[];
}

const MenuDecisionSwiper = memo((props: props) => {
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
                <Timer/>
                <GourmetTable menuList={props.menuList}/>
            </Swiper>
        </>
    );
});

export default MenuDecisionSwiper;