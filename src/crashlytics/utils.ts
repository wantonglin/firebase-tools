import { FirebaseError } from "../error";
import { Client } from "../apiv2";
import { crashlyticsApiOrigin } from "../api";

export const TIMEOUT = 10000;

export const CRASHLYTICS_API_CLIENT = new Client({
  urlPrefix: crashlyticsApiOrigin(),
  apiVersion: "v1alpha",
});

export enum PLATFORM_PATH {
  ANDROID = "topAndroidDevices",
  IOS = "topAppleDevices",
}

export type CrashlyticsAppPlatform = "android" | "ios" | "web";

/**
 * Extracts the project number from a Firebase App ID.
 */
export function parseProjectNumber(appId: string): string {
  const appIdParts = appId.split(":");
  if (appIdParts.length > 1) {
    return appIdParts[1];
  }
  throw new FirebaseError("Unable to get the projectId from the AppId.");
}

/**
 * Extracts the platform segment ("android", "ios", or "web") from a Firebase App ID,
 * or returns undefined if the App ID does not match a known Crashlytics platform.
 */
export function getAppPlatform(appId?: string): CrashlyticsAppPlatform | undefined {
  if (!appId) {
    return undefined;
  }
  const platform = appId.split(":")[2]?.toLowerCase();
  if (platform === "android" || platform === "ios" || platform === "web") {
    return platform;
  }
  return undefined;
}

/**
 * Maps a mobile Firebase App ID to its platform-specific top devices report path.
 */
export function parsePlatform(appId: string): PLATFORM_PATH {
  const appIdParts = appId.split(":");
  if (appIdParts.length < 3) {
    throw new FirebaseError("Unable to get the platform from the AppId.");
  }

  if (appIdParts[2] === "android") {
    return PLATFORM_PATH.ANDROID;
  } else if (appIdParts[2] === "ios") {
    return PLATFORM_PATH.IOS;
  }
  throw new FirebaseError(`Only android or ios apps are supported.`);
}
