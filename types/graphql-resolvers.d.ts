import { UserSortField } from '../src/graphql/enums/index';
import { SortDirection } from '../src/graphql/enums/index';
import { FileUpload } from '../src/graphql/scalars/Upload.scalar';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IGraphQLContext } from '../src/graphql/index';
export type Maybe<T> = T | null | undefined;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  DateTime: Date;
  Time: Date;
  GUID: string;
  Upload: FileUpload;
};



export type GQL_DummySubscriptionPayload = {
  __typename?: 'DummySubscriptionPayload';
  dummy?: Maybe<Scalars['String']>;
};

export type GQL_File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};


export type GQL_LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type GQL_LoginPayload = {
  __typename?: 'LoginPayload';
  user?: Maybe<GQL_User>;
};

export type GQL_Mutation = {
  __typename?: 'Mutation';
  /** @deprecated Field no longer supported */
  _dummy?: Maybe<Scalars['String']>;
  login?: Maybe<GQL_LoginPayload>;
  logout: Scalars['Boolean'];
  multipleUpload: Array<GQL_File>;
  register?: Maybe<GQL_RegisterPayload>;
  singleUpload: GQL_File;
};


export type GQL_MutationLoginArgs = {
  input: GQL_LoginInput;
};


export type GQL_MutationMultipleUploadArgs = {
  files: Array<Scalars['Upload']>;
};


export type GQL_MutationRegisterArgs = {
  input: GQL_RegisterInput;
};


export type GQL_MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};

export type GQL_Node = {
  id: Scalars['GUID'];
};

export type GQL_PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type GQL_Query = {
  __typename?: 'Query';
  /** @deprecated Field no longer supported */
  _authorizedOnlyQuery?: Maybe<Scalars['Boolean']>;
  /** @deprecated Field no longer supported */
  _dummy?: Maybe<Scalars['String']>;
  /** @deprecated Field no longer supported */
  _sampleDateScalar?: Maybe<Scalars['Date']>;
  /** @deprecated Field no longer supported */
  _sampleDateTimeScalar?: Maybe<Scalars['DateTime']>;
  /** @deprecated Field no longer supported */
  _sampleTimeScalar?: Maybe<Scalars['Time']>;
  node?: Maybe<GQL_Node>;
  users: GQL_UserConnection;
};


export type GQL_QueryNodeArgs = {
  id: Scalars['GUID'];
};


export type GQL_QueryUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  sortBy?: Maybe<GQL_UserSort>;
};

export type GQL_RegisterInput = {
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type GQL_RegisterPayload = {
  __typename?: 'RegisterPayload';
  success: Scalars['Boolean'];
};

export { SortDirection };

export type GQL_Subscription = {
  __typename?: 'Subscription';
  /** @deprecated Field no longer supported */
  _dummy?: Maybe<GQL_DummySubscriptionPayload>;
};



export type GQL_User = GQL_Node & {
  __typename?: 'User';
  id: Scalars['GUID'];
  firstName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type GQL_UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<Maybe<GQL_UserEdge>>;
  nodes: Array<Maybe<GQL_User>>;
  pageInfo: GQL_PageInfo;
  totalCount: Scalars['Int'];
};

export type GQL_UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node?: Maybe<GQL_User>;
};

export type GQL_UserSort = {
  field: UserSortField;
  direction: SortDirection;
};

export { UserSortField };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GQL_ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  GUID: ResolverTypeWrapper<Scalars['GUID']>;
  Node: GQL_ResolversTypes['User'];
  Int: ResolverTypeWrapper<Scalars['Int']>;
  UserSort: GQL_UserSort;
  UserSortField: UserSortField;
  SortDirection: SortDirection;
  UserConnection: ResolverTypeWrapper<GQL_UserConnection>;
  UserEdge: ResolverTypeWrapper<GQL_UserEdge>;
  User: ResolverTypeWrapper<GQL_User>;
  PageInfo: ResolverTypeWrapper<GQL_PageInfo>;
  Mutation: ResolverTypeWrapper<{}>;
  LoginInput: GQL_LoginInput;
  LoginPayload: ResolverTypeWrapper<GQL_LoginPayload>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  File: ResolverTypeWrapper<GQL_File>;
  RegisterInput: GQL_RegisterInput;
  RegisterPayload: ResolverTypeWrapper<GQL_RegisterPayload>;
  Subscription: ResolverTypeWrapper<{}>;
  DummySubscriptionPayload: ResolverTypeWrapper<GQL_DummySubscriptionPayload>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQL_ResolversParentTypes = {
  Query: {};
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Time: Scalars['Time'];
  GUID: Scalars['GUID'];
  Node: GQL_ResolversParentTypes['User'];
  Int: Scalars['Int'];
  UserSort: GQL_UserSort;
  UserSortField: UserSortField;
  SortDirection: SortDirection;
  UserConnection: GQL_UserConnection;
  UserEdge: GQL_UserEdge;
  User: GQL_User;
  PageInfo: GQL_PageInfo;
  Mutation: {};
  LoginInput: GQL_LoginInput;
  LoginPayload: GQL_LoginPayload;
  Upload: Scalars['Upload'];
  File: GQL_File;
  RegisterInput: GQL_RegisterInput;
  RegisterPayload: GQL_RegisterPayload;
  Subscription: {};
  DummySubscriptionPayload: GQL_DummySubscriptionPayload;
};

export interface GQL_DateScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface GQL_DateTimeScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GQL_DummySubscriptionPayloadResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['DummySubscriptionPayload'] = GQL_ResolversParentTypes['DummySubscriptionPayload']> = {
  dummy?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_FileResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['File'] = GQL_ResolversParentTypes['File']> = {
  filename?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  encoding?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface GQL_GuidScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['GUID'], any> {
  name: 'GUID';
}

export type GQL_LoginPayloadResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['LoginPayload'] = GQL_ResolversParentTypes['LoginPayload']> = {
  user?: Resolver<Maybe<GQL_ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_MutationResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Mutation'] = GQL_ResolversParentTypes['Mutation']> = {
  _dummy?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  login?: Resolver<Maybe<GQL_ResolversTypes['LoginPayload']>, ParentType, ContextType, RequireFields<GQL_MutationLoginArgs, 'input'>>;
  logout?: Resolver<GQL_ResolversTypes['Boolean'], ParentType, ContextType>;
  multipleUpload?: Resolver<Array<GQL_ResolversTypes['File']>, ParentType, ContextType, RequireFields<GQL_MutationMultipleUploadArgs, 'files'>>;
  register?: Resolver<Maybe<GQL_ResolversTypes['RegisterPayload']>, ParentType, ContextType, RequireFields<GQL_MutationRegisterArgs, 'input'>>;
  singleUpload?: Resolver<GQL_ResolversTypes['File'], ParentType, ContextType, RequireFields<GQL_MutationSingleUploadArgs, 'file'>>;
};

export type GQL_NodeResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Node'] = GQL_ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
  id?: Resolver<GQL_ResolversTypes['GUID'], ParentType, ContextType>;
};

export type GQL_PageInfoResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['PageInfo'] = GQL_ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<GQL_ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<GQL_ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_QueryResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Query'] = GQL_ResolversParentTypes['Query']> = {
  _authorizedOnlyQuery?: Resolver<Maybe<GQL_ResolversTypes['Boolean']>, ParentType, ContextType>;
  _dummy?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  _sampleDateScalar?: Resolver<Maybe<GQL_ResolversTypes['Date']>, ParentType, ContextType>;
  _sampleDateTimeScalar?: Resolver<Maybe<GQL_ResolversTypes['DateTime']>, ParentType, ContextType>;
  _sampleTimeScalar?: Resolver<Maybe<GQL_ResolversTypes['Time']>, ParentType, ContextType>;
  node?: Resolver<Maybe<GQL_ResolversTypes['Node']>, ParentType, ContextType, RequireFields<GQL_QueryNodeArgs, 'id'>>;
  users?: Resolver<GQL_ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<GQL_QueryUsersArgs, 'first'>>;
};

export type GQL_RegisterPayloadResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['RegisterPayload'] = GQL_ResolversParentTypes['RegisterPayload']> = {
  success?: Resolver<GQL_ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_SubscriptionResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Subscription'] = GQL_ResolversParentTypes['Subscription']> = {
  _dummy?: SubscriptionResolver<Maybe<GQL_ResolversTypes['DummySubscriptionPayload']>, "_dummy", ParentType, ContextType>;
};

export interface GQL_TimeScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface GQL_UploadScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type GQL_UserResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['User'] = GQL_ResolversParentTypes['User']> = {
  id?: Resolver<GQL_ResolversTypes['GUID'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  middleName?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  fullName?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<GQL_ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<GQL_ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_UserConnectionResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['UserConnection'] = GQL_ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Array<Maybe<GQL_ResolversTypes['UserEdge']>>, ParentType, ContextType>;
  nodes?: Resolver<Array<Maybe<GQL_ResolversTypes['User']>>, ParentType, ContextType>;
  pageInfo?: Resolver<GQL_ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<GQL_ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_UserEdgeResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['UserEdge'] = GQL_ResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<GQL_ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type GQL_Resolvers<ContextType = IGraphQLContext> = {
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DummySubscriptionPayload?: GQL_DummySubscriptionPayloadResolvers<ContextType>;
  File?: GQL_FileResolvers<ContextType>;
  GUID?: GraphQLScalarType;
  LoginPayload?: GQL_LoginPayloadResolvers<ContextType>;
  Mutation?: GQL_MutationResolvers<ContextType>;
  Node?: GQL_NodeResolvers;
  PageInfo?: GQL_PageInfoResolvers<ContextType>;
  Query?: GQL_QueryResolvers<ContextType>;
  RegisterPayload?: GQL_RegisterPayloadResolvers<ContextType>;
  Subscription?: GQL_SubscriptionResolvers<ContextType>;
  Time?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  User?: GQL_UserResolvers<ContextType>;
  UserConnection?: GQL_UserConnectionResolvers<ContextType>;
  UserEdge?: GQL_UserEdgeResolvers<ContextType>;
};


