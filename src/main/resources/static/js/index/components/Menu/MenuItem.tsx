import {IMenu} from "../../interfaces/IMenu";
import './MenuItem.css';
import * as React from "react";
import axios from "axios";

interface props {
    menu: IMenu;
    onDelete?: (menuId: number) => void;
}

const MenuItem = (props: props) => {

    const deleteClickHandler = async (e: React.MouseEvent) => {
        const clickedBtn = e.currentTarget as HTMLElement;
        const targetMenuId = Number(clickedBtn.dataset?.id);
        await axios.delete(`/api/menu/${targetMenuId}`);
        props.onDelete(targetMenuId);
    }

    return (
        <div className='card mt-2 p-3'>
            <div className='row'>
                <div className='col-11 menu-title'>
                    <div> {props.menu.name} </div>
                </div>
                {props.onDelete &&
                    <div className='col-1 text-end'>
                        <button
                            className='btn btn-sm btn-outline-secondary'
                            data-id={props.menu.id}
                            onClick={deleteClickHandler}
                        >X
                        </button>
                    </div>
                }
            </div>
            <div className='row justify-content-center'>
                <div className='menu-detail card mt-2 p-1'>
                </div>
            </div>
        </div>
    );
}

export default MenuItem;