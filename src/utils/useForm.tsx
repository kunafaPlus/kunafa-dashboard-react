import { useState, useCallback, useRef } from 'react';

type ValidationRules = {
  required?: boolean | string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: {
    [key: string]: (value: any) => string | boolean;
  };
  defaultValue?: any;
};

type FormData = {
  [key: string]: any;
};

type Errors = {
  [key: string]: string;
};

type UseFormOptions = {
  mode?: 'onChange' | 'onSubmit';
};

const useForm = (options: UseFormOptions = { mode: 'onChange' }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const validationRulesRef = useRef<{ [key: string]: ValidationRules }>({});

  const validateField = useCallback((name: string, value: any): boolean => {
    const rules = validationRulesRef.current[name];
    if (!rules) return true;

    let error = '';
    if (rules.required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && isNaN(value));

      if (typeof rules.required === 'string') {
        error = isEmpty ? rules.required : '';
      } else if (isEmpty) {
        error = 'This field is required';
      }
    }
    if (!error && rules.minLength !== undefined && value.length < rules.minLength) {
      error = `Minimum length is ${rules.minLength}`;
    } else if (!error && rules.maxLength !== undefined && value.length > rules.maxLength) {
      error = `Maximum length is ${rules.maxLength}`;
    } else if (!error && rules.pattern && !rules.pattern.test(value)) {
      error = 'Invalid format';
    } else if (!error && rules.validate) {
      for (const [, validationFn] of Object.entries(rules.validate)) {
        const validationError = validationFn(value);
        if (validationError && typeof validationError === 'string') {
          error = validationError;
          break;
        }
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === '';
  }, []);

  const register = useCallback(
    (name: string, rules: ValidationRules = {}, defaultValue: any = '') => {
      validationRulesRef.current[name] = rules;

      // Set default value if not already set
      if (formData[name] === undefined && defaultValue !== undefined) {
        setFormData((prevData) => ({ ...prevData, [name]: defaultValue }));
        if (options.mode === 'onChange') {
          validateField(name, defaultValue);
        }
      }

      return {
        name,
        onChange: (e: React.ChangeEvent<HTMLInputElement> | any) => {
          let fieldValue;

          if (typeof e === 'object' && e !== null && 'target' in e) {
            const { value, type } = e.target;
            if (type === 'number' || type === 'range') {
              fieldValue = value === '' ? undefined : Number(value);
            } else {
              fieldValue = value;
            }
          } else {
            fieldValue = e;
          }

          setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
          setTouched((prev) => new Set(prev).add(name));

          if (options.mode === 'onChange') {
            validateField(name, fieldValue);
          }
        },
        onBlur: () => {
          setTouched((prev) => new Set(prev).add(name));
          if (options.mode === 'onChange') {
            validateField(name, formData[name]);
          }
        },
        value: formData[name] !== undefined ? formData[name] : defaultValue,
      };
    },
    [validateField, formData, options.mode]
  );

  const setValue = useCallback(
    (name: string, value: any) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      validateField(name, value);
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    (callback: (data: FormData) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      let isValid = true;

      const allFields = Object.keys(validationRulesRef.current);
      allFields.forEach((name) => {
        const value =
          formData[name] !== undefined
            ? formData[name]
            : validationRulesRef.current[name].defaultValue;
        if (!validateField(name, value)) {
          isValid = false;
        }
      });

      setTouched(new Set(allFields));

      if (isValid) {
        callback(formData);
      } else {
        console.log('Form contains errors:', errors);
      }
    },
    [formData, validateField, errors]
  );

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([name]) => touched.has(name))
  );

  return {
    register,
    handleSubmit,
    setValue,
    errors: visibleErrors,
    formData,
  };
};

export default useForm;
