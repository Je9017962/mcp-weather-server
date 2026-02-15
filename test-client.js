#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const client = new Client({ name: "test-client", version: "1.0.0" });

    const transport = new StdioClientTransport({
        command: "node",
        args: ["index.js"],
        cwd: process.cwd(),
        stderr: "pipe",
    });

    // Pipe server stderr to our stderr for debugging
    const stderr = transport.stderr;
    if (stderr) {
        stderr.on('data', (chunk) => {
            process.stderr.write(`[server stderr] ${chunk.toString()}`);
        });
    }

    try {
        await client.connect(transport);

        console.log('Connected to MCP server. Calling get_weather...');

        const result = await client.callTool({ name: 'get_weather', arguments: { city: 'Orlando' } });

        if (result && result.content) {
            for (const item of result.content) {
                if (item.type === 'text') {
                    console.log(item.text);
                } else {
                    console.log('Content item:', item);
                }
            }
        } else {
            console.log('No content returned:', result);
        }

        // Close transport (stops child process)
        await transport.close();
    } catch (error) {
        console.error('Error during test client run:', error);
        try { await transport.close(); } catch { }
        process.exitCode = 1;
    }
}

main();
