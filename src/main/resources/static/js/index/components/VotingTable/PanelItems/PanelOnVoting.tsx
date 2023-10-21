import {useContext} from "react";
import roomContext from "../../../store/room-context";
import PanelContainer from "./PanelContainer";
import VotingStatus from "../../../types/VotingStatus";

interface props {
    onVoting: (gourmetPick: number) => void;
}

const PanelOnVoting = (props: props) => {
    const roomCtx = useContext(roomContext);

    const votingHandler = (e: React.MouseEvent) => {
        const weight = Number(e.currentTarget.getAttribute('data-weight'));
        roomCtx.changeVotingStatus(VotingStatus.WAITING);
        props.onVoting(weight);
    }

    return (
        <PanelContainer>
            <div className={'row'}>
                <div className='col'>
                    <button
                        className='btn btn-outline-success w-100 h-100'
                        onClick={votingHandler}
                        data-weight={1}
                    > 찬성
                    </button>
                </div>
                <div className='col'>
                    <button
                        className='btn btn-outline-danger w-100 h-100'
                        onClick={votingHandler}
                        data-weight={-1}
                    > 반대
                    </button>
                </div>
                <div className='col'>
                    <button
                        className='btn btn-outline-secondary w-100 h-100'
                        onClick={votingHandler}
                        data-weight={0}
                    > 기권
                    </button>
                </div>
            </div>
        </PanelContainer>

    );
}

export default PanelOnVoting;