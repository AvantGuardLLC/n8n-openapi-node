import { OpenAPIV3 } from "openapi-types";
import * as lodash from "lodash";
import { OperationContext } from "./openapi/OpenAPIVisitor";

/**
 * Extract information for n8n node from OpenAPI operation
 */
export interface IOperationParser {
  /**
   * Name of the operation (e.g. "Create User")
   */
  name(operation: OpenAPIV3.OperationObject, context: OperationContext): string;

  /**
   * Value of the operation (e.g. "create-user")
   */
  value(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string;

  /**
   * Action of the operation (e.g. "Create User") - will be visible in list of actions
   */
  action(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string;

  /**
   * Description of the operation
   */
  description(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string;

  /**
   * Should skip this operation or not
   */
  shouldSkip(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): boolean;
}

/**
 * Default behaviour for OpenAPI to n8n operation parser
 * It will use operationId as name, value and action and summary as description
 * Skip deprecated operations
 */
export class DefaultOperationParser implements IOperationParser {
  shouldSkip(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): boolean {
    return !!operation.deprecated;
  }

  name(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string {
    if (operation.operationId) {
      return lodash.startCase(operation.operationId);
    }

    const summary = operation.summary || context.path.summary;

    if (summary) {
      return lodash.startCase(summary);
    }

    return `${context.method.toUpperCase()} ${context.pattern}`;
  }

  value(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string {
    const name = this.name(operation, context);
    return name.replace(/[^a-zA-Z0-9 ]/g, "-");
  }

  action(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string {
    return (
      operation.summary || context.path.summary || this.name(operation, context)
    );
  }

  description(
    operation: OpenAPIV3.OperationObject,
    context: OperationContext
  ): string {
    return (
      operation.description || operation.summary || context.path.summary || ""
    );
  }
}
