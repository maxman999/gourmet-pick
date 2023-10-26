import "./MenuDecisionSwiper.css"
import {IMenu} from "../../types/IMenu";
import MenuItem from "./MenuItem";
import {EffectCube} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import GourmetTable from "../VotingTable/GourmetTable";
import Timer from "../VotingTable/Timer";
import {memo, useEffect, useState} from "react";
import axios from "axios";


const MenuDecisionSwiper = () => {
    const [candidateItems, setCandidateItems] = useState<IMenu[]>([]);

    const getTodayMenuList = async () => {
        const {data: todayMenuList} = await axios.get('/voting/getTodayMenuList');
        setCandidateItems(todayMenuList);
    }

    useEffect(() => {
        getTodayMenuList().then();
    }, []);

    return (
        <>
            {(candidateItems.length > 0) &&
                <Swiper
                    key={Math.random()}
                    effect={"cube"}
                    loop={false}
                    lazy={true}
                    allowTouchMove={false}
                    modules={[EffectCube]}
                    className="menuDecisionSwiper slide-in"
                >
                    {/* 메뉴 슬라이드 */}
                    {candidateItems?.map((menuItem: IMenu) => {
                        return (
                            <SwiperSlide key={menuItem.id}>
                                <MenuItem menu={menuItem}/>
                            </SwiperSlide>
                        );
                    })}
                    {/* 투표 영역 */}
                    <Timer listSize={candidateItems.length}/>
                    <GourmetTable menuList={candidateItems}/>
                </Swiper>
            }
        </>
    );
}


export default memo(MenuDecisionSwiper);