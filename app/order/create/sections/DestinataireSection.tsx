import { Label } from '@/components/ui/label';
import { InputComponent } from '../components/InputComponent';
import { useCreateOrder } from '../createOrderContext';

export const DestinataireSection = () => {
  const {
    errors, data, setData
  } = useCreateOrder()
  return (
    <div className='space-y-2'>
      <Label>Destinataire</Label>
      <InputComponent
        label={'Nom'}
        placeholder={''}
        value={data.familyName}
        handleOnChange={(e) => setData('familyName', e.target.value)}
        error={errors.familyName}
      />
      <InputComponent
        label={'Prénom'}
        placeholder={''}
        value={data.firstName}
        handleOnChange={(e) => setData('firstName', e.target.value)}
        error={errors.firstName}
      />
      <InputComponent
        label={'Téléphone'}
        placeholder={''}
        value={data.contactPhone}
        handleOnChange={(e) => setData('contactPhone', e.target.value)}
        error={errors.contactPhone}
      />
    </div>
  );
};