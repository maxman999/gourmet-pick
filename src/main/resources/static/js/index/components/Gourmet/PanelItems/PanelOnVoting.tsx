import * as React from "react";
import {useContext} from "react";
import roomContext from "../../../store/room-context";

interface props{
    onVoting : (gourmetPick:number) => void;
}

const PanelOnVoting = (props:props) => {
    const roomCtx = useContext(roomContext);

    const votingHandler = (e:React.MouseEvent) => {
        const weight = Number(e.currentTarget.getAttribute('data-weight'));
        roomCtx.changeVotingStatus('waiting');
        props.onVoting(weight);
    }

    return (
        <div className='p-3 mt-4'>
            <div className='row'>
                <div className='col'>
                    <button
                        className='btn btn-outline-success w-100 h-100'
                        onClick={votingHandler}
                        data-weight={1}
                    > 찬성 </button>
                </div>
                <div className='col'>
                    <button
                        className='btn btn-outline-danger w-100 h-100'
                        onClick={votingHandler}
                        data-weight={-1}
                    > 반대 </button>
                </div>
                <div className='col'>
                    <button
                        className='btn btn-outline-secondary w-100 h-100'
                        onClick={votingHandler}
                        data-weight={0}
                    > 기권 </button>
                </div>
            </div>
        </div>
    );
}

export default PanelOnVoting;