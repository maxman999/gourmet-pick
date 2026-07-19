import "./MyRoomContainer.css"

type props = {
    children: React.ReactNode,
    className?: string,
}

const MyRoomContainer = (props: props) => {
    return (
        <div className={'col-12 col-sm-6 col-lg-4 mt-3'}>
            <div className={`roomWrapper card p-3 ${props.className || ''}`}>
                {props.children}
            </div>
        </div>
    )
}

export default MyRoomContainer;
