import './GourmetTable.css';
import Gourmet from "./Gourmet";
import VotePanel from "./VotePanel";
import {IMenu} from "../../types/IMenu";
import {useContext} from "react";
import roomContext from "../../store/room-context";

type props = {
    menuList: IMenu[];
}

const GourmetTable = (props: props) => {
    const roomCtx = useContext(roomContext);
    const empty_seat = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <>
            <VotePanel menuList={props.menuList}/>
            <div className='row p-2'>
                {empty_seat.map((cnt, index) => {
                    return (
                        <Gourmet key={index}
                                 isActive={index < roomCtx.votingGourmets?.length}
                                 nickname={roomCtx.votingGourmets[index]?.nickname}
                        />
                    )
                })}
            </div>

        </>
    );
}

export default GourmetTable;

