'use client';

import { TEXT_COLORS } from '@/lib/constants/colors';

interface FormInputProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

export default function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  minLength,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium mb-2 ${TEXT_COLORS.primary}`}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg input-focus ${TEXT_COLORS.primary}`}
      />
    </div>
  );
}
