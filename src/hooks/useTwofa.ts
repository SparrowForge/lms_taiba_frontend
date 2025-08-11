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

export const useTwofa = () => {
  const dispatch = useDispatch();
  const { status, qrCodeUrl, secretKey, loading, error } = useSelector(
    (state: RootState) => state.twofa
  );

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
  const activateMailTwofa = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await twofaService.activateAppTwofa({ type: "mail" });
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
  const deactivateMailTwofa = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await twofaService.deactivateAppTwofa({ type: "mail" });
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

  return {
    // State
    status,
    qrCodeUrl,
    secretKey,
    loading,
    error,

    // Actions
    loadTwofaStatus,
    activateAppTwofa,
    deactivateAppTwofa,
    activateMailTwofa,
    deactivateMailTwofa,
  };
};
