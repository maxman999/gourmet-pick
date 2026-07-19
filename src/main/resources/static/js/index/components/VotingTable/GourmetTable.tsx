import VotePanel from "./VotePanel";
import {IMenu} from "../../types/IMenu";

type props = {
    menuList: IMenu[];
}

const GourmetTable = (props: props) => {
    return <VotePanel menuList={props.menuList}/>;
}

export default GourmetTable;
