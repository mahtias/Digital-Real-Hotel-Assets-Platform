import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const KYCForm = () => {
  const token = localStorage.getItem("authToken");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);

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
  // INPUT HANDLERS
  // ----------------------------
  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFile = (e: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFiles((prev: any) => ({
    ...prev,
    [e.target.name]: file,
  }));

  setErrors((prev: any) => ({
    ...prev,
    [e.target.name]: "",
  }));
};

  // ----------------------------
  // STEP VALIDATION
  // ----------------------------
  const validateStep1 = () => {
    const req = ["fullName", "dateOfBirth", "nationality", "documentType", "documentNumber"];
    const e: any = {};
    req.forEach((f) => !formData[f] && (e[f] = "Required"));
    return e;
  };

  const validateStep2 = () => {
    const req = ["address", "city", "state", "postalCode", "country"];
    const e: any = {};
    req.forEach((f) => !formData[f] && (e[f] = "Required"));
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
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  // ----------------------------
  // SUBMIT FINAL KYC
  // ----------------------------
  const submitKYC = async () => {
    const e = validateStep3();
    if (Object.keys(e).length) return setErrors(e);

    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => fd.append(k, (formData as any)[k]));
      Object.keys(files).forEach((k) => {
        const f = (files as any)[k];
        if (f) fd.append(k, f);
      });

      await axios.post(`${API_URL}/api/v1/kyc/submit`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
    } catch (err: any) {
      setErrors({ global: err?.response?.data?.message || "Submission failed" });
    }

    setLoading(false);
  };

  // ----------------------------
  // STEP UI HELPERS
  // ----------------------------
  const StepHeader = () => (
    <div className="flex justify-between items-center mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`flex-1 h-2 mx-1 rounded-full transition-all ${
            step >= s ? "bg-blue-600" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );

  const Input = ({
    label,
    name,
    value,
    type = "text",
  }: any) => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInput}
        className="w-full p-2 border rounded"
      />
      {errors[name] && <p className="text-red-600 text-sm">{errors[name]}</p>}
    </div>
  );

  const FileInput = ({ label, name }: any) => (
  <div className="mb-2">
    <label className="block mb-1 font-medium">{label}</label>

    <input
      type="file"
      name={name}
      onChange={handleFile}
      className="block"
    />

    {/* SHOW FILE NAME */}
    {files[name] && (
      <p className="text-sm text-gray-600 mt-1">
        Selected: {files[name]?.name}
      </p>
    )}

    {errors[name] && (
      <p className="text-red-600 text-sm">{errors[name]}</p>
    )}
  </div>
);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">

      <h2 className="text-2xl font-bold mb-4">KYC Verification</h2>

      {success && <p className="p-3 bg-green-200 text-green-800 mb-4">KYC Submitted Successfully!</p>}
      {errors.global && <p className="p-3 bg-red-200 text-red-800 mb-4">{errors.global}</p>}

      <StepHeader />

      {/* ---------------------- STEP 1 ---------------------- */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-2">Step 1: Personal Information</h3>

          <Input label="Full Name" name="fullName" value={formData.fullName} />
          <Input label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} type="date" />
          <Input label="Nationality" name="nationality" value={formData.nationality} />
          <Input label="Document Type" name="documentType" value={formData.documentType} />
          <Input label="Document Number" name="documentNumber" value={formData.documentNumber} />

          <button onClick={next} className="w-full bg-blue-600 text-white py-3 rounded">
            Next →
          </button>
        </div>
      )}

      {/* ---------------------- STEP 2 ---------------------- */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-2">Step 2: Address Details</h3>

          <Input label="Full Address" name="address" value={formData.address} />
          <Input label="City" name="city" value={formData.city} />
          <Input label="State / Province" name="state" value={formData.state} />
          <Input label="Postal Code" name="postalCode" value={formData.postalCode} />
          <Input label="Country" name="country" value={formData.country} />

          <div className="flex gap-3">
            <button onClick={back} className="w-1/2 bg-gray-300 py-3 rounded">← Back</button>
            <button onClick={next} className="w-1/2 bg-blue-600 text-white py-3 rounded">Next →</button>
          </div>
        </div>
      )}

      {/* ---------------------- STEP 3 ---------------------- */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-2">Step 3: Upload Documents</h3>

          <FileInput label="Document Front" name="documentFront" />
          <FileInput label="Document Back" name="documentBack" />
          <FileInput label="Selfie Image" name="selfieImage" />
          <FileInput label="Address Proof (Optional)" name="addressProof" />

          <div className="flex gap-3">
            <button onClick={back} className="w-1/2 bg-gray-300 py-3 rounded">← Back</button>

            <button
              onClick={submitKYC}
              disabled={loading}
              className="w-1/2 bg-green-600 text-white py-3 rounded"
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
