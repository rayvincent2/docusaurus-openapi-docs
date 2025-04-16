/* ============================================================================
 * Copyright (c) Palo Alto Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { AsyncAPIDocumentInterface } from "@asyncapi/parser";

export function createAsyncAPIChannel(
  channelName: string,
  channel: any,
  document: AsyncAPIDocumentInterface
) {
  const description = channel.description() || "No description provided.";
  let operations = "";

  const publish = channel.publish();
  if (publish) {
    operations += `### Publish\n\n`;
    const messages = publish.messages();
    if (messages.length > 0) {
      operations += `**Messages:**\n`;
      messages.forEach((msg: any, index: number) => {
        operations += `- Message ${index + 1}: ${msg.id() || "N/A"}\n`;
        const payload = msg.payload();
        if (payload) {
          operations += `  **Payload Schema**:\n  \`\`\`yaml\n  ${JSON.stringify(payload.json(), null, 2)}\n  \`\`\`\n`;
        }
      });
    } else {
      operations += "No messages defined.\n";
    }
  }

  const subscribe = channel.subscribe();
  if (subscribe) {
    operations += `### Subscribe\n\n`;
    const messages = subscribe.messages();
    if (messages.length > 0) {
      operations += `**Messages:**\n`;
      messages.forEach((msg: any, index: number) => {
        operations += `- Message ${index + 1}: ${msg.id() || "N/A"}\n`;
        const payload = msg.payload();
        if (payload) {
          operations += `  **Payload Schema**:\n  \`\`\`yaml\n  ${JSON.stringify(payload.json(), null, 2)}\n  \`\`\`\n`;
        }
      });
    } else {
      operations += "No messages defined.\n";
    }
  }

  const bindings = channel.bindings();
  let bindingsSection = "";
  if (bindings && Object.keys(bindings.json()).length > 0) {
    bindingsSection = `## Bindings\n\n\`\`\`yaml\n${JSON.stringify(bindings.json(), null, 2)}\n\`\`\`\n`;
  }

  return `
# ${channelName}

${description}

## Operations

${operations}

${bindingsSection}

## Channel Schema

\`\`\`yaml
${JSON.stringify(channel.json(), null, 2)}
\`\`\`
  `;
}
