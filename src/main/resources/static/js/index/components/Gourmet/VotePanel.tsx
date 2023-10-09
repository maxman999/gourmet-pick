import * as React from "react";
import {IMenu} from "../../interfaces/IMenu";
import PanelOnVoting from "./PanelItems/PanelOnVoting";
import PanelOnWaiting from "./PanelItems/PanelOnWaiting";
import PanelOnGathering from "./PanelItems/PanelOnGathering";
import PanelOnClosing from "./PanelItems/PanelOnClosing";

interface props {
    menuList: IMenu[];
    votingStatus: string;
    onVotingStatusChange: (votingStatus: string) => void;
    onVoting: (gourmetPick: number) => void;
}

const VotePanel = (props: props) => {
    const votingHandler = (gourmetPick: number) => {
        props.onVoting(gourmetPick);
    }

    const votingStatusChangeHandler = (votingStatus: string) => {
        props.onVotingStatusChange(votingStatus);
    }

    return (
        <>
            {props.votingStatus === 'gathering' && <PanelOnGathering/>}
            {props.votingStatus === 'voting' &&
            <PanelOnVoting
                onVotingStatusChange={votingStatusChangeHandler}
                onVoting={votingHandler}
            />}
            {props.votingStatus === 'waiting' && <PanelOnWaiting/>}
            {props.votingStatus === 'closing' && <PanelOnClosing/>}
        </>
    );
}

export default VotePanel;