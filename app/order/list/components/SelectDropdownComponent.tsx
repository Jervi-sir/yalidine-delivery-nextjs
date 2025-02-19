import InputError from '@/components/ui/input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

export const SelectDropdownComponent = ({ isWilaya = false, placeholder, values, initialValue = undefined, error, handleOnValueChange, disabled = false }) => {
  return (
    <div className='flex flex-col min-w-40'>
      <div className='flex items-center gap-2 border border-input rounded-md'>
        <Select
          value={initialValue}
          onValueChange={handleOnValueChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full border-none">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {values.map((value, index) => (
                <SelectItem key={index} value={value}>
                  { isWilaya  && value.id > 0 && value.id + '. ' }
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