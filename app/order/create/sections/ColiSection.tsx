import { Label } from '@/components/ui/label';
import { InputComponent } from '../components/InputComponent';
import { CheckboxComponent } from '../components/CheckboxComponent';
import { useCreateOrder } from '../createOrderContext';

export const ColiSection = () => {
  const {
    errors, data, setData,
  } = useCreateOrder()
  return (
    <div className='space-y-2'>
      <Label>Le colis</Label>
      {/* <SelectDropdownComponent
        label={'Select Product'}
        placeholder={'Choose product'}
        values={products}
        initialValue={data.product_id}
        handleOnValueChange={(value) => setData('product_id', value)}
        error={null}
      /> */}
      <InputComponent
        label={'Product Name'}
        placeholder={''}
        value={data.product_list}
        handleOnChange={(e) => setData('product_list', e.target.value)}
        error={errors.product_list}
      />
      {/* Price */}
      <InputComponent
        label={'Prix'}
        placeholder={''}
        value={data.price}
        handleOnChange={(e) => setData('price', e.target.value)}
        type="number"
        minNumber={1}
        error={errors.price}
      />
      {/* Free Delivery */}
      <CheckboxComponent
        label={'Livraison gratuite?'}
        onChange={(checked) => setData('freeshipping', checked)}
        checked={data.freeshipping}
        error={null}
      />
    </div>
  );
};