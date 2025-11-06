import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface MultiselectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface MultiselectProps {
  options: MultiselectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function Multiselect({ options, selectedValues, onChange, placeholder = 'Select...' }: MultiselectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      return options.find(opt => opt.value === selectedValues[0])?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div
        className="multiselect-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">{getDisplayText()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="multiselect-options">
          {options.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className={`multiselect-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleOption(option.value)}
              >
                <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center flex-shrink-0">
                  {isSelected && <Check className="w-3 h-3 text-orange-600" />}
                </div>
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
