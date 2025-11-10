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
} from "@/store/slices/twofaSlice";
import { useAuth } from "./useAuth";
import { ITwofa } from "@/types/twofa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useTwofa = () => {
  const dispatch = useDispatch();
  const { status, qrCodeUrl, secretKey, loading, error } = useSelector(
    (state: RootState) => state.twofa
  );
  const router = useRouter()


  // Load current TwoFA status
  const loadTwofaStatus = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const res = await twofaService.getTwofaStatus();
      dispatch(setStatus(res?.two_factor_type || { mail: false, app: false }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message ||
          err?.message ||
          "Failed to load TwoFA status"
          : "Failed to load TwoFA status";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const sendCodeTwofa = useCallback(async (params = '') => {
    try {
      dispatch(setLoading(true));
      const res = await twofaService.sendCodeTwofa({ email: params });
      dispatch(setLoading(true));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to send TwoFA Code"
          : "Failed to send TwoFA Code";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
    
  }, [dispatch, status]);

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
  const activateMailTwofa = useCallback(async (data:ITwofa) => {
      try {
      dispatch(setLoading(true));
      await twofaService.activateMailTwofa(data);
      dispatch(setLoading(false))
      dispatch(setStatus({ ...status, mail: true }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to activate Email TwoFA"
          : "Failed to activate Email TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
    
  }, [dispatch, status]);

  // Deactivate Email TwoFA
  const deactivateMailTwofa = useCallback(async (data:ITwofa) => {
    try {
      dispatch(setLoading(true));
      await twofaService.deactivateMailTwofa(data);
      dispatch(setStatus({ ...status, mail: false }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to deactivate Email TwoFA"
          : "Failed to deactivate Email TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, status]);

    // Deactivate Email TwoFA
  const verifyMailTwofa = useCallback(async (data:ITwofa) => {
    try {
      dispatch(setLoading(true));
      const response = await twofaService.verifyTwofa(data);
      if(response.message){
        toast.success(response.message)
        router.push("/")
      }
      dispatch(setLoading(false))
    } catch (err: unknown) {
      const errorMessage =
        err instanceof AxiosError
          ? err?.response?.data?.message || err?.message || "Failed to deactivate Email TwoFA"
          : "Failed to deactivate Email TwoFA";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, status]);

  return {
    // State
    status,
    qrCodeUrl,
    secretKey,
    loading,
    error,

    // Actions
    loadTwofaStatus,
    sendCodeTwofa,
    activateAppTwofa,
    deactivateAppTwofa,
    activateMailTwofa,
    deactivateMailTwofa,
    verifyMailTwofa
  };
};
