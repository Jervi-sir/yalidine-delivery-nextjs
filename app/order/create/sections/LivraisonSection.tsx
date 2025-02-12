'use client'
import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { InputComponent } from '../components/InputComponent';

export const LivraisonSection = () => {
  
  return (
    <div className='space-y-2'>
      <Label>Livraison</Label>
      <SelectDropdownComponent
        label={'Delivery Type'}
        placeholder={'Choose delivery type'}
        values={[{ id: false, name: 'Commune' }, { id: true, name: 'Stopdesk' }]}
        handleOnValueChange={(value) => {}}
        error={null}
      />
      {/* To Wilaya */}
      <SelectDropdownComponent
        label={'To Wilaya'}
        placeholder={'Choose wilaya'}
        values={[]}
        handleOnValueChange={(e) => {}}
        error={null}
        disabled={false}
      />
        <>
          <SelectDropdownComponent
            label={'Select Commune'}
            placeholder={'Choose commune'}
            values={[]}
            handleOnValueChange={(value) => {}}
            error={null}
            disabled={true}
          />
          <SelectDropdownComponent
            label={'Select Center'}
            placeholder={'Choose center'}
            values={[]}
            handleOnValueChange={(value) => {}}
            error={null}
            disabled={false}
          />
        </>
        <>
          <SelectDropdownComponent
            label={'Select Commune'}
            placeholder={'Choose commune'}
            values={[]}
            handleOnValueChange={(value) => {}}
            error={null}
            disabled={true}
          />
          <InputComponent
            label={'Address'}
            placeholder={'Enter address'}
            value={''}
            handleOnChange={(e) => {}}
            error={null}
            disabled={true}
          />
        </>
    </div>
  );
};