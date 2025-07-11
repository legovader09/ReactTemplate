import {
  ChangeEvent, useCallback, useEffect, useState,
} from 'react';
import { RegexHelper } from './regexHelper';
import { validateField, validateValues } from './validationHelper';
import { ValidationRule } from '../types/ValidationRule';
import { Touched } from '../types/Touched';

type ValidationRules<T> = Partial<Record<keyof T, ValidationRule>>;
type Errors<T> = Partial<Record<keyof T, string>>;

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>,
  setAppState: (appState: T) => void,
) => {
  const [values, setValues] = useState<T>(initialValues);

  useEffect(() => {
    setAppState(values);
  }, [values]);

  const [errors, setErrors] = useState<Errors<T>>(() => Object.keys(initialValues)
    .reduce((acc, key) => {
      acc[key as keyof T] = null;
      return acc;
    }, {} as Errors<T>));
  const [touched, setTouched] = useState<Touched<T>>(() => Object.keys(initialValues)
    .reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Touched<T>));

  const validate = useCallback(
    (fieldName: keyof T, value: any): string | null | true => validateField(
      fieldName as string,
      value,
      validationRules,
      RegexHelper,
      values,
    ),
    [validationRules],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    const { errors: newErrors } = validateValues(
      { ...values, [name]: value },
      validationRules,
      RegexHelper,
    );

    setErrors(newErrors);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev: any) => ({ ...prev, [name]: true }));
  };

  const isValid = useCallback(() => {
    const { isValid: valid } = validateValues(values, validationRules, RegexHelper);
    return valid;
  }, [values, validationRules]);

  const submitForm = useCallback(
    (onValid: () => void, onInvalid?: (errors: Errors<T>) => void) => {
      const allTouched = (Object.keys(values) as Array<keyof T>).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Touched<T>);
      setTouched(allTouched);

      // eslint-disable-next-line max-len
      const { errors: newErrors, isValid: valid } = validateValues(values, validationRules, RegexHelper);
      setErrors(newErrors);

      if (valid) {
        onValid();
      } else if (onInvalid) {
        onInvalid(newErrors);
      }
    },
    [values, validationRules],
  );

  const setFormValues = useCallback(
    (newValues: Partial<T>) => {
      setValues((prev) => ({ ...prev, ...newValues }));

      Object.entries(newValues).forEach(([fieldName, value]) => {
        const error = validate(fieldName as keyof T, value);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: typeof error === 'string' ? error : '',
        }));
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
      });
    },
    [validate],
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    setFormValues,
    submitForm,
  };
};
