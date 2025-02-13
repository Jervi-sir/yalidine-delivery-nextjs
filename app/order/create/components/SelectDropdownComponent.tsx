import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export const SelectDropdownComponent = ({ label, placeholder, values, initialValue = undefined, error, handleOnValueChange, disabled = false }) => {
  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-2 border border-input rounded-md'>
        <Label className='pl-2 text-nowrap'>{label}</Label>
        <Separator orientation="vertical" className='h-5 w-0.5' />
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
              {values.map(value => (
                <SelectItem key={value.id} value={value.id}>
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