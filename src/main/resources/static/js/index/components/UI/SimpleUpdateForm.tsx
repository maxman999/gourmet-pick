import "./SimpleUpdateForm.css"
import {useRef} from "react";
import CommonUtils from "../../utils/CommonUtils";

type props = {
    title: string;
    placeholder: string;
    updateHandler: (inputValue: string) => void;
    maxLength?: number;
}

const SimpleUpdateForm = (props: props) => {
    const roomNameInputRef = useRef(null)

    const submitHandler = () => {
        const inputValue = roomNameInputRef.current.value;
        props.updateHandler(inputValue);
    }

    return (
        <div className="simpleUpdateForm row">
            <div className={'simple-form-title'}>{props.title}</div>
            <div className={'col-md-9 mb-2'}>
                <input type="text"
                       className="form-control"
                       id="titleUpdateInput"
                       ref={roomNameInputRef}
                       onKeyDown={(e) => CommonUtils.handleEnterKeyPress(e, submitHandler)}
                       maxLength={props.maxLength ? props.maxLength : 10}
                       placeholder={props.placeholder}/>
            </div>
            <div className={'col-md-3'}>
                <button className="btn btn-outline-primary w-100"
                        onClick={submitHandler}>
                    수 정 하 기
                </button>
            </div>
        </div>
    );
}

export default SimpleUpdateForm;