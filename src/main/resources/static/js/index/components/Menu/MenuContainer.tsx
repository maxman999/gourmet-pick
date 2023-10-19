import "./MenuContainer.css"
import * as React from "react";

type props = {
    children: React.ReactNode;
}

const MenuContainer = (props: props) => {
    return (
        <div className={"menuContainer mt-2 mb-4"}>
            {props.children}
        </div>
    );

}

export default MenuContainer