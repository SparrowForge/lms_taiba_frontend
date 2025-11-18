// src/store/twofaSlice.ts
import { Status } from "@/enums";
import { IStatusState } from "@/types/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TwoFAState {
  status: {
    mail: boolean;
    app: boolean;
  };
  qrCodeUrl?: string;
  secretKey?: string;
  loading: boolean;
  codeStatus:IStatusState,
  actionStatus:IStatusState
  error?: string;
}

const initialState: TwoFAState = {
  status: { mail: false, app: false },
  qrCodeUrl: undefined,
  secretKey: undefined,
  loading: false,
  codeStatus:{ status: Status.INITIAL, },
  actionStatus:{ status: Status.INITIAL },
  error: undefined,
};

export const twofaSlice = createSlice({
  name: "twofa",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCodeStatus: (state, action: PayloadAction<IStatusState>) => {
      state.codeStatus = action.payload;
    },
    setActionStatus: (state, action: PayloadAction<IStatusState>) => {
      state.actionStatus = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    setStatus(state, action: PayloadAction<{ mail: boolean; app: boolean }>) {
      state.status = action.payload;
    },
    setQrCodeData(state, action: PayloadAction<{ qrCodeUrl: string; secretKey: string }>) {
      state.qrCodeUrl = action.payload.qrCodeUrl;
      state.secretKey = action.payload.secretKey;
    },
    resetQrCodeData(state) {
      state.qrCodeUrl = undefined;
      state.secretKey = undefined;
    },
  },
});

export const { setLoading, setError, setStatus, setQrCodeData, resetQrCodeData,setCodeStatus,setActionStatus } =
  twofaSlice.actions;

export default twofaSlice.reducer;
