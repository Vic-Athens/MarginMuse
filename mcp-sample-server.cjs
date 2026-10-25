#!/usr/bin/env node
/* 插件自带的示例 MCP 服务器：stdio + JSON-RPC 2.0，零依赖，仅用于验证通路 */
'use strict';
const readline = require('readline');

const TOOLS = [
  {
    name: 'echo',
    description: '把输入原样返回，用来验证工具调用链路是否通',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: '要回显的文字' } },
      required: ['text'],
    },
  },
  {
    name: 'now',
    description: '返回本机当前时间（ISO 格式）',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'vault_dir_hint',
    description: '返回示例提示，说明这个服务器是插件自带的测试桩',
    inputSchema: { type: 'object', properties: {} },
  },
];

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const raw = line.trim();
  if (!raw) return;
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch (e) {
    return;
  }
  const id = msg.id;
  const method = msg.method;
  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: (msg.params && msg.params.protocolVersion) || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'marginmuse-sample', version: '1.0.0' },
      },
    });
    return;
  }
  if (method === 'notifications/initialized' || method === 'initialized') return;
  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    return;
  }
  if (method === 'tools/call') {
    const name = msg.params && msg.params.name;
    const args = (msg.params && msg.params.arguments) || {};
    let text = '';
    if (name === 'echo') text = 'ECHO: ' + (args.text == null ? '' : args.text);
    else if (name === 'now') text = new Date().toISOString();
    else if (name === 'vault_dir_hint') text = '这是插件自带的示例 MCP 服务器，返回正常说明 MCP 通路可用。';
    else {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'unknown tool: ' + name } });
      return;
    }
    send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }] } });
    return;
  }
  if (id !== undefined && id !== null) {
    send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found: ' + method } });
  }
});
