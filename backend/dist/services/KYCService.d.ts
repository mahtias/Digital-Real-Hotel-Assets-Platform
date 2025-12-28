interface SubmitKYCInput {
    userId: string;
    fullName: string;
    dateOfBirth: string | Date;
    nationality: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
export declare class KYCService {
    static submitKYC(data: SubmitKYCInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        dateOfBirth: Date;
        nationality: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        rejectionReason: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
    static getKYCByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        dateOfBirth: Date;
        nationality: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        rejectionReason: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    } | null>;
}
export {};
//# sourceMappingURL=KYCService.d.ts.map