import "./RoomContainer.css"
import * as React from "react";

type props = {
    children: React.ReactNode;
}

const RoomContainer = (props: props) => {
    return (
        <div id={"roomContainer"} className={"container"}>
            {props.children}
        </div>
    );
}

export default RoomContainer;