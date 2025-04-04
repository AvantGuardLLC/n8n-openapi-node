import { DefaultOperationParser } from "./OperationParser";
import { OpenAPIV3 } from "openapi-types";
import { OperationContext } from "./openapi/OpenAPIVisitor";

describe("DefaultOperationParser", () => {
  const parser = new DefaultOperationParser();

  describe("operation identification", () => {
    it("should use operationId (startCase) when available", () => {
      const operation: OpenAPIV3.OperationObject = {
        operationId: "getUserProfile",
        summary: "Get User Profile Summary",
        responses: {},
      };
      const context: OperationContext = {
        method: OpenAPIV3.HttpMethods.GET,
        pattern: "/users/{id}/profile",
        path: {
          summary: "Get User Profile by ID",
        },
      };

      expect(parser.name(operation, context)).toBe("Get User Profile");
    });

    it("should use summary (startCase) when operationId is missing", () => {
      const operation: OpenAPIV3.OperationObject = {
        summary: "Get User Profile",
        responses: {},
      };
      const context: OperationContext = {
        method: OpenAPIV3.HttpMethods.GET,
        pattern: "/users/{id}/profile",
        path: {
          summary: "Get User Profile by ID",
        },
      };

      expect(parser.name(operation, context)).toBe("Get User Profile");
    });

    it("should use method and path when both operationId and summary are missing", () => {
      const operation: OpenAPIV3.OperationObject = {
        responses: {},
      };
      const context: OperationContext = {
        method: OpenAPIV3.HttpMethods.GET,
        pattern: "/users/profile",
        path: {},
      };

      expect(parser.name(operation, context)).toBe(
        `${OpenAPIV3.HttpMethods.GET.toUpperCase()} /users/profile`
      );
    });
  });
});
