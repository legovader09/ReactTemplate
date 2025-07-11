import { ValidationRule } from '../types/ValidationRule';

type ValidationRules = Record<string, ValidationRule>;
type RegexHelperType = Record<string, RegExp>;

export const validateField = (
  fieldName: string,
  value: any,
  validationRules: ValidationRules,
  regexHelper: RegexHelperType,
  allValues: Record<string, any>,
): string | null | true => {
  const rule = validationRules[fieldName];
  if (!rule) return true;

  if (rule.dependsOn) {
    const dependsOnField = rule.dependsOn;
    const dependsOnValue = allValues[dependsOnField];

    if (rule.dependsOnCondition && !rule.dependsOnCondition(dependsOnValue)) {
      return null;
    }

    if (!dependsOnValue) {
      return null;
    }
  }

  if ((value === null || value === undefined || value === '') && rule.required) {
    return typeof rule.required === 'string' ? rule.required : 'This field is required';
  }

  if (rule.pattern) {
    const regex = typeof rule.pattern === 'string' && regexHelper[rule.pattern]
      ? regexHelper[rule.pattern]
      : rule.pattern;

    if (regex instanceof RegExp && !regex.test(value)) {
      return rule.message || `Invalid format for ${fieldName}`;
    }
  }

  if (rule.min) {
    if ((rule.pattern === 'number' || typeof value === 'number') && value < rule.min) {
      return rule.minMessage || `Value must be at least ${rule.min}`;
    }
    if (typeof value === 'string' && value.length < rule.min) {
      return rule.minMessage || `Minimum ${rule.min} characters required`;
    }
  }

  if (rule.max) {
    if ((rule.pattern === 'number' || typeof value === 'number') && value > rule.max) {
      return rule.maxMessage || `Value must be at most ${rule.max}`;
    }
    if (typeof value === 'string' && value.length > rule.max) {
      return rule.maxMessage || `Maximum ${rule.max} characters allowed`;
    }
  }

  return null;
};

export const validateValues = <T extends Record<string, any>>(
  values: T,
  validationRules: Partial<Record<keyof T, ValidationRule>>,
  regexHelper: Record<string, RegExp>,
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  (Object.keys(validationRules) as Array<keyof T>).forEach((key) => {
    const error = validateField(
      key as string,
      values[key],
      validationRules,
      regexHelper,
      values,
    );

    if (error !== true && error !== null) {
      errors[key] = error;
      isValid = false;
    } else {
      errors[key] = '';
    }
  });

  return { isValid, errors };
};
