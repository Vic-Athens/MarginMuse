# MarginMuse Agent Mode

Agent mode is an optional layer over the normal chat and Skill system. It is disabled by default.

## Files

```text
.obsidian/marginmuse/
├── agents/<agent-id>/
│   ├── AGENT.md
│   ├── SOUL.md
│   └── MEMORY.md
├── users/default/PROFILE.md
└── tasks/<session-id>.md
```

- `AGENT.md` defines responsibilities, workflow, and boundaries.
- `SOUL.md` defines personality, tone, and values.
- `MEMORY.md` contains curated durable facts.
- `PROFILE.md` is a global user profile shared by all Agents.
- Task files persist goals, progress, and next steps for one session.
- Vault-root `AGENTS.md`, when present, provides workspace-level instructions.

No Agent profile is created automatically.

Each chat session stores its own `agentId`. Changing the default Agent in settings does not rewrite existing sessions. Switching Agents starts a new conversation so persona, memory, and task state do not leak between identities.

## Loading order

1. Hard security and tool permissions.
2. System runtime instructions.
3. Active Agent responsibilities.
4. Agent persona.
5. User profile.
6. Vault-level `AGENTS.md`.
7. Current task state.
8. Relevant long-term memory.
9. Active Skill.

Memory is selected by lexical relevance. The whole memory file is not injected into every request.

## Self-editing

Self-editing is disabled by default. When enabled:

- `agent_save_memory` appends a durable fact after confirmation.
- `agent_update_identity` changes `AGENT.md` or `SOUL.md` after confirmation and a content preview.
- `agent_update_profile` changes the user profile after confirmation.
- `agent_update_task` updates hidden task progress without modifying vault notes.

Self-editing must never bypass tool permissions, confirmation dialogs, or protected-path rules.
