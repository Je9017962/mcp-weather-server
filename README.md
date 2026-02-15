# MCP Weather Server

This project implements a simple Model Context Protocol (MCP) server that adds a custom tool to Claude Code. The server provides a `get_weather` tool that returns a 3‑day forecast (high and low temperatures) for any city using the free Open‑Meteo API. This capability is useful for experimenting with MCP, understanding tool integration, and extending Claude Code with real‑world data.

## Installation
1. Clone this repository  
2. Run `npm install`  
3. Start the server with `node index.js`  
4. Add it to Claude Code using a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "my-first-mcp": {
      "command": "node",
      "args": ["C:/Users/Jerem/mcp-weather-server/index.js"],
      "type": "stdio"
    }
  }
}
