import "./MyRoomContainer.css"

type props = {
    children: React.ReactNode
}

const MyRoomContainer = (props: props) => {
    return (
        <div className={'col-md-3 mt-3'}>
            <div className={'roomWrapper card p-3'}>
                {props.children}
            </div>
        </div>
    )
}

export default MyRoomContainer;