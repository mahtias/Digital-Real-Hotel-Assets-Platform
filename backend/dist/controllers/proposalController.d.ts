import { Request, Response } from 'express';
export declare const createProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllProposals: (req: Request, res: Response) => Promise<void>;
export declare const getProposalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProposal: (req: Request, res: Response) => Promise<void>;
export declare const deleteProposal: (req: Request, res: Response) => Promise<void>;
export declare const voteOnProposal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=proposalController.d.ts.map