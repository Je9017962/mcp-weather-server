# PROCESS.md

## 1. What I Built
I created a custom MCP server that exposes a single tool called `get_weather`. The tool accepts a city name, converts it to latitude and longitude using Open‑Meteo’s geocoding API, and then fetches a 3‑day forecast. I designed the server to be simple, readable, and aligned with the MCP architecture so I could understand how Claude Code communicates with external tools.

## 2. How Claude Code Helped
Claude Code was essential throughout development. I used prompts like “Create a simple MCP server with one tool” to generate the initial structure. When I encountered issues, I asked Claude to explain error messages and help reorganize the server startup code. Another effective prompt was “Combine this code into a working MCP server,” which helped me merge multiple snippets into a clean final version.

## 3. What Broke: The Error I Encountered and How I Fixed It
The biggest issue I ran into was Claude Code repeatedly showing “No running MCP servers.” At first, I assumed the problem was with my code, but the server itself was running without throwing errors. After some trial and error, I discovered two key causes:

Claude only loads .mcp.json from the workspace root.  
I had opened VS Code from a parent folder, so Claude never saw the configuration file. Reopening VS Code directly from the project folder fixed this. The server must print something on startup. Claude Code expects output on stdout to confirm the server is alive. My server was silent on launch, so Claude treated it as non‑responsive. Adding a simple startup log (e.g., console.log("MCP Weather Server running")) solved the issue. Once both problems were fixed, Claude immediately detected the server and the get_weather tool appeared in the Tools panel.

## What I Learned: How MCP Servers Actually Work
Building this server gave me a much clearer understanding of how MCP functions behind the scenes. MCP servers communicate with Claude Code using JSON‑RPC over stdin/stdout, which means the server doesn’t run as a web service—it behaves more like a local process that Claude launches and talks to directly. I also learned how important structured responses are: Claude relies on consistent JSON formats to display tool results cleanly.
