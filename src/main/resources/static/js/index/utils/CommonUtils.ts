import Swal, {SweetAlertIcon, SweetAlertPosition} from "sweetalert2";
import {IUser} from "../types/IUser";

class CommonUtils {
    static filterHtmlTags = (htmlString: string) => {
        return htmlString
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    static toaster = (content: string, position: SweetAlertPosition, icon?: SweetAlertIcon) => {
        return Swal.fire({
            position: position,
            icon: icon || 'success',
            timer: 2000,
            toast: true,
            text: content,
            showConfirmButton: false,
        });
    }

    static confirm = (title: string, text: string, confirmButtonText: string) => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: '취 소',
        })
    }

    static getUserFromSession = () => {
        const user = JSON.parse(sessionStorage.getItem('user')) as IUser;
        if (!user) {
            Swal.fire({
                title: '유저 정보를 가져올 수 없습니다.',
                icon: 'error',
            })
            document.location.reload();
        }
        return user;
    }
}

export default CommonUtils