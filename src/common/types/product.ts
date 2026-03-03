/** Product — bundled collection of assets for agent consumption */
export interface Product {
  id: string;
  name: string;
  description: string;
  modelIds: string[];
  toolIds: string[];
  skillIds: string[];
  agentIds: string[];
  mcpServerIds: string[];
  policyIds: string[];
  visibility: 'public' | 'private' | 'team';
  ownerTeamId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
