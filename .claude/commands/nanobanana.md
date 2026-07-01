---
description: Generate or edit an image with the nanobanana (Gemini gemini-2.5-flash-image) MCP server
argument-hint: [image prompt]
---

Use the `nanobanana` MCP server (configured in `.mcp.json`, backed by Gemini's `gemini-2.5-flash-image` model) to generate an image for the following prompt:

$ARGUMENTS

If the `nanobanana` MCP tools aren't available, tell the user the `GEMINI_API_KEY` environment variable likely isn't set — it must be exported in the shell before Claude Code starts for this server to connect.
