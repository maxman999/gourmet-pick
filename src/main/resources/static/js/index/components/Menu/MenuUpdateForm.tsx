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
import {ILocationInfo} from "../../types/ILocationInfo";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

const MenuUpdateForm = () => {
    const roomCtx = useContext(roomContext);
    const navigate = useNavigate();

    const [menuName, setMenuName] = useState('');
    const [isMenuNameValid, setIsMenuNameValid] = useState(false);
    const [location, setLocation] = useState<ILocationInfo>(null);
    const [thumbnail, setThumbnail] = useState<any>();
    const [thumbnailUploadFile, setThumbnailUploadFile] = useState<File>();
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

    const menuNameChangeHandler = () => {
        const inputVal = menuNameInputRef.current.value.trim();
        const filteredInputVal = CommonUtils.filterHtmlTags(inputVal);
        setMenuName(filteredInputVal);

        if (filteredInputVal.length === 0) {
            setUploadBtnMessage('메뉴 이름을 확인해주세요.');
            setIsMenuNameValid(false);
            return;
        }

        if (filteredInputVal.length > 15) {
            setUploadBtnMessage('메뉴 이름에 허용되지 않은 문자가 있습니다.');
            setIsMenuNameValid(false);
            return;
        }

        if (inputVal.length > 0) {
            setIsMenuNameValid(true);
            return;
        }
    };

    const soberCommentChangeHandler = () => {
        const filteredInputVal = CommonUtils.filterHtmlTags(soberCommentInputRef.current.value.trim());
        setSoberComment(filteredInputVal);

        if (filteredInputVal.length === 0) {
            setIsSoberCommentValid(false);
            setUploadBtnMessage('냉정한 한줄 평이 입력되지 않았습니다.');
            return;
        }

        if (filteredInputVal.length > 30) {
            setIsSoberCommentValid(false);
            setUploadBtnMessage('한줄 평이 너무 길거나, 허용되지 않은 문자가 입력됐습니다.');
            return;
        }

        if (filteredInputVal.length > 0) {
            setIsSoberCommentValid(true);
            return;
        }
    };

    const mapUploadHandler = () => {
        setIsUpdateModalPopped(true);
    }

    const thumbnailUploadHandler = () => {
        imageUploadRef.current.click();
    }

    const thumbnailChangeHandler = async () => {
        const file = imageUploadRef.current.files[0];
        if (!file) return;

        const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const hasHeicExtension = /\.(heic|heif)$/i.test(file.name);
        let isHeicFile = hasHeicExtension || ['image/heic', 'image/heif'].includes(file.type);
        if (!isHeicFile && !supportedTypes.includes(file.type)) {
            try {
                const {isHeic} = await import('heic-to');
                isHeicFile = await isHeic(file);
            } catch (error) {
                isHeicFile = false;
            }
        }

        if (!supportedTypes.includes(file.type) && !isHeicFile) {
            imageUploadRef.current.value = '';
            await Swal.fire({
                title: '지원하지 않는 이미지 형식입니다.',
                text: 'JPEG, PNG, WebP 또는 HEIC 파일을 선택해주세요.',
                icon: 'warning'
            });
            return;
        }

        try {
            const heicConverter = isHeicFile ? await import('heic-to') : null;
            const uploadFile = isHeicFile
                ? new File(
                    [await heicConverter.heicTo({blob: file, type: 'image/jpeg', quality: .9})],
                    file.name.replace(/\.(heic|heif)$/i, '') + '.jpg',
                    {type: 'image/jpeg'},
                )
                : file;

            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnail(e.target.result);
                setThumbnailUploadFile(uploadFile);
                setIsThumbnailChanged(true);
            }
            reader.readAsDataURL(uploadFile);
        } catch (error) {
            imageUploadRef.current.value = '';
            setThumbnailUploadFile(undefined);
            await Swal.fire({
                title: 'HEIC 이미지를 변환하지 못했습니다.',
                text: '다른 이미지를 선택하거나 JPEG로 변환한 뒤 다시 시도해주세요.',
                icon: 'warning',
            });
        }
    }

    const locationChangeHandler = (locationInfo: ILocationInfo) => {
        setLocation(locationInfo);

        const currentMenuName = menuNameInputRef.current.value.trim();
        if (currentMenuName.length === 0 && locationInfo?.placeName) {
            const suggestedMenuName = locationInfo.placeName.trim().slice(0, 15);
            menuNameInputRef.current.value = suggestedMenuName;
            setMenuName(CommonUtils.filterHtmlTags(suggestedMenuName));
            setIsMenuNameValid(suggestedMenuName.length > 0);
        }
    }

    const observeFormValidity = () => {
        let btnMsg = isMenuModify ? "수 정 하 기" : "등 록 하 기";
        const isFormValid = isMenuNameValid
            && isPlaceSelected
            && !!thumbnail
            && isSoberCommentValid;

        if (!isSoberCommentValid) {
            btnMsg = "냉정한 한줄 평을 확인해주세요.";
        }

        if (!isPlaceSelected) {
            btnMsg = "위치 정보를 입력해주세요.";
        }

        if (!thumbnail) {
            btnMsg = "메뉴 사진을 등록해주세요."
        }

        if (!isMenuNameValid) {
            btnMsg = "메뉴 이름을 확인해주세요.";
        }

        setUploadBtnMessage(btnMsg);
        setIsUploadPossible(isFormValid);
    }

    // 사진 스토리지에 저장
    const uploadThumbnail = async () => {
        const formData = new FormData();
        formData.append('uploadFiles', thumbnailUploadFile || imageUploadRef.current.files[0]);
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
        navigate(`/rooms/${roomCtx.roomInfo.invitationCode}`, {replace: true});
    }, 300);

    const updateCancelHandler = async () => {
        const confirmResult = await CommonUtils.confirm(
            '취소하시겠습니까?',
            '입력한 내용은 저장되지 않습니다.',
            '취소하기',
            '이어서 작성하기'

        );
        if (!confirmResult.isConfirmed) return;

        navigate(`/rooms/${roomCtx.roomInfo.invitationCode}`, {replace: true});
    }

    const modalCloseHandler = () => {
        setIsUpdateModalPopped(false);
    }

    const setTargetMenuInfo = async (menuId: number) => {
        const {data:menu}:{data:IMenu} = await axios.get(`/api/menu/${menuId}`);
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
        if (isMenuModify) return;

        const removeMenuAddHistory = () => {
            const roomPath = `/rooms/${roomCtx.roomInfo.invitationCode}`;

            // 뒤로가기로 도착한 방 화면을 새 기록으로 넣어
            // 메뉴 추가 화면이 앞으로가기 기록에 남지 않도록 한다.
            navigate(roomPath);
        };

        window.addEventListener('popstate', removeMenuAddHistory);
        return () => window.removeEventListener('popstate', removeMenuAddHistory);
    }, [isMenuModify, navigate, roomCtx.roomInfo.invitationCode]);

    useEffect(() => {
        observeFormValidity();
    }, [isMenuNameValid, isSoberCommentValid, isPlaceSelected, thumbnail]);

    return (
        <MenuContainer>
            <div className={"menu-update-active"}>
                <div className='card mt-1 p-3'>
                    <div className='row'>
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
                        <div id={'mapWrapper'} className='menuMapColumn col mb-2'>
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
                        <div className='menuDetailsColumn col-md-5'>
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
                                       accept={"image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"}
                                       ref={imageUploadRef}
                                       style={{display: 'none'}}/>
                            </>
                            <hr/>
                            <div className={"mb-2"}>
                                <textarea className={'soberCommentInput w-100'}
                                          placeholder={"냉정한 미식가의 한 줄 평가를 입력해주세요."}
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
                    <div id={'updateCancelBtnWrap'} className={'col-md-2 mt-2'}>
                        <button id={'updateCancelBtn'}
                                className={'btn btn-outline-danger w-100'}
                                onClick={updateCancelHandler}
                                disabled={isSubmitting}> 취소
                        </button>
                    </div>
                    <div id={'updateSubmitBtnWrap'} className={'col-md-10 mt-2 mb-3'}>
                        <button className="btn btn-primary menuSubmitBtn w-100"
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
