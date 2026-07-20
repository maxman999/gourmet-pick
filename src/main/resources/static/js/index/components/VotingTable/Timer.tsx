import "./Timer.css"
import {useCountdown} from 'react-countdown-circle-timer'
import {useSwiper} from "swiper/react";
import {CSSProperties, useContext} from "react";
import websocketContext from "../../store/websocket-context";
import roomContext from "../../store/room-context";
import VotingStatus from "../../types/VotingStatus";

type props = {
    listSize: number
}

const Timer = (props: props) => {
    const duration = 5;
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

    const {elapsedTime, remainingTime} = useCountdown({
        isPlaying: websocketAPIs.websocketState.isVotingPossible,
        duration: duration,
        colors: '#ff6b35',
        onComplete: timerCompleteHandler,
    });

    const progress = Math.max(0, ((duration - elapsedTime) / duration) * 100);
    const remainingItems = Math.max(props.listSize - swiper.realIndex, 0);

    return (
        <div className='swiperProgressOverlay' aria-label={`남은 시간 ${remainingTime}초`}>
            <div className={`swiperRemainingBadge ${remainingTime <= 2 ? 'isUrgent' : ''}`}
                 style={{'--progress-angle': `${progress * 3.6}deg`} as CSSProperties}>
                <div className='swiperRemainingBadgeInner'>
                    남은 메뉴 <strong>{remainingItems}</strong>개
                </div>
            </div>
        </div>
    );
};

export default Timer;
