import './GourmetTable.css';
import Gourmet from "./Gourmet";
import VotePanel from "./VotePanel";
import * as React from "react";
import {IMenu} from "../../interfaces/IMenu";
import {useSwiper} from "swiper/react";
import Timer from "./Timer";
import {useContext, useEffect, useState} from "react";
import Modal from "../UI/Modal";
import websocketContext from "../../store/websocket-context";

interface props {
    menuList: IMenu[];
    onBusterCall: (isBusterCalled: boolean) => void;
    onMenuDecide: (todayPick: string) => void;
    onModalChange: (isModalPopped: boolean) => void;
}

const GourmetTable = (props: props) => {
    const swiper = useSwiper();
    const seat = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const menuObj: { [menuName: string]: number } = {}
    props.menuList.forEach(menu => {
        menuObj[menu.name] = 0;
    });

    const [gourmet, setGourmet] = useState(0);
    // gathering, voting, closing, waiting
    const [votingStatus, setVotingStatus] = useState("gathering");


    const websocketAPIs = useContext(websocketContext);
    const sessionInfo = {
        topic: 'voting',
        roomId: 'qwer1234',
        userId: 'kjy55&' + Math.random(),
    }

    const onMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                console.log('cnt : ', payloadData.data);
                setGourmet(Number(payloadData.data));
                console.log({gourmet})
                break;
            case "READY":
                websocketAPIs.ready();
                setVotingStatus('voting');
                break;
            case "END":
                props.onMenuDecide([`${payloadData.data}`][0]);
                props.onModalChange(true);
                props.onBusterCall(false);
                break;
            default :
                break;
        }
    }

    useEffect(() => {
        websocketAPIs.register(sessionInfo, onMessageHandler);

        return () => {
            websocketAPIs.disconnect();
        };
    }, []);


    swiper.on("init", () => {
        console.log('init', swiper.realIndex);
    });

    swiper.on("transitionEnd", () => {
        console.log('transitionEnd', swiper.realIndex);
    });

    useEffect(() => {
        if (votingStatus === 'closing') {
            websocketAPIs.finishVoting(sessionInfo);
        }
    }, [votingStatus]);

    const votingStatusChangeHandler = (votingStatus: string) => {
        setVotingStatus(votingStatus);
    }

    const votingHandler = (gourmetPick: number) => {
        const menuName = props.menuList[swiper.realIndex].name;
        websocketAPIs.vote(sessionInfo, menuName, gourmetPick);

        // setVotingResult((prevState) => {
        //     prevState[menuName] += gourmetPick;
        //     return prevState;
        // });
    };

    return (
        <>
            <Timer onVotingStatusChange={votingStatusChangeHandler}/>
            <VotePanel
                menuList={props.menuList}
                votingStatus={votingStatus}
                onVotingStatusChange={votingStatusChangeHandler}
                onVoting={votingHandler}
            />
            <div className='row mt-1 p-3'>
                {seat.map((cnt, index) => {
                    return <Gourmet key={index} isActive={index < gourmet}/>
                })}
            </div>
        </>
    );
}

export default GourmetTable;

