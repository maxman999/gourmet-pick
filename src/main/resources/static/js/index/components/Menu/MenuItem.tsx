import {IMenu} from "../../interfaces/IMenu";
import './MenuItem.css';
import axios from "axios";
import {StaticMap, MapMarker} from "react-kakao-maps-sdk";

interface props {
    menu: IMenu;
    onDelete?: (menuId: number) => void;
}

const MenuItem = (props: props) => {

    const deleteClickHandler = async (e: React.MouseEvent) => {
        const clickedBtn = e.currentTarget as HTMLElement;
        const targetMenuId = Number(clickedBtn.dataset?.id);
        await axios.delete(`/api/menu/${targetMenuId}`);
        props.onDelete(targetMenuId);
    }

    return (
        <div className='card mt-2 p-3'>
            <div className='row'>
                <div className='col-11 menu-title'>
                    <div> {props.menu.name} </div>
                </div>
                {props.onDelete &&
                    <div className='col-1 text-end'>
                        <button
                            className='btn btn-sm btn-outline-secondary'
                            data-id={props.menu.id}
                            onClick={deleteClickHandler}
                        >X
                        </button>
                    </div>
                }
            </div>
            <div className='row justify-content-center'>
                <div className='menu-detail card mt-2 p-3'>
                    <div className='row'>
                        <div className='thumbnailCover col-md-5'>
                            <img id='menuThumbnail'
                                 src='https://gimhaemall.kr/thumb/d593060f9bf1cef1b7c8c1e58464c59a/620_620_6f146781c02c0462629148479637.jpg'
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
                        <div id={'mapWrapper'} className='col'>
                            <StaticMap
                                center={{lat: props.menu.latitude, lng: props.menu.longitude}}
                                style={{width: "100%", minHeight: "360px", border: "1px solid gray"}}
                                marker={true}
                                level={3}
                            >
                            </StaticMap>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuItem;