import {useContext, useEffect, useRef, useState} from "react";
import './MenuUpdateForm.css';
import {Map, MapMarker} from "react-kakao-maps-sdk";
import roomContext from "../../store/room-context";
import Modal from "../UI/Modal";
import MapUploadTool from "../Map/MapUploadTool";
import EmptyBox from "../UI/EmptyBox";
import * as _ from 'lodash';
import CommonUtils from "../../utils/CommonUtils";
import {IMenu} from "../../types/IMenu";
import axios from "axios";
import MenuContainer from "./MenuContainer";
import RoomPhase from "../../types/RoomPhase";
import {ILocationInfo} from "../../types/ILocationInfo";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

const MenuUpdateForm = () => {
    const roomCtx = useContext(roomContext);

    const [menuName, setMenuName] = useState('');
    const [isMenuNameValid, setIsMenuNameValid] = useState(false);
    const [location, setLocation] = useState<ILocationInfo>(null);
    const [thumbnail, setThumbnail] = useState<any>();
    const [prevThumbnailFileName, setPrevThumbnailFileName] = useState('');
    const [isThumbnailChanged, setIsThumbnailChanged] = useState(false);
    const [soberComment, setSoberComment] = useState('');
    const [isSoberCommentValid, setIsSoberCommentValid] = useState(false);
    const [isUpdateModalPopped, setIsUpdateModalPopped] = useState(false);
    const [uploadBtnMessage, setUploadBtnMessage] = useState('')
    const [isUploadPossible, setIsUploadPossible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const menuNameInputRef = useRef(null);
    const soberCommentInputRef = useRef(null);
    const submitButtonRef = useRef(null);
    const imageUploadRef = useRef(null);
    const thumbnailImgRef = useRef(null);

    const isMenuModify = roomCtx.updateTargetMenuId > 0;
    const isPlaceSelected = location?.longitude + location?.latitude > 0;

    const menuNameChangeHandler = _.debounce(() => {
        const inputVal = menuNameInputRef.current.value.trim();
        const filteredInputVal = CommonUtils.filterHtmlTags(inputVal);

        if (filteredInputVal.length === 0) {
            setUploadBtnMessage('메뉴 이름이 입력되지 않았습니다.');
            setIsMenuNameValid(false);
            return;
        }

        if (filteredInputVal.length > 15) {
            setUploadBtnMessage('메뉴 이름에 허용되지 않은 문자가 있습니다.');
            setIsMenuNameValid(false);
            return;
        }

        if (inputVal.length > 0) {
            setMenuName(CommonUtils.filterHtmlTags(inputVal));
            setIsMenuNameValid(true);
            return;
        }

        setIsMenuNameValid(false);
        setMenuName('');
    }, 300);

    const soberCommentChangeHandler = _.debounce(() => {
        const filteredInputVal = CommonUtils.filterHtmlTags(soberCommentInputRef.current.value.trim());

        if (filteredInputVal.length === 0) {
            setIsSoberCommentValid(false);
            setUploadBtnMessage('냉정한 한줄평이 입력되지 않았습니다.');
            return;
        }

        if (filteredInputVal.length > 30) {
            setIsSoberCommentValid(false);
            setUploadBtnMessage('한줄평에 허용되지 않은 문자가 있습니다.');
            return;
        }

        if (filteredInputVal.length > 0) {
            setIsSoberCommentValid(true);
            setSoberComment(filteredInputVal);
            return;
        }

        setIsSoberCommentValid(false);
        setSoberComment('');
    }, 300);

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
            setIsThumbnailChanged(true);
        }
        reader.readAsDataURL(file);
    }

    const locationChangeHandler = (locationInfo: ILocationInfo) => {
        setLocation(locationInfo);
    }

    const observeFormValidity = () => {
        let btnMsg = isMenuModify ? "수 정 하 기" : "등 록 하 기";
        let isUploadPossible = true;

        if (!isSoberCommentValid) {
            btnMsg = "냉정한 한줄평을 확인해주세요.";
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
            btnMsg = "메뉴 이름을 확인해주세요.";
            isUploadPossible = false;
        }

        setUploadBtnMessage(btnMsg);
        setIsUploadPossible(isUploadPossible);
    }

    // 사진 스토리지에 저장
    const uploadThumbnail = async () => {
        const formData = new FormData();
        formData.append('uploadFiles', imageUploadRef.current.files[0]);
        const {data: result} = await axios.post('/api/menu/uploadMenuImageFile', formData);
        if (result) {
            return result[0].thumbnailURL;
        }
    }

    const deleteThumbnailFileOnModify = (imageFileName: string) => {
        axios.post('/api/menu/deleteMenuImageFile', {imageFileName: imageFileName});
    }

    const submitClickHandler = _.debounce(async () => {
        setIsSubmitting(true);

        const user = CommonUtils.getUserFromSession();
        const URL = `/api/menu/${isMenuModify ? 'update' : 'insert'}`;

        const newMenu: IMenu = {
            id: roomCtx.updateTargetMenuId,
            name: menuName,
            latitude: location?.latitude,
            longitude: location?.longitude,
            placeName: location?.placeName,
            roadAddressName: location?.roadAddressName,
            soberComment: soberComment,
            thumbnail: thumbnail,
            roomId: roomCtx.roomInfo?.id,
            writerId: user.id,
        }

        if (isThumbnailChanged) {
            if (isMenuModify) deleteThumbnailFileOnModify(prevThumbnailFileName);
            newMenu.thumbnail = await uploadThumbnail();
        }

        const {data: res} = await axios.post(URL, newMenu);
        if (res > 0) {
            CommonUtils.toaster(`메뉴가 ${isMenuModify ? '수정' : '등록'} 되었습니다!`, 'top');
        } else {
            await Swal.fire({title: '요청을 처리하지 못했습니다.', text: '잠시 후 다시 시도해주세요.', icon: 'error'});
            setIsSubmitting(false);
        }
        roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
    }, 300);

    const updateCancelHandler = () => {
        roomCtx.changeRoomPhase(RoomPhase.DEFAULT);
    }

    const modalCloseHandler = () => {
        setIsUpdateModalPopped(false);
    }

    const setTargetMenuInfo = async (menuId: number) => {
        const {data:menu}:{data:IMenu} = await axios.get(`api/menu/${menuId}`);
        menu.name = CommonUtils.bringBackHtmlTags(menu.name);
        setMenuName(menu.name);
        setIsMenuNameValid(true);
        menuNameInputRef.current.value = menu.name;

        menu.soberComment = CommonUtils.bringBackHtmlTags(menu.soberComment);
        setSoberComment(menu.soberComment);
        setIsSoberCommentValid(true);
        soberCommentInputRef.current.value = menu.soberComment;

        setPrevThumbnailFileName(menu.thumbnail);
        setThumbnail(menu.thumbnail);

        setLocation({
            placeName: menu.placeName,
            roadAddressName: menu.roadAddressName,
            longitude: menu.longitude,
            latitude: menu.latitude
        });
    }

    useEffect(() => {
        if (isMenuModify) setTargetMenuInfo(roomCtx.updateTargetMenuId);
        menuNameInputRef.current.focus();

        return () => {
            roomCtx.setUpdateTargetMenu(0)
        };
    }, []);

    useEffect(() => {
        observeFormValidity();
    }, [menuName, soberComment, location, thumbnail]);

    return (
        <MenuContainer>
            <div className={"menu-update-active"}>
                <div className='card mt-3 p-3'>
                    <div className='row mb-2'>
                        <div className='col menu-title'>
                            <div className="input-group">
                                <input id='menuNameInput'
                                       className={'form-control'}
                                       type='text'
                                       maxLength={15}
                                       placeholder='메뉴 이름을 입력해주세요.'
                                       onChange={menuNameChangeHandler}
                                       onFocus={menuNameChangeHandler}
                                       ref={menuNameInputRef}/>
                            </div>
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div id={'mapWrapper'} className='col mb-2'>
                            {isPlaceSelected &&
                                < Map
                                    center={{lat: location.latitude, lng: location.longitude}}
                                    style={{width: "100%", minHeight: "360px", border: "1px solid gray"}}
                                    onClick={mapUploadHandler}
                                >
                                    <MapMarker position={{lat: location.latitude, lng: location.longitude}}>
                                        {location.placeName}
                                    </MapMarker>
                                </Map>
                            }
                            {!isPlaceSelected &&
                                <EmptyBox clickHandler={mapUploadHandler}
                                          minHeight={'360px'}
                                          caption={'위치정보를 등록해주세요.'}
                                />
                            }
                        </div>
                        <div className='col-md-5'>
                            <>
                                {thumbnail &&
                                    <img className='menuThumbnailUpdateForm'
                                         ref={thumbnailImgRef}
                                         src={!isThumbnailChanged ? `/api/menu/getMenuImageURL?fileName=${thumbnail}` : thumbnail}
                                         alt='메뉴 썸네일 미리보기'
                                         onClick={thumbnailUploadHandler}>
                                    </img>
                                }
                                {!thumbnail &&
                                    <EmptyBox minHeight={'265px'}
                                              clickHandler={thumbnailUploadHandler}
                                              caption={"사진을 등록해주세요."}
                                    />
                                }
                                <input onChange={thumbnailChangeHandler}
                                       type={'file'}
                                       accept={"image/*"}
                                       ref={imageUploadRef}
                                       style={{display: 'none'}}/>
                            </>
                            <hr/>
                            <div className={"mb-2"}>
                                <div id={'soberCommentTitle'}>냉정한 한줄평</div>
                                <textarea id={'soberCommentInput'}
                                          className={'w-100'}
                                          placeholder={"냉정한 미식가의 평가를 입력해주세요."}
                                          maxLength={30}
                                          onChange={soberCommentChangeHandler}
                                          onFocus={soberCommentChangeHandler}
                                          ref={soberCommentInputRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div id={'updateSubmitBtnWrap'} className={'col-md-10 mt-2'}>
                        <button className="btn btn-outline-primary w-100"
                                onClick={submitClickHandler}
                                ref={submitButtonRef}
                                disabled={!isUploadPossible || isSubmitting}
                        >
                            {!isSubmitting && uploadBtnMessage}
                            {isSubmitting &&
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spinPulse size={'lg'}/>
                                </>
                            }
                        </button>
                    </div>
                    <div id={'updateCancelBtnWrap'} className={'col-md-2 mt-2 mb-3'}>
                        <button id={'updateCancelBtn'}
                                className={'btn btn-outline-danger w-100'}
                                onClick={updateCancelHandler}
                                disabled={isSubmitting}> 취소
                        </button>
                    </div>
                </div>
            </div>
            {isUpdateModalPopped &&
                <Modal top={'3vh'}
                       onClose={modalCloseHandler}>
                    <MapUploadTool onLocationChange={locationChangeHandler}
                                   onModalClose={modalCloseHandler}
                    />
                </Modal>
            }
        </MenuContainer>
    );
}

export default MenuUpdateForm;