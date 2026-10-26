# MarginMuse

**MarginMuse（页语）** is a bilingual AI writing, research, and vault assistant for Obsidian. It brings model conversations, note context, file tools, Canvas editing, web research, and MCP tools into one desktop panel.

> MarginMuse is a third-party plugin and is not affiliated with Obsidian.

## Features

- Multiple chat sessions with per-session context usage.
- OpenAI-compatible chat providers, including local Ollama and LM Studio endpoints.
- Image input and direct image pasting for vision-capable models.
- Vault search, note selection, folder context, and imported web pages.
- Built-in tools for reading, creating, editing, appending, renaming, and deleting notes.
- File and folder deletion through the Obsidian trash.
- Canvas creation and editing.
- Web search with automatic source fallback and official Obsidian changelog support.
- User-authored Skills in standard `SKILL.md` format, with no bundled defaults.
- MCP support over local `stdio` or streamable HTTP.
- An optional local Agent MCP connection with long-running task timeouts and call confirmation.
- Built-in tools for models that support tool calling, with independent web and MCP toggles and per-session context tracking.

## Requirements

- Obsidian desktop `1.4.0` or newer.
- An OpenAI-compatible model provider and API key, or a local OpenAI-compatible endpoint.
- Optional: Node.js for `stdio` MCP servers.

MarginMuse is desktop-only because it uses Node.js APIs for streaming requests and MCP processes.

New installations start with both MCP tools and web access disabled. Core vault and Canvas tools remain available independently.

## Installation

Once accepted into the Obsidian Community directory, search for **MarginMuse** in:

**Settings → Community plugins → Browse**.

For manual installation:

1. Download the latest GitHub release.
2. Put `main.js`, `manifest.json`, and `styles.css` in `.obsidian/plugins/marginmuse/`.
3. Restart or reload Obsidian.
4. Enable **MarginMuse** under Community plugins.

## Setup

1. Open **Settings → MarginMuse → Providers**.
2. Add an OpenAI-compatible provider and API key, or configure a local endpoint.
3. Add or enable a model.
4. Open MarginMuse from the ribbon and start a conversation.
5. Optionally create a Skill under **Settings → MarginMuse → Skills**, then activate it from the chat header.

For use with restricted or untrusted notes, choose a model with tool calling disabled or review every requested file operation.

## Network and privacy

MarginMuse has no telemetry and does not include ads.

- Chat messages and selected context are sent to the AI provider configured by the user.
- Current note inclusion is enabled by default and can be disabled in settings.
- Web search queries are sent to Bing and, when a reliable fallback is needed, Baidu, Sogou, or 360.
- `web_fetch` requests the URL supplied by the user or requested through the model.
- Optional MCP servers may start local processes and may access resources according to their own configuration.
- A local Agent MCP server may receive the task text and selected context needed to complete a delegated task.
- A Skill directory can point to a vault folder or an absolute local path chosen by the user.
- Copying an assistant reply writes its text to the system clipboard.
- API keys and settings are stored locally in the plugin's `data.json`.

Review the privacy policies of the AI, search, and MCP services you choose to use.

## File access and tool safety

When AI tools are enabled, the plugin can read and modify files in the active vault. Deletions and overwrites require confirmation and use the Obsidian trash when possible. Hidden paths such as `.obsidian` and parent-directory traversal are blocked for built-in file tools.

Model output can still be incorrect. Review generated edits, Canvas changes, and shell-related MCP operations before relying on them.

## MCP

MarginMuse supports MCP servers over `stdio` and streamable HTTP. Only connect MCP servers you trust. A local MCP command runs with the permissions of the Obsidian process.

The chat toolbar's **Tools** button controls MCP only. Built-in vault and Canvas tools remain available independently, and web access has its own toggle.

Local Agent presets are disabled by default. When a server is marked as a complex-task Agent, MarginMuse asks for confirmation before each call. Configure the server timeout according to the expected task duration.

See [Local Agent MCP contract](docs/agent-mcp.md) for the recommended adapter tools and response fields.

## Skills

MarginMuse loads user-authored Skills from the configured Skill root. The default root is `.obsidian/marginmuse/skills`, so Skill files stay out of the normal vault file list. It does not bundle default Skills and does not execute scripts found inside a Skill.

```text
.obsidian/marginmuse/skills/
└── example-skill/
    └── SKILL.md
```

`SKILL.md` uses frontmatter with at least `name` and `description`. Activate a Skill from the chat header. It applies only to the current chat session.

For an active Skill, AI tools can list and read only files inside that Skill directory through the restricted `list_skill_files` and `read_skill_file` tools.

To create a Skill, open **Settings → MarginMuse → Skills** and select **Let AI create a Skill**. MarginMuse starts a dedicated Skill Builder conversation with a prefilled request. Describe the desired workflow and the AI saves a complete `SKILL.md` through the restricted `write_skill` tool. The AI may ask follow-up questions before writing.

The `write_skill` tool is available only during Skill Builder conversations, never in ordinary chat sessions.

## 中文说明

MarginMuse（页语）是一款面向 Obsidian 的双语 AI 写作与笔记助手，支持多会话、笔记上下文、文件工具、Canvas 白板、联网搜索和 MCP。

使用前请注意：

- 对话内容和引用的笔记会发送给你配置的 AI 服务商。
- 联网搜索会访问 Bing，必要时会后备到百度、搜狗或 360。
- 使用支持工具调用的模型时，可以读取和修改当前库中的文件。
- 本地 MCP 服务会以 Obsidian 进程的权限运行，请只连接可信服务。
- 对话底部的「工具」按钮只控制 MCP；内置笔记工具始终可用，联网使用独立开关。
- 本地复杂任务 Agent 默认停用，每次调用前会要求确认。
- Skill 可以由用户自行创建，插件不内置默认 Skill，也不会自动执行 Skill scripts。
- 在 Skills 设置里点击「让 AI 创建 Skill」，填写需求后由 AI 生成并保存 SKILL.md，不需要手动创建文件。
- API Key 保存在本地插件目录的 `data.json` 中。

## Development

This repository ships the readable bundled plugin as `main.js`, so no build step is required to install or run it. `mcp-sample-server.cjs` is a zero-dependency sample MCP server used to verify the transport.

Do not commit `data.json` or `index-cache.json`; both may contain private user data.

## License

MIT. See [LICENSE](LICENSE).
