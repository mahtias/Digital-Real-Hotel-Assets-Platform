import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  //  ADD THIS — we need this output
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