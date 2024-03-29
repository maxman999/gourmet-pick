import "./NavigationDropDown.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faGear} from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";
import SimpleUpdateForm from "../UI/SimpleUpdateForm";
import {useContext, useState} from "react";
import axios from "axios";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";
import {IUser} from "../../types/IUser";
import Swal from "sweetalert2";
import CommonUtils from "../../utils/CommonUtils";

const NavigationDropDown = () => {
    const roomCtx = useContext(roomContext);
    const [isNicknameUpdateModalPop, setIsNicknameUpdateModalPop] = useState(false);
    const user = CommonUtils.getUserFromSession();

    const modalPopupHandler = () => {
        if (roomCtx.roomPhase !== RoomPhase.DEFAULT) {
            Swal.fire({title: '투표가 진행 중일 때는 닉네임을 변경할 수 없습니다.', icon: 'warning'});
            return;
        }
        setIsNicknameUpdateModalPop(true);
    }

    const userNameModalCloseHandler = () => {
        setIsNicknameUpdateModalPop(false);
    }

    const nicknameUpdateHandler = async (nickname: string) => {
        const filterNickname = CommonUtils.filterHtmlTags(nickname.trim());
        if (filterNickname.length === 0) {
            await CommonUtils.toaster('변경할 닉네임을 입력해주세요.', 'top', 'warning');
            return;
        }

        if (filterNickname.length > 10) {
            await CommonUtils.toaster('허용되지 않은 문자가 포함됐습니다.', 'top', 'warning');
            return;
        }

        const {data: result} = await axios.post('/api/user/updateNickname', {
            id: user.id,
            nickname: filterNickname,
        });

        if (result === 0) {
            alert("닉네임 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
            return
        }

        user.nickname = nickname
        sessionStorage.setItem("user", JSON.stringify(user));
        setIsNicknameUpdateModalPop(false);
        CommonUtils.toaster('닉네임을 변경했습니다.', 'top');
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
                                      placeholder={`${CommonUtils.bringBackHtmlTags(user.nickname)}`}
                                      updateHandler={nicknameUpdateHandler}/>
                </Modal>
            }
        </>
    );
}

export default NavigationDropDown;