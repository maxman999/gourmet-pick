import {useRef, useEffect, useContext, useState} from "react";
import './MenuUpdateForm.css';
import {Map, MapMarker} from "react-kakao-maps-sdk";
import roomContext from "../../store/room-context";
import Modal from "../UI/Modal";
import MapUploadTool from "../Map/MapUploadTool";
import EmptyBox from "../UI/EmptyBox";
import * as _ from 'lodash';
import CommonUtils from "../../utils/websocket/CommonUtils";
import {IMenu} from "../../interfaces/IMenu";
import axios from "axios";

const MenuUpdateForm = () => {

    const roomCtx = useContext(roomContext);

    const [menuName, setMenuName] = useState('');
    const [isMenuNameValid, setIsMenuNameValid] = useState(false);
    const [location, setLocation] = useState({placeName: '', longitude: 0, latitude: 0});
    const [thumbnail, setThumbnail] = useState<any>();
    const [soberComment, setSoberComment] = useState('');
    const [isSoberCommentValid, setIsSoberCommentValid] = useState(false);
    const [isUpdateModalPopped, setIsUpdateModalPopped] = useState(false);
    const [uploadBtnMessage, setUploadBtnMessage] = useState('')
    const [isUploadPossible, setIsUploadPossible] = useState(false)

    const menuNameInputRef = useRef(null);
    const soberCommentInputRef = useRef(null);
    const submitButtonRef = useRef(null);
    const imageUploadRef = useRef(null);

    const isPlaceSelected = location.longitude + location.latitude > 0;

    const menuNameChangeHandler = _.debounce(() => {
        const inputVal = menuNameInputRef.current.value.trim();
        if (inputVal.length > 0) {
            setIsMenuNameValid(true);
            setMenuName(CommonUtils.filterHtmlTags(inputVal));
        } else {
            setIsMenuNameValid(false);
            setMenuName('');
        }
    }, 500);

    const soberCommentChangeHandler = _.debounce(() => {
        const inputVal = soberCommentInputRef.current.value.trim();
        if (inputVal.length > 0) {
            setIsSoberCommentValid(true);
            setSoberComment(CommonUtils.filterHtmlTags(inputVal));
        } else {
            setIsSoberCommentValid(false);
            setSoberComment('');
        }
    }, 500);

    const mapUploadHandler = () => {
        setIsUpdateModalPopped(true);
    }

    const thumbnailUploadHandler = () => {
        imageUploadRef.current.click();
    }

    const thumbnailChangeHandler = async () => {
        const file = imageUploadRef.current.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            setThumbnail(imageData);
        }
        reader.readAsDataURL(file);
    }

    const locationChangeHandler = (placeName: string, longitude: number, latitude: number) => {
        setLocation({
            placeName: placeName,
            longitude: longitude,
            latitude: latitude
        })
    }

    const observeFormValidity = () => {
        let btnMsg = "등록하기";
        let isUploadPossible = true;

        if (!isSoberCommentValid) {
            btnMsg = "냉정한 한줄평을 작성해주세요.";
            isUploadPossible = false;
        }

        if (!isPlaceSelected) {
            btnMsg = "위치 정보를 입력해주세요.";
            isUploadPossible = false;
        }

        if (!thumbnail) {
            btnMsg = "메뉴 사진을 등록해주세요."
        }

        if (!isMenuNameValid) {
            btnMsg = "메뉴이름을 입력해주세요.";
            isUploadPossible = false;
        }

        setUploadBtnMessage(btnMsg);
        setIsUploadPossible(isUploadPossible);
    }

    const submitClickHandler = async () => {
        const newMenu: IMenu = {
            name: menuName,
            latitude: location?.latitude,
            longitude: location?.longitude,
            soberComment: soberComment,
            thumbnail: thumbnail,
            roomId: roomCtx.roomInfo?.id,
        }
        // 사진 스토리지에 저장
        const formData = new FormData();
        formData.append('uploadFiles', imageUploadRef.current.files[0]);
        const {data: result} = await axios.post('/api/menu/uploadMenuImage', formData);
        if (result) {
            console.log({result})
            newMenu.thumbnail = result[0].thumbnailURL;
        }
        const {data: res} = await axios.post("/api/menu/add", newMenu);
        roomCtx.changeRoomPhase('default');
    }

    const updateCancelHandler = () => {
        roomCtx.changeRoomPhase('default');
    }

    const modalCloseHandler = () => {
        setIsUpdateModalPopped(false);
    }

    useEffect(() => {
        menuNameInputRef.current.focus();
    }, []);

    useEffect(() => {
        observeFormValidity();
    }, [menuName, soberComment, location, thumbnail]);

    return (
        <div className={`menu-update-container row card mt-3 p-3 menu-update-active`}>
            <div className='row m-0 p-0"'>
                <div className='text-end'>
                    <span className='room-title'> # {roomCtx.roomInfo?.name} </span>
                    <span className='room-code'>({roomCtx.roomInfo?.invitationCode})</span>
                </div>
            </div>
            <div className='row'>
                <div className='col menu-title'>
                    <div className="input-group">
                        <input id='menuNameInput'
                               className={'form-control pt-0'}
                               type='text'
                               placeholder='메뉴 이름을 입력해주세요.'
                               onChange={menuNameChangeHandler}
                               ref={menuNameInputRef}/>
                    </div>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='menu-detail card mt-2 p-3'>
                    <div className='row'>
                        <div className='col-md-5'>

                            <>
                                {thumbnail &&
                                    <img id='menuThumbnail'
                                         src={thumbnail}
                                         alt='메뉴 썸네일 미리보기'>
                                    </img>
                                }
                                {!thumbnail &&
                                    <EmptyBox minHeight={'250px'} clickHandler={thumbnailUploadHandler}/>
                                }
                                <input onChange={thumbnailChangeHandler} type={'file'} ref={imageUploadRef}
                                       style={{display: 'none'}}/>
                            </>
                            <hr/>
                            <div>
                                <div id={'soberCommentTitle'}>냉정한 한줄평</div>
                                <textarea id={'soberCommentInput'}
                                          className={'w-100'}
                                          placeholder={"냉정한 미식가의 평가를 입력해주세요."}
                                          maxLength={40}
                                          onChange={soberCommentChangeHandler}
                                          ref={soberCommentInputRef}
                                />
                            </div>
                        </div>
                        <div id={'mapWrapper'} className='col'>
                            {isPlaceSelected &&
                                < Map
                                    center={{lat: location.latitude, lng: location.longitude}}
                                    style={{width: "100%", minHeight: "360px", border: "1px solid gray"}}
                                >
                                    <MapMarker position={{lat: location.latitude, lng: location.longitude}}>
                                        {location.placeName}
                                    </MapMarker>
                                </Map>
                            }
                            {!isPlaceSelected &&
                                <EmptyBox clickHandler={mapUploadHandler} minHeight={'360px'}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row p-4 pt-3">
                <div id={'updateSubmitBtnWrap'} className={'col-md-10'}>
                    <button className="btn btn-outline-primary w-100"
                            onClick={submitClickHandler}
                            ref={submitButtonRef}
                            disabled={!isUploadPossible}
                    >
                        {uploadBtnMessage}
                    </button>
                </div>
                <div id={'updateCancelBtnWrap'} className={'col'}>
                    <button id={'updateCancelBtn'}
                            className={'btn btn-outline-danger w-100'}
                            onClick={updateCancelHandler}> X
                    </button>
                </div>
            </div>
            {isUpdateModalPopped &&
                <Modal
                    height={'470px'}
                    onClose={modalCloseHandler}>
                    <MapUploadTool onLocationChange={locationChangeHandler}
                                   onModalClose={modalCloseHandler}
                    />
                </Modal>
            }
        </div>
    );
}

export default MenuUpdateForm;