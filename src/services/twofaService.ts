// src/services/twofaService.ts
import { api } from "@/lib/axios";

export const twofaService = {
  // Get current 2FA status
  getTwofaStatus: async (): Promise<any> => {
    const response = await api.get("/twofa/status");
    return response.data;
  },
  // Email 2FA
  initiateMailTwofa: async (): Promise<any> => {
    const response = await api.post("/twofa/mail/initiate");
    return response.data;
  },
  activateMailTwofa: async (params: {}): Promise<any> => {
    const response = await api.post("/twofa/mail/activate", params);
    return response.data;
  },
  deactivateMailTwofa: async (params: {}): Promise<any> => {
    const response = await api.post("/twofa/mail/deactivate", params);
    return response.data;
  },

  // Google Authenticator 2FA
  initiateAppTwofa: async (): Promise<any> => {
    const response = await api.post("/twofa/app/initiate");
    return response.data;
  },
  activateAppTwofa: async (params: {}): Promise<any> => {
    const response = await api.post("/twofa/app/activate", params);
    return response.data;
  },
  deactivateAppTwofa: async (params: {}): Promise<any> => {
    const response = await api.post("/twofa/app/deactivate", params);
    return response.data;
  },

  // Generic Verify (if needed for both)
  verifyTwofa: async (params: { method: "mail" | "app" }): Promise<any> => {
    const response = await api.post("/twofa/verify", params);
    return response.data;
  },

  // Resend OTP code
  sendCodeTwofa: async (params: { method: "mail" | "app" }): Promise<any> => {
    const response = await api.post("/twofa/send-code", params);
    return response.data;
  },
};
