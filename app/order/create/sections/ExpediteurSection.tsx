'use client'
import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';

export const ExpediteurSection = () => {

  return (
    <div className='space-y-2'>
      <Label >Expéditeur</Label>
      <SelectDropdownComponent
        label={'Wilaya de départ'}
        placeholder={'Enter from wilaya name'}
        values={[]}
        initialValue={null} // Set initial value from localStorage
        error={null}
        handleOnValueChange={(wilayaId) => {
          // setData('to_wilaya_name', wilayas.find(w => w.id === wilayaId).name);
          // setData('from_wilaya_id', wilayaId);
          // localStorage.setItem('from_wilaya_id', wilayaId);
        }}
      />
    </div>
  );
};