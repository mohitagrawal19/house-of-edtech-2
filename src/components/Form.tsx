import React from 'react';
import { Button } from './Button'; // Verify this file exists at src/components/Button.tsx

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
}: FormInputProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label
        htmlFor={name}
        style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}
      >
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>}
      </label>
      <input
        {...register(name, { required })}
        type={type}
        id={name}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: error ? '#fee2e2' : 'white',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'all 0.3s',
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = '#0284c7';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#dc2626' : '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}

interface FormTextAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
  rows?: number;
}

export function FormTextArea({
  label,
  name,
  placeholder,
  error,
  register,
  required = false,
  rows = 4,
}: FormTextAreaProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label
        htmlFor={name}
        style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}
      >
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>}
      </label>
      <textarea
        {...register(name, { required })}
        id={name}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: error ? '#fee2e2' : 'white',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'all 0.3s',
          fontFamily: 'inherit',
          resize: 'none',
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = '#0284c7';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#dc2626' : '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  register: any;
  required?: boolean;
}

export function FormSelect({
  label,
  name,
  options,
  error,
  register,
  required = false,
}: FormSelectProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label
        htmlFor={name}
        style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}
      >
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>}
      </label>
      <select
        {...register(name, { required })}
        id={name}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: error ? '#fee2e2' : 'white',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'all 0.3s',
          cursor: 'pointer',
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = '#0284c7';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#dc2626' : '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}

interface FormProps {
  title?: string;
  description?: string;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  children: React.ReactNode;
  submitButtonText?: string;
}

export function Form({
  title,
  description,
  onSubmit,
  isLoading = false,
  children,
  submitButtonText = 'Submit',
}: FormProps) {
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.05)', 
      padding: '2.5rem',
      border: '1px solid #e5e7eb',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        opacity: 0.05
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
        opacity: 0.05
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {title && <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.75rem', color: '#1f2937', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h2>}
        {description && <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>{description}</p>}

        <form onSubmit={onSubmit}>
          {children}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            style={{ 
              width: '100%',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            {submitButtonText}
          </Button>
        </form>
      </div>
    </div>
  );
}
