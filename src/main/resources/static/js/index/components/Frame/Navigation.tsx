import "./Navigation.css"
import NavigationDropDown from "./NavigationDropDown";

const Navigation = () => {
    return (
        <>
            <nav className="navbar sticky-top navbar-light bg-light border-bottom">
                <div className="container-fluid">
                <span className="navbar-text">
                    <a className="navbar-brand" href="/">GOURMET PICK</a>
                </span>
                    <NavigationDropDown/>
                </div>
            </nav>
        </>
    )
}

export default Navigation
