import "./Navigation.css"
import NavigationDropDown from "./NavigationDropDown";
import {MouseEvent} from "react";

const Navigation = () => {
    const logoClickHandler = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        const appHistoryIndex = Number(window.history.state?.idx || 0);
        if (appHistoryIndex <= 0) {
            window.location.replace('/');
            return;
        }

        const moveToFreshHome = () => window.location.replace('/');
        window.addEventListener('popstate', moveToFreshHome, {once: true});
        window.history.go(-appHistoryIndex);
    };

    return (
        <>
            <nav className="navbar sticky-top navbar-light bg-light border-bottom">
                <div className="container-fluid">
                <span className="navbar-text">
                    <a className="navbar-brand" href="/" onClick={logoClickHandler}>GOURMET PICK</a>
                </span>
                    <NavigationDropDown/>
                </div>
            </nav>
        </>
    )
}

export default Navigation
