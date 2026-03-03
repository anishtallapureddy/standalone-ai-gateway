/** Supported AI model providers */
export type ModelProvider =
  | 'azure-openai'
  | 'openai'
  | 'anthropic'
  | 'google-vertex'
  | 'aws-bedrock'
  | 'custom';

/** Model capability types */
export type ModelCapability = 'chat' | 'completion' | 'embedding' | 'image' | 'audio' | 'vision';

/** Cost configuration for a model */
export interface ModelCostConfig {
  inputTokenCostPer1k: number;
  outputTokenCostPer1k: number;
  currency: string;
}

/** Failover configuration */
export interface FailoverConfig {
  enabled: boolean;
  targets: string[]; // model IDs to fail over to
  maxRetries: number;
  retryDelayMs: number;
}

/** Registered AI model */
export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  endpoint: string;
  apiVersion?: string;
  capabilities: ModelCapability[];
  costConfig?: ModelCostConfig;
  failover?: FailoverConfig;
  metadata: Record<string, string>;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
