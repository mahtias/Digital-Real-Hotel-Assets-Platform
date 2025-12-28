"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class KYCService {
    static async submitKYC(data) {
        const { userId, fullName, dateOfBirth, nationality, city, state, postalCode, country, } = data;
        const parsedDOB = new Date(dateOfBirth);
        const existing = await prisma.kyc.findUnique({
            where: { userId }
        });
        if (existing) {
            return prisma.kyc.update({
                where: { userId },
                data: {
                    fullName,
                    dateOfBirth: parsedDOB,
                    nationality,
                    city,
                    state,
                    postalCode,
                    country,
                    submittedAt: new Date(),
                }
            });
        }
        return prisma.kyc.create({
            data: {
                userId,
                fullName,
                dateOfBirth: parsedDOB,
                nationality,
                city,
                state,
                postalCode,
                country,
            }
        });
    }
    static async getKYCByUser(userId) {
        return prisma.kyc.findUnique({
            where: { userId }
        });
    }
}
exports.KYCService = KYCService;
//# sourceMappingURL=KYCService.js.map