import './GourmetTable.css';
import Gourmet from "./Gourmet";
import VotePanel from "./VotePanel";
import {IMenu} from "../../interfaces/IMenu";
import {useSwiper} from "swiper/react";
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";

interface props {
    menuList: IMenu[];
    gourmet: number;
}

const GourmetTable = (props: props) => {
    const websocketAPIs = useContext(websocketContext);

    const swiper = useSwiper();
    const empty_seat = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const votingHandler = (gourmetPick: number) => {
        const menuName = props.menuList[swiper.realIndex].name;
        websocketAPIs.vote(menuName, gourmetPick);
    };

    return (
        <>
            <VotePanel
                menuList={props.menuList}
                onVoting={votingHandler}
            />
            <div className='row mt-1 p-3'>
                {empty_seat.map((cnt, index) => {
                    return <Gourmet key={index} isActive={index < props.gourmet}/>
                })}
            </div>
        </>
    );
}

export default GourmetTable;

