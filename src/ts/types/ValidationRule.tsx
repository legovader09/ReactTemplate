export type ValidationRule = {
  required?: boolean | string;
  pattern?: RegExp | string;
  message?: string;
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
  dependsOn?: string;
  dependsOnCondition?: (dependsOnValue: any) => boolean;
};
