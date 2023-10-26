import "./Timer.css"
import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import {useSwiper} from "swiper/react";
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";
import VotingStatus from "../../types/VotingStatus";

type props = {
    listSize: number
}

const Timer = (props: props) => {
    const swiper = useSwiper();
    const websocketAPIs = useContext(websocketContext);
    const roomCtx = useContext(roomContext)
    const timerCompleteHandler = () => {
        let shouldRepeat = true;
        if (swiper.isEnd) {
            shouldRepeat = false;
            // 방 상태 초기화
            websocketAPIs.finishVoting();
            roomCtx.changeVotingStatus(VotingStatus.FINISHING);
        } else {
            roomCtx.changeVotingStatus(VotingStatus.VOTING);
        }
        swiper.slideNext();
        return {shouldRepeat: shouldRepeat, delay: 0.5}
    }

    return (
        <div className='swiper-timer__wrapper card shadow shadow-sm p-2 text-center'>
            <CountdownCircleTimer
                isPlaying={websocketAPIs.websocketState.isVotingPossible}
                duration={5}
                strokeWidth={10}
                size={50}
                colors={['#05f348', '#9dbb17', '#be8231', '#A30000']}
                colorsTime={[9, 5, 2, 0]}
                onComplete={timerCompleteHandler}
            >
                {({remainingTime}) => remainingTime}
            </CountdownCircleTimer>
            <div>
                <span>{swiper.realIndex + 1} / {props.listSize}</span>
            </div>
        </div>
    );
};

export default Timer;