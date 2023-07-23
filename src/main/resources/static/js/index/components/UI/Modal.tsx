import "./Modal.css";
import * as ReactDOM from 'react-dom';
import * as React from "react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

interface ModalOverlayProps {
    children: React.ReactNode;
}

interface BackdropProps {
    onClose: () => void;
}


const Backdrop = (props:BackdropProps) => {
    return (
        <div className="backdrop" onClick={props.onClose}></div>
    )
}

const ModalOverlay = (props : ModalOverlayProps) => {
    return (
        <div className="modal">
            <div className="content">{props.children}</div>
        </div>
    )
}

const portalElement = document.getElementById("overlays");

const Modal = (props:ModalProps) => {
    return (
        <>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>, portalElement)}
            {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
        </>
    )
}

export default Modal;