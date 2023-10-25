import PanelContainer from "./PanelContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

const PanelOnFinishing = () => {
    return (
        <PanelContainer>
            <button className='btn btn-outline-danger w-100'>
                결과를 집계할 동안 잠시만 기다려주세요.
                <FontAwesomeIcon icon={faSpinner} spinPulse style={{marginLeft: '10px'}} />
            </button>
        </PanelContainer>
    );
}

export default PanelOnFinishing;