import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { useCreateOrder } from '../createOrderContext';

export const ExpediteurSection = () => {
  const {
    wilayas, errors, data, setData
  } = useCreateOrder()
  return (
    <div className='space-y-2'>
      <Label >Expéditeur</Label>
      <SelectDropdownComponent
        label={'Wilaya de départ'}
        placeholder={'Enter from wilaya name'}
        values={wilayas}
        initialValue={data.from_wilaya_id} // Set initial value from localStorage
        error={null}
        handleOnValueChange={(wilayaId) => {
          setData('to_wilaya_name', wilayas.find(w => w.id === wilayaId).name);
          setData('from_wilaya_id', wilayaId);
          localStorage.setItem('from_wilaya_id', wilayaId);
        }}
      />
    </div>
  );
};