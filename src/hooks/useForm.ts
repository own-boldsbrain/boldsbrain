/**
 * Form-related hooks following accessibility guidelines
 * MUST: Handle unsaved changes, prevent data loss, etc.
 */

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * MUST: Warn about unsaved changes when navigating away
 */
export function useUnsavedChanges(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
}

/**
 * MUST: Track form dirty state
 */
export function useFormDirty() {
  const [isDirty, setIsDirty] = useState(false);
  const initialValuesRef = useRef<Record<string, unknown>>({});

  const setInitialValues = useCallback((values: Record<string, unknown>) => {
    initialValuesRef.current = values;
    setIsDirty(false);
  }, []);

  const checkDirty = useCallback((currentValues: Record<string, unknown>) => {
    const dirty = Object.keys(currentValues).some(
      key => currentValues[key] !== initialValuesRef.current[key]
    );
    setIsDirty(dirty);
  }, []);

  return { isDirty, setInitialValues, checkDirty };
}

/**
 * MUST: Form submission state with idempotency
 */
export function useFormSubmission<T = unknown>() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  const submit = useCallback(
    async (submitFn: (key: string) => Promise<T>) => {
      // MUST: Generate idempotency key
      const key = idempotencyKeyRef.current || `form-${Date.now()}-${Math.random()}`;
      idempotencyKeyRef.current = key;

      setIsSubmitting(true);
      setError(null);

      try {
        const result = await submitFn(key);
        setData(result);
        idempotencyKeyRef.current = null; // Reset after success
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
    setData(null);
    idempotencyKeyRef.current = null;
  }, []);

  return { isSubmitting, error, data, submit, reset };
}

/**
 * MUST: Track input validation errors inline
 */
export function useFieldValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const errorFields = Object.keys(errors);

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors,
    errorFields,
  };
}

/**
 * SHOULD: Debounced validation
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
