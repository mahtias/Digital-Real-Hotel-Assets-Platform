
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Kyc
 * 
 */
export type Kyc = $Result.DefaultSelection<Prisma.$KycPayload>
/**
 * Model HotelAsset
 * 
 */
export type HotelAsset = $Result.DefaultSelection<Prisma.$HotelAssetPayload>
/**
 * Model Investment
 * 
 */
export type Investment = $Result.DefaultSelection<Prisma.$InvestmentPayload>
/**
 * Model Booking
 * 
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model Proposal
 * 
 */
export type Proposal = $Result.DefaultSelection<Prisma.$ProposalPayload>
/**
 * Model Vote
 * 
 */
export type Vote = $Result.DefaultSelection<Prisma.$VotePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PROPERTY_MANAGER: 'PROPERTY_MANAGER',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  FINANCE_MANAGER: 'FINANCE_MANAGER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const KycStatus: {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RESUBMISSION_REQUIRED: 'RESUBMISSION_REQUIRED',
  EXPIRED: 'EXPIRED'
};

export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus]


export const VerificationLevel: {
  BASIC: 'BASIC',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  FULL: 'FULL'
};

export type VerificationLevel = (typeof VerificationLevel)[keyof typeof VerificationLevel]


export const DocumentType: {
  PASSPORT: 'PASSPORT',
  DRIVERS_LICENSE: 'DRIVERS_LICENSE',
  NATIONAL_ID: 'NATIONAL_ID',
  RESIDENCE_PERMIT: 'RESIDENCE_PERMIT'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const AssetStatus: {
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  SOLD_OUT: 'SOLD_OUT',
  CLOSED: 'CLOSED'
};

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus]


export const BookingStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]


export const ProposalStatus: {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXECUTED: 'EXECUTED'
};

export type ProposalStatus = (typeof ProposalStatus)[keyof typeof ProposalStatus]


export const ProposalType: {
  RENOVATION: 'RENOVATION',
  EXPANSION: 'EXPANSION',
  POLICY_CHANGE: 'POLICY_CHANGE',
  DIVIDEND_DISTRIBUTION: 'DIVIDEND_DISTRIBUTION',
  OTHER: 'OTHER'
};

export type ProposalType = (typeof ProposalType)[keyof typeof ProposalType]


export const VoteChoice: {
  FOR: 'FOR',
  AGAINST: 'AGAINST',
  ABSTAIN: 'ABSTAIN'
};

export type VoteChoice = (typeof VoteChoice)[keyof typeof VoteChoice]


export const InvestmentStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type InvestmentStatus = (typeof InvestmentStatus)[keyof typeof InvestmentStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type KycStatus = $Enums.KycStatus

export const KycStatus: typeof $Enums.KycStatus

export type VerificationLevel = $Enums.VerificationLevel

export const VerificationLevel: typeof $Enums.VerificationLevel

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type AssetStatus = $Enums.AssetStatus

export const AssetStatus: typeof $Enums.AssetStatus

export type BookingStatus = $Enums.BookingStatus

export const BookingStatus: typeof $Enums.BookingStatus

export type ProposalStatus = $Enums.ProposalStatus

export const ProposalStatus: typeof $Enums.ProposalStatus

export type ProposalType = $Enums.ProposalType

export const ProposalType: typeof $Enums.ProposalType

export type VoteChoice = $Enums.VoteChoice

export const VoteChoice: typeof $Enums.VoteChoice

export type InvestmentStatus = $Enums.InvestmentStatus

export const InvestmentStatus: typeof $Enums.InvestmentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kyc`: Exposes CRUD operations for the **Kyc** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Kycs
    * const kycs = await prisma.kyc.findMany()
    * ```
    */
  get kyc(): Prisma.KycDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hotelAsset`: Exposes CRUD operations for the **HotelAsset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HotelAssets
    * const hotelAssets = await prisma.hotelAsset.findMany()
    * ```
    */
  get hotelAsset(): Prisma.HotelAssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.investment`: Exposes CRUD operations for the **Investment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Investments
    * const investments = await prisma.investment.findMany()
    * ```
    */
  get investment(): Prisma.InvestmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.proposal`: Exposes CRUD operations for the **Proposal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Proposals
    * const proposals = await prisma.proposal.findMany()
    * ```
    */
  get proposal(): Prisma.ProposalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vote`: Exposes CRUD operations for the **Vote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Votes
    * const votes = await prisma.vote.findMany()
    * ```
    */
  get vote(): Prisma.VoteDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Kyc: 'Kyc',
    HotelAsset: 'HotelAsset',
    Investment: 'Investment',
    Booking: 'Booking',
    Proposal: 'Proposal',
    Vote: 'Vote'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "kyc" | "hotelAsset" | "investment" | "booking" | "proposal" | "vote"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Kyc: {
        payload: Prisma.$KycPayload<ExtArgs>
        fields: Prisma.KycFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KycFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KycFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>
          }
          findFirst: {
            args: Prisma.KycFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KycFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>
          }
          findMany: {
            args: Prisma.KycFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>[]
          }
          create: {
            args: Prisma.KycCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>
          }
          createMany: {
            args: Prisma.KycCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KycCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>[]
          }
          delete: {
            args: Prisma.KycDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>
          }
          update: {
            args: Prisma.KycUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>
          }
          deleteMany: {
            args: Prisma.KycDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KycUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KycUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>[]
          }
          upsert: {
            args: Prisma.KycUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KycPayload>
          }
          aggregate: {
            args: Prisma.KycAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKyc>
          }
          groupBy: {
            args: Prisma.KycGroupByArgs<ExtArgs>
            result: $Utils.Optional<KycGroupByOutputType>[]
          }
          count: {
            args: Prisma.KycCountArgs<ExtArgs>
            result: $Utils.Optional<KycCountAggregateOutputType> | number
          }
        }
      }
      HotelAsset: {
        payload: Prisma.$HotelAssetPayload<ExtArgs>
        fields: Prisma.HotelAssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HotelAssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HotelAssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>
          }
          findFirst: {
            args: Prisma.HotelAssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HotelAssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>
          }
          findMany: {
            args: Prisma.HotelAssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>[]
          }
          create: {
            args: Prisma.HotelAssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>
          }
          createMany: {
            args: Prisma.HotelAssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HotelAssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>[]
          }
          delete: {
            args: Prisma.HotelAssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>
          }
          update: {
            args: Prisma.HotelAssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>
          }
          deleteMany: {
            args: Prisma.HotelAssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HotelAssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HotelAssetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>[]
          }
          upsert: {
            args: Prisma.HotelAssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelAssetPayload>
          }
          aggregate: {
            args: Prisma.HotelAssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHotelAsset>
          }
          groupBy: {
            args: Prisma.HotelAssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<HotelAssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.HotelAssetCountArgs<ExtArgs>
            result: $Utils.Optional<HotelAssetCountAggregateOutputType> | number
          }
        }
      }
      Investment: {
        payload: Prisma.$InvestmentPayload<ExtArgs>
        fields: Prisma.InvestmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvestmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvestmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>
          }
          findFirst: {
            args: Prisma.InvestmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvestmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>
          }
          findMany: {
            args: Prisma.InvestmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>[]
          }
          create: {
            args: Prisma.InvestmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>
          }
          createMany: {
            args: Prisma.InvestmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvestmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>[]
          }
          delete: {
            args: Prisma.InvestmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>
          }
          update: {
            args: Prisma.InvestmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>
          }
          deleteMany: {
            args: Prisma.InvestmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvestmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvestmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>[]
          }
          upsert: {
            args: Prisma.InvestmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestmentPayload>
          }
          aggregate: {
            args: Prisma.InvestmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvestment>
          }
          groupBy: {
            args: Prisma.InvestmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvestmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvestmentCountArgs<ExtArgs>
            result: $Utils.Optional<InvestmentCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      Proposal: {
        payload: Prisma.$ProposalPayload<ExtArgs>
        fields: Prisma.ProposalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProposalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProposalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>
          }
          findFirst: {
            args: Prisma.ProposalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProposalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>
          }
          findMany: {
            args: Prisma.ProposalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>[]
          }
          create: {
            args: Prisma.ProposalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>
          }
          createMany: {
            args: Prisma.ProposalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProposalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>[]
          }
          delete: {
            args: Prisma.ProposalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>
          }
          update: {
            args: Prisma.ProposalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>
          }
          deleteMany: {
            args: Prisma.ProposalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProposalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProposalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>[]
          }
          upsert: {
            args: Prisma.ProposalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProposalPayload>
          }
          aggregate: {
            args: Prisma.ProposalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProposal>
          }
          groupBy: {
            args: Prisma.ProposalGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProposalGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProposalCountArgs<ExtArgs>
            result: $Utils.Optional<ProposalCountAggregateOutputType> | number
          }
        }
      }
      Vote: {
        payload: Prisma.$VotePayload<ExtArgs>
        fields: Prisma.VoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          findFirst: {
            args: Prisma.VoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          findMany: {
            args: Prisma.VoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>[]
          }
          create: {
            args: Prisma.VoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          createMany: {
            args: Prisma.VoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>[]
          }
          delete: {
            args: Prisma.VoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          update: {
            args: Prisma.VoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          deleteMany: {
            args: Prisma.VoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>[]
          }
          upsert: {
            args: Prisma.VoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VotePayload>
          }
          aggregate: {
            args: Prisma.VoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVote>
          }
          groupBy: {
            args: Prisma.VoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<VoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.VoteCountArgs<ExtArgs>
            result: $Utils.Optional<VoteCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    kyc?: KycOmit
    hotelAsset?: HotelAssetOmit
    investment?: InvestmentOmit
    booking?: BookingOmit
    proposal?: ProposalOmit
    vote?: VoteOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    bookings: number
    createdHotelAssets: number
    investments: number
    reviewedKyc: number
    createdProposals: number
    proposedProposals: number
    votes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | UserCountOutputTypeCountBookingsArgs
    createdHotelAssets?: boolean | UserCountOutputTypeCountCreatedHotelAssetsArgs
    investments?: boolean | UserCountOutputTypeCountInvestmentsArgs
    reviewedKyc?: boolean | UserCountOutputTypeCountReviewedKycArgs
    createdProposals?: boolean | UserCountOutputTypeCountCreatedProposalsArgs
    proposedProposals?: boolean | UserCountOutputTypeCountProposedProposalsArgs
    votes?: boolean | UserCountOutputTypeCountVotesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedHotelAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HotelAssetWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvestmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewedKycArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KycWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedProposalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProposalWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProposedProposalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProposalWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VoteWhereInput
  }


  /**
   * Count Type HotelAssetCountOutputType
   */

  export type HotelAssetCountOutputType = {
    bookings: number
    investments: number
    proposals: number
  }

  export type HotelAssetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | HotelAssetCountOutputTypeCountBookingsArgs
    investments?: boolean | HotelAssetCountOutputTypeCountInvestmentsArgs
    proposals?: boolean | HotelAssetCountOutputTypeCountProposalsArgs
  }

  // Custom InputTypes
  /**
   * HotelAssetCountOutputType without action
   */
  export type HotelAssetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAssetCountOutputType
     */
    select?: HotelAssetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HotelAssetCountOutputType without action
   */
  export type HotelAssetCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * HotelAssetCountOutputType without action
   */
  export type HotelAssetCountOutputTypeCountInvestmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestmentWhereInput
  }

  /**
   * HotelAssetCountOutputType without action
   */
  export type HotelAssetCountOutputTypeCountProposalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProposalWhereInput
  }


  /**
   * Count Type ProposalCountOutputType
   */

  export type ProposalCountOutputType = {
    votes: number
  }

  export type ProposalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    votes?: boolean | ProposalCountOutputTypeCountVotesArgs
  }

  // Custom InputTypes
  /**
   * ProposalCountOutputType without action
   */
  export type ProposalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProposalCountOutputType
     */
    select?: ProposalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProposalCountOutputType without action
   */
  export type ProposalCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VoteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    role: $Enums.UserRole | null
    isEmailVerified: boolean | null
    emailVerifiedAt: Date | null
    kycStatus: $Enums.KycStatus | null
    kycSubmittedAt: Date | null
    kycApprovedAt: Date | null
    walletAddress: string | null
    createdAt: Date | null
    updatedAt: Date | null
    kycExpiresAt: Date | null
    verificationLevel: $Enums.VerificationLevel | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    role: $Enums.UserRole | null
    isEmailVerified: boolean | null
    emailVerifiedAt: Date | null
    kycStatus: $Enums.KycStatus | null
    kycSubmittedAt: Date | null
    kycApprovedAt: Date | null
    walletAddress: string | null
    createdAt: Date | null
    updatedAt: Date | null
    kycExpiresAt: Date | null
    verificationLevel: $Enums.VerificationLevel | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    firstName: number
    lastName: number
    phone: number
    role: number
    isEmailVerified: number
    emailVerifiedAt: number
    kycStatus: number
    kycSubmittedAt: number
    kycApprovedAt: number
    walletAddress: number
    createdAt: number
    updatedAt: number
    kycExpiresAt: number
    verificationLevel: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    phone?: true
    role?: true
    isEmailVerified?: true
    emailVerifiedAt?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycApprovedAt?: true
    walletAddress?: true
    createdAt?: true
    updatedAt?: true
    kycExpiresAt?: true
    verificationLevel?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    phone?: true
    role?: true
    isEmailVerified?: true
    emailVerifiedAt?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycApprovedAt?: true
    walletAddress?: true
    createdAt?: true
    updatedAt?: true
    kycExpiresAt?: true
    verificationLevel?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    phone?: true
    role?: true
    isEmailVerified?: true
    emailVerifiedAt?: true
    kycStatus?: true
    kycSubmittedAt?: true
    kycApprovedAt?: true
    walletAddress?: true
    createdAt?: true
    updatedAt?: true
    kycExpiresAt?: true
    verificationLevel?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    role: $Enums.UserRole
    isEmailVerified: boolean
    emailVerifiedAt: Date | null
    kycStatus: $Enums.KycStatus
    kycSubmittedAt: Date | null
    kycApprovedAt: Date | null
    walletAddress: string | null
    createdAt: Date
    updatedAt: Date
    kycExpiresAt: Date | null
    verificationLevel: $Enums.VerificationLevel | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    role?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    walletAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kycExpiresAt?: boolean
    verificationLevel?: boolean
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    createdHotelAssets?: boolean | User$createdHotelAssetsArgs<ExtArgs>
    investments?: boolean | User$investmentsArgs<ExtArgs>
    reviewedKyc?: boolean | User$reviewedKycArgs<ExtArgs>
    kyc?: boolean | User$kycArgs<ExtArgs>
    createdProposals?: boolean | User$createdProposalsArgs<ExtArgs>
    proposedProposals?: boolean | User$proposedProposalsArgs<ExtArgs>
    votes?: boolean | User$votesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    role?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    walletAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kycExpiresAt?: boolean
    verificationLevel?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    role?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    walletAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kycExpiresAt?: boolean
    verificationLevel?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    role?: boolean
    isEmailVerified?: boolean
    emailVerifiedAt?: boolean
    kycStatus?: boolean
    kycSubmittedAt?: boolean
    kycApprovedAt?: boolean
    walletAddress?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kycExpiresAt?: boolean
    verificationLevel?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "firstName" | "lastName" | "phone" | "role" | "isEmailVerified" | "emailVerifiedAt" | "kycStatus" | "kycSubmittedAt" | "kycApprovedAt" | "walletAddress" | "createdAt" | "updatedAt" | "kycExpiresAt" | "verificationLevel", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    createdHotelAssets?: boolean | User$createdHotelAssetsArgs<ExtArgs>
    investments?: boolean | User$investmentsArgs<ExtArgs>
    reviewedKyc?: boolean | User$reviewedKycArgs<ExtArgs>
    kyc?: boolean | User$kycArgs<ExtArgs>
    createdProposals?: boolean | User$createdProposalsArgs<ExtArgs>
    proposedProposals?: boolean | User$proposedProposalsArgs<ExtArgs>
    votes?: boolean | User$votesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      createdHotelAssets: Prisma.$HotelAssetPayload<ExtArgs>[]
      investments: Prisma.$InvestmentPayload<ExtArgs>[]
      reviewedKyc: Prisma.$KycPayload<ExtArgs>[]
      kyc: Prisma.$KycPayload<ExtArgs> | null
      createdProposals: Prisma.$ProposalPayload<ExtArgs>[]
      proposedProposals: Prisma.$ProposalPayload<ExtArgs>[]
      votes: Prisma.$VotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      firstName: string | null
      lastName: string | null
      phone: string | null
      role: $Enums.UserRole
      isEmailVerified: boolean
      emailVerifiedAt: Date | null
      kycStatus: $Enums.KycStatus
      kycSubmittedAt: Date | null
      kycApprovedAt: Date | null
      walletAddress: string | null
      createdAt: Date
      updatedAt: Date
      kycExpiresAt: Date | null
      verificationLevel: $Enums.VerificationLevel | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookings<T extends User$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, User$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdHotelAssets<T extends User$createdHotelAssetsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdHotelAssetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    investments<T extends User$investmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$investmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviewedKyc<T extends User$reviewedKycArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewedKycArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kyc<T extends User$kycArgs<ExtArgs> = {}>(args?: Subset<T, User$kycArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    createdProposals<T extends User$createdProposalsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdProposalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    proposedProposals<T extends User$proposedProposalsArgs<ExtArgs> = {}>(args?: Subset<T, User$proposedProposalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    votes<T extends User$votesArgs<ExtArgs> = {}>(args?: Subset<T, User$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isEmailVerified: FieldRef<"User", 'Boolean'>
    readonly emailVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly kycStatus: FieldRef<"User", 'KycStatus'>
    readonly kycSubmittedAt: FieldRef<"User", 'DateTime'>
    readonly kycApprovedAt: FieldRef<"User", 'DateTime'>
    readonly walletAddress: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly kycExpiresAt: FieldRef<"User", 'DateTime'>
    readonly verificationLevel: FieldRef<"User", 'VerificationLevel'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.bookings
   */
  export type User$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * User.createdHotelAssets
   */
  export type User$createdHotelAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    where?: HotelAssetWhereInput
    orderBy?: HotelAssetOrderByWithRelationInput | HotelAssetOrderByWithRelationInput[]
    cursor?: HotelAssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HotelAssetScalarFieldEnum | HotelAssetScalarFieldEnum[]
  }

  /**
   * User.investments
   */
  export type User$investmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    where?: InvestmentWhereInput
    orderBy?: InvestmentOrderByWithRelationInput | InvestmentOrderByWithRelationInput[]
    cursor?: InvestmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvestmentScalarFieldEnum | InvestmentScalarFieldEnum[]
  }

  /**
   * User.reviewedKyc
   */
  export type User$reviewedKycArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    where?: KycWhereInput
    orderBy?: KycOrderByWithRelationInput | KycOrderByWithRelationInput[]
    cursor?: KycWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KycScalarFieldEnum | KycScalarFieldEnum[]
  }

  /**
   * User.kyc
   */
  export type User$kycArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    where?: KycWhereInput
  }

  /**
   * User.createdProposals
   */
  export type User$createdProposalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    where?: ProposalWhereInput
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    cursor?: ProposalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProposalScalarFieldEnum | ProposalScalarFieldEnum[]
  }

  /**
   * User.proposedProposals
   */
  export type User$proposedProposalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    where?: ProposalWhereInput
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    cursor?: ProposalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProposalScalarFieldEnum | ProposalScalarFieldEnum[]
  }

  /**
   * User.votes
   */
  export type User$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    where?: VoteWhereInput
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    cursor?: VoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Kyc
   */

  export type AggregateKyc = {
    _count: KycCountAggregateOutputType | null
    _min: KycMinAggregateOutputType | null
    _max: KycMaxAggregateOutputType | null
  }

  export type KycMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    dateOfBirth: Date | null
    nationality: string | null
    address: string | null
    documentType: string | null
    documentNumber: string | null
    documentFront: string | null
    documentBack: string | null
    selfieImage: string | null
    addressProof: string | null
    status: $Enums.KycStatus | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    documentHash: string | null
    expiresAt: Date | null
    approvedAt: Date | null
    blockchainTx: string | null
    blockchainVerifier: string | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KycMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    dateOfBirth: Date | null
    nationality: string | null
    address: string | null
    documentType: string | null
    documentNumber: string | null
    documentFront: string | null
    documentBack: string | null
    selfieImage: string | null
    addressProof: string | null
    status: $Enums.KycStatus | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    documentHash: string | null
    expiresAt: Date | null
    approvedAt: Date | null
    blockchainTx: string | null
    blockchainVerifier: string | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KycCountAggregateOutputType = {
    id: number
    userId: number
    fullName: number
    dateOfBirth: number
    nationality: number
    address: number
    documentType: number
    documentNumber: number
    documentFront: number
    documentBack: number
    selfieImage: number
    addressProof: number
    status: number
    city: number
    state: number
    postalCode: number
    country: number
    documentHash: number
    expiresAt: number
    approvedAt: number
    blockchainTx: number
    blockchainVerifier: number
    rejectionReason: number
    submittedAt: number
    reviewedAt: number
    reviewedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KycMinAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    dateOfBirth?: true
    nationality?: true
    address?: true
    documentType?: true
    documentNumber?: true
    documentFront?: true
    documentBack?: true
    selfieImage?: true
    addressProof?: true
    status?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    documentHash?: true
    expiresAt?: true
    approvedAt?: true
    blockchainTx?: true
    blockchainVerifier?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KycMaxAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    dateOfBirth?: true
    nationality?: true
    address?: true
    documentType?: true
    documentNumber?: true
    documentFront?: true
    documentBack?: true
    selfieImage?: true
    addressProof?: true
    status?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    documentHash?: true
    expiresAt?: true
    approvedAt?: true
    blockchainTx?: true
    blockchainVerifier?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KycCountAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    dateOfBirth?: true
    nationality?: true
    address?: true
    documentType?: true
    documentNumber?: true
    documentFront?: true
    documentBack?: true
    selfieImage?: true
    addressProof?: true
    status?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    documentHash?: true
    expiresAt?: true
    approvedAt?: true
    blockchainTx?: true
    blockchainVerifier?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KycAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Kyc to aggregate.
     */
    where?: KycWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kycs to fetch.
     */
    orderBy?: KycOrderByWithRelationInput | KycOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KycWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kycs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kycs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Kycs
    **/
    _count?: true | KycCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KycMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KycMaxAggregateInputType
  }

  export type GetKycAggregateType<T extends KycAggregateArgs> = {
        [P in keyof T & keyof AggregateKyc]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKyc[P]>
      : GetScalarType<T[P], AggregateKyc[P]>
  }




  export type KycGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KycWhereInput
    orderBy?: KycOrderByWithAggregationInput | KycOrderByWithAggregationInput[]
    by: KycScalarFieldEnum[] | KycScalarFieldEnum
    having?: KycScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KycCountAggregateInputType | true
    _min?: KycMinAggregateInputType
    _max?: KycMaxAggregateInputType
  }

  export type KycGroupByOutputType = {
    id: string
    userId: string
    fullName: string
    dateOfBirth: Date
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront: string | null
    documentBack: string | null
    selfieImage: string | null
    addressProof: string | null
    status: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash: string | null
    expiresAt: Date | null
    approvedAt: Date | null
    blockchainTx: string | null
    blockchainVerifier: string | null
    rejectionReason: string | null
    submittedAt: Date
    reviewedAt: Date | null
    reviewedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: KycCountAggregateOutputType | null
    _min: KycMinAggregateOutputType | null
    _max: KycMaxAggregateOutputType | null
  }

  type GetKycGroupByPayload<T extends KycGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KycGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KycGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KycGroupByOutputType[P]>
            : GetScalarType<T[P], KycGroupByOutputType[P]>
        }
      >
    >


  export type KycSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    documentType?: boolean
    documentNumber?: boolean
    documentFront?: boolean
    documentBack?: boolean
    selfieImage?: boolean
    addressProof?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    documentHash?: boolean
    expiresAt?: boolean
    approvedAt?: boolean
    blockchainTx?: boolean
    blockchainVerifier?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    reviewer?: boolean | Kyc$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["kyc"]>

  export type KycSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    documentType?: boolean
    documentNumber?: boolean
    documentFront?: boolean
    documentBack?: boolean
    selfieImage?: boolean
    addressProof?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    documentHash?: boolean
    expiresAt?: boolean
    approvedAt?: boolean
    blockchainTx?: boolean
    blockchainVerifier?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    reviewer?: boolean | Kyc$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["kyc"]>

  export type KycSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    documentType?: boolean
    documentNumber?: boolean
    documentFront?: boolean
    documentBack?: boolean
    selfieImage?: boolean
    addressProof?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    documentHash?: boolean
    expiresAt?: boolean
    approvedAt?: boolean
    blockchainTx?: boolean
    blockchainVerifier?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    reviewer?: boolean | Kyc$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["kyc"]>

  export type KycSelectScalar = {
    id?: boolean
    userId?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    address?: boolean
    documentType?: boolean
    documentNumber?: boolean
    documentFront?: boolean
    documentBack?: boolean
    selfieImage?: boolean
    addressProof?: boolean
    status?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    documentHash?: boolean
    expiresAt?: boolean
    approvedAt?: boolean
    blockchainTx?: boolean
    blockchainVerifier?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KycOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fullName" | "dateOfBirth" | "nationality" | "address" | "documentType" | "documentNumber" | "documentFront" | "documentBack" | "selfieImage" | "addressProof" | "status" | "city" | "state" | "postalCode" | "country" | "documentHash" | "expiresAt" | "approvedAt" | "blockchainTx" | "blockchainVerifier" | "rejectionReason" | "submittedAt" | "reviewedAt" | "reviewedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["kyc"]>
  export type KycInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    reviewer?: boolean | Kyc$reviewerArgs<ExtArgs>
  }
  export type KycIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    reviewer?: boolean | Kyc$reviewerArgs<ExtArgs>
  }
  export type KycIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    reviewer?: boolean | Kyc$reviewerArgs<ExtArgs>
  }

  export type $KycPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Kyc"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      reviewer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fullName: string
      dateOfBirth: Date
      nationality: string
      address: string
      documentType: string
      documentNumber: string
      documentFront: string | null
      documentBack: string | null
      selfieImage: string | null
      addressProof: string | null
      status: $Enums.KycStatus
      city: string
      state: string
      postalCode: string
      country: string
      documentHash: string | null
      expiresAt: Date | null
      approvedAt: Date | null
      blockchainTx: string | null
      blockchainVerifier: string | null
      rejectionReason: string | null
      submittedAt: Date
      reviewedAt: Date | null
      reviewedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kyc"]>
    composites: {}
  }

  type KycGetPayload<S extends boolean | null | undefined | KycDefaultArgs> = $Result.GetResult<Prisma.$KycPayload, S>

  type KycCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KycFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KycCountAggregateInputType | true
    }

  export interface KycDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Kyc'], meta: { name: 'Kyc' } }
    /**
     * Find zero or one Kyc that matches the filter.
     * @param {KycFindUniqueArgs} args - Arguments to find a Kyc
     * @example
     * // Get one Kyc
     * const kyc = await prisma.kyc.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KycFindUniqueArgs>(args: SelectSubset<T, KycFindUniqueArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Kyc that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KycFindUniqueOrThrowArgs} args - Arguments to find a Kyc
     * @example
     * // Get one Kyc
     * const kyc = await prisma.kyc.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KycFindUniqueOrThrowArgs>(args: SelectSubset<T, KycFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kyc that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycFindFirstArgs} args - Arguments to find a Kyc
     * @example
     * // Get one Kyc
     * const kyc = await prisma.kyc.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KycFindFirstArgs>(args?: SelectSubset<T, KycFindFirstArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kyc that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycFindFirstOrThrowArgs} args - Arguments to find a Kyc
     * @example
     * // Get one Kyc
     * const kyc = await prisma.kyc.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KycFindFirstOrThrowArgs>(args?: SelectSubset<T, KycFindFirstOrThrowArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Kycs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Kycs
     * const kycs = await prisma.kyc.findMany()
     * 
     * // Get first 10 Kycs
     * const kycs = await prisma.kyc.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kycWithIdOnly = await prisma.kyc.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KycFindManyArgs>(args?: SelectSubset<T, KycFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Kyc.
     * @param {KycCreateArgs} args - Arguments to create a Kyc.
     * @example
     * // Create one Kyc
     * const Kyc = await prisma.kyc.create({
     *   data: {
     *     // ... data to create a Kyc
     *   }
     * })
     * 
     */
    create<T extends KycCreateArgs>(args: SelectSubset<T, KycCreateArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Kycs.
     * @param {KycCreateManyArgs} args - Arguments to create many Kycs.
     * @example
     * // Create many Kycs
     * const kyc = await prisma.kyc.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KycCreateManyArgs>(args?: SelectSubset<T, KycCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Kycs and returns the data saved in the database.
     * @param {KycCreateManyAndReturnArgs} args - Arguments to create many Kycs.
     * @example
     * // Create many Kycs
     * const kyc = await prisma.kyc.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Kycs and only return the `id`
     * const kycWithIdOnly = await prisma.kyc.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KycCreateManyAndReturnArgs>(args?: SelectSubset<T, KycCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Kyc.
     * @param {KycDeleteArgs} args - Arguments to delete one Kyc.
     * @example
     * // Delete one Kyc
     * const Kyc = await prisma.kyc.delete({
     *   where: {
     *     // ... filter to delete one Kyc
     *   }
     * })
     * 
     */
    delete<T extends KycDeleteArgs>(args: SelectSubset<T, KycDeleteArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Kyc.
     * @param {KycUpdateArgs} args - Arguments to update one Kyc.
     * @example
     * // Update one Kyc
     * const kyc = await prisma.kyc.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KycUpdateArgs>(args: SelectSubset<T, KycUpdateArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Kycs.
     * @param {KycDeleteManyArgs} args - Arguments to filter Kycs to delete.
     * @example
     * // Delete a few Kycs
     * const { count } = await prisma.kyc.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KycDeleteManyArgs>(args?: SelectSubset<T, KycDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kycs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Kycs
     * const kyc = await prisma.kyc.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KycUpdateManyArgs>(args: SelectSubset<T, KycUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kycs and returns the data updated in the database.
     * @param {KycUpdateManyAndReturnArgs} args - Arguments to update many Kycs.
     * @example
     * // Update many Kycs
     * const kyc = await prisma.kyc.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Kycs and only return the `id`
     * const kycWithIdOnly = await prisma.kyc.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KycUpdateManyAndReturnArgs>(args: SelectSubset<T, KycUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Kyc.
     * @param {KycUpsertArgs} args - Arguments to update or create a Kyc.
     * @example
     * // Update or create a Kyc
     * const kyc = await prisma.kyc.upsert({
     *   create: {
     *     // ... data to create a Kyc
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Kyc we want to update
     *   }
     * })
     */
    upsert<T extends KycUpsertArgs>(args: SelectSubset<T, KycUpsertArgs<ExtArgs>>): Prisma__KycClient<$Result.GetResult<Prisma.$KycPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Kycs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycCountArgs} args - Arguments to filter Kycs to count.
     * @example
     * // Count the number of Kycs
     * const count = await prisma.kyc.count({
     *   where: {
     *     // ... the filter for the Kycs we want to count
     *   }
     * })
    **/
    count<T extends KycCountArgs>(
      args?: Subset<T, KycCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KycCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Kyc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KycAggregateArgs>(args: Subset<T, KycAggregateArgs>): Prisma.PrismaPromise<GetKycAggregateType<T>>

    /**
     * Group by Kyc.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KycGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KycGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KycGroupByArgs['orderBy'] }
        : { orderBy?: KycGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KycGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKycGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Kyc model
   */
  readonly fields: KycFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Kyc.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KycClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviewer<T extends Kyc$reviewerArgs<ExtArgs> = {}>(args?: Subset<T, Kyc$reviewerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Kyc model
   */
  interface KycFieldRefs {
    readonly id: FieldRef<"Kyc", 'String'>
    readonly userId: FieldRef<"Kyc", 'String'>
    readonly fullName: FieldRef<"Kyc", 'String'>
    readonly dateOfBirth: FieldRef<"Kyc", 'DateTime'>
    readonly nationality: FieldRef<"Kyc", 'String'>
    readonly address: FieldRef<"Kyc", 'String'>
    readonly documentType: FieldRef<"Kyc", 'String'>
    readonly documentNumber: FieldRef<"Kyc", 'String'>
    readonly documentFront: FieldRef<"Kyc", 'String'>
    readonly documentBack: FieldRef<"Kyc", 'String'>
    readonly selfieImage: FieldRef<"Kyc", 'String'>
    readonly addressProof: FieldRef<"Kyc", 'String'>
    readonly status: FieldRef<"Kyc", 'KycStatus'>
    readonly city: FieldRef<"Kyc", 'String'>
    readonly state: FieldRef<"Kyc", 'String'>
    readonly postalCode: FieldRef<"Kyc", 'String'>
    readonly country: FieldRef<"Kyc", 'String'>
    readonly documentHash: FieldRef<"Kyc", 'String'>
    readonly expiresAt: FieldRef<"Kyc", 'DateTime'>
    readonly approvedAt: FieldRef<"Kyc", 'DateTime'>
    readonly blockchainTx: FieldRef<"Kyc", 'String'>
    readonly blockchainVerifier: FieldRef<"Kyc", 'String'>
    readonly rejectionReason: FieldRef<"Kyc", 'String'>
    readonly submittedAt: FieldRef<"Kyc", 'DateTime'>
    readonly reviewedAt: FieldRef<"Kyc", 'DateTime'>
    readonly reviewedBy: FieldRef<"Kyc", 'String'>
    readonly createdAt: FieldRef<"Kyc", 'DateTime'>
    readonly updatedAt: FieldRef<"Kyc", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Kyc findUnique
   */
  export type KycFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * Filter, which Kyc to fetch.
     */
    where: KycWhereUniqueInput
  }

  /**
   * Kyc findUniqueOrThrow
   */
  export type KycFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * Filter, which Kyc to fetch.
     */
    where: KycWhereUniqueInput
  }

  /**
   * Kyc findFirst
   */
  export type KycFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * Filter, which Kyc to fetch.
     */
    where?: KycWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kycs to fetch.
     */
    orderBy?: KycOrderByWithRelationInput | KycOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Kycs.
     */
    cursor?: KycWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kycs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kycs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Kycs.
     */
    distinct?: KycScalarFieldEnum | KycScalarFieldEnum[]
  }

  /**
   * Kyc findFirstOrThrow
   */
  export type KycFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * Filter, which Kyc to fetch.
     */
    where?: KycWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kycs to fetch.
     */
    orderBy?: KycOrderByWithRelationInput | KycOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Kycs.
     */
    cursor?: KycWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kycs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kycs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Kycs.
     */
    distinct?: KycScalarFieldEnum | KycScalarFieldEnum[]
  }

  /**
   * Kyc findMany
   */
  export type KycFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * Filter, which Kycs to fetch.
     */
    where?: KycWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kycs to fetch.
     */
    orderBy?: KycOrderByWithRelationInput | KycOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Kycs.
     */
    cursor?: KycWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kycs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kycs.
     */
    skip?: number
    distinct?: KycScalarFieldEnum | KycScalarFieldEnum[]
  }

  /**
   * Kyc create
   */
  export type KycCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * The data needed to create a Kyc.
     */
    data: XOR<KycCreateInput, KycUncheckedCreateInput>
  }

  /**
   * Kyc createMany
   */
  export type KycCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Kycs.
     */
    data: KycCreateManyInput | KycCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Kyc createManyAndReturn
   */
  export type KycCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * The data used to create many Kycs.
     */
    data: KycCreateManyInput | KycCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Kyc update
   */
  export type KycUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * The data needed to update a Kyc.
     */
    data: XOR<KycUpdateInput, KycUncheckedUpdateInput>
    /**
     * Choose, which Kyc to update.
     */
    where: KycWhereUniqueInput
  }

  /**
   * Kyc updateMany
   */
  export type KycUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Kycs.
     */
    data: XOR<KycUpdateManyMutationInput, KycUncheckedUpdateManyInput>
    /**
     * Filter which Kycs to update
     */
    where?: KycWhereInput
    /**
     * Limit how many Kycs to update.
     */
    limit?: number
  }

  /**
   * Kyc updateManyAndReturn
   */
  export type KycUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * The data used to update Kycs.
     */
    data: XOR<KycUpdateManyMutationInput, KycUncheckedUpdateManyInput>
    /**
     * Filter which Kycs to update
     */
    where?: KycWhereInput
    /**
     * Limit how many Kycs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Kyc upsert
   */
  export type KycUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * The filter to search for the Kyc to update in case it exists.
     */
    where: KycWhereUniqueInput
    /**
     * In case the Kyc found by the `where` argument doesn't exist, create a new Kyc with this data.
     */
    create: XOR<KycCreateInput, KycUncheckedCreateInput>
    /**
     * In case the Kyc was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KycUpdateInput, KycUncheckedUpdateInput>
  }

  /**
   * Kyc delete
   */
  export type KycDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
    /**
     * Filter which Kyc to delete.
     */
    where: KycWhereUniqueInput
  }

  /**
   * Kyc deleteMany
   */
  export type KycDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Kycs to delete
     */
    where?: KycWhereInput
    /**
     * Limit how many Kycs to delete.
     */
    limit?: number
  }

  /**
   * Kyc.reviewer
   */
  export type Kyc$reviewerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Kyc without action
   */
  export type KycDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kyc
     */
    select?: KycSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kyc
     */
    omit?: KycOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KycInclude<ExtArgs> | null
  }


  /**
   * Model HotelAsset
   */

  export type AggregateHotelAsset = {
    _count: HotelAssetCountAggregateOutputType | null
    _min: HotelAssetMinAggregateOutputType | null
    _max: HotelAssetMaxAggregateOutputType | null
  }

  export type HotelAssetMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: $Enums.AssetStatus | null
    location: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HotelAssetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: $Enums.AssetStatus | null
    location: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HotelAssetCountAggregateOutputType = {
    id: number
    name: number
    description: number
    status: number
    location: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HotelAssetMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    location?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HotelAssetMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    location?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HotelAssetCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    location?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HotelAssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HotelAsset to aggregate.
     */
    where?: HotelAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotelAssets to fetch.
     */
    orderBy?: HotelAssetOrderByWithRelationInput | HotelAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HotelAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotelAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotelAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HotelAssets
    **/
    _count?: true | HotelAssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HotelAssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HotelAssetMaxAggregateInputType
  }

  export type GetHotelAssetAggregateType<T extends HotelAssetAggregateArgs> = {
        [P in keyof T & keyof AggregateHotelAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHotelAsset[P]>
      : GetScalarType<T[P], AggregateHotelAsset[P]>
  }




  export type HotelAssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HotelAssetWhereInput
    orderBy?: HotelAssetOrderByWithAggregationInput | HotelAssetOrderByWithAggregationInput[]
    by: HotelAssetScalarFieldEnum[] | HotelAssetScalarFieldEnum
    having?: HotelAssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HotelAssetCountAggregateInputType | true
    _min?: HotelAssetMinAggregateInputType
    _max?: HotelAssetMaxAggregateInputType
  }

  export type HotelAssetGroupByOutputType = {
    id: string
    name: string
    description: string | null
    status: $Enums.AssetStatus
    location: string
    createdById: string
    createdAt: Date
    updatedAt: Date
    _count: HotelAssetCountAggregateOutputType | null
    _min: HotelAssetMinAggregateOutputType | null
    _max: HotelAssetMaxAggregateOutputType | null
  }

  type GetHotelAssetGroupByPayload<T extends HotelAssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HotelAssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HotelAssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HotelAssetGroupByOutputType[P]>
            : GetScalarType<T[P], HotelAssetGroupByOutputType[P]>
        }
      >
    >


  export type HotelAssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    location?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    bookings?: boolean | HotelAsset$bookingsArgs<ExtArgs>
    investments?: boolean | HotelAsset$investmentsArgs<ExtArgs>
    proposals?: boolean | HotelAsset$proposalsArgs<ExtArgs>
    _count?: boolean | HotelAssetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotelAsset"]>

  export type HotelAssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    location?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotelAsset"]>

  export type HotelAssetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    location?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotelAsset"]>

  export type HotelAssetSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    location?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HotelAssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "status" | "location" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["hotelAsset"]>
  export type HotelAssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    bookings?: boolean | HotelAsset$bookingsArgs<ExtArgs>
    investments?: boolean | HotelAsset$investmentsArgs<ExtArgs>
    proposals?: boolean | HotelAsset$proposalsArgs<ExtArgs>
    _count?: boolean | HotelAssetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HotelAssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HotelAssetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $HotelAssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HotelAsset"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      investments: Prisma.$InvestmentPayload<ExtArgs>[]
      proposals: Prisma.$ProposalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      status: $Enums.AssetStatus
      location: string
      createdById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hotelAsset"]>
    composites: {}
  }

  type HotelAssetGetPayload<S extends boolean | null | undefined | HotelAssetDefaultArgs> = $Result.GetResult<Prisma.$HotelAssetPayload, S>

  type HotelAssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HotelAssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HotelAssetCountAggregateInputType | true
    }

  export interface HotelAssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HotelAsset'], meta: { name: 'HotelAsset' } }
    /**
     * Find zero or one HotelAsset that matches the filter.
     * @param {HotelAssetFindUniqueArgs} args - Arguments to find a HotelAsset
     * @example
     * // Get one HotelAsset
     * const hotelAsset = await prisma.hotelAsset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HotelAssetFindUniqueArgs>(args: SelectSubset<T, HotelAssetFindUniqueArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HotelAsset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HotelAssetFindUniqueOrThrowArgs} args - Arguments to find a HotelAsset
     * @example
     * // Get one HotelAsset
     * const hotelAsset = await prisma.hotelAsset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HotelAssetFindUniqueOrThrowArgs>(args: SelectSubset<T, HotelAssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HotelAsset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetFindFirstArgs} args - Arguments to find a HotelAsset
     * @example
     * // Get one HotelAsset
     * const hotelAsset = await prisma.hotelAsset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HotelAssetFindFirstArgs>(args?: SelectSubset<T, HotelAssetFindFirstArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HotelAsset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetFindFirstOrThrowArgs} args - Arguments to find a HotelAsset
     * @example
     * // Get one HotelAsset
     * const hotelAsset = await prisma.hotelAsset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HotelAssetFindFirstOrThrowArgs>(args?: SelectSubset<T, HotelAssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HotelAssets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HotelAssets
     * const hotelAssets = await prisma.hotelAsset.findMany()
     * 
     * // Get first 10 HotelAssets
     * const hotelAssets = await prisma.hotelAsset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hotelAssetWithIdOnly = await prisma.hotelAsset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HotelAssetFindManyArgs>(args?: SelectSubset<T, HotelAssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HotelAsset.
     * @param {HotelAssetCreateArgs} args - Arguments to create a HotelAsset.
     * @example
     * // Create one HotelAsset
     * const HotelAsset = await prisma.hotelAsset.create({
     *   data: {
     *     // ... data to create a HotelAsset
     *   }
     * })
     * 
     */
    create<T extends HotelAssetCreateArgs>(args: SelectSubset<T, HotelAssetCreateArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HotelAssets.
     * @param {HotelAssetCreateManyArgs} args - Arguments to create many HotelAssets.
     * @example
     * // Create many HotelAssets
     * const hotelAsset = await prisma.hotelAsset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HotelAssetCreateManyArgs>(args?: SelectSubset<T, HotelAssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HotelAssets and returns the data saved in the database.
     * @param {HotelAssetCreateManyAndReturnArgs} args - Arguments to create many HotelAssets.
     * @example
     * // Create many HotelAssets
     * const hotelAsset = await prisma.hotelAsset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HotelAssets and only return the `id`
     * const hotelAssetWithIdOnly = await prisma.hotelAsset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HotelAssetCreateManyAndReturnArgs>(args?: SelectSubset<T, HotelAssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HotelAsset.
     * @param {HotelAssetDeleteArgs} args - Arguments to delete one HotelAsset.
     * @example
     * // Delete one HotelAsset
     * const HotelAsset = await prisma.hotelAsset.delete({
     *   where: {
     *     // ... filter to delete one HotelAsset
     *   }
     * })
     * 
     */
    delete<T extends HotelAssetDeleteArgs>(args: SelectSubset<T, HotelAssetDeleteArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HotelAsset.
     * @param {HotelAssetUpdateArgs} args - Arguments to update one HotelAsset.
     * @example
     * // Update one HotelAsset
     * const hotelAsset = await prisma.hotelAsset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HotelAssetUpdateArgs>(args: SelectSubset<T, HotelAssetUpdateArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HotelAssets.
     * @param {HotelAssetDeleteManyArgs} args - Arguments to filter HotelAssets to delete.
     * @example
     * // Delete a few HotelAssets
     * const { count } = await prisma.hotelAsset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HotelAssetDeleteManyArgs>(args?: SelectSubset<T, HotelAssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HotelAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HotelAssets
     * const hotelAsset = await prisma.hotelAsset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HotelAssetUpdateManyArgs>(args: SelectSubset<T, HotelAssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HotelAssets and returns the data updated in the database.
     * @param {HotelAssetUpdateManyAndReturnArgs} args - Arguments to update many HotelAssets.
     * @example
     * // Update many HotelAssets
     * const hotelAsset = await prisma.hotelAsset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HotelAssets and only return the `id`
     * const hotelAssetWithIdOnly = await prisma.hotelAsset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HotelAssetUpdateManyAndReturnArgs>(args: SelectSubset<T, HotelAssetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HotelAsset.
     * @param {HotelAssetUpsertArgs} args - Arguments to update or create a HotelAsset.
     * @example
     * // Update or create a HotelAsset
     * const hotelAsset = await prisma.hotelAsset.upsert({
     *   create: {
     *     // ... data to create a HotelAsset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HotelAsset we want to update
     *   }
     * })
     */
    upsert<T extends HotelAssetUpsertArgs>(args: SelectSubset<T, HotelAssetUpsertArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HotelAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetCountArgs} args - Arguments to filter HotelAssets to count.
     * @example
     * // Count the number of HotelAssets
     * const count = await prisma.hotelAsset.count({
     *   where: {
     *     // ... the filter for the HotelAssets we want to count
     *   }
     * })
    **/
    count<T extends HotelAssetCountArgs>(
      args?: Subset<T, HotelAssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HotelAssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HotelAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HotelAssetAggregateArgs>(args: Subset<T, HotelAssetAggregateArgs>): Prisma.PrismaPromise<GetHotelAssetAggregateType<T>>

    /**
     * Group by HotelAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HotelAssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HotelAssetGroupByArgs['orderBy'] }
        : { orderBy?: HotelAssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HotelAssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHotelAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HotelAsset model
   */
  readonly fields: HotelAssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HotelAsset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HotelAssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookings<T extends HotelAsset$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, HotelAsset$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    investments<T extends HotelAsset$investmentsArgs<ExtArgs> = {}>(args?: Subset<T, HotelAsset$investmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    proposals<T extends HotelAsset$proposalsArgs<ExtArgs> = {}>(args?: Subset<T, HotelAsset$proposalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HotelAsset model
   */
  interface HotelAssetFieldRefs {
    readonly id: FieldRef<"HotelAsset", 'String'>
    readonly name: FieldRef<"HotelAsset", 'String'>
    readonly description: FieldRef<"HotelAsset", 'String'>
    readonly status: FieldRef<"HotelAsset", 'AssetStatus'>
    readonly location: FieldRef<"HotelAsset", 'String'>
    readonly createdById: FieldRef<"HotelAsset", 'String'>
    readonly createdAt: FieldRef<"HotelAsset", 'DateTime'>
    readonly updatedAt: FieldRef<"HotelAsset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HotelAsset findUnique
   */
  export type HotelAssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * Filter, which HotelAsset to fetch.
     */
    where: HotelAssetWhereUniqueInput
  }

  /**
   * HotelAsset findUniqueOrThrow
   */
  export type HotelAssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * Filter, which HotelAsset to fetch.
     */
    where: HotelAssetWhereUniqueInput
  }

  /**
   * HotelAsset findFirst
   */
  export type HotelAssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * Filter, which HotelAsset to fetch.
     */
    where?: HotelAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotelAssets to fetch.
     */
    orderBy?: HotelAssetOrderByWithRelationInput | HotelAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HotelAssets.
     */
    cursor?: HotelAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotelAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotelAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HotelAssets.
     */
    distinct?: HotelAssetScalarFieldEnum | HotelAssetScalarFieldEnum[]
  }

  /**
   * HotelAsset findFirstOrThrow
   */
  export type HotelAssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * Filter, which HotelAsset to fetch.
     */
    where?: HotelAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotelAssets to fetch.
     */
    orderBy?: HotelAssetOrderByWithRelationInput | HotelAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HotelAssets.
     */
    cursor?: HotelAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotelAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotelAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HotelAssets.
     */
    distinct?: HotelAssetScalarFieldEnum | HotelAssetScalarFieldEnum[]
  }

  /**
   * HotelAsset findMany
   */
  export type HotelAssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * Filter, which HotelAssets to fetch.
     */
    where?: HotelAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotelAssets to fetch.
     */
    orderBy?: HotelAssetOrderByWithRelationInput | HotelAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HotelAssets.
     */
    cursor?: HotelAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotelAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotelAssets.
     */
    skip?: number
    distinct?: HotelAssetScalarFieldEnum | HotelAssetScalarFieldEnum[]
  }

  /**
   * HotelAsset create
   */
  export type HotelAssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * The data needed to create a HotelAsset.
     */
    data: XOR<HotelAssetCreateInput, HotelAssetUncheckedCreateInput>
  }

  /**
   * HotelAsset createMany
   */
  export type HotelAssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HotelAssets.
     */
    data: HotelAssetCreateManyInput | HotelAssetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HotelAsset createManyAndReturn
   */
  export type HotelAssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * The data used to create many HotelAssets.
     */
    data: HotelAssetCreateManyInput | HotelAssetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HotelAsset update
   */
  export type HotelAssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * The data needed to update a HotelAsset.
     */
    data: XOR<HotelAssetUpdateInput, HotelAssetUncheckedUpdateInput>
    /**
     * Choose, which HotelAsset to update.
     */
    where: HotelAssetWhereUniqueInput
  }

  /**
   * HotelAsset updateMany
   */
  export type HotelAssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HotelAssets.
     */
    data: XOR<HotelAssetUpdateManyMutationInput, HotelAssetUncheckedUpdateManyInput>
    /**
     * Filter which HotelAssets to update
     */
    where?: HotelAssetWhereInput
    /**
     * Limit how many HotelAssets to update.
     */
    limit?: number
  }

  /**
   * HotelAsset updateManyAndReturn
   */
  export type HotelAssetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * The data used to update HotelAssets.
     */
    data: XOR<HotelAssetUpdateManyMutationInput, HotelAssetUncheckedUpdateManyInput>
    /**
     * Filter which HotelAssets to update
     */
    where?: HotelAssetWhereInput
    /**
     * Limit how many HotelAssets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HotelAsset upsert
   */
  export type HotelAssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * The filter to search for the HotelAsset to update in case it exists.
     */
    where: HotelAssetWhereUniqueInput
    /**
     * In case the HotelAsset found by the `where` argument doesn't exist, create a new HotelAsset with this data.
     */
    create: XOR<HotelAssetCreateInput, HotelAssetUncheckedCreateInput>
    /**
     * In case the HotelAsset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HotelAssetUpdateInput, HotelAssetUncheckedUpdateInput>
  }

  /**
   * HotelAsset delete
   */
  export type HotelAssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    /**
     * Filter which HotelAsset to delete.
     */
    where: HotelAssetWhereUniqueInput
  }

  /**
   * HotelAsset deleteMany
   */
  export type HotelAssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HotelAssets to delete
     */
    where?: HotelAssetWhereInput
    /**
     * Limit how many HotelAssets to delete.
     */
    limit?: number
  }

  /**
   * HotelAsset.bookings
   */
  export type HotelAsset$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * HotelAsset.investments
   */
  export type HotelAsset$investmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    where?: InvestmentWhereInput
    orderBy?: InvestmentOrderByWithRelationInput | InvestmentOrderByWithRelationInput[]
    cursor?: InvestmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvestmentScalarFieldEnum | InvestmentScalarFieldEnum[]
  }

  /**
   * HotelAsset.proposals
   */
  export type HotelAsset$proposalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    where?: ProposalWhereInput
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    cursor?: ProposalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProposalScalarFieldEnum | ProposalScalarFieldEnum[]
  }

  /**
   * HotelAsset without action
   */
  export type HotelAssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
  }


  /**
   * Model Investment
   */

  export type AggregateInvestment = {
    _count: InvestmentCountAggregateOutputType | null
    _avg: InvestmentAvgAggregateOutputType | null
    _sum: InvestmentSumAggregateOutputType | null
    _min: InvestmentMinAggregateOutputType | null
    _max: InvestmentMaxAggregateOutputType | null
  }

  export type InvestmentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type InvestmentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type InvestmentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    hotelAssetId: string | null
    amount: Decimal | null
    transactionHash: string | null
    status: $Enums.InvestmentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestmentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    hotelAssetId: string | null
    amount: Decimal | null
    transactionHash: string | null
    status: $Enums.InvestmentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestmentCountAggregateOutputType = {
    id: number
    userId: number
    hotelAssetId: number
    amount: number
    transactionHash: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvestmentAvgAggregateInputType = {
    amount?: true
  }

  export type InvestmentSumAggregateInputType = {
    amount?: true
  }

  export type InvestmentMinAggregateInputType = {
    id?: true
    userId?: true
    hotelAssetId?: true
    amount?: true
    transactionHash?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestmentMaxAggregateInputType = {
    id?: true
    userId?: true
    hotelAssetId?: true
    amount?: true
    transactionHash?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestmentCountAggregateInputType = {
    id?: true
    userId?: true
    hotelAssetId?: true
    amount?: true
    transactionHash?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvestmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Investment to aggregate.
     */
    where?: InvestmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investments to fetch.
     */
    orderBy?: InvestmentOrderByWithRelationInput | InvestmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvestmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Investments
    **/
    _count?: true | InvestmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvestmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvestmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvestmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvestmentMaxAggregateInputType
  }

  export type GetInvestmentAggregateType<T extends InvestmentAggregateArgs> = {
        [P in keyof T & keyof AggregateInvestment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvestment[P]>
      : GetScalarType<T[P], AggregateInvestment[P]>
  }




  export type InvestmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestmentWhereInput
    orderBy?: InvestmentOrderByWithAggregationInput | InvestmentOrderByWithAggregationInput[]
    by: InvestmentScalarFieldEnum[] | InvestmentScalarFieldEnum
    having?: InvestmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvestmentCountAggregateInputType | true
    _avg?: InvestmentAvgAggregateInputType
    _sum?: InvestmentSumAggregateInputType
    _min?: InvestmentMinAggregateInputType
    _max?: InvestmentMaxAggregateInputType
  }

  export type InvestmentGroupByOutputType = {
    id: string
    userId: string
    hotelAssetId: string
    amount: Decimal
    transactionHash: string | null
    status: $Enums.InvestmentStatus
    createdAt: Date
    updatedAt: Date
    _count: InvestmentCountAggregateOutputType | null
    _avg: InvestmentAvgAggregateOutputType | null
    _sum: InvestmentSumAggregateOutputType | null
    _min: InvestmentMinAggregateOutputType | null
    _max: InvestmentMaxAggregateOutputType | null
  }

  type GetInvestmentGroupByPayload<T extends InvestmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvestmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvestmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvestmentGroupByOutputType[P]>
            : GetScalarType<T[P], InvestmentGroupByOutputType[P]>
        }
      >
    >


  export type InvestmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    amount?: boolean
    transactionHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investment"]>

  export type InvestmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    amount?: boolean
    transactionHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investment"]>

  export type InvestmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    amount?: boolean
    transactionHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investment"]>

  export type InvestmentSelectScalar = {
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    amount?: boolean
    transactionHash?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvestmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "hotelAssetId" | "amount" | "transactionHash" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["investment"]>
  export type InvestmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
  }
  export type InvestmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
  }
  export type InvestmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
  }

  export type $InvestmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Investment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      hotelAsset: Prisma.$HotelAssetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      hotelAssetId: string
      amount: Prisma.Decimal
      transactionHash: string | null
      status: $Enums.InvestmentStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["investment"]>
    composites: {}
  }

  type InvestmentGetPayload<S extends boolean | null | undefined | InvestmentDefaultArgs> = $Result.GetResult<Prisma.$InvestmentPayload, S>

  type InvestmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvestmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvestmentCountAggregateInputType | true
    }

  export interface InvestmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Investment'], meta: { name: 'Investment' } }
    /**
     * Find zero or one Investment that matches the filter.
     * @param {InvestmentFindUniqueArgs} args - Arguments to find a Investment
     * @example
     * // Get one Investment
     * const investment = await prisma.investment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvestmentFindUniqueArgs>(args: SelectSubset<T, InvestmentFindUniqueArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Investment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvestmentFindUniqueOrThrowArgs} args - Arguments to find a Investment
     * @example
     * // Get one Investment
     * const investment = await prisma.investment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvestmentFindUniqueOrThrowArgs>(args: SelectSubset<T, InvestmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Investment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentFindFirstArgs} args - Arguments to find a Investment
     * @example
     * // Get one Investment
     * const investment = await prisma.investment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvestmentFindFirstArgs>(args?: SelectSubset<T, InvestmentFindFirstArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Investment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentFindFirstOrThrowArgs} args - Arguments to find a Investment
     * @example
     * // Get one Investment
     * const investment = await prisma.investment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvestmentFindFirstOrThrowArgs>(args?: SelectSubset<T, InvestmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Investments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Investments
     * const investments = await prisma.investment.findMany()
     * 
     * // Get first 10 Investments
     * const investments = await prisma.investment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const investmentWithIdOnly = await prisma.investment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvestmentFindManyArgs>(args?: SelectSubset<T, InvestmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Investment.
     * @param {InvestmentCreateArgs} args - Arguments to create a Investment.
     * @example
     * // Create one Investment
     * const Investment = await prisma.investment.create({
     *   data: {
     *     // ... data to create a Investment
     *   }
     * })
     * 
     */
    create<T extends InvestmentCreateArgs>(args: SelectSubset<T, InvestmentCreateArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Investments.
     * @param {InvestmentCreateManyArgs} args - Arguments to create many Investments.
     * @example
     * // Create many Investments
     * const investment = await prisma.investment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvestmentCreateManyArgs>(args?: SelectSubset<T, InvestmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Investments and returns the data saved in the database.
     * @param {InvestmentCreateManyAndReturnArgs} args - Arguments to create many Investments.
     * @example
     * // Create many Investments
     * const investment = await prisma.investment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Investments and only return the `id`
     * const investmentWithIdOnly = await prisma.investment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvestmentCreateManyAndReturnArgs>(args?: SelectSubset<T, InvestmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Investment.
     * @param {InvestmentDeleteArgs} args - Arguments to delete one Investment.
     * @example
     * // Delete one Investment
     * const Investment = await prisma.investment.delete({
     *   where: {
     *     // ... filter to delete one Investment
     *   }
     * })
     * 
     */
    delete<T extends InvestmentDeleteArgs>(args: SelectSubset<T, InvestmentDeleteArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Investment.
     * @param {InvestmentUpdateArgs} args - Arguments to update one Investment.
     * @example
     * // Update one Investment
     * const investment = await prisma.investment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvestmentUpdateArgs>(args: SelectSubset<T, InvestmentUpdateArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Investments.
     * @param {InvestmentDeleteManyArgs} args - Arguments to filter Investments to delete.
     * @example
     * // Delete a few Investments
     * const { count } = await prisma.investment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvestmentDeleteManyArgs>(args?: SelectSubset<T, InvestmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Investments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Investments
     * const investment = await prisma.investment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvestmentUpdateManyArgs>(args: SelectSubset<T, InvestmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Investments and returns the data updated in the database.
     * @param {InvestmentUpdateManyAndReturnArgs} args - Arguments to update many Investments.
     * @example
     * // Update many Investments
     * const investment = await prisma.investment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Investments and only return the `id`
     * const investmentWithIdOnly = await prisma.investment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvestmentUpdateManyAndReturnArgs>(args: SelectSubset<T, InvestmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Investment.
     * @param {InvestmentUpsertArgs} args - Arguments to update or create a Investment.
     * @example
     * // Update or create a Investment
     * const investment = await prisma.investment.upsert({
     *   create: {
     *     // ... data to create a Investment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Investment we want to update
     *   }
     * })
     */
    upsert<T extends InvestmentUpsertArgs>(args: SelectSubset<T, InvestmentUpsertArgs<ExtArgs>>): Prisma__InvestmentClient<$Result.GetResult<Prisma.$InvestmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Investments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentCountArgs} args - Arguments to filter Investments to count.
     * @example
     * // Count the number of Investments
     * const count = await prisma.investment.count({
     *   where: {
     *     // ... the filter for the Investments we want to count
     *   }
     * })
    **/
    count<T extends InvestmentCountArgs>(
      args?: Subset<T, InvestmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvestmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Investment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvestmentAggregateArgs>(args: Subset<T, InvestmentAggregateArgs>): Prisma.PrismaPromise<GetInvestmentAggregateType<T>>

    /**
     * Group by Investment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvestmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvestmentGroupByArgs['orderBy'] }
        : { orderBy?: InvestmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvestmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvestmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Investment model
   */
  readonly fields: InvestmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Investment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvestmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    hotelAsset<T extends HotelAssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HotelAssetDefaultArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Investment model
   */
  interface InvestmentFieldRefs {
    readonly id: FieldRef<"Investment", 'String'>
    readonly userId: FieldRef<"Investment", 'String'>
    readonly hotelAssetId: FieldRef<"Investment", 'String'>
    readonly amount: FieldRef<"Investment", 'Decimal'>
    readonly transactionHash: FieldRef<"Investment", 'String'>
    readonly status: FieldRef<"Investment", 'InvestmentStatus'>
    readonly createdAt: FieldRef<"Investment", 'DateTime'>
    readonly updatedAt: FieldRef<"Investment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Investment findUnique
   */
  export type InvestmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * Filter, which Investment to fetch.
     */
    where: InvestmentWhereUniqueInput
  }

  /**
   * Investment findUniqueOrThrow
   */
  export type InvestmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * Filter, which Investment to fetch.
     */
    where: InvestmentWhereUniqueInput
  }

  /**
   * Investment findFirst
   */
  export type InvestmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * Filter, which Investment to fetch.
     */
    where?: InvestmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investments to fetch.
     */
    orderBy?: InvestmentOrderByWithRelationInput | InvestmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Investments.
     */
    cursor?: InvestmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Investments.
     */
    distinct?: InvestmentScalarFieldEnum | InvestmentScalarFieldEnum[]
  }

  /**
   * Investment findFirstOrThrow
   */
  export type InvestmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * Filter, which Investment to fetch.
     */
    where?: InvestmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investments to fetch.
     */
    orderBy?: InvestmentOrderByWithRelationInput | InvestmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Investments.
     */
    cursor?: InvestmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Investments.
     */
    distinct?: InvestmentScalarFieldEnum | InvestmentScalarFieldEnum[]
  }

  /**
   * Investment findMany
   */
  export type InvestmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * Filter, which Investments to fetch.
     */
    where?: InvestmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Investments to fetch.
     */
    orderBy?: InvestmentOrderByWithRelationInput | InvestmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Investments.
     */
    cursor?: InvestmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Investments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Investments.
     */
    skip?: number
    distinct?: InvestmentScalarFieldEnum | InvestmentScalarFieldEnum[]
  }

  /**
   * Investment create
   */
  export type InvestmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Investment.
     */
    data: XOR<InvestmentCreateInput, InvestmentUncheckedCreateInput>
  }

  /**
   * Investment createMany
   */
  export type InvestmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Investments.
     */
    data: InvestmentCreateManyInput | InvestmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Investment createManyAndReturn
   */
  export type InvestmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * The data used to create many Investments.
     */
    data: InvestmentCreateManyInput | InvestmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Investment update
   */
  export type InvestmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Investment.
     */
    data: XOR<InvestmentUpdateInput, InvestmentUncheckedUpdateInput>
    /**
     * Choose, which Investment to update.
     */
    where: InvestmentWhereUniqueInput
  }

  /**
   * Investment updateMany
   */
  export type InvestmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Investments.
     */
    data: XOR<InvestmentUpdateManyMutationInput, InvestmentUncheckedUpdateManyInput>
    /**
     * Filter which Investments to update
     */
    where?: InvestmentWhereInput
    /**
     * Limit how many Investments to update.
     */
    limit?: number
  }

  /**
   * Investment updateManyAndReturn
   */
  export type InvestmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * The data used to update Investments.
     */
    data: XOR<InvestmentUpdateManyMutationInput, InvestmentUncheckedUpdateManyInput>
    /**
     * Filter which Investments to update
     */
    where?: InvestmentWhereInput
    /**
     * Limit how many Investments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Investment upsert
   */
  export type InvestmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Investment to update in case it exists.
     */
    where: InvestmentWhereUniqueInput
    /**
     * In case the Investment found by the `where` argument doesn't exist, create a new Investment with this data.
     */
    create: XOR<InvestmentCreateInput, InvestmentUncheckedCreateInput>
    /**
     * In case the Investment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvestmentUpdateInput, InvestmentUncheckedUpdateInput>
  }

  /**
   * Investment delete
   */
  export type InvestmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
    /**
     * Filter which Investment to delete.
     */
    where: InvestmentWhereUniqueInput
  }

  /**
   * Investment deleteMany
   */
  export type InvestmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Investments to delete
     */
    where?: InvestmentWhereInput
    /**
     * Limit how many Investments to delete.
     */
    limit?: number
  }

  /**
   * Investment without action
   */
  export type InvestmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Investment
     */
    select?: InvestmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Investment
     */
    omit?: InvestmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestmentInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    guests: number | null
    totalPrice: Decimal | null
  }

  export type BookingSumAggregateOutputType = {
    guests: number | null
    totalPrice: Decimal | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    hotelAssetId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    guests: number | null
    roomType: string | null
    totalPrice: Decimal | null
    status: $Enums.BookingStatus | null
    specialRequests: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    hotelAssetId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    guests: number | null
    roomType: string | null
    totalPrice: Decimal | null
    status: $Enums.BookingStatus | null
    specialRequests: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    userId: number
    hotelAssetId: number
    checkInDate: number
    checkOutDate: number
    guests: number
    roomType: number
    totalPrice: number
    status: number
    specialRequests: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    guests?: true
    totalPrice?: true
  }

  export type BookingSumAggregateInputType = {
    guests?: true
    totalPrice?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    userId?: true
    hotelAssetId?: true
    checkInDate?: true
    checkOutDate?: true
    guests?: true
    roomType?: true
    totalPrice?: true
    status?: true
    specialRequests?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    userId?: true
    hotelAssetId?: true
    checkInDate?: true
    checkOutDate?: true
    guests?: true
    roomType?: true
    totalPrice?: true
    status?: true
    specialRequests?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    userId?: true
    hotelAssetId?: true
    checkInDate?: true
    checkOutDate?: true
    guests?: true
    roomType?: true
    totalPrice?: true
    status?: true
    specialRequests?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    userId: string
    hotelAssetId: string
    checkInDate: Date
    checkOutDate: Date
    guests: number
    roomType: string
    totalPrice: Decimal
    status: $Enums.BookingStatus
    specialRequests: string | null
    createdAt: Date
    updatedAt: Date
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    guests?: boolean
    roomType?: boolean
    totalPrice?: boolean
    status?: boolean
    specialRequests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    guests?: boolean
    roomType?: boolean
    totalPrice?: boolean
    status?: boolean
    specialRequests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    guests?: boolean
    roomType?: boolean
    totalPrice?: boolean
    status?: boolean
    specialRequests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    userId?: boolean
    hotelAssetId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    guests?: boolean
    roomType?: boolean
    totalPrice?: boolean
    status?: boolean
    specialRequests?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "hotelAssetId" | "checkInDate" | "checkOutDate" | "guests" | "roomType" | "totalPrice" | "status" | "specialRequests" | "createdAt" | "updatedAt", ExtArgs["result"]["booking"]>
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BookingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotelAsset?: boolean | HotelAssetDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      hotelAsset: Prisma.$HotelAssetPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      hotelAssetId: string
      checkInDate: Date
      checkOutDate: Date
      guests: number
      roomType: string
      totalPrice: Prisma.Decimal
      status: $Enums.BookingStatus
      specialRequests: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hotelAsset<T extends HotelAssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HotelAssetDefaultArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly userId: FieldRef<"Booking", 'String'>
    readonly hotelAssetId: FieldRef<"Booking", 'String'>
    readonly checkInDate: FieldRef<"Booking", 'DateTime'>
    readonly checkOutDate: FieldRef<"Booking", 'DateTime'>
    readonly guests: FieldRef<"Booking", 'Int'>
    readonly roomType: FieldRef<"Booking", 'String'>
    readonly totalPrice: FieldRef<"Booking", 'Decimal'>
    readonly status: FieldRef<"Booking", 'BookingStatus'>
    readonly specialRequests: FieldRef<"Booking", 'String'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
  }

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model Proposal
   */

  export type AggregateProposal = {
    _count: ProposalCountAggregateOutputType | null
    _avg: ProposalAvgAggregateOutputType | null
    _sum: ProposalSumAggregateOutputType | null
    _min: ProposalMinAggregateOutputType | null
    _max: ProposalMaxAggregateOutputType | null
  }

  export type ProposalAvgAggregateOutputType = {
    votesFor: number | null
    votesAgainst: number | null
    votesAbstain: number | null
    quorumRequired: number | null
    approvalThreshold: number | null
  }

  export type ProposalSumAggregateOutputType = {
    votesFor: number | null
    votesAgainst: number | null
    votesAbstain: number | null
    quorumRequired: number | null
    approvalThreshold: number | null
  }

  export type ProposalMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    type: $Enums.ProposalType | null
    proposerId: string | null
    hotelAssetId: string | null
    status: $Enums.ProposalStatus | null
    votingStartDate: Date | null
    votingEndDate: Date | null
    votesFor: number | null
    votesAgainst: number | null
    votesAbstain: number | null
    quorumRequired: number | null
    approvalThreshold: number | null
    executionDetails: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdById: string | null
  }

  export type ProposalMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    type: $Enums.ProposalType | null
    proposerId: string | null
    hotelAssetId: string | null
    status: $Enums.ProposalStatus | null
    votingStartDate: Date | null
    votingEndDate: Date | null
    votesFor: number | null
    votesAgainst: number | null
    votesAbstain: number | null
    quorumRequired: number | null
    approvalThreshold: number | null
    executionDetails: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdById: string | null
  }

  export type ProposalCountAggregateOutputType = {
    id: number
    title: number
    description: number
    type: number
    proposerId: number
    hotelAssetId: number
    status: number
    votingStartDate: number
    votingEndDate: number
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails: number
    createdAt: number
    updatedAt: number
    createdById: number
    _all: number
  }


  export type ProposalAvgAggregateInputType = {
    votesFor?: true
    votesAgainst?: true
    votesAbstain?: true
    quorumRequired?: true
    approvalThreshold?: true
  }

  export type ProposalSumAggregateInputType = {
    votesFor?: true
    votesAgainst?: true
    votesAbstain?: true
    quorumRequired?: true
    approvalThreshold?: true
  }

  export type ProposalMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    type?: true
    proposerId?: true
    hotelAssetId?: true
    status?: true
    votingStartDate?: true
    votingEndDate?: true
    votesFor?: true
    votesAgainst?: true
    votesAbstain?: true
    quorumRequired?: true
    approvalThreshold?: true
    executionDetails?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
  }

  export type ProposalMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    type?: true
    proposerId?: true
    hotelAssetId?: true
    status?: true
    votingStartDate?: true
    votingEndDate?: true
    votesFor?: true
    votesAgainst?: true
    votesAbstain?: true
    quorumRequired?: true
    approvalThreshold?: true
    executionDetails?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
  }

  export type ProposalCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    type?: true
    proposerId?: true
    hotelAssetId?: true
    status?: true
    votingStartDate?: true
    votingEndDate?: true
    votesFor?: true
    votesAgainst?: true
    votesAbstain?: true
    quorumRequired?: true
    approvalThreshold?: true
    executionDetails?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
    _all?: true
  }

  export type ProposalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Proposal to aggregate.
     */
    where?: ProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proposals to fetch.
     */
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Proposals
    **/
    _count?: true | ProposalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProposalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProposalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProposalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProposalMaxAggregateInputType
  }

  export type GetProposalAggregateType<T extends ProposalAggregateArgs> = {
        [P in keyof T & keyof AggregateProposal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProposal[P]>
      : GetScalarType<T[P], AggregateProposal[P]>
  }




  export type ProposalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProposalWhereInput
    orderBy?: ProposalOrderByWithAggregationInput | ProposalOrderByWithAggregationInput[]
    by: ProposalScalarFieldEnum[] | ProposalScalarFieldEnum
    having?: ProposalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProposalCountAggregateInputType | true
    _avg?: ProposalAvgAggregateInputType
    _sum?: ProposalSumAggregateInputType
    _min?: ProposalMinAggregateInputType
    _max?: ProposalMaxAggregateInputType
  }

  export type ProposalGroupByOutputType = {
    id: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    hotelAssetId: string | null
    status: $Enums.ProposalStatus
    votingStartDate: Date | null
    votingEndDate: Date | null
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails: string | null
    createdAt: Date
    updatedAt: Date
    createdById: string
    _count: ProposalCountAggregateOutputType | null
    _avg: ProposalAvgAggregateOutputType | null
    _sum: ProposalSumAggregateOutputType | null
    _min: ProposalMinAggregateOutputType | null
    _max: ProposalMaxAggregateOutputType | null
  }

  type GetProposalGroupByPayload<T extends ProposalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProposalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProposalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProposalGroupByOutputType[P]>
            : GetScalarType<T[P], ProposalGroupByOutputType[P]>
        }
      >
    >


  export type ProposalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    proposerId?: boolean
    hotelAssetId?: boolean
    status?: boolean
    votingStartDate?: boolean
    votingEndDate?: boolean
    votesFor?: boolean
    votesAgainst?: boolean
    votesAbstain?: boolean
    quorumRequired?: boolean
    approvalThreshold?: boolean
    executionDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | Proposal$hotelAssetArgs<ExtArgs>
    proposer?: boolean | UserDefaultArgs<ExtArgs>
    votes?: boolean | Proposal$votesArgs<ExtArgs>
    _count?: boolean | ProposalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proposal"]>

  export type ProposalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    proposerId?: boolean
    hotelAssetId?: boolean
    status?: boolean
    votingStartDate?: boolean
    votingEndDate?: boolean
    votesFor?: boolean
    votesAgainst?: boolean
    votesAbstain?: boolean
    quorumRequired?: boolean
    approvalThreshold?: boolean
    executionDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | Proposal$hotelAssetArgs<ExtArgs>
    proposer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proposal"]>

  export type ProposalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    proposerId?: boolean
    hotelAssetId?: boolean
    status?: boolean
    votingStartDate?: boolean
    votingEndDate?: boolean
    votesFor?: boolean
    votesAgainst?: boolean
    votesAbstain?: boolean
    quorumRequired?: boolean
    approvalThreshold?: boolean
    executionDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | Proposal$hotelAssetArgs<ExtArgs>
    proposer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proposal"]>

  export type ProposalSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    proposerId?: boolean
    hotelAssetId?: boolean
    status?: boolean
    votingStartDate?: boolean
    votingEndDate?: boolean
    votesFor?: boolean
    votesAgainst?: boolean
    votesAbstain?: boolean
    quorumRequired?: boolean
    approvalThreshold?: boolean
    executionDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
  }

  export type ProposalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "type" | "proposerId" | "hotelAssetId" | "status" | "votingStartDate" | "votingEndDate" | "votesFor" | "votesAgainst" | "votesAbstain" | "quorumRequired" | "approvalThreshold" | "executionDetails" | "createdAt" | "updatedAt" | "createdById", ExtArgs["result"]["proposal"]>
  export type ProposalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | Proposal$hotelAssetArgs<ExtArgs>
    proposer?: boolean | UserDefaultArgs<ExtArgs>
    votes?: boolean | Proposal$votesArgs<ExtArgs>
    _count?: boolean | ProposalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProposalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | Proposal$hotelAssetArgs<ExtArgs>
    proposer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProposalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    hotelAsset?: boolean | Proposal$hotelAssetArgs<ExtArgs>
    proposer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProposalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Proposal"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      hotelAsset: Prisma.$HotelAssetPayload<ExtArgs> | null
      proposer: Prisma.$UserPayload<ExtArgs>
      votes: Prisma.$VotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      type: $Enums.ProposalType
      proposerId: string
      hotelAssetId: string | null
      status: $Enums.ProposalStatus
      votingStartDate: Date | null
      votingEndDate: Date | null
      votesFor: number
      votesAgainst: number
      votesAbstain: number
      quorumRequired: number
      approvalThreshold: number
      executionDetails: string | null
      createdAt: Date
      updatedAt: Date
      createdById: string
    }, ExtArgs["result"]["proposal"]>
    composites: {}
  }

  type ProposalGetPayload<S extends boolean | null | undefined | ProposalDefaultArgs> = $Result.GetResult<Prisma.$ProposalPayload, S>

  type ProposalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProposalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProposalCountAggregateInputType | true
    }

  export interface ProposalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Proposal'], meta: { name: 'Proposal' } }
    /**
     * Find zero or one Proposal that matches the filter.
     * @param {ProposalFindUniqueArgs} args - Arguments to find a Proposal
     * @example
     * // Get one Proposal
     * const proposal = await prisma.proposal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProposalFindUniqueArgs>(args: SelectSubset<T, ProposalFindUniqueArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Proposal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProposalFindUniqueOrThrowArgs} args - Arguments to find a Proposal
     * @example
     * // Get one Proposal
     * const proposal = await prisma.proposal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProposalFindUniqueOrThrowArgs>(args: SelectSubset<T, ProposalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Proposal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalFindFirstArgs} args - Arguments to find a Proposal
     * @example
     * // Get one Proposal
     * const proposal = await prisma.proposal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProposalFindFirstArgs>(args?: SelectSubset<T, ProposalFindFirstArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Proposal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalFindFirstOrThrowArgs} args - Arguments to find a Proposal
     * @example
     * // Get one Proposal
     * const proposal = await prisma.proposal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProposalFindFirstOrThrowArgs>(args?: SelectSubset<T, ProposalFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Proposals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Proposals
     * const proposals = await prisma.proposal.findMany()
     * 
     * // Get first 10 Proposals
     * const proposals = await prisma.proposal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const proposalWithIdOnly = await prisma.proposal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProposalFindManyArgs>(args?: SelectSubset<T, ProposalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Proposal.
     * @param {ProposalCreateArgs} args - Arguments to create a Proposal.
     * @example
     * // Create one Proposal
     * const Proposal = await prisma.proposal.create({
     *   data: {
     *     // ... data to create a Proposal
     *   }
     * })
     * 
     */
    create<T extends ProposalCreateArgs>(args: SelectSubset<T, ProposalCreateArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Proposals.
     * @param {ProposalCreateManyArgs} args - Arguments to create many Proposals.
     * @example
     * // Create many Proposals
     * const proposal = await prisma.proposal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProposalCreateManyArgs>(args?: SelectSubset<T, ProposalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Proposals and returns the data saved in the database.
     * @param {ProposalCreateManyAndReturnArgs} args - Arguments to create many Proposals.
     * @example
     * // Create many Proposals
     * const proposal = await prisma.proposal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Proposals and only return the `id`
     * const proposalWithIdOnly = await prisma.proposal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProposalCreateManyAndReturnArgs>(args?: SelectSubset<T, ProposalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Proposal.
     * @param {ProposalDeleteArgs} args - Arguments to delete one Proposal.
     * @example
     * // Delete one Proposal
     * const Proposal = await prisma.proposal.delete({
     *   where: {
     *     // ... filter to delete one Proposal
     *   }
     * })
     * 
     */
    delete<T extends ProposalDeleteArgs>(args: SelectSubset<T, ProposalDeleteArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Proposal.
     * @param {ProposalUpdateArgs} args - Arguments to update one Proposal.
     * @example
     * // Update one Proposal
     * const proposal = await prisma.proposal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProposalUpdateArgs>(args: SelectSubset<T, ProposalUpdateArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Proposals.
     * @param {ProposalDeleteManyArgs} args - Arguments to filter Proposals to delete.
     * @example
     * // Delete a few Proposals
     * const { count } = await prisma.proposal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProposalDeleteManyArgs>(args?: SelectSubset<T, ProposalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Proposals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Proposals
     * const proposal = await prisma.proposal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProposalUpdateManyArgs>(args: SelectSubset<T, ProposalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Proposals and returns the data updated in the database.
     * @param {ProposalUpdateManyAndReturnArgs} args - Arguments to update many Proposals.
     * @example
     * // Update many Proposals
     * const proposal = await prisma.proposal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Proposals and only return the `id`
     * const proposalWithIdOnly = await prisma.proposal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProposalUpdateManyAndReturnArgs>(args: SelectSubset<T, ProposalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Proposal.
     * @param {ProposalUpsertArgs} args - Arguments to update or create a Proposal.
     * @example
     * // Update or create a Proposal
     * const proposal = await prisma.proposal.upsert({
     *   create: {
     *     // ... data to create a Proposal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Proposal we want to update
     *   }
     * })
     */
    upsert<T extends ProposalUpsertArgs>(args: SelectSubset<T, ProposalUpsertArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Proposals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalCountArgs} args - Arguments to filter Proposals to count.
     * @example
     * // Count the number of Proposals
     * const count = await prisma.proposal.count({
     *   where: {
     *     // ... the filter for the Proposals we want to count
     *   }
     * })
    **/
    count<T extends ProposalCountArgs>(
      args?: Subset<T, ProposalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProposalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Proposal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProposalAggregateArgs>(args: Subset<T, ProposalAggregateArgs>): Prisma.PrismaPromise<GetProposalAggregateType<T>>

    /**
     * Group by Proposal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProposalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProposalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProposalGroupByArgs['orderBy'] }
        : { orderBy?: ProposalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProposalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProposalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Proposal model
   */
  readonly fields: ProposalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Proposal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProposalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    hotelAsset<T extends Proposal$hotelAssetArgs<ExtArgs> = {}>(args?: Subset<T, Proposal$hotelAssetArgs<ExtArgs>>): Prisma__HotelAssetClient<$Result.GetResult<Prisma.$HotelAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    proposer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    votes<T extends Proposal$votesArgs<ExtArgs> = {}>(args?: Subset<T, Proposal$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Proposal model
   */
  interface ProposalFieldRefs {
    readonly id: FieldRef<"Proposal", 'String'>
    readonly title: FieldRef<"Proposal", 'String'>
    readonly description: FieldRef<"Proposal", 'String'>
    readonly type: FieldRef<"Proposal", 'ProposalType'>
    readonly proposerId: FieldRef<"Proposal", 'String'>
    readonly hotelAssetId: FieldRef<"Proposal", 'String'>
    readonly status: FieldRef<"Proposal", 'ProposalStatus'>
    readonly votingStartDate: FieldRef<"Proposal", 'DateTime'>
    readonly votingEndDate: FieldRef<"Proposal", 'DateTime'>
    readonly votesFor: FieldRef<"Proposal", 'Int'>
    readonly votesAgainst: FieldRef<"Proposal", 'Int'>
    readonly votesAbstain: FieldRef<"Proposal", 'Int'>
    readonly quorumRequired: FieldRef<"Proposal", 'Int'>
    readonly approvalThreshold: FieldRef<"Proposal", 'Int'>
    readonly executionDetails: FieldRef<"Proposal", 'String'>
    readonly createdAt: FieldRef<"Proposal", 'DateTime'>
    readonly updatedAt: FieldRef<"Proposal", 'DateTime'>
    readonly createdById: FieldRef<"Proposal", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Proposal findUnique
   */
  export type ProposalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * Filter, which Proposal to fetch.
     */
    where: ProposalWhereUniqueInput
  }

  /**
   * Proposal findUniqueOrThrow
   */
  export type ProposalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * Filter, which Proposal to fetch.
     */
    where: ProposalWhereUniqueInput
  }

  /**
   * Proposal findFirst
   */
  export type ProposalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * Filter, which Proposal to fetch.
     */
    where?: ProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proposals to fetch.
     */
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Proposals.
     */
    cursor?: ProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Proposals.
     */
    distinct?: ProposalScalarFieldEnum | ProposalScalarFieldEnum[]
  }

  /**
   * Proposal findFirstOrThrow
   */
  export type ProposalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * Filter, which Proposal to fetch.
     */
    where?: ProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proposals to fetch.
     */
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Proposals.
     */
    cursor?: ProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proposals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Proposals.
     */
    distinct?: ProposalScalarFieldEnum | ProposalScalarFieldEnum[]
  }

  /**
   * Proposal findMany
   */
  export type ProposalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * Filter, which Proposals to fetch.
     */
    where?: ProposalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proposals to fetch.
     */
    orderBy?: ProposalOrderByWithRelationInput | ProposalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Proposals.
     */
    cursor?: ProposalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proposals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proposals.
     */
    skip?: number
    distinct?: ProposalScalarFieldEnum | ProposalScalarFieldEnum[]
  }

  /**
   * Proposal create
   */
  export type ProposalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * The data needed to create a Proposal.
     */
    data: XOR<ProposalCreateInput, ProposalUncheckedCreateInput>
  }

  /**
   * Proposal createMany
   */
  export type ProposalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Proposals.
     */
    data: ProposalCreateManyInput | ProposalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Proposal createManyAndReturn
   */
  export type ProposalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * The data used to create many Proposals.
     */
    data: ProposalCreateManyInput | ProposalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Proposal update
   */
  export type ProposalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * The data needed to update a Proposal.
     */
    data: XOR<ProposalUpdateInput, ProposalUncheckedUpdateInput>
    /**
     * Choose, which Proposal to update.
     */
    where: ProposalWhereUniqueInput
  }

  /**
   * Proposal updateMany
   */
  export type ProposalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Proposals.
     */
    data: XOR<ProposalUpdateManyMutationInput, ProposalUncheckedUpdateManyInput>
    /**
     * Filter which Proposals to update
     */
    where?: ProposalWhereInput
    /**
     * Limit how many Proposals to update.
     */
    limit?: number
  }

  /**
   * Proposal updateManyAndReturn
   */
  export type ProposalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * The data used to update Proposals.
     */
    data: XOR<ProposalUpdateManyMutationInput, ProposalUncheckedUpdateManyInput>
    /**
     * Filter which Proposals to update
     */
    where?: ProposalWhereInput
    /**
     * Limit how many Proposals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Proposal upsert
   */
  export type ProposalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * The filter to search for the Proposal to update in case it exists.
     */
    where: ProposalWhereUniqueInput
    /**
     * In case the Proposal found by the `where` argument doesn't exist, create a new Proposal with this data.
     */
    create: XOR<ProposalCreateInput, ProposalUncheckedCreateInput>
    /**
     * In case the Proposal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProposalUpdateInput, ProposalUncheckedUpdateInput>
  }

  /**
   * Proposal delete
   */
  export type ProposalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
    /**
     * Filter which Proposal to delete.
     */
    where: ProposalWhereUniqueInput
  }

  /**
   * Proposal deleteMany
   */
  export type ProposalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Proposals to delete
     */
    where?: ProposalWhereInput
    /**
     * Limit how many Proposals to delete.
     */
    limit?: number
  }

  /**
   * Proposal.hotelAsset
   */
  export type Proposal$hotelAssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelAsset
     */
    select?: HotelAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotelAsset
     */
    omit?: HotelAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelAssetInclude<ExtArgs> | null
    where?: HotelAssetWhereInput
  }

  /**
   * Proposal.votes
   */
  export type Proposal$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    where?: VoteWhereInput
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    cursor?: VoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Proposal without action
   */
  export type ProposalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposal
     */
    select?: ProposalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proposal
     */
    omit?: ProposalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProposalInclude<ExtArgs> | null
  }


  /**
   * Model Vote
   */

  export type AggregateVote = {
    _count: VoteCountAggregateOutputType | null
    _avg: VoteAvgAggregateOutputType | null
    _sum: VoteSumAggregateOutputType | null
    _min: VoteMinAggregateOutputType | null
    _max: VoteMaxAggregateOutputType | null
  }

  export type VoteAvgAggregateOutputType = {
    votingPower: number | null
  }

  export type VoteSumAggregateOutputType = {
    votingPower: number | null
  }

  export type VoteMinAggregateOutputType = {
    id: string | null
    proposalId: string | null
    userId: string | null
    choice: $Enums.VoteChoice | null
    votingPower: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type VoteMaxAggregateOutputType = {
    id: string | null
    proposalId: string | null
    userId: string | null
    choice: $Enums.VoteChoice | null
    votingPower: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type VoteCountAggregateOutputType = {
    id: number
    proposalId: number
    userId: number
    choice: number
    votingPower: number
    comment: number
    createdAt: number
    _all: number
  }


  export type VoteAvgAggregateInputType = {
    votingPower?: true
  }

  export type VoteSumAggregateInputType = {
    votingPower?: true
  }

  export type VoteMinAggregateInputType = {
    id?: true
    proposalId?: true
    userId?: true
    choice?: true
    votingPower?: true
    comment?: true
    createdAt?: true
  }

  export type VoteMaxAggregateInputType = {
    id?: true
    proposalId?: true
    userId?: true
    choice?: true
    votingPower?: true
    comment?: true
    createdAt?: true
  }

  export type VoteCountAggregateInputType = {
    id?: true
    proposalId?: true
    userId?: true
    choice?: true
    votingPower?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type VoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vote to aggregate.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Votes
    **/
    _count?: true | VoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VoteMaxAggregateInputType
  }

  export type GetVoteAggregateType<T extends VoteAggregateArgs> = {
        [P in keyof T & keyof AggregateVote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVote[P]>
      : GetScalarType<T[P], AggregateVote[P]>
  }




  export type VoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VoteWhereInput
    orderBy?: VoteOrderByWithAggregationInput | VoteOrderByWithAggregationInput[]
    by: VoteScalarFieldEnum[] | VoteScalarFieldEnum
    having?: VoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VoteCountAggregateInputType | true
    _avg?: VoteAvgAggregateInputType
    _sum?: VoteSumAggregateInputType
    _min?: VoteMinAggregateInputType
    _max?: VoteMaxAggregateInputType
  }

  export type VoteGroupByOutputType = {
    id: string
    proposalId: string
    userId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment: string | null
    createdAt: Date
    _count: VoteCountAggregateOutputType | null
    _avg: VoteAvgAggregateOutputType | null
    _sum: VoteSumAggregateOutputType | null
    _min: VoteMinAggregateOutputType | null
    _max: VoteMaxAggregateOutputType | null
  }

  type GetVoteGroupByPayload<T extends VoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VoteGroupByOutputType[P]>
            : GetScalarType<T[P], VoteGroupByOutputType[P]>
        }
      >
    >


  export type VoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proposalId?: boolean
    userId?: boolean
    choice?: boolean
    votingPower?: boolean
    comment?: boolean
    createdAt?: boolean
    proposal?: boolean | ProposalDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vote"]>

  export type VoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proposalId?: boolean
    userId?: boolean
    choice?: boolean
    votingPower?: boolean
    comment?: boolean
    createdAt?: boolean
    proposal?: boolean | ProposalDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vote"]>

  export type VoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proposalId?: boolean
    userId?: boolean
    choice?: boolean
    votingPower?: boolean
    comment?: boolean
    createdAt?: boolean
    proposal?: boolean | ProposalDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vote"]>

  export type VoteSelectScalar = {
    id?: boolean
    proposalId?: boolean
    userId?: boolean
    choice?: boolean
    votingPower?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type VoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "proposalId" | "userId" | "choice" | "votingPower" | "comment" | "createdAt", ExtArgs["result"]["vote"]>
  export type VoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proposal?: boolean | ProposalDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proposal?: boolean | ProposalDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proposal?: boolean | ProposalDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $VotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vote"
    objects: {
      proposal: Prisma.$ProposalPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      proposalId: string
      userId: string
      choice: $Enums.VoteChoice
      votingPower: number
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["vote"]>
    composites: {}
  }

  type VoteGetPayload<S extends boolean | null | undefined | VoteDefaultArgs> = $Result.GetResult<Prisma.$VotePayload, S>

  type VoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VoteCountAggregateInputType | true
    }

  export interface VoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vote'], meta: { name: 'Vote' } }
    /**
     * Find zero or one Vote that matches the filter.
     * @param {VoteFindUniqueArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VoteFindUniqueArgs>(args: SelectSubset<T, VoteFindUniqueArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VoteFindUniqueOrThrowArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VoteFindUniqueOrThrowArgs>(args: SelectSubset<T, VoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteFindFirstArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VoteFindFirstArgs>(args?: SelectSubset<T, VoteFindFirstArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteFindFirstOrThrowArgs} args - Arguments to find a Vote
     * @example
     * // Get one Vote
     * const vote = await prisma.vote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VoteFindFirstOrThrowArgs>(args?: SelectSubset<T, VoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Votes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Votes
     * const votes = await prisma.vote.findMany()
     * 
     * // Get first 10 Votes
     * const votes = await prisma.vote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const voteWithIdOnly = await prisma.vote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VoteFindManyArgs>(args?: SelectSubset<T, VoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vote.
     * @param {VoteCreateArgs} args - Arguments to create a Vote.
     * @example
     * // Create one Vote
     * const Vote = await prisma.vote.create({
     *   data: {
     *     // ... data to create a Vote
     *   }
     * })
     * 
     */
    create<T extends VoteCreateArgs>(args: SelectSubset<T, VoteCreateArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Votes.
     * @param {VoteCreateManyArgs} args - Arguments to create many Votes.
     * @example
     * // Create many Votes
     * const vote = await prisma.vote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VoteCreateManyArgs>(args?: SelectSubset<T, VoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Votes and returns the data saved in the database.
     * @param {VoteCreateManyAndReturnArgs} args - Arguments to create many Votes.
     * @example
     * // Create many Votes
     * const vote = await prisma.vote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Votes and only return the `id`
     * const voteWithIdOnly = await prisma.vote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VoteCreateManyAndReturnArgs>(args?: SelectSubset<T, VoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vote.
     * @param {VoteDeleteArgs} args - Arguments to delete one Vote.
     * @example
     * // Delete one Vote
     * const Vote = await prisma.vote.delete({
     *   where: {
     *     // ... filter to delete one Vote
     *   }
     * })
     * 
     */
    delete<T extends VoteDeleteArgs>(args: SelectSubset<T, VoteDeleteArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vote.
     * @param {VoteUpdateArgs} args - Arguments to update one Vote.
     * @example
     * // Update one Vote
     * const vote = await prisma.vote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VoteUpdateArgs>(args: SelectSubset<T, VoteUpdateArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Votes.
     * @param {VoteDeleteManyArgs} args - Arguments to filter Votes to delete.
     * @example
     * // Delete a few Votes
     * const { count } = await prisma.vote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VoteDeleteManyArgs>(args?: SelectSubset<T, VoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Votes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Votes
     * const vote = await prisma.vote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VoteUpdateManyArgs>(args: SelectSubset<T, VoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Votes and returns the data updated in the database.
     * @param {VoteUpdateManyAndReturnArgs} args - Arguments to update many Votes.
     * @example
     * // Update many Votes
     * const vote = await prisma.vote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Votes and only return the `id`
     * const voteWithIdOnly = await prisma.vote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VoteUpdateManyAndReturnArgs>(args: SelectSubset<T, VoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vote.
     * @param {VoteUpsertArgs} args - Arguments to update or create a Vote.
     * @example
     * // Update or create a Vote
     * const vote = await prisma.vote.upsert({
     *   create: {
     *     // ... data to create a Vote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vote we want to update
     *   }
     * })
     */
    upsert<T extends VoteUpsertArgs>(args: SelectSubset<T, VoteUpsertArgs<ExtArgs>>): Prisma__VoteClient<$Result.GetResult<Prisma.$VotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Votes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteCountArgs} args - Arguments to filter Votes to count.
     * @example
     * // Count the number of Votes
     * const count = await prisma.vote.count({
     *   where: {
     *     // ... the filter for the Votes we want to count
     *   }
     * })
    **/
    count<T extends VoteCountArgs>(
      args?: Subset<T, VoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VoteAggregateArgs>(args: Subset<T, VoteAggregateArgs>): Prisma.PrismaPromise<GetVoteAggregateType<T>>

    /**
     * Group by Vote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VoteGroupByArgs['orderBy'] }
        : { orderBy?: VoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vote model
   */
  readonly fields: VoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    proposal<T extends ProposalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProposalDefaultArgs<ExtArgs>>): Prisma__ProposalClient<$Result.GetResult<Prisma.$ProposalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vote model
   */
  interface VoteFieldRefs {
    readonly id: FieldRef<"Vote", 'String'>
    readonly proposalId: FieldRef<"Vote", 'String'>
    readonly userId: FieldRef<"Vote", 'String'>
    readonly choice: FieldRef<"Vote", 'VoteChoice'>
    readonly votingPower: FieldRef<"Vote", 'Int'>
    readonly comment: FieldRef<"Vote", 'String'>
    readonly createdAt: FieldRef<"Vote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vote findUnique
   */
  export type VoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote findUniqueOrThrow
   */
  export type VoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote findFirst
   */
  export type VoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Votes.
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Votes.
     */
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Vote findFirstOrThrow
   */
  export type VoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Vote to fetch.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Votes.
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Votes.
     */
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Vote findMany
   */
  export type VoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter, which Votes to fetch.
     */
    where?: VoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Votes to fetch.
     */
    orderBy?: VoteOrderByWithRelationInput | VoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Votes.
     */
    cursor?: VoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Votes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Votes.
     */
    skip?: number
    distinct?: VoteScalarFieldEnum | VoteScalarFieldEnum[]
  }

  /**
   * Vote create
   */
  export type VoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Vote.
     */
    data: XOR<VoteCreateInput, VoteUncheckedCreateInput>
  }

  /**
   * Vote createMany
   */
  export type VoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Votes.
     */
    data: VoteCreateManyInput | VoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vote createManyAndReturn
   */
  export type VoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * The data used to create many Votes.
     */
    data: VoteCreateManyInput | VoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vote update
   */
  export type VoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Vote.
     */
    data: XOR<VoteUpdateInput, VoteUncheckedUpdateInput>
    /**
     * Choose, which Vote to update.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote updateMany
   */
  export type VoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Votes.
     */
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyInput>
    /**
     * Filter which Votes to update
     */
    where?: VoteWhereInput
    /**
     * Limit how many Votes to update.
     */
    limit?: number
  }

  /**
   * Vote updateManyAndReturn
   */
  export type VoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * The data used to update Votes.
     */
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyInput>
    /**
     * Filter which Votes to update
     */
    where?: VoteWhereInput
    /**
     * Limit how many Votes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vote upsert
   */
  export type VoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Vote to update in case it exists.
     */
    where: VoteWhereUniqueInput
    /**
     * In case the Vote found by the `where` argument doesn't exist, create a new Vote with this data.
     */
    create: XOR<VoteCreateInput, VoteUncheckedCreateInput>
    /**
     * In case the Vote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VoteUpdateInput, VoteUncheckedUpdateInput>
  }

  /**
   * Vote delete
   */
  export type VoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
    /**
     * Filter which Vote to delete.
     */
    where: VoteWhereUniqueInput
  }

  /**
   * Vote deleteMany
   */
  export type VoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Votes to delete
     */
    where?: VoteWhereInput
    /**
     * Limit how many Votes to delete.
     */
    limit?: number
  }

  /**
   * Vote without action
   */
  export type VoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vote
     */
    select?: VoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vote
     */
    omit?: VoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VoteInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    role: 'role',
    isEmailVerified: 'isEmailVerified',
    emailVerifiedAt: 'emailVerifiedAt',
    kycStatus: 'kycStatus',
    kycSubmittedAt: 'kycSubmittedAt',
    kycApprovedAt: 'kycApprovedAt',
    walletAddress: 'walletAddress',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    kycExpiresAt: 'kycExpiresAt',
    verificationLevel: 'verificationLevel'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const KycScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fullName: 'fullName',
    dateOfBirth: 'dateOfBirth',
    nationality: 'nationality',
    address: 'address',
    documentType: 'documentType',
    documentNumber: 'documentNumber',
    documentFront: 'documentFront',
    documentBack: 'documentBack',
    selfieImage: 'selfieImage',
    addressProof: 'addressProof',
    status: 'status',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
    documentHash: 'documentHash',
    expiresAt: 'expiresAt',
    approvedAt: 'approvedAt',
    blockchainTx: 'blockchainTx',
    blockchainVerifier: 'blockchainVerifier',
    rejectionReason: 'rejectionReason',
    submittedAt: 'submittedAt',
    reviewedAt: 'reviewedAt',
    reviewedBy: 'reviewedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KycScalarFieldEnum = (typeof KycScalarFieldEnum)[keyof typeof KycScalarFieldEnum]


  export const HotelAssetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    status: 'status',
    location: 'location',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HotelAssetScalarFieldEnum = (typeof HotelAssetScalarFieldEnum)[keyof typeof HotelAssetScalarFieldEnum]


  export const InvestmentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    hotelAssetId: 'hotelAssetId',
    amount: 'amount',
    transactionHash: 'transactionHash',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvestmentScalarFieldEnum = (typeof InvestmentScalarFieldEnum)[keyof typeof InvestmentScalarFieldEnum]


  export const BookingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    hotelAssetId: 'hotelAssetId',
    checkInDate: 'checkInDate',
    checkOutDate: 'checkOutDate',
    guests: 'guests',
    roomType: 'roomType',
    totalPrice: 'totalPrice',
    status: 'status',
    specialRequests: 'specialRequests',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const ProposalScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    type: 'type',
    proposerId: 'proposerId',
    hotelAssetId: 'hotelAssetId',
    status: 'status',
    votingStartDate: 'votingStartDate',
    votingEndDate: 'votingEndDate',
    votesFor: 'votesFor',
    votesAgainst: 'votesAgainst',
    votesAbstain: 'votesAbstain',
    quorumRequired: 'quorumRequired',
    approvalThreshold: 'approvalThreshold',
    executionDetails: 'executionDetails',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdById: 'createdById'
  };

  export type ProposalScalarFieldEnum = (typeof ProposalScalarFieldEnum)[keyof typeof ProposalScalarFieldEnum]


  export const VoteScalarFieldEnum: {
    id: 'id',
    proposalId: 'proposalId',
    userId: 'userId',
    choice: 'choice',
    votingPower: 'votingPower',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type VoteScalarFieldEnum = (typeof VoteScalarFieldEnum)[keyof typeof VoteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'KycStatus'
   */
  export type EnumKycStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KycStatus'>
    


  /**
   * Reference to a field of type 'KycStatus[]'
   */
  export type ListEnumKycStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KycStatus[]'>
    


  /**
   * Reference to a field of type 'VerificationLevel'
   */
  export type EnumVerificationLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationLevel'>
    


  /**
   * Reference to a field of type 'VerificationLevel[]'
   */
  export type ListEnumVerificationLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationLevel[]'>
    


  /**
   * Reference to a field of type 'AssetStatus'
   */
  export type EnumAssetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetStatus'>
    


  /**
   * Reference to a field of type 'AssetStatus[]'
   */
  export type ListEnumAssetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetStatus[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'InvestmentStatus'
   */
  export type EnumInvestmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvestmentStatus'>
    


  /**
   * Reference to a field of type 'InvestmentStatus[]'
   */
  export type ListEnumInvestmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvestmentStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BookingStatus'
   */
  export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>
    


  /**
   * Reference to a field of type 'BookingStatus[]'
   */
  export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>
    


  /**
   * Reference to a field of type 'ProposalType'
   */
  export type EnumProposalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProposalType'>
    


  /**
   * Reference to a field of type 'ProposalType[]'
   */
  export type ListEnumProposalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProposalType[]'>
    


  /**
   * Reference to a field of type 'ProposalStatus'
   */
  export type EnumProposalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProposalStatus'>
    


  /**
   * Reference to a field of type 'ProposalStatus[]'
   */
  export type ListEnumProposalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProposalStatus[]'>
    


  /**
   * Reference to a field of type 'VoteChoice'
   */
  export type EnumVoteChoiceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VoteChoice'>
    


  /**
   * Reference to a field of type 'VoteChoice[]'
   */
  export type ListEnumVoteChoiceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VoteChoice[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isEmailVerified?: BoolFilter<"User"> | boolean
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    kycStatus?: EnumKycStatusFilter<"User"> | $Enums.KycStatus
    kycSubmittedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    kycApprovedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    walletAddress?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    kycExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    verificationLevel?: EnumVerificationLevelNullableFilter<"User"> | $Enums.VerificationLevel | null
    bookings?: BookingListRelationFilter
    createdHotelAssets?: HotelAssetListRelationFilter
    investments?: InvestmentListRelationFilter
    reviewedKyc?: KycListRelationFilter
    kyc?: XOR<KycNullableScalarRelationFilter, KycWhereInput> | null
    createdProposals?: ProposalListRelationFilter
    proposedProposals?: ProposalListRelationFilter
    votes?: VoteListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrderInput | SortOrder
    kycApprovedAt?: SortOrderInput | SortOrder
    walletAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kycExpiresAt?: SortOrderInput | SortOrder
    verificationLevel?: SortOrderInput | SortOrder
    bookings?: BookingOrderByRelationAggregateInput
    createdHotelAssets?: HotelAssetOrderByRelationAggregateInput
    investments?: InvestmentOrderByRelationAggregateInput
    reviewedKyc?: KycOrderByRelationAggregateInput
    kyc?: KycOrderByWithRelationInput
    createdProposals?: ProposalOrderByRelationAggregateInput
    proposedProposals?: ProposalOrderByRelationAggregateInput
    votes?: VoteOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    walletAddress?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isEmailVerified?: BoolFilter<"User"> | boolean
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    kycStatus?: EnumKycStatusFilter<"User"> | $Enums.KycStatus
    kycSubmittedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    kycApprovedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    kycExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    verificationLevel?: EnumVerificationLevelNullableFilter<"User"> | $Enums.VerificationLevel | null
    bookings?: BookingListRelationFilter
    createdHotelAssets?: HotelAssetListRelationFilter
    investments?: InvestmentListRelationFilter
    reviewedKyc?: KycListRelationFilter
    kyc?: XOR<KycNullableScalarRelationFilter, KycWhereInput> | null
    createdProposals?: ProposalListRelationFilter
    proposedProposals?: ProposalListRelationFilter
    votes?: VoteListRelationFilter
  }, "id" | "email" | "walletAddress">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrderInput | SortOrder
    kycApprovedAt?: SortOrderInput | SortOrder
    walletAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kycExpiresAt?: SortOrderInput | SortOrder
    verificationLevel?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isEmailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    emailVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    kycStatus?: EnumKycStatusWithAggregatesFilter<"User"> | $Enums.KycStatus
    kycSubmittedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    kycApprovedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    walletAddress?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    kycExpiresAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    verificationLevel?: EnumVerificationLevelNullableWithAggregatesFilter<"User"> | $Enums.VerificationLevel | null
  }

  export type KycWhereInput = {
    AND?: KycWhereInput | KycWhereInput[]
    OR?: KycWhereInput[]
    NOT?: KycWhereInput | KycWhereInput[]
    id?: StringFilter<"Kyc"> | string
    userId?: StringFilter<"Kyc"> | string
    fullName?: StringFilter<"Kyc"> | string
    dateOfBirth?: DateTimeFilter<"Kyc"> | Date | string
    nationality?: StringFilter<"Kyc"> | string
    address?: StringFilter<"Kyc"> | string
    documentType?: StringFilter<"Kyc"> | string
    documentNumber?: StringFilter<"Kyc"> | string
    documentFront?: StringNullableFilter<"Kyc"> | string | null
    documentBack?: StringNullableFilter<"Kyc"> | string | null
    selfieImage?: StringNullableFilter<"Kyc"> | string | null
    addressProof?: StringNullableFilter<"Kyc"> | string | null
    status?: EnumKycStatusFilter<"Kyc"> | $Enums.KycStatus
    city?: StringFilter<"Kyc"> | string
    state?: StringFilter<"Kyc"> | string
    postalCode?: StringFilter<"Kyc"> | string
    country?: StringFilter<"Kyc"> | string
    documentHash?: StringNullableFilter<"Kyc"> | string | null
    expiresAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    blockchainTx?: StringNullableFilter<"Kyc"> | string | null
    blockchainVerifier?: StringNullableFilter<"Kyc"> | string | null
    rejectionReason?: StringNullableFilter<"Kyc"> | string | null
    submittedAt?: DateTimeFilter<"Kyc"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    reviewedBy?: StringNullableFilter<"Kyc"> | string | null
    createdAt?: DateTimeFilter<"Kyc"> | Date | string
    updatedAt?: DateTimeFilter<"Kyc"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    reviewer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type KycOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    documentFront?: SortOrderInput | SortOrder
    documentBack?: SortOrderInput | SortOrder
    selfieImage?: SortOrderInput | SortOrder
    addressProof?: SortOrderInput | SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    documentHash?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    blockchainTx?: SortOrderInput | SortOrder
    blockchainVerifier?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    reviewer?: UserOrderByWithRelationInput
  }

  export type KycWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: KycWhereInput | KycWhereInput[]
    OR?: KycWhereInput[]
    NOT?: KycWhereInput | KycWhereInput[]
    fullName?: StringFilter<"Kyc"> | string
    dateOfBirth?: DateTimeFilter<"Kyc"> | Date | string
    nationality?: StringFilter<"Kyc"> | string
    address?: StringFilter<"Kyc"> | string
    documentType?: StringFilter<"Kyc"> | string
    documentNumber?: StringFilter<"Kyc"> | string
    documentFront?: StringNullableFilter<"Kyc"> | string | null
    documentBack?: StringNullableFilter<"Kyc"> | string | null
    selfieImage?: StringNullableFilter<"Kyc"> | string | null
    addressProof?: StringNullableFilter<"Kyc"> | string | null
    status?: EnumKycStatusFilter<"Kyc"> | $Enums.KycStatus
    city?: StringFilter<"Kyc"> | string
    state?: StringFilter<"Kyc"> | string
    postalCode?: StringFilter<"Kyc"> | string
    country?: StringFilter<"Kyc"> | string
    documentHash?: StringNullableFilter<"Kyc"> | string | null
    expiresAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    blockchainTx?: StringNullableFilter<"Kyc"> | string | null
    blockchainVerifier?: StringNullableFilter<"Kyc"> | string | null
    rejectionReason?: StringNullableFilter<"Kyc"> | string | null
    submittedAt?: DateTimeFilter<"Kyc"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    reviewedBy?: StringNullableFilter<"Kyc"> | string | null
    createdAt?: DateTimeFilter<"Kyc"> | Date | string
    updatedAt?: DateTimeFilter<"Kyc"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    reviewer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "userId">

  export type KycOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    documentFront?: SortOrderInput | SortOrder
    documentBack?: SortOrderInput | SortOrder
    selfieImage?: SortOrderInput | SortOrder
    addressProof?: SortOrderInput | SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    documentHash?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    blockchainTx?: SortOrderInput | SortOrder
    blockchainVerifier?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KycCountOrderByAggregateInput
    _max?: KycMaxOrderByAggregateInput
    _min?: KycMinOrderByAggregateInput
  }

  export type KycScalarWhereWithAggregatesInput = {
    AND?: KycScalarWhereWithAggregatesInput | KycScalarWhereWithAggregatesInput[]
    OR?: KycScalarWhereWithAggregatesInput[]
    NOT?: KycScalarWhereWithAggregatesInput | KycScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Kyc"> | string
    userId?: StringWithAggregatesFilter<"Kyc"> | string
    fullName?: StringWithAggregatesFilter<"Kyc"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"Kyc"> | Date | string
    nationality?: StringWithAggregatesFilter<"Kyc"> | string
    address?: StringWithAggregatesFilter<"Kyc"> | string
    documentType?: StringWithAggregatesFilter<"Kyc"> | string
    documentNumber?: StringWithAggregatesFilter<"Kyc"> | string
    documentFront?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    documentBack?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    selfieImage?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    addressProof?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    status?: EnumKycStatusWithAggregatesFilter<"Kyc"> | $Enums.KycStatus
    city?: StringWithAggregatesFilter<"Kyc"> | string
    state?: StringWithAggregatesFilter<"Kyc"> | string
    postalCode?: StringWithAggregatesFilter<"Kyc"> | string
    country?: StringWithAggregatesFilter<"Kyc"> | string
    documentHash?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Kyc"> | Date | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Kyc"> | Date | string | null
    blockchainTx?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    blockchainVerifier?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"Kyc"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"Kyc"> | Date | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"Kyc"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Kyc"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Kyc"> | Date | string
  }

  export type HotelAssetWhereInput = {
    AND?: HotelAssetWhereInput | HotelAssetWhereInput[]
    OR?: HotelAssetWhereInput[]
    NOT?: HotelAssetWhereInput | HotelAssetWhereInput[]
    id?: StringFilter<"HotelAsset"> | string
    name?: StringFilter<"HotelAsset"> | string
    description?: StringNullableFilter<"HotelAsset"> | string | null
    status?: EnumAssetStatusFilter<"HotelAsset"> | $Enums.AssetStatus
    location?: StringFilter<"HotelAsset"> | string
    createdById?: StringFilter<"HotelAsset"> | string
    createdAt?: DateTimeFilter<"HotelAsset"> | Date | string
    updatedAt?: DateTimeFilter<"HotelAsset"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    bookings?: BookingListRelationFilter
    investments?: InvestmentListRelationFilter
    proposals?: ProposalListRelationFilter
  }

  export type HotelAssetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    location?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    bookings?: BookingOrderByRelationAggregateInput
    investments?: InvestmentOrderByRelationAggregateInput
    proposals?: ProposalOrderByRelationAggregateInput
  }

  export type HotelAssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HotelAssetWhereInput | HotelAssetWhereInput[]
    OR?: HotelAssetWhereInput[]
    NOT?: HotelAssetWhereInput | HotelAssetWhereInput[]
    name?: StringFilter<"HotelAsset"> | string
    description?: StringNullableFilter<"HotelAsset"> | string | null
    status?: EnumAssetStatusFilter<"HotelAsset"> | $Enums.AssetStatus
    location?: StringFilter<"HotelAsset"> | string
    createdById?: StringFilter<"HotelAsset"> | string
    createdAt?: DateTimeFilter<"HotelAsset"> | Date | string
    updatedAt?: DateTimeFilter<"HotelAsset"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    bookings?: BookingListRelationFilter
    investments?: InvestmentListRelationFilter
    proposals?: ProposalListRelationFilter
  }, "id">

  export type HotelAssetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    location?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HotelAssetCountOrderByAggregateInput
    _max?: HotelAssetMaxOrderByAggregateInput
    _min?: HotelAssetMinOrderByAggregateInput
  }

  export type HotelAssetScalarWhereWithAggregatesInput = {
    AND?: HotelAssetScalarWhereWithAggregatesInput | HotelAssetScalarWhereWithAggregatesInput[]
    OR?: HotelAssetScalarWhereWithAggregatesInput[]
    NOT?: HotelAssetScalarWhereWithAggregatesInput | HotelAssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HotelAsset"> | string
    name?: StringWithAggregatesFilter<"HotelAsset"> | string
    description?: StringNullableWithAggregatesFilter<"HotelAsset"> | string | null
    status?: EnumAssetStatusWithAggregatesFilter<"HotelAsset"> | $Enums.AssetStatus
    location?: StringWithAggregatesFilter<"HotelAsset"> | string
    createdById?: StringWithAggregatesFilter<"HotelAsset"> | string
    createdAt?: DateTimeWithAggregatesFilter<"HotelAsset"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"HotelAsset"> | Date | string
  }

  export type InvestmentWhereInput = {
    AND?: InvestmentWhereInput | InvestmentWhereInput[]
    OR?: InvestmentWhereInput[]
    NOT?: InvestmentWhereInput | InvestmentWhereInput[]
    id?: StringFilter<"Investment"> | string
    userId?: StringFilter<"Investment"> | string
    hotelAssetId?: StringFilter<"Investment"> | string
    amount?: DecimalFilter<"Investment"> | Decimal | DecimalJsLike | number | string
    transactionHash?: StringNullableFilter<"Investment"> | string | null
    status?: EnumInvestmentStatusFilter<"Investment"> | $Enums.InvestmentStatus
    createdAt?: DateTimeFilter<"Investment"> | Date | string
    updatedAt?: DateTimeFilter<"Investment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hotelAsset?: XOR<HotelAssetScalarRelationFilter, HotelAssetWhereInput>
  }

  export type InvestmentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    amount?: SortOrder
    transactionHash?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    hotelAsset?: HotelAssetOrderByWithRelationInput
  }

  export type InvestmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvestmentWhereInput | InvestmentWhereInput[]
    OR?: InvestmentWhereInput[]
    NOT?: InvestmentWhereInput | InvestmentWhereInput[]
    userId?: StringFilter<"Investment"> | string
    hotelAssetId?: StringFilter<"Investment"> | string
    amount?: DecimalFilter<"Investment"> | Decimal | DecimalJsLike | number | string
    transactionHash?: StringNullableFilter<"Investment"> | string | null
    status?: EnumInvestmentStatusFilter<"Investment"> | $Enums.InvestmentStatus
    createdAt?: DateTimeFilter<"Investment"> | Date | string
    updatedAt?: DateTimeFilter<"Investment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hotelAsset?: XOR<HotelAssetScalarRelationFilter, HotelAssetWhereInput>
  }, "id">

  export type InvestmentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    amount?: SortOrder
    transactionHash?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvestmentCountOrderByAggregateInput
    _avg?: InvestmentAvgOrderByAggregateInput
    _max?: InvestmentMaxOrderByAggregateInput
    _min?: InvestmentMinOrderByAggregateInput
    _sum?: InvestmentSumOrderByAggregateInput
  }

  export type InvestmentScalarWhereWithAggregatesInput = {
    AND?: InvestmentScalarWhereWithAggregatesInput | InvestmentScalarWhereWithAggregatesInput[]
    OR?: InvestmentScalarWhereWithAggregatesInput[]
    NOT?: InvestmentScalarWhereWithAggregatesInput | InvestmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Investment"> | string
    userId?: StringWithAggregatesFilter<"Investment"> | string
    hotelAssetId?: StringWithAggregatesFilter<"Investment"> | string
    amount?: DecimalWithAggregatesFilter<"Investment"> | Decimal | DecimalJsLike | number | string
    transactionHash?: StringNullableWithAggregatesFilter<"Investment"> | string | null
    status?: EnumInvestmentStatusWithAggregatesFilter<"Investment"> | $Enums.InvestmentStatus
    createdAt?: DateTimeWithAggregatesFilter<"Investment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Investment"> | Date | string
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    userId?: StringFilter<"Booking"> | string
    hotelAssetId?: StringFilter<"Booking"> | string
    checkInDate?: DateTimeFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeFilter<"Booking"> | Date | string
    guests?: IntFilter<"Booking"> | number
    roomType?: StringFilter<"Booking"> | string
    totalPrice?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    specialRequests?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    hotelAsset?: XOR<HotelAssetScalarRelationFilter, HotelAssetWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    guests?: SortOrder
    roomType?: SortOrder
    totalPrice?: SortOrder
    status?: SortOrder
    specialRequests?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hotelAsset?: HotelAssetOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    userId?: StringFilter<"Booking"> | string
    hotelAssetId?: StringFilter<"Booking"> | string
    checkInDate?: DateTimeFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeFilter<"Booking"> | Date | string
    guests?: IntFilter<"Booking"> | number
    roomType?: StringFilter<"Booking"> | string
    totalPrice?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    specialRequests?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    hotelAsset?: XOR<HotelAssetScalarRelationFilter, HotelAssetWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    guests?: SortOrder
    roomType?: SortOrder
    totalPrice?: SortOrder
    status?: SortOrder
    specialRequests?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    userId?: StringWithAggregatesFilter<"Booking"> | string
    hotelAssetId?: StringWithAggregatesFilter<"Booking"> | string
    checkInDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    guests?: IntWithAggregatesFilter<"Booking"> | number
    roomType?: StringWithAggregatesFilter<"Booking"> | string
    totalPrice?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusWithAggregatesFilter<"Booking"> | $Enums.BookingStatus
    specialRequests?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
  }

  export type ProposalWhereInput = {
    AND?: ProposalWhereInput | ProposalWhereInput[]
    OR?: ProposalWhereInput[]
    NOT?: ProposalWhereInput | ProposalWhereInput[]
    id?: StringFilter<"Proposal"> | string
    title?: StringFilter<"Proposal"> | string
    description?: StringFilter<"Proposal"> | string
    type?: EnumProposalTypeFilter<"Proposal"> | $Enums.ProposalType
    proposerId?: StringFilter<"Proposal"> | string
    hotelAssetId?: StringNullableFilter<"Proposal"> | string | null
    status?: EnumProposalStatusFilter<"Proposal"> | $Enums.ProposalStatus
    votingStartDate?: DateTimeNullableFilter<"Proposal"> | Date | string | null
    votingEndDate?: DateTimeNullableFilter<"Proposal"> | Date | string | null
    votesFor?: IntFilter<"Proposal"> | number
    votesAgainst?: IntFilter<"Proposal"> | number
    votesAbstain?: IntFilter<"Proposal"> | number
    quorumRequired?: IntFilter<"Proposal"> | number
    approvalThreshold?: IntFilter<"Proposal"> | number
    executionDetails?: StringNullableFilter<"Proposal"> | string | null
    createdAt?: DateTimeFilter<"Proposal"> | Date | string
    updatedAt?: DateTimeFilter<"Proposal"> | Date | string
    createdById?: StringFilter<"Proposal"> | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    hotelAsset?: XOR<HotelAssetNullableScalarRelationFilter, HotelAssetWhereInput> | null
    proposer?: XOR<UserScalarRelationFilter, UserWhereInput>
    votes?: VoteListRelationFilter
  }

  export type ProposalOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    proposerId?: SortOrder
    hotelAssetId?: SortOrderInput | SortOrder
    status?: SortOrder
    votingStartDate?: SortOrderInput | SortOrder
    votingEndDate?: SortOrderInput | SortOrder
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
    executionDetails?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    hotelAsset?: HotelAssetOrderByWithRelationInput
    proposer?: UserOrderByWithRelationInput
    votes?: VoteOrderByRelationAggregateInput
  }

  export type ProposalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProposalWhereInput | ProposalWhereInput[]
    OR?: ProposalWhereInput[]
    NOT?: ProposalWhereInput | ProposalWhereInput[]
    title?: StringFilter<"Proposal"> | string
    description?: StringFilter<"Proposal"> | string
    type?: EnumProposalTypeFilter<"Proposal"> | $Enums.ProposalType
    proposerId?: StringFilter<"Proposal"> | string
    hotelAssetId?: StringNullableFilter<"Proposal"> | string | null
    status?: EnumProposalStatusFilter<"Proposal"> | $Enums.ProposalStatus
    votingStartDate?: DateTimeNullableFilter<"Proposal"> | Date | string | null
    votingEndDate?: DateTimeNullableFilter<"Proposal"> | Date | string | null
    votesFor?: IntFilter<"Proposal"> | number
    votesAgainst?: IntFilter<"Proposal"> | number
    votesAbstain?: IntFilter<"Proposal"> | number
    quorumRequired?: IntFilter<"Proposal"> | number
    approvalThreshold?: IntFilter<"Proposal"> | number
    executionDetails?: StringNullableFilter<"Proposal"> | string | null
    createdAt?: DateTimeFilter<"Proposal"> | Date | string
    updatedAt?: DateTimeFilter<"Proposal"> | Date | string
    createdById?: StringFilter<"Proposal"> | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    hotelAsset?: XOR<HotelAssetNullableScalarRelationFilter, HotelAssetWhereInput> | null
    proposer?: XOR<UserScalarRelationFilter, UserWhereInput>
    votes?: VoteListRelationFilter
  }, "id">

  export type ProposalOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    proposerId?: SortOrder
    hotelAssetId?: SortOrderInput | SortOrder
    status?: SortOrder
    votingStartDate?: SortOrderInput | SortOrder
    votingEndDate?: SortOrderInput | SortOrder
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
    executionDetails?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
    _count?: ProposalCountOrderByAggregateInput
    _avg?: ProposalAvgOrderByAggregateInput
    _max?: ProposalMaxOrderByAggregateInput
    _min?: ProposalMinOrderByAggregateInput
    _sum?: ProposalSumOrderByAggregateInput
  }

  export type ProposalScalarWhereWithAggregatesInput = {
    AND?: ProposalScalarWhereWithAggregatesInput | ProposalScalarWhereWithAggregatesInput[]
    OR?: ProposalScalarWhereWithAggregatesInput[]
    NOT?: ProposalScalarWhereWithAggregatesInput | ProposalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Proposal"> | string
    title?: StringWithAggregatesFilter<"Proposal"> | string
    description?: StringWithAggregatesFilter<"Proposal"> | string
    type?: EnumProposalTypeWithAggregatesFilter<"Proposal"> | $Enums.ProposalType
    proposerId?: StringWithAggregatesFilter<"Proposal"> | string
    hotelAssetId?: StringNullableWithAggregatesFilter<"Proposal"> | string | null
    status?: EnumProposalStatusWithAggregatesFilter<"Proposal"> | $Enums.ProposalStatus
    votingStartDate?: DateTimeNullableWithAggregatesFilter<"Proposal"> | Date | string | null
    votingEndDate?: DateTimeNullableWithAggregatesFilter<"Proposal"> | Date | string | null
    votesFor?: IntWithAggregatesFilter<"Proposal"> | number
    votesAgainst?: IntWithAggregatesFilter<"Proposal"> | number
    votesAbstain?: IntWithAggregatesFilter<"Proposal"> | number
    quorumRequired?: IntWithAggregatesFilter<"Proposal"> | number
    approvalThreshold?: IntWithAggregatesFilter<"Proposal"> | number
    executionDetails?: StringNullableWithAggregatesFilter<"Proposal"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Proposal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Proposal"> | Date | string
    createdById?: StringWithAggregatesFilter<"Proposal"> | string
  }

  export type VoteWhereInput = {
    AND?: VoteWhereInput | VoteWhereInput[]
    OR?: VoteWhereInput[]
    NOT?: VoteWhereInput | VoteWhereInput[]
    id?: StringFilter<"Vote"> | string
    proposalId?: StringFilter<"Vote"> | string
    userId?: StringFilter<"Vote"> | string
    choice?: EnumVoteChoiceFilter<"Vote"> | $Enums.VoteChoice
    votingPower?: IntFilter<"Vote"> | number
    comment?: StringNullableFilter<"Vote"> | string | null
    createdAt?: DateTimeFilter<"Vote"> | Date | string
    proposal?: XOR<ProposalScalarRelationFilter, ProposalWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type VoteOrderByWithRelationInput = {
    id?: SortOrder
    proposalId?: SortOrder
    userId?: SortOrder
    choice?: SortOrder
    votingPower?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    proposal?: ProposalOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type VoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    proposalId_userId?: VoteProposalIdUserIdCompoundUniqueInput
    AND?: VoteWhereInput | VoteWhereInput[]
    OR?: VoteWhereInput[]
    NOT?: VoteWhereInput | VoteWhereInput[]
    proposalId?: StringFilter<"Vote"> | string
    userId?: StringFilter<"Vote"> | string
    choice?: EnumVoteChoiceFilter<"Vote"> | $Enums.VoteChoice
    votingPower?: IntFilter<"Vote"> | number
    comment?: StringNullableFilter<"Vote"> | string | null
    createdAt?: DateTimeFilter<"Vote"> | Date | string
    proposal?: XOR<ProposalScalarRelationFilter, ProposalWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "proposalId_userId">

  export type VoteOrderByWithAggregationInput = {
    id?: SortOrder
    proposalId?: SortOrder
    userId?: SortOrder
    choice?: SortOrder
    votingPower?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: VoteCountOrderByAggregateInput
    _avg?: VoteAvgOrderByAggregateInput
    _max?: VoteMaxOrderByAggregateInput
    _min?: VoteMinOrderByAggregateInput
    _sum?: VoteSumOrderByAggregateInput
  }

  export type VoteScalarWhereWithAggregatesInput = {
    AND?: VoteScalarWhereWithAggregatesInput | VoteScalarWhereWithAggregatesInput[]
    OR?: VoteScalarWhereWithAggregatesInput[]
    NOT?: VoteScalarWhereWithAggregatesInput | VoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vote"> | string
    proposalId?: StringWithAggregatesFilter<"Vote"> | string
    userId?: StringWithAggregatesFilter<"Vote"> | string
    choice?: EnumVoteChoiceWithAggregatesFilter<"Vote"> | $Enums.VoteChoice
    votingPower?: IntWithAggregatesFilter<"Vote"> | number
    comment?: StringNullableWithAggregatesFilter<"Vote"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Vote"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
  }

  export type KycCreateInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutKycInput
    reviewer?: UserCreateNestedOneWithoutReviewedKycInput
  }

  export type KycUncheckedCreateInput = {
    id?: string
    userId: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KycUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutKycNestedInput
    reviewer?: UserUpdateOneWithoutReviewedKycNestedInput
  }

  export type KycUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KycCreateManyInput = {
    id?: string
    userId: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KycUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KycUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotelAssetCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedHotelAssetsInput
    bookings?: BookingCreateNestedManyWithoutHotelAssetInput
    investments?: InvestmentCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutHotelAssetInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalUncheckedCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedHotelAssetsNestedInput
    bookings?: BookingUpdateManyWithoutHotelAssetNestedInput
    investments?: InvestmentUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutHotelAssetNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUncheckedUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HotelAssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotelAssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutInvestmentsInput
    hotelAsset: HotelAssetCreateNestedOneWithoutInvestmentsInput
  }

  export type InvestmentUncheckedCreateInput = {
    id?: string
    userId: string
    hotelAssetId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInvestmentsNestedInput
    hotelAsset?: HotelAssetUpdateOneRequiredWithoutInvestmentsNestedInput
  }

  export type InvestmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentCreateManyInput = {
    id?: string
    userId: string
    hotelAssetId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateInput = {
    id?: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hotelAsset: HotelAssetCreateNestedOneWithoutBookingsInput
    user: UserCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    userId: string
    hotelAssetId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotelAsset?: HotelAssetUpdateOneRequiredWithoutBookingsNestedInput
    user?: UserUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateManyInput = {
    id?: string
    userId: string
    hotelAssetId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProposalCreateInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedProposalsInput
    hotelAsset?: HotelAssetCreateNestedOneWithoutProposalsInput
    proposer: UserCreateNestedOneWithoutProposedProposalsInput
    votes?: VoteCreateNestedManyWithoutProposalInput
  }

  export type ProposalUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
    votes?: VoteUncheckedCreateNestedManyWithoutProposalInput
  }

  export type ProposalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedProposalsNestedInput
    hotelAsset?: HotelAssetUpdateOneWithoutProposalsNestedInput
    proposer?: UserUpdateOneRequiredWithoutProposedProposalsNestedInput
    votes?: VoteUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
    votes?: VoteUncheckedUpdateManyWithoutProposalNestedInput
  }

  export type ProposalCreateManyInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type ProposalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProposalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type VoteCreateInput = {
    id?: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
    proposal: ProposalCreateNestedOneWithoutVotesInput
    user: UserCreateNestedOneWithoutVotesInput
  }

  export type VoteUncheckedCreateInput = {
    id?: string
    proposalId: string
    userId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type VoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proposal?: ProposalUpdateOneRequiredWithoutVotesNestedInput
    user?: UserUpdateOneRequiredWithoutVotesNestedInput
  }

  export type VoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposalId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteCreateManyInput = {
    id?: string
    proposalId: string
    userId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type VoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposalId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumKycStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusFilter<$PrismaModel> | $Enums.KycStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumVerificationLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationLevel | EnumVerificationLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVerificationLevelNullableFilter<$PrismaModel> | $Enums.VerificationLevel | null
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type HotelAssetListRelationFilter = {
    every?: HotelAssetWhereInput
    some?: HotelAssetWhereInput
    none?: HotelAssetWhereInput
  }

  export type InvestmentListRelationFilter = {
    every?: InvestmentWhereInput
    some?: InvestmentWhereInput
    none?: InvestmentWhereInput
  }

  export type KycListRelationFilter = {
    every?: KycWhereInput
    some?: KycWhereInput
    none?: KycWhereInput
  }

  export type KycNullableScalarRelationFilter = {
    is?: KycWhereInput | null
    isNot?: KycWhereInput | null
  }

  export type ProposalListRelationFilter = {
    every?: ProposalWhereInput
    some?: ProposalWhereInput
    none?: ProposalWhereInput
  }

  export type VoteListRelationFilter = {
    every?: VoteWhereInput
    some?: VoteWhereInput
    none?: VoteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HotelAssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvestmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KycOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProposalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycApprovedAt?: SortOrder
    walletAddress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kycExpiresAt?: SortOrder
    verificationLevel?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycApprovedAt?: SortOrder
    walletAddress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kycExpiresAt?: SortOrder
    verificationLevel?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
    emailVerifiedAt?: SortOrder
    kycStatus?: SortOrder
    kycSubmittedAt?: SortOrder
    kycApprovedAt?: SortOrder
    walletAddress?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kycExpiresAt?: SortOrder
    verificationLevel?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumKycStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusWithAggregatesFilter<$PrismaModel> | $Enums.KycStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKycStatusFilter<$PrismaModel>
    _max?: NestedEnumKycStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumVerificationLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationLevel | EnumVerificationLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVerificationLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.VerificationLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumVerificationLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumVerificationLevelNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type KycCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    documentFront?: SortOrder
    documentBack?: SortOrder
    selfieImage?: SortOrder
    addressProof?: SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    documentHash?: SortOrder
    expiresAt?: SortOrder
    approvedAt?: SortOrder
    blockchainTx?: SortOrder
    blockchainVerifier?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KycMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    documentFront?: SortOrder
    documentBack?: SortOrder
    selfieImage?: SortOrder
    addressProof?: SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    documentHash?: SortOrder
    expiresAt?: SortOrder
    approvedAt?: SortOrder
    blockchainTx?: SortOrder
    blockchainVerifier?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KycMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    address?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    documentFront?: SortOrder
    documentBack?: SortOrder
    selfieImage?: SortOrder
    addressProof?: SortOrder
    status?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    documentHash?: SortOrder
    expiresAt?: SortOrder
    approvedAt?: SortOrder
    blockchainTx?: SortOrder
    blockchainVerifier?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAssetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusFilter<$PrismaModel> | $Enums.AssetStatus
  }

  export type HotelAssetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    location?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotelAssetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    location?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotelAssetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    location?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAssetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetStatusFilter<$PrismaModel>
    _max?: NestedEnumAssetStatusFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumInvestmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestmentStatus | EnumInvestmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestmentStatusFilter<$PrismaModel> | $Enums.InvestmentStatus
  }

  export type HotelAssetScalarRelationFilter = {
    is?: HotelAssetWhereInput
    isNot?: HotelAssetWhereInput
  }

  export type InvestmentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    amount?: SortOrder
    transactionHash?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestmentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type InvestmentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    amount?: SortOrder
    transactionHash?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestmentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    amount?: SortOrder
    transactionHash?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestmentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumInvestmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestmentStatus | EnumInvestmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvestmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvestmentStatusFilter<$PrismaModel>
    _max?: NestedEnumInvestmentStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    guests?: SortOrder
    roomType?: SortOrder
    totalPrice?: SortOrder
    status?: SortOrder
    specialRequests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    guests?: SortOrder
    totalPrice?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    guests?: SortOrder
    roomType?: SortOrder
    totalPrice?: SortOrder
    status?: SortOrder
    specialRequests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hotelAssetId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    guests?: SortOrder
    roomType?: SortOrder
    totalPrice?: SortOrder
    status?: SortOrder
    specialRequests?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    guests?: SortOrder
    totalPrice?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type EnumProposalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalType | EnumProposalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalTypeFilter<$PrismaModel> | $Enums.ProposalType
  }

  export type EnumProposalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalStatus | EnumProposalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalStatusFilter<$PrismaModel> | $Enums.ProposalStatus
  }

  export type HotelAssetNullableScalarRelationFilter = {
    is?: HotelAssetWhereInput | null
    isNot?: HotelAssetWhereInput | null
  }

  export type ProposalCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    proposerId?: SortOrder
    hotelAssetId?: SortOrder
    status?: SortOrder
    votingStartDate?: SortOrder
    votingEndDate?: SortOrder
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
    executionDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type ProposalAvgOrderByAggregateInput = {
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
  }

  export type ProposalMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    proposerId?: SortOrder
    hotelAssetId?: SortOrder
    status?: SortOrder
    votingStartDate?: SortOrder
    votingEndDate?: SortOrder
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
    executionDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type ProposalMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    proposerId?: SortOrder
    hotelAssetId?: SortOrder
    status?: SortOrder
    votingStartDate?: SortOrder
    votingEndDate?: SortOrder
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
    executionDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type ProposalSumOrderByAggregateInput = {
    votesFor?: SortOrder
    votesAgainst?: SortOrder
    votesAbstain?: SortOrder
    quorumRequired?: SortOrder
    approvalThreshold?: SortOrder
  }

  export type EnumProposalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalType | EnumProposalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProposalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProposalTypeFilter<$PrismaModel>
    _max?: NestedEnumProposalTypeFilter<$PrismaModel>
  }

  export type EnumProposalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalStatus | EnumProposalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProposalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProposalStatusFilter<$PrismaModel>
    _max?: NestedEnumProposalStatusFilter<$PrismaModel>
  }

  export type EnumVoteChoiceFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteChoice | EnumVoteChoiceFieldRefInput<$PrismaModel>
    in?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteChoiceFilter<$PrismaModel> | $Enums.VoteChoice
  }

  export type ProposalScalarRelationFilter = {
    is?: ProposalWhereInput
    isNot?: ProposalWhereInput
  }

  export type VoteProposalIdUserIdCompoundUniqueInput = {
    proposalId: string
    userId: string
  }

  export type VoteCountOrderByAggregateInput = {
    id?: SortOrder
    proposalId?: SortOrder
    userId?: SortOrder
    choice?: SortOrder
    votingPower?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type VoteAvgOrderByAggregateInput = {
    votingPower?: SortOrder
  }

  export type VoteMaxOrderByAggregateInput = {
    id?: SortOrder
    proposalId?: SortOrder
    userId?: SortOrder
    choice?: SortOrder
    votingPower?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type VoteMinOrderByAggregateInput = {
    id?: SortOrder
    proposalId?: SortOrder
    userId?: SortOrder
    choice?: SortOrder
    votingPower?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type VoteSumOrderByAggregateInput = {
    votingPower?: SortOrder
  }

  export type EnumVoteChoiceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteChoice | EnumVoteChoiceFieldRefInput<$PrismaModel>
    in?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteChoiceWithAggregatesFilter<$PrismaModel> | $Enums.VoteChoice
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVoteChoiceFilter<$PrismaModel>
    _max?: NestedEnumVoteChoiceFilter<$PrismaModel>
  }

  export type BookingCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type HotelAssetCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<HotelAssetCreateWithoutCreatedByInput, HotelAssetUncheckedCreateWithoutCreatedByInput> | HotelAssetCreateWithoutCreatedByInput[] | HotelAssetUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: HotelAssetCreateOrConnectWithoutCreatedByInput | HotelAssetCreateOrConnectWithoutCreatedByInput[]
    createMany?: HotelAssetCreateManyCreatedByInputEnvelope
    connect?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
  }

  export type InvestmentCreateNestedManyWithoutUserInput = {
    create?: XOR<InvestmentCreateWithoutUserInput, InvestmentUncheckedCreateWithoutUserInput> | InvestmentCreateWithoutUserInput[] | InvestmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutUserInput | InvestmentCreateOrConnectWithoutUserInput[]
    createMany?: InvestmentCreateManyUserInputEnvelope
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
  }

  export type KycCreateNestedManyWithoutReviewerInput = {
    create?: XOR<KycCreateWithoutReviewerInput, KycUncheckedCreateWithoutReviewerInput> | KycCreateWithoutReviewerInput[] | KycUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: KycCreateOrConnectWithoutReviewerInput | KycCreateOrConnectWithoutReviewerInput[]
    createMany?: KycCreateManyReviewerInputEnvelope
    connect?: KycWhereUniqueInput | KycWhereUniqueInput[]
  }

  export type KycCreateNestedOneWithoutUserInput = {
    create?: XOR<KycCreateWithoutUserInput, KycUncheckedCreateWithoutUserInput>
    connectOrCreate?: KycCreateOrConnectWithoutUserInput
    connect?: KycWhereUniqueInput
  }

  export type ProposalCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProposalCreateWithoutCreatedByInput, ProposalUncheckedCreateWithoutCreatedByInput> | ProposalCreateWithoutCreatedByInput[] | ProposalUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutCreatedByInput | ProposalCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProposalCreateManyCreatedByInputEnvelope
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
  }

  export type ProposalCreateNestedManyWithoutProposerInput = {
    create?: XOR<ProposalCreateWithoutProposerInput, ProposalUncheckedCreateWithoutProposerInput> | ProposalCreateWithoutProposerInput[] | ProposalUncheckedCreateWithoutProposerInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutProposerInput | ProposalCreateOrConnectWithoutProposerInput[]
    createMany?: ProposalCreateManyProposerInputEnvelope
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
  }

  export type VoteCreateNestedManyWithoutUserInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<HotelAssetCreateWithoutCreatedByInput, HotelAssetUncheckedCreateWithoutCreatedByInput> | HotelAssetCreateWithoutCreatedByInput[] | HotelAssetUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: HotelAssetCreateOrConnectWithoutCreatedByInput | HotelAssetCreateOrConnectWithoutCreatedByInput[]
    createMany?: HotelAssetCreateManyCreatedByInputEnvelope
    connect?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
  }

  export type InvestmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InvestmentCreateWithoutUserInput, InvestmentUncheckedCreateWithoutUserInput> | InvestmentCreateWithoutUserInput[] | InvestmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutUserInput | InvestmentCreateOrConnectWithoutUserInput[]
    createMany?: InvestmentCreateManyUserInputEnvelope
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
  }

  export type KycUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<KycCreateWithoutReviewerInput, KycUncheckedCreateWithoutReviewerInput> | KycCreateWithoutReviewerInput[] | KycUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: KycCreateOrConnectWithoutReviewerInput | KycCreateOrConnectWithoutReviewerInput[]
    createMany?: KycCreateManyReviewerInputEnvelope
    connect?: KycWhereUniqueInput | KycWhereUniqueInput[]
  }

  export type KycUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<KycCreateWithoutUserInput, KycUncheckedCreateWithoutUserInput>
    connectOrCreate?: KycCreateOrConnectWithoutUserInput
    connect?: KycWhereUniqueInput
  }

  export type ProposalUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProposalCreateWithoutCreatedByInput, ProposalUncheckedCreateWithoutCreatedByInput> | ProposalCreateWithoutCreatedByInput[] | ProposalUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutCreatedByInput | ProposalCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProposalCreateManyCreatedByInputEnvelope
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
  }

  export type ProposalUncheckedCreateNestedManyWithoutProposerInput = {
    create?: XOR<ProposalCreateWithoutProposerInput, ProposalUncheckedCreateWithoutProposerInput> | ProposalCreateWithoutProposerInput[] | ProposalUncheckedCreateWithoutProposerInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutProposerInput | ProposalCreateOrConnectWithoutProposerInput[]
    createMany?: ProposalCreateManyProposerInputEnvelope
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
  }

  export type VoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumKycStatusFieldUpdateOperationsInput = {
    set?: $Enums.KycStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableEnumVerificationLevelFieldUpdateOperationsInput = {
    set?: $Enums.VerificationLevel | null
  }

  export type BookingUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutUserInput | BookingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutUserInput | BookingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutUserInput | BookingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type HotelAssetUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<HotelAssetCreateWithoutCreatedByInput, HotelAssetUncheckedCreateWithoutCreatedByInput> | HotelAssetCreateWithoutCreatedByInput[] | HotelAssetUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: HotelAssetCreateOrConnectWithoutCreatedByInput | HotelAssetCreateOrConnectWithoutCreatedByInput[]
    upsert?: HotelAssetUpsertWithWhereUniqueWithoutCreatedByInput | HotelAssetUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: HotelAssetCreateManyCreatedByInputEnvelope
    set?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    disconnect?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    delete?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    connect?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    update?: HotelAssetUpdateWithWhereUniqueWithoutCreatedByInput | HotelAssetUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: HotelAssetUpdateManyWithWhereWithoutCreatedByInput | HotelAssetUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: HotelAssetScalarWhereInput | HotelAssetScalarWhereInput[]
  }

  export type InvestmentUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvestmentCreateWithoutUserInput, InvestmentUncheckedCreateWithoutUserInput> | InvestmentCreateWithoutUserInput[] | InvestmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutUserInput | InvestmentCreateOrConnectWithoutUserInput[]
    upsert?: InvestmentUpsertWithWhereUniqueWithoutUserInput | InvestmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvestmentCreateManyUserInputEnvelope
    set?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    disconnect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    delete?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    update?: InvestmentUpdateWithWhereUniqueWithoutUserInput | InvestmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvestmentUpdateManyWithWhereWithoutUserInput | InvestmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvestmentScalarWhereInput | InvestmentScalarWhereInput[]
  }

  export type KycUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<KycCreateWithoutReviewerInput, KycUncheckedCreateWithoutReviewerInput> | KycCreateWithoutReviewerInput[] | KycUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: KycCreateOrConnectWithoutReviewerInput | KycCreateOrConnectWithoutReviewerInput[]
    upsert?: KycUpsertWithWhereUniqueWithoutReviewerInput | KycUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: KycCreateManyReviewerInputEnvelope
    set?: KycWhereUniqueInput | KycWhereUniqueInput[]
    disconnect?: KycWhereUniqueInput | KycWhereUniqueInput[]
    delete?: KycWhereUniqueInput | KycWhereUniqueInput[]
    connect?: KycWhereUniqueInput | KycWhereUniqueInput[]
    update?: KycUpdateWithWhereUniqueWithoutReviewerInput | KycUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: KycUpdateManyWithWhereWithoutReviewerInput | KycUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: KycScalarWhereInput | KycScalarWhereInput[]
  }

  export type KycUpdateOneWithoutUserNestedInput = {
    create?: XOR<KycCreateWithoutUserInput, KycUncheckedCreateWithoutUserInput>
    connectOrCreate?: KycCreateOrConnectWithoutUserInput
    upsert?: KycUpsertWithoutUserInput
    disconnect?: KycWhereInput | boolean
    delete?: KycWhereInput | boolean
    connect?: KycWhereUniqueInput
    update?: XOR<XOR<KycUpdateToOneWithWhereWithoutUserInput, KycUpdateWithoutUserInput>, KycUncheckedUpdateWithoutUserInput>
  }

  export type ProposalUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProposalCreateWithoutCreatedByInput, ProposalUncheckedCreateWithoutCreatedByInput> | ProposalCreateWithoutCreatedByInput[] | ProposalUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutCreatedByInput | ProposalCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProposalUpsertWithWhereUniqueWithoutCreatedByInput | ProposalUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProposalCreateManyCreatedByInputEnvelope
    set?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    disconnect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    delete?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    update?: ProposalUpdateWithWhereUniqueWithoutCreatedByInput | ProposalUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProposalUpdateManyWithWhereWithoutCreatedByInput | ProposalUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
  }

  export type ProposalUpdateManyWithoutProposerNestedInput = {
    create?: XOR<ProposalCreateWithoutProposerInput, ProposalUncheckedCreateWithoutProposerInput> | ProposalCreateWithoutProposerInput[] | ProposalUncheckedCreateWithoutProposerInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutProposerInput | ProposalCreateOrConnectWithoutProposerInput[]
    upsert?: ProposalUpsertWithWhereUniqueWithoutProposerInput | ProposalUpsertWithWhereUniqueWithoutProposerInput[]
    createMany?: ProposalCreateManyProposerInputEnvelope
    set?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    disconnect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    delete?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    update?: ProposalUpdateWithWhereUniqueWithoutProposerInput | ProposalUpdateWithWhereUniqueWithoutProposerInput[]
    updateMany?: ProposalUpdateManyWithWhereWithoutProposerInput | ProposalUpdateManyWithWhereWithoutProposerInput[]
    deleteMany?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
  }

  export type VoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutUserInput | VoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutUserInput | VoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutUserInput | VoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutUserInput | BookingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutUserInput | BookingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutUserInput | BookingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<HotelAssetCreateWithoutCreatedByInput, HotelAssetUncheckedCreateWithoutCreatedByInput> | HotelAssetCreateWithoutCreatedByInput[] | HotelAssetUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: HotelAssetCreateOrConnectWithoutCreatedByInput | HotelAssetCreateOrConnectWithoutCreatedByInput[]
    upsert?: HotelAssetUpsertWithWhereUniqueWithoutCreatedByInput | HotelAssetUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: HotelAssetCreateManyCreatedByInputEnvelope
    set?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    disconnect?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    delete?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    connect?: HotelAssetWhereUniqueInput | HotelAssetWhereUniqueInput[]
    update?: HotelAssetUpdateWithWhereUniqueWithoutCreatedByInput | HotelAssetUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: HotelAssetUpdateManyWithWhereWithoutCreatedByInput | HotelAssetUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: HotelAssetScalarWhereInput | HotelAssetScalarWhereInput[]
  }

  export type InvestmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvestmentCreateWithoutUserInput, InvestmentUncheckedCreateWithoutUserInput> | InvestmentCreateWithoutUserInput[] | InvestmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutUserInput | InvestmentCreateOrConnectWithoutUserInput[]
    upsert?: InvestmentUpsertWithWhereUniqueWithoutUserInput | InvestmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvestmentCreateManyUserInputEnvelope
    set?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    disconnect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    delete?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    update?: InvestmentUpdateWithWhereUniqueWithoutUserInput | InvestmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvestmentUpdateManyWithWhereWithoutUserInput | InvestmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvestmentScalarWhereInput | InvestmentScalarWhereInput[]
  }

  export type KycUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<KycCreateWithoutReviewerInput, KycUncheckedCreateWithoutReviewerInput> | KycCreateWithoutReviewerInput[] | KycUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: KycCreateOrConnectWithoutReviewerInput | KycCreateOrConnectWithoutReviewerInput[]
    upsert?: KycUpsertWithWhereUniqueWithoutReviewerInput | KycUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: KycCreateManyReviewerInputEnvelope
    set?: KycWhereUniqueInput | KycWhereUniqueInput[]
    disconnect?: KycWhereUniqueInput | KycWhereUniqueInput[]
    delete?: KycWhereUniqueInput | KycWhereUniqueInput[]
    connect?: KycWhereUniqueInput | KycWhereUniqueInput[]
    update?: KycUpdateWithWhereUniqueWithoutReviewerInput | KycUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: KycUpdateManyWithWhereWithoutReviewerInput | KycUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: KycScalarWhereInput | KycScalarWhereInput[]
  }

  export type KycUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<KycCreateWithoutUserInput, KycUncheckedCreateWithoutUserInput>
    connectOrCreate?: KycCreateOrConnectWithoutUserInput
    upsert?: KycUpsertWithoutUserInput
    disconnect?: KycWhereInput | boolean
    delete?: KycWhereInput | boolean
    connect?: KycWhereUniqueInput
    update?: XOR<XOR<KycUpdateToOneWithWhereWithoutUserInput, KycUpdateWithoutUserInput>, KycUncheckedUpdateWithoutUserInput>
  }

  export type ProposalUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProposalCreateWithoutCreatedByInput, ProposalUncheckedCreateWithoutCreatedByInput> | ProposalCreateWithoutCreatedByInput[] | ProposalUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutCreatedByInput | ProposalCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProposalUpsertWithWhereUniqueWithoutCreatedByInput | ProposalUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProposalCreateManyCreatedByInputEnvelope
    set?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    disconnect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    delete?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    update?: ProposalUpdateWithWhereUniqueWithoutCreatedByInput | ProposalUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProposalUpdateManyWithWhereWithoutCreatedByInput | ProposalUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
  }

  export type ProposalUncheckedUpdateManyWithoutProposerNestedInput = {
    create?: XOR<ProposalCreateWithoutProposerInput, ProposalUncheckedCreateWithoutProposerInput> | ProposalCreateWithoutProposerInput[] | ProposalUncheckedCreateWithoutProposerInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutProposerInput | ProposalCreateOrConnectWithoutProposerInput[]
    upsert?: ProposalUpsertWithWhereUniqueWithoutProposerInput | ProposalUpsertWithWhereUniqueWithoutProposerInput[]
    createMany?: ProposalCreateManyProposerInputEnvelope
    set?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    disconnect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    delete?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    update?: ProposalUpdateWithWhereUniqueWithoutProposerInput | ProposalUpdateWithWhereUniqueWithoutProposerInput[]
    updateMany?: ProposalUpdateManyWithWhereWithoutProposerInput | ProposalUpdateManyWithWhereWithoutProposerInput[]
    deleteMany?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
  }

  export type VoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput> | VoteCreateWithoutUserInput[] | VoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutUserInput | VoteCreateOrConnectWithoutUserInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutUserInput | VoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VoteCreateManyUserInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutUserInput | VoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutUserInput | VoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutKycInput = {
    create?: XOR<UserCreateWithoutKycInput, UserUncheckedCreateWithoutKycInput>
    connectOrCreate?: UserCreateOrConnectWithoutKycInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReviewedKycInput = {
    create?: XOR<UserCreateWithoutReviewedKycInput, UserUncheckedCreateWithoutReviewedKycInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewedKycInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutKycNestedInput = {
    create?: XOR<UserCreateWithoutKycInput, UserUncheckedCreateWithoutKycInput>
    connectOrCreate?: UserCreateOrConnectWithoutKycInput
    upsert?: UserUpsertWithoutKycInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutKycInput, UserUpdateWithoutKycInput>, UserUncheckedUpdateWithoutKycInput>
  }

  export type UserUpdateOneWithoutReviewedKycNestedInput = {
    create?: XOR<UserCreateWithoutReviewedKycInput, UserUncheckedCreateWithoutReviewedKycInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewedKycInput
    upsert?: UserUpsertWithoutReviewedKycInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewedKycInput, UserUpdateWithoutReviewedKycInput>, UserUncheckedUpdateWithoutReviewedKycInput>
  }

  export type UserCreateNestedOneWithoutCreatedHotelAssetsInput = {
    create?: XOR<UserCreateWithoutCreatedHotelAssetsInput, UserUncheckedCreateWithoutCreatedHotelAssetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedHotelAssetsInput
    connect?: UserWhereUniqueInput
  }

  export type BookingCreateNestedManyWithoutHotelAssetInput = {
    create?: XOR<BookingCreateWithoutHotelAssetInput, BookingUncheckedCreateWithoutHotelAssetInput> | BookingCreateWithoutHotelAssetInput[] | BookingUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutHotelAssetInput | BookingCreateOrConnectWithoutHotelAssetInput[]
    createMany?: BookingCreateManyHotelAssetInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type InvestmentCreateNestedManyWithoutHotelAssetInput = {
    create?: XOR<InvestmentCreateWithoutHotelAssetInput, InvestmentUncheckedCreateWithoutHotelAssetInput> | InvestmentCreateWithoutHotelAssetInput[] | InvestmentUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutHotelAssetInput | InvestmentCreateOrConnectWithoutHotelAssetInput[]
    createMany?: InvestmentCreateManyHotelAssetInputEnvelope
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
  }

  export type ProposalCreateNestedManyWithoutHotelAssetInput = {
    create?: XOR<ProposalCreateWithoutHotelAssetInput, ProposalUncheckedCreateWithoutHotelAssetInput> | ProposalCreateWithoutHotelAssetInput[] | ProposalUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutHotelAssetInput | ProposalCreateOrConnectWithoutHotelAssetInput[]
    createMany?: ProposalCreateManyHotelAssetInputEnvelope
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutHotelAssetInput = {
    create?: XOR<BookingCreateWithoutHotelAssetInput, BookingUncheckedCreateWithoutHotelAssetInput> | BookingCreateWithoutHotelAssetInput[] | BookingUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutHotelAssetInput | BookingCreateOrConnectWithoutHotelAssetInput[]
    createMany?: BookingCreateManyHotelAssetInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type InvestmentUncheckedCreateNestedManyWithoutHotelAssetInput = {
    create?: XOR<InvestmentCreateWithoutHotelAssetInput, InvestmentUncheckedCreateWithoutHotelAssetInput> | InvestmentCreateWithoutHotelAssetInput[] | InvestmentUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutHotelAssetInput | InvestmentCreateOrConnectWithoutHotelAssetInput[]
    createMany?: InvestmentCreateManyHotelAssetInputEnvelope
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
  }

  export type ProposalUncheckedCreateNestedManyWithoutHotelAssetInput = {
    create?: XOR<ProposalCreateWithoutHotelAssetInput, ProposalUncheckedCreateWithoutHotelAssetInput> | ProposalCreateWithoutHotelAssetInput[] | ProposalUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutHotelAssetInput | ProposalCreateOrConnectWithoutHotelAssetInput[]
    createMany?: ProposalCreateManyHotelAssetInputEnvelope
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
  }

  export type EnumAssetStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssetStatus
  }

  export type UserUpdateOneRequiredWithoutCreatedHotelAssetsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedHotelAssetsInput, UserUncheckedCreateWithoutCreatedHotelAssetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedHotelAssetsInput
    upsert?: UserUpsertWithoutCreatedHotelAssetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedHotelAssetsInput, UserUpdateWithoutCreatedHotelAssetsInput>, UserUncheckedUpdateWithoutCreatedHotelAssetsInput>
  }

  export type BookingUpdateManyWithoutHotelAssetNestedInput = {
    create?: XOR<BookingCreateWithoutHotelAssetInput, BookingUncheckedCreateWithoutHotelAssetInput> | BookingCreateWithoutHotelAssetInput[] | BookingUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutHotelAssetInput | BookingCreateOrConnectWithoutHotelAssetInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutHotelAssetInput | BookingUpsertWithWhereUniqueWithoutHotelAssetInput[]
    createMany?: BookingCreateManyHotelAssetInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutHotelAssetInput | BookingUpdateWithWhereUniqueWithoutHotelAssetInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutHotelAssetInput | BookingUpdateManyWithWhereWithoutHotelAssetInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type InvestmentUpdateManyWithoutHotelAssetNestedInput = {
    create?: XOR<InvestmentCreateWithoutHotelAssetInput, InvestmentUncheckedCreateWithoutHotelAssetInput> | InvestmentCreateWithoutHotelAssetInput[] | InvestmentUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutHotelAssetInput | InvestmentCreateOrConnectWithoutHotelAssetInput[]
    upsert?: InvestmentUpsertWithWhereUniqueWithoutHotelAssetInput | InvestmentUpsertWithWhereUniqueWithoutHotelAssetInput[]
    createMany?: InvestmentCreateManyHotelAssetInputEnvelope
    set?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    disconnect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    delete?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    update?: InvestmentUpdateWithWhereUniqueWithoutHotelAssetInput | InvestmentUpdateWithWhereUniqueWithoutHotelAssetInput[]
    updateMany?: InvestmentUpdateManyWithWhereWithoutHotelAssetInput | InvestmentUpdateManyWithWhereWithoutHotelAssetInput[]
    deleteMany?: InvestmentScalarWhereInput | InvestmentScalarWhereInput[]
  }

  export type ProposalUpdateManyWithoutHotelAssetNestedInput = {
    create?: XOR<ProposalCreateWithoutHotelAssetInput, ProposalUncheckedCreateWithoutHotelAssetInput> | ProposalCreateWithoutHotelAssetInput[] | ProposalUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutHotelAssetInput | ProposalCreateOrConnectWithoutHotelAssetInput[]
    upsert?: ProposalUpsertWithWhereUniqueWithoutHotelAssetInput | ProposalUpsertWithWhereUniqueWithoutHotelAssetInput[]
    createMany?: ProposalCreateManyHotelAssetInputEnvelope
    set?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    disconnect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    delete?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    update?: ProposalUpdateWithWhereUniqueWithoutHotelAssetInput | ProposalUpdateWithWhereUniqueWithoutHotelAssetInput[]
    updateMany?: ProposalUpdateManyWithWhereWithoutHotelAssetInput | ProposalUpdateManyWithWhereWithoutHotelAssetInput[]
    deleteMany?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutHotelAssetNestedInput = {
    create?: XOR<BookingCreateWithoutHotelAssetInput, BookingUncheckedCreateWithoutHotelAssetInput> | BookingCreateWithoutHotelAssetInput[] | BookingUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutHotelAssetInput | BookingCreateOrConnectWithoutHotelAssetInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutHotelAssetInput | BookingUpsertWithWhereUniqueWithoutHotelAssetInput[]
    createMany?: BookingCreateManyHotelAssetInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutHotelAssetInput | BookingUpdateWithWhereUniqueWithoutHotelAssetInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutHotelAssetInput | BookingUpdateManyWithWhereWithoutHotelAssetInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type InvestmentUncheckedUpdateManyWithoutHotelAssetNestedInput = {
    create?: XOR<InvestmentCreateWithoutHotelAssetInput, InvestmentUncheckedCreateWithoutHotelAssetInput> | InvestmentCreateWithoutHotelAssetInput[] | InvestmentUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: InvestmentCreateOrConnectWithoutHotelAssetInput | InvestmentCreateOrConnectWithoutHotelAssetInput[]
    upsert?: InvestmentUpsertWithWhereUniqueWithoutHotelAssetInput | InvestmentUpsertWithWhereUniqueWithoutHotelAssetInput[]
    createMany?: InvestmentCreateManyHotelAssetInputEnvelope
    set?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    disconnect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    delete?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    connect?: InvestmentWhereUniqueInput | InvestmentWhereUniqueInput[]
    update?: InvestmentUpdateWithWhereUniqueWithoutHotelAssetInput | InvestmentUpdateWithWhereUniqueWithoutHotelAssetInput[]
    updateMany?: InvestmentUpdateManyWithWhereWithoutHotelAssetInput | InvestmentUpdateManyWithWhereWithoutHotelAssetInput[]
    deleteMany?: InvestmentScalarWhereInput | InvestmentScalarWhereInput[]
  }

  export type ProposalUncheckedUpdateManyWithoutHotelAssetNestedInput = {
    create?: XOR<ProposalCreateWithoutHotelAssetInput, ProposalUncheckedCreateWithoutHotelAssetInput> | ProposalCreateWithoutHotelAssetInput[] | ProposalUncheckedCreateWithoutHotelAssetInput[]
    connectOrCreate?: ProposalCreateOrConnectWithoutHotelAssetInput | ProposalCreateOrConnectWithoutHotelAssetInput[]
    upsert?: ProposalUpsertWithWhereUniqueWithoutHotelAssetInput | ProposalUpsertWithWhereUniqueWithoutHotelAssetInput[]
    createMany?: ProposalCreateManyHotelAssetInputEnvelope
    set?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    disconnect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    delete?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    connect?: ProposalWhereUniqueInput | ProposalWhereUniqueInput[]
    update?: ProposalUpdateWithWhereUniqueWithoutHotelAssetInput | ProposalUpdateWithWhereUniqueWithoutHotelAssetInput[]
    updateMany?: ProposalUpdateManyWithWhereWithoutHotelAssetInput | ProposalUpdateManyWithWhereWithoutHotelAssetInput[]
    deleteMany?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutInvestmentsInput = {
    create?: XOR<UserCreateWithoutInvestmentsInput, UserUncheckedCreateWithoutInvestmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvestmentsInput
    connect?: UserWhereUniqueInput
  }

  export type HotelAssetCreateNestedOneWithoutInvestmentsInput = {
    create?: XOR<HotelAssetCreateWithoutInvestmentsInput, HotelAssetUncheckedCreateWithoutInvestmentsInput>
    connectOrCreate?: HotelAssetCreateOrConnectWithoutInvestmentsInput
    connect?: HotelAssetWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumInvestmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvestmentStatus
  }

  export type UserUpdateOneRequiredWithoutInvestmentsNestedInput = {
    create?: XOR<UserCreateWithoutInvestmentsInput, UserUncheckedCreateWithoutInvestmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvestmentsInput
    upsert?: UserUpsertWithoutInvestmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInvestmentsInput, UserUpdateWithoutInvestmentsInput>, UserUncheckedUpdateWithoutInvestmentsInput>
  }

  export type HotelAssetUpdateOneRequiredWithoutInvestmentsNestedInput = {
    create?: XOR<HotelAssetCreateWithoutInvestmentsInput, HotelAssetUncheckedCreateWithoutInvestmentsInput>
    connectOrCreate?: HotelAssetCreateOrConnectWithoutInvestmentsInput
    upsert?: HotelAssetUpsertWithoutInvestmentsInput
    connect?: HotelAssetWhereUniqueInput
    update?: XOR<XOR<HotelAssetUpdateToOneWithWhereWithoutInvestmentsInput, HotelAssetUpdateWithoutInvestmentsInput>, HotelAssetUncheckedUpdateWithoutInvestmentsInput>
  }

  export type HotelAssetCreateNestedOneWithoutBookingsInput = {
    create?: XOR<HotelAssetCreateWithoutBookingsInput, HotelAssetUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: HotelAssetCreateOrConnectWithoutBookingsInput
    connect?: HotelAssetWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBookingsInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus
  }

  export type HotelAssetUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<HotelAssetCreateWithoutBookingsInput, HotelAssetUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: HotelAssetCreateOrConnectWithoutBookingsInput
    upsert?: HotelAssetUpsertWithoutBookingsInput
    connect?: HotelAssetWhereUniqueInput
    update?: XOR<XOR<HotelAssetUpdateToOneWithWhereWithoutBookingsInput, HotelAssetUpdateWithoutBookingsInput>, HotelAssetUncheckedUpdateWithoutBookingsInput>
  }

  export type UserUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    upsert?: UserUpsertWithoutBookingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookingsInput, UserUpdateWithoutBookingsInput>, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type UserCreateNestedOneWithoutCreatedProposalsInput = {
    create?: XOR<UserCreateWithoutCreatedProposalsInput, UserUncheckedCreateWithoutCreatedProposalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedProposalsInput
    connect?: UserWhereUniqueInput
  }

  export type HotelAssetCreateNestedOneWithoutProposalsInput = {
    create?: XOR<HotelAssetCreateWithoutProposalsInput, HotelAssetUncheckedCreateWithoutProposalsInput>
    connectOrCreate?: HotelAssetCreateOrConnectWithoutProposalsInput
    connect?: HotelAssetWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProposedProposalsInput = {
    create?: XOR<UserCreateWithoutProposedProposalsInput, UserUncheckedCreateWithoutProposedProposalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProposedProposalsInput
    connect?: UserWhereUniqueInput
  }

  export type VoteCreateNestedManyWithoutProposalInput = {
    create?: XOR<VoteCreateWithoutProposalInput, VoteUncheckedCreateWithoutProposalInput> | VoteCreateWithoutProposalInput[] | VoteUncheckedCreateWithoutProposalInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutProposalInput | VoteCreateOrConnectWithoutProposalInput[]
    createMany?: VoteCreateManyProposalInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type VoteUncheckedCreateNestedManyWithoutProposalInput = {
    create?: XOR<VoteCreateWithoutProposalInput, VoteUncheckedCreateWithoutProposalInput> | VoteCreateWithoutProposalInput[] | VoteUncheckedCreateWithoutProposalInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutProposalInput | VoteCreateOrConnectWithoutProposalInput[]
    createMany?: VoteCreateManyProposalInputEnvelope
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
  }

  export type EnumProposalTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProposalType
  }

  export type EnumProposalStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProposalStatus
  }

  export type UserUpdateOneRequiredWithoutCreatedProposalsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedProposalsInput, UserUncheckedCreateWithoutCreatedProposalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedProposalsInput
    upsert?: UserUpsertWithoutCreatedProposalsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedProposalsInput, UserUpdateWithoutCreatedProposalsInput>, UserUncheckedUpdateWithoutCreatedProposalsInput>
  }

  export type HotelAssetUpdateOneWithoutProposalsNestedInput = {
    create?: XOR<HotelAssetCreateWithoutProposalsInput, HotelAssetUncheckedCreateWithoutProposalsInput>
    connectOrCreate?: HotelAssetCreateOrConnectWithoutProposalsInput
    upsert?: HotelAssetUpsertWithoutProposalsInput
    disconnect?: HotelAssetWhereInput | boolean
    delete?: HotelAssetWhereInput | boolean
    connect?: HotelAssetWhereUniqueInput
    update?: XOR<XOR<HotelAssetUpdateToOneWithWhereWithoutProposalsInput, HotelAssetUpdateWithoutProposalsInput>, HotelAssetUncheckedUpdateWithoutProposalsInput>
  }

  export type UserUpdateOneRequiredWithoutProposedProposalsNestedInput = {
    create?: XOR<UserCreateWithoutProposedProposalsInput, UserUncheckedCreateWithoutProposedProposalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProposedProposalsInput
    upsert?: UserUpsertWithoutProposedProposalsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProposedProposalsInput, UserUpdateWithoutProposedProposalsInput>, UserUncheckedUpdateWithoutProposedProposalsInput>
  }

  export type VoteUpdateManyWithoutProposalNestedInput = {
    create?: XOR<VoteCreateWithoutProposalInput, VoteUncheckedCreateWithoutProposalInput> | VoteCreateWithoutProposalInput[] | VoteUncheckedCreateWithoutProposalInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutProposalInput | VoteCreateOrConnectWithoutProposalInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutProposalInput | VoteUpsertWithWhereUniqueWithoutProposalInput[]
    createMany?: VoteCreateManyProposalInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutProposalInput | VoteUpdateWithWhereUniqueWithoutProposalInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutProposalInput | VoteUpdateManyWithWhereWithoutProposalInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type VoteUncheckedUpdateManyWithoutProposalNestedInput = {
    create?: XOR<VoteCreateWithoutProposalInput, VoteUncheckedCreateWithoutProposalInput> | VoteCreateWithoutProposalInput[] | VoteUncheckedCreateWithoutProposalInput[]
    connectOrCreate?: VoteCreateOrConnectWithoutProposalInput | VoteCreateOrConnectWithoutProposalInput[]
    upsert?: VoteUpsertWithWhereUniqueWithoutProposalInput | VoteUpsertWithWhereUniqueWithoutProposalInput[]
    createMany?: VoteCreateManyProposalInputEnvelope
    set?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    disconnect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    delete?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    connect?: VoteWhereUniqueInput | VoteWhereUniqueInput[]
    update?: VoteUpdateWithWhereUniqueWithoutProposalInput | VoteUpdateWithWhereUniqueWithoutProposalInput[]
    updateMany?: VoteUpdateManyWithWhereWithoutProposalInput | VoteUpdateManyWithWhereWithoutProposalInput[]
    deleteMany?: VoteScalarWhereInput | VoteScalarWhereInput[]
  }

  export type ProposalCreateNestedOneWithoutVotesInput = {
    create?: XOR<ProposalCreateWithoutVotesInput, ProposalUncheckedCreateWithoutVotesInput>
    connectOrCreate?: ProposalCreateOrConnectWithoutVotesInput
    connect?: ProposalWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutVotesInput = {
    create?: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVotesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumVoteChoiceFieldUpdateOperationsInput = {
    set?: $Enums.VoteChoice
  }

  export type ProposalUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<ProposalCreateWithoutVotesInput, ProposalUncheckedCreateWithoutVotesInput>
    connectOrCreate?: ProposalCreateOrConnectWithoutVotesInput
    upsert?: ProposalUpsertWithoutVotesInput
    connect?: ProposalWhereUniqueInput
    update?: XOR<XOR<ProposalUpdateToOneWithWhereWithoutVotesInput, ProposalUpdateWithoutVotesInput>, ProposalUncheckedUpdateWithoutVotesInput>
  }

  export type UserUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutVotesInput
    upsert?: UserUpsertWithoutVotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVotesInput, UserUpdateWithoutVotesInput>, UserUncheckedUpdateWithoutVotesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumKycStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusFilter<$PrismaModel> | $Enums.KycStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumVerificationLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationLevel | EnumVerificationLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVerificationLevelNullableFilter<$PrismaModel> | $Enums.VerificationLevel | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumKycStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KycStatus | EnumKycStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KycStatus[] | ListEnumKycStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKycStatusWithAggregatesFilter<$PrismaModel> | $Enums.KycStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKycStatusFilter<$PrismaModel>
    _max?: NestedEnumKycStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumVerificationLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationLevel | EnumVerificationLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.VerificationLevel[] | ListEnumVerificationLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumVerificationLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.VerificationLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumVerificationLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumVerificationLevelNullableFilter<$PrismaModel>
  }

  export type NestedEnumAssetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusFilter<$PrismaModel> | $Enums.AssetStatus
  }

  export type NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetStatus | EnumAssetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetStatus[] | ListEnumAssetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetStatusFilter<$PrismaModel>
    _max?: NestedEnumAssetStatusFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumInvestmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestmentStatus | EnumInvestmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestmentStatusFilter<$PrismaModel> | $Enums.InvestmentStatus
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumInvestmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvestmentStatus | EnumInvestmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvestmentStatus[] | ListEnumInvestmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvestmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvestmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvestmentStatusFilter<$PrismaModel>
    _max?: NestedEnumInvestmentStatusFilter<$PrismaModel>
  }

  export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type NestedEnumProposalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalType | EnumProposalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalTypeFilter<$PrismaModel> | $Enums.ProposalType
  }

  export type NestedEnumProposalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalStatus | EnumProposalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalStatusFilter<$PrismaModel> | $Enums.ProposalStatus
  }

  export type NestedEnumProposalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalType | EnumProposalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalType[] | ListEnumProposalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProposalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProposalTypeFilter<$PrismaModel>
    _max?: NestedEnumProposalTypeFilter<$PrismaModel>
  }

  export type NestedEnumProposalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProposalStatus | EnumProposalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProposalStatus[] | ListEnumProposalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProposalStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProposalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProposalStatusFilter<$PrismaModel>
    _max?: NestedEnumProposalStatusFilter<$PrismaModel>
  }

  export type NestedEnumVoteChoiceFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteChoice | EnumVoteChoiceFieldRefInput<$PrismaModel>
    in?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteChoiceFilter<$PrismaModel> | $Enums.VoteChoice
  }

  export type NestedEnumVoteChoiceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteChoice | EnumVoteChoiceFieldRefInput<$PrismaModel>
    in?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteChoice[] | ListEnumVoteChoiceFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteChoiceWithAggregatesFilter<$PrismaModel> | $Enums.VoteChoice
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVoteChoiceFilter<$PrismaModel>
    _max?: NestedEnumVoteChoiceFilter<$PrismaModel>
  }

  export type BookingCreateWithoutUserInput = {
    id?: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hotelAsset: HotelAssetCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutUserInput = {
    id?: string
    hotelAssetId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingCreateOrConnectWithoutUserInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
  }

  export type BookingCreateManyUserInputEnvelope = {
    data: BookingCreateManyUserInput | BookingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type HotelAssetCreateWithoutCreatedByInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingCreateNestedManyWithoutHotelAssetInput
    investments?: InvestmentCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetUncheckedCreateWithoutCreatedByInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutHotelAssetInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalUncheckedCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetCreateOrConnectWithoutCreatedByInput = {
    where: HotelAssetWhereUniqueInput
    create: XOR<HotelAssetCreateWithoutCreatedByInput, HotelAssetUncheckedCreateWithoutCreatedByInput>
  }

  export type HotelAssetCreateManyCreatedByInputEnvelope = {
    data: HotelAssetCreateManyCreatedByInput | HotelAssetCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type InvestmentCreateWithoutUserInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    hotelAsset: HotelAssetCreateNestedOneWithoutInvestmentsInput
  }

  export type InvestmentUncheckedCreateWithoutUserInput = {
    id?: string
    hotelAssetId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestmentCreateOrConnectWithoutUserInput = {
    where: InvestmentWhereUniqueInput
    create: XOR<InvestmentCreateWithoutUserInput, InvestmentUncheckedCreateWithoutUserInput>
  }

  export type InvestmentCreateManyUserInputEnvelope = {
    data: InvestmentCreateManyUserInput | InvestmentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type KycCreateWithoutReviewerInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutKycInput
  }

  export type KycUncheckedCreateWithoutReviewerInput = {
    id?: string
    userId: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KycCreateOrConnectWithoutReviewerInput = {
    where: KycWhereUniqueInput
    create: XOR<KycCreateWithoutReviewerInput, KycUncheckedCreateWithoutReviewerInput>
  }

  export type KycCreateManyReviewerInputEnvelope = {
    data: KycCreateManyReviewerInput | KycCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type KycCreateWithoutUserInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewer?: UserCreateNestedOneWithoutReviewedKycInput
  }

  export type KycUncheckedCreateWithoutUserInput = {
    id?: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KycCreateOrConnectWithoutUserInput = {
    where: KycWhereUniqueInput
    create: XOR<KycCreateWithoutUserInput, KycUncheckedCreateWithoutUserInput>
  }

  export type ProposalCreateWithoutCreatedByInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hotelAsset?: HotelAssetCreateNestedOneWithoutProposalsInput
    proposer: UserCreateNestedOneWithoutProposedProposalsInput
    votes?: VoteCreateNestedManyWithoutProposalInput
  }

  export type ProposalUncheckedCreateWithoutCreatedByInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: VoteUncheckedCreateNestedManyWithoutProposalInput
  }

  export type ProposalCreateOrConnectWithoutCreatedByInput = {
    where: ProposalWhereUniqueInput
    create: XOR<ProposalCreateWithoutCreatedByInput, ProposalUncheckedCreateWithoutCreatedByInput>
  }

  export type ProposalCreateManyCreatedByInputEnvelope = {
    data: ProposalCreateManyCreatedByInput | ProposalCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ProposalCreateWithoutProposerInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedProposalsInput
    hotelAsset?: HotelAssetCreateNestedOneWithoutProposalsInput
    votes?: VoteCreateNestedManyWithoutProposalInput
  }

  export type ProposalUncheckedCreateWithoutProposerInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
    votes?: VoteUncheckedCreateNestedManyWithoutProposalInput
  }

  export type ProposalCreateOrConnectWithoutProposerInput = {
    where: ProposalWhereUniqueInput
    create: XOR<ProposalCreateWithoutProposerInput, ProposalUncheckedCreateWithoutProposerInput>
  }

  export type ProposalCreateManyProposerInputEnvelope = {
    data: ProposalCreateManyProposerInput | ProposalCreateManyProposerInput[]
    skipDuplicates?: boolean
  }

  export type VoteCreateWithoutUserInput = {
    id?: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
    proposal: ProposalCreateNestedOneWithoutVotesInput
  }

  export type VoteUncheckedCreateWithoutUserInput = {
    id?: string
    proposalId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type VoteCreateOrConnectWithoutUserInput = {
    where: VoteWhereUniqueInput
    create: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput>
  }

  export type VoteCreateManyUserInputEnvelope = {
    data: VoteCreateManyUserInput | VoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BookingUpsertWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>
  }

  export type BookingUpdateManyWithWhereWithoutUserInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutUserInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    userId?: StringFilter<"Booking"> | string
    hotelAssetId?: StringFilter<"Booking"> | string
    checkInDate?: DateTimeFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeFilter<"Booking"> | Date | string
    guests?: IntFilter<"Booking"> | number
    roomType?: StringFilter<"Booking"> | string
    totalPrice?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    specialRequests?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
  }

  export type HotelAssetUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: HotelAssetWhereUniqueInput
    update: XOR<HotelAssetUpdateWithoutCreatedByInput, HotelAssetUncheckedUpdateWithoutCreatedByInput>
    create: XOR<HotelAssetCreateWithoutCreatedByInput, HotelAssetUncheckedCreateWithoutCreatedByInput>
  }

  export type HotelAssetUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: HotelAssetWhereUniqueInput
    data: XOR<HotelAssetUpdateWithoutCreatedByInput, HotelAssetUncheckedUpdateWithoutCreatedByInput>
  }

  export type HotelAssetUpdateManyWithWhereWithoutCreatedByInput = {
    where: HotelAssetScalarWhereInput
    data: XOR<HotelAssetUpdateManyMutationInput, HotelAssetUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type HotelAssetScalarWhereInput = {
    AND?: HotelAssetScalarWhereInput | HotelAssetScalarWhereInput[]
    OR?: HotelAssetScalarWhereInput[]
    NOT?: HotelAssetScalarWhereInput | HotelAssetScalarWhereInput[]
    id?: StringFilter<"HotelAsset"> | string
    name?: StringFilter<"HotelAsset"> | string
    description?: StringNullableFilter<"HotelAsset"> | string | null
    status?: EnumAssetStatusFilter<"HotelAsset"> | $Enums.AssetStatus
    location?: StringFilter<"HotelAsset"> | string
    createdById?: StringFilter<"HotelAsset"> | string
    createdAt?: DateTimeFilter<"HotelAsset"> | Date | string
    updatedAt?: DateTimeFilter<"HotelAsset"> | Date | string
  }

  export type InvestmentUpsertWithWhereUniqueWithoutUserInput = {
    where: InvestmentWhereUniqueInput
    update: XOR<InvestmentUpdateWithoutUserInput, InvestmentUncheckedUpdateWithoutUserInput>
    create: XOR<InvestmentCreateWithoutUserInput, InvestmentUncheckedCreateWithoutUserInput>
  }

  export type InvestmentUpdateWithWhereUniqueWithoutUserInput = {
    where: InvestmentWhereUniqueInput
    data: XOR<InvestmentUpdateWithoutUserInput, InvestmentUncheckedUpdateWithoutUserInput>
  }

  export type InvestmentUpdateManyWithWhereWithoutUserInput = {
    where: InvestmentScalarWhereInput
    data: XOR<InvestmentUpdateManyMutationInput, InvestmentUncheckedUpdateManyWithoutUserInput>
  }

  export type InvestmentScalarWhereInput = {
    AND?: InvestmentScalarWhereInput | InvestmentScalarWhereInput[]
    OR?: InvestmentScalarWhereInput[]
    NOT?: InvestmentScalarWhereInput | InvestmentScalarWhereInput[]
    id?: StringFilter<"Investment"> | string
    userId?: StringFilter<"Investment"> | string
    hotelAssetId?: StringFilter<"Investment"> | string
    amount?: DecimalFilter<"Investment"> | Decimal | DecimalJsLike | number | string
    transactionHash?: StringNullableFilter<"Investment"> | string | null
    status?: EnumInvestmentStatusFilter<"Investment"> | $Enums.InvestmentStatus
    createdAt?: DateTimeFilter<"Investment"> | Date | string
    updatedAt?: DateTimeFilter<"Investment"> | Date | string
  }

  export type KycUpsertWithWhereUniqueWithoutReviewerInput = {
    where: KycWhereUniqueInput
    update: XOR<KycUpdateWithoutReviewerInput, KycUncheckedUpdateWithoutReviewerInput>
    create: XOR<KycCreateWithoutReviewerInput, KycUncheckedCreateWithoutReviewerInput>
  }

  export type KycUpdateWithWhereUniqueWithoutReviewerInput = {
    where: KycWhereUniqueInput
    data: XOR<KycUpdateWithoutReviewerInput, KycUncheckedUpdateWithoutReviewerInput>
  }

  export type KycUpdateManyWithWhereWithoutReviewerInput = {
    where: KycScalarWhereInput
    data: XOR<KycUpdateManyMutationInput, KycUncheckedUpdateManyWithoutReviewerInput>
  }

  export type KycScalarWhereInput = {
    AND?: KycScalarWhereInput | KycScalarWhereInput[]
    OR?: KycScalarWhereInput[]
    NOT?: KycScalarWhereInput | KycScalarWhereInput[]
    id?: StringFilter<"Kyc"> | string
    userId?: StringFilter<"Kyc"> | string
    fullName?: StringFilter<"Kyc"> | string
    dateOfBirth?: DateTimeFilter<"Kyc"> | Date | string
    nationality?: StringFilter<"Kyc"> | string
    address?: StringFilter<"Kyc"> | string
    documentType?: StringFilter<"Kyc"> | string
    documentNumber?: StringFilter<"Kyc"> | string
    documentFront?: StringNullableFilter<"Kyc"> | string | null
    documentBack?: StringNullableFilter<"Kyc"> | string | null
    selfieImage?: StringNullableFilter<"Kyc"> | string | null
    addressProof?: StringNullableFilter<"Kyc"> | string | null
    status?: EnumKycStatusFilter<"Kyc"> | $Enums.KycStatus
    city?: StringFilter<"Kyc"> | string
    state?: StringFilter<"Kyc"> | string
    postalCode?: StringFilter<"Kyc"> | string
    country?: StringFilter<"Kyc"> | string
    documentHash?: StringNullableFilter<"Kyc"> | string | null
    expiresAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    blockchainTx?: StringNullableFilter<"Kyc"> | string | null
    blockchainVerifier?: StringNullableFilter<"Kyc"> | string | null
    rejectionReason?: StringNullableFilter<"Kyc"> | string | null
    submittedAt?: DateTimeFilter<"Kyc"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"Kyc"> | Date | string | null
    reviewedBy?: StringNullableFilter<"Kyc"> | string | null
    createdAt?: DateTimeFilter<"Kyc"> | Date | string
    updatedAt?: DateTimeFilter<"Kyc"> | Date | string
  }

  export type KycUpsertWithoutUserInput = {
    update: XOR<KycUpdateWithoutUserInput, KycUncheckedUpdateWithoutUserInput>
    create: XOR<KycCreateWithoutUserInput, KycUncheckedCreateWithoutUserInput>
    where?: KycWhereInput
  }

  export type KycUpdateToOneWithWhereWithoutUserInput = {
    where?: KycWhereInput
    data: XOR<KycUpdateWithoutUserInput, KycUncheckedUpdateWithoutUserInput>
  }

  export type KycUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewer?: UserUpdateOneWithoutReviewedKycNestedInput
  }

  export type KycUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProposalUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ProposalWhereUniqueInput
    update: XOR<ProposalUpdateWithoutCreatedByInput, ProposalUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ProposalCreateWithoutCreatedByInput, ProposalUncheckedCreateWithoutCreatedByInput>
  }

  export type ProposalUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ProposalWhereUniqueInput
    data: XOR<ProposalUpdateWithoutCreatedByInput, ProposalUncheckedUpdateWithoutCreatedByInput>
  }

  export type ProposalUpdateManyWithWhereWithoutCreatedByInput = {
    where: ProposalScalarWhereInput
    data: XOR<ProposalUpdateManyMutationInput, ProposalUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ProposalScalarWhereInput = {
    AND?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
    OR?: ProposalScalarWhereInput[]
    NOT?: ProposalScalarWhereInput | ProposalScalarWhereInput[]
    id?: StringFilter<"Proposal"> | string
    title?: StringFilter<"Proposal"> | string
    description?: StringFilter<"Proposal"> | string
    type?: EnumProposalTypeFilter<"Proposal"> | $Enums.ProposalType
    proposerId?: StringFilter<"Proposal"> | string
    hotelAssetId?: StringNullableFilter<"Proposal"> | string | null
    status?: EnumProposalStatusFilter<"Proposal"> | $Enums.ProposalStatus
    votingStartDate?: DateTimeNullableFilter<"Proposal"> | Date | string | null
    votingEndDate?: DateTimeNullableFilter<"Proposal"> | Date | string | null
    votesFor?: IntFilter<"Proposal"> | number
    votesAgainst?: IntFilter<"Proposal"> | number
    votesAbstain?: IntFilter<"Proposal"> | number
    quorumRequired?: IntFilter<"Proposal"> | number
    approvalThreshold?: IntFilter<"Proposal"> | number
    executionDetails?: StringNullableFilter<"Proposal"> | string | null
    createdAt?: DateTimeFilter<"Proposal"> | Date | string
    updatedAt?: DateTimeFilter<"Proposal"> | Date | string
    createdById?: StringFilter<"Proposal"> | string
  }

  export type ProposalUpsertWithWhereUniqueWithoutProposerInput = {
    where: ProposalWhereUniqueInput
    update: XOR<ProposalUpdateWithoutProposerInput, ProposalUncheckedUpdateWithoutProposerInput>
    create: XOR<ProposalCreateWithoutProposerInput, ProposalUncheckedCreateWithoutProposerInput>
  }

  export type ProposalUpdateWithWhereUniqueWithoutProposerInput = {
    where: ProposalWhereUniqueInput
    data: XOR<ProposalUpdateWithoutProposerInput, ProposalUncheckedUpdateWithoutProposerInput>
  }

  export type ProposalUpdateManyWithWhereWithoutProposerInput = {
    where: ProposalScalarWhereInput
    data: XOR<ProposalUpdateManyMutationInput, ProposalUncheckedUpdateManyWithoutProposerInput>
  }

  export type VoteUpsertWithWhereUniqueWithoutUserInput = {
    where: VoteWhereUniqueInput
    update: XOR<VoteUpdateWithoutUserInput, VoteUncheckedUpdateWithoutUserInput>
    create: XOR<VoteCreateWithoutUserInput, VoteUncheckedCreateWithoutUserInput>
  }

  export type VoteUpdateWithWhereUniqueWithoutUserInput = {
    where: VoteWhereUniqueInput
    data: XOR<VoteUpdateWithoutUserInput, VoteUncheckedUpdateWithoutUserInput>
  }

  export type VoteUpdateManyWithWhereWithoutUserInput = {
    where: VoteScalarWhereInput
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyWithoutUserInput>
  }

  export type VoteScalarWhereInput = {
    AND?: VoteScalarWhereInput | VoteScalarWhereInput[]
    OR?: VoteScalarWhereInput[]
    NOT?: VoteScalarWhereInput | VoteScalarWhereInput[]
    id?: StringFilter<"Vote"> | string
    proposalId?: StringFilter<"Vote"> | string
    userId?: StringFilter<"Vote"> | string
    choice?: EnumVoteChoiceFilter<"Vote"> | $Enums.VoteChoice
    votingPower?: IntFilter<"Vote"> | number
    comment?: StringNullableFilter<"Vote"> | string | null
    createdAt?: DateTimeFilter<"Vote"> | Date | string
  }

  export type UserCreateWithoutKycInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutKycInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutKycInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutKycInput, UserUncheckedCreateWithoutKycInput>
  }

  export type UserCreateWithoutReviewedKycInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReviewedKycInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReviewedKycInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewedKycInput, UserUncheckedCreateWithoutReviewedKycInput>
  }

  export type UserUpsertWithoutKycInput = {
    update: XOR<UserUpdateWithoutKycInput, UserUncheckedUpdateWithoutKycInput>
    create: XOR<UserCreateWithoutKycInput, UserUncheckedCreateWithoutKycInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutKycInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutKycInput, UserUncheckedUpdateWithoutKycInput>
  }

  export type UserUpdateWithoutKycInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutKycInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutReviewedKycInput = {
    update: XOR<UserUpdateWithoutReviewedKycInput, UserUncheckedUpdateWithoutReviewedKycInput>
    create: XOR<UserCreateWithoutReviewedKycInput, UserUncheckedCreateWithoutReviewedKycInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewedKycInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewedKycInput, UserUncheckedUpdateWithoutReviewedKycInput>
  }

  export type UserUpdateWithoutReviewedKycInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewedKycInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCreatedHotelAssetsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedHotelAssetsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedHotelAssetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedHotelAssetsInput, UserUncheckedCreateWithoutCreatedHotelAssetsInput>
  }

  export type BookingCreateWithoutHotelAssetInput = {
    id?: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutHotelAssetInput = {
    id?: string
    userId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingCreateOrConnectWithoutHotelAssetInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutHotelAssetInput, BookingUncheckedCreateWithoutHotelAssetInput>
  }

  export type BookingCreateManyHotelAssetInputEnvelope = {
    data: BookingCreateManyHotelAssetInput | BookingCreateManyHotelAssetInput[]
    skipDuplicates?: boolean
  }

  export type InvestmentCreateWithoutHotelAssetInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutInvestmentsInput
  }

  export type InvestmentUncheckedCreateWithoutHotelAssetInput = {
    id?: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestmentCreateOrConnectWithoutHotelAssetInput = {
    where: InvestmentWhereUniqueInput
    create: XOR<InvestmentCreateWithoutHotelAssetInput, InvestmentUncheckedCreateWithoutHotelAssetInput>
  }

  export type InvestmentCreateManyHotelAssetInputEnvelope = {
    data: InvestmentCreateManyHotelAssetInput | InvestmentCreateManyHotelAssetInput[]
    skipDuplicates?: boolean
  }

  export type ProposalCreateWithoutHotelAssetInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedProposalsInput
    proposer: UserCreateNestedOneWithoutProposedProposalsInput
    votes?: VoteCreateNestedManyWithoutProposalInput
  }

  export type ProposalUncheckedCreateWithoutHotelAssetInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
    votes?: VoteUncheckedCreateNestedManyWithoutProposalInput
  }

  export type ProposalCreateOrConnectWithoutHotelAssetInput = {
    where: ProposalWhereUniqueInput
    create: XOR<ProposalCreateWithoutHotelAssetInput, ProposalUncheckedCreateWithoutHotelAssetInput>
  }

  export type ProposalCreateManyHotelAssetInputEnvelope = {
    data: ProposalCreateManyHotelAssetInput | ProposalCreateManyHotelAssetInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCreatedHotelAssetsInput = {
    update: XOR<UserUpdateWithoutCreatedHotelAssetsInput, UserUncheckedUpdateWithoutCreatedHotelAssetsInput>
    create: XOR<UserCreateWithoutCreatedHotelAssetsInput, UserUncheckedCreateWithoutCreatedHotelAssetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedHotelAssetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedHotelAssetsInput, UserUncheckedUpdateWithoutCreatedHotelAssetsInput>
  }

  export type UserUpdateWithoutCreatedHotelAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedHotelAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BookingUpsertWithWhereUniqueWithoutHotelAssetInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutHotelAssetInput, BookingUncheckedUpdateWithoutHotelAssetInput>
    create: XOR<BookingCreateWithoutHotelAssetInput, BookingUncheckedCreateWithoutHotelAssetInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutHotelAssetInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutHotelAssetInput, BookingUncheckedUpdateWithoutHotelAssetInput>
  }

  export type BookingUpdateManyWithWhereWithoutHotelAssetInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutHotelAssetInput>
  }

  export type InvestmentUpsertWithWhereUniqueWithoutHotelAssetInput = {
    where: InvestmentWhereUniqueInput
    update: XOR<InvestmentUpdateWithoutHotelAssetInput, InvestmentUncheckedUpdateWithoutHotelAssetInput>
    create: XOR<InvestmentCreateWithoutHotelAssetInput, InvestmentUncheckedCreateWithoutHotelAssetInput>
  }

  export type InvestmentUpdateWithWhereUniqueWithoutHotelAssetInput = {
    where: InvestmentWhereUniqueInput
    data: XOR<InvestmentUpdateWithoutHotelAssetInput, InvestmentUncheckedUpdateWithoutHotelAssetInput>
  }

  export type InvestmentUpdateManyWithWhereWithoutHotelAssetInput = {
    where: InvestmentScalarWhereInput
    data: XOR<InvestmentUpdateManyMutationInput, InvestmentUncheckedUpdateManyWithoutHotelAssetInput>
  }

  export type ProposalUpsertWithWhereUniqueWithoutHotelAssetInput = {
    where: ProposalWhereUniqueInput
    update: XOR<ProposalUpdateWithoutHotelAssetInput, ProposalUncheckedUpdateWithoutHotelAssetInput>
    create: XOR<ProposalCreateWithoutHotelAssetInput, ProposalUncheckedCreateWithoutHotelAssetInput>
  }

  export type ProposalUpdateWithWhereUniqueWithoutHotelAssetInput = {
    where: ProposalWhereUniqueInput
    data: XOR<ProposalUpdateWithoutHotelAssetInput, ProposalUncheckedUpdateWithoutHotelAssetInput>
  }

  export type ProposalUpdateManyWithWhereWithoutHotelAssetInput = {
    where: ProposalScalarWhereInput
    data: XOR<ProposalUpdateManyMutationInput, ProposalUncheckedUpdateManyWithoutHotelAssetInput>
  }

  export type UserCreateWithoutInvestmentsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutInvestmentsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutInvestmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInvestmentsInput, UserUncheckedCreateWithoutInvestmentsInput>
  }

  export type HotelAssetCreateWithoutInvestmentsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedHotelAssetsInput
    bookings?: BookingCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetUncheckedCreateWithoutInvestmentsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalUncheckedCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetCreateOrConnectWithoutInvestmentsInput = {
    where: HotelAssetWhereUniqueInput
    create: XOR<HotelAssetCreateWithoutInvestmentsInput, HotelAssetUncheckedCreateWithoutInvestmentsInput>
  }

  export type UserUpsertWithoutInvestmentsInput = {
    update: XOR<UserUpdateWithoutInvestmentsInput, UserUncheckedUpdateWithoutInvestmentsInput>
    create: XOR<UserCreateWithoutInvestmentsInput, UserUncheckedCreateWithoutInvestmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInvestmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInvestmentsInput, UserUncheckedUpdateWithoutInvestmentsInput>
  }

  export type UserUpdateWithoutInvestmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutInvestmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HotelAssetUpsertWithoutInvestmentsInput = {
    update: XOR<HotelAssetUpdateWithoutInvestmentsInput, HotelAssetUncheckedUpdateWithoutInvestmentsInput>
    create: XOR<HotelAssetCreateWithoutInvestmentsInput, HotelAssetUncheckedCreateWithoutInvestmentsInput>
    where?: HotelAssetWhereInput
  }

  export type HotelAssetUpdateToOneWithWhereWithoutInvestmentsInput = {
    where?: HotelAssetWhereInput
    data: XOR<HotelAssetUpdateWithoutInvestmentsInput, HotelAssetUncheckedUpdateWithoutInvestmentsInput>
  }

  export type HotelAssetUpdateWithoutInvestmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedHotelAssetsNestedInput
    bookings?: BookingUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetUncheckedUpdateWithoutInvestmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUncheckedUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedHotelAssetsInput
    investments?: InvestmentCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    investments?: InvestmentUncheckedCreateNestedManyWithoutHotelAssetInput
    proposals?: ProposalUncheckedCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetCreateOrConnectWithoutBookingsInput = {
    where: HotelAssetWhereUniqueInput
    create: XOR<HotelAssetCreateWithoutBookingsInput, HotelAssetUncheckedCreateWithoutBookingsInput>
  }

  export type UserCreateWithoutBookingsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBookingsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBookingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
  }

  export type HotelAssetUpsertWithoutBookingsInput = {
    update: XOR<HotelAssetUpdateWithoutBookingsInput, HotelAssetUncheckedUpdateWithoutBookingsInput>
    create: XOR<HotelAssetCreateWithoutBookingsInput, HotelAssetUncheckedCreateWithoutBookingsInput>
    where?: HotelAssetWhereInput
  }

  export type HotelAssetUpdateToOneWithWhereWithoutBookingsInput = {
    where?: HotelAssetWhereInput
    data: XOR<HotelAssetUpdateWithoutBookingsInput, HotelAssetUncheckedUpdateWithoutBookingsInput>
  }

  export type HotelAssetUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedHotelAssetsNestedInput
    investments?: InvestmentUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    investments?: InvestmentUncheckedUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUncheckedUpdateManyWithoutHotelAssetNestedInput
  }

  export type UserUpsertWithoutBookingsInput = {
    update: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type UserUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCreatedProposalsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedProposalsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedProposalsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedProposalsInput, UserUncheckedCreateWithoutCreatedProposalsInput>
  }

  export type HotelAssetCreateWithoutProposalsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedHotelAssetsInput
    bookings?: BookingCreateNestedManyWithoutHotelAssetInput
    investments?: InvestmentCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetUncheckedCreateWithoutProposalsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutHotelAssetInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutHotelAssetInput
  }

  export type HotelAssetCreateOrConnectWithoutProposalsInput = {
    where: HotelAssetWhereUniqueInput
    create: XOR<HotelAssetCreateWithoutProposalsInput, HotelAssetUncheckedCreateWithoutProposalsInput>
  }

  export type UserCreateWithoutProposedProposalsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    votes?: VoteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProposedProposalsInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    votes?: VoteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProposedProposalsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProposedProposalsInput, UserUncheckedCreateWithoutProposedProposalsInput>
  }

  export type VoteCreateWithoutProposalInput = {
    id?: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutVotesInput
  }

  export type VoteUncheckedCreateWithoutProposalInput = {
    id?: string
    userId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type VoteCreateOrConnectWithoutProposalInput = {
    where: VoteWhereUniqueInput
    create: XOR<VoteCreateWithoutProposalInput, VoteUncheckedCreateWithoutProposalInput>
  }

  export type VoteCreateManyProposalInputEnvelope = {
    data: VoteCreateManyProposalInput | VoteCreateManyProposalInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCreatedProposalsInput = {
    update: XOR<UserUpdateWithoutCreatedProposalsInput, UserUncheckedUpdateWithoutCreatedProposalsInput>
    create: XOR<UserCreateWithoutCreatedProposalsInput, UserUncheckedCreateWithoutCreatedProposalsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedProposalsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedProposalsInput, UserUncheckedUpdateWithoutCreatedProposalsInput>
  }

  export type UserUpdateWithoutCreatedProposalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedProposalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HotelAssetUpsertWithoutProposalsInput = {
    update: XOR<HotelAssetUpdateWithoutProposalsInput, HotelAssetUncheckedUpdateWithoutProposalsInput>
    create: XOR<HotelAssetCreateWithoutProposalsInput, HotelAssetUncheckedCreateWithoutProposalsInput>
    where?: HotelAssetWhereInput
  }

  export type HotelAssetUpdateToOneWithWhereWithoutProposalsInput = {
    where?: HotelAssetWhereInput
    data: XOR<HotelAssetUpdateWithoutProposalsInput, HotelAssetUncheckedUpdateWithoutProposalsInput>
  }

  export type HotelAssetUpdateWithoutProposalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedHotelAssetsNestedInput
    bookings?: BookingUpdateManyWithoutHotelAssetNestedInput
    investments?: InvestmentUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetUncheckedUpdateWithoutProposalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutHotelAssetNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutHotelAssetNestedInput
  }

  export type UserUpsertWithoutProposedProposalsInput = {
    update: XOR<UserUpdateWithoutProposedProposalsInput, UserUncheckedUpdateWithoutProposedProposalsInput>
    create: XOR<UserCreateWithoutProposedProposalsInput, UserUncheckedCreateWithoutProposedProposalsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProposedProposalsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProposedProposalsInput, UserUncheckedUpdateWithoutProposedProposalsInput>
  }

  export type UserUpdateWithoutProposedProposalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    votes?: VoteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProposedProposalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    votes?: VoteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type VoteUpsertWithWhereUniqueWithoutProposalInput = {
    where: VoteWhereUniqueInput
    update: XOR<VoteUpdateWithoutProposalInput, VoteUncheckedUpdateWithoutProposalInput>
    create: XOR<VoteCreateWithoutProposalInput, VoteUncheckedCreateWithoutProposalInput>
  }

  export type VoteUpdateWithWhereUniqueWithoutProposalInput = {
    where: VoteWhereUniqueInput
    data: XOR<VoteUpdateWithoutProposalInput, VoteUncheckedUpdateWithoutProposalInput>
  }

  export type VoteUpdateManyWithWhereWithoutProposalInput = {
    where: VoteScalarWhereInput
    data: XOR<VoteUpdateManyMutationInput, VoteUncheckedUpdateManyWithoutProposalInput>
  }

  export type ProposalCreateWithoutVotesInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedProposalsInput
    hotelAsset?: HotelAssetCreateNestedOneWithoutProposalsInput
    proposer: UserCreateNestedOneWithoutProposedProposalsInput
  }

  export type ProposalUncheckedCreateWithoutVotesInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type ProposalCreateOrConnectWithoutVotesInput = {
    where: ProposalWhereUniqueInput
    create: XOR<ProposalCreateWithoutVotesInput, ProposalUncheckedCreateWithoutVotesInput>
  }

  export type UserCreateWithoutVotesInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentCreateNestedManyWithoutUserInput
    reviewedKyc?: KycCreateNestedManyWithoutReviewerInput
    kyc?: KycCreateNestedOneWithoutUserInput
    createdProposals?: ProposalCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalCreateNestedManyWithoutProposerInput
  }

  export type UserUncheckedCreateWithoutVotesInput = {
    id?: string
    email: string
    password: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role?: $Enums.UserRole
    isEmailVerified?: boolean
    emailVerifiedAt?: Date | string | null
    kycStatus?: $Enums.KycStatus
    kycSubmittedAt?: Date | string | null
    kycApprovedAt?: Date | string | null
    walletAddress?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kycExpiresAt?: Date | string | null
    verificationLevel?: $Enums.VerificationLevel | null
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    createdHotelAssets?: HotelAssetUncheckedCreateNestedManyWithoutCreatedByInput
    investments?: InvestmentUncheckedCreateNestedManyWithoutUserInput
    reviewedKyc?: KycUncheckedCreateNestedManyWithoutReviewerInput
    kyc?: KycUncheckedCreateNestedOneWithoutUserInput
    createdProposals?: ProposalUncheckedCreateNestedManyWithoutCreatedByInput
    proposedProposals?: ProposalUncheckedCreateNestedManyWithoutProposerInput
  }

  export type UserCreateOrConnectWithoutVotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
  }

  export type ProposalUpsertWithoutVotesInput = {
    update: XOR<ProposalUpdateWithoutVotesInput, ProposalUncheckedUpdateWithoutVotesInput>
    create: XOR<ProposalCreateWithoutVotesInput, ProposalUncheckedCreateWithoutVotesInput>
    where?: ProposalWhereInput
  }

  export type ProposalUpdateToOneWithWhereWithoutVotesInput = {
    where?: ProposalWhereInput
    data: XOR<ProposalUpdateWithoutVotesInput, ProposalUncheckedUpdateWithoutVotesInput>
  }

  export type ProposalUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedProposalsNestedInput
    hotelAsset?: HotelAssetUpdateOneWithoutProposalsNestedInput
    proposer?: UserUpdateOneRequiredWithoutProposedProposalsNestedInput
  }

  export type ProposalUncheckedUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutVotesInput = {
    update: XOR<UserUpdateWithoutVotesInput, UserUncheckedUpdateWithoutVotesInput>
    create: XOR<UserCreateWithoutVotesInput, UserUncheckedCreateWithoutVotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVotesInput, UserUncheckedUpdateWithoutVotesInput>
  }

  export type UserUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUpdateManyWithoutReviewerNestedInput
    kyc?: KycUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUpdateManyWithoutProposerNestedInput
  }

  export type UserUncheckedUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycStatus?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    kycSubmittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kycApprovedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationLevel?: NullableEnumVerificationLevelFieldUpdateOperationsInput | $Enums.VerificationLevel | null
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    createdHotelAssets?: HotelAssetUncheckedUpdateManyWithoutCreatedByNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutUserNestedInput
    reviewedKyc?: KycUncheckedUpdateManyWithoutReviewerNestedInput
    kyc?: KycUncheckedUpdateOneWithoutUserNestedInput
    createdProposals?: ProposalUncheckedUpdateManyWithoutCreatedByNestedInput
    proposedProposals?: ProposalUncheckedUpdateManyWithoutProposerNestedInput
  }

  export type BookingCreateManyUserInput = {
    id?: string
    hotelAssetId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HotelAssetCreateManyCreatedByInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.AssetStatus
    location: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestmentCreateManyUserInput = {
    id?: string
    hotelAssetId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KycCreateManyReviewerInput = {
    id?: string
    userId: string
    fullName: string
    dateOfBirth: Date | string
    nationality: string
    address: string
    documentType: string
    documentNumber: string
    documentFront?: string | null
    documentBack?: string | null
    selfieImage?: string | null
    addressProof?: string | null
    status?: $Enums.KycStatus
    city: string
    state: string
    postalCode: string
    country: string
    documentHash?: string | null
    expiresAt?: Date | string | null
    approvedAt?: Date | string | null
    blockchainTx?: string | null
    blockchainVerifier?: string | null
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProposalCreateManyCreatedByInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProposalCreateManyProposerInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    hotelAssetId?: string | null
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type VoteCreateManyUserInput = {
    id?: string
    proposalId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type BookingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotelAsset?: HotelAssetUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotelAssetUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUpdateManyWithoutHotelAssetNestedInput
    investments?: InvestmentUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutHotelAssetNestedInput
    investments?: InvestmentUncheckedUpdateManyWithoutHotelAssetNestedInput
    proposals?: ProposalUncheckedUpdateManyWithoutHotelAssetNestedInput
  }

  export type HotelAssetUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumAssetStatusFieldUpdateOperationsInput | $Enums.AssetStatus
    location?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotelAsset?: HotelAssetUpdateOneRequiredWithoutInvestmentsNestedInput
  }

  export type InvestmentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KycUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutKycNestedInput
  }

  export type KycUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KycUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    nationality?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    documentFront?: NullableStringFieldUpdateOperationsInput | string | null
    documentBack?: NullableStringFieldUpdateOperationsInput | string | null
    selfieImage?: NullableStringFieldUpdateOperationsInput | string | null
    addressProof?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumKycStatusFieldUpdateOperationsInput | $Enums.KycStatus
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    documentHash?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blockchainTx?: NullableStringFieldUpdateOperationsInput | string | null
    blockchainVerifier?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProposalUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotelAsset?: HotelAssetUpdateOneWithoutProposalsNestedInput
    proposer?: UserUpdateOneRequiredWithoutProposedProposalsNestedInput
    votes?: VoteUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: VoteUncheckedUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProposalUpdateWithoutProposerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedProposalsNestedInput
    hotelAsset?: HotelAssetUpdateOneWithoutProposalsNestedInput
    votes?: VoteUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateWithoutProposerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
    votes?: VoteUncheckedUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateManyWithoutProposerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    hotelAssetId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type VoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proposal?: ProposalUpdateOneRequiredWithoutVotesNestedInput
  }

  export type VoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposalId?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposalId?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateManyHotelAssetInput = {
    id?: string
    userId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    guests: number
    roomType: string
    totalPrice: Decimal | DecimalJsLike | number | string
    status?: $Enums.BookingStatus
    specialRequests?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestmentCreateManyHotelAssetInput = {
    id?: string
    userId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionHash?: string | null
    status?: $Enums.InvestmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProposalCreateManyHotelAssetInput = {
    id?: string
    title: string
    description: string
    type: $Enums.ProposalType
    proposerId: string
    status?: $Enums.ProposalStatus
    votingStartDate?: Date | string | null
    votingEndDate?: Date | string | null
    votesFor?: number
    votesAgainst?: number
    votesAbstain?: number
    quorumRequired: number
    approvalThreshold: number
    executionDetails?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type BookingUpdateWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    roomType?: StringFieldUpdateOperationsInput | string
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentUpdateWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInvestmentsNestedInput
  }

  export type InvestmentUncheckedUpdateWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestmentUncheckedUpdateManyWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInvestmentStatusFieldUpdateOperationsInput | $Enums.InvestmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProposalUpdateWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedProposalsNestedInput
    proposer?: UserUpdateOneRequiredWithoutProposedProposalsNestedInput
    votes?: VoteUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
    votes?: VoteUncheckedUpdateManyWithoutProposalNestedInput
  }

  export type ProposalUncheckedUpdateManyWithoutHotelAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumProposalTypeFieldUpdateOperationsInput | $Enums.ProposalType
    proposerId?: StringFieldUpdateOperationsInput | string
    status?: EnumProposalStatusFieldUpdateOperationsInput | $Enums.ProposalStatus
    votingStartDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votingEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votesFor?: IntFieldUpdateOperationsInput | number
    votesAgainst?: IntFieldUpdateOperationsInput | number
    votesAbstain?: IntFieldUpdateOperationsInput | number
    quorumRequired?: IntFieldUpdateOperationsInput | number
    approvalThreshold?: IntFieldUpdateOperationsInput | number
    executionDetails?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type VoteCreateManyProposalInput = {
    id?: string
    userId: string
    choice: $Enums.VoteChoice
    votingPower: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type VoteUpdateWithoutProposalInput = {
    id?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVotesNestedInput
  }

  export type VoteUncheckedUpdateWithoutProposalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VoteUncheckedUpdateManyWithoutProposalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    choice?: EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice
    votingPower?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}