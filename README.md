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
- User-authored Skills in standard `SKILL.md` format, with automatic task matching, explicit `/skill` invocation, and no bundled defaults.
- MCP support over local `stdio` or streamable HTTP.
- An optional local Agent MCP connection with long-running task timeouts and call confirmation.
- MCP progress updates, cancellation, recent task IDs, and continuation context.
- Optional local MCP Bridge so a trusted Agent can request MarginMuse context and approved note writes.
- Built-in tools for models that support tool calling, with independent web and MCP toggles and per-session context tracking.

## Requirements

- Obsidian desktop `1.4.0` or newer.
- An OpenAI-compatible model provider and API key, or a local OpenAI-compatible endpoint.
- Optional: Node.js for `stdio` MCP servers.

MarginMuse is desktop-only because it uses Node.js APIs for streaming requests and MCP processes.

New installations start with both MCP tools and web access disabled. Core vault and Canvas tools remain available independently.

MarginMuse does not preconfigure providers or models. Add an OpenAI-compatible provider first, then add or pull models that you actually intend to use.

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
2. Add an OpenAI-compatible provider and API key, or configure a local endpoint. No default provider is created.
3. Add or enable a model. No default model is created.
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
- The optional MarginMuse Bridge listens only on `127.0.0.1`, requires a Bearer Token, and can request approved note writes.
- A Skill directory can point to a vault folder or an absolute local path chosen by the user.
- Copying an assistant reply writes its text to the system clipboard.
- API keys and settings are stored locally in the plugin's `data.json`.

Review the privacy policies of the AI, search, and MCP services you choose to use.

## File access and tool safety

When a tool-capable model is selected, the plugin can read and modify files in the active vault. Deletions and overwrites require confirmation and use the Obsidian trash when possible. Hidden paths such as `.obsidian` and parent-directory traversal are blocked for built-in file tools.

Model output can still be incorrect. Review generated edits, Canvas changes, and shell-related MCP operations before relying on them.

## MCP

MarginMuse supports MCP servers over `stdio` and streamable HTTP. Only connect MCP servers you trust. A local MCP command runs with the permissions of the Obsidian process.

The chat toolbar's **Tools** button controls MCP only. Built-in vault and Canvas tools remain available independently, and web access has its own toggle.

Local Agent presets are disabled by default. When a server is marked as a complex-task Agent, MarginMuse asks for confirmation before each call. Configure the server timeout according to the expected task duration.

Agent cards display MCP progress notifications when the server provides them. Stopping a response also cancels active MCP requests. Returned `threadId` and `taskId` values are retained in the session so the main model can continue an Agent task later.

See [Local Agent MCP contract](docs/agent-mcp.md) for the recommended adapter tools and response fields.

## MCP Bridge

The third-stage **Bridge** is a reverse MCP server hosted by MarginMuse. It is disabled by default, binds only to `127.0.0.1`, and requires the generated Bearer Token.

Trusted local Agents can call:

- `bridge_session_context`: recent messages in the active MarginMuse session.
- `bridge_active_note`: active note metadata and optional text.
- `bridge_search_vault`: search Markdown notes.
- `bridge_read_note`: read a permitted vault note.
- `bridge_write_result`: request an append or write inside the configured Agent output folder, with a content preview and hash in the confirmation dialog.

The Bridge does not expose API keys, `data.json`, plugin configuration, or hidden-directory traversal. Writes are confined to **Settings → MarginMuse → Bridge → Agent output folder**, defaulting to `MarginMuse Agent Output`.

## Skills

MarginMuse loads user-authored Skills from the configured Skill root. The default root is `.obsidian/marginmuse/skills`, so Skill files stay out of the normal vault file list. It does not bundle default Skills and does not execute scripts found inside a Skill.

MarginMuse scans only the configured Skill root. New Skills created by AI are written through the restricted `write_skill` tool; normal Vault-writing tools are unavailable during Skill Builder sessions.

```text
.obsidian/marginmuse/skills/
└── example-skill/
    └── SKILL.md
```

`SKILL.md` uses frontmatter with at least `name` and `description`. Activate a Skill from the chat header. It applies only to the current chat session.

For an active Skill, AI tools can list and read only files inside that Skill directory through the restricted `list_skill_files` and `read_skill_file` tools.

By default, MarginMuse gives the model a lightweight Skill catalog and lets it call `activate_skill` when the task matches. To choose a Skill explicitly, type `/skill` in the composer, select a Skill, and continue with the task. Explicit selection applies only to that turn; there is no permanent pin mode.

To create a Skill, open **Settings → MarginMuse → Skills** and select **Let AI create a Skill**. MarginMuse starts a dedicated Skill Builder conversation with a prefilled request. Describe the desired workflow and the AI saves a complete `SKILL.md` through the restricted `write_skill` tool. The AI may ask follow-up questions before writing.

The `write_skill` tool is available only during Skill Builder conversations, never in ordinary chat sessions.

Skill settings also provide a **Delete Skill** action. It asks for confirmation and sends the entire Skill folder to Obsidian's local trash or the operating-system trash; if neither is available, the plugin cancels the deletion instead of permanently removing files.

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
- 默认会根据 Skill 名称和描述自动匹配任务；在输入框键入 `/skill` 可以临时指定一个 Skill，只对当前这一轮生效。
- Bridge 默认关闭，只监听本机 `127.0.0.1` 并要求 Token；本地 Agent 写回笔记前必须由用户在 MarginMuse 中确认。
- 在 Skills 设置里点击「让 AI 创建 Skill」，填写需求后由 AI 生成并保存 SKILL.md，不需要手动创建文件。
- API Key 保存在本地插件目录的 `data.json` 中。

## Development

This repository ships the readable bundled plugin as `main.js`, so no build step is required to install or run it. `mcp-sample-server.cjs` is a zero-dependency sample MCP server used to verify the transport.

Do not commit `data.json` or `index-cache.json`; both may contain private user data.

## License

MIT. See [LICENSE](LICENSE).
