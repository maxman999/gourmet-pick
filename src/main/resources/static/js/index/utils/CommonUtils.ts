import Swal, {SweetAlertIcon, SweetAlertPosition} from "sweetalert2";
import {IUser} from "../types/IUser";
import {KeyboardEventHandler} from "react";

class CommonUtils {
    static getUserFromSession = () => {
        const user = JSON.parse(sessionStorage.getItem('user')) as IUser;
        if (!user) {
            Swal.fire({
                title: '유저 정보를 가져올 수 없습니다.',
                text: '잠시 후 다시 시도해주세요.',
                icon: 'error',
            }).then(() => {
                document.location.reload()
            });
        }
        return user;
    }

    static filterHtmlTags = (htmlString: string) => {
        return htmlString
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    static bringBackHtmlTags = (escapedString: string) => {
        return escapedString
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#039;/g, "'");
    }

    static toaster = (content: string, position?: SweetAlertPosition, icon?: SweetAlertIcon) => {
        return Swal.fire({
            position: position || 'top',
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

    static copyToClipboard = (textToCopy: string, titleOnSuccess?: string) => {
        if (navigator.clipboard === undefined) {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            Swal.fire({
                position: 'top',
                icon: 'success',
                timer: 2000,
                toast: true,
                title: titleOnSuccess || '',
                showConfirmButton: false,
            });
        } else {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    if (!titleOnSuccess) return;
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        timer: 2000,
                        toast: true,
                        title: titleOnSuccess,
                        showConfirmButton: false,
                    });
                });
        }
    }

    static copyInvitationCode = (invitationCode: string) => {
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        const fullCode = `${protocol}//${hostname}:${port}/?code=${invitationCode}`;
        this.copyToClipboard(fullCode, '초대코드가 복사되었습니다.');
    }

    static handleEnterKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>, callback: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            callback();
        }
    };
}

export default CommonUtils