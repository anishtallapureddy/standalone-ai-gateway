import { ToolAuthConfig } from './tool.js';

/** MCP server hosting type */
export type MCPHostingType = 'managed' | 'external';

/** MCP server transport protocol */
export type MCPTransport = 'stdio' | 'sse' | 'streamable-http';

/** Tool exposed by an MCP server */
export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/** Registered MCP server */
export interface MCPServer {
  id: string;
  name: string;
  description: string;
  hostingType: MCPHostingType;
  transport: MCPTransport;
  endpoint: string;
  tools: MCPToolDefinition[];
  auth: ToolAuthConfig;
  sourceApiId?: string; // if converted from an OpenAPI spec
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
