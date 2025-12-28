"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKYCApproved = isKYCApproved;
exports.canUserInvest = canUserInvest;
exports.isKYCPending = isKYCPending;
exports.requiresFullKYC = requiresFullKYC;
exports.getKYCStatusColor = getKYCStatusColor;
const kyc_types_1 = require("../types/kyc.types");
function isKYCApproved(kyc) {
    return kyc?.status === kyc_types_1.KYCStatus.APPROVED;
}
function canUserInvest(user, kyc) {
    return user.isActive && user.isVerified && isKYCApproved(kyc);
}
function isKYCPending(kyc) {
    if (!kyc)
        return false;
    return kyc.status === kyc_types_1.KYCStatus.PENDING || kyc.status === kyc_types_1.KYCStatus.IN_REVIEW;
}
function requiresFullKYC(verificationLevel) {
    return verificationLevel === kyc_types_1.VerificationLevel.FULL;
}
function getKYCStatusColor(status) {
    const colors = {
        [kyc_types_1.KYCStatus.NOT_STARTED]: 'gray',
        [kyc_types_1.KYCStatus.PENDING]: 'yellow',
        [kyc_types_1.KYCStatus.IN_REVIEW]: 'blue',
        [kyc_types_1.KYCStatus.APPROVED]: 'green',
        [kyc_types_1.KYCStatus.REJECTED]: 'red',
        [kyc_types_1.KYCStatus.RESUBMISSION_REQUIRED]: 'orange',
    };
    return colors[status] || 'gray';
}
//# sourceMappingURL=typeGuards.js.map