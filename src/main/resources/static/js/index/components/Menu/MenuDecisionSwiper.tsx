import "./MenuDecisionSwiper.css"
import {IMenu} from "../../types/IMenu";
import MenuItem from "./MenuItem";
import {EffectCube, Scrollbar} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import GourmetTable from "../VotingTable/GourmetTable";
import Timer from "../VotingTable/Timer";
import {memo, useEffect, useState} from "react";
import axios from "axios";

interface props {
    menuList: IMenu[];
}

const MenuDecisionSwiper = (props: props) => {
    const [candidateItem, setCandidateItem] = useState<IMenu[]>([]);

    const getTodayMenuList = async () => {
        const {data: todayMenuList} = await axios.get('/voting/getTodayMenuList');
        setCandidateItem(todayMenuList);
    }

    useEffect(() => {
        getTodayMenuList().then();
    }, []);

    return (
        <>
            {(candidateItem.length > 0) &&
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
                    className="menuDecisionSwiper slide-in"
                >
                    {/* 메뉴 슬라이드 */}
                    {candidateItem?.map((menuItem: IMenu) => {
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
            }
        </>
    );
}


export default memo(MenuDecisionSwiper);