/** Policy target — what asset type this policy applies to */
export type PolicyTarget = 'model' | 'tool' | 'mcp-server' | 'agent' | 'skill' | 'global';

/** Policy phase — when the policy is evaluated */
export type PolicyPhase = 'design-time' | 'runtime';

/** Rate limit rule */
export interface RateLimitRule {
  type: 'rate-limit';
  requestsPerSecond: number;
  burstSize?: number;
  keyDimension: 'user' | 'api-key' | 'ip' | 'tenant';
}

/** Token quota rule */
export interface TokenQuotaRule {
  type: 'token-quota';
  maxTokensPerMinute: number;
  maxTokensPerDay?: number;
  keyDimension: 'user' | 'api-key' | 'ip' | 'tenant';
}

/** Content safety rule */
export interface ContentSafetyRule {
  type: 'content-safety';
  provider: 'azure-content-safety' | 'custom';
  categories: string[];
  severityThreshold: number;
}

/** Access control rule */
export interface AccessControlRule {
  type: 'access-control';
  allowedTeams: string[];
  allowedRoles: string[];
  requireApproval: boolean;
}

/** IP filter rule */
export interface IPFilterRule {
  type: 'ip-filter';
  allowList?: string[];
  denyList?: string[];
}

export type PolicyRule =
  | RateLimitRule
  | TokenQuotaRule
  | ContentSafetyRule
  | AccessControlRule
  | IPFilterRule;

/** Governance policy */
export interface Policy {
  id: string;
  name: string;
  description: string;
  target: PolicyTarget;
  targetIds?: string[]; // specific asset IDs, or empty for all
  phase: PolicyPhase;
  rules: PolicyRule[];
  enabled: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
