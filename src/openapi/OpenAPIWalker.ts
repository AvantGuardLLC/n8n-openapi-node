import { OpenAPIV3 } from "openapi-types";
import type { OpenAPIVisitor } from "./OpenAPIVisitor";
import * as lodash from "lodash";

const HttpMethods: string[] = Object.values(OpenAPIV3.HttpMethods);

function toPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseApiEndpoint(input: string) {
  const [method, path] = input.split(" ");

  const pathSegments = path.slice(1).split("/");

  let result = method.toLowerCase();

  const segments = [];
  const parameters = [];

  for (const segment of pathSegments) {
    if (segment.startsWith("{") && segment.endsWith("}")) {
      const paramName = segment.slice(1, -1); // Remove braces
      parameters.push(paramName);
    } else {
      segments.push(segment);
    }
  }

  for (const segment of segments) {
    result += toPascalCase(segment);
  }

  if (parameters.length > 1) {
    const lastParam = parameters[parameters.length - 1];
    result += toPascalCase(lastParam);

    result += "By";
    const firstParam = parameters[0];
    result += toPascalCase(firstParam);
  } else if (parameters.length === 1) {
    result += "By";
    const param = parameters[0];
    result += toPascalCase(param);
  }

  return result;
}

export class OpenAPIWalker {
  private readonly doc: OpenAPIV3.Document;

  constructor(doc: any) {
    this.doc = doc;
  }

  walk(visitor: OpenAPIVisitor) {
    this.walkDocument(visitor);
    this.walkPaths(visitor);
    this.walkTags(visitor);
    if (visitor.finish) {
      visitor.finish();
    }
  }

  private walkDocument(visitor: OpenAPIVisitor, doc?: OpenAPIV3.Document) {
    if (!doc) {
      doc = this.doc;
    }
    if (visitor.visitDocument) {
      visitor.visitDocument(doc);
    }
  }

  private walkPaths(visitor: OpenAPIVisitor, paths?: OpenAPIV3.PathsObject) {
    if (!paths) {
      paths = this.doc.paths;
    }
    if (!paths) {
      return;
    }
    for (const path in paths) {
      const pathItem: OpenAPIV3.PathItemObject = paths[
        path
      ] as OpenAPIV3.PathItemObject;
      let method: string;
      let operation: any;
      for ([method, operation] of Object.entries(pathItem)) {
        if (!HttpMethods.includes(method)) {
          continue;
        }
        if (!operation.tags || operation.tags.length === 0) {
          operation.tags = ["default"];
        }

        if (!operation.operationId) {
          if (operation.summary) {
            operation.operationId = `${method} ${lodash.camelCase(
              operation.summary ?? pathItem.summary
            )}`;
          } else {
            operation.operationId = `${method} ${path}`;
          }
        }

        if (operation && visitor.visitOperation) {
          const context = {
            pattern: path,
            path: pathItem,
            method: method as OpenAPIV3.HttpMethods,
          };
          visitor.visitOperation(operation, context);
        }
      }
    }
  }

  private walkTags(visitor: OpenAPIVisitor, tags?: OpenAPIV3.TagObject[]) {
    if (!tags) {
      tags = this.doc.tags;
    }
    if (!tags) {
      return;
    }
    if (!visitor.visitTag) {
      return;
    }
    for (const tag of tags) {
      visitor.visitTag(tag);
    }
  }
}
