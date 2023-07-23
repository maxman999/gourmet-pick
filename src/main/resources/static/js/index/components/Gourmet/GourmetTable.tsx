import './GourmetTable.css';
import Gourmet from "./Gourmet";
import VotePanel from "./VotePanel";
import * as React from "react";
import {IMenu} from "../../interfaces/IMenu";
import {useSwiper} from "swiper/react";
import Timer from "./Timer";
import {useEffect, useState} from "react";
import Modal from "../UI/Modal";

interface props {
    menuList: IMenu[];
}

const GourmetTable = (props: props) => {
    const menuObj: { [menuName: string]: number } = {}
    props.menuList.forEach(menu => {
        menuObj[menu.name] = 0;
    });

    const [votingStatus, setVotingStatus] = useState("gathering");
    const [votingResult, setVotingResult] = useState(menuObj);
    const [gourmetsPick, setGourmetsPick] = useState([]);

    const swiper = useSwiper();
    const gourmets = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    swiper.on("init", () => {
        console.log(swiper.realIndex);
    });

    swiper.on("transitionEnd", () => {
        console.log(swiper.realIndex);
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
    },[votingStatus]);

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

