# PROCESS.md

## 1. What I Built
I created a custom MCP server that exposes a single tool called `get_weather`. The tool accepts a city name, converts it to latitude and longitude using Open‑Meteo’s geocoding API, and then fetches a 3‑day forecast. I designed the server to be simple, readable, and aligned with the MCP architecture so I could understand how Claude Code communicates with external tools.

## 2. How Claude Code Helped
Claude Code was essential throughout development. I used prompts like “Create a simple MCP server with one tool” to generate the initial structure. When I encountered issues, I asked Claude to explain error messages and help reorganize the server startup code. Another effective prompt was “Combine this code into a working MCP server,” which helped me merge multiple snippets into a clean final version.

## 3. Debugging Journey
I encountered several issues while building the server. The biggest challenge was that Claude Code kept showing “No running MCP servers.” I eventually learned that Claude only loads `.mcp.json` from the workspace root and that the server must print output on startup. Adding a startup log and reopening VS Code from the correct folder fixed the issue. I also had to correct my Git setup and ensure the repository was properly initialized before pushing to GitHub.

## 4. How MCP Works
MCP servers communicate with Claude Code over stdin/stdout using a JSON‑RPC protocol. The server registers tools, validates input with Zod, and responds with structured content. Claude Code discovers servers through `.mcp.json` and launches them automatically.

## 5. What I’d Do Differently
Next time, I would add more tools, improve error handling, and explore resources so Claude can browse cached data instead of calling APIs directly.
