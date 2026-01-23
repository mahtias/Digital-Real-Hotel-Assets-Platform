import { Request, Response } from 'express';
export declare const createStaking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserStakings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const claimStakingRewards: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unstake: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=stakingController.d.ts.map