import "./TodayPick.css"
import {IMenu} from "../../types/IMenu";
import MenuItem from "./MenuItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import {Tooltip} from "react-tooltip";
import {useContext} from "react";
import roomContext from "../../store/room-context";

type props = {
    menu: IMenu,
    modalCloseHandler: () => void
}

const TodayPick = (props: props) => {
    const roomCtx = useContext(roomContext);

    const todayPickResetHandler = () => {
        roomCtx.deleteTodayPick(roomCtx.roomInfo.id);
        props.modalCloseHandler();
    }

    return (
        <>
            <div className={'todayPickWrap'}>
                <div className='ribbon'><span>Today Pick!</span></div>
                <MenuItem menu={props.menu}/>
                <div className={'todayPickResetBtn btn btn-sm btn-danger'}
                     onClick={todayPickResetHandler}>
                    <FontAwesomeIcon icon={faRotateLeft}/>
                </div>
                <Tooltip anchorSelect={'.todayPickResetBtn'} style={{background: '#dc3545'}}>
                    <small>오늘의 투표 결과를 삭제합니다.</small> <br/>
                    <small>다시 투표가 가능해집니다.</small>
                </Tooltip>
            </div>
        </>
    )
}

export default TodayPick