/** Agent protocol type */
export type AgentProtocol = 'rapi' | 'a2a' | 'custom';

/** Agent — consumes models, tools, and skills */
export interface Agent {
  id: string;
  name: string;
  description: string;
  protocol: AgentProtocol;
  endpoint: string;
  modelIds: string[];
  toolIds: string[];
  skillIds: string[];
  mcpServerIds: string[];
  policyIds: string[];
  failoverAgentIds: string[];
  tenantId: string;
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
