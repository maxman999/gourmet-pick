import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import "./Timer.css"
import {useSwiper} from "swiper/react";
import {useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";
import VotingStatus from "../../types/VotingStatus";

const Timer = () => {
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
        <div className='swiper-timer__wrapper'>
            <CountdownCircleTimer
                isPlaying={websocketAPIs.websocketState.isVotingPossible}
                duration={7}
                strokeWidth={10}
                size={70}
                colors={['#007722', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[9, 5, 2, 0]}
                onComplete={timerCompleteHandler}
            >
                {({remainingTime}) => remainingTime}
            </CountdownCircleTimer>
        </div>
    );
};

export default Timer;