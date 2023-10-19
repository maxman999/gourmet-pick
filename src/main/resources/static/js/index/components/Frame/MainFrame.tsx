import "./MainFrame.css"
import Navigator from "./Navigator";

type props = {
    children: React.ReactNode;
}


const MainFrame = (props: props) => {

    return (
        <div id={"main-container"}>
            <Navigator/>
            {props.children}
        </div>
    )

}

export default MainFrame