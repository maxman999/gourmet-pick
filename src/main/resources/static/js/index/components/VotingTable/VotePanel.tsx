import {IMenu} from "../../interfaces/IMenu";
import PanelOnVoting from "./PanelItems/PanelOnVoting";
import PanelOnWaiting from "./PanelItems/PanelOnWaiting";
import PanelOnGathering from "./PanelItems/PanelOnGathering";
import PanelOnFinishing from "./PanelItems/PanelOnFinishing";
import {useContext} from "react";
import roomContext from "../../store/room-context";
import {useSwiper} from "swiper/react";
import websocketContext from "../../store/websocket-context";

interface props {
    menuList: IMenu[];
}

const VotePanel = (props: props) => {
    const roomCtx = useContext(roomContext);
    const websocketAPIs = useContext(websocketContext);
    const swiper = useSwiper();

    const votingHandler = (gourmetPick: number) => {
        const menuName = props.menuList[swiper.realIndex].name;
        websocketAPIs.vote(menuName, gourmetPick);
    }

    return (
        <>
            {roomCtx.votingStatus === 'gathering' && <PanelOnGathering/>}
            {roomCtx.votingStatus === 'voting' && <PanelOnVoting onVoting={votingHandler}/>}
            {roomCtx.votingStatus === 'waiting' && <PanelOnWaiting/>}
            {roomCtx.votingStatus === 'finishing' && <PanelOnFinishing/>}
        </>
    );
}

export default VotePanel;