import './EmptyBox.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

type props = {
    minHeight?: string
    clickHandler: () => void
}

const EmptyBox = (props: props) => {

    return (
        <div className={'empty-box'}
             onClick={props.clickHandler}
             style={{minHeight: props.minHeight}}>
            <FontAwesomeIcon icon={faPlus} size={'2x'}/>
        </div>
    );
}

export default EmptyBox;