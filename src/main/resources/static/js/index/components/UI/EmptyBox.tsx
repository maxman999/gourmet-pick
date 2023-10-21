import './EmptyBox.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

type props = {
    clickHandler: () => void
    minHeight?: string
    width?: string
    caption?: string
    color?: string
}

const EmptyBox = (props: props) => {
    return (
        <>
            <div className={'empty-box'}
                 onClick={props.clickHandler}
                 style={{
                     minHeight: props.minHeight,
                     width: props.width,
                     color: props.color,
                     borderColor: props.color,
                 }}>
                <div className={"text-center"}>
                    <FontAwesomeIcon icon={faPlus} size={'2x'}/>
                    <div className={"box-caption w-100"}>{props.caption}</div>
                </div>
            </div>
        </>
    );
}

export default EmptyBox;