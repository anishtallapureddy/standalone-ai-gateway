/** Team within a tenant organization */
export interface Team {
  id: string;
  name: string;
  members: string[];
}

/** Quota configuration for a tenant */
export interface TenantQuota {
  maxTokensPerMinute: number;
  maxRequestsPerMinute: number;
  maxModels: number;
  maxTools: number;
  maxAgents: number;
}

/** Tenant — organization or project boundary */
export interface Tenant {
  id: string;
  name: string;
  displayName: string;
  teams: Team[];
  quota: TenantQuota;
  tier: 'serverless' | 'dedicated';
  config: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
