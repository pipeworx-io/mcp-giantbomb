interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
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
    description: 'Search across all resources.',
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
  { name: 'games', description: 'List/filter games.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, sort: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'character', description: 'Single character.', inputSchema: { type: 'object', properties: { guid_or_id: { type: 'string' } }, required: ['guid_or_id'] } },
  { name: 'companies', description: 'List/filter companies.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'releases', description: 'List/filter releases.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'platforms', description: 'List/filter platforms.', inputSchema: { type: 'object', properties: { filter: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Giant Bomb requires an API key. Set PLATFORM_GIANTBOMB_KEY or pass ?_apiKey=… (free at https://www.giantbomb.com/api/).');
  const p = new URLSearchParams({ api_key: apiKey, format: 'json' });
  switch (name) {
    case 'search': {
      p.set('query', reqStr(args, 'query', '"halo"'));
      if (args.resources) p.set('resources', String(args.resources));
      if (args.limit) p.set('limit', String(args.limit));
      if (args.page) p.set('page', String(args.page));
      return gbGet(`/search/?${p}`);
    }
    case 'game':
      return gbGet(`/game/${encodeURIComponent(reqStr(args, 'guid_or_id', '"3030-12345"'))}/?api_key=${apiKey}&format=json`);
    case 'games': {
      if (args.filter) p.set('filter', String(args.filter));
      if (args.sort) p.set('sort', String(args.sort));
      if (args.limit) p.set('limit', String(args.limit));
      if (args.offset) p.set('offset', String(args.offset));
      return gbGet(`/games/?${p}`);
    }
    case 'character':
      return gbGet(`/character/${encodeURIComponent(reqStr(args, 'guid_or_id', '"3005-12345"'))}/?api_key=${apiKey}&format=json`);
    case 'companies':
      if (args.filter) p.set('filter', String(args.filter));
      if (args.limit) p.set('limit', String(args.limit));
      if (args.offset) p.set('offset', String(args.offset));
      return gbGet(`/companies/?${p}`);
    case 'releases':
      if (args.filter) p.set('filter', String(args.filter));
      if (args.limit) p.set('limit', String(args.limit));
      if (args.offset) p.set('offset', String(args.offset));
      return gbGet(`/releases/?${p}`);
    case 'platforms':
      if (args.filter) p.set('filter', String(args.filter));
      if (args.limit) p.set('limit', String(args.limit));
      if (args.offset) p.set('offset', String(args.offset));
      return gbGet(`/platforms/?${p}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function gbGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 401) throw new Error('Giant Bomb: 401 — invalid API key.');
  if (!res.ok) throw new Error(`Giant Bomb: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
