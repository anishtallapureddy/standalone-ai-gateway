/** Skill — higher-level construct composed of tools, prompts, and workflows */
export interface SkillStep {
  type: 'tool' | 'prompt' | 'condition' | 'parallel';
  toolId?: string;
  promptTemplate?: string;
  condition?: string;
  steps?: SkillStep[]; // for parallel/conditional
}

/** Registered skill */
export interface Skill {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  workflow: SkillStep[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  ownerTeamId: string;
  visibility: 'public' | 'private' | 'team';
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
