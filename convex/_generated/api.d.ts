/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as classes from "../classes.js";
import type * as clientele from "../clientele.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as logs from "../logs.js";
import type * as students from "../students.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  classes: typeof classes;
  clientele: typeof clientele;
  functions: typeof functions;
  http: typeof http;
  logs: typeof logs;
  students: typeof students;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
