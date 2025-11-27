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
export class Plans {
  /**
   * No description
   *
   * @tags plans
   * @name Tiers
   * @summary Get Tiers
   * @request GET:/api/plans/tiers
   * @response `200` `GetTiersApiPlansTiersGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  getTiers = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.GetTiersResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host ? `${host}/api/plans/tiers` : "/api/plans/tiers";

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name Tiers
   * @summary Create Tier
   * @request POST:/api/plans/tiers
   * @response `201` `CreateTierApiPlansTiersPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  postTiers = (
    params: Signal<Types.PostTiersInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PostTiersResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host ? `${host}/api/plans/tiers` : "/api/plans/tiers";

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
   * @tags plans
   * @name Tiers
   * @summary Get Tier
   * @request GET:/api/plans/tiers/{tier_id}
   * @response `200` `GetTierApiPlansTiersTierIdGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  getTiersByTierId = (
    params: Signal<Types.GetTiersByTierIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.GetTiersByTierIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/tiers/{tier_id}`
        : "/api/plans/tiers/{tier_id}";
      url = url.replace("{tierId}", String(resolvedParams.tierId));

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name Tiers
   * @summary Update Tier
   * @request PUT:/api/plans/tiers/{tier_id}
   * @response `200` `UpdateTierApiPlansTiersTierIdPutData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  putTiersByTierId = (
    params: Signal<Types.PutTiersByTierIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PutTiersByTierIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/tiers/{tier_id}`
        : "/api/plans/tiers/{tier_id}";
      url = url.replace("{tierId}", String(resolvedParams.tierId));

      return {
        url,
        method: "PUT",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name Tiers
   * @summary Delete Tier
   * @request DELETE:/api/plans/tiers/{tier_id}
   * @response `204` `DeleteTierApiPlansTiersTierIdDeleteData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  deleteTiersByTierId = (
    params: Signal<Types.DeleteTiersByTierIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.DeleteTiersByTierIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/tiers/{tier_id}`
        : "/api/plans/tiers/{tier_id}";
      url = url.replace("{tierId}", String(resolvedParams.tierId));

      return {
        url,
        method: "DELETE",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name TierTargets
   * @summary Get Tier Targets
   * @request GET:/api/plans/tier-targets
   * @response `200` `GetTierTargetsApiPlansTierTargetsGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  getTierTargets = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.GetTierTargetsResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host
        ? `${host}/api/plans/tier-targets`
        : "/api/plans/tier-targets";

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name TierTargets
   * @summary Create Tier Target
   * @request POST:/api/plans/tier-targets
   * @response `201` `CreateTierTargetApiPlansTierTargetsPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  postTierTargets = (
    params: Signal<Types.PostTierTargetsInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PostTierTargetsResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/plans/tier-targets`
        : "/api/plans/tier-targets";

      const queryParams: Record<string, string> = {};
      // Extract query parameters (excluding path parameters)
      Object.entries(resolvedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams[key] = String(value);
        }
      });

      return {
        url,
        method: "POST",
        params: queryParams,
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name TierTargets
   * @summary Get Tier Target
   * @request GET:/api/plans/tier-targets/{tier_target_id}
   * @response `200` `GetTierTargetApiPlansTierTargetsTierTargetIdGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  getTierTargetsByTierTargetId = (
    params: Signal<Types.GetTierTargetsByTierTargetIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.GetTierTargetsByTierTargetIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/tier-targets/{tier_target_id}`
        : "/api/plans/tier-targets/{tier_target_id}";
      url = url.replace("{tierTargetId}", String(resolvedParams.tierTargetId));

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name TierTargets
   * @summary Update Tier Target
   * @request PUT:/api/plans/tier-targets/{tier_target_id}
   * @response `200` `UpdateTierTargetApiPlansTierTargetsTierTargetIdPutData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  putTierTargetsByTierTargetId = (
    params: Signal<Types.PutTierTargetsByTierTargetIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PutTierTargetsByTierTargetIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/tier-targets/{tier_target_id}`
        : "/api/plans/tier-targets/{tier_target_id}";
      url = url.replace("{tierTargetId}", String(resolvedParams.tierTargetId));

      return {
        url,
        method: "PUT",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name TierTargets
   * @summary Delete Tier Target
   * @request DELETE:/api/plans/tier-targets/{tier_target_id}
   * @response `204` `DeleteTierTargetApiPlansTierTargetsTierTargetIdDeleteData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  deleteTierTargetsByTierTargetId = (
    params: Signal<Types.DeleteTierTargetsByTierTargetIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.DeleteTierTargetsByTierTargetIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/tier-targets/{tier_target_id}`
        : "/api/plans/tier-targets/{tier_target_id}";
      url = url.replace("{tierTargetId}", String(resolvedParams.tierTargetId));

      return {
        url,
        method: "DELETE",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name RateLimits
   * @summary Get Rate Limits
   * @request GET:/api/plans/rate-limits
   * @response `200` `GetRateLimitsApiPlansRateLimitsGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  getRateLimits = (trigger?: Signal<any>, host?: string) => {
    return httpResource<Types.GetRateLimitsResult>(() => {
      if (!trigger?.()) return undefined;

      const url = host
        ? `${host}/api/plans/rate-limits`
        : "/api/plans/rate-limits";

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name RateLimits
   * @summary Create Rate Limit
   * @request POST:/api/plans/rate-limits
   * @response `201` `CreateRateLimitApiPlansRateLimitsPostData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  postRateLimits = (
    params: Signal<Types.PostRateLimitsInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PostRateLimitsResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      const url = host
        ? `${host}/api/plans/rate-limits`
        : "/api/plans/rate-limits";

      const queryParams: Record<string, string> = {};
      // Extract query parameters (excluding path parameters)
      Object.entries(resolvedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams[key] = String(value);
        }
      });

      return {
        url,
        method: "POST",
        params: queryParams,
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name RateLimits
   * @summary Get Rate Limit
   * @request GET:/api/plans/rate-limits/{rate_limit_id}
   * @response `200` `GetRateLimitApiPlansRateLimitsRateLimitIdGetData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  getRateLimitsByRateLimitId = (
    params: Signal<Types.GetRateLimitsByRateLimitIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.GetRateLimitsByRateLimitIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/rate-limits/{rate_limit_id}`
        : "/api/plans/rate-limits/{rate_limit_id}";
      url = url.replace("{rateLimitId}", String(resolvedParams.rateLimitId));

      return {
        url,
        method: "GET",
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name RateLimits
   * @summary Update Rate Limit
   * @request PUT:/api/plans/rate-limits/{rate_limit_id}
   * @response `200` `UpdateRateLimitApiPlansRateLimitsRateLimitIdPutData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  putRateLimitsByRateLimitId = (
    params: Signal<Types.PutRateLimitsByRateLimitIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.PutRateLimitsByRateLimitIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/rate-limits/{rate_limit_id}`
        : "/api/plans/rate-limits/{rate_limit_id}";
      url = url.replace("{rateLimitId}", String(resolvedParams.rateLimitId));

      return {
        url,
        method: "PUT",
        body: resolvedParams,
      };
    });
  };

  /**
   * No description
   *
   * @tags plans
   * @name RateLimits
   * @summary Delete Rate Limit
   * @request DELETE:/api/plans/rate-limits/{rate_limit_id}
   * @response `204` `DeleteRateLimitApiPlansRateLimitsRateLimitIdDeleteData` Successful Response
   * @param host Optional base URL host (e.g., 'https://api.example.com') to override the default relative URL
   */
  deleteRateLimitsByRateLimitId = (
    params: Signal<Types.DeleteRateLimitsByRateLimitIdInput | undefined>,
    host?: string,
  ) => {
    return httpResource<Types.DeleteRateLimitsByRateLimitIdResult>(() => {
      const resolvedParams = params();
      if (!resolvedParams) return undefined;

      let url = host
        ? `${host}/api/plans/rate-limits/{rate_limit_id}`
        : "/api/plans/rate-limits/{rate_limit_id}";
      url = url.replace("{rateLimitId}", String(resolvedParams.rateLimitId));

      return {
        url,
        method: "DELETE",
      };
    });
  };
}
