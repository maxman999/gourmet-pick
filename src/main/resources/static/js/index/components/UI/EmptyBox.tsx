import './EmptyBox.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

type props = {
    minHeight?: string
    width?: string
    clickHandler: () => void
    caption?: string
}

const EmptyBox = (props: props) => {

    return (
        <>
            <div className={'empty-box'}
                 onClick={props.clickHandler}
                 style={{
                     minHeight: props.minHeight,
                     width: props.width,
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