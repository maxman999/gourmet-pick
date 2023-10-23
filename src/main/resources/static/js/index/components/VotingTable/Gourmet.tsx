import "./Gourmet.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

type props = {
    nickname: string,
    isActive: boolean
}

const Gourmet = (props: props) => {
    return (
        <div className='gourmet-box col p-0 mb-2'>
            <div className={`gourmet-avatar ${props.isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faUser} size={"xl"}/>
            </div>
            <div className='nickName text-center'>{props.isActive ? props.nickname : 'off'}</div>
        </div>
    );
}

export default Gourmet;

