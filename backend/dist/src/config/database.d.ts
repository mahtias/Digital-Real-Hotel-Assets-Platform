import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("@/generated/prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=database.d.ts.map