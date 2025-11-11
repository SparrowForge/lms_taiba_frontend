// src/services/twofaService.ts
import { api } from "@/lib/axios";
import { ITwofa } from "@/types/twofa";

export const twofaService = {
  // Get current 2FA status
  // getTwofaStatus: async (): Promise<any> => {
  //   const response = await api.get("/twofa/status");
  //   return response.data;
  // },
  // Resend OTP code
  sendCodeTwofa: async (params: { email:string }): Promise<any> => {
    const response = await api.post("/twofa/send-code", params);
    return response.data;
  },
  // Email 2FA
  activateMailTwofa: async (params: ITwofa): Promise<any> => {
    const response = await api.post<ITwofa>("/twofa/mail/activate", params);
    return response.data;
  },
  deactivateMailTwofa: async (params: ITwofa): Promise<any> => {
    const response = await api.post<ITwofa>("/twofa/mail/deactivate", params);
    return response.data;
  },

  // Microsoft Authenticator 2FA
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
  verifyTwofa: async (params: ITwofa): Promise<any> => {
    const response = await api.post<ITwofa>("/twofa/mail/verify", params);
    return response.data;
  },
  initiateMailTwofa: async (): Promise<any> => {
    const response = await api.post("/twofa/mail/initiate");
    return response.data;
  },

};
