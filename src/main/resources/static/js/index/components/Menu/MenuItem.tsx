import {IMenu} from "../../types/IMenu";
import './MenuItem.css';
import {MapMarker, StaticMap} from "react-kakao-maps-sdk";
import {useContext, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faMapLocationDot, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";
import CommonUtils from "../../utils/CommonUtils";

interface props {
    menu: IMenu;
    onMenuDelete?: (menuId: number) => void;
    isTodayPickMenu?: boolean;
}

const MenuItem = (props: props) => {
    const roomCtx = useContext(roomContext);
    const [isMapModalOpened, setIsMapModalOpened] = useState(false);

    const menuDeleteBtnRef = useRef(null);
    const menuUpdateBtnRef = useRef(null);

    const user = CommonUtils.getUserFromSession();
    const hasMenuUpdateAuth = user.id === props.menu.writerId || user.id === roomCtx.roomInfo.managerId;

    const menuDeleteClickHandler = async () => {
        const confirmResult = await CommonUtils.confirm('메뉴를 삭제하시겠습니까?', '삭제된 메뉴는 복구할 수 없습니다.', '삭 제');
        if (!confirmResult.isConfirmed) return;
        const targetMenuId = Number(menuDeleteBtnRef.current.dataset.id);
        props.onMenuDelete(targetMenuId);
    }

    const getLocationHandler = () => {
        setIsMapModalOpened(true);
    }

    const modalCloseHandler = () => {
        setIsMapModalOpened(false);
    }

    const menuUpdateClickHandler = () => {
        const targetMenuId = Number(menuUpdateBtnRef.current.dataset.id);
        roomCtx.setUpdateTargetMenu(targetMenuId);
        roomCtx.changeRoomPhase(RoomPhase.UPDATING);
    }

    const roadAddressCopyHandler = () => {
        CommonUtils.copyToClipboard(props.menu.roadAddressName, '주소를 복사했습니다.');
    }

    const isMenuConsoleActive = roomCtx.roomPhase === RoomPhase.DEFAULT
        && hasMenuUpdateAuth
        && !props.isTodayPickMenu

    return (
        <div className='menuItemWrapper card mt-3 p-3'>
            <div className='row mb-2'>
                <div className='col menu-title'>
                    <div>
                        <span dangerouslySetInnerHTML={{__html: props.menu.name}}></span>
                    </div>
                </div>
                {isMenuConsoleActive &&
                    <div className='col text-end p-1'>
                        <button className={'btn btn-sm btn-outline-secondary locationBtn'}
                                onClick={getLocationHandler}
                        >
                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </button>
                        <button
                            className='btn btn-sm btn-outline-secondary menuUpdateBtn'
                            data-id={props.menu.id}
                            data-thumbnail={props.menu.thumbnail}
                            ref={menuDeleteBtnRef}
                            onClick={menuUpdateClickHandler}>
                            <FontAwesomeIcon icon={faPen}/>
                        </button>
                        <button
                            className='btn btn-sm btn-outline-secondary menuDeleteBtn'
                            data-id={props.menu.id}
                            data-thumbnail={props.menu.thumbnail}
                            ref={menuUpdateBtnRef}
                            onClick={menuDeleteClickHandler}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </div>
                }
            </div>
            <div className={"row mt-2"}>
                <div className='col text-center'>
                    <img className='menuThumbnail'
                         src={`/api/menu/getMenuImageURL?fileName=${props.menu.thumbnail}`}
                         alt='메뉴 썸네일'
                         loading="lazy"/>
                    <hr/>
                    <div>
                        <div id={'soberCommentTitle'}>냉정한 한줄평</div>
                        <span id={'soberCommentInput'}
                              className={'w-100'}
                              dangerouslySetInnerHTML={{__html: props.menu.soberComment}}>
                        </span>
                    </div>
                </div>
                {isMapModalOpened &&
                    <Modal onClose={modalCloseHandler}>
                        <div id={'mapWrapper'} className={'text-center'}>
                            <small className={'p-1'}> 지도를 클릭하시면 더 자세히 볼 수 있습니다.</small>
                            <StaticMap
                                center={{lat: props.menu.latitude, lng: props.menu.longitude}}
                                style={{width: "auto", height: "50vh", border: "1px solid gray"}}
                                marker={{text: props.menu.placeName}}
                                level={3}
                            >
                            </StaticMap>
                            <div className={'row mt-2'}>
                                <small> {props.menu.roadAddressName}
                                    <button className={'roadAddressCopyBtn'}
                                            onClick={roadAddressCopyHandler}
                                    >
                                        <FontAwesomeIcon icon={faLink}/>
                                    </button>
                                </small>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        </div>
    );
}

export default MenuItem;