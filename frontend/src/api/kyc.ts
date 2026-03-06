import apiClient from './apiClient';

export interface KYCData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  documentType: 'passport' | 'drivers_license' | 'national_id';
  documentNumber: string;
  documentFront?: File;
  documentBack?: File;
  selfieImage?: File;
}

export interface KYCStatus {
  status: "pending" | "approved" | "rejected" | "not_submitted";
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ✅ SUBMIT KYC
export const submitKYC = async (kycData: KYCData) => {
  const formData = new FormData();

  Object.keys(kycData).forEach((key) => {
    const value = kycData[key as keyof KYCData];
    if (value && !(value instanceof File)) {
      formData.append(key, value as string);
    }
  });

  if (kycData.documentFront) formData.append('documentFront', kycData.documentFront);
  if (kycData.documentBack) formData.append('documentBack', kycData.documentBack);
  if (kycData.selfieImage) formData.append('selfie', kycData.selfieImage);

  return apiClient.post('/kyc/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ✅ GET KYC STATUS
export const getKYCStatus = async (): Promise<KYCStatus> => {
  const { data } = await apiClient.get<KYCStatus>('/kyc/status');
  return data;
};

// ✅ GET ALL KYC (ADMIN)
export const getAllKYC = async () => {
  const { data } = await apiClient.get('/kyc/all');
  return data;
};

// ✅ APPROVE KYC (ADMIN)
export const approveKYC = async (kycId: string) => {
  return apiClient.post(`/kyc/${kycId}/approve`);
};

// ✅ REJECT KYC (ADMIN)
export const rejectKYC = async (kycId: string, reason: string) => {
  return apiClient.post(`/kyc/${kycId}/reject`, { reason });
};
