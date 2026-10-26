# Local Agent MCP Contract

MarginMuse is an MCP client. A local Agent can be connected by implementing an MCP server and configuring its `stdio` command or streamable HTTP URL in MarginMuse.

The current implementation supports delegation from MarginMuse to the Agent, progress notifications, cancellation, and recent task/thread recovery. A reverse MarginMuse MCP bridge is not enabled automatically.

Skills use a separate local directory and do not require MCP. The default Skill root is `.obsidian/marginmuse/skills`; an active Skill can access only its own directory through the restricted Skill file tools.

## Configuration

For `stdio`, provide:

```text
command:   the Agent MCP executable
arguments: arguments that start the MCP server
timeout:   seconds allowed for a task
Agent:     enable the confirmation prompt before each call
```

For streamable HTTP, provide the MCP endpoint and optional headers. Use HTTPS for non-local endpoints and avoid placing credentials in a URL.

## Recommended tools

An Agent adapter should expose tools equivalent to:

```text
agent_run
  prompt: string
  taskId?: string
  sessionId?: string
  cwd?: string
  permissionMode?: string
  context?: string

agent_reply
  taskId?: string
  threadId?: string
  prompt: string

agent_cancel
  taskId: string

agent_status
  taskId: string
```

A useful result shape is:

```json
{
  "status": "queued | running | completed | failed | cancelled",
  "taskId": "task-id",
  "threadId": "agent-thread-id",
  "summary": "concise result for the main model",
  "artifacts": [],
  "progress": "optional progress text"
}
```

The adapter may expose different tool names. MarginMuse discovers MCP tool schemas dynamically.

For long-running tools, send MCP `notifications/progress` with the `progressToken` supplied by MarginMuse. Progress is displayed in the tool card for both `stdio` and streamable HTTP transports.

When a result includes `threadId` or `taskId`, MarginMuse retains recent IDs in the chat session and adds them to later model context so a compatible reply/continue tool can resume the task. Stopping generation cancels active MCP requests.

## Codex compatibility preset

The optional Codex preset uses:

```text
codex mcp-server
```

Codex currently exposes `codex` and `codex-reply` tools through this mode. The command is marked as deprecated by the Codex CLI and may be removed. Keep the preset disabled unless needed, and make the launch command configurable.

## Permissions and safety

- Prefer `read-only` or a restricted working directory for delegated tasks.
- Do not default to unrestricted filesystem or shell access.
- Ask the user before sending vault context to an Agent.
- Treat Agent output as untrusted until reviewed.
- Use long timeouts only for Agent servers that the user explicitly trusts.
- Do not expose a bridge server on a public interface without authentication and TLS.

## Future reverse bridge

A bidirectional setup should use two MCP roles rather than assuming every MCP connection is symmetric:

1. MarginMuse as MCP client to the Agent's task server.
2. MarginMuse Bridge as MCP server for contextual read and approved write-back tools.

The reverse bridge is a future opt-in extension and is not part of the current Skill implementation.
