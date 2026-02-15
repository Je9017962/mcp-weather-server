// =============================================================
// MCP Weather Server - A simple Model Context Protocol server
// =============================================================
// This server exposes one tool called "get_weather" that fetches
// a 3-day forecast (high & low temps) for any city.
//
// It uses the free Open-Meteo API — no API key required.
//   1. Geocoding API  → converts a city name to lat/lon
//   2. Forecast API   → returns daily high & low temperatures
//
// MCP servers communicate with Claude Code over stdin/stdout.
// The SDK handles the protocol — we just define our tools.
// =============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------- Helper: fetch JSON from a URL ----------
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ---------- Helper: look up coordinates for a city ----------
async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const data = await fetchJSON(url);

  if (!data.results || data.results.length === 0) {
    throw new Error(`Could not find a location named "${city}"`);
  }

  const result = data.results[0];
  return {
    name: result.name,
    region: result.admin1 || "",
    country: result.country || "",
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

// ---------- Helper: fetch the 3-day forecast ----------
async function fetchForecast(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&temperature_unit=fahrenheit` +
    `&forecast_days=3` +
    `&timezone=auto`;

  const data = await fetchJSON(url);
  return data.daily;
}

// ---------- Helper: format the forecast ----------
function formatForecast(location, daily) {
  const lines = [`3-Day Forecast for ${location.name}, ${location.region}, ${location.country}\n`];

  for (let i = 0; i < daily.time.length; i++) {
    const date = daily.time[i];
    const high = daily.temperature_2m_max[i];
    const low = daily.temperature_2m_min[i];
    lines.push(`  ${date}  —  High: ${high}°F  |  Low: ${low}°F`);
  }

  return lines.join("\n");
}

// ---------- Create the MCP server ----------
const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

// ---------- Define the "get_weather" tool ----------
server.tool(
  "get_weather",
  "Get the 3-day weather forecast (high & low temperatures) for a city",
  {
    city: z.string().describe("City name to get the forecast for (e.g. 'Orlando' or 'New York')"),
  },
  async ({ city }) => {
    try {
      const location = await geocodeCity(city);
      const daily = await fetchForecast(location.latitude, location.longitude);
      const text = formatForecast(location, daily);

      return {
        content: [{ type: "text", text }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${error.message}` }],
      };
    }
  }
);

// ---------- Start the server ----------
async function main() {
  console.log("Starting MCP weather server on stdio...");

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log("Weather MCP server is now running.");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
