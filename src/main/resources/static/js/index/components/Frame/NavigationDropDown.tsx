import "./NavigationDropDown.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faGear} from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";
import SimpleUpdateForm from "../UI/SimpleUpdateForm";
import {useContext, useState} from "react";
import axios from "axios";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";

const NavigationDropDown = () => {
    const roomCtx = useContext(roomContext);
    const [isNicknameUpdateModalPop, setIsNicknameUpdateModalPop] = useState(false);

    const modalPopupHandler = () => {
        if (roomCtx.roomPhase !== RoomPhase.DEFAULT) {
            alert("투표가 진행 중일 때는 닉네임을 변경할 수 없습니다.")
            return;
        }
        setIsNicknameUpdateModalPop(true);
    }

    const userNameModalCloseHandler = () => {
        setIsNicknameUpdateModalPop(false);
    }

    const nicknameUpdateHandler = async (nickname: string) => {
        const {data: result} = await axios.post('/api/user/updateNickname', {
            id: sessionStorage.getItem('userId'),
            nickname: nickname,
        });
        if (result === 0) {
            alert("닉네임 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        setIsNicknameUpdateModalPop(false);
    }

    return (
        <>
            <div className="btn-group dropstart">
                <button
                    id="navDropDown"
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="dropdown-menu text-center" aria-labelledby="navDropDown">
                    <li>
                        <a className="dropdown-item" href="#"
                           onClick={modalPopupHandler}
                        >
                            닉네임 설정 <FontAwesomeIcon icon={faGear} style={{marginLeft: '5px'}}/>
                        </a></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li>
                        <a className="dropdown-item" href="/logout">
                            로그아웃 <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginLeft: '5px'}}/>
                        </a>
                    </li>
                </ul>
            </div>
            {isNicknameUpdateModalPop &&
                <Modal onClose={userNameModalCloseHandler} height={"140px"}>
                    <SimpleUpdateForm title={'사용할 닉네임을 입력해주세요.'}
                                      placeholder={''}
                                      updateHandler={nicknameUpdateHandler}/>
                </Modal>
            }
        </>
    );
}

export default NavigationDropDown;