import './GourmetTable.css';
import Gourmet from "./Gourmet";
import VotePanel from "./VotePanel";
import {IMenu} from "../../interfaces/IMenu";

interface props {
    menuList: IMenu[];
    gourmet: number;
}

const GourmetTable = (props: props) => {
    const empty_seat = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <>
            <VotePanel menuList={props.menuList}/>
            <div className='row mt-1 p-3'>
                {empty_seat.map((cnt, index) => {
                    return <Gourmet key={index} isActive={index < props.gourmet}/>
                })}
            </div>
        </>
    );
}

export default GourmetTable;

