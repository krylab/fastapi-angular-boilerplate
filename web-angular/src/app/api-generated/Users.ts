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
export class Users {
  /**
   * No description
   *
   * @tags users
   * @name UsersMe
   * @summary Users:Current User
   * @request GET:/api/users/me
   * @secure
   * @response `200` `UsersCurrentUserApiUsersMeGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  usersMe = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.UsersMeApiResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host ? `${host}/api/users/me` : "/api/users/me";

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags users
   * @name UsersMe
   * @summary Users:Patch Current User
   * @request PATCH:/api/users/me
   * @secure
   * @response `200` `UsersPatchCurrentUserApiUsersMePatchData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  usersMe = (
    params: Signal<Types.UsersMeApiInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.UsersMeApiResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host ? `${host}/api/users/me` : "/api/users/me";

      return {
        url,
        method: "PATCH",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags users
   * @name Users
   * @summary Users:User
   * @request GET:/api/users/{id}
   * @secure
   * @response `200` `UsersUserApiUsersIdGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  usersId = (params: Signal<Types.UsersIdInput | undefined>, host?: string) => {
    return httpResource<Types.UsersIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host ? `${host}/api/users/{id}` : "/api/users/{id}";
      url = url.replace("{id}", String(resolvedParams.id));

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags users
   * @name Users
   * @summary Users:Patch User
   * @request PATCH:/api/users/{id}
   * @secure
   * @response `200` `UsersPatchUserApiUsersIdPatchData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  usersId = (params: Signal<Types.UsersIdInput | undefined>, host?: string) => {
    return httpResource<Types.UsersIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host ? `${host}/api/users/{id}` : "/api/users/{id}";
      url = url.replace("{id}", String(resolvedParams.id));

      return {
        url,
        method: "PATCH",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags users
   * @name Users
   * @summary Users:Delete User
   * @request DELETE:/api/users/{id}
   * @secure
   * @response `204` `UsersDeleteUserApiUsersIdDeleteData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  usersId = (params: Signal<Types.UsersIdInput | undefined>, host?: string) => {
    return httpResource<Types.UsersIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host ? `${host}/api/users/{id}` : "/api/users/{id}";
      url = url.replace("{id}", String(resolvedParams.id));

      return {
        url,
        method: "DELETE",
      };
    });
  };
}
