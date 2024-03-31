import { ToastStatus } from '@components/Toast/Toast';
import { StoreSlice } from './store';

export interface ToastSlice {
  toastShow: boolean;
  toastMessage: string;
  toastStatus: ToastStatus;
  toastId: number;
  setToastShow: (toastShow: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
  setToastStatus: (toastStatus: ToastStatus) => void;
}

export const createToastSlice: StoreSlice<ToastSlice> = (set, get) => ({
  toastShow: false,
  toastMessage: '',
  toastStatus: 'success',
  toastId: 1,
  setToastShow: (toastShow: boolean) => {
    set((prev) => ({ ...prev, 
      toastShow: toastShow, 
      toastId: (get().toastId??0) + 1 }));
  },
  setToastMessage: (toastMessage: string) => {
    set((prev: ToastSlice) => ({ ...prev, toastMessage }));
  },
  setToastStatus: (toastStatus: ToastStatus) => {
    set((prev: ToastSlice) => ({ ...prev, toastStatus }));
  },
});
