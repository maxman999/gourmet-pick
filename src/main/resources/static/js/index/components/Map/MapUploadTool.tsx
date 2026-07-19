import {Map, MapMarker} from "react-kakao-maps-sdk";
import {useEffect, useRef, useState} from "react";
import "./MapUploadTool.css"
import {ILocationInfo} from "../../types/ILocationInfo";
import CommonUtils from "../../utils/CommonUtils";
import * as _ from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

type props = {
    onLocationChange: (locationInfo: ILocationInfo) => void
    onModalClose: () => void
}

const MapUploadTool = (props: props) => {
    const [info, setInfo] = useState<any>();
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState<any>();
    const [searchResult, setSearchResult] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('이태원 맛집');
    const [selectedLocation, setSelectedLocation] = useState<ILocationInfo>(null);
    const [selectedPlaceIndex, setSelectedPlaceIndex] = useState<number>(null);

    const placeSearchInputRef = useRef(null);

    const searchClickHandler = _.debounce(() => {
        const inputValue = placeSearchInputRef.current.value.trim();
        if (inputValue.length === 0) return;
        setSelectedLocation(null);
        setSelectedPlaceIndex(null);
        setSearchKeyword(inputValue);
    }, 300);

    const placeClickHandler = (index: number) => {
        const place = searchResult[index];
        if (!place || !map) return;

        const placeName = place.place_name;
        const roadAddressName = place.road_address_name;
        const latitude = Number(place.y);
        const longitude = Number(place.x);
        setSelectedLocation({placeName, roadAddressName, longitude, latitude});
        setSelectedPlaceIndex(index);
        const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
        map.setLevel(2);
        map.setCenter(moveLatLon);

    }

    const mapSelectHandler = () => {
        if (!selectedLocation) return;
        props.onLocationChange(selectedLocation);
        props.onModalClose();
    }


    useEffect(() => {
        if (!map) return
        const ps = new kakao.maps.services.Places()

        ps.keywordSearch(searchKeyword, (data, status, _pagination) => {
            setSearchResult(data)
            if (status === kakao.maps.services.Status.OK) {
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                const bounds = new kakao.maps.LatLngBounds()
                let markers = []

                for (var i = 0; i < data.length; i++) {
                    // @ts-ignore
                    markers.push({
                        position: {
                            lat: data[i].y,
                            lng: data[i].x,
                        },
                        content: data[i].place_name,
                    })
                    // @ts-ignore
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
                }
                setMarkers(markers)
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                // @ts-ignore
                map.setBounds(bounds)
            }
        })
    }, [map, searchKeyword])

    return (
        <div className={`map_wrap`}>
            <div className={'row p-2'}>
                <Map // 로드뷰를 표시할 Container
                    center={{
                        lat: 37.566826,
                        lng: 126.9786567,
                    }}
                    style={{
                        width: "100%",
                        height: "300px",
                        border: "1px solid gray"
                    }}
                    level={3}
                    onCreate={setMap}
                    zoomable={false}
                >
                    {markers.map((marker) => (
                        <MapMarker
                            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                            position={marker.position}
                            onClick={() => setInfo(marker)}
                        >
                            {info && info.content === marker.content && (
                                <div style={{color: "#000"}}>{marker.content}</div>
                            )}
                        </MapMarker>
                    ))}
                </Map>
            </div>
            <div id={'search-wrapper'} className={'row'}>
                <div className={'search-area'}>
                    <div className="input-group mb-1">
                        <input type="text"
                               className="form-control"
                               id={'placeSearchInput'}
                               onKeyDown={(e) => CommonUtils.handleEnterKeyPress(e, searchClickHandler)}
                               placeholder={'검색어를 입력해주세요'}
                               ref={placeSearchInputRef}
                               onChange={searchClickHandler}
                        />
                        <button className="btn btn-primary btn-sm" onClick={searchClickHandler}
                                aria-label={'장소 검색'} title={'장소 검색'}>
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </button>
                    </div>
                    <div className="list-group">
                        {searchResult.map((place, index) => {
                            return (
                                <a className={`list-group-item list-group-item-action list-group-item-light ${selectedPlaceIndex === index ? 'selected' : ''}`}
                                   key={index}
                                   onClick={() => placeClickHandler(index)}
                                   role={'button'}
                                >
                                    <div className={'place-title'}>{place.place_name}</div>
                                    <div className={'place-location'}>{place.road_address_name}</div>
                                </a>
                            )
                        })}
                        {searchResult.length === 0 &&
                            <a className={'list-group-item list-group-item-action list-group-item-light text-center'}>
                                <div> 해당 장소를 찾을 수 없습니다.</div>
                            </a>
                        }
                    </div>
                </div>
            </div>
            <div className={"row p-2 mt-1"}>
                <button className={'btn btn-sm btn-outline-success'}
                        disabled={!selectedLocation}
                        onClick={mapSelectHandler}> 등록하기
                </button>
            </div>
        </div>

    );
}

export default MapUploadTool;
