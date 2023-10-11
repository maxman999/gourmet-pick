import * as React from "react";
import {IMenu} from "../../interfaces/IMenu";
import PanelOnVoting from "./PanelItems/PanelOnVoting";
import PanelOnWaiting from "./PanelItems/PanelOnWaiting";
import PanelOnGathering from "./PanelItems/PanelOnGathering";
import PanelOnClosing from "./PanelItems/PanelOnClosing";
import {useContext} from "react";
import roomContext from "../../store/room-context";

interface props {
    menuList: IMenu[];
    onVoting: (gourmetPick: number) => void;
}

const VotePanel = (props: props) => {
    const roomCtx  = useContext(roomContext)

    const votingHandler = (gourmetPick: number) => {
        props.onVoting(gourmetPick);
    }

    return (
        <>
            {roomCtx.votingStatus === 'gathering' && <PanelOnGathering/>}
            {roomCtx.votingStatus === 'voting' &&
            <PanelOnVoting
                onVoting={votingHandler}
            />}
            {roomCtx.votingStatus === 'waiting' && <PanelOnWaiting/>}
            {roomCtx.votingStatus === 'closing' && <PanelOnClosing/>}
        </>
    );
}

export default VotePanel;