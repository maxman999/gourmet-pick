import {IMenu} from "../../interfaces/IMenu";
import './MenuItem.css';
import axios from "axios";
import {StaticMap, MapMarker} from "react-kakao-maps-sdk";
import {useRef, useState} from "react";
import Timer from "../VotingTable/Timer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot} from "@fortawesome/free-solid-svg-icons";
import Modal from "../UI/Modal";

interface props {
    menu: IMenu;
    onDelete?: (menuId: number) => void;
}

const MenuItem = (props: props) => {
    const [isMapModalOpened, setIsMapModalOpened] = useState(false);

    const deleteBtnRef = useRef(null);

    const deleteClickHandler = async () => {
        const targetMenuId = Number(deleteBtnRef.current.dataset.id);
        // const targetMenuThumbnail = deleteBtnRef.current.dataset.thumbnail;
        await axios.delete(`/api/menu/${targetMenuId}`);
        props.onDelete(targetMenuId);
    }

    function getLocationHandler() {
        setIsMapModalOpened(true);
    }

    function modalCloseHandler() {
        setIsMapModalOpened(false);
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
                {props.onDelete &&
                    <div className='col text-end'>
                        <button
                            className='btn btn-sm btn-outline-secondary'
                            data-id={props.menu.id}
                            data-thumbnail={props.menu.thumbnail}
                            ref={deleteBtnRef}
                            onClick={deleteClickHandler}
                        >X
                        </button>
                    </div>
                }
                {!props.onDelete &&
                    <div className={"col"}>
                        <Timer/>
                    </div>
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