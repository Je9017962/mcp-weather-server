#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const client = new Client({ name: "mcp-list-client", version: "1.0.0" });

    const transport = new StdioClientTransport({
        command: "node",
        args: ["index.js"],
        cwd: process.cwd(),
        stderr: "pipe",
    });

    // Forward server stderr for debugging
    const stderr = transport.stderr;
    if (stderr) stderr.on('data', (c) => process.stderr.write(`[server stderr] ${c.toString()}`));

    try {
        await client.connect(transport);

        const toolsResult = await client.listTools({});

        if (!toolsResult || !toolsResult.tools) {
            console.log('No tools returned by server.');
        } else if (toolsResult.tools.length === 0) {
            console.log('No tools available.');
        } else {
            console.log('Available tools:');
            for (const t of toolsResult.tools) {
                console.log(`- ${t.name}: ${(t.displayName || t.name)}${t.description ? ' — ' + t.description : ''}`);
            }
        }

        await transport.close();
    } catch (err) {
        console.error('Error listing tools:', err);
        try { await transport.close(); } catch { }
        process.exitCode = 1;
    }
}

main();
