/** Tool transport types */
export type ToolTransport = 'rest' | 'graphql' | 'grpc' | 'mcp' | 'custom';

/** Authentication method for tool backends */
export type ToolAuthMethod = 'none' | 'api-key' | 'oauth2' | 'entra-id' | 'custom';

/** Tool authentication configuration */
export interface ToolAuthConfig {
  method: ToolAuthMethod;
  credentialRef?: string; // reference to secret store
  scopes?: string[];
  oboEnabled?: boolean; // On-Behalf-Of delegation
}

/** Tool schema definition */
export interface ToolSchema {
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  openApiSpecUrl?: string;
}

/** Registered tool */
export interface Tool {
  id: string;
  name: string;
  description: string;
  transport: ToolTransport;
  endpoint: string;
  schema?: ToolSchema;
  auth: ToolAuthConfig;
  ownerTeamId: string;
  tags: string[];
  visibility: 'public' | 'private' | 'team';
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
