import * as React from "react";

interface props{
    onVotingStatusChange : (votingStatus:string) => void;
    onVoting : (gourmetPick:number) => void;
}

const PanelOnVoting = (props:props) => {

    const votingHandler = (e:React.MouseEvent) => {
        const weight = Number(e.currentTarget.getAttribute('data-weight'));
        props.onVotingStatusChange('waiting');
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