import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import "./Timer.css"
import {useSwiper} from "swiper/react";
import {useEffect, useState} from "react";

interface props {
    onVotingStatusChange: (votingStatus: string) => void
}

const Timer = (props: props) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        initiateVoting();
    }, []);

    const swiper = useSwiper();

    const initiateVoting = () => {
        setTimeout(() => {
            props.onVotingStatusChange('voting');
            setIsPlaying(true);
        }, 200000);
    }

    const timerCompleteHandler = () => {
        let shouldRepeat = true;
        if(swiper.isEnd){
            props.onVotingStatusChange('closing');
            shouldRepeat = false;
        }else{
            props.onVotingStatusChange('voting');
        }
        swiper.slideNext();
        return {shouldRepeat: shouldRepeat, delay: 0.5}
    }

    return (
        <div className='swiper-timer__wrapper'>
            <CountdownCircleTimer
                isPlaying={isPlaying}
                duration={5}
                strokeWidth={10}
                size={80}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[9, 5, 2, 0]}
                onComplete={timerCompleteHandler}
            >
                {({remainingTime}) => remainingTime}
            </CountdownCircleTimer>
        </div>
    );
}

export default Timer;