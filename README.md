# @pipeworx/giantbomb

[Giant Bomb](https://www.giantbomb.com/api/) MCP — extensive video-game catalog (games, characters, companies, platforms, releases, reviews). Free API key required.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_GIANTBOMB_KEY`. BYO: `?_apiKey=…`.

## Tools

- `search(query, resources?, limit?, page?)` — search across all resources
- `game(guid_or_id)` — single game record
- `games(filter?, sort?, limit?, offset?)` — list/filter games
- `character(guid_or_id)` — single character
- `companies(filter?, limit?, offset?)` — companies
- `releases(filter?, limit?, offset?)` — releases
- `platforms(filter?, limit?, offset?)` — platforms

## Data source

`https://www.giantbomb.com/api/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "giantbomb": {
      "url": "https://gateway.pipeworx.io/giantbomb/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Giantbomb data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
