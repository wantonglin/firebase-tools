import * as chai from "chai";

import { FirebaseError } from "../error";
import { getAppPlatform, parsePlatform, parseProjectNumber, PLATFORM_PATH } from "./utils";

const expect = chai.expect;

describe("crashlytics utils", () => {
  describe("parseProjectNumber", () => {
    it("should extract the project number from a valid App ID", () => {
      expect(parseProjectNumber("1:1234567890:android:abcdef1234567890")).to.equal("1234567890");
    });

    it("should throw FirebaseError when App ID has no colon separator", () => {
      expect(() => parseProjectNumber("invalid-app-id")).to.throw(
        FirebaseError,
        "Unable to get the projectId from the AppId.",
      );
    });
  });

  describe("getAppPlatform", () => {
    it("should return 'android', 'ios', or 'web' for matching App IDs", () => {
      expect(getAppPlatform("1:1234567890:android:abcdef")).to.equal("android");
      expect(getAppPlatform("1:1234567890:ios:abcdef")).to.equal("ios");
      expect(getAppPlatform("1:1234567890:web:abcdef")).to.equal("web");
      expect(getAppPlatform("1:1234567890:WEB:abcdef")).to.equal("web");
    });

    it("should return undefined for missing or unrecognized App IDs", () => {
      expect(getAppPlatform(undefined)).to.be.undefined;
      expect(getAppPlatform("")).to.be.undefined;
      expect(getAppPlatform("invalid-app-id")).to.be.undefined;
      expect(getAppPlatform("1:1234567890:macos:abcdef")).to.be.undefined;
    });
  });

  describe("parsePlatform", () => {
    it("should map android and ios App IDs to PLATFORM_PATH", () => {
      expect(parsePlatform("1:1234567890:android:abcdef")).to.equal(PLATFORM_PATH.ANDROID);
      expect(parsePlatform("1:1234567890:ios:abcdef")).to.equal(PLATFORM_PATH.IOS);
    });

    it("should throw FirebaseError for malformed or non-mobile App IDs", () => {
      expect(() => parsePlatform("1:1234567890")).to.throw(
        FirebaseError,
        "Unable to get the platform from the AppId.",
      );
      expect(() => parsePlatform("1:1234567890:web:abcdef")).to.throw(
        FirebaseError,
        "Only android or ios apps are supported.",
      );
    });
  });
});
