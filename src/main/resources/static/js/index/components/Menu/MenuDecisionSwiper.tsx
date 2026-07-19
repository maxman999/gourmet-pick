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
import {memo, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as _ from "lodash";
import roomContext from "../../store/room-context";
import VotingStatus from "../../types/VotingStatus";


const MenuDecisionSwiper = () => {
    const roomCtx = useContext(roomContext);
    const [candidateItems, setCandidateItems] = useState<IMenu[]>([]);

    const getTodayMenuList = async () => {
        const {data: todayMenuList} = await axios.get('/voting/getTodayMenuList');
        if (_.isEmpty(todayMenuList)) {
            alert("데이터를 불러올 수 없습니다. 다시 로그인해 주세요.");
            document.location.reload();
            return;
        }
        setCandidateItems(todayMenuList);
    }

    useEffect(() => {
        getTodayMenuList().then();
    }, []);

    return (
        <>
            {(candidateItems.length > 0) &&
                <Swiper
                    effect={"cube"}
                    loop={false}
                    lazy={true}
                    allowTouchMove={roomCtx.votingStatus === VotingStatus.GATHERING}
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
