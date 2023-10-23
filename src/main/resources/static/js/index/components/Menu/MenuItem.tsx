import {IMenu} from "../../types/IMenu";
import './MenuItem.css';
import {StaticMap} from "react-kakao-maps-sdk";
import {useContext, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";
import roomContext from "../../store/room-context";
import RoomPhase from "../../types/RoomPhase";

interface props {
    menu: IMenu;
    onMenuDelete?: (menuId: number) => void;
}

const MenuItem = (props: props) => {
    const roomCtx = useContext(roomContext);
    const [isMapModalOpened, setIsMapModalOpened] = useState(false);

    const menuDeleteBtnRef = useRef(null);
    const menuUpdateBtnRef = useRef(null);

    const menuDeleteClickHandler = async () => {
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

    return (
        <div className='menuItemWrapper card mt-3 p-3'>
            <div className='row mb-2'>
                <div className='col menu-title'>
                    <div>
                        {props.menu.name}
                        <button className={'locationBtn btn btn-outline-success btn-sm'}
                                onClick={getLocationHandler}
                        >

                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </button>
                    </div>
                </div>
                {roomCtx.roomPhase === RoomPhase.DEFAULT && props.onMenuDelete &&
                    <>
                        <div className='col text-end'>
                            <button
                                className='btn btn-sm btn-outline-secondary menuUpdateBtn'
                                data-id={props.menu.id}
                                data-thumbnail={props.menu.thumbnail}
                                ref={menuDeleteBtnRef}
                                onClick={menuUpdateClickHandler}
                            ><FontAwesomeIcon icon={faPen}/>
                            </button>
                            <button
                                className='btn btn-sm btn-outline-secondary menuDeleteBtn'
                                data-id={props.menu.id}
                                data-thumbnail={props.menu.thumbnail}
                                ref={menuUpdateBtnRef}
                                onClick={menuDeleteClickHandler}
                            ><FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </div>
                    </>
                }
            </div>
            <div className={"row mt-2"}>
                <div className='col text-center'>
                    <img id='menuThumbnail'
                         src={`/api/menu/getMenuImageURL?fileName=${props.menu.thumbnail}`}
                         alt='메뉴 썸네일'/>
                    <hr/>
                    <div>
                        <div id={'soberCommentTitle'}>냉정한 한줄평</div>
                        <span id={'soberCommentInput'}
                              className={'w-100'}>
                            "{props.menu.soberComment}"
                        </span>
                    </div>
                </div>
                {isMapModalOpened &&
                    <Modal onClose={modalCloseHandler}>
                        <div id={'mapWrapper'} className=''>
                            <StaticMap
                                center={{lat: props.menu.latitude, lng: props.menu.longitude}}
                                style={{width: "100%", height: "560px", border: "1px solid gray"}}
                                marker={true}
                                level={3}
                            >
                            </StaticMap>
                        </div>
                    </Modal>
                }
            </div>
        </div>
    );
}

export default MenuItem;