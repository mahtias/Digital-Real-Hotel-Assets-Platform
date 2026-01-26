import React, { useState, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const KYCForm = () => {
  const token = localStorage.getItem("authToken");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);

  // store refs to reset file inputs
  const fileInputsRef = useRef<any>({});

  // ----------------------------
  // FORM DATA
  // ----------------------------
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    documentType: "",
    documentNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [files, setFiles] = useState({
    documentFront: null as File | null,
    documentBack: null as File | null,
    selfieImage: null as File | null,
    addressProof: null as File | null,
  });

  // ----------------------------
  // RESET FORM
  // ----------------------------
  const resetForm = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      nationality: "",
      documentType: "",
      documentNumber: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });

    setFiles({
      documentFront: null,
      documentBack: null,
      selfieImage: null,
      addressProof: null,
    });

    // Reset file inputs
    Object.values(fileInputsRef.current).forEach((input: any) => {
      if (input) input.value = "";
    });

    setStep(1);
    setErrors({});
    setSuccess(false);
  };

  // ----------------------------
  // INPUT HANDLERS - SIMPLIFIED
  // ----------------------------
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error only if it exists
    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = e.target.name;

    setFiles(prev => ({
      ...prev,
      [name]: file,
    }));

    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ----------------------------
  // STEP VALIDATION
  // ----------------------------
  const validateStep1 = () => {
    const req = ["fullName", "dateOfBirth", "nationality", "documentType", "documentNumber"];
    const e: any = {};
    req.forEach((f) => {
      if (!formData[f as keyof typeof formData]) {
        e[f] = "Required";
      }
    });
    return e;
  };

  const validateStep2 = () => {
    const req = ["address", "city", "state", "postalCode", "country"];
    const e: any = {};
    req.forEach((f) => {
      if (!formData[f as keyof typeof formData]) {
        e[f] = "Required";
      }
    });
    return e;
  };

  const validateStep3 = () => {
    const e: any = {};
    if (!files.documentFront) e.documentFront = "Required";
    if (!files.documentBack) e.documentBack = "Required";
    if (!files.selfieImage) e.selfieImage = "Required";
    return e;
  };

  // ----------------------------
  // STEP NAVIGATION
  // ----------------------------
  const next = () => {
    const validators = [validateStep1, validateStep2, validateStep3];
    const e = validators[step - 1]();
    
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    
    setErrors({});
    setStep(step + 1);
  };

  const back = () => {
    setStep(step - 1);
  };

  // ----------------------------
  // SUBMIT FINAL KYC
  // ----------------------------
  const submitKYC = async () => {
    const e = validateStep3();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      Object.entries(files).forEach(([k, v]) => v && fd.append(k, v));

      await axios.post(`${API_URL}/api/v1/kyc/submit`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (err: any) {
      setErrors({ global: err?.response?.data?.message || "Submission failed" });
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // RENDER UI
  // ----------------------------
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>

      {success && (
        <div className="p-3 bg-green-200 text-green-800 mb-4 rounded">
          KYC Submitted Successfully!
        </div>
      )}
      
      {errors.global && (
        <div className="p-3 bg-red-200 text-red-800 mb-4 rounded">
          {errors.global}
        </div>
      )}

      {/* STEP PROGRESS */}
      <div className="flex justify-between items-center mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 mx-1 rounded-full transition-all ${
              step >= s ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Step 1: Personal Information</h3>
          
          <div>
            <label htmlFor="fullName" className="block font-medium mb-1">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block font-medium mb-1">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label htmlFor="nationality" className="block font-medium mb-1">Nationality</label>
            <input
              id="nationality"
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nationality && <p className="text-red-600 text-sm mt-1">{errors.nationality}</p>}
          </div>

          <div>
            <label htmlFor="documentType" className="block font-medium mb-1">Document Type</label>
            <input
              id="documentType"
              type="text"
              name="documentType"
              value={formData.documentType}
              onChange={handleInput}
              placeholder="e.g., Passport, Driver's License"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.documentType && <p className="text-red-600 text-sm mt-1">{errors.documentType}</p>}
          </div>

          <div>
            <label htmlFor="documentNumber" className="block font-medium mb-1">Document Number</label>
            <input
              id="documentNumber"
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.documentNumber && <p className="text-red-600 text-sm mt-1">{errors.documentNumber}</p>}
          </div>

          <button 
            onClick={next} 
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Step 2: Address Details</h3>

          <div>
            <label htmlFor="address" className="block font-medium mb-1">Full Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block font-medium mb-1">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block font-medium mb-1">State / Province</label>
            <input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <label htmlFor="postalCode" className="block font-medium mb-1">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.postalCode && <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>}
          </div>

          <div>
            <label htmlFor="country" className="block font-medium mb-1">Country</label>
            <input
              id="country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInput}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={back} 
              className="w-1/2 bg-gray-300 py-3 rounded hover:bg-gray-400 transition-colors"
            >
              ← Back
            </button>
            <button 
              onClick={next} 
              className="w-1/2 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Step 3: Upload Documents</h3>

          <div className="mb-4">
            <label htmlFor="documentFront" className="block mb-1 font-medium">Document Front (Passport,drive License etc)</label>
            <input
              id="documentFront"
              ref={(el) => (fileInputsRef.current.documentFront = el)}
              type="file"
              name="documentFront"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {files.documentFront && (
              <p className="text-sm text-gray-600 mt-1">Selected: {files.documentFront.name}</p>
            )}
            {errors.documentFront && <p className="text-red-600 text-sm mt-1">{errors.documentFront}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="documentBack" className="block mb-1 font-medium">Document Back Document Front (Passport,drive License etc)</label>
            <input
              id="documentBack"
              ref={(el) => (fileInputsRef.current.documentBack = el)}
              type="file"
              name="documentBack"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {files.documentBack && (
              <p className="text-sm text-gray-600 mt-1">Selected: {files.documentBack.name}</p>
            )}
            {errors.documentBack && <p className="text-red-600 text-sm mt-1">{errors.documentBack}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="selfieImage" className="block mb-1 font-medium">Selfie Image</label>
            <input
              id="selfieImage"
              ref={(el) => (fileInputsRef.current.selfieImage = el)}
              type="file"
              name="selfieImage"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {files.selfieImage && (
              <p className="text-sm text-gray-600 mt-1">Selected: {files.selfieImage.name}</p>
            )}
            {errors.selfieImage && <p className="text-red-600 text-sm mt-1">{errors.selfieImage}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="addressProof" className="block mb-1 font-medium">Address Proof (Optional)</label>
            <input
              id="addressProof"
              ref={(el) => (fileInputsRef.current.addressProof = el)}
              type="file"
              name="addressProof"
              accept="image/*,application/pdf"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {files.addressProof && (
              <p className="text-sm text-gray-600 mt-1">Selected: {files.addressProof.name}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={back} 
              className="w-1/2 bg-gray-300 py-3 rounded hover:bg-gray-400 transition-colors"
            >
              ← Back
            </button>

            <button
              onClick={submitKYC}
              disabled={loading}
              className="w-1/2 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCForm;
