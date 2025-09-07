/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { httpResource } from "@angular/common/http";
import { Injectable, Signal } from "@angular/core";
import * as Types from "./data-contracts";

/**
 * @title FastAPI
 * @version 0.1.0
 */
@Injectable({ providedIn: "root" })
export class Auth {
  /**
   * No description
   *
   * @tags auth
   * @name Register
   * @summary Register:Register
   * @request POST:/api/auth/register
   * @response `201` `RegisterRegisterApiAuthRegisterPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  register = (
    params: Signal<Types.RegisterInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.RegisterResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host ? `${host}/api/auth/register` : "/api/auth/register";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name ForgotPassword
   * @summary Reset:Forgot Password
   * @request POST:/api/auth/forgot-password
   * @response `202` `ResetForgotPasswordApiAuthForgotPasswordPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  forgotPassword = (
    params: Signal<Types.ForgotPasswordInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.ForgotPasswordResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/auth/forgot-password`
        : "/api/auth/forgot-password";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name ResetPassword
   * @summary Reset:Reset Password
   * @request POST:/api/auth/reset-password
   * @response `200` `ResetResetPasswordApiAuthResetPasswordPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  resetPassword = (
    params: Signal<Types.ResetPasswordInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.ResetPasswordResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/auth/reset-password`
        : "/api/auth/reset-password";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name RequestVerifyToken
   * @summary Verify:Request-Token
   * @request POST:/api/auth/request-verify-token
   * @response `202` `VerifyRequestTokenApiAuthRequestVerifyTokenPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  requestVerifyToken = (
    params: Signal<Types.RequestVerifyTokenInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.RequestVerifyTokenResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/auth/request-verify-token`
        : "/api/auth/request-verify-token";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name Verify
   * @summary Verify:Verify
   * @request POST:/api/auth/verify
   * @response `200` `VerifyVerifyApiAuthVerifyPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  verify = (params: Signal<Types.VerifyInput | undefined>, host?: string) => {
    return httpResource<Types.VerifyResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host ? `${host}/api/auth/verify` : "/api/auth/verify";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name Login
   * @summary Auth:Jwt.Login
   * @request POST:/api/auth/jwt/login
   * @response `200` `AuthJwtLoginApiAuthJwtLoginPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  loginJwt = (
    params: Signal<Types.LoginJwtInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.LoginJwtResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host ? `${host}/api/auth/jwt/login` : "/api/auth/jwt/login";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name Logout
   * @summary Auth:Jwt.Logout
   * @request POST:/api/auth/jwt/logout
   * @secure
   * @response `200` `AuthJwtLogoutApiAuthJwtLogoutPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  logoutJwt = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.LogoutJwtResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host ? `${host}/api/auth/jwt/logout` : "/api/auth/jwt/logout";

      return {
        url,
        method: "POST",
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name Login
   * @summary Auth:Cookie.Login
   * @request POST:/api/auth/cookie/login
   * @response `200` `AuthCookieLoginApiAuthCookieLoginPostData` Successful Response
   * @response `204` `void` No Content
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  loginCookie = (
    params: Signal<Types.LoginCookieInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.LoginCookieResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/auth/cookie/login`
        : "/api/auth/cookie/login";

      return {
        url,
        method: "POST",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags auth
   * @name Logout
   * @summary Auth:Cookie.Logout
   * @request POST:/api/auth/cookie/logout
   * @secure
   * @response `200` `AuthCookieLogoutApiAuthCookieLogoutPostData` Successful Response
   * @response `204` `void` No Content
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  logoutCookie = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.LogoutCookieResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host
        ? `${host}/api/auth/cookie/logout`
        : "/api/auth/cookie/logout";

      return {
        url,
        method: "POST",
      };
    });
  };

  /**
   * @description Custom Google OAuth authorize endpoint that uses scopes from config.
   *
   * @tags auth
   * @name Authorize
   * @summary Oauth:Google.Jwt.Authorize
   * @request GET:/api/auth/google/authorize
   * @response `200` `OauthGoogleJwtAuthorizeApiAuthGoogleAuthorizeGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  authorize = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.AuthorizeResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host
        ? `${host}/api/auth/google/authorize`
        : "/api/auth/google/authorize";

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * @description Custom Google OAuth callback that handles id_token
   *
   * @tags auth
   * @name Callback
   * @summary Oauth:Google.Jwt.Callback
   * @request GET:/api/auth/google/callback
   * @response `200` `OauthGoogleJwtCallbackApiAuthGoogleCallbackGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  callback = (
    params: Signal<Types.CallbackInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.CallbackResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/auth/google/callback`
        : "/api/auth/google/callback";

      const queryParams: Record<string, string> = {};
      // Extract query parameters (excluding path parameters)
      Object.entries(resolvedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams[key] = String(value);
        }
      });

      return {
        url,
        method: "GET",
        params: queryParams,
      };
    });
  };
}
