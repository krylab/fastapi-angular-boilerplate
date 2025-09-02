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
export class Api {
  /**
   * @description Health check endpoint. :return: health status.
   *
   * @name Health
   * @summary Health Check
   * @request GET:/api/health
   * @response `200` `HealthCheckApiHealthGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  health = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.HealthResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host ? `${host}/api/health` : "/api/health";

      return {
        url,
        method: "GET",
      };
    });
  };
}
