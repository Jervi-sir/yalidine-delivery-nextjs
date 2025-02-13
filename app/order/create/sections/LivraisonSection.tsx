import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { InputComponent } from '../components/InputComponent';
import { useCreateOrder } from '../createOrderContext';

export const LivraisonSection = () => {
  const {
    wilayas, errors, data, setData, handleWilayaChange,
    centers, communes
  } = useCreateOrder();
  
  return (
    <div className='space-y-2'>
      <Label>Livraison</Label>
      <SelectDropdownComponent
        label={'Delivery Type'}
        placeholder={'Choose delivery type'}
        values={[{ id: false, name: 'Commune' }, { id: true, name: 'Stopdesk' }]}
        handleOnValueChange={(value) => setData('is_stopdesk', value === true)}
        error={null}
      />
      {/* To Wilaya */}
      <SelectDropdownComponent
        label={'To Wilaya'}
        placeholder={'Choose wilaya'}
        values={wilayas}
        handleOnValueChange={(e) => handleWilayaChange(e)}
        error={null}
        disabled={data.is_stopdesk === null}
      />
      {data.is_stopdesk ? (
        <>
          <SelectDropdownComponent
            label={'Select Commune'}
            placeholder={'Choose commune'}
            values={communes}
            handleOnValueChange={(value) => setData('to_commune_id', value)}
            error={null}
            disabled={data.to_wilaya_name === ''}
          />
          <SelectDropdownComponent
            label={'Select Center'}
            placeholder={'Choose center'}
            values={centers}
            handleOnValueChange={(value) => setData('to_center_center_id', value)}
            error={null}
            disabled={data.to_commune_name === ''}
          />
        </>
      ) : (
        <>
          <SelectDropdownComponent
            label={'Select Commune'}
            placeholder={'Choose commune'}
            values={communes}
            handleOnValueChange={(value) => setData('to_commune_id', value)}
            error={null}
            disabled={data.to_wilaya_name === ''}
          />
          <InputComponent
            label={'Address'}
            placeholder={'Enter address'}
            value={data.address}
            handleOnChange={(e) => setData('address', e.target.value)}
            error={null}
            disabled={data.to_wilaya_name === ''}
          />
        </>
      )}
    </div>
  );
};