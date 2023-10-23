import "./MainFrame.css"
import Navigation from "./Navigation";

type props = {
    children: React.ReactNode;
}


const MainFrame = (props: props) => {

    return (
        <div id={"main-container"}>
            <Navigation/>
            {props.children}
        </div>
    )

}

export default MainFrame