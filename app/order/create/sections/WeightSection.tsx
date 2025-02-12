'use client'
import { Label } from '@/components/ui/label';
import { RadioGroupComponent } from '../components/RadioGroupComponent';
import { InputComponent } from '../components/InputComponent';

export const WeightSection = () => {

  return (
    <div>
      <Label>Dimensions & poids</Label>
      <br />
      <Label >Le colis dépasse les 5 KG?</Label>
      <div className='pt-4'>
        <RadioGroupComponent
          initialValue={null}
          values={[{ id: false, name: 'Non' }, { id: true, name: 'Oui' }]}
          handleOnValueChange={(e) => { }}
        />
      </div>

      <div className='space-y-4 mt-4'>
        <InputComponent
          label={'Longueur en CM'}
          type='number'
          placeholder={''}
          value={null}
          handleOnChange={(e) => { }}
          error={null}
        />

        <InputComponent
          label={'Largeur en CM'}
          type='number'
          placeholder={''}
          value={null}
          handleOnChange={(e) => { }}
          error={null}
        />
        <InputComponent
          label={'Hauteur en CM'}
          type='number'
          placeholder={''}
          value={null}
          handleOnChange={(e) => { }}
          error={null}
        />
        <InputComponent
          label={'Poids en KG'}
          type='number'
          placeholder={''}
          value={null}
          handleOnChange={(e) => { }}
          error={null}
        />
      </div>
    </div>
  );
};