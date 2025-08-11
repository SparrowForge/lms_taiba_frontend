// src/store/twofaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TwoFAState {
  status: {
    mail: boolean;
    app: boolean;
  };
  qrCodeUrl?: string;
  secretKey?: string;
  loading: boolean;
  error?: string;
}

const initialState: TwoFAState = {
  status: { mail: false, app: false },
  qrCodeUrl: undefined,
  secretKey: undefined,
  loading: false,
  error: undefined,
};

export const twofaSlice = createSlice({
  name: "twofa",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
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

export const { setLoading, setError, setStatus, setQrCodeData, resetQrCodeData } =
  twofaSlice.actions;

export default twofaSlice.reducer;
