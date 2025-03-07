import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React from 'react';

export const RadioGroupComponent = ({
  values,
  initialValue,
  handleOnValueChange
}) => {
  return (
    <RadioGroup
      defaultValue={initialValue}
      onValueChange={handleOnValueChange}
      className='flex gap-10'
    >
      {
        values.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={item.id} id={item.name} />
            <Label htmlFor={item.name} className='cursor-pointer'>{item.name}</Label>
          </div>
        ))
      }
    </RadioGroup>
  );
};