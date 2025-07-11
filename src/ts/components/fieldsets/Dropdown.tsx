import React, {
  ChangeEvent, FocusEvent, useEffect, useState,
} from 'react';

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  name?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  touched?: boolean;
  error?: string;
  onBlur?: (e: string | null) => void;
  renderOption?: (option: Option) => React.ReactNode;
  renderSelectedOption?: (option: Option) => React.ReactNode;
  placeholder?: string;
  className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  name,
  options,
  value = null,
  onChange = () => {},
  touched,
  error,
  onBlur = () => {},
  renderOption = (option) => <p>{option.label}</p>,
  renderSelectedOption = (option) => <p>{option.label}</p>,
  placeholder = 'Select an option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.value === value) || null,
  );

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === value) || null);
  }, [value, options]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
    onBlur(value);
  };

  const renderListItem = (option: Option) => renderOption(option);

  return (
    <div
      className={`dropdown-container ${className}`.trim()}
      onBlur={handleBlur}
    >
      <input type="hidden" name={name} id={name} value={value} />
      <button
        type="button"
        className={`dropdown-header ${touched && error ? 'is-invalid' : ''} ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="dropdown-header-content">
          {selectedOption ? (
            renderSelectedOption(selectedOption)
          ) : (
            <p className="dropdown-placeholder">{placeholder}</p>
          )}
        </div>
        <p
          tabIndex={-1}
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>
      <ul
        className={`dropdown-menu ${isOpen ? 'open' : ''}`}
        role="listbox"
        aria-label="Dropdown menu"
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="dropdown-item"
            onClick={() => handleOptionClick(option)}
            role="option"
            aria-selected={selectedOption?.value === option.value}
            aria-hidden={!isOpen}
            tabIndex={isOpen ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOptionClick(option);
              }
            }}
          >
            {renderListItem(option)}
          </li>
        ))}
      </ul>
      {touched && error && (
        <div className="form-field-invalid">{error}</div>
      )}
    </div>
  );
};

export default Dropdown;
