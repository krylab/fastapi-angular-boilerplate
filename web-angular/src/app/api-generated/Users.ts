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
  getMe = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.GetMeResult>(() => {
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
  patchMe = (params: Signal<Types.PatchMeInput | undefined>, host?: string) => {
    return httpResource<Types.PatchMeResult>(() => {
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
  getUsersById = (
    params: Signal<Types.GetUsersByIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.GetUsersByIdResult>(() => {
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
  patchUsersById = (
    params: Signal<Types.PatchUsersByIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PatchUsersByIdResult>(() => {
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
  deleteUsersById = (
    params: Signal<Types.DeleteUsersByIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.DeleteUsersByIdResult>(() => {
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
