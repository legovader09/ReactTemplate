import React, { FC } from 'react';
import { InputFieldProps } from '../../interfaces/InputFieldProps';

export const InputField: FC<InputFieldProps> = ({
  name,
  label,
  value,
  error,
  onChange,
  touched,
  onBlur = () => {},
  ...props
}) => (
  <fieldset>
    <input
      className={`form-input ${touched && error ? 'is-invalid' : ''}`}
      type="text"
      name={name}
      id={name}
      placeholder=" "
      maxLength={100}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
    <label className="form-label" htmlFor={name}>{label}</label>
    {touched && error && (
    <div className="form-field-invalid">{error}</div>
    )}
  </fieldset>
);
