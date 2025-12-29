"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log("\n============================");
    console.log("VALIDATION ERRORS:", errors.array());
    console.log("============================\n");
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.type === 'field' ? error.path : undefined,
                message: error.msg
            }))
        });
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map