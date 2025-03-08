import InputError from '@/components/ui/input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react';

export const SelectDropdownComponent = ({ label, placeholder, valueKey = 'id', values, initialValue: initialValueProp = undefined, error, handleOnValueChange, disabled = false, required = false }) => {
  const [selectedValue, setSelectedValue] = useState(initialValueProp);

  useEffect(() => {
    if (values.some((v) => v[valueKey] === initialValueProp)) {
      setSelectedValue(initialValueProp);
    }
  }, [values, initialValueProp, valueKey]);

  return (
    <div className={`flex flex-col min-w-[100px] max-w-[150px] ${disabled && 'opacity-5'}`}>
      <div className='flex items-center gap-2 border border-input rounded-md'>
        <Select
          value={selectedValue}
          onValueChange={handleOnValueChange}
          disabled={disabled}
          required={required}
        >
          <SelectTrigger className="w-full border-none">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {values.map(value => (
                <SelectItem key={value[valueKey]} value={value[valueKey]}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <InputError message={error} className="ml-auto mr-2" />
    </div>
  );
};