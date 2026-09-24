interface McpToolDefinition {
  name: string;
  description: string;
  /** Human-facing one-liner (fleet #1967). Optional; consumers fall back to
   *  description. Kept in step with shared/src/types.ts — scripts/lib/
   *  check-inlined-types.mjs reports drift at publish time. */
  summary?: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
    anyOf?: Array<{ required: string[] }>;
    oneOf?: Array<{ required: string[] }>;
    allOf?: Array<{ required: string[] }>;
  };
  outputSchema?: Record<string, unknown>;
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Giant Bomb MCP.
 */


const BASE = 'https://www.giantbomb.com/api';
const UA = 'pipeworx-mcp-giantbomb/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Search Giant Bomb by keyword across resource types (game, franchise, character, concept, object, location, person, company, video); returns name, resource_type, and deck for each match. NOTE: API offline as of 2026-05.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        resources: { type: 'string', description: 'Comma-sep: game,franchise,character,concept,object,location,person,company,video' },
        limit: { type: 'number' },
        page: { type: 'number' },
      },
      required: ['query'],
    },
  },
  { name: 'game', description: 'Single game by guid or id.', inputSchema: { type: 'object', properties: { guid_or_id: { type: 'string' } }, required: ['guid_or_id'] } },
  { name: 'games', description: 'List or filter Giant Bomb games with an optional API filter expression and sort field; returns game name, deck, release date, and platform list. NOTE: API offline as of 2026-05.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, sort: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'character', description: 'Single character.', inputSchema: { type: 'object', properties: { guid_or_id: { type: 'string' } }, required: ['guid_or_id'] } },
  { name: 'companies', description: 'List or filter video game companies in Giant Bomb by API filter expression; returns company name, deck, founding date, and location. NOTE: API offline as of 2026-05.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'releases', description: 'List/filter releases.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'platforms', description: 'List/filter platforms.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
];

// As of 2026-05, Giant Bomb's API is offline. They split from Fandom and
// are rebuilding on a fresh stack (MediaWiki port; see
// https://www.giantbomb.com/api/). The wiki has been preserved but no API
// access exists for games / characters / companies / concepts / locations /
// objects / releases / people / etc. — every endpoint we used returns errors.
//
// Tools stay enumerated so the catalog, /uptime, and any pre-baked LLM
// references don't churn while we wait. Calls return a clear shutdown
// message instead of an opaque upstream error. Revert this file when
// Giant Bomb publishes the new API surface.
async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  throw new Error(
    `upstream_down: Giant Bomb API is offline as of 2026-05 — they're rebuilding after splitting from Fandom. ` +
    `All endpoints (games, characters, companies, concepts, locations, objects, releases, people) ` +
    `are unavailable. See https://www.giantbomb.com/api/ for status. Tool: ${name}.`,
  );
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
