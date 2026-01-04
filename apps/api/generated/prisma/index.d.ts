
/**
 * Client
**/

import * as runtime from './runtime/library.js';
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
 * Model Token
 * 
 */
export type Token = $Result.DefaultSelection<Prisma.$TokenPayload>
/**
 * Model Chat
 * 
 */
export type Chat = $Result.DefaultSelection<Prisma.$ChatPayload>
/**
 * Model ChatMember
 * 
 */
export type ChatMember = $Result.DefaultSelection<Prisma.$ChatMemberPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model MessageReadStatus
 * 
 */
export type MessageReadStatus = $Result.DefaultSelection<Prisma.$MessageReadStatusPayload>
/**
 * Model Call
 * 
 */
export type Call = $Result.DefaultSelection<Prisma.$CallPayload>
/**
 * Model Follow
 * 
 */
export type Follow = $Result.DefaultSelection<Prisma.$FollowPayload>
/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model PostLike
 * 
 */
export type PostLike = $Result.DefaultSelection<Prisma.$PostLikePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const user_roles: {
  owner: 'owner',
  admin: 'admin',
  user: 'user'
};

export type user_roles = (typeof user_roles)[keyof typeof user_roles]


export const ChatType: {
  PRIVATE: 'PRIVATE',
  GROUP: 'GROUP',
  SECRET: 'SECRET'
};

export type ChatType = (typeof ChatType)[keyof typeof ChatType]


export const ChatMemberRole: {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

export type ChatMemberRole = (typeof ChatMemberRole)[keyof typeof ChatMemberRole]


export const MessageType: {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  FILE: 'FILE',
  SYSTEM: 'SYSTEM'
};

export type MessageType = (typeof MessageType)[keyof typeof MessageType]


export const CallType: {
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO'
};

export type CallType = (typeof CallType)[keyof typeof CallType]


export const CallStatus: {
  INITIATED: 'INITIATED',
  RINGING: 'RINGING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  MISSED: 'MISSED',
  ENDED: 'ENDED'
};

export type CallStatus = (typeof CallStatus)[keyof typeof CallStatus]

}

export type user_roles = $Enums.user_roles

export const user_roles: typeof $Enums.user_roles

export type ChatType = $Enums.ChatType

export const ChatType: typeof $Enums.ChatType

export type ChatMemberRole = $Enums.ChatMemberRole

export const ChatMemberRole: typeof $Enums.ChatMemberRole

export type MessageType = $Enums.MessageType

export const MessageType: typeof $Enums.MessageType

export type CallType = $Enums.CallType

export const CallType: typeof $Enums.CallType

export type CallStatus = $Enums.CallStatus

export const CallStatus: typeof $Enums.CallStatus

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
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * `prisma.token`: Exposes CRUD operations for the **Token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tokens
    * const tokens = await prisma.token.findMany()
    * ```
    */
  get token(): Prisma.TokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chat`: Exposes CRUD operations for the **Chat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chats
    * const chats = await prisma.chat.findMany()
    * ```
    */
  get chat(): Prisma.ChatDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMember`: Exposes CRUD operations for the **ChatMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMembers
    * const chatMembers = await prisma.chatMember.findMany()
    * ```
    */
  get chatMember(): Prisma.ChatMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.messageReadStatus`: Exposes CRUD operations for the **MessageReadStatus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MessageReadStatuses
    * const messageReadStatuses = await prisma.messageReadStatus.findMany()
    * ```
    */
  get messageReadStatus(): Prisma.MessageReadStatusDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.call`: Exposes CRUD operations for the **Call** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Calls
    * const calls = await prisma.call.findMany()
    * ```
    */
  get call(): Prisma.CallDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.follow`: Exposes CRUD operations for the **Follow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Follows
    * const follows = await prisma.follow.findMany()
    * ```
    */
  get follow(): Prisma.FollowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.postLike`: Exposes CRUD operations for the **PostLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PostLikes
    * const postLikes = await prisma.postLike.findMany()
    * ```
    */
  get postLike(): Prisma.PostLikeDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
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
    Token: 'Token',
    Chat: 'Chat',
    ChatMember: 'ChatMember',
    Message: 'Message',
    MessageReadStatus: 'MessageReadStatus',
    Call: 'Call',
    Follow: 'Follow',
    Profile: 'Profile',
    Post: 'Post',
    PostLike: 'PostLike'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "token" | "chat" | "chatMember" | "message" | "messageReadStatus" | "call" | "follow" | "profile" | "post" | "postLike"
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
      Token: {
        payload: Prisma.$TokenPayload<ExtArgs>
        fields: Prisma.TokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findFirst: {
            args: Prisma.TokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findMany: {
            args: Prisma.TokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          create: {
            args: Prisma.TokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          createMany: {
            args: Prisma.TokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          update: {
            args: Prisma.TokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          deleteMany: {
            args: Prisma.TokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          aggregate: {
            args: Prisma.TokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToken>
          }
          groupBy: {
            args: Prisma.TokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenCountArgs<ExtArgs>
            result: $Utils.Optional<TokenCountAggregateOutputType> | number
          }
        }
      }
      Chat: {
        payload: Prisma.$ChatPayload<ExtArgs>
        fields: Prisma.ChatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>
          }
          findFirst: {
            args: Prisma.ChatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>
          }
          findMany: {
            args: Prisma.ChatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>[]
          }
          create: {
            args: Prisma.ChatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>
          }
          createMany: {
            args: Prisma.ChatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ChatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>
          }
          update: {
            args: Prisma.ChatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>
          }
          deleteMany: {
            args: Prisma.ChatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>
          }
          aggregate: {
            args: Prisma.ChatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChat>
          }
          groupBy: {
            args: Prisma.ChatGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatCountArgs<ExtArgs>
            result: $Utils.Optional<ChatCountAggregateOutputType> | number
          }
        }
      }
      ChatMember: {
        payload: Prisma.$ChatMemberPayload<ExtArgs>
        fields: Prisma.ChatMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>
          }
          findFirst: {
            args: Prisma.ChatMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>
          }
          findMany: {
            args: Prisma.ChatMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>[]
          }
          create: {
            args: Prisma.ChatMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>
          }
          createMany: {
            args: Prisma.ChatMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ChatMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>
          }
          update: {
            args: Prisma.ChatMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>
          }
          deleteMany: {
            args: Prisma.ChatMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMemberPayload>
          }
          aggregate: {
            args: Prisma.ChatMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMember>
          }
          groupBy: {
            args: Prisma.ChatMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMemberCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMemberCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      MessageReadStatus: {
        payload: Prisma.$MessageReadStatusPayload<ExtArgs>
        fields: Prisma.MessageReadStatusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageReadStatusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageReadStatusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          findFirst: {
            args: Prisma.MessageReadStatusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageReadStatusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          findMany: {
            args: Prisma.MessageReadStatusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>[]
          }
          create: {
            args: Prisma.MessageReadStatusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          createMany: {
            args: Prisma.MessageReadStatusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MessageReadStatusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          update: {
            args: Prisma.MessageReadStatusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          deleteMany: {
            args: Prisma.MessageReadStatusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageReadStatusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageReadStatusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          aggregate: {
            args: Prisma.MessageReadStatusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessageReadStatus>
          }
          groupBy: {
            args: Prisma.MessageReadStatusGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageReadStatusGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageReadStatusCountArgs<ExtArgs>
            result: $Utils.Optional<MessageReadStatusCountAggregateOutputType> | number
          }
        }
      }
      Call: {
        payload: Prisma.$CallPayload<ExtArgs>
        fields: Prisma.CallFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CallFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CallFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          findFirst: {
            args: Prisma.CallFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CallFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          findMany: {
            args: Prisma.CallFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          create: {
            args: Prisma.CallCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          createMany: {
            args: Prisma.CallCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CallDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          update: {
            args: Prisma.CallUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          deleteMany: {
            args: Prisma.CallDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CallUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CallUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          aggregate: {
            args: Prisma.CallAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCall>
          }
          groupBy: {
            args: Prisma.CallGroupByArgs<ExtArgs>
            result: $Utils.Optional<CallGroupByOutputType>[]
          }
          count: {
            args: Prisma.CallCountArgs<ExtArgs>
            result: $Utils.Optional<CallCountAggregateOutputType> | number
          }
        }
      }
      Follow: {
        payload: Prisma.$FollowPayload<ExtArgs>
        fields: Prisma.FollowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FollowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FollowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>
          }
          findFirst: {
            args: Prisma.FollowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FollowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>
          }
          findMany: {
            args: Prisma.FollowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>[]
          }
          create: {
            args: Prisma.FollowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>
          }
          createMany: {
            args: Prisma.FollowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FollowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>
          }
          update: {
            args: Prisma.FollowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>
          }
          deleteMany: {
            args: Prisma.FollowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FollowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FollowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>
          }
          aggregate: {
            args: Prisma.FollowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFollow>
          }
          groupBy: {
            args: Prisma.FollowGroupByArgs<ExtArgs>
            result: $Utils.Optional<FollowGroupByOutputType>[]
          }
          count: {
            args: Prisma.FollowCountArgs<ExtArgs>
            result: $Utils.Optional<FollowCountAggregateOutputType> | number
          }
        }
      }
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      PostLike: {
        payload: Prisma.$PostLikePayload<ExtArgs>
        fields: Prisma.PostLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          findFirst: {
            args: Prisma.PostLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          findMany: {
            args: Prisma.PostLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>[]
          }
          create: {
            args: Prisma.PostLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          createMany: {
            args: Prisma.PostLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PostLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          update: {
            args: Prisma.PostLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          deleteMany: {
            args: Prisma.PostLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PostLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          aggregate: {
            args: Prisma.PostLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePostLike>
          }
          groupBy: {
            args: Prisma.PostLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostLikeCountArgs<ExtArgs>
            result: $Utils.Optional<PostLikeCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    token?: TokenOmit
    chat?: ChatOmit
    chatMember?: ChatMemberOmit
    message?: MessageOmit
    messageReadStatus?: MessageReadStatusOmit
    call?: CallOmit
    follow?: FollowOmit
    profile?: ProfileOmit
    post?: PostOmit
    postLike?: PostLikeOmit
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
    tokens: number
    createdChats: number
    chatMembers: number
    messages: number
    sentCalls: number
    receivedCalls: number
    messageReads: number
    chats: number
    followers: number
    following: number
    posts: number
    authoredPosts: number
    postLikes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tokens?: boolean | UserCountOutputTypeCountTokensArgs
    createdChats?: boolean | UserCountOutputTypeCountCreatedChatsArgs
    chatMembers?: boolean | UserCountOutputTypeCountChatMembersArgs
    messages?: boolean | UserCountOutputTypeCountMessagesArgs
    sentCalls?: boolean | UserCountOutputTypeCountSentCallsArgs
    receivedCalls?: boolean | UserCountOutputTypeCountReceivedCallsArgs
    messageReads?: boolean | UserCountOutputTypeCountMessageReadsArgs
    chats?: boolean | UserCountOutputTypeCountChatsArgs
    followers?: boolean | UserCountOutputTypeCountFollowersArgs
    following?: boolean | UserCountOutputTypeCountFollowingArgs
    posts?: boolean | UserCountOutputTypeCountPostsArgs
    authoredPosts?: boolean | UserCountOutputTypeCountAuthoredPostsArgs
    postLikes?: boolean | UserCountOutputTypeCountPostLikesArgs
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
  export type UserCountOutputTypeCountTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedChatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessageReadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageReadStatusWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFollowersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFollowingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuthoredPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostLikeWhereInput
  }


  /**
   * Count Type ChatCountOutputType
   */

  export type ChatCountOutputType = {
    members: number
    messages: number
    calls: number
  }

  export type ChatCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | ChatCountOutputTypeCountMembersArgs
    messages?: boolean | ChatCountOutputTypeCountMessagesArgs
    calls?: boolean | ChatCountOutputTypeCountCallsArgs
  }

  // Custom InputTypes
  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatCountOutputType
     */
    select?: ChatCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMemberWhereInput
  }

  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeCountCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
  }


  /**
   * Count Type MessageCountOutputType
   */

  export type MessageCountOutputType = {
    replies: number
    readStatus: number
  }

  export type MessageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | MessageCountOutputTypeCountRepliesArgs
    readStatus?: boolean | MessageCountOutputTypeCountReadStatusArgs
  }

  // Custom InputTypes
  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageCountOutputType
     */
    select?: MessageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountReadStatusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageReadStatusWhereInput
  }


  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    reposts: number
    likes: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reposts?: boolean | PostCountOutputTypeCountRepostsArgs
    likes?: boolean | PostCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountRepostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostLikeWhereInput
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
    name: string | null
    email: string | null
    isAcivated: boolean | null
    activationLink: string | null
    role: $Enums.user_roles | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    isAcivated: boolean | null
    activationLink: string | null
    role: $Enums.user_roles | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    isAcivated: number
    activationLink: number
    role: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    isAcivated?: true
    activationLink?: true
    role?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    isAcivated?: true
    activationLink?: true
    role?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    isAcivated?: true
    activationLink?: true
    role?: true
    password?: true
    createdAt?: true
    updatedAt?: true
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
    name: string
    email: string
    isAcivated: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt: Date | null
    updatedAt: Date | null
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
    name?: boolean
    email?: boolean
    isAcivated?: boolean
    activationLink?: boolean
    role?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tokens?: boolean | User$tokensArgs<ExtArgs>
    createdChats?: boolean | User$createdChatsArgs<ExtArgs>
    chatMembers?: boolean | User$chatMembersArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    sentCalls?: boolean | User$sentCallsArgs<ExtArgs>
    receivedCalls?: boolean | User$receivedCallsArgs<ExtArgs>
    messageReads?: boolean | User$messageReadsArgs<ExtArgs>
    chats?: boolean | User$chatsArgs<ExtArgs>
    followers?: boolean | User$followersArgs<ExtArgs>
    following?: boolean | User$followingArgs<ExtArgs>
    profile?: boolean | User$profileArgs<ExtArgs>
    posts?: boolean | User$postsArgs<ExtArgs>
    authoredPosts?: boolean | User$authoredPostsArgs<ExtArgs>
    postLikes?: boolean | User$postLikesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    isAcivated?: boolean
    activationLink?: boolean
    role?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "isAcivated" | "activationLink" | "role" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tokens?: boolean | User$tokensArgs<ExtArgs>
    createdChats?: boolean | User$createdChatsArgs<ExtArgs>
    chatMembers?: boolean | User$chatMembersArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    sentCalls?: boolean | User$sentCallsArgs<ExtArgs>
    receivedCalls?: boolean | User$receivedCallsArgs<ExtArgs>
    messageReads?: boolean | User$messageReadsArgs<ExtArgs>
    chats?: boolean | User$chatsArgs<ExtArgs>
    followers?: boolean | User$followersArgs<ExtArgs>
    following?: boolean | User$followingArgs<ExtArgs>
    profile?: boolean | User$profileArgs<ExtArgs>
    posts?: boolean | User$postsArgs<ExtArgs>
    authoredPosts?: boolean | User$authoredPostsArgs<ExtArgs>
    postLikes?: boolean | User$postLikesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tokens: Prisma.$TokenPayload<ExtArgs>[]
      createdChats: Prisma.$ChatPayload<ExtArgs>[]
      chatMembers: Prisma.$ChatMemberPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      sentCalls: Prisma.$CallPayload<ExtArgs>[]
      receivedCalls: Prisma.$CallPayload<ExtArgs>[]
      messageReads: Prisma.$MessageReadStatusPayload<ExtArgs>[]
      chats: Prisma.$ChatPayload<ExtArgs>[]
      followers: Prisma.$FollowPayload<ExtArgs>[]
      following: Prisma.$FollowPayload<ExtArgs>[]
      profile: Prisma.$ProfilePayload<ExtArgs> | null
      posts: Prisma.$PostPayload<ExtArgs>[]
      authoredPosts: Prisma.$PostPayload<ExtArgs>[]
      postLikes: Prisma.$PostLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      isAcivated: boolean
      activationLink: string
      role: $Enums.user_roles
      password: string
      createdAt: Date | null
      updatedAt: Date | null
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
    tokens<T extends User$tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdChats<T extends User$createdChatsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdChatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatMembers<T extends User$chatMembersArgs<ExtArgs> = {}>(args?: Subset<T, User$chatMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends User$messagesArgs<ExtArgs> = {}>(args?: Subset<T, User$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sentCalls<T extends User$sentCallsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentCallsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedCalls<T extends User$receivedCallsArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedCallsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messageReads<T extends User$messageReadsArgs<ExtArgs> = {}>(args?: Subset<T, User$messageReadsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chats<T extends User$chatsArgs<ExtArgs> = {}>(args?: Subset<T, User$chatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    followers<T extends User$followersArgs<ExtArgs> = {}>(args?: Subset<T, User$followersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    following<T extends User$followingArgs<ExtArgs> = {}>(args?: Subset<T, User$followingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profile<T extends User$profileArgs<ExtArgs> = {}>(args?: Subset<T, User$profileArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    posts<T extends User$postsArgs<ExtArgs> = {}>(args?: Subset<T, User$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    authoredPosts<T extends User$authoredPostsArgs<ExtArgs> = {}>(args?: Subset<T, User$authoredPostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    postLikes<T extends User$postLikesArgs<ExtArgs> = {}>(args?: Subset<T, User$postLikesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly isAcivated: FieldRef<"User", 'Boolean'>
    readonly activationLink: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'user_roles'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
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
   * User.tokens
   */
  export type User$tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    cursor?: TokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * User.createdChats
   */
  export type User$createdChatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    where?: ChatWhereInput
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[]
    cursor?: ChatWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[]
  }

  /**
   * User.chatMembers
   */
  export type User$chatMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    where?: ChatMemberWhereInput
    orderBy?: ChatMemberOrderByWithRelationInput | ChatMemberOrderByWithRelationInput[]
    cursor?: ChatMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMemberScalarFieldEnum | ChatMemberScalarFieldEnum[]
  }

  /**
   * User.messages
   */
  export type User$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.sentCalls
   */
  export type User$sentCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    where?: CallWhereInput
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    cursor?: CallWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * User.receivedCalls
   */
  export type User$receivedCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    where?: CallWhereInput
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    cursor?: CallWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * User.messageReads
   */
  export type User$messageReadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    where?: MessageReadStatusWhereInput
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    cursor?: MessageReadStatusWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * User.chats
   */
  export type User$chatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    where?: ChatWhereInput
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[]
    cursor?: ChatWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[]
  }

  /**
   * User.followers
   */
  export type User$followersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    where?: FollowWhereInput
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[]
    cursor?: FollowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[]
  }

  /**
   * User.following
   */
  export type User$followingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    where?: FollowWhereInput
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[]
    cursor?: FollowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[]
  }

  /**
   * User.profile
   */
  export type User$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * User.posts
   */
  export type User$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * User.authoredPosts
   */
  export type User$authoredPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * User.postLikes
   */
  export type User$postLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    where?: PostLikeWhereInput
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    cursor?: PostLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
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
   * Model Token
   */

  export type AggregateToken = {
    _count: TokenCountAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  export type TokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenCountAggregateOutputType = {
    id: number
    userId: number
    refreshToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TokenMinAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenMaxAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenCountAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Token to aggregate.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tokens
    **/
    _count?: true | TokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenMaxAggregateInputType
  }

  export type GetTokenAggregateType<T extends TokenAggregateArgs> = {
        [P in keyof T & keyof AggregateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToken[P]>
      : GetScalarType<T[P], AggregateToken[P]>
  }




  export type TokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithAggregationInput | TokenOrderByWithAggregationInput[]
    by: TokenScalarFieldEnum[] | TokenScalarFieldEnum
    having?: TokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenCountAggregateInputType | true
    _min?: TokenMinAggregateInputType
    _max?: TokenMaxAggregateInputType
  }

  export type TokenGroupByOutputType = {
    id: string
    userId: string
    refreshToken: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: TokenCountAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  type GetTokenGroupByPayload<T extends TokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenGroupByOutputType[P]>
            : GetScalarType<T[P], TokenGroupByOutputType[P]>
        }
      >
    >


  export type TokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>



  export type TokenSelectScalar = {
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refreshToken" | "createdAt" | "updatedAt", ExtArgs["result"]["token"]>
  export type TokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Token"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      refreshToken: string
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["token"]>
    composites: {}
  }

  type TokenGetPayload<S extends boolean | null | undefined | TokenDefaultArgs> = $Result.GetResult<Prisma.$TokenPayload, S>

  type TokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenCountAggregateInputType | true
    }

  export interface TokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Token'], meta: { name: 'Token' } }
    /**
     * Find zero or one Token that matches the filter.
     * @param {TokenFindUniqueArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenFindUniqueArgs>(args: SelectSubset<T, TokenFindUniqueArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenFindUniqueOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenFindFirstArgs>(args?: SelectSubset<T, TokenFindFirstArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tokens
     * const tokens = await prisma.token.findMany()
     * 
     * // Get first 10 Tokens
     * const tokens = await prisma.token.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenWithIdOnly = await prisma.token.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenFindManyArgs>(args?: SelectSubset<T, TokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Token.
     * @param {TokenCreateArgs} args - Arguments to create a Token.
     * @example
     * // Create one Token
     * const Token = await prisma.token.create({
     *   data: {
     *     // ... data to create a Token
     *   }
     * })
     * 
     */
    create<T extends TokenCreateArgs>(args: SelectSubset<T, TokenCreateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tokens.
     * @param {TokenCreateManyArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenCreateManyArgs>(args?: SelectSubset<T, TokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Token.
     * @param {TokenDeleteArgs} args - Arguments to delete one Token.
     * @example
     * // Delete one Token
     * const Token = await prisma.token.delete({
     *   where: {
     *     // ... filter to delete one Token
     *   }
     * })
     * 
     */
    delete<T extends TokenDeleteArgs>(args: SelectSubset<T, TokenDeleteArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Token.
     * @param {TokenUpdateArgs} args - Arguments to update one Token.
     * @example
     * // Update one Token
     * const token = await prisma.token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenUpdateArgs>(args: SelectSubset<T, TokenUpdateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tokens.
     * @param {TokenDeleteManyArgs} args - Arguments to filter Tokens to delete.
     * @example
     * // Delete a few Tokens
     * const { count } = await prisma.token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenDeleteManyArgs>(args?: SelectSubset<T, TokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenUpdateManyArgs>(args: SelectSubset<T, TokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Token.
     * @param {TokenUpsertArgs} args - Arguments to update or create a Token.
     * @example
     * // Update or create a Token
     * const token = await prisma.token.upsert({
     *   create: {
     *     // ... data to create a Token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Token we want to update
     *   }
     * })
     */
    upsert<T extends TokenUpsertArgs>(args: SelectSubset<T, TokenUpsertArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenCountArgs} args - Arguments to filter Tokens to count.
     * @example
     * // Count the number of Tokens
     * const count = await prisma.token.count({
     *   where: {
     *     // ... the filter for the Tokens we want to count
     *   }
     * })
    **/
    count<T extends TokenCountArgs>(
      args?: Subset<T, TokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TokenAggregateArgs>(args: Subset<T, TokenAggregateArgs>): Prisma.PrismaPromise<GetTokenAggregateType<T>>

    /**
     * Group by Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenGroupByArgs} args - Group by arguments.
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
      T extends TokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenGroupByArgs['orderBy'] }
        : { orderBy?: TokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Token model
   */
  readonly fields: TokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Token model
   */
  interface TokenFieldRefs {
    readonly id: FieldRef<"Token", 'String'>
    readonly userId: FieldRef<"Token", 'String'>
    readonly refreshToken: FieldRef<"Token", 'String'>
    readonly createdAt: FieldRef<"Token", 'DateTime'>
    readonly updatedAt: FieldRef<"Token", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Token findUnique
   */
  export type TokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findUniqueOrThrow
   */
  export type TokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findFirst
   */
  export type TokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findFirstOrThrow
   */
  export type TokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findMany
   */
  export type TokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Tokens to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token create
   */
  export type TokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to create a Token.
     */
    data: XOR<TokenCreateInput, TokenUncheckedCreateInput>
  }

  /**
   * Token createMany
   */
  export type TokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Token update
   */
  export type TokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to update a Token.
     */
    data: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
    /**
     * Choose, which Token to update.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token updateMany
   */
  export type TokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
  }

  /**
   * Token upsert
   */
  export type TokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The filter to search for the Token to update in case it exists.
     */
    where: TokenWhereUniqueInput
    /**
     * In case the Token found by the `where` argument doesn't exist, create a new Token with this data.
     */
    create: XOR<TokenCreateInput, TokenUncheckedCreateInput>
    /**
     * In case the Token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
  }

  /**
   * Token delete
   */
  export type TokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter which Token to delete.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token deleteMany
   */
  export type TokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tokens to delete
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to delete.
     */
    limit?: number
  }

  /**
   * Token without action
   */
  export type TokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
  }


  /**
   * Model Chat
   */

  export type AggregateChat = {
    _count: ChatCountAggregateOutputType | null
    _min: ChatMinAggregateOutputType | null
    _max: ChatMaxAggregateOutputType | null
  }

  export type ChatMinAggregateOutputType = {
    id: string | null
    type: $Enums.ChatType | null
    name: string | null
    description: string | null
    avatar: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ChatMaxAggregateOutputType = {
    id: string | null
    type: $Enums.ChatType | null
    name: string | null
    description: string | null
    avatar: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ChatCountAggregateOutputType = {
    id: number
    type: number
    name: number
    description: number
    avatar: number
    createdBy: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type ChatMinAggregateInputType = {
    id?: true
    type?: true
    name?: true
    description?: true
    avatar?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ChatMaxAggregateInputType = {
    id?: true
    type?: true
    name?: true
    description?: true
    avatar?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ChatCountAggregateInputType = {
    id?: true
    type?: true
    name?: true
    description?: true
    avatar?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type ChatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chat to aggregate.
     */
    where?: ChatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Chats
    **/
    _count?: true | ChatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMaxAggregateInputType
  }

  export type GetChatAggregateType<T extends ChatAggregateArgs> = {
        [P in keyof T & keyof AggregateChat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChat[P]>
      : GetScalarType<T[P], AggregateChat[P]>
  }




  export type ChatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatWhereInput
    orderBy?: ChatOrderByWithAggregationInput | ChatOrderByWithAggregationInput[]
    by: ChatScalarFieldEnum[] | ChatScalarFieldEnum
    having?: ChatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatCountAggregateInputType | true
    _min?: ChatMinAggregateInputType
    _max?: ChatMaxAggregateInputType
  }

  export type ChatGroupByOutputType = {
    id: string
    type: $Enums.ChatType
    name: string | null
    description: string | null
    avatar: string | null
    createdBy: string
    createdAt: Date
    updatedAt: Date
    userId: string | null
    _count: ChatCountAggregateOutputType | null
    _min: ChatMinAggregateOutputType | null
    _max: ChatMaxAggregateOutputType | null
  }

  type GetChatGroupByPayload<T extends ChatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatGroupByOutputType[P]>
            : GetScalarType<T[P], ChatGroupByOutputType[P]>
        }
      >
    >


  export type ChatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    avatar?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    members?: boolean | Chat$membersArgs<ExtArgs>
    messages?: boolean | Chat$messagesArgs<ExtArgs>
    calls?: boolean | Chat$callsArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
    user?: boolean | Chat$userArgs<ExtArgs>
    _count?: boolean | ChatCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chat"]>



  export type ChatSelectScalar = {
    id?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    avatar?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type ChatOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "name" | "description" | "avatar" | "createdBy" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["chat"]>
  export type ChatInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Chat$membersArgs<ExtArgs>
    messages?: boolean | Chat$messagesArgs<ExtArgs>
    calls?: boolean | Chat$callsArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
    user?: boolean | Chat$userArgs<ExtArgs>
    _count?: boolean | ChatCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ChatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Chat"
    objects: {
      members: Prisma.$ChatMemberPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      calls: Prisma.$CallPayload<ExtArgs>[]
      creator: Prisma.$UserPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.ChatType
      name: string | null
      description: string | null
      avatar: string | null
      createdBy: string
      createdAt: Date
      updatedAt: Date
      userId: string | null
    }, ExtArgs["result"]["chat"]>
    composites: {}
  }

  type ChatGetPayload<S extends boolean | null | undefined | ChatDefaultArgs> = $Result.GetResult<Prisma.$ChatPayload, S>

  type ChatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatCountAggregateInputType | true
    }

  export interface ChatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Chat'], meta: { name: 'Chat' } }
    /**
     * Find zero or one Chat that matches the filter.
     * @param {ChatFindUniqueArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatFindUniqueArgs>(args: SelectSubset<T, ChatFindUniqueArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Chat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatFindUniqueOrThrowArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFindFirstArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatFindFirstArgs>(args?: SelectSubset<T, ChatFindFirstArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFindFirstOrThrowArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chats
     * const chats = await prisma.chat.findMany()
     * 
     * // Get first 10 Chats
     * const chats = await prisma.chat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatWithIdOnly = await prisma.chat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatFindManyArgs>(args?: SelectSubset<T, ChatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Chat.
     * @param {ChatCreateArgs} args - Arguments to create a Chat.
     * @example
     * // Create one Chat
     * const Chat = await prisma.chat.create({
     *   data: {
     *     // ... data to create a Chat
     *   }
     * })
     * 
     */
    create<T extends ChatCreateArgs>(args: SelectSubset<T, ChatCreateArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Chats.
     * @param {ChatCreateManyArgs} args - Arguments to create many Chats.
     * @example
     * // Create many Chats
     * const chat = await prisma.chat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatCreateManyArgs>(args?: SelectSubset<T, ChatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Chat.
     * @param {ChatDeleteArgs} args - Arguments to delete one Chat.
     * @example
     * // Delete one Chat
     * const Chat = await prisma.chat.delete({
     *   where: {
     *     // ... filter to delete one Chat
     *   }
     * })
     * 
     */
    delete<T extends ChatDeleteArgs>(args: SelectSubset<T, ChatDeleteArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Chat.
     * @param {ChatUpdateArgs} args - Arguments to update one Chat.
     * @example
     * // Update one Chat
     * const chat = await prisma.chat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatUpdateArgs>(args: SelectSubset<T, ChatUpdateArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Chats.
     * @param {ChatDeleteManyArgs} args - Arguments to filter Chats to delete.
     * @example
     * // Delete a few Chats
     * const { count } = await prisma.chat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatDeleteManyArgs>(args?: SelectSubset<T, ChatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chats
     * const chat = await prisma.chat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatUpdateManyArgs>(args: SelectSubset<T, ChatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Chat.
     * @param {ChatUpsertArgs} args - Arguments to update or create a Chat.
     * @example
     * // Update or create a Chat
     * const chat = await prisma.chat.upsert({
     *   create: {
     *     // ... data to create a Chat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chat we want to update
     *   }
     * })
     */
    upsert<T extends ChatUpsertArgs>(args: SelectSubset<T, ChatUpsertArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatCountArgs} args - Arguments to filter Chats to count.
     * @example
     * // Count the number of Chats
     * const count = await prisma.chat.count({
     *   where: {
     *     // ... the filter for the Chats we want to count
     *   }
     * })
    **/
    count<T extends ChatCountArgs>(
      args?: Subset<T, ChatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatAggregateArgs>(args: Subset<T, ChatAggregateArgs>): Prisma.PrismaPromise<GetChatAggregateType<T>>

    /**
     * Group by Chat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatGroupByArgs} args - Group by arguments.
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
      T extends ChatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatGroupByArgs['orderBy'] }
        : { orderBy?: ChatGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Chat model
   */
  readonly fields: ChatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Chat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Chat$membersArgs<ExtArgs> = {}>(args?: Subset<T, Chat$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends Chat$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Chat$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    calls<T extends Chat$callsArgs<ExtArgs> = {}>(args?: Subset<T, Chat$callsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends Chat$userArgs<ExtArgs> = {}>(args?: Subset<T, Chat$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Chat model
   */
  interface ChatFieldRefs {
    readonly id: FieldRef<"Chat", 'String'>
    readonly type: FieldRef<"Chat", 'ChatType'>
    readonly name: FieldRef<"Chat", 'String'>
    readonly description: FieldRef<"Chat", 'String'>
    readonly avatar: FieldRef<"Chat", 'String'>
    readonly createdBy: FieldRef<"Chat", 'String'>
    readonly createdAt: FieldRef<"Chat", 'DateTime'>
    readonly updatedAt: FieldRef<"Chat", 'DateTime'>
    readonly userId: FieldRef<"Chat", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Chat findUnique
   */
  export type ChatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * Filter, which Chat to fetch.
     */
    where: ChatWhereUniqueInput
  }

  /**
   * Chat findUniqueOrThrow
   */
  export type ChatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * Filter, which Chat to fetch.
     */
    where: ChatWhereUniqueInput
  }

  /**
   * Chat findFirst
   */
  export type ChatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * Filter, which Chat to fetch.
     */
    where?: ChatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chats.
     */
    cursor?: ChatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chats.
     */
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[]
  }

  /**
   * Chat findFirstOrThrow
   */
  export type ChatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * Filter, which Chat to fetch.
     */
    where?: ChatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chats.
     */
    cursor?: ChatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chats.
     */
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[]
  }

  /**
   * Chat findMany
   */
  export type ChatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * Filter, which Chats to fetch.
     */
    where?: ChatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Chats.
     */
    cursor?: ChatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chats.
     */
    skip?: number
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[]
  }

  /**
   * Chat create
   */
  export type ChatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * The data needed to create a Chat.
     */
    data: XOR<ChatCreateInput, ChatUncheckedCreateInput>
  }

  /**
   * Chat createMany
   */
  export type ChatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Chats.
     */
    data: ChatCreateManyInput | ChatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Chat update
   */
  export type ChatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * The data needed to update a Chat.
     */
    data: XOR<ChatUpdateInput, ChatUncheckedUpdateInput>
    /**
     * Choose, which Chat to update.
     */
    where: ChatWhereUniqueInput
  }

  /**
   * Chat updateMany
   */
  export type ChatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Chats.
     */
    data: XOR<ChatUpdateManyMutationInput, ChatUncheckedUpdateManyInput>
    /**
     * Filter which Chats to update
     */
    where?: ChatWhereInput
    /**
     * Limit how many Chats to update.
     */
    limit?: number
  }

  /**
   * Chat upsert
   */
  export type ChatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * The filter to search for the Chat to update in case it exists.
     */
    where: ChatWhereUniqueInput
    /**
     * In case the Chat found by the `where` argument doesn't exist, create a new Chat with this data.
     */
    create: XOR<ChatCreateInput, ChatUncheckedCreateInput>
    /**
     * In case the Chat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatUpdateInput, ChatUncheckedUpdateInput>
  }

  /**
   * Chat delete
   */
  export type ChatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
    /**
     * Filter which Chat to delete.
     */
    where: ChatWhereUniqueInput
  }

  /**
   * Chat deleteMany
   */
  export type ChatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chats to delete
     */
    where?: ChatWhereInput
    /**
     * Limit how many Chats to delete.
     */
    limit?: number
  }

  /**
   * Chat.members
   */
  export type Chat$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    where?: ChatMemberWhereInput
    orderBy?: ChatMemberOrderByWithRelationInput | ChatMemberOrderByWithRelationInput[]
    cursor?: ChatMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMemberScalarFieldEnum | ChatMemberScalarFieldEnum[]
  }

  /**
   * Chat.messages
   */
  export type Chat$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Chat.calls
   */
  export type Chat$callsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    where?: CallWhereInput
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    cursor?: CallWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Chat.user
   */
  export type Chat$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Chat without action
   */
  export type ChatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null
  }


  /**
   * Model ChatMember
   */

  export type AggregateChatMember = {
    _count: ChatMemberCountAggregateOutputType | null
    _min: ChatMemberMinAggregateOutputType | null
    _max: ChatMemberMaxAggregateOutputType | null
  }

  export type ChatMemberMinAggregateOutputType = {
    id: string | null
    chatId: string | null
    userId: string | null
    role: $Enums.ChatMemberRole | null
    joinedAt: Date | null
    leftAt: Date | null
    lastReadAt: Date | null
  }

  export type ChatMemberMaxAggregateOutputType = {
    id: string | null
    chatId: string | null
    userId: string | null
    role: $Enums.ChatMemberRole | null
    joinedAt: Date | null
    leftAt: Date | null
    lastReadAt: Date | null
  }

  export type ChatMemberCountAggregateOutputType = {
    id: number
    chatId: number
    userId: number
    role: number
    joinedAt: number
    leftAt: number
    lastReadAt: number
    _all: number
  }


  export type ChatMemberMinAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
    role?: true
    joinedAt?: true
    leftAt?: true
    lastReadAt?: true
  }

  export type ChatMemberMaxAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
    role?: true
    joinedAt?: true
    leftAt?: true
    lastReadAt?: true
  }

  export type ChatMemberCountAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
    role?: true
    joinedAt?: true
    leftAt?: true
    lastReadAt?: true
    _all?: true
  }

  export type ChatMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMember to aggregate.
     */
    where?: ChatMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMembers to fetch.
     */
    orderBy?: ChatMemberOrderByWithRelationInput | ChatMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMembers
    **/
    _count?: true | ChatMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMemberMaxAggregateInputType
  }

  export type GetChatMemberAggregateType<T extends ChatMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMember[P]>
      : GetScalarType<T[P], AggregateChatMember[P]>
  }




  export type ChatMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMemberWhereInput
    orderBy?: ChatMemberOrderByWithAggregationInput | ChatMemberOrderByWithAggregationInput[]
    by: ChatMemberScalarFieldEnum[] | ChatMemberScalarFieldEnum
    having?: ChatMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMemberCountAggregateInputType | true
    _min?: ChatMemberMinAggregateInputType
    _max?: ChatMemberMaxAggregateInputType
  }

  export type ChatMemberGroupByOutputType = {
    id: string
    chatId: string
    userId: string
    role: $Enums.ChatMemberRole
    joinedAt: Date
    leftAt: Date | null
    lastReadAt: Date | null
    _count: ChatMemberCountAggregateOutputType | null
    _min: ChatMemberMinAggregateOutputType | null
    _max: ChatMemberMaxAggregateOutputType | null
  }

  type GetChatMemberGroupByPayload<T extends ChatMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMemberGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMemberGroupByOutputType[P]>
        }
      >
    >


  export type ChatMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    lastReadAt?: boolean
    chat?: boolean | ChatDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMember"]>



  export type ChatMemberSelectScalar = {
    id?: boolean
    chatId?: boolean
    userId?: boolean
    role?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    lastReadAt?: boolean
  }

  export type ChatMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chatId" | "userId" | "role" | "joinedAt" | "leftAt" | "lastReadAt", ExtArgs["result"]["chatMember"]>
  export type ChatMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chat?: boolean | ChatDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMember"
    objects: {
      chat: Prisma.$ChatPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chatId: string
      userId: string
      role: $Enums.ChatMemberRole
      joinedAt: Date
      leftAt: Date | null
      lastReadAt: Date | null
    }, ExtArgs["result"]["chatMember"]>
    composites: {}
  }

  type ChatMemberGetPayload<S extends boolean | null | undefined | ChatMemberDefaultArgs> = $Result.GetResult<Prisma.$ChatMemberPayload, S>

  type ChatMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMemberCountAggregateInputType | true
    }

  export interface ChatMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMember'], meta: { name: 'ChatMember' } }
    /**
     * Find zero or one ChatMember that matches the filter.
     * @param {ChatMemberFindUniqueArgs} args - Arguments to find a ChatMember
     * @example
     * // Get one ChatMember
     * const chatMember = await prisma.chatMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMemberFindUniqueArgs>(args: SelectSubset<T, ChatMemberFindUniqueArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMemberFindUniqueOrThrowArgs} args - Arguments to find a ChatMember
     * @example
     * // Get one ChatMember
     * const chatMember = await prisma.chatMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberFindFirstArgs} args - Arguments to find a ChatMember
     * @example
     * // Get one ChatMember
     * const chatMember = await prisma.chatMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMemberFindFirstArgs>(args?: SelectSubset<T, ChatMemberFindFirstArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberFindFirstOrThrowArgs} args - Arguments to find a ChatMember
     * @example
     * // Get one ChatMember
     * const chatMember = await prisma.chatMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMembers
     * const chatMembers = await prisma.chatMember.findMany()
     * 
     * // Get first 10 ChatMembers
     * const chatMembers = await prisma.chatMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMemberWithIdOnly = await prisma.chatMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMemberFindManyArgs>(args?: SelectSubset<T, ChatMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMember.
     * @param {ChatMemberCreateArgs} args - Arguments to create a ChatMember.
     * @example
     * // Create one ChatMember
     * const ChatMember = await prisma.chatMember.create({
     *   data: {
     *     // ... data to create a ChatMember
     *   }
     * })
     * 
     */
    create<T extends ChatMemberCreateArgs>(args: SelectSubset<T, ChatMemberCreateArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMembers.
     * @param {ChatMemberCreateManyArgs} args - Arguments to create many ChatMembers.
     * @example
     * // Create many ChatMembers
     * const chatMember = await prisma.chatMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMemberCreateManyArgs>(args?: SelectSubset<T, ChatMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatMember.
     * @param {ChatMemberDeleteArgs} args - Arguments to delete one ChatMember.
     * @example
     * // Delete one ChatMember
     * const ChatMember = await prisma.chatMember.delete({
     *   where: {
     *     // ... filter to delete one ChatMember
     *   }
     * })
     * 
     */
    delete<T extends ChatMemberDeleteArgs>(args: SelectSubset<T, ChatMemberDeleteArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMember.
     * @param {ChatMemberUpdateArgs} args - Arguments to update one ChatMember.
     * @example
     * // Update one ChatMember
     * const chatMember = await prisma.chatMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMemberUpdateArgs>(args: SelectSubset<T, ChatMemberUpdateArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMembers.
     * @param {ChatMemberDeleteManyArgs} args - Arguments to filter ChatMembers to delete.
     * @example
     * // Delete a few ChatMembers
     * const { count } = await prisma.chatMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMemberDeleteManyArgs>(args?: SelectSubset<T, ChatMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMembers
     * const chatMember = await prisma.chatMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMemberUpdateManyArgs>(args: SelectSubset<T, ChatMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMember.
     * @param {ChatMemberUpsertArgs} args - Arguments to update or create a ChatMember.
     * @example
     * // Update or create a ChatMember
     * const chatMember = await prisma.chatMember.upsert({
     *   create: {
     *     // ... data to create a ChatMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMember we want to update
     *   }
     * })
     */
    upsert<T extends ChatMemberUpsertArgs>(args: SelectSubset<T, ChatMemberUpsertArgs<ExtArgs>>): Prisma__ChatMemberClient<$Result.GetResult<Prisma.$ChatMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberCountArgs} args - Arguments to filter ChatMembers to count.
     * @example
     * // Count the number of ChatMembers
     * const count = await prisma.chatMember.count({
     *   where: {
     *     // ... the filter for the ChatMembers we want to count
     *   }
     * })
    **/
    count<T extends ChatMemberCountArgs>(
      args?: Subset<T, ChatMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatMemberAggregateArgs>(args: Subset<T, ChatMemberAggregateArgs>): Prisma.PrismaPromise<GetChatMemberAggregateType<T>>

    /**
     * Group by ChatMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMemberGroupByArgs} args - Group by arguments.
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
      T extends ChatMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMemberGroupByArgs['orderBy'] }
        : { orderBy?: ChatMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChatMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMember model
   */
  readonly fields: ChatMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chat<T extends ChatDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatDefaultArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ChatMember model
   */
  interface ChatMemberFieldRefs {
    readonly id: FieldRef<"ChatMember", 'String'>
    readonly chatId: FieldRef<"ChatMember", 'String'>
    readonly userId: FieldRef<"ChatMember", 'String'>
    readonly role: FieldRef<"ChatMember", 'ChatMemberRole'>
    readonly joinedAt: FieldRef<"ChatMember", 'DateTime'>
    readonly leftAt: FieldRef<"ChatMember", 'DateTime'>
    readonly lastReadAt: FieldRef<"ChatMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMember findUnique
   */
  export type ChatMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * Filter, which ChatMember to fetch.
     */
    where: ChatMemberWhereUniqueInput
  }

  /**
   * ChatMember findUniqueOrThrow
   */
  export type ChatMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * Filter, which ChatMember to fetch.
     */
    where: ChatMemberWhereUniqueInput
  }

  /**
   * ChatMember findFirst
   */
  export type ChatMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * Filter, which ChatMember to fetch.
     */
    where?: ChatMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMembers to fetch.
     */
    orderBy?: ChatMemberOrderByWithRelationInput | ChatMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMembers.
     */
    cursor?: ChatMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMembers.
     */
    distinct?: ChatMemberScalarFieldEnum | ChatMemberScalarFieldEnum[]
  }

  /**
   * ChatMember findFirstOrThrow
   */
  export type ChatMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * Filter, which ChatMember to fetch.
     */
    where?: ChatMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMembers to fetch.
     */
    orderBy?: ChatMemberOrderByWithRelationInput | ChatMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMembers.
     */
    cursor?: ChatMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMembers.
     */
    distinct?: ChatMemberScalarFieldEnum | ChatMemberScalarFieldEnum[]
  }

  /**
   * ChatMember findMany
   */
  export type ChatMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * Filter, which ChatMembers to fetch.
     */
    where?: ChatMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMembers to fetch.
     */
    orderBy?: ChatMemberOrderByWithRelationInput | ChatMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMembers.
     */
    cursor?: ChatMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMembers.
     */
    skip?: number
    distinct?: ChatMemberScalarFieldEnum | ChatMemberScalarFieldEnum[]
  }

  /**
   * ChatMember create
   */
  export type ChatMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMember.
     */
    data: XOR<ChatMemberCreateInput, ChatMemberUncheckedCreateInput>
  }

  /**
   * ChatMember createMany
   */
  export type ChatMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMembers.
     */
    data: ChatMemberCreateManyInput | ChatMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMember update
   */
  export type ChatMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMember.
     */
    data: XOR<ChatMemberUpdateInput, ChatMemberUncheckedUpdateInput>
    /**
     * Choose, which ChatMember to update.
     */
    where: ChatMemberWhereUniqueInput
  }

  /**
   * ChatMember updateMany
   */
  export type ChatMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMembers.
     */
    data: XOR<ChatMemberUpdateManyMutationInput, ChatMemberUncheckedUpdateManyInput>
    /**
     * Filter which ChatMembers to update
     */
    where?: ChatMemberWhereInput
    /**
     * Limit how many ChatMembers to update.
     */
    limit?: number
  }

  /**
   * ChatMember upsert
   */
  export type ChatMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMember to update in case it exists.
     */
    where: ChatMemberWhereUniqueInput
    /**
     * In case the ChatMember found by the `where` argument doesn't exist, create a new ChatMember with this data.
     */
    create: XOR<ChatMemberCreateInput, ChatMemberUncheckedCreateInput>
    /**
     * In case the ChatMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMemberUpdateInput, ChatMemberUncheckedUpdateInput>
  }

  /**
   * ChatMember delete
   */
  export type ChatMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
    /**
     * Filter which ChatMember to delete.
     */
    where: ChatMemberWhereUniqueInput
  }

  /**
   * ChatMember deleteMany
   */
  export type ChatMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMembers to delete
     */
    where?: ChatMemberWhereInput
    /**
     * Limit how many ChatMembers to delete.
     */
    limit?: number
  }

  /**
   * ChatMember without action
   */
  export type ChatMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMember
     */
    select?: ChatMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMember
     */
    omit?: ChatMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMemberInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type MessageSumAggregateOutputType = {
    fileSize: number | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    chatId: string | null
    senderId: string | null
    content: string | null
    type: $Enums.MessageType | null
    fileUrl: string | null
    fileName: string | null
    fileSize: number | null
    replyToId: string | null
    editedAt: Date | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    chatId: string | null
    senderId: string | null
    content: string | null
    type: $Enums.MessageType | null
    fileUrl: string | null
    fileName: string | null
    fileSize: number | null
    replyToId: string | null
    editedAt: Date | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    chatId: number
    senderId: number
    content: number
    type: number
    fileUrl: number
    fileName: number
    fileSize: number
    replyToId: number
    editedAt: number
    deletedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MessageAvgAggregateInputType = {
    fileSize?: true
  }

  export type MessageSumAggregateInputType = {
    fileSize?: true
  }

  export type MessageMinAggregateInputType = {
    id?: true
    chatId?: true
    senderId?: true
    content?: true
    type?: true
    fileUrl?: true
    fileName?: true
    fileSize?: true
    replyToId?: true
    editedAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    chatId?: true
    senderId?: true
    content?: true
    type?: true
    fileUrl?: true
    fileName?: true
    fileSize?: true
    replyToId?: true
    editedAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    chatId?: true
    senderId?: true
    content?: true
    type?: true
    fileUrl?: true
    fileName?: true
    fileSize?: true
    replyToId?: true
    editedAt?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _avg?: MessageAvgAggregateInputType
    _sum?: MessageSumAggregateInputType
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    chatId: string
    senderId: string
    content: string
    type: $Enums.MessageType
    fileUrl: string | null
    fileName: string | null
    fileSize: number | null
    replyToId: string | null
    editedAt: Date | null
    deletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatId?: boolean
    senderId?: boolean
    content?: boolean
    type?: boolean
    fileUrl?: boolean
    fileName?: boolean
    fileSize?: boolean
    replyToId?: boolean
    editedAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    chat?: boolean | ChatDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    replyTo?: boolean | Message$replyToArgs<ExtArgs>
    replies?: boolean | Message$repliesArgs<ExtArgs>
    readStatus?: boolean | Message$readStatusArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>



  export type MessageSelectScalar = {
    id?: boolean
    chatId?: boolean
    senderId?: boolean
    content?: boolean
    type?: boolean
    fileUrl?: boolean
    fileName?: boolean
    fileSize?: boolean
    replyToId?: boolean
    editedAt?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chatId" | "senderId" | "content" | "type" | "fileUrl" | "fileName" | "fileSize" | "replyToId" | "editedAt" | "deletedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chat?: boolean | ChatDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    replyTo?: boolean | Message$replyToArgs<ExtArgs>
    replies?: boolean | Message$repliesArgs<ExtArgs>
    readStatus?: boolean | Message$readStatusArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      chat: Prisma.$ChatPayload<ExtArgs>
      sender: Prisma.$UserPayload<ExtArgs>
      replyTo: Prisma.$MessagePayload<ExtArgs> | null
      replies: Prisma.$MessagePayload<ExtArgs>[]
      readStatus: Prisma.$MessageReadStatusPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chatId: string
      senderId: string
      content: string
      type: $Enums.MessageType
      fileUrl: string | null
      fileName: string | null
      fileSize: number | null
      replyToId: string | null
      editedAt: Date | null
      deletedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
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
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chat<T extends ChatDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatDefaultArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    replyTo<T extends Message$replyToArgs<ExtArgs> = {}>(args?: Subset<T, Message$replyToArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    replies<T extends Message$repliesArgs<ExtArgs> = {}>(args?: Subset<T, Message$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    readStatus<T extends Message$readStatusArgs<ExtArgs> = {}>(args?: Subset<T, Message$readStatusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly chatId: FieldRef<"Message", 'String'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly type: FieldRef<"Message", 'MessageType'>
    readonly fileUrl: FieldRef<"Message", 'String'>
    readonly fileName: FieldRef<"Message", 'String'>
    readonly fileSize: FieldRef<"Message", 'Int'>
    readonly replyToId: FieldRef<"Message", 'String'>
    readonly editedAt: FieldRef<"Message", 'DateTime'>
    readonly deletedAt: FieldRef<"Message", 'DateTime'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message.replyTo
   */
  export type Message$replyToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
  }

  /**
   * Message.replies
   */
  export type Message$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message.readStatus
   */
  export type Message$readStatusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    where?: MessageReadStatusWhereInput
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    cursor?: MessageReadStatusWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model MessageReadStatus
   */

  export type AggregateMessageReadStatus = {
    _count: MessageReadStatusCountAggregateOutputType | null
    _min: MessageReadStatusMinAggregateOutputType | null
    _max: MessageReadStatusMaxAggregateOutputType | null
  }

  export type MessageReadStatusMinAggregateOutputType = {
    id: string | null
    messageId: string | null
    userId: string | null
    readAt: Date | null
  }

  export type MessageReadStatusMaxAggregateOutputType = {
    id: string | null
    messageId: string | null
    userId: string | null
    readAt: Date | null
  }

  export type MessageReadStatusCountAggregateOutputType = {
    id: number
    messageId: number
    userId: number
    readAt: number
    _all: number
  }


  export type MessageReadStatusMinAggregateInputType = {
    id?: true
    messageId?: true
    userId?: true
    readAt?: true
  }

  export type MessageReadStatusMaxAggregateInputType = {
    id?: true
    messageId?: true
    userId?: true
    readAt?: true
  }

  export type MessageReadStatusCountAggregateInputType = {
    id?: true
    messageId?: true
    userId?: true
    readAt?: true
    _all?: true
  }

  export type MessageReadStatusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageReadStatus to aggregate.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MessageReadStatuses
    **/
    _count?: true | MessageReadStatusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageReadStatusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageReadStatusMaxAggregateInputType
  }

  export type GetMessageReadStatusAggregateType<T extends MessageReadStatusAggregateArgs> = {
        [P in keyof T & keyof AggregateMessageReadStatus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessageReadStatus[P]>
      : GetScalarType<T[P], AggregateMessageReadStatus[P]>
  }




  export type MessageReadStatusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageReadStatusWhereInput
    orderBy?: MessageReadStatusOrderByWithAggregationInput | MessageReadStatusOrderByWithAggregationInput[]
    by: MessageReadStatusScalarFieldEnum[] | MessageReadStatusScalarFieldEnum
    having?: MessageReadStatusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageReadStatusCountAggregateInputType | true
    _min?: MessageReadStatusMinAggregateInputType
    _max?: MessageReadStatusMaxAggregateInputType
  }

  export type MessageReadStatusGroupByOutputType = {
    id: string
    messageId: string
    userId: string
    readAt: Date
    _count: MessageReadStatusCountAggregateOutputType | null
    _min: MessageReadStatusMinAggregateOutputType | null
    _max: MessageReadStatusMaxAggregateOutputType | null
  }

  type GetMessageReadStatusGroupByPayload<T extends MessageReadStatusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageReadStatusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageReadStatusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageReadStatusGroupByOutputType[P]>
            : GetScalarType<T[P], MessageReadStatusGroupByOutputType[P]>
        }
      >
    >


  export type MessageReadStatusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    userId?: boolean
    readAt?: boolean
    message?: boolean | MessageDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messageReadStatus"]>



  export type MessageReadStatusSelectScalar = {
    id?: boolean
    messageId?: boolean
    userId?: boolean
    readAt?: boolean
  }

  export type MessageReadStatusOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "messageId" | "userId" | "readAt", ExtArgs["result"]["messageReadStatus"]>
  export type MessageReadStatusInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    message?: boolean | MessageDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MessageReadStatusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MessageReadStatus"
    objects: {
      message: Prisma.$MessagePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      messageId: string
      userId: string
      readAt: Date
    }, ExtArgs["result"]["messageReadStatus"]>
    composites: {}
  }

  type MessageReadStatusGetPayload<S extends boolean | null | undefined | MessageReadStatusDefaultArgs> = $Result.GetResult<Prisma.$MessageReadStatusPayload, S>

  type MessageReadStatusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageReadStatusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageReadStatusCountAggregateInputType | true
    }

  export interface MessageReadStatusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MessageReadStatus'], meta: { name: 'MessageReadStatus' } }
    /**
     * Find zero or one MessageReadStatus that matches the filter.
     * @param {MessageReadStatusFindUniqueArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageReadStatusFindUniqueArgs>(args: SelectSubset<T, MessageReadStatusFindUniqueArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MessageReadStatus that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageReadStatusFindUniqueOrThrowArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageReadStatusFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageReadStatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageReadStatus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusFindFirstArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageReadStatusFindFirstArgs>(args?: SelectSubset<T, MessageReadStatusFindFirstArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageReadStatus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusFindFirstOrThrowArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageReadStatusFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageReadStatusFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MessageReadStatuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MessageReadStatuses
     * const messageReadStatuses = await prisma.messageReadStatus.findMany()
     * 
     * // Get first 10 MessageReadStatuses
     * const messageReadStatuses = await prisma.messageReadStatus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageReadStatusWithIdOnly = await prisma.messageReadStatus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageReadStatusFindManyArgs>(args?: SelectSubset<T, MessageReadStatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MessageReadStatus.
     * @param {MessageReadStatusCreateArgs} args - Arguments to create a MessageReadStatus.
     * @example
     * // Create one MessageReadStatus
     * const MessageReadStatus = await prisma.messageReadStatus.create({
     *   data: {
     *     // ... data to create a MessageReadStatus
     *   }
     * })
     * 
     */
    create<T extends MessageReadStatusCreateArgs>(args: SelectSubset<T, MessageReadStatusCreateArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MessageReadStatuses.
     * @param {MessageReadStatusCreateManyArgs} args - Arguments to create many MessageReadStatuses.
     * @example
     * // Create many MessageReadStatuses
     * const messageReadStatus = await prisma.messageReadStatus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageReadStatusCreateManyArgs>(args?: SelectSubset<T, MessageReadStatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MessageReadStatus.
     * @param {MessageReadStatusDeleteArgs} args - Arguments to delete one MessageReadStatus.
     * @example
     * // Delete one MessageReadStatus
     * const MessageReadStatus = await prisma.messageReadStatus.delete({
     *   where: {
     *     // ... filter to delete one MessageReadStatus
     *   }
     * })
     * 
     */
    delete<T extends MessageReadStatusDeleteArgs>(args: SelectSubset<T, MessageReadStatusDeleteArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MessageReadStatus.
     * @param {MessageReadStatusUpdateArgs} args - Arguments to update one MessageReadStatus.
     * @example
     * // Update one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageReadStatusUpdateArgs>(args: SelectSubset<T, MessageReadStatusUpdateArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MessageReadStatuses.
     * @param {MessageReadStatusDeleteManyArgs} args - Arguments to filter MessageReadStatuses to delete.
     * @example
     * // Delete a few MessageReadStatuses
     * const { count } = await prisma.messageReadStatus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageReadStatusDeleteManyArgs>(args?: SelectSubset<T, MessageReadStatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MessageReadStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MessageReadStatuses
     * const messageReadStatus = await prisma.messageReadStatus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageReadStatusUpdateManyArgs>(args: SelectSubset<T, MessageReadStatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MessageReadStatus.
     * @param {MessageReadStatusUpsertArgs} args - Arguments to update or create a MessageReadStatus.
     * @example
     * // Update or create a MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.upsert({
     *   create: {
     *     // ... data to create a MessageReadStatus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MessageReadStatus we want to update
     *   }
     * })
     */
    upsert<T extends MessageReadStatusUpsertArgs>(args: SelectSubset<T, MessageReadStatusUpsertArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MessageReadStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusCountArgs} args - Arguments to filter MessageReadStatuses to count.
     * @example
     * // Count the number of MessageReadStatuses
     * const count = await prisma.messageReadStatus.count({
     *   where: {
     *     // ... the filter for the MessageReadStatuses we want to count
     *   }
     * })
    **/
    count<T extends MessageReadStatusCountArgs>(
      args?: Subset<T, MessageReadStatusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageReadStatusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MessageReadStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessageReadStatusAggregateArgs>(args: Subset<T, MessageReadStatusAggregateArgs>): Prisma.PrismaPromise<GetMessageReadStatusAggregateType<T>>

    /**
     * Group by MessageReadStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusGroupByArgs} args - Group by arguments.
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
      T extends MessageReadStatusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageReadStatusGroupByArgs['orderBy'] }
        : { orderBy?: MessageReadStatusGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MessageReadStatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageReadStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MessageReadStatus model
   */
  readonly fields: MessageReadStatusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MessageReadStatus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageReadStatusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    message<T extends MessageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MessageDefaultArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MessageReadStatus model
   */
  interface MessageReadStatusFieldRefs {
    readonly id: FieldRef<"MessageReadStatus", 'String'>
    readonly messageId: FieldRef<"MessageReadStatus", 'String'>
    readonly userId: FieldRef<"MessageReadStatus", 'String'>
    readonly readAt: FieldRef<"MessageReadStatus", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MessageReadStatus findUnique
   */
  export type MessageReadStatusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus findUniqueOrThrow
   */
  export type MessageReadStatusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus findFirst
   */
  export type MessageReadStatusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageReadStatuses.
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageReadStatuses.
     */
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * MessageReadStatus findFirstOrThrow
   */
  export type MessageReadStatusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageReadStatuses.
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageReadStatuses.
     */
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * MessageReadStatus findMany
   */
  export type MessageReadStatusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * Filter, which MessageReadStatuses to fetch.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MessageReadStatuses.
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * MessageReadStatus create
   */
  export type MessageReadStatusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * The data needed to create a MessageReadStatus.
     */
    data: XOR<MessageReadStatusCreateInput, MessageReadStatusUncheckedCreateInput>
  }

  /**
   * MessageReadStatus createMany
   */
  export type MessageReadStatusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MessageReadStatuses.
     */
    data: MessageReadStatusCreateManyInput | MessageReadStatusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MessageReadStatus update
   */
  export type MessageReadStatusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * The data needed to update a MessageReadStatus.
     */
    data: XOR<MessageReadStatusUpdateInput, MessageReadStatusUncheckedUpdateInput>
    /**
     * Choose, which MessageReadStatus to update.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus updateMany
   */
  export type MessageReadStatusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MessageReadStatuses.
     */
    data: XOR<MessageReadStatusUpdateManyMutationInput, MessageReadStatusUncheckedUpdateManyInput>
    /**
     * Filter which MessageReadStatuses to update
     */
    where?: MessageReadStatusWhereInput
    /**
     * Limit how many MessageReadStatuses to update.
     */
    limit?: number
  }

  /**
   * MessageReadStatus upsert
   */
  export type MessageReadStatusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * The filter to search for the MessageReadStatus to update in case it exists.
     */
    where: MessageReadStatusWhereUniqueInput
    /**
     * In case the MessageReadStatus found by the `where` argument doesn't exist, create a new MessageReadStatus with this data.
     */
    create: XOR<MessageReadStatusCreateInput, MessageReadStatusUncheckedCreateInput>
    /**
     * In case the MessageReadStatus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageReadStatusUpdateInput, MessageReadStatusUncheckedUpdateInput>
  }

  /**
   * MessageReadStatus delete
   */
  export type MessageReadStatusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
    /**
     * Filter which MessageReadStatus to delete.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus deleteMany
   */
  export type MessageReadStatusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageReadStatuses to delete
     */
    where?: MessageReadStatusWhereInput
    /**
     * Limit how many MessageReadStatuses to delete.
     */
    limit?: number
  }

  /**
   * MessageReadStatus without action
   */
  export type MessageReadStatusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageReadStatusInclude<ExtArgs> | null
  }


  /**
   * Model Call
   */

  export type AggregateCall = {
    _count: CallCountAggregateOutputType | null
    _avg: CallAvgAggregateOutputType | null
    _sum: CallSumAggregateOutputType | null
    _min: CallMinAggregateOutputType | null
    _max: CallMaxAggregateOutputType | null
  }

  export type CallAvgAggregateOutputType = {
    duration: number | null
  }

  export type CallSumAggregateOutputType = {
    duration: number | null
  }

  export type CallMinAggregateOutputType = {
    id: string | null
    chatId: string | null
    initiatorId: string | null
    receiverId: string | null
    type: $Enums.CallType | null
    status: $Enums.CallStatus | null
    startedAt: Date | null
    endedAt: Date | null
    duration: number | null
    createdAt: Date | null
  }

  export type CallMaxAggregateOutputType = {
    id: string | null
    chatId: string | null
    initiatorId: string | null
    receiverId: string | null
    type: $Enums.CallType | null
    status: $Enums.CallStatus | null
    startedAt: Date | null
    endedAt: Date | null
    duration: number | null
    createdAt: Date | null
  }

  export type CallCountAggregateOutputType = {
    id: number
    chatId: number
    initiatorId: number
    receiverId: number
    type: number
    status: number
    startedAt: number
    endedAt: number
    duration: number
    createdAt: number
    _all: number
  }


  export type CallAvgAggregateInputType = {
    duration?: true
  }

  export type CallSumAggregateInputType = {
    duration?: true
  }

  export type CallMinAggregateInputType = {
    id?: true
    chatId?: true
    initiatorId?: true
    receiverId?: true
    type?: true
    status?: true
    startedAt?: true
    endedAt?: true
    duration?: true
    createdAt?: true
  }

  export type CallMaxAggregateInputType = {
    id?: true
    chatId?: true
    initiatorId?: true
    receiverId?: true
    type?: true
    status?: true
    startedAt?: true
    endedAt?: true
    duration?: true
    createdAt?: true
  }

  export type CallCountAggregateInputType = {
    id?: true
    chatId?: true
    initiatorId?: true
    receiverId?: true
    type?: true
    status?: true
    startedAt?: true
    endedAt?: true
    duration?: true
    createdAt?: true
    _all?: true
  }

  export type CallAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Call to aggregate.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Calls
    **/
    _count?: true | CallCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CallAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CallSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CallMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CallMaxAggregateInputType
  }

  export type GetCallAggregateType<T extends CallAggregateArgs> = {
        [P in keyof T & keyof AggregateCall]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCall[P]>
      : GetScalarType<T[P], AggregateCall[P]>
  }




  export type CallGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
    orderBy?: CallOrderByWithAggregationInput | CallOrderByWithAggregationInput[]
    by: CallScalarFieldEnum[] | CallScalarFieldEnum
    having?: CallScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CallCountAggregateInputType | true
    _avg?: CallAvgAggregateInputType
    _sum?: CallSumAggregateInputType
    _min?: CallMinAggregateInputType
    _max?: CallMaxAggregateInputType
  }

  export type CallGroupByOutputType = {
    id: string
    chatId: string
    initiatorId: string
    receiverId: string | null
    type: $Enums.CallType
    status: $Enums.CallStatus
    startedAt: Date | null
    endedAt: Date | null
    duration: number | null
    createdAt: Date
    _count: CallCountAggregateOutputType | null
    _avg: CallAvgAggregateOutputType | null
    _sum: CallSumAggregateOutputType | null
    _min: CallMinAggregateOutputType | null
    _max: CallMaxAggregateOutputType | null
  }

  type GetCallGroupByPayload<T extends CallGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CallGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CallGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CallGroupByOutputType[P]>
            : GetScalarType<T[P], CallGroupByOutputType[P]>
        }
      >
    >


  export type CallSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatId?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    type?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    duration?: boolean
    createdAt?: boolean
    chat?: boolean | ChatDefaultArgs<ExtArgs>
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | Call$receiverArgs<ExtArgs>
  }, ExtArgs["result"]["call"]>



  export type CallSelectScalar = {
    id?: boolean
    chatId?: boolean
    initiatorId?: boolean
    receiverId?: boolean
    type?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    duration?: boolean
    createdAt?: boolean
  }

  export type CallOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chatId" | "initiatorId" | "receiverId" | "type" | "status" | "startedAt" | "endedAt" | "duration" | "createdAt", ExtArgs["result"]["call"]>
  export type CallInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chat?: boolean | ChatDefaultArgs<ExtArgs>
    initiator?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | Call$receiverArgs<ExtArgs>
  }

  export type $CallPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Call"
    objects: {
      chat: Prisma.$ChatPayload<ExtArgs>
      initiator: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chatId: string
      initiatorId: string
      receiverId: string | null
      type: $Enums.CallType
      status: $Enums.CallStatus
      startedAt: Date | null
      endedAt: Date | null
      duration: number | null
      createdAt: Date
    }, ExtArgs["result"]["call"]>
    composites: {}
  }

  type CallGetPayload<S extends boolean | null | undefined | CallDefaultArgs> = $Result.GetResult<Prisma.$CallPayload, S>

  type CallCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CallFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CallCountAggregateInputType | true
    }

  export interface CallDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Call'], meta: { name: 'Call' } }
    /**
     * Find zero or one Call that matches the filter.
     * @param {CallFindUniqueArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CallFindUniqueArgs>(args: SelectSubset<T, CallFindUniqueArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Call that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CallFindUniqueOrThrowArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CallFindUniqueOrThrowArgs>(args: SelectSubset<T, CallFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Call that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindFirstArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CallFindFirstArgs>(args?: SelectSubset<T, CallFindFirstArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Call that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindFirstOrThrowArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CallFindFirstOrThrowArgs>(args?: SelectSubset<T, CallFindFirstOrThrowArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Calls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Calls
     * const calls = await prisma.call.findMany()
     * 
     * // Get first 10 Calls
     * const calls = await prisma.call.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const callWithIdOnly = await prisma.call.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CallFindManyArgs>(args?: SelectSubset<T, CallFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Call.
     * @param {CallCreateArgs} args - Arguments to create a Call.
     * @example
     * // Create one Call
     * const Call = await prisma.call.create({
     *   data: {
     *     // ... data to create a Call
     *   }
     * })
     * 
     */
    create<T extends CallCreateArgs>(args: SelectSubset<T, CallCreateArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Calls.
     * @param {CallCreateManyArgs} args - Arguments to create many Calls.
     * @example
     * // Create many Calls
     * const call = await prisma.call.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CallCreateManyArgs>(args?: SelectSubset<T, CallCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Call.
     * @param {CallDeleteArgs} args - Arguments to delete one Call.
     * @example
     * // Delete one Call
     * const Call = await prisma.call.delete({
     *   where: {
     *     // ... filter to delete one Call
     *   }
     * })
     * 
     */
    delete<T extends CallDeleteArgs>(args: SelectSubset<T, CallDeleteArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Call.
     * @param {CallUpdateArgs} args - Arguments to update one Call.
     * @example
     * // Update one Call
     * const call = await prisma.call.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CallUpdateArgs>(args: SelectSubset<T, CallUpdateArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Calls.
     * @param {CallDeleteManyArgs} args - Arguments to filter Calls to delete.
     * @example
     * // Delete a few Calls
     * const { count } = await prisma.call.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CallDeleteManyArgs>(args?: SelectSubset<T, CallDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Calls
     * const call = await prisma.call.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CallUpdateManyArgs>(args: SelectSubset<T, CallUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Call.
     * @param {CallUpsertArgs} args - Arguments to update or create a Call.
     * @example
     * // Update or create a Call
     * const call = await prisma.call.upsert({
     *   create: {
     *     // ... data to create a Call
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Call we want to update
     *   }
     * })
     */
    upsert<T extends CallUpsertArgs>(args: SelectSubset<T, CallUpsertArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Calls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallCountArgs} args - Arguments to filter Calls to count.
     * @example
     * // Count the number of Calls
     * const count = await prisma.call.count({
     *   where: {
     *     // ... the filter for the Calls we want to count
     *   }
     * })
    **/
    count<T extends CallCountArgs>(
      args?: Subset<T, CallCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CallCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Call.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CallAggregateArgs>(args: Subset<T, CallAggregateArgs>): Prisma.PrismaPromise<GetCallAggregateType<T>>

    /**
     * Group by Call.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallGroupByArgs} args - Group by arguments.
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
      T extends CallGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CallGroupByArgs['orderBy'] }
        : { orderBy?: CallGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CallGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCallGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Call model
   */
  readonly fields: CallFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Call.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CallClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chat<T extends ChatDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatDefaultArgs<ExtArgs>>): Prisma__ChatClient<$Result.GetResult<Prisma.$ChatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    initiator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends Call$receiverArgs<ExtArgs> = {}>(args?: Subset<T, Call$receiverArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Call model
   */
  interface CallFieldRefs {
    readonly id: FieldRef<"Call", 'String'>
    readonly chatId: FieldRef<"Call", 'String'>
    readonly initiatorId: FieldRef<"Call", 'String'>
    readonly receiverId: FieldRef<"Call", 'String'>
    readonly type: FieldRef<"Call", 'CallType'>
    readonly status: FieldRef<"Call", 'CallStatus'>
    readonly startedAt: FieldRef<"Call", 'DateTime'>
    readonly endedAt: FieldRef<"Call", 'DateTime'>
    readonly duration: FieldRef<"Call", 'Int'>
    readonly createdAt: FieldRef<"Call", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Call findUnique
   */
  export type CallFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call findUniqueOrThrow
   */
  export type CallFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call findFirst
   */
  export type CallFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calls.
     */
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call findFirstOrThrow
   */
  export type CallFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calls.
     */
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call findMany
   */
  export type CallFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Calls to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call create
   */
  export type CallCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The data needed to create a Call.
     */
    data: XOR<CallCreateInput, CallUncheckedCreateInput>
  }

  /**
   * Call createMany
   */
  export type CallCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Calls.
     */
    data: CallCreateManyInput | CallCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Call update
   */
  export type CallUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The data needed to update a Call.
     */
    data: XOR<CallUpdateInput, CallUncheckedUpdateInput>
    /**
     * Choose, which Call to update.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call updateMany
   */
  export type CallUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Calls.
     */
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyInput>
    /**
     * Filter which Calls to update
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to update.
     */
    limit?: number
  }

  /**
   * Call upsert
   */
  export type CallUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The filter to search for the Call to update in case it exists.
     */
    where: CallWhereUniqueInput
    /**
     * In case the Call found by the `where` argument doesn't exist, create a new Call with this data.
     */
    create: XOR<CallCreateInput, CallUncheckedCreateInput>
    /**
     * In case the Call was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CallUpdateInput, CallUncheckedUpdateInput>
  }

  /**
   * Call delete
   */
  export type CallDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter which Call to delete.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call deleteMany
   */
  export type CallDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Calls to delete
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to delete.
     */
    limit?: number
  }

  /**
   * Call.receiver
   */
  export type Call$receiverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Call without action
   */
  export type CallDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
  }


  /**
   * Model Follow
   */

  export type AggregateFollow = {
    _count: FollowCountAggregateOutputType | null
    _min: FollowMinAggregateOutputType | null
    _max: FollowMaxAggregateOutputType | null
  }

  export type FollowMinAggregateOutputType = {
    id: string | null
    followerId: string | null
    followingId: string | null
    createdAt: Date | null
  }

  export type FollowMaxAggregateOutputType = {
    id: string | null
    followerId: string | null
    followingId: string | null
    createdAt: Date | null
  }

  export type FollowCountAggregateOutputType = {
    id: number
    followerId: number
    followingId: number
    createdAt: number
    _all: number
  }


  export type FollowMinAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
  }

  export type FollowMaxAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
  }

  export type FollowCountAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
    _all?: true
  }

  export type FollowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Follow to aggregate.
     */
    where?: FollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Follows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Follows
    **/
    _count?: true | FollowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FollowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FollowMaxAggregateInputType
  }

  export type GetFollowAggregateType<T extends FollowAggregateArgs> = {
        [P in keyof T & keyof AggregateFollow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFollow[P]>
      : GetScalarType<T[P], AggregateFollow[P]>
  }




  export type FollowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowWhereInput
    orderBy?: FollowOrderByWithAggregationInput | FollowOrderByWithAggregationInput[]
    by: FollowScalarFieldEnum[] | FollowScalarFieldEnum
    having?: FollowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FollowCountAggregateInputType | true
    _min?: FollowMinAggregateInputType
    _max?: FollowMaxAggregateInputType
  }

  export type FollowGroupByOutputType = {
    id: string
    followerId: string
    followingId: string
    createdAt: Date
    _count: FollowCountAggregateOutputType | null
    _min: FollowMinAggregateOutputType | null
    _max: FollowMaxAggregateOutputType | null
  }

  type GetFollowGroupByPayload<T extends FollowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FollowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FollowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FollowGroupByOutputType[P]>
            : GetScalarType<T[P], FollowGroupByOutputType[P]>
        }
      >
    >


  export type FollowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["follow"]>



  export type FollowSelectScalar = {
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
  }

  export type FollowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "followerId" | "followingId" | "createdAt", ExtArgs["result"]["follow"]>
  export type FollowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    follower?: boolean | UserDefaultArgs<ExtArgs>
    following?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FollowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Follow"
    objects: {
      follower: Prisma.$UserPayload<ExtArgs>
      following: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      followerId: string
      followingId: string
      createdAt: Date
    }, ExtArgs["result"]["follow"]>
    composites: {}
  }

  type FollowGetPayload<S extends boolean | null | undefined | FollowDefaultArgs> = $Result.GetResult<Prisma.$FollowPayload, S>

  type FollowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FollowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FollowCountAggregateInputType | true
    }

  export interface FollowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Follow'], meta: { name: 'Follow' } }
    /**
     * Find zero or one Follow that matches the filter.
     * @param {FollowFindUniqueArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FollowFindUniqueArgs>(args: SelectSubset<T, FollowFindUniqueArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Follow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FollowFindUniqueOrThrowArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FollowFindUniqueOrThrowArgs>(args: SelectSubset<T, FollowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Follow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowFindFirstArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FollowFindFirstArgs>(args?: SelectSubset<T, FollowFindFirstArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Follow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowFindFirstOrThrowArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FollowFindFirstOrThrowArgs>(args?: SelectSubset<T, FollowFindFirstOrThrowArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Follows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Follows
     * const follows = await prisma.follow.findMany()
     * 
     * // Get first 10 Follows
     * const follows = await prisma.follow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const followWithIdOnly = await prisma.follow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FollowFindManyArgs>(args?: SelectSubset<T, FollowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Follow.
     * @param {FollowCreateArgs} args - Arguments to create a Follow.
     * @example
     * // Create one Follow
     * const Follow = await prisma.follow.create({
     *   data: {
     *     // ... data to create a Follow
     *   }
     * })
     * 
     */
    create<T extends FollowCreateArgs>(args: SelectSubset<T, FollowCreateArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Follows.
     * @param {FollowCreateManyArgs} args - Arguments to create many Follows.
     * @example
     * // Create many Follows
     * const follow = await prisma.follow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FollowCreateManyArgs>(args?: SelectSubset<T, FollowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Follow.
     * @param {FollowDeleteArgs} args - Arguments to delete one Follow.
     * @example
     * // Delete one Follow
     * const Follow = await prisma.follow.delete({
     *   where: {
     *     // ... filter to delete one Follow
     *   }
     * })
     * 
     */
    delete<T extends FollowDeleteArgs>(args: SelectSubset<T, FollowDeleteArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Follow.
     * @param {FollowUpdateArgs} args - Arguments to update one Follow.
     * @example
     * // Update one Follow
     * const follow = await prisma.follow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FollowUpdateArgs>(args: SelectSubset<T, FollowUpdateArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Follows.
     * @param {FollowDeleteManyArgs} args - Arguments to filter Follows to delete.
     * @example
     * // Delete a few Follows
     * const { count } = await prisma.follow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FollowDeleteManyArgs>(args?: SelectSubset<T, FollowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Follows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Follows
     * const follow = await prisma.follow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FollowUpdateManyArgs>(args: SelectSubset<T, FollowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Follow.
     * @param {FollowUpsertArgs} args - Arguments to update or create a Follow.
     * @example
     * // Update or create a Follow
     * const follow = await prisma.follow.upsert({
     *   create: {
     *     // ... data to create a Follow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Follow we want to update
     *   }
     * })
     */
    upsert<T extends FollowUpsertArgs>(args: SelectSubset<T, FollowUpsertArgs<ExtArgs>>): Prisma__FollowClient<$Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Follows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowCountArgs} args - Arguments to filter Follows to count.
     * @example
     * // Count the number of Follows
     * const count = await prisma.follow.count({
     *   where: {
     *     // ... the filter for the Follows we want to count
     *   }
     * })
    **/
    count<T extends FollowCountArgs>(
      args?: Subset<T, FollowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FollowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Follow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FollowAggregateArgs>(args: Subset<T, FollowAggregateArgs>): Prisma.PrismaPromise<GetFollowAggregateType<T>>

    /**
     * Group by Follow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowGroupByArgs} args - Group by arguments.
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
      T extends FollowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FollowGroupByArgs['orderBy'] }
        : { orderBy?: FollowGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FollowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFollowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Follow model
   */
  readonly fields: FollowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Follow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FollowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    follower<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    following<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Follow model
   */
  interface FollowFieldRefs {
    readonly id: FieldRef<"Follow", 'String'>
    readonly followerId: FieldRef<"Follow", 'String'>
    readonly followingId: FieldRef<"Follow", 'String'>
    readonly createdAt: FieldRef<"Follow", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Follow findUnique
   */
  export type FollowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * Filter, which Follow to fetch.
     */
    where: FollowWhereUniqueInput
  }

  /**
   * Follow findUniqueOrThrow
   */
  export type FollowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * Filter, which Follow to fetch.
     */
    where: FollowWhereUniqueInput
  }

  /**
   * Follow findFirst
   */
  export type FollowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * Filter, which Follow to fetch.
     */
    where?: FollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Follows.
     */
    cursor?: FollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Follows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Follows.
     */
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[]
  }

  /**
   * Follow findFirstOrThrow
   */
  export type FollowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * Filter, which Follow to fetch.
     */
    where?: FollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Follows.
     */
    cursor?: FollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Follows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Follows.
     */
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[]
  }

  /**
   * Follow findMany
   */
  export type FollowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * Filter, which Follows to fetch.
     */
    where?: FollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Follows.
     */
    cursor?: FollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Follows.
     */
    skip?: number
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[]
  }

  /**
   * Follow create
   */
  export type FollowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * The data needed to create a Follow.
     */
    data: XOR<FollowCreateInput, FollowUncheckedCreateInput>
  }

  /**
   * Follow createMany
   */
  export type FollowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Follows.
     */
    data: FollowCreateManyInput | FollowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Follow update
   */
  export type FollowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * The data needed to update a Follow.
     */
    data: XOR<FollowUpdateInput, FollowUncheckedUpdateInput>
    /**
     * Choose, which Follow to update.
     */
    where: FollowWhereUniqueInput
  }

  /**
   * Follow updateMany
   */
  export type FollowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Follows.
     */
    data: XOR<FollowUpdateManyMutationInput, FollowUncheckedUpdateManyInput>
    /**
     * Filter which Follows to update
     */
    where?: FollowWhereInput
    /**
     * Limit how many Follows to update.
     */
    limit?: number
  }

  /**
   * Follow upsert
   */
  export type FollowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * The filter to search for the Follow to update in case it exists.
     */
    where: FollowWhereUniqueInput
    /**
     * In case the Follow found by the `where` argument doesn't exist, create a new Follow with this data.
     */
    create: XOR<FollowCreateInput, FollowUncheckedCreateInput>
    /**
     * In case the Follow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FollowUpdateInput, FollowUncheckedUpdateInput>
  }

  /**
   * Follow delete
   */
  export type FollowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
    /**
     * Filter which Follow to delete.
     */
    where: FollowWhereUniqueInput
  }

  /**
   * Follow deleteMany
   */
  export type FollowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Follows to delete
     */
    where?: FollowWhereInput
    /**
     * Limit how many Follows to delete.
     */
    limit?: number
  }

  /**
   * Follow without action
   */
  export type FollowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null
  }


  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    about: string | null
    avatar: string | null
    hero: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    about: string | null
    avatar: string | null
    hero: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    about: number
    avatar: number
    hero: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    about?: true
    avatar?: true
    hero?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    about?: true
    avatar?: true
    hero?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    about?: true
    avatar?: true
    hero?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    userId: string
    name: string | null
    about: string | null
    avatar: string | null
    hero: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    about?: boolean
    avatar?: boolean
    hero?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>



  export type ProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    about?: boolean
    avatar?: boolean
    hero?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "about" | "avatar" | "hero" | "createdAt" | "updatedAt", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string | null
      about: string | null
      avatar: string | null
      hero: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
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
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly userId: FieldRef<"Profile", 'String'>
    readonly name: FieldRef<"Profile", 'String'>
    readonly about: FieldRef<"Profile", 'String'>
    readonly avatar: FieldRef<"Profile", 'String'>
    readonly hero: FieldRef<"Profile", 'String'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    views: number | null
  }

  export type PostSumAggregateOutputType = {
    views: number | null
  }

  export type PostMinAggregateOutputType = {
    id: string | null
    userId: string | null
    authorId: string | null
    text: string | null
    image: string | null
    audio: string | null
    video: string | null
    link: string | null
    views: number | null
    originalPostId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    authorId: string | null
    text: string | null
    image: string | null
    audio: string | null
    video: string | null
    link: string | null
    views: number | null
    originalPostId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    userId: number
    authorId: number
    text: number
    image: number
    audio: number
    video: number
    link: number
    views: number
    originalPostId: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    views?: true
  }

  export type PostSumAggregateInputType = {
    views?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    userId?: true
    authorId?: true
    text?: true
    image?: true
    audio?: true
    video?: true
    link?: true
    views?: true
    originalPostId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    userId?: true
    authorId?: true
    text?: true
    image?: true
    audio?: true
    video?: true
    link?: true
    views?: true
    originalPostId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    userId?: true
    authorId?: true
    text?: true
    image?: true
    audio?: true
    video?: true
    link?: true
    views?: true
    originalPostId?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: string
    userId: string
    authorId: string | null
    text: string | null
    image: string | null
    audio: string | null
    video: string | null
    link: string | null
    views: number
    originalPostId: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authorId?: boolean
    text?: boolean
    image?: boolean
    audio?: boolean
    video?: boolean
    link?: boolean
    views?: boolean
    originalPostId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    author?: boolean | Post$authorArgs<ExtArgs>
    originalPost?: boolean | Post$originalPostArgs<ExtArgs>
    reposts?: boolean | Post$repostsArgs<ExtArgs>
    likes?: boolean | Post$likesArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>



  export type PostSelectScalar = {
    id?: boolean
    userId?: boolean
    authorId?: boolean
    text?: boolean
    image?: boolean
    audio?: boolean
    video?: boolean
    link?: boolean
    views?: boolean
    originalPostId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "authorId" | "text" | "image" | "audio" | "video" | "link" | "views" | "originalPostId" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    author?: boolean | Post$authorArgs<ExtArgs>
    originalPost?: boolean | Post$originalPostArgs<ExtArgs>
    reposts?: boolean | Post$repostsArgs<ExtArgs>
    likes?: boolean | Post$likesArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs> | null
      originalPost: Prisma.$PostPayload<ExtArgs> | null
      reposts: Prisma.$PostPayload<ExtArgs>[]
      likes: Prisma.$PostLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      authorId: string | null
      text: string | null
      image: string | null
      audio: string | null
      video: string | null
      link: string | null
      views: number
      originalPostId: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
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
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends Post$authorArgs<ExtArgs> = {}>(args?: Subset<T, Post$authorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    originalPost<T extends Post$originalPostArgs<ExtArgs> = {}>(args?: Subset<T, Post$originalPostArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reposts<T extends Post$repostsArgs<ExtArgs> = {}>(args?: Subset<T, Post$repostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    likes<T extends Post$likesArgs<ExtArgs> = {}>(args?: Subset<T, Post$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'String'>
    readonly userId: FieldRef<"Post", 'String'>
    readonly authorId: FieldRef<"Post", 'String'>
    readonly text: FieldRef<"Post", 'String'>
    readonly image: FieldRef<"Post", 'String'>
    readonly audio: FieldRef<"Post", 'String'>
    readonly video: FieldRef<"Post", 'String'>
    readonly link: FieldRef<"Post", 'String'>
    readonly views: FieldRef<"Post", 'Int'>
    readonly originalPostId: FieldRef<"Post", 'String'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
    readonly deletedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post.author
   */
  export type Post$authorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Post.originalPost
   */
  export type Post$originalPostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
  }

  /**
   * Post.reposts
   */
  export type Post$repostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post.likes
   */
  export type Post$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    where?: PostLikeWhereInput
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    cursor?: PostLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model PostLike
   */

  export type AggregatePostLike = {
    _count: PostLikeCountAggregateOutputType | null
    _min: PostLikeMinAggregateOutputType | null
    _max: PostLikeMaxAggregateOutputType | null
  }

  export type PostLikeMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    isLike: boolean | null
    createdAt: Date | null
  }

  export type PostLikeMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    isLike: boolean | null
    createdAt: Date | null
  }

  export type PostLikeCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    isLike: number
    createdAt: number
    _all: number
  }


  export type PostLikeMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    isLike?: true
    createdAt?: true
  }

  export type PostLikeMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    isLike?: true
    createdAt?: true
  }

  export type PostLikeCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    isLike?: true
    createdAt?: true
    _all?: true
  }

  export type PostLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostLike to aggregate.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PostLikes
    **/
    _count?: true | PostLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostLikeMaxAggregateInputType
  }

  export type GetPostLikeAggregateType<T extends PostLikeAggregateArgs> = {
        [P in keyof T & keyof AggregatePostLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePostLike[P]>
      : GetScalarType<T[P], AggregatePostLike[P]>
  }




  export type PostLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostLikeWhereInput
    orderBy?: PostLikeOrderByWithAggregationInput | PostLikeOrderByWithAggregationInput[]
    by: PostLikeScalarFieldEnum[] | PostLikeScalarFieldEnum
    having?: PostLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostLikeCountAggregateInputType | true
    _min?: PostLikeMinAggregateInputType
    _max?: PostLikeMaxAggregateInputType
  }

  export type PostLikeGroupByOutputType = {
    id: string
    postId: string
    userId: string
    isLike: boolean
    createdAt: Date
    _count: PostLikeCountAggregateOutputType | null
    _min: PostLikeMinAggregateOutputType | null
    _max: PostLikeMaxAggregateOutputType | null
  }

  type GetPostLikeGroupByPayload<T extends PostLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostLikeGroupByOutputType[P]>
            : GetScalarType<T[P], PostLikeGroupByOutputType[P]>
        }
      >
    >


  export type PostLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    isLike?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postLike"]>



  export type PostLikeSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    isLike?: boolean
    createdAt?: boolean
  }

  export type PostLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "postId" | "userId" | "isLike" | "createdAt", ExtArgs["result"]["postLike"]>
  export type PostLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PostLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PostLike"
    objects: {
      post: Prisma.$PostPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      isLike: boolean
      createdAt: Date
    }, ExtArgs["result"]["postLike"]>
    composites: {}
  }

  type PostLikeGetPayload<S extends boolean | null | undefined | PostLikeDefaultArgs> = $Result.GetResult<Prisma.$PostLikePayload, S>

  type PostLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostLikeCountAggregateInputType | true
    }

  export interface PostLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PostLike'], meta: { name: 'PostLike' } }
    /**
     * Find zero or one PostLike that matches the filter.
     * @param {PostLikeFindUniqueArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostLikeFindUniqueArgs>(args: SelectSubset<T, PostLikeFindUniqueArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PostLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostLikeFindUniqueOrThrowArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, PostLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeFindFirstArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostLikeFindFirstArgs>(args?: SelectSubset<T, PostLikeFindFirstArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeFindFirstOrThrowArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, PostLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PostLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PostLikes
     * const postLikes = await prisma.postLike.findMany()
     * 
     * // Get first 10 PostLikes
     * const postLikes = await prisma.postLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postLikeWithIdOnly = await prisma.postLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostLikeFindManyArgs>(args?: SelectSubset<T, PostLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PostLike.
     * @param {PostLikeCreateArgs} args - Arguments to create a PostLike.
     * @example
     * // Create one PostLike
     * const PostLike = await prisma.postLike.create({
     *   data: {
     *     // ... data to create a PostLike
     *   }
     * })
     * 
     */
    create<T extends PostLikeCreateArgs>(args: SelectSubset<T, PostLikeCreateArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PostLikes.
     * @param {PostLikeCreateManyArgs} args - Arguments to create many PostLikes.
     * @example
     * // Create many PostLikes
     * const postLike = await prisma.postLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostLikeCreateManyArgs>(args?: SelectSubset<T, PostLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PostLike.
     * @param {PostLikeDeleteArgs} args - Arguments to delete one PostLike.
     * @example
     * // Delete one PostLike
     * const PostLike = await prisma.postLike.delete({
     *   where: {
     *     // ... filter to delete one PostLike
     *   }
     * })
     * 
     */
    delete<T extends PostLikeDeleteArgs>(args: SelectSubset<T, PostLikeDeleteArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PostLike.
     * @param {PostLikeUpdateArgs} args - Arguments to update one PostLike.
     * @example
     * // Update one PostLike
     * const postLike = await prisma.postLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostLikeUpdateArgs>(args: SelectSubset<T, PostLikeUpdateArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PostLikes.
     * @param {PostLikeDeleteManyArgs} args - Arguments to filter PostLikes to delete.
     * @example
     * // Delete a few PostLikes
     * const { count } = await prisma.postLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostLikeDeleteManyArgs>(args?: SelectSubset<T, PostLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PostLikes
     * const postLike = await prisma.postLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostLikeUpdateManyArgs>(args: SelectSubset<T, PostLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PostLike.
     * @param {PostLikeUpsertArgs} args - Arguments to update or create a PostLike.
     * @example
     * // Update or create a PostLike
     * const postLike = await prisma.postLike.upsert({
     *   create: {
     *     // ... data to create a PostLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PostLike we want to update
     *   }
     * })
     */
    upsert<T extends PostLikeUpsertArgs>(args: SelectSubset<T, PostLikeUpsertArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PostLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeCountArgs} args - Arguments to filter PostLikes to count.
     * @example
     * // Count the number of PostLikes
     * const count = await prisma.postLike.count({
     *   where: {
     *     // ... the filter for the PostLikes we want to count
     *   }
     * })
    **/
    count<T extends PostLikeCountArgs>(
      args?: Subset<T, PostLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PostLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PostLikeAggregateArgs>(args: Subset<T, PostLikeAggregateArgs>): Prisma.PrismaPromise<GetPostLikeAggregateType<T>>

    /**
     * Group by PostLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeGroupByArgs} args - Group by arguments.
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
      T extends PostLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostLikeGroupByArgs['orderBy'] }
        : { orderBy?: PostLikeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PostLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PostLike model
   */
  readonly fields: PostLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PostLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PostLike model
   */
  interface PostLikeFieldRefs {
    readonly id: FieldRef<"PostLike", 'String'>
    readonly postId: FieldRef<"PostLike", 'String'>
    readonly userId: FieldRef<"PostLike", 'String'>
    readonly isLike: FieldRef<"PostLike", 'Boolean'>
    readonly createdAt: FieldRef<"PostLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PostLike findUnique
   */
  export type PostLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike findUniqueOrThrow
   */
  export type PostLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike findFirst
   */
  export type PostLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostLikes.
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostLikes.
     */
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * PostLike findFirstOrThrow
   */
  export type PostLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostLikes.
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostLikes.
     */
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * PostLike findMany
   */
  export type PostLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLikes to fetch.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PostLikes.
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * PostLike create
   */
  export type PostLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a PostLike.
     */
    data: XOR<PostLikeCreateInput, PostLikeUncheckedCreateInput>
  }

  /**
   * PostLike createMany
   */
  export type PostLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PostLikes.
     */
    data: PostLikeCreateManyInput | PostLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PostLike update
   */
  export type PostLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a PostLike.
     */
    data: XOR<PostLikeUpdateInput, PostLikeUncheckedUpdateInput>
    /**
     * Choose, which PostLike to update.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike updateMany
   */
  export type PostLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PostLikes.
     */
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyInput>
    /**
     * Filter which PostLikes to update
     */
    where?: PostLikeWhereInput
    /**
     * Limit how many PostLikes to update.
     */
    limit?: number
  }

  /**
   * PostLike upsert
   */
  export type PostLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the PostLike to update in case it exists.
     */
    where: PostLikeWhereUniqueInput
    /**
     * In case the PostLike found by the `where` argument doesn't exist, create a new PostLike with this data.
     */
    create: XOR<PostLikeCreateInput, PostLikeUncheckedCreateInput>
    /**
     * In case the PostLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostLikeUpdateInput, PostLikeUncheckedUpdateInput>
  }

  /**
   * PostLike delete
   */
  export type PostLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter which PostLike to delete.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike deleteMany
   */
  export type PostLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostLikes to delete
     */
    where?: PostLikeWhereInput
    /**
     * Limit how many PostLikes to delete.
     */
    limit?: number
  }

  /**
   * PostLike without action
   */
  export type PostLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
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
    name: 'name',
    email: 'email',
    isAcivated: 'isAcivated',
    activationLink: 'activationLink',
    role: 'role',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshToken: 'refreshToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum]


  export const ChatScalarFieldEnum: {
    id: 'id',
    type: 'type',
    name: 'name',
    description: 'description',
    avatar: 'avatar',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type ChatScalarFieldEnum = (typeof ChatScalarFieldEnum)[keyof typeof ChatScalarFieldEnum]


  export const ChatMemberScalarFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    userId: 'userId',
    role: 'role',
    joinedAt: 'joinedAt',
    leftAt: 'leftAt',
    lastReadAt: 'lastReadAt'
  };

  export type ChatMemberScalarFieldEnum = (typeof ChatMemberScalarFieldEnum)[keyof typeof ChatMemberScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    senderId: 'senderId',
    content: 'content',
    type: 'type',
    fileUrl: 'fileUrl',
    fileName: 'fileName',
    fileSize: 'fileSize',
    replyToId: 'replyToId',
    editedAt: 'editedAt',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const MessageReadStatusScalarFieldEnum: {
    id: 'id',
    messageId: 'messageId',
    userId: 'userId',
    readAt: 'readAt'
  };

  export type MessageReadStatusScalarFieldEnum = (typeof MessageReadStatusScalarFieldEnum)[keyof typeof MessageReadStatusScalarFieldEnum]


  export const CallScalarFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    initiatorId: 'initiatorId',
    receiverId: 'receiverId',
    type: 'type',
    status: 'status',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    duration: 'duration',
    createdAt: 'createdAt'
  };

  export type CallScalarFieldEnum = (typeof CallScalarFieldEnum)[keyof typeof CallScalarFieldEnum]


  export const FollowScalarFieldEnum: {
    id: 'id',
    followerId: 'followerId',
    followingId: 'followingId',
    createdAt: 'createdAt'
  };

  export type FollowScalarFieldEnum = (typeof FollowScalarFieldEnum)[keyof typeof FollowScalarFieldEnum]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    about: 'about',
    avatar: 'avatar',
    hero: 'hero',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    authorId: 'authorId',
    text: 'text',
    image: 'image',
    audio: 'audio',
    video: 'video',
    link: 'link',
    views: 'views',
    originalPostId: 'originalPostId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const PostLikeScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    isLike: 'isLike',
    createdAt: 'createdAt'
  };

  export type PostLikeScalarFieldEnum = (typeof PostLikeScalarFieldEnum)[keyof typeof PostLikeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    activationLink: 'activationLink',
    password: 'password'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const TokenOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshToken: 'refreshToken'
  };

  export type TokenOrderByRelevanceFieldEnum = (typeof TokenOrderByRelevanceFieldEnum)[keyof typeof TokenOrderByRelevanceFieldEnum]


  export const ChatOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    avatar: 'avatar',
    createdBy: 'createdBy',
    userId: 'userId'
  };

  export type ChatOrderByRelevanceFieldEnum = (typeof ChatOrderByRelevanceFieldEnum)[keyof typeof ChatOrderByRelevanceFieldEnum]


  export const ChatMemberOrderByRelevanceFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    userId: 'userId'
  };

  export type ChatMemberOrderByRelevanceFieldEnum = (typeof ChatMemberOrderByRelevanceFieldEnum)[keyof typeof ChatMemberOrderByRelevanceFieldEnum]


  export const MessageOrderByRelevanceFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    senderId: 'senderId',
    content: 'content',
    fileUrl: 'fileUrl',
    fileName: 'fileName',
    replyToId: 'replyToId'
  };

  export type MessageOrderByRelevanceFieldEnum = (typeof MessageOrderByRelevanceFieldEnum)[keyof typeof MessageOrderByRelevanceFieldEnum]


  export const MessageReadStatusOrderByRelevanceFieldEnum: {
    id: 'id',
    messageId: 'messageId',
    userId: 'userId'
  };

  export type MessageReadStatusOrderByRelevanceFieldEnum = (typeof MessageReadStatusOrderByRelevanceFieldEnum)[keyof typeof MessageReadStatusOrderByRelevanceFieldEnum]


  export const CallOrderByRelevanceFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    initiatorId: 'initiatorId',
    receiverId: 'receiverId'
  };

  export type CallOrderByRelevanceFieldEnum = (typeof CallOrderByRelevanceFieldEnum)[keyof typeof CallOrderByRelevanceFieldEnum]


  export const FollowOrderByRelevanceFieldEnum: {
    id: 'id',
    followerId: 'followerId',
    followingId: 'followingId'
  };

  export type FollowOrderByRelevanceFieldEnum = (typeof FollowOrderByRelevanceFieldEnum)[keyof typeof FollowOrderByRelevanceFieldEnum]


  export const ProfileOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    about: 'about',
    avatar: 'avatar',
    hero: 'hero'
  };

  export type ProfileOrderByRelevanceFieldEnum = (typeof ProfileOrderByRelevanceFieldEnum)[keyof typeof ProfileOrderByRelevanceFieldEnum]


  export const PostOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    authorId: 'authorId',
    text: 'text',
    image: 'image',
    audio: 'audio',
    video: 'video',
    link: 'link',
    originalPostId: 'originalPostId'
  };

  export type PostOrderByRelevanceFieldEnum = (typeof PostOrderByRelevanceFieldEnum)[keyof typeof PostOrderByRelevanceFieldEnum]


  export const PostLikeOrderByRelevanceFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId'
  };

  export type PostLikeOrderByRelevanceFieldEnum = (typeof PostLikeOrderByRelevanceFieldEnum)[keyof typeof PostLikeOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'user_roles'
   */
  export type Enumuser_rolesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_roles'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'ChatType'
   */
  export type EnumChatTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatType'>
    


  /**
   * Reference to a field of type 'ChatMemberRole'
   */
  export type EnumChatMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatMemberRole'>
    


  /**
   * Reference to a field of type 'MessageType'
   */
  export type EnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'CallType'
   */
  export type EnumCallTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CallType'>
    


  /**
   * Reference to a field of type 'CallStatus'
   */
  export type EnumCallStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CallStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    isAcivated?: BoolFilter<"User"> | boolean
    activationLink?: StringFilter<"User"> | string
    role?: Enumuser_rolesFilter<"User"> | $Enums.user_roles
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    tokens?: TokenListRelationFilter
    createdChats?: ChatListRelationFilter
    chatMembers?: ChatMemberListRelationFilter
    messages?: MessageListRelationFilter
    sentCalls?: CallListRelationFilter
    receivedCalls?: CallListRelationFilter
    messageReads?: MessageReadStatusListRelationFilter
    chats?: ChatListRelationFilter
    followers?: FollowListRelationFilter
    following?: FollowListRelationFilter
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    posts?: PostListRelationFilter
    authoredPosts?: PostListRelationFilter
    postLikes?: PostLikeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    isAcivated?: SortOrder
    activationLink?: SortOrder
    role?: SortOrder
    password?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    tokens?: TokenOrderByRelationAggregateInput
    createdChats?: ChatOrderByRelationAggregateInput
    chatMembers?: ChatMemberOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    sentCalls?: CallOrderByRelationAggregateInput
    receivedCalls?: CallOrderByRelationAggregateInput
    messageReads?: MessageReadStatusOrderByRelationAggregateInput
    chats?: ChatOrderByRelationAggregateInput
    followers?: FollowOrderByRelationAggregateInput
    following?: FollowOrderByRelationAggregateInput
    profile?: ProfileOrderByWithRelationInput
    posts?: PostOrderByRelationAggregateInput
    authoredPosts?: PostOrderByRelationAggregateInput
    postLikes?: PostLikeOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    activationLink?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    isAcivated?: BoolFilter<"User"> | boolean
    role?: Enumuser_rolesFilter<"User"> | $Enums.user_roles
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    tokens?: TokenListRelationFilter
    createdChats?: ChatListRelationFilter
    chatMembers?: ChatMemberListRelationFilter
    messages?: MessageListRelationFilter
    sentCalls?: CallListRelationFilter
    receivedCalls?: CallListRelationFilter
    messageReads?: MessageReadStatusListRelationFilter
    chats?: ChatListRelationFilter
    followers?: FollowListRelationFilter
    following?: FollowListRelationFilter
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    posts?: PostListRelationFilter
    authoredPosts?: PostListRelationFilter
    postLikes?: PostLikeListRelationFilter
  }, "id" | "email" | "activationLink" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    isAcivated?: SortOrder
    activationLink?: SortOrder
    role?: SortOrder
    password?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    isAcivated?: BoolWithAggregatesFilter<"User"> | boolean
    activationLink?: StringWithAggregatesFilter<"User"> | string
    role?: Enumuser_rolesWithAggregatesFilter<"User"> | $Enums.user_roles
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type TokenWhereInput = {
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    id?: StringFilter<"Token"> | string
    userId?: StringFilter<"Token"> | string
    refreshToken?: StringFilter<"Token"> | string
    createdAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: TokenOrderByRelevanceInput
  }

  export type TokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    userId?: StringFilter<"Token"> | string
    refreshToken?: StringFilter<"Token"> | string
    createdAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: TokenCountOrderByAggregateInput
    _max?: TokenMaxOrderByAggregateInput
    _min?: TokenMinOrderByAggregateInput
  }

  export type TokenScalarWhereWithAggregatesInput = {
    AND?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    OR?: TokenScalarWhereWithAggregatesInput[]
    NOT?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Token"> | string
    userId?: StringWithAggregatesFilter<"Token"> | string
    refreshToken?: StringWithAggregatesFilter<"Token"> | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Token"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Token"> | Date | string | null
  }

  export type ChatWhereInput = {
    AND?: ChatWhereInput | ChatWhereInput[]
    OR?: ChatWhereInput[]
    NOT?: ChatWhereInput | ChatWhereInput[]
    id?: StringFilter<"Chat"> | string
    type?: EnumChatTypeFilter<"Chat"> | $Enums.ChatType
    name?: StringNullableFilter<"Chat"> | string | null
    description?: StringNullableFilter<"Chat"> | string | null
    avatar?: StringNullableFilter<"Chat"> | string | null
    createdBy?: StringFilter<"Chat"> | string
    createdAt?: DateTimeFilter<"Chat"> | Date | string
    updatedAt?: DateTimeFilter<"Chat"> | Date | string
    userId?: StringNullableFilter<"Chat"> | string | null
    members?: ChatMemberListRelationFilter
    messages?: MessageListRelationFilter
    calls?: CallListRelationFilter
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ChatOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    members?: ChatMemberOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    calls?: CallOrderByRelationAggregateInput
    creator?: UserOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    _relevance?: ChatOrderByRelevanceInput
  }

  export type ChatWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatWhereInput | ChatWhereInput[]
    OR?: ChatWhereInput[]
    NOT?: ChatWhereInput | ChatWhereInput[]
    type?: EnumChatTypeFilter<"Chat"> | $Enums.ChatType
    name?: StringNullableFilter<"Chat"> | string | null
    description?: StringNullableFilter<"Chat"> | string | null
    avatar?: StringNullableFilter<"Chat"> | string | null
    createdBy?: StringFilter<"Chat"> | string
    createdAt?: DateTimeFilter<"Chat"> | Date | string
    updatedAt?: DateTimeFilter<"Chat"> | Date | string
    userId?: StringNullableFilter<"Chat"> | string | null
    members?: ChatMemberListRelationFilter
    messages?: MessageListRelationFilter
    calls?: CallListRelationFilter
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ChatOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: ChatCountOrderByAggregateInput
    _max?: ChatMaxOrderByAggregateInput
    _min?: ChatMinOrderByAggregateInput
  }

  export type ChatScalarWhereWithAggregatesInput = {
    AND?: ChatScalarWhereWithAggregatesInput | ChatScalarWhereWithAggregatesInput[]
    OR?: ChatScalarWhereWithAggregatesInput[]
    NOT?: ChatScalarWhereWithAggregatesInput | ChatScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Chat"> | string
    type?: EnumChatTypeWithAggregatesFilter<"Chat"> | $Enums.ChatType
    name?: StringNullableWithAggregatesFilter<"Chat"> | string | null
    description?: StringNullableWithAggregatesFilter<"Chat"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"Chat"> | string | null
    createdBy?: StringWithAggregatesFilter<"Chat"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Chat"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Chat"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"Chat"> | string | null
  }

  export type ChatMemberWhereInput = {
    AND?: ChatMemberWhereInput | ChatMemberWhereInput[]
    OR?: ChatMemberWhereInput[]
    NOT?: ChatMemberWhereInput | ChatMemberWhereInput[]
    id?: StringFilter<"ChatMember"> | string
    chatId?: StringFilter<"ChatMember"> | string
    userId?: StringFilter<"ChatMember"> | string
    role?: EnumChatMemberRoleFilter<"ChatMember"> | $Enums.ChatMemberRole
    joinedAt?: DateTimeFilter<"ChatMember"> | Date | string
    leftAt?: DateTimeNullableFilter<"ChatMember"> | Date | string | null
    lastReadAt?: DateTimeNullableFilter<"ChatMember"> | Date | string | null
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ChatMemberOrderByWithRelationInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    lastReadAt?: SortOrderInput | SortOrder
    chat?: ChatOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    _relevance?: ChatMemberOrderByRelevanceInput
  }

  export type ChatMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    chatId_userId?: ChatMemberChatIdUserIdCompoundUniqueInput
    AND?: ChatMemberWhereInput | ChatMemberWhereInput[]
    OR?: ChatMemberWhereInput[]
    NOT?: ChatMemberWhereInput | ChatMemberWhereInput[]
    chatId?: StringFilter<"ChatMember"> | string
    userId?: StringFilter<"ChatMember"> | string
    role?: EnumChatMemberRoleFilter<"ChatMember"> | $Enums.ChatMemberRole
    joinedAt?: DateTimeFilter<"ChatMember"> | Date | string
    leftAt?: DateTimeNullableFilter<"ChatMember"> | Date | string | null
    lastReadAt?: DateTimeNullableFilter<"ChatMember"> | Date | string | null
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "chatId_userId">

  export type ChatMemberOrderByWithAggregationInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    lastReadAt?: SortOrderInput | SortOrder
    _count?: ChatMemberCountOrderByAggregateInput
    _max?: ChatMemberMaxOrderByAggregateInput
    _min?: ChatMemberMinOrderByAggregateInput
  }

  export type ChatMemberScalarWhereWithAggregatesInput = {
    AND?: ChatMemberScalarWhereWithAggregatesInput | ChatMemberScalarWhereWithAggregatesInput[]
    OR?: ChatMemberScalarWhereWithAggregatesInput[]
    NOT?: ChatMemberScalarWhereWithAggregatesInput | ChatMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMember"> | string
    chatId?: StringWithAggregatesFilter<"ChatMember"> | string
    userId?: StringWithAggregatesFilter<"ChatMember"> | string
    role?: EnumChatMemberRoleWithAggregatesFilter<"ChatMember"> | $Enums.ChatMemberRole
    joinedAt?: DateTimeWithAggregatesFilter<"ChatMember"> | Date | string
    leftAt?: DateTimeNullableWithAggregatesFilter<"ChatMember"> | Date | string | null
    lastReadAt?: DateTimeNullableWithAggregatesFilter<"ChatMember"> | Date | string | null
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    chatId?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    type?: EnumMessageTypeFilter<"Message"> | $Enums.MessageType
    fileUrl?: StringNullableFilter<"Message"> | string | null
    fileName?: StringNullableFilter<"Message"> | string | null
    fileSize?: IntNullableFilter<"Message"> | number | null
    replyToId?: StringNullableFilter<"Message"> | string | null
    editedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    replyTo?: XOR<MessageNullableScalarRelationFilter, MessageWhereInput> | null
    replies?: MessageListRelationFilter
    readStatus?: MessageReadStatusListRelationFilter
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    chatId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    replyToId?: SortOrderInput | SortOrder
    editedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    chat?: ChatOrderByWithRelationInput
    sender?: UserOrderByWithRelationInput
    replyTo?: MessageOrderByWithRelationInput
    replies?: MessageOrderByRelationAggregateInput
    readStatus?: MessageReadStatusOrderByRelationAggregateInput
    _relevance?: MessageOrderByRelevanceInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    chatId?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    type?: EnumMessageTypeFilter<"Message"> | $Enums.MessageType
    fileUrl?: StringNullableFilter<"Message"> | string | null
    fileName?: StringNullableFilter<"Message"> | string | null
    fileSize?: IntNullableFilter<"Message"> | number | null
    replyToId?: StringNullableFilter<"Message"> | string | null
    editedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    replyTo?: XOR<MessageNullableScalarRelationFilter, MessageWhereInput> | null
    replies?: MessageListRelationFilter
    readStatus?: MessageReadStatusListRelationFilter
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    chatId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    replyToId?: SortOrderInput | SortOrder
    editedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _avg?: MessageAvgOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
    _sum?: MessageSumOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    chatId?: StringWithAggregatesFilter<"Message"> | string
    senderId?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    type?: EnumMessageTypeWithAggregatesFilter<"Message"> | $Enums.MessageType
    fileUrl?: StringNullableWithAggregatesFilter<"Message"> | string | null
    fileName?: StringNullableWithAggregatesFilter<"Message"> | string | null
    fileSize?: IntNullableWithAggregatesFilter<"Message"> | number | null
    replyToId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    editedAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type MessageReadStatusWhereInput = {
    AND?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    OR?: MessageReadStatusWhereInput[]
    NOT?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    id?: StringFilter<"MessageReadStatus"> | string
    messageId?: StringFilter<"MessageReadStatus"> | string
    userId?: StringFilter<"MessageReadStatus"> | string
    readAt?: DateTimeFilter<"MessageReadStatus"> | Date | string
    message?: XOR<MessageScalarRelationFilter, MessageWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MessageReadStatusOrderByWithRelationInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
    message?: MessageOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    _relevance?: MessageReadStatusOrderByRelevanceInput
  }

  export type MessageReadStatusWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    messageId_userId?: MessageReadStatusMessageIdUserIdCompoundUniqueInput
    AND?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    OR?: MessageReadStatusWhereInput[]
    NOT?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    messageId?: StringFilter<"MessageReadStatus"> | string
    userId?: StringFilter<"MessageReadStatus"> | string
    readAt?: DateTimeFilter<"MessageReadStatus"> | Date | string
    message?: XOR<MessageScalarRelationFilter, MessageWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "messageId_userId">

  export type MessageReadStatusOrderByWithAggregationInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
    _count?: MessageReadStatusCountOrderByAggregateInput
    _max?: MessageReadStatusMaxOrderByAggregateInput
    _min?: MessageReadStatusMinOrderByAggregateInput
  }

  export type MessageReadStatusScalarWhereWithAggregatesInput = {
    AND?: MessageReadStatusScalarWhereWithAggregatesInput | MessageReadStatusScalarWhereWithAggregatesInput[]
    OR?: MessageReadStatusScalarWhereWithAggregatesInput[]
    NOT?: MessageReadStatusScalarWhereWithAggregatesInput | MessageReadStatusScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MessageReadStatus"> | string
    messageId?: StringWithAggregatesFilter<"MessageReadStatus"> | string
    userId?: StringWithAggregatesFilter<"MessageReadStatus"> | string
    readAt?: DateTimeWithAggregatesFilter<"MessageReadStatus"> | Date | string
  }

  export type CallWhereInput = {
    AND?: CallWhereInput | CallWhereInput[]
    OR?: CallWhereInput[]
    NOT?: CallWhereInput | CallWhereInput[]
    id?: StringFilter<"Call"> | string
    chatId?: StringFilter<"Call"> | string
    initiatorId?: StringFilter<"Call"> | string
    receiverId?: StringNullableFilter<"Call"> | string | null
    type?: EnumCallTypeFilter<"Call"> | $Enums.CallType
    status?: EnumCallStatusFilter<"Call"> | $Enums.CallStatus
    startedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    duration?: IntNullableFilter<"Call"> | number | null
    createdAt?: DateTimeFilter<"Call"> | Date | string
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>
    initiator?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type CallOrderByWithRelationInput = {
    id?: SortOrder
    chatId?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    chat?: ChatOrderByWithRelationInput
    initiator?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
    _relevance?: CallOrderByRelevanceInput
  }

  export type CallWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CallWhereInput | CallWhereInput[]
    OR?: CallWhereInput[]
    NOT?: CallWhereInput | CallWhereInput[]
    chatId?: StringFilter<"Call"> | string
    initiatorId?: StringFilter<"Call"> | string
    receiverId?: StringNullableFilter<"Call"> | string | null
    type?: EnumCallTypeFilter<"Call"> | $Enums.CallType
    status?: EnumCallStatusFilter<"Call"> | $Enums.CallStatus
    startedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    duration?: IntNullableFilter<"Call"> | number | null
    createdAt?: DateTimeFilter<"Call"> | Date | string
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>
    initiator?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type CallOrderByWithAggregationInput = {
    id?: SortOrder
    chatId?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CallCountOrderByAggregateInput
    _avg?: CallAvgOrderByAggregateInput
    _max?: CallMaxOrderByAggregateInput
    _min?: CallMinOrderByAggregateInput
    _sum?: CallSumOrderByAggregateInput
  }

  export type CallScalarWhereWithAggregatesInput = {
    AND?: CallScalarWhereWithAggregatesInput | CallScalarWhereWithAggregatesInput[]
    OR?: CallScalarWhereWithAggregatesInput[]
    NOT?: CallScalarWhereWithAggregatesInput | CallScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Call"> | string
    chatId?: StringWithAggregatesFilter<"Call"> | string
    initiatorId?: StringWithAggregatesFilter<"Call"> | string
    receiverId?: StringNullableWithAggregatesFilter<"Call"> | string | null
    type?: EnumCallTypeWithAggregatesFilter<"Call"> | $Enums.CallType
    status?: EnumCallStatusWithAggregatesFilter<"Call"> | $Enums.CallStatus
    startedAt?: DateTimeNullableWithAggregatesFilter<"Call"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"Call"> | Date | string | null
    duration?: IntNullableWithAggregatesFilter<"Call"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Call"> | Date | string
  }

  export type FollowWhereInput = {
    AND?: FollowWhereInput | FollowWhereInput[]
    OR?: FollowWhereInput[]
    NOT?: FollowWhereInput | FollowWhereInput[]
    id?: StringFilter<"Follow"> | string
    followerId?: StringFilter<"Follow"> | string
    followingId?: StringFilter<"Follow"> | string
    createdAt?: DateTimeFilter<"Follow"> | Date | string
    follower?: XOR<UserScalarRelationFilter, UserWhereInput>
    following?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FollowOrderByWithRelationInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
    follower?: UserOrderByWithRelationInput
    following?: UserOrderByWithRelationInput
    _relevance?: FollowOrderByRelevanceInput
  }

  export type FollowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    followerId_followingId?: FollowFollowerIdFollowingIdCompoundUniqueInput
    AND?: FollowWhereInput | FollowWhereInput[]
    OR?: FollowWhereInput[]
    NOT?: FollowWhereInput | FollowWhereInput[]
    followerId?: StringFilter<"Follow"> | string
    followingId?: StringFilter<"Follow"> | string
    createdAt?: DateTimeFilter<"Follow"> | Date | string
    follower?: XOR<UserScalarRelationFilter, UserWhereInput>
    following?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "followerId_followingId">

  export type FollowOrderByWithAggregationInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
    _count?: FollowCountOrderByAggregateInput
    _max?: FollowMaxOrderByAggregateInput
    _min?: FollowMinOrderByAggregateInput
  }

  export type FollowScalarWhereWithAggregatesInput = {
    AND?: FollowScalarWhereWithAggregatesInput | FollowScalarWhereWithAggregatesInput[]
    OR?: FollowScalarWhereWithAggregatesInput[]
    NOT?: FollowScalarWhereWithAggregatesInput | FollowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Follow"> | string
    followerId?: StringWithAggregatesFilter<"Follow"> | string
    followingId?: StringWithAggregatesFilter<"Follow"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Follow"> | Date | string
  }

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: StringFilter<"Profile"> | string
    userId?: StringFilter<"Profile"> | string
    name?: StringNullableFilter<"Profile"> | string | null
    about?: StringNullableFilter<"Profile"> | string | null
    avatar?: StringNullableFilter<"Profile"> | string | null
    hero?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrderInput | SortOrder
    about?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    hero?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: ProfileOrderByRelevanceInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    name?: StringNullableFilter<"Profile"> | string | null
    about?: StringNullableFilter<"Profile"> | string | null
    avatar?: StringNullableFilter<"Profile"> | string | null
    hero?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrderInput | SortOrder
    about?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    hero?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Profile"> | string
    userId?: StringWithAggregatesFilter<"Profile"> | string
    name?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    about?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    hero?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: StringFilter<"Post"> | string
    userId?: StringFilter<"Post"> | string
    authorId?: StringNullableFilter<"Post"> | string | null
    text?: StringNullableFilter<"Post"> | string | null
    image?: StringNullableFilter<"Post"> | string | null
    audio?: StringNullableFilter<"Post"> | string | null
    video?: StringNullableFilter<"Post"> | string | null
    link?: StringNullableFilter<"Post"> | string | null
    views?: IntFilter<"Post"> | number
    originalPostId?: StringNullableFilter<"Post"> | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    author?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    originalPost?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null
    reposts?: PostListRelationFilter
    likes?: PostLikeListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    authorId?: SortOrderInput | SortOrder
    text?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    audio?: SortOrderInput | SortOrder
    video?: SortOrderInput | SortOrder
    link?: SortOrderInput | SortOrder
    views?: SortOrder
    originalPostId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
    originalPost?: PostOrderByWithRelationInput
    reposts?: PostOrderByRelationAggregateInput
    likes?: PostLikeOrderByRelationAggregateInput
    _relevance?: PostOrderByRelevanceInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    userId?: StringFilter<"Post"> | string
    authorId?: StringNullableFilter<"Post"> | string | null
    text?: StringNullableFilter<"Post"> | string | null
    image?: StringNullableFilter<"Post"> | string | null
    audio?: StringNullableFilter<"Post"> | string | null
    video?: StringNullableFilter<"Post"> | string | null
    link?: StringNullableFilter<"Post"> | string | null
    views?: IntFilter<"Post"> | number
    originalPostId?: StringNullableFilter<"Post"> | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    author?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    originalPost?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null
    reposts?: PostListRelationFilter
    likes?: PostLikeListRelationFilter
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    authorId?: SortOrderInput | SortOrder
    text?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    audio?: SortOrderInput | SortOrder
    video?: SortOrderInput | SortOrder
    link?: SortOrderInput | SortOrder
    views?: SortOrder
    originalPostId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Post"> | string
    userId?: StringWithAggregatesFilter<"Post"> | string
    authorId?: StringNullableWithAggregatesFilter<"Post"> | string | null
    text?: StringNullableWithAggregatesFilter<"Post"> | string | null
    image?: StringNullableWithAggregatesFilter<"Post"> | string | null
    audio?: StringNullableWithAggregatesFilter<"Post"> | string | null
    video?: StringNullableWithAggregatesFilter<"Post"> | string | null
    link?: StringNullableWithAggregatesFilter<"Post"> | string | null
    views?: IntWithAggregatesFilter<"Post"> | number
    originalPostId?: StringNullableWithAggregatesFilter<"Post"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null
  }

  export type PostLikeWhereInput = {
    AND?: PostLikeWhereInput | PostLikeWhereInput[]
    OR?: PostLikeWhereInput[]
    NOT?: PostLikeWhereInput | PostLikeWhereInput[]
    id?: StringFilter<"PostLike"> | string
    postId?: StringFilter<"PostLike"> | string
    userId?: StringFilter<"PostLike"> | string
    isLike?: BoolFilter<"PostLike"> | boolean
    createdAt?: DateTimeFilter<"PostLike"> | Date | string
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PostLikeOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    isLike?: SortOrder
    createdAt?: SortOrder
    post?: PostOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    _relevance?: PostLikeOrderByRelevanceInput
  }

  export type PostLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    postId_userId?: PostLikePostIdUserIdCompoundUniqueInput
    AND?: PostLikeWhereInput | PostLikeWhereInput[]
    OR?: PostLikeWhereInput[]
    NOT?: PostLikeWhereInput | PostLikeWhereInput[]
    postId?: StringFilter<"PostLike"> | string
    userId?: StringFilter<"PostLike"> | string
    isLike?: BoolFilter<"PostLike"> | boolean
    createdAt?: DateTimeFilter<"PostLike"> | Date | string
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "postId_userId">

  export type PostLikeOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    isLike?: SortOrder
    createdAt?: SortOrder
    _count?: PostLikeCountOrderByAggregateInput
    _max?: PostLikeMaxOrderByAggregateInput
    _min?: PostLikeMinOrderByAggregateInput
  }

  export type PostLikeScalarWhereWithAggregatesInput = {
    AND?: PostLikeScalarWhereWithAggregatesInput | PostLikeScalarWhereWithAggregatesInput[]
    OR?: PostLikeScalarWhereWithAggregatesInput[]
    NOT?: PostLikeScalarWhereWithAggregatesInput | PostLikeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PostLike"> | string
    postId?: StringWithAggregatesFilter<"PostLike"> | string
    userId?: StringWithAggregatesFilter<"PostLike"> | string
    isLike?: BoolWithAggregatesFilter<"PostLike"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PostLike"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TokenCreateInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTokensInput
  }

  export type TokenUncheckedCreateInput = {
    id?: string
    userId: string
    refreshToken: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTokensNestedInput
  }

  export type TokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TokenCreateManyInput = {
    id?: string
    userId: string
    refreshToken: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatCreateInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ChatMemberCreateNestedManyWithoutChatInput
    messages?: MessageCreateNestedManyWithoutChatInput
    calls?: CallCreateNestedManyWithoutChatInput
    creator: UserCreateNestedOneWithoutCreatedChatsInput
    user?: UserCreateNestedOneWithoutChatsInput
  }

  export type ChatUncheckedCreateInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    members?: ChatMemberUncheckedCreateNestedManyWithoutChatInput
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput
    calls?: CallUncheckedCreateNestedManyWithoutChatInput
  }

  export type ChatUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ChatMemberUpdateManyWithoutChatNestedInput
    messages?: MessageUpdateManyWithoutChatNestedInput
    calls?: CallUpdateManyWithoutChatNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedChatsNestedInput
    user?: UserUpdateOneWithoutChatsNestedInput
  }

  export type ChatUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ChatMemberUncheckedUpdateManyWithoutChatNestedInput
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput
    calls?: CallUncheckedUpdateManyWithoutChatNestedInput
  }

  export type ChatCreateManyInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ChatUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatMemberCreateInput = {
    id?: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
    chat: ChatCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutChatMembersInput
  }

  export type ChatMemberUncheckedCreateInput = {
    id?: string
    chatId: string
    userId: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
  }

  export type ChatMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    chat?: ChatUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutChatMembersNestedInput
  }

  export type ChatMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatMemberCreateManyInput = {
    id?: string
    chatId: string
    userId: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
  }

  export type ChatMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageCreateInput = {
    id?: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chat: ChatCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessagesInput
    replyTo?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    chatId: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: MessageUncheckedCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput
    replyTo?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: MessageUncheckedUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageCreateManyInput = {
    id?: string
    chatId: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusCreateInput = {
    id?: string
    readAt?: Date | string
    message: MessageCreateNestedOneWithoutReadStatusInput
    user: UserCreateNestedOneWithoutMessageReadsInput
  }

  export type MessageReadStatusUncheckedCreateInput = {
    id?: string
    messageId: string
    userId: string
    readAt?: Date | string
  }

  export type MessageReadStatusUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: MessageUpdateOneRequiredWithoutReadStatusNestedInput
    user?: UserUpdateOneRequiredWithoutMessageReadsNestedInput
  }

  export type MessageReadStatusUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusCreateManyInput = {
    id?: string
    messageId: string
    userId: string
    readAt?: Date | string
  }

  export type MessageReadStatusUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallCreateInput = {
    id?: string
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    chat: ChatCreateNestedOneWithoutCallsInput
    initiator: UserCreateNestedOneWithoutSentCallsInput
    receiver?: UserCreateNestedOneWithoutReceivedCallsInput
  }

  export type CallUncheckedCreateInput = {
    id?: string
    chatId: string
    initiatorId: string
    receiverId?: string | null
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type CallUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutCallsNestedInput
    initiator?: UserUpdateOneRequiredWithoutSentCallsNestedInput
    receiver?: UserUpdateOneWithoutReceivedCallsNestedInput
  }

  export type CallUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallCreateManyInput = {
    id?: string
    chatId: string
    initiatorId: string
    receiverId?: string | null
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type CallUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowCreateInput = {
    id?: string
    createdAt?: Date | string
    follower: UserCreateNestedOneWithoutFollowersInput
    following: UserCreateNestedOneWithoutFollowingInput
  }

  export type FollowUncheckedCreateInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    follower?: UserUpdateOneRequiredWithoutFollowersNestedInput
    following?: UserUpdateOneRequiredWithoutFollowingNestedInput
  }

  export type FollowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowCreateManyInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    name?: string | null
    about?: string | null
    avatar?: string | null
    hero?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    userId: string
    name?: string | null
    about?: string | null
    avatar?: string | null
    hero?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    about?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    about?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateManyInput = {
    id?: string
    userId: string
    name?: string | null
    about?: string | null
    avatar?: string | null
    hero?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    about?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    about?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateInput = {
    id?: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPostsInput
    author?: UserCreateNestedOneWithoutAuthoredPostsInput
    originalPost?: PostCreateNestedOneWithoutRepostsInput
    reposts?: PostCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: string
    userId: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reposts?: PostUncheckedCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPostsNestedInput
    author?: UserUpdateOneWithoutAuthoredPostsNestedInput
    originalPost?: PostUpdateOneWithoutRepostsNestedInput
    reposts?: PostUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reposts?: PostUncheckedUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: string
    userId: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostLikeCreateInput = {
    id?: string
    isLike?: boolean
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutLikesInput
    user: UserCreateNestedOneWithoutPostLikesInput
  }

  export type PostLikeUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    isLike?: boolean
    createdAt?: Date | string
  }

  export type PostLikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutLikesNestedInput
    user?: UserUpdateOneRequiredWithoutPostLikesNestedInput
  }

  export type PostLikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeCreateManyInput = {
    id?: string
    postId: string
    userId: string
    isLike?: boolean
    createdAt?: Date | string
  }

  export type PostLikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type Enumuser_rolesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_roles | Enumuser_rolesFieldRefInput<$PrismaModel>
    in?: $Enums.user_roles[]
    notIn?: $Enums.user_roles[]
    not?: NestedEnumuser_rolesFilter<$PrismaModel> | $Enums.user_roles
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TokenListRelationFilter = {
    every?: TokenWhereInput
    some?: TokenWhereInput
    none?: TokenWhereInput
  }

  export type ChatListRelationFilter = {
    every?: ChatWhereInput
    some?: ChatWhereInput
    none?: ChatWhereInput
  }

  export type ChatMemberListRelationFilter = {
    every?: ChatMemberWhereInput
    some?: ChatMemberWhereInput
    none?: ChatMemberWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type CallListRelationFilter = {
    every?: CallWhereInput
    some?: CallWhereInput
    none?: CallWhereInput
  }

  export type MessageReadStatusListRelationFilter = {
    every?: MessageReadStatusWhereInput
    some?: MessageReadStatusWhereInput
    none?: MessageReadStatusWhereInput
  }

  export type FollowListRelationFilter = {
    every?: FollowWhereInput
    some?: FollowWhereInput
    none?: FollowWhereInput
  }

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type PostLikeListRelationFilter = {
    every?: PostLikeWhereInput
    some?: PostLikeWhereInput
    none?: PostLikeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CallOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageReadStatusOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FollowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    isAcivated?: SortOrder
    activationLink?: SortOrder
    role?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    isAcivated?: SortOrder
    activationLink?: SortOrder
    role?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    isAcivated?: SortOrder
    activationLink?: SortOrder
    role?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type Enumuser_rolesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_roles | Enumuser_rolesFieldRefInput<$PrismaModel>
    in?: $Enums.user_roles[]
    notIn?: $Enums.user_roles[]
    not?: NestedEnumuser_rolesWithAggregatesFilter<$PrismaModel> | $Enums.user_roles
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_rolesFilter<$PrismaModel>
    _max?: NestedEnumuser_rolesFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TokenOrderByRelevanceInput = {
    fields: TokenOrderByRelevanceFieldEnum | TokenOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumChatTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[]
    notIn?: $Enums.ChatType[]
    not?: NestedEnumChatTypeFilter<$PrismaModel> | $Enums.ChatType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ChatOrderByRelevanceInput = {
    fields: ChatOrderByRelevanceFieldEnum | ChatOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ChatCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    avatar?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ChatMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    avatar?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ChatMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    avatar?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type EnumChatTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[]
    notIn?: $Enums.ChatType[]
    not?: NestedEnumChatTypeWithAggregatesFilter<$PrismaModel> | $Enums.ChatType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatTypeFilter<$PrismaModel>
    _max?: NestedEnumChatTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumChatMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMemberRole | EnumChatMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ChatMemberRole[]
    notIn?: $Enums.ChatMemberRole[]
    not?: NestedEnumChatMemberRoleFilter<$PrismaModel> | $Enums.ChatMemberRole
  }

  export type ChatScalarRelationFilter = {
    is?: ChatWhereInput
    isNot?: ChatWhereInput
  }

  export type ChatMemberOrderByRelevanceInput = {
    fields: ChatMemberOrderByRelevanceFieldEnum | ChatMemberOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ChatMemberChatIdUserIdCompoundUniqueInput = {
    chatId: string
    userId: string
  }

  export type ChatMemberCountOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
    lastReadAt?: SortOrder
  }

  export type ChatMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
    lastReadAt?: SortOrder
  }

  export type ChatMemberMinOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
    lastReadAt?: SortOrder
  }

  export type EnumChatMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMemberRole | EnumChatMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ChatMemberRole[]
    notIn?: $Enums.ChatMemberRole[]
    not?: NestedEnumChatMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.ChatMemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumChatMemberRoleFilter<$PrismaModel>
  }

  export type EnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[]
    notIn?: $Enums.MessageType[]
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type MessageNullableScalarRelationFilter = {
    is?: MessageWhereInput | null
    isNot?: MessageWhereInput | null
  }

  export type MessageOrderByRelevanceInput = {
    fields: MessageOrderByRelevanceFieldEnum | MessageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    replyToId?: SortOrder
    editedAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    replyToId?: SortOrder
    editedAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    replyToId?: SortOrder
    editedAt?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type EnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[]
    notIn?: $Enums.MessageType[]
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type MessageScalarRelationFilter = {
    is?: MessageWhereInput
    isNot?: MessageWhereInput
  }

  export type MessageReadStatusOrderByRelevanceInput = {
    fields: MessageReadStatusOrderByRelevanceFieldEnum | MessageReadStatusOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MessageReadStatusMessageIdUserIdCompoundUniqueInput = {
    messageId: string
    userId: string
  }

  export type MessageReadStatusCountOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
  }

  export type MessageReadStatusMaxOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
  }

  export type MessageReadStatusMinOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
  }

  export type EnumCallTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CallType | EnumCallTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CallType[]
    notIn?: $Enums.CallType[]
    not?: NestedEnumCallTypeFilter<$PrismaModel> | $Enums.CallType
  }

  export type EnumCallStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CallStatus | EnumCallStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CallStatus[]
    notIn?: $Enums.CallStatus[]
    not?: NestedEnumCallStatusFilter<$PrismaModel> | $Enums.CallStatus
  }

  export type CallOrderByRelevanceInput = {
    fields: CallOrderByRelevanceFieldEnum | CallOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CallCountOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
  }

  export type CallAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type CallMaxOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
  }

  export type CallMinOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    initiatorId?: SortOrder
    receiverId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
  }

  export type CallSumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type EnumCallTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CallType | EnumCallTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CallType[]
    notIn?: $Enums.CallType[]
    not?: NestedEnumCallTypeWithAggregatesFilter<$PrismaModel> | $Enums.CallType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCallTypeFilter<$PrismaModel>
    _max?: NestedEnumCallTypeFilter<$PrismaModel>
  }

  export type EnumCallStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CallStatus | EnumCallStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CallStatus[]
    notIn?: $Enums.CallStatus[]
    not?: NestedEnumCallStatusWithAggregatesFilter<$PrismaModel> | $Enums.CallStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCallStatusFilter<$PrismaModel>
    _max?: NestedEnumCallStatusFilter<$PrismaModel>
  }

  export type FollowOrderByRelevanceInput = {
    fields: FollowOrderByRelevanceFieldEnum | FollowOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FollowFollowerIdFollowingIdCompoundUniqueInput = {
    followerId: string
    followingId: string
  }

  export type FollowCountOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type FollowMaxOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type FollowMinOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProfileOrderByRelevanceInput = {
    fields: ProfileOrderByRelevanceFieldEnum | ProfileOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    about?: SortOrder
    avatar?: SortOrder
    hero?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    about?: SortOrder
    avatar?: SortOrder
    hero?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    about?: SortOrder
    avatar?: SortOrder
    hero?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PostNullableScalarRelationFilter = {
    is?: PostWhereInput | null
    isNot?: PostWhereInput | null
  }

  export type PostOrderByRelevanceInput = {
    fields: PostOrderByRelevanceFieldEnum | PostOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    image?: SortOrder
    audio?: SortOrder
    video?: SortOrder
    link?: SortOrder
    views?: SortOrder
    originalPostId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    views?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    image?: SortOrder
    audio?: SortOrder
    video?: SortOrder
    link?: SortOrder
    views?: SortOrder
    originalPostId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authorId?: SortOrder
    text?: SortOrder
    image?: SortOrder
    audio?: SortOrder
    video?: SortOrder
    link?: SortOrder
    views?: SortOrder
    originalPostId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    views?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type PostScalarRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type PostLikeOrderByRelevanceInput = {
    fields: PostLikeOrderByRelevanceFieldEnum | PostLikeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PostLikePostIdUserIdCompoundUniqueInput = {
    postId: string
    userId: string
  }

  export type PostLikeCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    isLike?: SortOrder
    createdAt?: SortOrder
  }

  export type PostLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    isLike?: SortOrder
    createdAt?: SortOrder
  }

  export type PostLikeMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    isLike?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
  }

  export type ChatCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ChatCreateWithoutCreatorInput, ChatUncheckedCreateWithoutCreatorInput> | ChatCreateWithoutCreatorInput[] | ChatUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutCreatorInput | ChatCreateOrConnectWithoutCreatorInput[]
    createMany?: ChatCreateManyCreatorInputEnvelope
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
  }

  export type ChatMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatMemberCreateWithoutUserInput, ChatMemberUncheckedCreateWithoutUserInput> | ChatMemberCreateWithoutUserInput[] | ChatMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutUserInput | ChatMemberCreateOrConnectWithoutUserInput[]
    createMany?: ChatMemberCreateManyUserInputEnvelope
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CallCreateNestedManyWithoutInitiatorInput = {
    create?: XOR<CallCreateWithoutInitiatorInput, CallUncheckedCreateWithoutInitiatorInput> | CallCreateWithoutInitiatorInput[] | CallUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: CallCreateOrConnectWithoutInitiatorInput | CallCreateOrConnectWithoutInitiatorInput[]
    createMany?: CallCreateManyInitiatorInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type CallCreateNestedManyWithoutReceiverInput = {
    create?: XOR<CallCreateWithoutReceiverInput, CallUncheckedCreateWithoutReceiverInput> | CallCreateWithoutReceiverInput[] | CallUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: CallCreateOrConnectWithoutReceiverInput | CallCreateOrConnectWithoutReceiverInput[]
    createMany?: CallCreateManyReceiverInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type MessageReadStatusCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageReadStatusCreateWithoutUserInput, MessageReadStatusUncheckedCreateWithoutUserInput> | MessageReadStatusCreateWithoutUserInput[] | MessageReadStatusUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutUserInput | MessageReadStatusCreateOrConnectWithoutUserInput[]
    createMany?: MessageReadStatusCreateManyUserInputEnvelope
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
  }

  export type ChatCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatCreateWithoutUserInput, ChatUncheckedCreateWithoutUserInput> | ChatCreateWithoutUserInput[] | ChatUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutUserInput | ChatCreateOrConnectWithoutUserInput[]
    createMany?: ChatCreateManyUserInputEnvelope
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
  }

  export type FollowCreateNestedManyWithoutFollowerInput = {
    create?: XOR<FollowCreateWithoutFollowerInput, FollowUncheckedCreateWithoutFollowerInput> | FollowCreateWithoutFollowerInput[] | FollowUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowerInput | FollowCreateOrConnectWithoutFollowerInput[]
    createMany?: FollowCreateManyFollowerInputEnvelope
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
  }

  export type FollowCreateNestedManyWithoutFollowingInput = {
    create?: XOR<FollowCreateWithoutFollowingInput, FollowUncheckedCreateWithoutFollowingInput> | FollowCreateWithoutFollowingInput[] | FollowUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowingInput | FollowCreateOrConnectWithoutFollowingInput[]
    createMany?: FollowCreateManyFollowingInputEnvelope
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
  }

  export type ProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    connect?: ProfileWhereUniqueInput
  }

  export type PostCreateNestedManyWithoutUserInput = {
    create?: XOR<PostCreateWithoutUserInput, PostUncheckedCreateWithoutUserInput> | PostCreateWithoutUserInput[] | PostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostCreateOrConnectWithoutUserInput | PostCreateOrConnectWithoutUserInput[]
    createMany?: PostCreateManyUserInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostLikeCreateNestedManyWithoutUserInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type TokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
  }

  export type ChatUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<ChatCreateWithoutCreatorInput, ChatUncheckedCreateWithoutCreatorInput> | ChatCreateWithoutCreatorInput[] | ChatUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutCreatorInput | ChatCreateOrConnectWithoutCreatorInput[]
    createMany?: ChatCreateManyCreatorInputEnvelope
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
  }

  export type ChatMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatMemberCreateWithoutUserInput, ChatMemberUncheckedCreateWithoutUserInput> | ChatMemberCreateWithoutUserInput[] | ChatMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutUserInput | ChatMemberCreateOrConnectWithoutUserInput[]
    createMany?: ChatMemberCreateManyUserInputEnvelope
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CallUncheckedCreateNestedManyWithoutInitiatorInput = {
    create?: XOR<CallCreateWithoutInitiatorInput, CallUncheckedCreateWithoutInitiatorInput> | CallCreateWithoutInitiatorInput[] | CallUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: CallCreateOrConnectWithoutInitiatorInput | CallCreateOrConnectWithoutInitiatorInput[]
    createMany?: CallCreateManyInitiatorInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type CallUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<CallCreateWithoutReceiverInput, CallUncheckedCreateWithoutReceiverInput> | CallCreateWithoutReceiverInput[] | CallUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: CallCreateOrConnectWithoutReceiverInput | CallCreateOrConnectWithoutReceiverInput[]
    createMany?: CallCreateManyReceiverInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type MessageReadStatusUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageReadStatusCreateWithoutUserInput, MessageReadStatusUncheckedCreateWithoutUserInput> | MessageReadStatusCreateWithoutUserInput[] | MessageReadStatusUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutUserInput | MessageReadStatusCreateOrConnectWithoutUserInput[]
    createMany?: MessageReadStatusCreateManyUserInputEnvelope
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
  }

  export type ChatUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatCreateWithoutUserInput, ChatUncheckedCreateWithoutUserInput> | ChatCreateWithoutUserInput[] | ChatUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutUserInput | ChatCreateOrConnectWithoutUserInput[]
    createMany?: ChatCreateManyUserInputEnvelope
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
  }

  export type FollowUncheckedCreateNestedManyWithoutFollowerInput = {
    create?: XOR<FollowCreateWithoutFollowerInput, FollowUncheckedCreateWithoutFollowerInput> | FollowCreateWithoutFollowerInput[] | FollowUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowerInput | FollowCreateOrConnectWithoutFollowerInput[]
    createMany?: FollowCreateManyFollowerInputEnvelope
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
  }

  export type FollowUncheckedCreateNestedManyWithoutFollowingInput = {
    create?: XOR<FollowCreateWithoutFollowingInput, FollowUncheckedCreateWithoutFollowingInput> | FollowCreateWithoutFollowingInput[] | FollowUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowingInput | FollowCreateOrConnectWithoutFollowingInput[]
    createMany?: FollowCreateManyFollowingInputEnvelope
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
  }

  export type ProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    connect?: ProfileWhereUniqueInput
  }

  export type PostUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PostCreateWithoutUserInput, PostUncheckedCreateWithoutUserInput> | PostCreateWithoutUserInput[] | PostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostCreateOrConnectWithoutUserInput | PostCreateOrConnectWithoutUserInput[]
    createMany?: PostCreateManyUserInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostLikeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type Enumuser_rolesFieldUpdateOperationsInput = {
    set?: $Enums.user_roles
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    upsert?: TokenUpsertWithWhereUniqueWithoutUserInput | TokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    set?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    disconnect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    delete?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    update?: TokenUpdateWithWhereUniqueWithoutUserInput | TokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUpdateManyWithWhereWithoutUserInput | TokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenScalarWhereInput | TokenScalarWhereInput[]
  }

  export type ChatUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ChatCreateWithoutCreatorInput, ChatUncheckedCreateWithoutCreatorInput> | ChatCreateWithoutCreatorInput[] | ChatUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutCreatorInput | ChatCreateOrConnectWithoutCreatorInput[]
    upsert?: ChatUpsertWithWhereUniqueWithoutCreatorInput | ChatUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ChatCreateManyCreatorInputEnvelope
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    update?: ChatUpdateWithWhereUniqueWithoutCreatorInput | ChatUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ChatUpdateManyWithWhereWithoutCreatorInput | ChatUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[]
  }

  export type ChatMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatMemberCreateWithoutUserInput, ChatMemberUncheckedCreateWithoutUserInput> | ChatMemberCreateWithoutUserInput[] | ChatMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutUserInput | ChatMemberCreateOrConnectWithoutUserInput[]
    upsert?: ChatMemberUpsertWithWhereUniqueWithoutUserInput | ChatMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatMemberCreateManyUserInputEnvelope
    set?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    disconnect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    delete?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    update?: ChatMemberUpdateWithWhereUniqueWithoutUserInput | ChatMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatMemberUpdateManyWithWhereWithoutUserInput | ChatMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatMemberScalarWhereInput | ChatMemberScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CallUpdateManyWithoutInitiatorNestedInput = {
    create?: XOR<CallCreateWithoutInitiatorInput, CallUncheckedCreateWithoutInitiatorInput> | CallCreateWithoutInitiatorInput[] | CallUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: CallCreateOrConnectWithoutInitiatorInput | CallCreateOrConnectWithoutInitiatorInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutInitiatorInput | CallUpsertWithWhereUniqueWithoutInitiatorInput[]
    createMany?: CallCreateManyInitiatorInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutInitiatorInput | CallUpdateWithWhereUniqueWithoutInitiatorInput[]
    updateMany?: CallUpdateManyWithWhereWithoutInitiatorInput | CallUpdateManyWithWhereWithoutInitiatorInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type CallUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<CallCreateWithoutReceiverInput, CallUncheckedCreateWithoutReceiverInput> | CallCreateWithoutReceiverInput[] | CallUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: CallCreateOrConnectWithoutReceiverInput | CallCreateOrConnectWithoutReceiverInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutReceiverInput | CallUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: CallCreateManyReceiverInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutReceiverInput | CallUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: CallUpdateManyWithWhereWithoutReceiverInput | CallUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type MessageReadStatusUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageReadStatusCreateWithoutUserInput, MessageReadStatusUncheckedCreateWithoutUserInput> | MessageReadStatusCreateWithoutUserInput[] | MessageReadStatusUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutUserInput | MessageReadStatusCreateOrConnectWithoutUserInput[]
    upsert?: MessageReadStatusUpsertWithWhereUniqueWithoutUserInput | MessageReadStatusUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageReadStatusCreateManyUserInputEnvelope
    set?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    disconnect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    delete?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    update?: MessageReadStatusUpdateWithWhereUniqueWithoutUserInput | MessageReadStatusUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageReadStatusUpdateManyWithWhereWithoutUserInput | MessageReadStatusUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageReadStatusScalarWhereInput | MessageReadStatusScalarWhereInput[]
  }

  export type ChatUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatCreateWithoutUserInput, ChatUncheckedCreateWithoutUserInput> | ChatCreateWithoutUserInput[] | ChatUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutUserInput | ChatCreateOrConnectWithoutUserInput[]
    upsert?: ChatUpsertWithWhereUniqueWithoutUserInput | ChatUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatCreateManyUserInputEnvelope
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    update?: ChatUpdateWithWhereUniqueWithoutUserInput | ChatUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatUpdateManyWithWhereWithoutUserInput | ChatUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[]
  }

  export type FollowUpdateManyWithoutFollowerNestedInput = {
    create?: XOR<FollowCreateWithoutFollowerInput, FollowUncheckedCreateWithoutFollowerInput> | FollowCreateWithoutFollowerInput[] | FollowUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowerInput | FollowCreateOrConnectWithoutFollowerInput[]
    upsert?: FollowUpsertWithWhereUniqueWithoutFollowerInput | FollowUpsertWithWhereUniqueWithoutFollowerInput[]
    createMany?: FollowCreateManyFollowerInputEnvelope
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    update?: FollowUpdateWithWhereUniqueWithoutFollowerInput | FollowUpdateWithWhereUniqueWithoutFollowerInput[]
    updateMany?: FollowUpdateManyWithWhereWithoutFollowerInput | FollowUpdateManyWithWhereWithoutFollowerInput[]
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[]
  }

  export type FollowUpdateManyWithoutFollowingNestedInput = {
    create?: XOR<FollowCreateWithoutFollowingInput, FollowUncheckedCreateWithoutFollowingInput> | FollowCreateWithoutFollowingInput[] | FollowUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowingInput | FollowCreateOrConnectWithoutFollowingInput[]
    upsert?: FollowUpsertWithWhereUniqueWithoutFollowingInput | FollowUpsertWithWhereUniqueWithoutFollowingInput[]
    createMany?: FollowCreateManyFollowingInputEnvelope
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    update?: FollowUpdateWithWhereUniqueWithoutFollowingInput | FollowUpdateWithWhereUniqueWithoutFollowingInput[]
    updateMany?: FollowUpdateManyWithWhereWithoutFollowingInput | FollowUpdateManyWithWhereWithoutFollowingInput[]
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[]
  }

  export type ProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    upsert?: ProfileUpsertWithoutUserInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutUserInput, ProfileUpdateWithoutUserInput>, ProfileUncheckedUpdateWithoutUserInput>
  }

  export type PostUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostCreateWithoutUserInput, PostUncheckedCreateWithoutUserInput> | PostCreateWithoutUserInput[] | PostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostCreateOrConnectWithoutUserInput | PostCreateOrConnectWithoutUserInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutUserInput | PostUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostCreateManyUserInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutUserInput | PostUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostUpdateManyWithWhereWithoutUserInput | PostUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostLikeUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutUserInput | PostLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutUserInput | PostLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutUserInput | PostLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type TokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    upsert?: TokenUpsertWithWhereUniqueWithoutUserInput | TokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    set?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    disconnect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    delete?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    update?: TokenUpdateWithWhereUniqueWithoutUserInput | TokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUpdateManyWithWhereWithoutUserInput | TokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenScalarWhereInput | TokenScalarWhereInput[]
  }

  export type ChatUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<ChatCreateWithoutCreatorInput, ChatUncheckedCreateWithoutCreatorInput> | ChatCreateWithoutCreatorInput[] | ChatUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutCreatorInput | ChatCreateOrConnectWithoutCreatorInput[]
    upsert?: ChatUpsertWithWhereUniqueWithoutCreatorInput | ChatUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: ChatCreateManyCreatorInputEnvelope
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    update?: ChatUpdateWithWhereUniqueWithoutCreatorInput | ChatUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: ChatUpdateManyWithWhereWithoutCreatorInput | ChatUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[]
  }

  export type ChatMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatMemberCreateWithoutUserInput, ChatMemberUncheckedCreateWithoutUserInput> | ChatMemberCreateWithoutUserInput[] | ChatMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutUserInput | ChatMemberCreateOrConnectWithoutUserInput[]
    upsert?: ChatMemberUpsertWithWhereUniqueWithoutUserInput | ChatMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatMemberCreateManyUserInputEnvelope
    set?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    disconnect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    delete?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    update?: ChatMemberUpdateWithWhereUniqueWithoutUserInput | ChatMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatMemberUpdateManyWithWhereWithoutUserInput | ChatMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatMemberScalarWhereInput | ChatMemberScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CallUncheckedUpdateManyWithoutInitiatorNestedInput = {
    create?: XOR<CallCreateWithoutInitiatorInput, CallUncheckedCreateWithoutInitiatorInput> | CallCreateWithoutInitiatorInput[] | CallUncheckedCreateWithoutInitiatorInput[]
    connectOrCreate?: CallCreateOrConnectWithoutInitiatorInput | CallCreateOrConnectWithoutInitiatorInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutInitiatorInput | CallUpsertWithWhereUniqueWithoutInitiatorInput[]
    createMany?: CallCreateManyInitiatorInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutInitiatorInput | CallUpdateWithWhereUniqueWithoutInitiatorInput[]
    updateMany?: CallUpdateManyWithWhereWithoutInitiatorInput | CallUpdateManyWithWhereWithoutInitiatorInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type CallUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<CallCreateWithoutReceiverInput, CallUncheckedCreateWithoutReceiverInput> | CallCreateWithoutReceiverInput[] | CallUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: CallCreateOrConnectWithoutReceiverInput | CallCreateOrConnectWithoutReceiverInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutReceiverInput | CallUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: CallCreateManyReceiverInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutReceiverInput | CallUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: CallUpdateManyWithWhereWithoutReceiverInput | CallUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageReadStatusCreateWithoutUserInput, MessageReadStatusUncheckedCreateWithoutUserInput> | MessageReadStatusCreateWithoutUserInput[] | MessageReadStatusUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutUserInput | MessageReadStatusCreateOrConnectWithoutUserInput[]
    upsert?: MessageReadStatusUpsertWithWhereUniqueWithoutUserInput | MessageReadStatusUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageReadStatusCreateManyUserInputEnvelope
    set?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    disconnect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    delete?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    update?: MessageReadStatusUpdateWithWhereUniqueWithoutUserInput | MessageReadStatusUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageReadStatusUpdateManyWithWhereWithoutUserInput | MessageReadStatusUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageReadStatusScalarWhereInput | MessageReadStatusScalarWhereInput[]
  }

  export type ChatUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatCreateWithoutUserInput, ChatUncheckedCreateWithoutUserInput> | ChatCreateWithoutUserInput[] | ChatUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatCreateOrConnectWithoutUserInput | ChatCreateOrConnectWithoutUserInput[]
    upsert?: ChatUpsertWithWhereUniqueWithoutUserInput | ChatUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatCreateManyUserInputEnvelope
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[]
    update?: ChatUpdateWithWhereUniqueWithoutUserInput | ChatUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatUpdateManyWithWhereWithoutUserInput | ChatUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[]
  }

  export type FollowUncheckedUpdateManyWithoutFollowerNestedInput = {
    create?: XOR<FollowCreateWithoutFollowerInput, FollowUncheckedCreateWithoutFollowerInput> | FollowCreateWithoutFollowerInput[] | FollowUncheckedCreateWithoutFollowerInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowerInput | FollowCreateOrConnectWithoutFollowerInput[]
    upsert?: FollowUpsertWithWhereUniqueWithoutFollowerInput | FollowUpsertWithWhereUniqueWithoutFollowerInput[]
    createMany?: FollowCreateManyFollowerInputEnvelope
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    update?: FollowUpdateWithWhereUniqueWithoutFollowerInput | FollowUpdateWithWhereUniqueWithoutFollowerInput[]
    updateMany?: FollowUpdateManyWithWhereWithoutFollowerInput | FollowUpdateManyWithWhereWithoutFollowerInput[]
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[]
  }

  export type FollowUncheckedUpdateManyWithoutFollowingNestedInput = {
    create?: XOR<FollowCreateWithoutFollowingInput, FollowUncheckedCreateWithoutFollowingInput> | FollowCreateWithoutFollowingInput[] | FollowUncheckedCreateWithoutFollowingInput[]
    connectOrCreate?: FollowCreateOrConnectWithoutFollowingInput | FollowCreateOrConnectWithoutFollowingInput[]
    upsert?: FollowUpsertWithWhereUniqueWithoutFollowingInput | FollowUpsertWithWhereUniqueWithoutFollowingInput[]
    createMany?: FollowCreateManyFollowingInputEnvelope
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[]
    update?: FollowUpdateWithWhereUniqueWithoutFollowingInput | FollowUpdateWithWhereUniqueWithoutFollowingInput[]
    updateMany?: FollowUpdateManyWithWhereWithoutFollowingInput | FollowUpdateManyWithWhereWithoutFollowingInput[]
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[]
  }

  export type ProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    upsert?: ProfileUpsertWithoutUserInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutUserInput, ProfileUpdateWithoutUserInput>, ProfileUncheckedUpdateWithoutUserInput>
  }

  export type PostUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostCreateWithoutUserInput, PostUncheckedCreateWithoutUserInput> | PostCreateWithoutUserInput[] | PostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostCreateOrConnectWithoutUserInput | PostCreateOrConnectWithoutUserInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutUserInput | PostUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostCreateManyUserInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutUserInput | PostUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostUpdateManyWithWhereWithoutUserInput | PostUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostLikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutUserInput | PostLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutUserInput | PostLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutUserInput | PostLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTokensInput = {
    create?: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTokensNestedInput = {
    create?: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokensInput
    upsert?: UserUpsertWithoutTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTokensInput, UserUpdateWithoutTokensInput>, UserUncheckedUpdateWithoutTokensInput>
  }

  export type ChatMemberCreateNestedManyWithoutChatInput = {
    create?: XOR<ChatMemberCreateWithoutChatInput, ChatMemberUncheckedCreateWithoutChatInput> | ChatMemberCreateWithoutChatInput[] | ChatMemberUncheckedCreateWithoutChatInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutChatInput | ChatMemberCreateOrConnectWithoutChatInput[]
    createMany?: ChatMemberCreateManyChatInputEnvelope
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutChatInput = {
    create?: XOR<MessageCreateWithoutChatInput, MessageUncheckedCreateWithoutChatInput> | MessageCreateWithoutChatInput[] | MessageUncheckedCreateWithoutChatInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatInput | MessageCreateOrConnectWithoutChatInput[]
    createMany?: MessageCreateManyChatInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CallCreateNestedManyWithoutChatInput = {
    create?: XOR<CallCreateWithoutChatInput, CallUncheckedCreateWithoutChatInput> | CallCreateWithoutChatInput[] | CallUncheckedCreateWithoutChatInput[]
    connectOrCreate?: CallCreateOrConnectWithoutChatInput | CallCreateOrConnectWithoutChatInput[]
    createMany?: CallCreateManyChatInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutCreatedChatsInput = {
    create?: XOR<UserCreateWithoutCreatedChatsInput, UserUncheckedCreateWithoutCreatedChatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedChatsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutChatsInput = {
    create?: XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatsInput
    connect?: UserWhereUniqueInput
  }

  export type ChatMemberUncheckedCreateNestedManyWithoutChatInput = {
    create?: XOR<ChatMemberCreateWithoutChatInput, ChatMemberUncheckedCreateWithoutChatInput> | ChatMemberCreateWithoutChatInput[] | ChatMemberUncheckedCreateWithoutChatInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutChatInput | ChatMemberCreateOrConnectWithoutChatInput[]
    createMany?: ChatMemberCreateManyChatInputEnvelope
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutChatInput = {
    create?: XOR<MessageCreateWithoutChatInput, MessageUncheckedCreateWithoutChatInput> | MessageCreateWithoutChatInput[] | MessageUncheckedCreateWithoutChatInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatInput | MessageCreateOrConnectWithoutChatInput[]
    createMany?: MessageCreateManyChatInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CallUncheckedCreateNestedManyWithoutChatInput = {
    create?: XOR<CallCreateWithoutChatInput, CallUncheckedCreateWithoutChatInput> | CallCreateWithoutChatInput[] | CallUncheckedCreateWithoutChatInput[]
    connectOrCreate?: CallCreateOrConnectWithoutChatInput | CallCreateOrConnectWithoutChatInput[]
    createMany?: CallCreateManyChatInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type EnumChatTypeFieldUpdateOperationsInput = {
    set?: $Enums.ChatType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ChatMemberUpdateManyWithoutChatNestedInput = {
    create?: XOR<ChatMemberCreateWithoutChatInput, ChatMemberUncheckedCreateWithoutChatInput> | ChatMemberCreateWithoutChatInput[] | ChatMemberUncheckedCreateWithoutChatInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutChatInput | ChatMemberCreateOrConnectWithoutChatInput[]
    upsert?: ChatMemberUpsertWithWhereUniqueWithoutChatInput | ChatMemberUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: ChatMemberCreateManyChatInputEnvelope
    set?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    disconnect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    delete?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    update?: ChatMemberUpdateWithWhereUniqueWithoutChatInput | ChatMemberUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: ChatMemberUpdateManyWithWhereWithoutChatInput | ChatMemberUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: ChatMemberScalarWhereInput | ChatMemberScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutChatNestedInput = {
    create?: XOR<MessageCreateWithoutChatInput, MessageUncheckedCreateWithoutChatInput> | MessageCreateWithoutChatInput[] | MessageUncheckedCreateWithoutChatInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatInput | MessageCreateOrConnectWithoutChatInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutChatInput | MessageUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: MessageCreateManyChatInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutChatInput | MessageUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutChatInput | MessageUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CallUpdateManyWithoutChatNestedInput = {
    create?: XOR<CallCreateWithoutChatInput, CallUncheckedCreateWithoutChatInput> | CallCreateWithoutChatInput[] | CallUncheckedCreateWithoutChatInput[]
    connectOrCreate?: CallCreateOrConnectWithoutChatInput | CallCreateOrConnectWithoutChatInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutChatInput | CallUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: CallCreateManyChatInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutChatInput | CallUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: CallUpdateManyWithWhereWithoutChatInput | CallUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutCreatedChatsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedChatsInput, UserUncheckedCreateWithoutCreatedChatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedChatsInput
    upsert?: UserUpsertWithoutCreatedChatsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedChatsInput, UserUpdateWithoutCreatedChatsInput>, UserUncheckedUpdateWithoutCreatedChatsInput>
  }

  export type UserUpdateOneWithoutChatsNestedInput = {
    create?: XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatsInput
    upsert?: UserUpsertWithoutChatsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatsInput, UserUpdateWithoutChatsInput>, UserUncheckedUpdateWithoutChatsInput>
  }

  export type ChatMemberUncheckedUpdateManyWithoutChatNestedInput = {
    create?: XOR<ChatMemberCreateWithoutChatInput, ChatMemberUncheckedCreateWithoutChatInput> | ChatMemberCreateWithoutChatInput[] | ChatMemberUncheckedCreateWithoutChatInput[]
    connectOrCreate?: ChatMemberCreateOrConnectWithoutChatInput | ChatMemberCreateOrConnectWithoutChatInput[]
    upsert?: ChatMemberUpsertWithWhereUniqueWithoutChatInput | ChatMemberUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: ChatMemberCreateManyChatInputEnvelope
    set?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    disconnect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    delete?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    connect?: ChatMemberWhereUniqueInput | ChatMemberWhereUniqueInput[]
    update?: ChatMemberUpdateWithWhereUniqueWithoutChatInput | ChatMemberUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: ChatMemberUpdateManyWithWhereWithoutChatInput | ChatMemberUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: ChatMemberScalarWhereInput | ChatMemberScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutChatNestedInput = {
    create?: XOR<MessageCreateWithoutChatInput, MessageUncheckedCreateWithoutChatInput> | MessageCreateWithoutChatInput[] | MessageUncheckedCreateWithoutChatInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutChatInput | MessageCreateOrConnectWithoutChatInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutChatInput | MessageUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: MessageCreateManyChatInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutChatInput | MessageUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutChatInput | MessageUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CallUncheckedUpdateManyWithoutChatNestedInput = {
    create?: XOR<CallCreateWithoutChatInput, CallUncheckedCreateWithoutChatInput> | CallCreateWithoutChatInput[] | CallUncheckedCreateWithoutChatInput[]
    connectOrCreate?: CallCreateOrConnectWithoutChatInput | CallCreateOrConnectWithoutChatInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutChatInput | CallUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: CallCreateManyChatInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutChatInput | CallUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: CallUpdateManyWithWhereWithoutChatInput | CallUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type ChatCreateNestedOneWithoutMembersInput = {
    create?: XOR<ChatCreateWithoutMembersInput, ChatUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ChatCreateOrConnectWithoutMembersInput
    connect?: ChatWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutChatMembersInput = {
    create?: XOR<UserCreateWithoutChatMembersInput, UserUncheckedCreateWithoutChatMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatMembersInput
    connect?: UserWhereUniqueInput
  }

  export type EnumChatMemberRoleFieldUpdateOperationsInput = {
    set?: $Enums.ChatMemberRole
  }

  export type ChatUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<ChatCreateWithoutMembersInput, ChatUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ChatCreateOrConnectWithoutMembersInput
    upsert?: ChatUpsertWithoutMembersInput
    connect?: ChatWhereUniqueInput
    update?: XOR<XOR<ChatUpdateToOneWithWhereWithoutMembersInput, ChatUpdateWithoutMembersInput>, ChatUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutChatMembersNestedInput = {
    create?: XOR<UserCreateWithoutChatMembersInput, UserUncheckedCreateWithoutChatMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatMembersInput
    upsert?: UserUpsertWithoutChatMembersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatMembersInput, UserUpdateWithoutChatMembersInput>, UserUncheckedUpdateWithoutChatMembersInput>
  }

  export type ChatCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatCreateWithoutMessagesInput, ChatUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatCreateOrConnectWithoutMessagesInput
    connect?: ChatWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedOneWithoutRepliesInput = {
    create?: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: MessageCreateOrConnectWithoutRepliesInput
    connect?: MessageWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutReplyToInput = {
    create?: XOR<MessageCreateWithoutReplyToInput, MessageUncheckedCreateWithoutReplyToInput> | MessageCreateWithoutReplyToInput[] | MessageUncheckedCreateWithoutReplyToInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReplyToInput | MessageCreateOrConnectWithoutReplyToInput[]
    createMany?: MessageCreateManyReplyToInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageReadStatusCreateNestedManyWithoutMessageInput = {
    create?: XOR<MessageReadStatusCreateWithoutMessageInput, MessageReadStatusUncheckedCreateWithoutMessageInput> | MessageReadStatusCreateWithoutMessageInput[] | MessageReadStatusUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutMessageInput | MessageReadStatusCreateOrConnectWithoutMessageInput[]
    createMany?: MessageReadStatusCreateManyMessageInputEnvelope
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutReplyToInput = {
    create?: XOR<MessageCreateWithoutReplyToInput, MessageUncheckedCreateWithoutReplyToInput> | MessageCreateWithoutReplyToInput[] | MessageUncheckedCreateWithoutReplyToInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReplyToInput | MessageCreateOrConnectWithoutReplyToInput[]
    createMany?: MessageCreateManyReplyToInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageReadStatusUncheckedCreateNestedManyWithoutMessageInput = {
    create?: XOR<MessageReadStatusCreateWithoutMessageInput, MessageReadStatusUncheckedCreateWithoutMessageInput> | MessageReadStatusCreateWithoutMessageInput[] | MessageReadStatusUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutMessageInput | MessageReadStatusCreateOrConnectWithoutMessageInput[]
    createMany?: MessageReadStatusCreateManyMessageInputEnvelope
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
  }

  export type EnumMessageTypeFieldUpdateOperationsInput = {
    set?: $Enums.MessageType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChatUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatCreateWithoutMessagesInput, ChatUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatCreateOrConnectWithoutMessagesInput
    upsert?: ChatUpsertWithoutMessagesInput
    connect?: ChatWhereUniqueInput
    update?: XOR<XOR<ChatUpdateToOneWithWhereWithoutMessagesInput, ChatUpdateWithoutMessagesInput>, ChatUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    upsert?: UserUpsertWithoutMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessagesInput, UserUpdateWithoutMessagesInput>, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type MessageUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: MessageCreateOrConnectWithoutRepliesInput
    upsert?: MessageUpsertWithoutRepliesInput
    disconnect?: MessageWhereInput | boolean
    delete?: MessageWhereInput | boolean
    connect?: MessageWhereUniqueInput
    update?: XOR<XOR<MessageUpdateToOneWithWhereWithoutRepliesInput, MessageUpdateWithoutRepliesInput>, MessageUncheckedUpdateWithoutRepliesInput>
  }

  export type MessageUpdateManyWithoutReplyToNestedInput = {
    create?: XOR<MessageCreateWithoutReplyToInput, MessageUncheckedCreateWithoutReplyToInput> | MessageCreateWithoutReplyToInput[] | MessageUncheckedCreateWithoutReplyToInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReplyToInput | MessageCreateOrConnectWithoutReplyToInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReplyToInput | MessageUpsertWithWhereUniqueWithoutReplyToInput[]
    createMany?: MessageCreateManyReplyToInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReplyToInput | MessageUpdateWithWhereUniqueWithoutReplyToInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReplyToInput | MessageUpdateManyWithWhereWithoutReplyToInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageReadStatusUpdateManyWithoutMessageNestedInput = {
    create?: XOR<MessageReadStatusCreateWithoutMessageInput, MessageReadStatusUncheckedCreateWithoutMessageInput> | MessageReadStatusCreateWithoutMessageInput[] | MessageReadStatusUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutMessageInput | MessageReadStatusCreateOrConnectWithoutMessageInput[]
    upsert?: MessageReadStatusUpsertWithWhereUniqueWithoutMessageInput | MessageReadStatusUpsertWithWhereUniqueWithoutMessageInput[]
    createMany?: MessageReadStatusCreateManyMessageInputEnvelope
    set?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    disconnect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    delete?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    update?: MessageReadStatusUpdateWithWhereUniqueWithoutMessageInput | MessageReadStatusUpdateWithWhereUniqueWithoutMessageInput[]
    updateMany?: MessageReadStatusUpdateManyWithWhereWithoutMessageInput | MessageReadStatusUpdateManyWithWhereWithoutMessageInput[]
    deleteMany?: MessageReadStatusScalarWhereInput | MessageReadStatusScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutReplyToNestedInput = {
    create?: XOR<MessageCreateWithoutReplyToInput, MessageUncheckedCreateWithoutReplyToInput> | MessageCreateWithoutReplyToInput[] | MessageUncheckedCreateWithoutReplyToInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReplyToInput | MessageCreateOrConnectWithoutReplyToInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReplyToInput | MessageUpsertWithWhereUniqueWithoutReplyToInput[]
    createMany?: MessageCreateManyReplyToInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReplyToInput | MessageUpdateWithWhereUniqueWithoutReplyToInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReplyToInput | MessageUpdateManyWithWhereWithoutReplyToInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageReadStatusUncheckedUpdateManyWithoutMessageNestedInput = {
    create?: XOR<MessageReadStatusCreateWithoutMessageInput, MessageReadStatusUncheckedCreateWithoutMessageInput> | MessageReadStatusCreateWithoutMessageInput[] | MessageReadStatusUncheckedCreateWithoutMessageInput[]
    connectOrCreate?: MessageReadStatusCreateOrConnectWithoutMessageInput | MessageReadStatusCreateOrConnectWithoutMessageInput[]
    upsert?: MessageReadStatusUpsertWithWhereUniqueWithoutMessageInput | MessageReadStatusUpsertWithWhereUniqueWithoutMessageInput[]
    createMany?: MessageReadStatusCreateManyMessageInputEnvelope
    set?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    disconnect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    delete?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    connect?: MessageReadStatusWhereUniqueInput | MessageReadStatusWhereUniqueInput[]
    update?: MessageReadStatusUpdateWithWhereUniqueWithoutMessageInput | MessageReadStatusUpdateWithWhereUniqueWithoutMessageInput[]
    updateMany?: MessageReadStatusUpdateManyWithWhereWithoutMessageInput | MessageReadStatusUpdateManyWithWhereWithoutMessageInput[]
    deleteMany?: MessageReadStatusScalarWhereInput | MessageReadStatusScalarWhereInput[]
  }

  export type MessageCreateNestedOneWithoutReadStatusInput = {
    create?: XOR<MessageCreateWithoutReadStatusInput, MessageUncheckedCreateWithoutReadStatusInput>
    connectOrCreate?: MessageCreateOrConnectWithoutReadStatusInput
    connect?: MessageWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMessageReadsInput = {
    create?: XOR<UserCreateWithoutMessageReadsInput, UserUncheckedCreateWithoutMessageReadsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessageReadsInput
    connect?: UserWhereUniqueInput
  }

  export type MessageUpdateOneRequiredWithoutReadStatusNestedInput = {
    create?: XOR<MessageCreateWithoutReadStatusInput, MessageUncheckedCreateWithoutReadStatusInput>
    connectOrCreate?: MessageCreateOrConnectWithoutReadStatusInput
    upsert?: MessageUpsertWithoutReadStatusInput
    connect?: MessageWhereUniqueInput
    update?: XOR<XOR<MessageUpdateToOneWithWhereWithoutReadStatusInput, MessageUpdateWithoutReadStatusInput>, MessageUncheckedUpdateWithoutReadStatusInput>
  }

  export type UserUpdateOneRequiredWithoutMessageReadsNestedInput = {
    create?: XOR<UserCreateWithoutMessageReadsInput, UserUncheckedCreateWithoutMessageReadsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessageReadsInput
    upsert?: UserUpsertWithoutMessageReadsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessageReadsInput, UserUpdateWithoutMessageReadsInput>, UserUncheckedUpdateWithoutMessageReadsInput>
  }

  export type ChatCreateNestedOneWithoutCallsInput = {
    create?: XOR<ChatCreateWithoutCallsInput, ChatUncheckedCreateWithoutCallsInput>
    connectOrCreate?: ChatCreateOrConnectWithoutCallsInput
    connect?: ChatWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSentCallsInput = {
    create?: XOR<UserCreateWithoutSentCallsInput, UserUncheckedCreateWithoutSentCallsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentCallsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedCallsInput = {
    create?: XOR<UserCreateWithoutReceivedCallsInput, UserUncheckedCreateWithoutReceivedCallsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedCallsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumCallTypeFieldUpdateOperationsInput = {
    set?: $Enums.CallType
  }

  export type EnumCallStatusFieldUpdateOperationsInput = {
    set?: $Enums.CallStatus
  }

  export type ChatUpdateOneRequiredWithoutCallsNestedInput = {
    create?: XOR<ChatCreateWithoutCallsInput, ChatUncheckedCreateWithoutCallsInput>
    connectOrCreate?: ChatCreateOrConnectWithoutCallsInput
    upsert?: ChatUpsertWithoutCallsInput
    connect?: ChatWhereUniqueInput
    update?: XOR<XOR<ChatUpdateToOneWithWhereWithoutCallsInput, ChatUpdateWithoutCallsInput>, ChatUncheckedUpdateWithoutCallsInput>
  }

  export type UserUpdateOneRequiredWithoutSentCallsNestedInput = {
    create?: XOR<UserCreateWithoutSentCallsInput, UserUncheckedCreateWithoutSentCallsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentCallsInput
    upsert?: UserUpsertWithoutSentCallsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentCallsInput, UserUpdateWithoutSentCallsInput>, UserUncheckedUpdateWithoutSentCallsInput>
  }

  export type UserUpdateOneWithoutReceivedCallsNestedInput = {
    create?: XOR<UserCreateWithoutReceivedCallsInput, UserUncheckedCreateWithoutReceivedCallsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedCallsInput
    upsert?: UserUpsertWithoutReceivedCallsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedCallsInput, UserUpdateWithoutReceivedCallsInput>, UserUncheckedUpdateWithoutReceivedCallsInput>
  }

  export type UserCreateNestedOneWithoutFollowersInput = {
    create?: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowersInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFollowingInput = {
    create?: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowingInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFollowersNestedInput = {
    create?: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowersInput
    upsert?: UserUpsertWithoutFollowersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFollowersInput, UserUpdateWithoutFollowersInput>, UserUncheckedUpdateWithoutFollowersInput>
  }

  export type UserUpdateOneRequiredWithoutFollowingNestedInput = {
    create?: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
    connectOrCreate?: UserCreateOrConnectWithoutFollowingInput
    upsert?: UserUpsertWithoutFollowingInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFollowingInput, UserUpdateWithoutFollowingInput>, UserUncheckedUpdateWithoutFollowingInput>
  }

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    upsert?: UserUpsertWithoutProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfileInput, UserUpdateWithoutProfileInput>, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserCreateNestedOneWithoutPostsInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuthoredPostsInput = {
    create?: XOR<UserCreateWithoutAuthoredPostsInput, UserUncheckedCreateWithoutAuthoredPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthoredPostsInput
    connect?: UserWhereUniqueInput
  }

  export type PostCreateNestedOneWithoutRepostsInput = {
    create?: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
    connectOrCreate?: PostCreateOrConnectWithoutRepostsInput
    connect?: PostWhereUniqueInput
  }

  export type PostCreateNestedManyWithoutOriginalPostInput = {
    create?: XOR<PostCreateWithoutOriginalPostInput, PostUncheckedCreateWithoutOriginalPostInput> | PostCreateWithoutOriginalPostInput[] | PostUncheckedCreateWithoutOriginalPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutOriginalPostInput | PostCreateOrConnectWithoutOriginalPostInput[]
    createMany?: PostCreateManyOriginalPostInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostLikeCreateNestedManyWithoutPostInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutOriginalPostInput = {
    create?: XOR<PostCreateWithoutOriginalPostInput, PostUncheckedCreateWithoutOriginalPostInput> | PostCreateWithoutOriginalPostInput[] | PostUncheckedCreateWithoutOriginalPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutOriginalPostInput | PostCreateOrConnectWithoutOriginalPostInput[]
    createMany?: PostCreateManyOriginalPostInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostLikeUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    upsert?: UserUpsertWithoutPostsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostsInput, UserUpdateWithoutPostsInput>, UserUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateOneWithoutAuthoredPostsNestedInput = {
    create?: XOR<UserCreateWithoutAuthoredPostsInput, UserUncheckedCreateWithoutAuthoredPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthoredPostsInput
    upsert?: UserUpsertWithoutAuthoredPostsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuthoredPostsInput, UserUpdateWithoutAuthoredPostsInput>, UserUncheckedUpdateWithoutAuthoredPostsInput>
  }

  export type PostUpdateOneWithoutRepostsNestedInput = {
    create?: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
    connectOrCreate?: PostCreateOrConnectWithoutRepostsInput
    upsert?: PostUpsertWithoutRepostsInput
    disconnect?: PostWhereInput | boolean
    delete?: PostWhereInput | boolean
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutRepostsInput, PostUpdateWithoutRepostsInput>, PostUncheckedUpdateWithoutRepostsInput>
  }

  export type PostUpdateManyWithoutOriginalPostNestedInput = {
    create?: XOR<PostCreateWithoutOriginalPostInput, PostUncheckedCreateWithoutOriginalPostInput> | PostCreateWithoutOriginalPostInput[] | PostUncheckedCreateWithoutOriginalPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutOriginalPostInput | PostCreateOrConnectWithoutOriginalPostInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutOriginalPostInput | PostUpsertWithWhereUniqueWithoutOriginalPostInput[]
    createMany?: PostCreateManyOriginalPostInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutOriginalPostInput | PostUpdateWithWhereUniqueWithoutOriginalPostInput[]
    updateMany?: PostUpdateManyWithWhereWithoutOriginalPostInput | PostUpdateManyWithWhereWithoutOriginalPostInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostLikeUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutPostInput | PostLikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutPostInput | PostLikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutPostInput | PostLikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutOriginalPostNestedInput = {
    create?: XOR<PostCreateWithoutOriginalPostInput, PostUncheckedCreateWithoutOriginalPostInput> | PostCreateWithoutOriginalPostInput[] | PostUncheckedCreateWithoutOriginalPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutOriginalPostInput | PostCreateOrConnectWithoutOriginalPostInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutOriginalPostInput | PostUpsertWithWhereUniqueWithoutOriginalPostInput[]
    createMany?: PostCreateManyOriginalPostInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutOriginalPostInput | PostUpdateWithWhereUniqueWithoutOriginalPostInput[]
    updateMany?: PostUpdateManyWithWhereWithoutOriginalPostInput | PostUpdateManyWithWhereWithoutOriginalPostInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostLikeUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutPostInput | PostLikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutPostInput | PostLikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutPostInput | PostLikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type PostCreateNestedOneWithoutLikesInput = {
    create?: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput
    connect?: PostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPostLikesInput = {
    create?: XOR<UserCreateWithoutPostLikesInput, UserUncheckedCreateWithoutPostLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostLikesInput
    connect?: UserWhereUniqueInput
  }

  export type PostUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput
    upsert?: PostUpsertWithoutLikesInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutLikesInput, PostUpdateWithoutLikesInput>, PostUncheckedUpdateWithoutLikesInput>
  }

  export type UserUpdateOneRequiredWithoutPostLikesNestedInput = {
    create?: XOR<UserCreateWithoutPostLikesInput, UserUncheckedCreateWithoutPostLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostLikesInput
    upsert?: UserUpsertWithoutPostLikesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostLikesInput, UserUpdateWithoutPostLikesInput>, UserUncheckedUpdateWithoutPostLikesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumuser_rolesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_roles | Enumuser_rolesFieldRefInput<$PrismaModel>
    in?: $Enums.user_roles[]
    notIn?: $Enums.user_roles[]
    not?: NestedEnumuser_rolesFilter<$PrismaModel> | $Enums.user_roles
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumuser_rolesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_roles | Enumuser_rolesFieldRefInput<$PrismaModel>
    in?: $Enums.user_roles[]
    notIn?: $Enums.user_roles[]
    not?: NestedEnumuser_rolesWithAggregatesFilter<$PrismaModel> | $Enums.user_roles
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_rolesFilter<$PrismaModel>
    _max?: NestedEnumuser_rolesFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumChatTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[]
    notIn?: $Enums.ChatType[]
    not?: NestedEnumChatTypeFilter<$PrismaModel> | $Enums.ChatType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumChatTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[]
    notIn?: $Enums.ChatType[]
    not?: NestedEnumChatTypeWithAggregatesFilter<$PrismaModel> | $Enums.ChatType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatTypeFilter<$PrismaModel>
    _max?: NestedEnumChatTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumChatMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMemberRole | EnumChatMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ChatMemberRole[]
    notIn?: $Enums.ChatMemberRole[]
    not?: NestedEnumChatMemberRoleFilter<$PrismaModel> | $Enums.ChatMemberRole
  }

  export type NestedEnumChatMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMemberRole | EnumChatMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ChatMemberRole[]
    notIn?: $Enums.ChatMemberRole[]
    not?: NestedEnumChatMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.ChatMemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumChatMemberRoleFilter<$PrismaModel>
  }

  export type NestedEnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[]
    notIn?: $Enums.MessageType[]
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[]
    notIn?: $Enums.MessageType[]
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumCallTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CallType | EnumCallTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CallType[]
    notIn?: $Enums.CallType[]
    not?: NestedEnumCallTypeFilter<$PrismaModel> | $Enums.CallType
  }

  export type NestedEnumCallStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CallStatus | EnumCallStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CallStatus[]
    notIn?: $Enums.CallStatus[]
    not?: NestedEnumCallStatusFilter<$PrismaModel> | $Enums.CallStatus
  }

  export type NestedEnumCallTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CallType | EnumCallTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CallType[]
    notIn?: $Enums.CallType[]
    not?: NestedEnumCallTypeWithAggregatesFilter<$PrismaModel> | $Enums.CallType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCallTypeFilter<$PrismaModel>
    _max?: NestedEnumCallTypeFilter<$PrismaModel>
  }

  export type NestedEnumCallStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CallStatus | EnumCallStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CallStatus[]
    notIn?: $Enums.CallStatus[]
    not?: NestedEnumCallStatusWithAggregatesFilter<$PrismaModel> | $Enums.CallStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCallStatusFilter<$PrismaModel>
    _max?: NestedEnumCallStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TokenCreateWithoutUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TokenUncheckedCreateWithoutUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type TokenCreateOrConnectWithoutUserInput = {
    where: TokenWhereUniqueInput
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type TokenCreateManyUserInputEnvelope = {
    data: TokenCreateManyUserInput | TokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatCreateWithoutCreatorInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ChatMemberCreateNestedManyWithoutChatInput
    messages?: MessageCreateNestedManyWithoutChatInput
    calls?: CallCreateNestedManyWithoutChatInput
    user?: UserCreateNestedOneWithoutChatsInput
  }

  export type ChatUncheckedCreateWithoutCreatorInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    members?: ChatMemberUncheckedCreateNestedManyWithoutChatInput
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput
    calls?: CallUncheckedCreateNestedManyWithoutChatInput
  }

  export type ChatCreateOrConnectWithoutCreatorInput = {
    where: ChatWhereUniqueInput
    create: XOR<ChatCreateWithoutCreatorInput, ChatUncheckedCreateWithoutCreatorInput>
  }

  export type ChatCreateManyCreatorInputEnvelope = {
    data: ChatCreateManyCreatorInput | ChatCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type ChatMemberCreateWithoutUserInput = {
    id?: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
    chat: ChatCreateNestedOneWithoutMembersInput
  }

  export type ChatMemberUncheckedCreateWithoutUserInput = {
    id?: string
    chatId: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
  }

  export type ChatMemberCreateOrConnectWithoutUserInput = {
    where: ChatMemberWhereUniqueInput
    create: XOR<ChatMemberCreateWithoutUserInput, ChatMemberUncheckedCreateWithoutUserInput>
  }

  export type ChatMemberCreateManyUserInputEnvelope = {
    data: ChatMemberCreateManyUserInput | ChatMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chat: ChatCreateNestedOneWithoutMessagesInput
    replyTo?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    chatId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: MessageUncheckedCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type CallCreateWithoutInitiatorInput = {
    id?: string
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    chat: ChatCreateNestedOneWithoutCallsInput
    receiver?: UserCreateNestedOneWithoutReceivedCallsInput
  }

  export type CallUncheckedCreateWithoutInitiatorInput = {
    id?: string
    chatId: string
    receiverId?: string | null
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type CallCreateOrConnectWithoutInitiatorInput = {
    where: CallWhereUniqueInput
    create: XOR<CallCreateWithoutInitiatorInput, CallUncheckedCreateWithoutInitiatorInput>
  }

  export type CallCreateManyInitiatorInputEnvelope = {
    data: CallCreateManyInitiatorInput | CallCreateManyInitiatorInput[]
    skipDuplicates?: boolean
  }

  export type CallCreateWithoutReceiverInput = {
    id?: string
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    chat: ChatCreateNestedOneWithoutCallsInput
    initiator: UserCreateNestedOneWithoutSentCallsInput
  }

  export type CallUncheckedCreateWithoutReceiverInput = {
    id?: string
    chatId: string
    initiatorId: string
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type CallCreateOrConnectWithoutReceiverInput = {
    where: CallWhereUniqueInput
    create: XOR<CallCreateWithoutReceiverInput, CallUncheckedCreateWithoutReceiverInput>
  }

  export type CallCreateManyReceiverInputEnvelope = {
    data: CallCreateManyReceiverInput | CallCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type MessageReadStatusCreateWithoutUserInput = {
    id?: string
    readAt?: Date | string
    message: MessageCreateNestedOneWithoutReadStatusInput
  }

  export type MessageReadStatusUncheckedCreateWithoutUserInput = {
    id?: string
    messageId: string
    readAt?: Date | string
  }

  export type MessageReadStatusCreateOrConnectWithoutUserInput = {
    where: MessageReadStatusWhereUniqueInput
    create: XOR<MessageReadStatusCreateWithoutUserInput, MessageReadStatusUncheckedCreateWithoutUserInput>
  }

  export type MessageReadStatusCreateManyUserInputEnvelope = {
    data: MessageReadStatusCreateManyUserInput | MessageReadStatusCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatCreateWithoutUserInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ChatMemberCreateNestedManyWithoutChatInput
    messages?: MessageCreateNestedManyWithoutChatInput
    calls?: CallCreateNestedManyWithoutChatInput
    creator: UserCreateNestedOneWithoutCreatedChatsInput
  }

  export type ChatUncheckedCreateWithoutUserInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ChatMemberUncheckedCreateNestedManyWithoutChatInput
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput
    calls?: CallUncheckedCreateNestedManyWithoutChatInput
  }

  export type ChatCreateOrConnectWithoutUserInput = {
    where: ChatWhereUniqueInput
    create: XOR<ChatCreateWithoutUserInput, ChatUncheckedCreateWithoutUserInput>
  }

  export type ChatCreateManyUserInputEnvelope = {
    data: ChatCreateManyUserInput | ChatCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FollowCreateWithoutFollowerInput = {
    id?: string
    createdAt?: Date | string
    following: UserCreateNestedOneWithoutFollowingInput
  }

  export type FollowUncheckedCreateWithoutFollowerInput = {
    id?: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowCreateOrConnectWithoutFollowerInput = {
    where: FollowWhereUniqueInput
    create: XOR<FollowCreateWithoutFollowerInput, FollowUncheckedCreateWithoutFollowerInput>
  }

  export type FollowCreateManyFollowerInputEnvelope = {
    data: FollowCreateManyFollowerInput | FollowCreateManyFollowerInput[]
    skipDuplicates?: boolean
  }

  export type FollowCreateWithoutFollowingInput = {
    id?: string
    createdAt?: Date | string
    follower: UserCreateNestedOneWithoutFollowersInput
  }

  export type FollowUncheckedCreateWithoutFollowingInput = {
    id?: string
    followerId: string
    createdAt?: Date | string
  }

  export type FollowCreateOrConnectWithoutFollowingInput = {
    where: FollowWhereUniqueInput
    create: XOR<FollowCreateWithoutFollowingInput, FollowUncheckedCreateWithoutFollowingInput>
  }

  export type FollowCreateManyFollowingInputEnvelope = {
    data: FollowCreateManyFollowingInput | FollowCreateManyFollowingInput[]
    skipDuplicates?: boolean
  }

  export type ProfileCreateWithoutUserInput = {
    id?: string
    name?: string | null
    about?: string | null
    avatar?: string | null
    hero?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUncheckedCreateWithoutUserInput = {
    id?: string
    name?: string | null
    about?: string | null
    avatar?: string | null
    hero?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileCreateOrConnectWithoutUserInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
  }

  export type PostCreateWithoutUserInput = {
    id?: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    author?: UserCreateNestedOneWithoutAuthoredPostsInput
    originalPost?: PostCreateNestedOneWithoutRepostsInput
    reposts?: PostCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutUserInput = {
    id?: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reposts?: PostUncheckedCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutUserInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutUserInput, PostUncheckedCreateWithoutUserInput>
  }

  export type PostCreateManyUserInputEnvelope = {
    data: PostCreateManyUserInput | PostCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PostCreateWithoutAuthorInput = {
    id?: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPostsInput
    originalPost?: PostCreateNestedOneWithoutRepostsInput
    reposts?: PostCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutAuthorInput = {
    id?: string
    userId: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reposts?: PostUncheckedCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutAuthorInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostCreateManyAuthorInputEnvelope = {
    data: PostCreateManyAuthorInput | PostCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type PostLikeCreateWithoutUserInput = {
    id?: string
    isLike?: boolean
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutLikesInput
  }

  export type PostLikeUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
    isLike?: boolean
    createdAt?: Date | string
  }

  export type PostLikeCreateOrConnectWithoutUserInput = {
    where: PostLikeWhereUniqueInput
    create: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput>
  }

  export type PostLikeCreateManyUserInputEnvelope = {
    data: PostLikeCreateManyUserInput | PostLikeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TokenUpsertWithWhereUniqueWithoutUserInput = {
    where: TokenWhereUniqueInput
    update: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type TokenUpdateWithWhereUniqueWithoutUserInput = {
    where: TokenWhereUniqueInput
    data: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
  }

  export type TokenUpdateManyWithWhereWithoutUserInput = {
    where: TokenScalarWhereInput
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyWithoutUserInput>
  }

  export type TokenScalarWhereInput = {
    AND?: TokenScalarWhereInput | TokenScalarWhereInput[]
    OR?: TokenScalarWhereInput[]
    NOT?: TokenScalarWhereInput | TokenScalarWhereInput[]
    id?: StringFilter<"Token"> | string
    userId?: StringFilter<"Token"> | string
    refreshToken?: StringFilter<"Token"> | string
    createdAt?: DateTimeNullableFilter<"Token"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Token"> | Date | string | null
  }

  export type ChatUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ChatWhereUniqueInput
    update: XOR<ChatUpdateWithoutCreatorInput, ChatUncheckedUpdateWithoutCreatorInput>
    create: XOR<ChatCreateWithoutCreatorInput, ChatUncheckedCreateWithoutCreatorInput>
  }

  export type ChatUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ChatWhereUniqueInput
    data: XOR<ChatUpdateWithoutCreatorInput, ChatUncheckedUpdateWithoutCreatorInput>
  }

  export type ChatUpdateManyWithWhereWithoutCreatorInput = {
    where: ChatScalarWhereInput
    data: XOR<ChatUpdateManyMutationInput, ChatUncheckedUpdateManyWithoutCreatorInput>
  }

  export type ChatScalarWhereInput = {
    AND?: ChatScalarWhereInput | ChatScalarWhereInput[]
    OR?: ChatScalarWhereInput[]
    NOT?: ChatScalarWhereInput | ChatScalarWhereInput[]
    id?: StringFilter<"Chat"> | string
    type?: EnumChatTypeFilter<"Chat"> | $Enums.ChatType
    name?: StringNullableFilter<"Chat"> | string | null
    description?: StringNullableFilter<"Chat"> | string | null
    avatar?: StringNullableFilter<"Chat"> | string | null
    createdBy?: StringFilter<"Chat"> | string
    createdAt?: DateTimeFilter<"Chat"> | Date | string
    updatedAt?: DateTimeFilter<"Chat"> | Date | string
    userId?: StringNullableFilter<"Chat"> | string | null
  }

  export type ChatMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatMemberWhereUniqueInput
    update: XOR<ChatMemberUpdateWithoutUserInput, ChatMemberUncheckedUpdateWithoutUserInput>
    create: XOR<ChatMemberCreateWithoutUserInput, ChatMemberUncheckedCreateWithoutUserInput>
  }

  export type ChatMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatMemberWhereUniqueInput
    data: XOR<ChatMemberUpdateWithoutUserInput, ChatMemberUncheckedUpdateWithoutUserInput>
  }

  export type ChatMemberUpdateManyWithWhereWithoutUserInput = {
    where: ChatMemberScalarWhereInput
    data: XOR<ChatMemberUpdateManyMutationInput, ChatMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatMemberScalarWhereInput = {
    AND?: ChatMemberScalarWhereInput | ChatMemberScalarWhereInput[]
    OR?: ChatMemberScalarWhereInput[]
    NOT?: ChatMemberScalarWhereInput | ChatMemberScalarWhereInput[]
    id?: StringFilter<"ChatMember"> | string
    chatId?: StringFilter<"ChatMember"> | string
    userId?: StringFilter<"ChatMember"> | string
    role?: EnumChatMemberRoleFilter<"ChatMember"> | $Enums.ChatMemberRole
    joinedAt?: DateTimeFilter<"ChatMember"> | Date | string
    leftAt?: DateTimeNullableFilter<"ChatMember"> | Date | string | null
    lastReadAt?: DateTimeNullableFilter<"ChatMember"> | Date | string | null
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    chatId?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    type?: EnumMessageTypeFilter<"Message"> | $Enums.MessageType
    fileUrl?: StringNullableFilter<"Message"> | string | null
    fileName?: StringNullableFilter<"Message"> | string | null
    fileSize?: IntNullableFilter<"Message"> | number | null
    replyToId?: StringNullableFilter<"Message"> | string | null
    editedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type CallUpsertWithWhereUniqueWithoutInitiatorInput = {
    where: CallWhereUniqueInput
    update: XOR<CallUpdateWithoutInitiatorInput, CallUncheckedUpdateWithoutInitiatorInput>
    create: XOR<CallCreateWithoutInitiatorInput, CallUncheckedCreateWithoutInitiatorInput>
  }

  export type CallUpdateWithWhereUniqueWithoutInitiatorInput = {
    where: CallWhereUniqueInput
    data: XOR<CallUpdateWithoutInitiatorInput, CallUncheckedUpdateWithoutInitiatorInput>
  }

  export type CallUpdateManyWithWhereWithoutInitiatorInput = {
    where: CallScalarWhereInput
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyWithoutInitiatorInput>
  }

  export type CallScalarWhereInput = {
    AND?: CallScalarWhereInput | CallScalarWhereInput[]
    OR?: CallScalarWhereInput[]
    NOT?: CallScalarWhereInput | CallScalarWhereInput[]
    id?: StringFilter<"Call"> | string
    chatId?: StringFilter<"Call"> | string
    initiatorId?: StringFilter<"Call"> | string
    receiverId?: StringNullableFilter<"Call"> | string | null
    type?: EnumCallTypeFilter<"Call"> | $Enums.CallType
    status?: EnumCallStatusFilter<"Call"> | $Enums.CallStatus
    startedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    duration?: IntNullableFilter<"Call"> | number | null
    createdAt?: DateTimeFilter<"Call"> | Date | string
  }

  export type CallUpsertWithWhereUniqueWithoutReceiverInput = {
    where: CallWhereUniqueInput
    update: XOR<CallUpdateWithoutReceiverInput, CallUncheckedUpdateWithoutReceiverInput>
    create: XOR<CallCreateWithoutReceiverInput, CallUncheckedCreateWithoutReceiverInput>
  }

  export type CallUpdateWithWhereUniqueWithoutReceiverInput = {
    where: CallWhereUniqueInput
    data: XOR<CallUpdateWithoutReceiverInput, CallUncheckedUpdateWithoutReceiverInput>
  }

  export type CallUpdateManyWithWhereWithoutReceiverInput = {
    where: CallScalarWhereInput
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyWithoutReceiverInput>
  }

  export type MessageReadStatusUpsertWithWhereUniqueWithoutUserInput = {
    where: MessageReadStatusWhereUniqueInput
    update: XOR<MessageReadStatusUpdateWithoutUserInput, MessageReadStatusUncheckedUpdateWithoutUserInput>
    create: XOR<MessageReadStatusCreateWithoutUserInput, MessageReadStatusUncheckedCreateWithoutUserInput>
  }

  export type MessageReadStatusUpdateWithWhereUniqueWithoutUserInput = {
    where: MessageReadStatusWhereUniqueInput
    data: XOR<MessageReadStatusUpdateWithoutUserInput, MessageReadStatusUncheckedUpdateWithoutUserInput>
  }

  export type MessageReadStatusUpdateManyWithWhereWithoutUserInput = {
    where: MessageReadStatusScalarWhereInput
    data: XOR<MessageReadStatusUpdateManyMutationInput, MessageReadStatusUncheckedUpdateManyWithoutUserInput>
  }

  export type MessageReadStatusScalarWhereInput = {
    AND?: MessageReadStatusScalarWhereInput | MessageReadStatusScalarWhereInput[]
    OR?: MessageReadStatusScalarWhereInput[]
    NOT?: MessageReadStatusScalarWhereInput | MessageReadStatusScalarWhereInput[]
    id?: StringFilter<"MessageReadStatus"> | string
    messageId?: StringFilter<"MessageReadStatus"> | string
    userId?: StringFilter<"MessageReadStatus"> | string
    readAt?: DateTimeFilter<"MessageReadStatus"> | Date | string
  }

  export type ChatUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatWhereUniqueInput
    update: XOR<ChatUpdateWithoutUserInput, ChatUncheckedUpdateWithoutUserInput>
    create: XOR<ChatCreateWithoutUserInput, ChatUncheckedCreateWithoutUserInput>
  }

  export type ChatUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatWhereUniqueInput
    data: XOR<ChatUpdateWithoutUserInput, ChatUncheckedUpdateWithoutUserInput>
  }

  export type ChatUpdateManyWithWhereWithoutUserInput = {
    where: ChatScalarWhereInput
    data: XOR<ChatUpdateManyMutationInput, ChatUncheckedUpdateManyWithoutUserInput>
  }

  export type FollowUpsertWithWhereUniqueWithoutFollowerInput = {
    where: FollowWhereUniqueInput
    update: XOR<FollowUpdateWithoutFollowerInput, FollowUncheckedUpdateWithoutFollowerInput>
    create: XOR<FollowCreateWithoutFollowerInput, FollowUncheckedCreateWithoutFollowerInput>
  }

  export type FollowUpdateWithWhereUniqueWithoutFollowerInput = {
    where: FollowWhereUniqueInput
    data: XOR<FollowUpdateWithoutFollowerInput, FollowUncheckedUpdateWithoutFollowerInput>
  }

  export type FollowUpdateManyWithWhereWithoutFollowerInput = {
    where: FollowScalarWhereInput
    data: XOR<FollowUpdateManyMutationInput, FollowUncheckedUpdateManyWithoutFollowerInput>
  }

  export type FollowScalarWhereInput = {
    AND?: FollowScalarWhereInput | FollowScalarWhereInput[]
    OR?: FollowScalarWhereInput[]
    NOT?: FollowScalarWhereInput | FollowScalarWhereInput[]
    id?: StringFilter<"Follow"> | string
    followerId?: StringFilter<"Follow"> | string
    followingId?: StringFilter<"Follow"> | string
    createdAt?: DateTimeFilter<"Follow"> | Date | string
  }

  export type FollowUpsertWithWhereUniqueWithoutFollowingInput = {
    where: FollowWhereUniqueInput
    update: XOR<FollowUpdateWithoutFollowingInput, FollowUncheckedUpdateWithoutFollowingInput>
    create: XOR<FollowCreateWithoutFollowingInput, FollowUncheckedCreateWithoutFollowingInput>
  }

  export type FollowUpdateWithWhereUniqueWithoutFollowingInput = {
    where: FollowWhereUniqueInput
    data: XOR<FollowUpdateWithoutFollowingInput, FollowUncheckedUpdateWithoutFollowingInput>
  }

  export type FollowUpdateManyWithWhereWithoutFollowingInput = {
    where: FollowScalarWhereInput
    data: XOR<FollowUpdateManyMutationInput, FollowUncheckedUpdateManyWithoutFollowingInput>
  }

  export type ProfileUpsertWithoutUserInput = {
    update: XOR<ProfileUpdateWithoutUserInput, ProfileUncheckedUpdateWithoutUserInput>
    create: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutUserInput, ProfileUncheckedUpdateWithoutUserInput>
  }

  export type ProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    about?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    about?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    hero?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpsertWithWhereUniqueWithoutUserInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutUserInput, PostUncheckedUpdateWithoutUserInput>
    create: XOR<PostCreateWithoutUserInput, PostUncheckedCreateWithoutUserInput>
  }

  export type PostUpdateWithWhereUniqueWithoutUserInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutUserInput, PostUncheckedUpdateWithoutUserInput>
  }

  export type PostUpdateManyWithWhereWithoutUserInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutUserInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: StringFilter<"Post"> | string
    userId?: StringFilter<"Post"> | string
    authorId?: StringNullableFilter<"Post"> | string | null
    text?: StringNullableFilter<"Post"> | string | null
    image?: StringNullableFilter<"Post"> | string | null
    audio?: StringNullableFilter<"Post"> | string | null
    video?: StringNullableFilter<"Post"> | string | null
    link?: StringNullableFilter<"Post"> | string | null
    views?: IntFilter<"Post"> | number
    originalPostId?: StringNullableFilter<"Post"> | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
  }

  export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
  }

  export type PostUpdateManyWithWhereWithoutAuthorInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutAuthorInput>
  }

  export type PostLikeUpsertWithWhereUniqueWithoutUserInput = {
    where: PostLikeWhereUniqueInput
    update: XOR<PostLikeUpdateWithoutUserInput, PostLikeUncheckedUpdateWithoutUserInput>
    create: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput>
  }

  export type PostLikeUpdateWithWhereUniqueWithoutUserInput = {
    where: PostLikeWhereUniqueInput
    data: XOR<PostLikeUpdateWithoutUserInput, PostLikeUncheckedUpdateWithoutUserInput>
  }

  export type PostLikeUpdateManyWithWhereWithoutUserInput = {
    where: PostLikeScalarWhereInput
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyWithoutUserInput>
  }

  export type PostLikeScalarWhereInput = {
    AND?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
    OR?: PostLikeScalarWhereInput[]
    NOT?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
    id?: StringFilter<"PostLike"> | string
    postId?: StringFilter<"PostLike"> | string
    userId?: StringFilter<"PostLike"> | string
    isLike?: BoolFilter<"PostLike"> | boolean
    createdAt?: DateTimeFilter<"PostLike"> | Date | string
  }

  export type UserCreateWithoutTokensInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTokensInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
  }

  export type UserUpsertWithoutTokensInput = {
    update: XOR<UserUpdateWithoutTokensInput, UserUncheckedUpdateWithoutTokensInput>
    create: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTokensInput, UserUncheckedUpdateWithoutTokensInput>
  }

  export type UserUpdateWithoutTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatMemberCreateWithoutChatInput = {
    id?: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
    user: UserCreateNestedOneWithoutChatMembersInput
  }

  export type ChatMemberUncheckedCreateWithoutChatInput = {
    id?: string
    userId: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
  }

  export type ChatMemberCreateOrConnectWithoutChatInput = {
    where: ChatMemberWhereUniqueInput
    create: XOR<ChatMemberCreateWithoutChatInput, ChatMemberUncheckedCreateWithoutChatInput>
  }

  export type ChatMemberCreateManyChatInputEnvelope = {
    data: ChatMemberCreateManyChatInput | ChatMemberCreateManyChatInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutChatInput = {
    id?: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutMessagesInput
    replyTo?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutChatInput = {
    id?: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: MessageUncheckedCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutChatInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutChatInput, MessageUncheckedCreateWithoutChatInput>
  }

  export type MessageCreateManyChatInputEnvelope = {
    data: MessageCreateManyChatInput | MessageCreateManyChatInput[]
    skipDuplicates?: boolean
  }

  export type CallCreateWithoutChatInput = {
    id?: string
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
    initiator: UserCreateNestedOneWithoutSentCallsInput
    receiver?: UserCreateNestedOneWithoutReceivedCallsInput
  }

  export type CallUncheckedCreateWithoutChatInput = {
    id?: string
    initiatorId: string
    receiverId?: string | null
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type CallCreateOrConnectWithoutChatInput = {
    where: CallWhereUniqueInput
    create: XOR<CallCreateWithoutChatInput, CallUncheckedCreateWithoutChatInput>
  }

  export type CallCreateManyChatInputEnvelope = {
    data: CallCreateManyChatInput | CallCreateManyChatInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutCreatedChatsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedChatsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedChatsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedChatsInput, UserUncheckedCreateWithoutCreatedChatsInput>
  }

  export type UserCreateWithoutChatsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
  }

  export type ChatMemberUpsertWithWhereUniqueWithoutChatInput = {
    where: ChatMemberWhereUniqueInput
    update: XOR<ChatMemberUpdateWithoutChatInput, ChatMemberUncheckedUpdateWithoutChatInput>
    create: XOR<ChatMemberCreateWithoutChatInput, ChatMemberUncheckedCreateWithoutChatInput>
  }

  export type ChatMemberUpdateWithWhereUniqueWithoutChatInput = {
    where: ChatMemberWhereUniqueInput
    data: XOR<ChatMemberUpdateWithoutChatInput, ChatMemberUncheckedUpdateWithoutChatInput>
  }

  export type ChatMemberUpdateManyWithWhereWithoutChatInput = {
    where: ChatMemberScalarWhereInput
    data: XOR<ChatMemberUpdateManyMutationInput, ChatMemberUncheckedUpdateManyWithoutChatInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutChatInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutChatInput, MessageUncheckedUpdateWithoutChatInput>
    create: XOR<MessageCreateWithoutChatInput, MessageUncheckedCreateWithoutChatInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutChatInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutChatInput, MessageUncheckedUpdateWithoutChatInput>
  }

  export type MessageUpdateManyWithWhereWithoutChatInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutChatInput>
  }

  export type CallUpsertWithWhereUniqueWithoutChatInput = {
    where: CallWhereUniqueInput
    update: XOR<CallUpdateWithoutChatInput, CallUncheckedUpdateWithoutChatInput>
    create: XOR<CallCreateWithoutChatInput, CallUncheckedCreateWithoutChatInput>
  }

  export type CallUpdateWithWhereUniqueWithoutChatInput = {
    where: CallWhereUniqueInput
    data: XOR<CallUpdateWithoutChatInput, CallUncheckedUpdateWithoutChatInput>
  }

  export type CallUpdateManyWithWhereWithoutChatInput = {
    where: CallScalarWhereInput
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyWithoutChatInput>
  }

  export type UserUpsertWithoutCreatedChatsInput = {
    update: XOR<UserUpdateWithoutCreatedChatsInput, UserUncheckedUpdateWithoutCreatedChatsInput>
    create: XOR<UserCreateWithoutCreatedChatsInput, UserUncheckedCreateWithoutCreatedChatsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedChatsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedChatsInput, UserUncheckedUpdateWithoutCreatedChatsInput>
  }

  export type UserUpdateWithoutCreatedChatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedChatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutChatsInput = {
    update: XOR<UserUpdateWithoutChatsInput, UserUncheckedUpdateWithoutChatsInput>
    create: XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatsInput, UserUncheckedUpdateWithoutChatsInput>
  }

  export type UserUpdateWithoutChatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatCreateWithoutMembersInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageCreateNestedManyWithoutChatInput
    calls?: CallCreateNestedManyWithoutChatInput
    creator: UserCreateNestedOneWithoutCreatedChatsInput
    user?: UserCreateNestedOneWithoutChatsInput
  }

  export type ChatUncheckedCreateWithoutMembersInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput
    calls?: CallUncheckedCreateNestedManyWithoutChatInput
  }

  export type ChatCreateOrConnectWithoutMembersInput = {
    where: ChatWhereUniqueInput
    create: XOR<ChatCreateWithoutMembersInput, ChatUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutChatMembersInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatMembersInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatMembersInput, UserUncheckedCreateWithoutChatMembersInput>
  }

  export type ChatUpsertWithoutMembersInput = {
    update: XOR<ChatUpdateWithoutMembersInput, ChatUncheckedUpdateWithoutMembersInput>
    create: XOR<ChatCreateWithoutMembersInput, ChatUncheckedCreateWithoutMembersInput>
    where?: ChatWhereInput
  }

  export type ChatUpdateToOneWithWhereWithoutMembersInput = {
    where?: ChatWhereInput
    data: XOR<ChatUpdateWithoutMembersInput, ChatUncheckedUpdateWithoutMembersInput>
  }

  export type ChatUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUpdateManyWithoutChatNestedInput
    calls?: CallUpdateManyWithoutChatNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedChatsNestedInput
    user?: UserUpdateOneWithoutChatsNestedInput
  }

  export type ChatUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput
    calls?: CallUncheckedUpdateManyWithoutChatNestedInput
  }

  export type UserUpsertWithoutChatMembersInput = {
    update: XOR<UserUpdateWithoutChatMembersInput, UserUncheckedUpdateWithoutChatMembersInput>
    create: XOR<UserCreateWithoutChatMembersInput, UserUncheckedCreateWithoutChatMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatMembersInput, UserUncheckedUpdateWithoutChatMembersInput>
  }

  export type UserUpdateWithoutChatMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatCreateWithoutMessagesInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ChatMemberCreateNestedManyWithoutChatInput
    calls?: CallCreateNestedManyWithoutChatInput
    creator: UserCreateNestedOneWithoutCreatedChatsInput
    user?: UserCreateNestedOneWithoutChatsInput
  }

  export type ChatUncheckedCreateWithoutMessagesInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    members?: ChatMemberUncheckedCreateNestedManyWithoutChatInput
    calls?: CallUncheckedCreateNestedManyWithoutChatInput
  }

  export type ChatCreateOrConnectWithoutMessagesInput = {
    where: ChatWhereUniqueInput
    create: XOR<ChatCreateWithoutMessagesInput, ChatUncheckedCreateWithoutMessagesInput>
  }

  export type UserCreateWithoutMessagesInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessagesInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
  }

  export type MessageCreateWithoutRepliesInput = {
    id?: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chat: ChatCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessagesInput
    replyTo?: MessageCreateNestedOneWithoutRepliesInput
    readStatus?: MessageReadStatusCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutRepliesInput = {
    id?: string
    chatId: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    readStatus?: MessageReadStatusUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutRepliesInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
  }

  export type MessageCreateWithoutReplyToInput = {
    id?: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chat: ChatCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessagesInput
    replies?: MessageCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusCreateNestedManyWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutReplyToInput = {
    id?: string
    chatId: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: MessageUncheckedCreateNestedManyWithoutReplyToInput
    readStatus?: MessageReadStatusUncheckedCreateNestedManyWithoutMessageInput
  }

  export type MessageCreateOrConnectWithoutReplyToInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutReplyToInput, MessageUncheckedCreateWithoutReplyToInput>
  }

  export type MessageCreateManyReplyToInputEnvelope = {
    data: MessageCreateManyReplyToInput | MessageCreateManyReplyToInput[]
    skipDuplicates?: boolean
  }

  export type MessageReadStatusCreateWithoutMessageInput = {
    id?: string
    readAt?: Date | string
    user: UserCreateNestedOneWithoutMessageReadsInput
  }

  export type MessageReadStatusUncheckedCreateWithoutMessageInput = {
    id?: string
    userId: string
    readAt?: Date | string
  }

  export type MessageReadStatusCreateOrConnectWithoutMessageInput = {
    where: MessageReadStatusWhereUniqueInput
    create: XOR<MessageReadStatusCreateWithoutMessageInput, MessageReadStatusUncheckedCreateWithoutMessageInput>
  }

  export type MessageReadStatusCreateManyMessageInputEnvelope = {
    data: MessageReadStatusCreateManyMessageInput | MessageReadStatusCreateManyMessageInput[]
    skipDuplicates?: boolean
  }

  export type ChatUpsertWithoutMessagesInput = {
    update: XOR<ChatUpdateWithoutMessagesInput, ChatUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatCreateWithoutMessagesInput, ChatUncheckedCreateWithoutMessagesInput>
    where?: ChatWhereInput
  }

  export type ChatUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatWhereInput
    data: XOR<ChatUpdateWithoutMessagesInput, ChatUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ChatMemberUpdateManyWithoutChatNestedInput
    calls?: CallUpdateManyWithoutChatNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedChatsNestedInput
    user?: UserUpdateOneWithoutChatsNestedInput
  }

  export type ChatUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ChatMemberUncheckedUpdateManyWithoutChatNestedInput
    calls?: CallUncheckedUpdateManyWithoutChatNestedInput
  }

  export type UserUpsertWithoutMessagesInput = {
    update: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MessageUpsertWithoutRepliesInput = {
    update: XOR<MessageUpdateWithoutRepliesInput, MessageUncheckedUpdateWithoutRepliesInput>
    create: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    where?: MessageWhereInput
  }

  export type MessageUpdateToOneWithWhereWithoutRepliesInput = {
    where?: MessageWhereInput
    data: XOR<MessageUpdateWithoutRepliesInput, MessageUncheckedUpdateWithoutRepliesInput>
  }

  export type MessageUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput
    replyTo?: MessageUpdateOneWithoutRepliesNestedInput
    readStatus?: MessageReadStatusUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readStatus?: MessageReadStatusUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUpsertWithWhereUniqueWithoutReplyToInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutReplyToInput, MessageUncheckedUpdateWithoutReplyToInput>
    create: XOR<MessageCreateWithoutReplyToInput, MessageUncheckedCreateWithoutReplyToInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutReplyToInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutReplyToInput, MessageUncheckedUpdateWithoutReplyToInput>
  }

  export type MessageUpdateManyWithWhereWithoutReplyToInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutReplyToInput>
  }

  export type MessageReadStatusUpsertWithWhereUniqueWithoutMessageInput = {
    where: MessageReadStatusWhereUniqueInput
    update: XOR<MessageReadStatusUpdateWithoutMessageInput, MessageReadStatusUncheckedUpdateWithoutMessageInput>
    create: XOR<MessageReadStatusCreateWithoutMessageInput, MessageReadStatusUncheckedCreateWithoutMessageInput>
  }

  export type MessageReadStatusUpdateWithWhereUniqueWithoutMessageInput = {
    where: MessageReadStatusWhereUniqueInput
    data: XOR<MessageReadStatusUpdateWithoutMessageInput, MessageReadStatusUncheckedUpdateWithoutMessageInput>
  }

  export type MessageReadStatusUpdateManyWithWhereWithoutMessageInput = {
    where: MessageReadStatusScalarWhereInput
    data: XOR<MessageReadStatusUpdateManyMutationInput, MessageReadStatusUncheckedUpdateManyWithoutMessageInput>
  }

  export type MessageCreateWithoutReadStatusInput = {
    id?: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chat: ChatCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessagesInput
    replyTo?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReplyToInput
  }

  export type MessageUncheckedCreateWithoutReadStatusInput = {
    id?: string
    chatId: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: MessageUncheckedCreateNestedManyWithoutReplyToInput
  }

  export type MessageCreateOrConnectWithoutReadStatusInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutReadStatusInput, MessageUncheckedCreateWithoutReadStatusInput>
  }

  export type UserCreateWithoutMessageReadsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessageReadsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessageReadsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessageReadsInput, UserUncheckedCreateWithoutMessageReadsInput>
  }

  export type MessageUpsertWithoutReadStatusInput = {
    update: XOR<MessageUpdateWithoutReadStatusInput, MessageUncheckedUpdateWithoutReadStatusInput>
    create: XOR<MessageCreateWithoutReadStatusInput, MessageUncheckedCreateWithoutReadStatusInput>
    where?: MessageWhereInput
  }

  export type MessageUpdateToOneWithWhereWithoutReadStatusInput = {
    where?: MessageWhereInput
    data: XOR<MessageUpdateWithoutReadStatusInput, MessageUncheckedUpdateWithoutReadStatusInput>
  }

  export type MessageUpdateWithoutReadStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput
    replyTo?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReplyToNestedInput
  }

  export type MessageUncheckedUpdateWithoutReadStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: MessageUncheckedUpdateManyWithoutReplyToNestedInput
  }

  export type UserUpsertWithoutMessageReadsInput = {
    update: XOR<UserUpdateWithoutMessageReadsInput, UserUncheckedUpdateWithoutMessageReadsInput>
    create: XOR<UserCreateWithoutMessageReadsInput, UserUncheckedCreateWithoutMessageReadsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessageReadsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessageReadsInput, UserUncheckedUpdateWithoutMessageReadsInput>
  }

  export type UserUpdateWithoutMessageReadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessageReadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatCreateWithoutCallsInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ChatMemberCreateNestedManyWithoutChatInput
    messages?: MessageCreateNestedManyWithoutChatInput
    creator: UserCreateNestedOneWithoutCreatedChatsInput
    user?: UserCreateNestedOneWithoutChatsInput
  }

  export type ChatUncheckedCreateWithoutCallsInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    members?: ChatMemberUncheckedCreateNestedManyWithoutChatInput
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput
  }

  export type ChatCreateOrConnectWithoutCallsInput = {
    where: ChatWhereUniqueInput
    create: XOR<ChatCreateWithoutCallsInput, ChatUncheckedCreateWithoutCallsInput>
  }

  export type UserCreateWithoutSentCallsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSentCallsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSentCallsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentCallsInput, UserUncheckedCreateWithoutSentCallsInput>
  }

  export type UserCreateWithoutReceivedCallsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReceivedCallsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReceivedCallsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedCallsInput, UserUncheckedCreateWithoutReceivedCallsInput>
  }

  export type ChatUpsertWithoutCallsInput = {
    update: XOR<ChatUpdateWithoutCallsInput, ChatUncheckedUpdateWithoutCallsInput>
    create: XOR<ChatCreateWithoutCallsInput, ChatUncheckedCreateWithoutCallsInput>
    where?: ChatWhereInput
  }

  export type ChatUpdateToOneWithWhereWithoutCallsInput = {
    where?: ChatWhereInput
    data: XOR<ChatUpdateWithoutCallsInput, ChatUncheckedUpdateWithoutCallsInput>
  }

  export type ChatUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ChatMemberUpdateManyWithoutChatNestedInput
    messages?: MessageUpdateManyWithoutChatNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedChatsNestedInput
    user?: UserUpdateOneWithoutChatsNestedInput
  }

  export type ChatUncheckedUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ChatMemberUncheckedUpdateManyWithoutChatNestedInput
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput
  }

  export type UserUpsertWithoutSentCallsInput = {
    update: XOR<UserUpdateWithoutSentCallsInput, UserUncheckedUpdateWithoutSentCallsInput>
    create: XOR<UserCreateWithoutSentCallsInput, UserUncheckedCreateWithoutSentCallsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentCallsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentCallsInput, UserUncheckedUpdateWithoutSentCallsInput>
  }

  export type UserUpdateWithoutSentCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSentCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutReceivedCallsInput = {
    update: XOR<UserUpdateWithoutReceivedCallsInput, UserUncheckedUpdateWithoutReceivedCallsInput>
    create: XOR<UserCreateWithoutReceivedCallsInput, UserUncheckedCreateWithoutReceivedCallsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedCallsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedCallsInput, UserUncheckedUpdateWithoutReceivedCallsInput>
  }

  export type UserUpdateWithoutReceivedCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutFollowersInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFollowersInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFollowersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
  }

  export type UserCreateWithoutFollowingInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFollowingInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFollowingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
  }

  export type UserUpsertWithoutFollowersInput = {
    update: XOR<UserUpdateWithoutFollowersInput, UserUncheckedUpdateWithoutFollowersInput>
    create: XOR<UserCreateWithoutFollowersInput, UserUncheckedCreateWithoutFollowersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFollowersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFollowersInput, UserUncheckedUpdateWithoutFollowersInput>
  }

  export type UserUpdateWithoutFollowersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFollowersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutFollowingInput = {
    update: XOR<UserUpdateWithoutFollowingInput, UserUncheckedUpdateWithoutFollowingInput>
    create: XOR<UserCreateWithoutFollowingInput, UserUncheckedCreateWithoutFollowingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFollowingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFollowingInput, UserUncheckedUpdateWithoutFollowingInput>
  }

  export type UserUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutProfileInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
  }

  export type UserUpsertWithoutProfileInput = {
    update: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPostsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPostsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
  }

  export type UserCreateWithoutAuthoredPostsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    postLikes?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuthoredPostsInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    postLikes?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuthoredPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuthoredPostsInput, UserUncheckedCreateWithoutAuthoredPostsInput>
  }

  export type PostCreateWithoutRepostsInput = {
    id?: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPostsInput
    author?: UserCreateNestedOneWithoutAuthoredPostsInput
    originalPost?: PostCreateNestedOneWithoutRepostsInput
    likes?: PostLikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutRepostsInput = {
    id?: string
    userId: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    likes?: PostLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutRepostsInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
  }

  export type PostCreateWithoutOriginalPostInput = {
    id?: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPostsInput
    author?: UserCreateNestedOneWithoutAuthoredPostsInput
    reposts?: PostCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutOriginalPostInput = {
    id?: string
    userId: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reposts?: PostUncheckedCreateNestedManyWithoutOriginalPostInput
    likes?: PostLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutOriginalPostInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutOriginalPostInput, PostUncheckedCreateWithoutOriginalPostInput>
  }

  export type PostCreateManyOriginalPostInputEnvelope = {
    data: PostCreateManyOriginalPostInput | PostCreateManyOriginalPostInput[]
    skipDuplicates?: boolean
  }

  export type PostLikeCreateWithoutPostInput = {
    id?: string
    isLike?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPostLikesInput
  }

  export type PostLikeUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    isLike?: boolean
    createdAt?: Date | string
  }

  export type PostLikeCreateOrConnectWithoutPostInput = {
    where: PostLikeWhereUniqueInput
    create: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput>
  }

  export type PostLikeCreateManyPostInputEnvelope = {
    data: PostLikeCreateManyPostInput | PostLikeCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPostsInput = {
    update: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutAuthoredPostsInput = {
    update: XOR<UserUpdateWithoutAuthoredPostsInput, UserUncheckedUpdateWithoutAuthoredPostsInput>
    create: XOR<UserCreateWithoutAuthoredPostsInput, UserUncheckedCreateWithoutAuthoredPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuthoredPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuthoredPostsInput, UserUncheckedUpdateWithoutAuthoredPostsInput>
  }

  export type UserUpdateWithoutAuthoredPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    postLikes?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuthoredPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    postLikes?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PostUpsertWithoutRepostsInput = {
    update: XOR<PostUpdateWithoutRepostsInput, PostUncheckedUpdateWithoutRepostsInput>
    create: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutRepostsInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutRepostsInput, PostUncheckedUpdateWithoutRepostsInput>
  }

  export type PostUpdateWithoutRepostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPostsNestedInput
    author?: UserUpdateOneWithoutAuthoredPostsNestedInput
    originalPost?: PostUpdateOneWithoutRepostsNestedInput
    likes?: PostLikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutRepostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUpsertWithWhereUniqueWithoutOriginalPostInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutOriginalPostInput, PostUncheckedUpdateWithoutOriginalPostInput>
    create: XOR<PostCreateWithoutOriginalPostInput, PostUncheckedCreateWithoutOriginalPostInput>
  }

  export type PostUpdateWithWhereUniqueWithoutOriginalPostInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutOriginalPostInput, PostUncheckedUpdateWithoutOriginalPostInput>
  }

  export type PostUpdateManyWithWhereWithoutOriginalPostInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutOriginalPostInput>
  }

  export type PostLikeUpsertWithWhereUniqueWithoutPostInput = {
    where: PostLikeWhereUniqueInput
    update: XOR<PostLikeUpdateWithoutPostInput, PostLikeUncheckedUpdateWithoutPostInput>
    create: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput>
  }

  export type PostLikeUpdateWithWhereUniqueWithoutPostInput = {
    where: PostLikeWhereUniqueInput
    data: XOR<PostLikeUpdateWithoutPostInput, PostLikeUncheckedUpdateWithoutPostInput>
  }

  export type PostLikeUpdateManyWithWhereWithoutPostInput = {
    where: PostLikeScalarWhereInput
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyWithoutPostInput>
  }

  export type PostCreateWithoutLikesInput = {
    id?: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPostsInput
    author?: UserCreateNestedOneWithoutAuthoredPostsInput
    originalPost?: PostCreateNestedOneWithoutRepostsInput
    reposts?: PostCreateNestedManyWithoutOriginalPostInput
  }

  export type PostUncheckedCreateWithoutLikesInput = {
    id?: string
    userId: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    reposts?: PostUncheckedCreateNestedManyWithoutOriginalPostInput
  }

  export type PostCreateOrConnectWithoutLikesInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
  }

  export type UserCreateWithoutPostLikesInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenCreateNestedManyWithoutUserInput
    createdChats?: ChatCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    sentCalls?: CallCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusCreateNestedManyWithoutUserInput
    chats?: ChatCreateNestedManyWithoutUserInput
    followers?: FollowCreateNestedManyWithoutFollowerInput
    following?: FollowCreateNestedManyWithoutFollowingInput
    profile?: ProfileCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutUserInput
    authoredPosts?: PostCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutPostLikesInput = {
    id?: string
    name: string
    email: string
    isAcivated?: boolean
    activationLink: string
    role: $Enums.user_roles
    password: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tokens?: TokenUncheckedCreateNestedManyWithoutUserInput
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput
    chatMembers?: ChatMemberUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    sentCalls?: CallUncheckedCreateNestedManyWithoutInitiatorInput
    receivedCalls?: CallUncheckedCreateNestedManyWithoutReceiverInput
    messageReads?: MessageReadStatusUncheckedCreateNestedManyWithoutUserInput
    chats?: ChatUncheckedCreateNestedManyWithoutUserInput
    followers?: FollowUncheckedCreateNestedManyWithoutFollowerInput
    following?: FollowUncheckedCreateNestedManyWithoutFollowingInput
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutUserInput
    authoredPosts?: PostUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutPostLikesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostLikesInput, UserUncheckedCreateWithoutPostLikesInput>
  }

  export type PostUpsertWithoutLikesInput = {
    update: XOR<PostUpdateWithoutLikesInput, PostUncheckedUpdateWithoutLikesInput>
    create: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutLikesInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutLikesInput, PostUncheckedUpdateWithoutLikesInput>
  }

  export type PostUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPostsNestedInput
    author?: UserUpdateOneWithoutAuthoredPostsNestedInput
    originalPost?: PostUpdateOneWithoutRepostsNestedInput
    reposts?: PostUpdateManyWithoutOriginalPostNestedInput
  }

  export type PostUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reposts?: PostUncheckedUpdateManyWithoutOriginalPostNestedInput
  }

  export type UserUpsertWithoutPostLikesInput = {
    update: XOR<UserUpdateWithoutPostLikesInput, UserUncheckedUpdateWithoutPostLikesInput>
    create: XOR<UserCreateWithoutPostLikesInput, UserUncheckedCreateWithoutPostLikesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostLikesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostLikesInput, UserUncheckedUpdateWithoutPostLikesInput>
  }

  export type UserUpdateWithoutPostLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUpdateManyWithoutUserNestedInput
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUpdateManyWithoutUserNestedInput
    chats?: ChatUpdateManyWithoutUserNestedInput
    followers?: FollowUpdateManyWithoutFollowerNestedInput
    following?: FollowUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutPostLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    isAcivated?: BoolFieldUpdateOperationsInput | boolean
    activationLink?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_rolesFieldUpdateOperationsInput | $Enums.user_roles
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokens?: TokenUncheckedUpdateManyWithoutUserNestedInput
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput
    chatMembers?: ChatMemberUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    sentCalls?: CallUncheckedUpdateManyWithoutInitiatorNestedInput
    receivedCalls?: CallUncheckedUpdateManyWithoutReceiverNestedInput
    messageReads?: MessageReadStatusUncheckedUpdateManyWithoutUserNestedInput
    chats?: ChatUncheckedUpdateManyWithoutUserNestedInput
    followers?: FollowUncheckedUpdateManyWithoutFollowerNestedInput
    following?: FollowUncheckedUpdateManyWithoutFollowingNestedInput
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutUserNestedInput
    authoredPosts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type TokenCreateManyUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type ChatCreateManyCreatorInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ChatMemberCreateManyUserInput = {
    id?: string
    chatId: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
  }

  export type MessageCreateManySenderInput = {
    id?: string
    chatId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CallCreateManyInitiatorInput = {
    id?: string
    chatId: string
    receiverId?: string | null
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type CallCreateManyReceiverInput = {
    id?: string
    chatId: string
    initiatorId: string
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type MessageReadStatusCreateManyUserInput = {
    id?: string
    messageId: string
    readAt?: Date | string
  }

  export type ChatCreateManyUserInput = {
    id?: string
    type?: $Enums.ChatType
    name?: string | null
    description?: string | null
    avatar?: string | null
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FollowCreateManyFollowerInput = {
    id?: string
    followingId: string
    createdAt?: Date | string
  }

  export type FollowCreateManyFollowingInput = {
    id?: string
    followerId: string
    createdAt?: Date | string
  }

  export type PostCreateManyUserInput = {
    id?: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PostCreateManyAuthorInput = {
    id?: string
    userId: string
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    originalPostId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PostLikeCreateManyUserInput = {
    id?: string
    postId: string
    isLike?: boolean
    createdAt?: Date | string
  }

  export type TokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ChatMemberUpdateManyWithoutChatNestedInput
    messages?: MessageUpdateManyWithoutChatNestedInput
    calls?: CallUpdateManyWithoutChatNestedInput
    user?: UserUpdateOneWithoutChatsNestedInput
  }

  export type ChatUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ChatMemberUncheckedUpdateManyWithoutChatNestedInput
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput
    calls?: CallUncheckedUpdateManyWithoutChatNestedInput
  }

  export type ChatUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    chat?: ChatUpdateOneRequiredWithoutMembersNestedInput
  }

  export type ChatMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput
    replyTo?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: MessageUncheckedUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUpdateWithoutInitiatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutCallsNestedInput
    receiver?: UserUpdateOneWithoutReceivedCallsNestedInput
  }

  export type CallUncheckedUpdateWithoutInitiatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    receiverId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyWithoutInitiatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    receiverId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutCallsNestedInput
    initiator?: UserUpdateOneRequiredWithoutSentCallsNestedInput
  }

  export type CallUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: MessageUpdateOneRequiredWithoutReadStatusNestedInput
  }

  export type MessageReadStatusUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ChatMemberUpdateManyWithoutChatNestedInput
    messages?: MessageUpdateManyWithoutChatNestedInput
    calls?: CallUpdateManyWithoutChatNestedInput
    creator?: UserUpdateOneRequiredWithoutCreatedChatsNestedInput
  }

  export type ChatUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ChatMemberUncheckedUpdateManyWithoutChatNestedInput
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput
    calls?: CallUncheckedUpdateManyWithoutChatNestedInput
  }

  export type ChatUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpdateWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    following?: UserUpdateOneRequiredWithoutFollowingNestedInput
  }

  export type FollowUncheckedUpdateWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUncheckedUpdateManyWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    follower?: UserUpdateOneRequiredWithoutFollowersNestedInput
  }

  export type FollowUncheckedUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUncheckedUpdateManyWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    author?: UserUpdateOneWithoutAuthoredPostsNestedInput
    originalPost?: PostUpdateOneWithoutRepostsNestedInput
    reposts?: PostUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reposts?: PostUncheckedUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPostsNestedInput
    originalPost?: PostUpdateOneWithoutRepostsNestedInput
    reposts?: PostUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reposts?: PostUncheckedUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    originalPostId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostLikeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutLikesNestedInput
  }

  export type PostLikeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMemberCreateManyChatInput = {
    id?: string
    userId: string
    role?: $Enums.ChatMemberRole
    joinedAt?: Date | string
    leftAt?: Date | string | null
    lastReadAt?: Date | string | null
  }

  export type MessageCreateManyChatInput = {
    id?: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    replyToId?: string | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CallCreateManyChatInput = {
    id?: string
    initiatorId: string
    receiverId?: string | null
    type?: $Enums.CallType
    status?: $Enums.CallStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    duration?: number | null
    createdAt?: Date | string
  }

  export type ChatMemberUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutChatMembersNestedInput
  }

  export type ChatMemberUncheckedUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatMemberUncheckedUpdateManyWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumChatMemberRoleFieldUpdateOperationsInput | $Enums.ChatMemberRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput
    replyTo?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: MessageUncheckedUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    replyToId?: NullableStringFieldUpdateOperationsInput | string | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    initiator?: UserUpdateOneRequiredWithoutSentCallsNestedInput
    receiver?: UserUpdateOneWithoutReceivedCallsNestedInput
  }

  export type CallUncheckedUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string
    initiatorId?: StringFieldUpdateOperationsInput | string
    receiverId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumCallTypeFieldUpdateOperationsInput | $Enums.CallType
    status?: EnumCallStatusFieldUpdateOperationsInput | $Enums.CallStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyReplyToInput = {
    id?: string
    chatId: string
    senderId: string
    content: string
    type?: $Enums.MessageType
    fileUrl?: string | null
    fileName?: string | null
    fileSize?: number | null
    editedAt?: Date | string | null
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageReadStatusCreateManyMessageInput = {
    id?: string
    userId: string
    readAt?: Date | string
  }

  export type MessageUpdateWithoutReplyToInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessagesNestedInput
    replies?: MessageUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutReplyToInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: MessageUncheckedUpdateManyWithoutReplyToNestedInput
    readStatus?: MessageReadStatusUncheckedUpdateManyWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutReplyToInput = {
    id?: StringFieldUpdateOperationsInput | string
    chatId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    fileUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMessageReadsNestedInput
  }

  export type MessageReadStatusUncheckedUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUncheckedUpdateManyWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyOriginalPostInput = {
    id?: string
    userId: string
    authorId?: string | null
    text?: string | null
    image?: string | null
    audio?: string | null
    video?: string | null
    link?: string | null
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type PostLikeCreateManyPostInput = {
    id?: string
    userId: string
    isLike?: boolean
    createdAt?: Date | string
  }

  export type PostUpdateWithoutOriginalPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPostsNestedInput
    author?: UserUpdateOneWithoutAuthoredPostsNestedInput
    reposts?: PostUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutOriginalPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reposts?: PostUncheckedUpdateManyWithoutOriginalPostNestedInput
    likes?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutOriginalPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    audio?: NullableStringFieldUpdateOperationsInput | string | null
    video?: NullableStringFieldUpdateOperationsInput | string | null
    link?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostLikeUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPostLikesNestedInput
  }

  export type PostLikeUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isLike?: BoolFieldUpdateOperationsInput | boolean
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