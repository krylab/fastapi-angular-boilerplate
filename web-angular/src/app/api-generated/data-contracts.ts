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

type RegisterRegisterApiAuthRegisterPostData = UserRead;

type ResetForgotPasswordApiAuthForgotPasswordPostData = any;

type ResetResetPasswordApiAuthResetPasswordPostData = any;

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

/** Input type for authRegister method */
export type AuthRegisterApiInput = UserCreate;

/** Result type for authRegister method */
export type AuthRegisterApiResult = RegisterRegisterApiAuthRegisterPostData;

/** Input type for authForgotPassword method */
export type AuthForgotPasswordInput =
  BodyResetForgotPasswordApiAuthForgotPasswordPost;

/** Result type for authForgotPassword method */
export type AuthForgotPasswordResult =
  ResetForgotPasswordApiAuthForgotPasswordPostData;

/** Input type for authResetPassword method */
export type AuthResetPasswordInput =
  BodyResetResetPasswordApiAuthResetPasswordPost;

/** Result type for authResetPassword method */
export type AuthResetPasswordResult =
  ResetResetPasswordApiAuthResetPasswordPostData;

/** Input type for authRequestVerifyToken method */
export type AuthRequestVerifyTokenInput =
  BodyVerifyRequestTokenApiAuthRequestVerifyTokenPost;

/** Result type for authRequestVerifyToken method */
export type AuthRequestVerifyTokenResult =
  VerifyRequestTokenApiAuthRequestVerifyTokenPostData;

/** Input type for authVerify method */
export type AuthVerifyInput = BodyVerifyVerifyApiAuthVerifyPost;

/** Result type for authVerify method */
export type AuthVerifyResult = VerifyVerifyApiAuthVerifyPostData;

/** Input type for authJwt method */
export type AuthJwtApiInput = BodyAuthJwtLoginApiAuthJwtLoginPost;

/** Result type for authJwt method */
export type AuthJwtApiResult = AuthJwtLoginApiAuthJwtLoginPostData;

/** Input type for authJwt method */
export type AuthJwtApiInput = void;

/** Result type for authJwt method */
export type AuthJwtApiResult = AuthJwtLogoutApiAuthJwtLogoutPostData;

/** Input type for authCookie method */
export type AuthCookieApiInput = BodyAuthCookieLoginApiAuthCookieLoginPost;

/** Result type for authCookie method */
export type AuthCookieApiResult = AuthCookieLoginApiAuthCookieLoginPostData;

/** Input type for authCookie method */
export type AuthCookieApiInput = void;

/** Result type for authCookie method */
export type AuthCookieApiResult = AuthCookieLogoutApiAuthCookieLogoutPostData;

/** Input type for authGoogle method */
export type AuthGoogleApiInput = void;

/** Result type for authGoogle method */
export type AuthGoogleApiResult =
  OauthGoogleJwtAuthorizeApiAuthGoogleAuthorizeGetData;

/** Input type for authGoogle method */
export type AuthGoogleApiInput = {
  /** Code */
  code?: string | null;
  /** Code Verifier */
  code_verifier?: string | null;
  /** Error */
  error?: string | null;
  /** State */
  state?: string | null;
};

/** Result type for authGoogle method */
export type AuthGoogleApiResult =
  OauthGoogleJwtCallbackApiAuthGoogleCallbackGetData;

/** Input type for usersMe method */
export type UsersMeApiInput = void;

/** Result type for usersMe method */
export type UsersMeApiResult = UsersCurrentUserApiUsersMeGetData;

/** Input type for usersMe method */
export type UsersMeApiInput = UserUpdate;

/** Result type for usersMe method */
export type UsersMeApiResult = UsersPatchCurrentUserApiUsersMePatchData;

/** Input type for usersId method */
export type UsersIdInput = {
  /** id */
  id: string;
};

/** Result type for usersId method */
export type UsersIdResult = UsersUserApiUsersIdGetData;

/** Input type for usersId method */
export type UsersIdInput = {
  /** id */
  id: string;
} & UserUpdate;

/** Result type for usersId method */
export type UsersIdResult = UsersPatchUserApiUsersIdPatchData;

/** Input type for usersId method */
export type UsersIdInput = {
  /** id */
  id: string;
};

/** Result type for usersId method */
export type UsersIdResult = UsersDeleteUserApiUsersIdDeleteData;
