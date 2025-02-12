'use client'
import { Label } from '@/components/ui/label';
import { InputComponent } from '../components/InputComponent';

export const DestinataireSection = () => {

  return (
    <div className='space-y-2'>
      <Label>Destinataire</Label>
      <InputComponent
        label={'Nom'}
        placeholder={''}
        value={''}
        handleOnChange={(e) => {}}
        error={null}
      />
      <InputComponent
        label={'Prénom'}
        placeholder={''}
        value={''}
        handleOnChange={(e) => {}}
        error={null}
      />
      <InputComponent
        label={'Téléphone'}
        placeholder={''}
        value={''}
        handleOnChange={(e) => {}}
        error={null}
      />
    </div>
  );
};