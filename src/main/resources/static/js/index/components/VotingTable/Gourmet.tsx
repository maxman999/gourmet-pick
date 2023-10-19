import "./Gourmet.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

type props = {
    isActive: boolean
}

const Gourmet = (props: props) => {
    return (
        <div className='gourmet-box col'>
            <div className={`gourmet-avatar ${props.isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faUser}/>
            </div>
            <div className='noName text-center'>off</div>
        </div>
    );
}

export default Gourmet;

