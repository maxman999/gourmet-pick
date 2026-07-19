import "./Navigation.css"
import NavigationDropDown from "./NavigationDropDown";
import {Link} from "react-router-dom";

const Navigation = () => {
    return (
        <>
            <nav className="navbar sticky-top navbar-light bg-light border-bottom">
                <div className="container-fluid">
                <span className="navbar-text">
                    <Link className="navbar-brand" to="/" replace>GOURMET PICK</Link>
                </span>
                    <NavigationDropDown/>
                </div>
            </nav>
        </>
    )
}

export default Navigation
