import { toast } from "react-toastify";

declare const window: Window &
    typeof globalThis & {
    toastId: any;
}

export const Alert = (message: string, options: any = {}) => {
    if (typeof window === 'undefined') {
        return;
    }
    const toastOptions = {
        hideProgressBar: true,
        ...options,
    };
    if ((window as any).toastId && toast.isActive((window as any).toastId)) {
        toast.update((window as any).toastId, {
            render: <div className="flex flex-row items-center">{message}</div>,
            ...toastOptions,
        });
    } else {
        toast.dismiss();
        window.toastId = toast.info(
            <div className="flex flex-row items-center">{message}</div>,
            toastOptions
        );
    }
}
