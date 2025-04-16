/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { Parser } from "@asyncapi/parser";
import { MaybeAsyncAPI } from "@asyncapi/parser/esm/types";

import { TagGroupObject, TagObject } from "../openapi/types";
import { ApiMetadata, APIOptions, SidebarOptions } from "../types";

export async function processAsyncApiFile(
  asyncAPI: MaybeAsyncAPI,
  options: APIOptions,
  sidebarOptions: SidebarOptions
): Promise<[ApiMetadata[], TagObject[], TagGroupObject[]]> {
  const parser = new Parser();
  const { document, diagnostics } = await parser.parse(asyncAPI);
  if (!document) {
    throw new Error(
      `Failed to parse AsyncAPI spec: ${diagnostics.map((d) => d.message).join(", ")}`
    );
  }
  const items: ApiMetadata[] = [];
  // const items = createItems(document, options, sidebarOptions);

  let tags: TagObject[] = [];
  if (document.info().tags().length > 0) {
    tags = document
      .info()
      .tags()
      .map((tag) => ({
        name: tag.name(),
        description: tag.description(),
        externalDocs: tag.externalDocs()?.json(),
        "x-displayName": tag.extensions().get("x-displayName")?.value(),
      }));
  }

  let tagGroups: TagGroupObject[] = [];
  if (document.extensions().has("x-tagGroups") !== undefined) {
    tagGroups = document
      .extensions()
      .get("x-tagGroups")
      ?.value<TagGroupObject[]>() as TagGroupObject[];
  }

  return [items, tags, tagGroups];
}
