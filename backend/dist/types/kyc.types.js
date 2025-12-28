"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = exports.VerificationLevel = exports.KYCStatus = void 0;
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["NOT_STARTED"] = "NOT_STARTED";
    KYCStatus["PENDING"] = "PENDING";
    KYCStatus["IN_REVIEW"] = "IN_REVIEW";
    KYCStatus["APPROVED"] = "APPROVED";
    KYCStatus["REJECTED"] = "REJECTED";
    KYCStatus["RESUBMISSION_REQUIRED"] = "RESUBMISSION_REQUIRED";
})(KYCStatus || (exports.KYCStatus = KYCStatus = {}));
var VerificationLevel;
(function (VerificationLevel) {
    VerificationLevel["BASIC"] = "BASIC";
    VerificationLevel["INTERMEDIATE"] = "INTERMEDIATE";
    VerificationLevel["ADVANCED"] = "ADVANCED";
    VerificationLevel["FULL"] = "FULL";
})(VerificationLevel || (exports.VerificationLevel = VerificationLevel = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["PASSPORT"] = "PASSPORT";
    DocumentType["DRIVERS_LICENSE"] = "DRIVERS_LICENSE";
    DocumentType["NATIONAL_ID"] = "NATIONAL_ID";
    DocumentType["RESIDENCE_PERMIT"] = "RESIDENCE_PERMIT";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
//# sourceMappingURL=kyc.types.js.map