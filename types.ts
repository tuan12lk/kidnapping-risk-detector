export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface RiskAnalysisResult {
  risk_score: number; // 0 to 1
  risk_level: RiskLevel;
  reasoning: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: RiskAnalysisResult | null;
}
