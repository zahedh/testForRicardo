/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** RFC 7807 problem detail. Returned as `application/problem+json` for every 4xx and 5xx response from this API. `detail` carries the human-readable reason and is the field to surface or log; `title` and `status` restate the HTTP status.  */
export interface ProblemDetail {
  /**
   * URI identifying the problem type. Always "about:blank" - this API does not define problem types.
   * @format uri
   */
  type?: string;
  /** Short, human-readable summary of the problem type - the HTTP reason phrase for `status`. */
  title?: string;
  /**
   * The HTTP status code, repeated in the body.
   * @format int32
   */
  status?: number;
  /** Human-readable explanation specific to this occurrence of the problem. */
  detail?: string;
  /** Path of the request that produced the problem. */
  instance?: string;
}

export interface Subscriber {
  /** The subscribers title (Mr, Mrs, Miss etc..) */
  title?: string;
  /** The subscribers first and any other names */
  firstNames?: string;
  /** The subscribers last name */
  surname?: string;
  /**
   * The subscribers date of birth
   * @format date-time
   */
  dateOfBirth?: string;
  /**
   * The subscribers email address
   * @format email
   */
  email?: string;
  altContactNumber?: string;
}

/** Object with available properties that can be updated for subscriber.  */
export interface EditSubscriber {
  /** The title of the subscriber */
  title?: string;
  /** The first, and any other non-surname, of the subscriber */
  firstNames?: string;
  /** The surname of the subscriber */
  surname?: string;
  /**
   * The date of birth of the subscriber. For legacy compatibility reasons, input is accepted in a date-time format, but only the date portion is used.
   * @format date-time
   */
  dateOfBirth?: string;
  /**
   * The email address of the subscriber
   * @format email
   */
  email?: string;
  /** @pattern ^\d{10,15}$ */
  altContactNumber?: string;
}

/** Outcome of a payment taken from the subscriber. */
export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

/** A single payment taken from the subscriber. */
export interface Payment {
  /** Unique identifier of the payment */
  id?: string;
  /**
   * When the payment was taken
   * @format date-time
   */
  paymentDate?: string;
  /**
   * The amount taken, in major currency units (e.g. pounds, not pence)
   * @format double
   */
  amount?: number;
  /** ISO 4217 currency code, e.g. GBP */
  currency?: string;
  /** Human-readable description of what the payment was for */
  description?: string;
  /** Outcome of the payment */
  status?: PaymentStatus;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.example.com";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl https://api.example.com
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  subscriber = {
    /**
     * No description
     *
     * @tags Subscriber
     * @name SubscriberGet
     * @summary Get Subscriber
     * @request GET:/subscriber
     * @secure
     */
    subscriberGet: (params: RequestParams = {}) =>
      this.request<Subscriber, any>({
        path: `/subscriber`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriber
     * @name SubscriberPut
     * @summary Update Subscriber
     * @request PUT:/subscriber
     * @secure
     */
    subscriberPut: (data: EditSubscriber, params: RequestParams = {}) =>
      this.request<void, void | ProblemDetail>({
        path: `/subscriber`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),


    /**
     * Payment history for the subscriber
     *
     * @tags Payment
     * @name SubscriberPaymentGet
     * @summary Get Payment History
     * @request GET:/subscriber/payment
     * @secure
     */
    subscriberPaymentGet: (
      query?: {
        /**
         * Zero-based page index (0..N)
         * @default 0
         */
        page?: number;
        /**
         * The size of the page to be returned
         * @default 20
         */
        size?: number;
        /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Payment[], ProblemDetail>({
        path: `/subscriber/payment`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
