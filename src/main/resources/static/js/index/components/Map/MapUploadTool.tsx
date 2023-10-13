import {Map, MapMarker} from "react-kakao-maps-sdk";
import {useEffect, useRef, useState} from "react";
import "./MapUploadTool.css"

type props = {
    onLocationChange: (placeName: string, longitude: number, latitude: number) => void
    onModalClose: () => void
}

const MapUploadTool = (props: props) => {
    const [info, setInfo] = useState<any>()
    const [markers, setMarkers] = useState([])
    const [map, setMap] = useState<any>()
    const [searchResult, setSearchResult] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('이태원 맛집')

    const placeSearchInputRef = useRef(null);
    const placeListRefs = useRef([]);
    placeListRefs.current = [];

    let selectedLocation = {
        placeName: '',
        longitude: 0,
        latitude: 0
    }

    const addToListRefs = (el: HTMLElement) => {
        if (el && !placeListRefs.current.includes(el)) {
            placeListRefs.current.push(el);
        }
    }

    const searchClickHandler = () => {
        const inputValue = placeSearchInputRef.current.value;
        setSearchKeyword(inputValue);
    }

    const placeClickHandler = (index: number) => {
        const targetEl = placeListRefs.current[index] as HTMLElement;
        // cleanup
        placeListRefs.current.forEach(el => {
            el.style.backgroundColor = '';
        })
        targetEl.style.backgroundColor = 'aliceblue';

        const placeName = targetEl.dataset.placeName;
        const latitude = Number(targetEl.dataset.latitude);
        const longitude = Number(targetEl.dataset.longitude);
        const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
        map.setLevel(2);
        map.setCenter(moveLatLon);

        selectedLocation = {placeName, longitude, latitude};
    }

    const mapSelectHandler = () => {
        props.onLocationChange(selectedLocation.placeName, selectedLocation.longitude, selectedLocation.latitude);
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
        <div className={`map_wrap row`}>
            <div className={'col'}>
                <Map // 로드뷰를 표시할 Container
                    center={{
                        lat: 37.566826,
                        lng: 126.9786567,
                    }}
                    style={{
                        width: "100%",
                        height: "430px",
                    }}
                    level={3}
                    onCreate={setMap}
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
            <div id={'search-wrapper'} className={'col-md-4'}>
                <div className={'search-area'}>
                    <div className="input-group mb-1">
                        <input type="text" className="form-control" id={'placeSearchInput'}
                               placeholder={'검색어를 입력해주세요'}
                               ref={placeSearchInputRef}
                        />
                        <button className="btn btn-success btn-sm" onClick={searchClickHandler}>O</button>
                    </div>
                    <div className="list-group">
                        {searchResult.map((place, index) => {
                            return (
                                <a className={'list-group-item list-group-item-action list-group-item-light'}
                                   key={index}
                                   ref={addToListRefs}
                                   onClick={() => placeClickHandler(index)}
                                   data-place-name={place.place_name}
                                   data-latitude={place.y}
                                   data-longitude={place.x}
                                >
                                    <div className={'place-title'}>{place.place_name}</div>
                                    <div className={'place-location'}>{place.road_address_name}</div>
                                </a>
                            )
                        })}
                    </div>
                </div>
                <button className={'btn btn-sm btn-outline-success w-100 mt-2'}
                        onClick={mapSelectHandler}> 등록하기
                </button>
            </div>
        </div>

    );
}

export default MapUploadTool;