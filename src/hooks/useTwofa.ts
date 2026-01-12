import { AxiosError } from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

import { twofaService } from "@/services/twofaService";
import {
  setLoading,
  setError,
  setStatus,
  setQrCodeData,
  resetQrCodeData,
  setCodeStatus,
  setActionStatus,
} from "@/store/slices/twofaSlice";
import { setIsTwoFaVerified } from "@/store/slices/authSlice";
import { useAuth } from "./useAuth";
import { IActionResponse, ITwofa } from "@/types/twofa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Status } from "@/enums";

export const useTwofa = () => {
  const dispatch = useDispatch();
  const { status, qrCodeUrl, secretKey, loading, error } = useSelector(
    (state: RootState) => state.twofa
  );
  const router = useRouter()

  const sendCodeTwofa = useCallback(async (params = '') => {
    try {
      dispatch(setCodeStatus({ status: Status.LOADING }));
      const res = await twofaService.sendCodeTwofa({ email: params });
      dispatch(setCodeStatus({ status: Status.SUCCESS }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to send TwoFA Code"
          : "Failed to send TwoFA Code";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setCodeStatus({ status: Status.FAILED }));
    }

  }, [dispatch]);

  // Activate Google App TwoFA
  const activateAppTwofa = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const res = await twofaService.activateAppTwofa({ type: "app" });
      dispatch(setQrCodeData({ qrCodeUrl: res.qrCodeUrl, secretKey: res.secretKey }));
      dispatch(setStatus({ ...status, app: true }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to activate App TwoFA"
          : "Failed to activate App TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, status]);

  // Deactivate Google App TwoFA
  const deactivateAppTwofa = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await twofaService.deactivateAppTwofa({ type: "app" });
      dispatch(setStatus({ ...status, app: false }));
      dispatch(resetQrCodeData());
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to deactivate App TwoFA"
          : "Failed to deactivate App TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, status]);

  // Activate Email TwoFA
  const activateMailTwofa = useCallback(async (data: ITwofa) => {
    try {
      dispatch(setActionStatus({ status: Status.LOADING }));
      const response:IActionResponse = await twofaService.activateMailTwofa(data);
      console.log("activateMailTwofa", response)
      dispatch(setActionStatus({ 
        status: Status.SUCCESS,
        message:"Mail Activated Successfully"
       }))
     
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to activate Email TwoFA"
          : "Failed to activate Email TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setActionStatus({ status: Status.FAILED }));
    }

  }, [dispatch]);

  // Deactivate Email TwoFA
  const deactivateMailTwofa = useCallback(async (data: ITwofa) => {
    try {
      dispatch(setActionStatus({ status: Status.LOADING }));
      const response = await twofaService.deactivateMailTwofa(data);
      console.log("deactivateMailTwofa", response)
      dispatch(setActionStatus({
        status: Status.SUCCESS,
        message: "Mail Deactivated Successfully"
      }))
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to deactivate Email TwoFA"
          : "Failed to deactivate Email TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setActionStatus({ status: Status.FAILED }));
    }
  }, [dispatch]);

  // Verify Email TwoFA
  const verifyMailTwofa = useCallback(async (data: ITwofa) => {
    try {
      dispatch(setLoading(true));
      const response = await twofaService.verifyTwofa(data);
      if (response.message) {
        toast.success(response.message)
        // Mark 2FA as verified
        dispatch(setIsTwoFaVerified(true));
        router.push("/")
      }
      dispatch(setLoading(false))
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to verify Email TwoFA"
          : "Failed to verify Email TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch,router]);

  return {
    // State
    status,
    qrCodeUrl,
    secretKey,
    loading,
    error,

    // Actions

    sendCodeTwofa,
    activateAppTwofa,
    deactivateAppTwofa,
    activateMailTwofa,
    deactivateMailTwofa,
    verifyMailTwofa
  };
};
