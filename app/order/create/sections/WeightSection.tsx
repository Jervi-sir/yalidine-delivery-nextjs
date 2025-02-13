import { Label } from '@/components/ui/label';
import { RadioGroupComponent } from '../components/RadioGroupComponent';
import { InputComponent } from '../components/InputComponent';
import { useCreateOrder } from '../createOrderContext';

export const WeightSection = () => {
  const {
    errors, data, setData,
  } = useCreateOrder();

  return (
    <div>
      <Label>Dimensions & poids</Label>
      <br />
      <Label >Le colis dépasse les 5 KG?</Label>
      <div className='pt-4'>
        <RadioGroupComponent
          initialValue={data.more_then_5kg}
          values={[{ id: false, name: 'Non' }, { id: true, name: 'Oui' }]}
          handleOnValueChange={(e) => setData('more_then_5kg', e)}
        />
      </div>
      {
        data.more_then_5kg
        &&
        <div className='space-y-4 mt-4'>
          <InputComponent
            label={'Longueur en CM'}
            type='number'
            placeholder={''}
            value={data.order_length}
            handleOnChange={(e) => setData('order_length', e.target.value)}
            error={null}
          />

          <InputComponent
            label={'Largeur en CM'}
            type='number'
            placeholder={''}
            value={data.order_width}
            handleOnChange={(e) => setData('order_width', e.target.value)}
            error={null}
          />
          <InputComponent
            label={'Hauteur en CM'}
            type='number'
            placeholder={''}
            value={data.order_height}
            handleOnChange={(e) => setData('order_height', e.target.value)}
            error={null}
          />
          <InputComponent
            label={'Poids en KG'}
            type='number'
            placeholder={''}
            value={data.order_weight}
            handleOnChange={(e) => setData('order_weight', e.target.value)}
            error={null}
          />
        </div>
      }

    </div>
  );
};