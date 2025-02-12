'use client'
import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { InputComponent } from '../components/InputComponent';
import { CheckboxComponent } from '../components/CheckboxComponent';

export const ColiSection = () => {
  
  return (
    <div className='space-y-2'>
      <Label>Le colis</Label>
      <SelectDropdownComponent
        label={'Select Product'}
        placeholder={'Choose product'}
        values={[]}
        initialValue={null}
        handleOnValueChange={(value) => {}}
        error={null}
      />
      {/* Price */}
      <InputComponent
        label={'Prix'}
        placeholder={'Prix'}
        value={''}
        handleOnChange={(e) => {}}
        type="number"
        error={null}
      />
      {/* Free Delivery */}
      <CheckboxComponent
        label={'Livraison gratuite?'}
        onChange={(checked) => {}}
        checked={false}
        error={null}
      />
    </div>
  );
};