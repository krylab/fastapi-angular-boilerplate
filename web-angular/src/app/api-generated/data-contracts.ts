/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

type AuthCookieLoginApiAuthCookieLoginPostData = any;

type AuthCookieLogoutApiAuthCookieLogoutPostData = any;

type AuthJwtLoginApiAuthJwtLoginPostData = BearerResponse;

type AuthJwtLogoutApiAuthJwtLogoutPostData = any;

/** BearerResponse */
interface BearerResponse {
  /** Access Token */
  access_token: string;
  /** Token Type */
  token_type: string;
}

/** Body_auth_cookie_login_api_auth_cookie_login_post */
interface BodyAuthCookieLoginApiAuthCookieLoginPost {
  /** Client Id */
  client_id?: string | null;
  /**
   * Client Secret
   * @format password
   */
  client_secret?: string | null;
  /** Grant Type */
  grant_type?: string | null;
  /**
   * Password
   * @format password
   */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Username */
  username: string;
}

/** Body_auth_jwt_login_api_auth_jwt_login_post */
interface BodyAuthJwtLoginApiAuthJwtLoginPost {
  /** Client Id */
  client_id?: string | null;
  /**
   * Client Secret
   * @format password
   */
  client_secret?: string | null;
  /** Grant Type */
  grant_type?: string | null;
  /**
   * Password
   * @format password
   */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Username */
  username: string;
}

/** Body_reset_forgot_password_api_auth_forgot_password_post */
interface BodyResetForgotPasswordApiAuthForgotPasswordPost {
  /**
   * Email
   * @format email
   */
  email: string;
}

/** Body_reset_reset_password_api_auth_reset_password_post */
interface BodyResetResetPasswordApiAuthResetPasswordPost {
  /** Password */
  password: string;
  /** Token */
  token: string;
}

/** Body_verify_request_token_api_auth_request_verify_token_post */
interface BodyVerifyRequestTokenApiAuthRequestVerifyTokenPost {
  /**
   * Email
   * @format email
   */
  email: string;
}

/** Body_verify_verify_api_auth_verify_post */
interface BodyVerifyVerifyApiAuthVerifyPost {
  /** Token */
  token: string;
}

type CreateRateLimitApiPlansRateLimitsPostData = RateLimitRead;

interface CreateRateLimitApiPlansRateLimitsPostParams {
  /** Tier Target Id */
  tier_target_id: number;
}

type CreateTierApiPlansTiersPostData = TierRead;

type DeleteRateLimitApiPlansRateLimitsRateLimitIdDeleteData = any;

type DeleteTierApiPlansTiersTierIdDeleteData = any;

/** ErrorModel */
interface ErrorModel {
  /** Detail */
  detail: string | Record<string, string>;
}

/** ErrorResponse */
interface ErrorResponse {
  /**
   * Debug
   * @default "An unknown and unhandled exception occurred in the API"
   */
  debug?: string;
  /** Extra */
  extra?: Record<string, any> | null;
  /**
   * Message
   * @default "The requested operation failed"
   */
  message?: string;
  /**
   * Status
   * @default 500
   */
  status?: number;
  /**
   * Type
   * @default "ApplicationException"
   */
  type?: string;
}

type GetRateLimitApiPlansRateLimitsRateLimitIdGetData = RateLimitRead;

/** Response Get Rate Limits Api Plans Rate Limits Get */
type GetRateLimitsApiPlansRateLimitsGetData = RateLimitRead[];

type GetTierApiPlansTiersTierIdGetData = TierRead;

/** Response Get Tiers Api Plans Tiers Get */
type GetTiersApiPlansTiersGetData = TierRead[];

/** Response Health Check Api Health Get */
type HealthCheckApiHealthGetData = Record<string, string>;

/** OAuth2AuthorizeResponse */
interface OAuth2AuthorizeResponse {
  /** Authorization Url */
  authorization_url: string;
}

type OauthGoogleJwtAuthorizeApiAuthGoogleAuthorizeGetData =
  OAuth2AuthorizeResponse;

type OauthGoogleJwtCallbackApiAuthGoogleCallbackGetData = any;

interface OauthGoogleJwtCallbackApiAuthGoogleCallbackGetParams {
  /** Code */
  code?: string | null;
  /** Code Verifier */
  code_verifier?: string | null;
  /** Error */
  error?: string | null;
  /** State */
  state?: string | null;
}

/** RateLimitCreate */
interface RateLimitCreate {
  /** Limit */
  limit: number;
  /** Name */
  name?: string | null;
  /** Path */
  path: string;
  /** Period */
  period: number;
}

/** RateLimitRead */
interface RateLimitRead {
  /** Id */
  id: number;
  /** Limit */
  limit: number;
  /** Name */
  name: string;
  /** Path */
  path: string;
  /** Period */
  period: number;
  /** Tier Target Id */
  tier_target_id: number;
}

/** RateLimitUpdate */
interface RateLimitUpdate {
  /** Limit */
  limit?: number | null;
  /** Name */
  name?: string | null;
  /** Path */
  path?: string | null;
  /** Period */
  period?: number | null;
}

type RegisterRegisterApiAuthRegisterPostData = UserRead;

type ResetForgotPasswordApiAuthForgotPasswordPostData = any;

type ResetResetPasswordApiAuthResetPasswordPostData = any;

/** TierCreate */
interface TierCreate {
  /** Name */
  name: string;
}

/** TierRead */
interface TierRead {
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Id */
  id: number;
  /** Name */
  name: string;
}

/** TierUpdate */
interface TierUpdate {
  /** Name */
  name?: string | null;
}

type UpdateRateLimitApiPlansRateLimitsRateLimitIdPutData = RateLimitRead;

type UpdateTierApiPlansTiersTierIdPutData = TierRead;

/**
 * UserCreate
 * Represents a create command for a user.
 */
interface UserCreate {
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Is Active
   * @default true
   */
  is_active?: boolean | null;
  /**
   * Is Superuser
   * @default false
   */
  is_superuser?: boolean | null;
  /**
   * Is Verified
   * @default false
   */
  is_verified?: boolean | null;
  /** Password */
  password: string;
}

/**
 * UserRead
 * Represents a read command for a user.
 */
interface UserRead {
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * Is Active
   * @default true
   */
  is_active?: boolean;
  /**
   * Is Superuser
   * @default false
   */
  is_superuser?: boolean;
  /**
   * Is Verified
   * @default false
   */
  is_verified?: boolean;
}

/**
 * UserUpdate
 * Represents an update command for a user.
 */
interface UserUpdate {
  /** Email */
  email?: string | null;
  /** Is Active */
  is_active?: boolean | null;
  /** Is Superuser */
  is_superuser?: boolean | null;
  /** Is Verified */
  is_verified?: boolean | null;
  /** Password */
  password?: string | null;
}

type UsersCurrentUserApiUsersMeGetData = UserRead;

type UsersDeleteUserApiUsersIdDeleteData = any;

type UsersPatchCurrentUserApiUsersMePatchData = UserRead;

type UsersPatchUserApiUsersIdPatchData = UserRead;

type UsersUserApiUsersIdGetData = UserRead;

type VerifyRequestTokenApiAuthRequestVerifyTokenPostData = any;

type VerifyVerifyApiAuthVerifyPostData = UserRead;

/** Input type for health method */
export type HealthInput = void;

/** Result type for health method */
export type HealthResult = HealthCheckApiHealthGetData;

/** Input type for register method */
export type RegisterInput = UserCreate;

/** Result type for register method */
export type RegisterResult = RegisterRegisterApiAuthRegisterPostData;

/** Input type for forgotPassword method */
export type ForgotPasswordInput =
  BodyResetForgotPasswordApiAuthForgotPasswordPost;

/** Result type for forgotPassword method */
export type ForgotPasswordResult =
  ResetForgotPasswordApiAuthForgotPasswordPostData;

/** Input type for resetPassword method */
export type ResetPasswordInput = BodyResetResetPasswordApiAuthResetPasswordPost;

/** Result type for resetPassword method */
export type ResetPasswordResult =
  ResetResetPasswordApiAuthResetPasswordPostData;

/** Input type for requestVerifyToken method */
export type RequestVerifyTokenInput =
  BodyVerifyRequestTokenApiAuthRequestVerifyTokenPost;

/** Result type for requestVerifyToken method */
export type RequestVerifyTokenResult =
  VerifyRequestTokenApiAuthRequestVerifyTokenPostData;

/** Input type for verify method */
export type VerifyInput = BodyVerifyVerifyApiAuthVerifyPost;

/** Result type for verify method */
export type VerifyResult = VerifyVerifyApiAuthVerifyPostData;

/** Input type for loginJwt method */
export type LoginJwtInput = BodyAuthJwtLoginApiAuthJwtLoginPost;

/** Result type for loginJwt method */
export type LoginJwtResult = AuthJwtLoginApiAuthJwtLoginPostData;

/** Input type for logoutJwt method */
export type LogoutJwtInput = void;

/** Result type for logoutJwt method */
export type LogoutJwtResult = AuthJwtLogoutApiAuthJwtLogoutPostData;

/** Input type for loginCookie method */
export type LoginCookieInput = BodyAuthCookieLoginApiAuthCookieLoginPost;

/** Result type for loginCookie method */
export type LoginCookieResult = AuthCookieLoginApiAuthCookieLoginPostData;

/** Input type for logoutCookie method */
export type LogoutCookieInput = void;

/** Result type for logoutCookie method */
export type LogoutCookieResult = AuthCookieLogoutApiAuthCookieLogoutPostData;

/** Input type for authorize method */
export type AuthorizeInput = void;

/** Result type for authorize method */
export type AuthorizeResult =
  OauthGoogleJwtAuthorizeApiAuthGoogleAuthorizeGetData;

/** Input type for callback method */
export type CallbackInput = {
  /** Code */
  code?: string | null;
  /** Code Verifier */
  code_verifier?: string | null;
  /** Error */
  error?: string | null;
  /** State */
  state?: string | null;
};

/** Result type for callback method */
export type CallbackResult = OauthGoogleJwtCallbackApiAuthGoogleCallbackGetData;

/** Input type for getMe method */
export type GetMeInput = void;

/** Result type for getMe method */
export type GetMeResult = UsersCurrentUserApiUsersMeGetData;

/** Input type for patchMe method */
export type PatchMeInput = UserUpdate;

/** Result type for patchMe method */
export type PatchMeResult = UsersPatchCurrentUserApiUsersMePatchData;

/** Input type for getUsersById method */
export type GetUsersByIdInput = {
  /** id */
  id: string;
};

/** Result type for getUsersById method */
export type GetUsersByIdResult = UsersUserApiUsersIdGetData;

/** Input type for patchUsersById method */
export type PatchUsersByIdInput = {
  /** id */
  id: string;
} & UserUpdate;

/** Result type for patchUsersById method */
export type PatchUsersByIdResult = UsersPatchUserApiUsersIdPatchData;

/** Input type for deleteUsersById method */
export type DeleteUsersByIdInput = {
  /** id */
  id: string;
};

/** Result type for deleteUsersById method */
export type DeleteUsersByIdResult = UsersDeleteUserApiUsersIdDeleteData;

/** Input type for getTiers method */
export type GetTiersInput = void;

/** Result type for getTiers method */
export type GetTiersResult = GetTiersApiPlansTiersGetData;

/** Input type for postTiers method */
export type PostTiersInput = TierCreate;

/** Result type for postTiers method */
export type PostTiersResult = CreateTierApiPlansTiersPostData;

/** Input type for getTiersByTierId method */
export type GetTiersByTierIdInput = {
  /** tierId */
  tierId: number;
};

/** Result type for getTiersByTierId method */
export type GetTiersByTierIdResult = GetTierApiPlansTiersTierIdGetData;

/** Input type for putTiersByTierId method */
export type PutTiersByTierIdInput = {
  /** tierId */
  tierId: number;
} & TierUpdate;

/** Result type for putTiersByTierId method */
export type PutTiersByTierIdResult = UpdateTierApiPlansTiersTierIdPutData;

/** Input type for deleteTiersByTierId method */
export type DeleteTiersByTierIdInput = {
  /** tierId */
  tierId: number;
};

/** Result type for deleteTiersByTierId method */
export type DeleteTiersByTierIdResult = DeleteTierApiPlansTiersTierIdDeleteData;

/** Input type for getRateLimits method */
export type GetRateLimitsInput = void;

/** Result type for getRateLimits method */
export type GetRateLimitsResult = GetRateLimitsApiPlansRateLimitsGetData;

/** Input type for postRateLimits method */
export type PostRateLimitsInput = RateLimitCreate;

/** Result type for postRateLimits method */
export type PostRateLimitsResult = CreateRateLimitApiPlansRateLimitsPostData;

/** Input type for getRateLimitsByRateLimitId method */
export type GetRateLimitsByRateLimitIdInput = {
  /** rateLimitId */
  rateLimitId: number;
};

/** Result type for getRateLimitsByRateLimitId method */
export type GetRateLimitsByRateLimitIdResult =
  GetRateLimitApiPlansRateLimitsRateLimitIdGetData;

/** Input type for putRateLimitsByRateLimitId method */
export type PutRateLimitsByRateLimitIdInput = {
  /** rateLimitId */
  rateLimitId: number;
} & RateLimitUpdate;

/** Result type for putRateLimitsByRateLimitId method */
export type PutRateLimitsByRateLimitIdResult =
  UpdateRateLimitApiPlansRateLimitsRateLimitIdPutData;

/** Input type for deleteRateLimitsByRateLimitId method */
export type DeleteRateLimitsByRateLimitIdInput = {
  /** rateLimitId */
  rateLimitId: number;
};

/** Result type for deleteRateLimitsByRateLimitId method */
export type DeleteRateLimitsByRateLimitIdResult =
  DeleteRateLimitApiPlansRateLimitsRateLimitIdDeleteData;
