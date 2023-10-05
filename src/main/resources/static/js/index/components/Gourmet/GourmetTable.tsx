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
}

const GourmetTable = (props: props) => {
    const menuObj: { [menuName: string]: number } = {}
    props.menuList.forEach(menu => {
        menuObj[menu.name] = 0;
    });

    // gathering, voting, closing, waiting
    const [votingStatus, setVotingStatus] = useState("gathering");
    const [votingResult, setVotingResult] = useState(menuObj);
    const [gourmetsPick, setGourmetsPick] = useState([]);

    const websocketAPIs = useContext(websocketContext);

    const onMessageHandler = (payload: any) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                const targetCnt = payloadData.userCnt;
                //ToDo react 답게 다시 짜자,,,,
                const targetElement = document.getElementsByClassName('gourmet-img');
                for (let i = 0; i <= targetCnt - 1; i++) {
                    const element = targetElement[i] as HTMLElement;
                    element.style.background = 'red';
                }
                break;
            case "READY":
                websocketAPIs.ready()
                setVotingStatus('voting')
        }
    }

    useEffect(() => {
        const tempRoomId = 'qwer1234';
        const tempUserId = 'kjy55&' + Math.random();
        websocketAPIs.register('voting', tempUserId, tempRoomId, onMessageHandler);

        return () => {
            // WebSocketUtil.disconnect();
        };
    }, []);


    const swiper = useSwiper();
    const gourmets = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    swiper.on("init", () => {
        console.log('init', swiper.realIndex);
    });

    swiper.on("transitionEnd", () => {
        console.log('transitionEnd', swiper.realIndex);
    });

    useEffect(() => {
        if (votingStatus === 'closing') {
            const quantity = Object.values(votingResult);
            const max = Math.max(...quantity);
            const selected = Object.keys(votingResult).filter((key) => {
                return votingResult[key] === max;
            });
            console.log(selected, max);
            setGourmetsPick(selected);
        }
    }, [votingStatus]);

    const votingStatusChangeHandler = (votingStatus: string) => {
        setVotingStatus(votingStatus);
    }

    const votingHandler = (gourmetPick: number) => {
        const menuName = props.menuList[swiper.realIndex].name;
        setVotingResult((prevState) => {
            prevState[menuName] += gourmetPick;
            return prevState;
        });
    };

    const votingCloseHandler = () => {
        setVotingStatus('waiting');
    }

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
                {gourmets.map((gourmet, index) => {
                    return <Gourmet key={index}/>
                })}
            </div>
            {votingStatus === "closing" &&
                <Modal onClose={votingCloseHandler}>
                    <div>{gourmetsPick}</div>
                </Modal>
            }
        </>
    );
}

export default GourmetTable;

