'use client';

import { Label } from '@/components/ui/label';
import { InputComponent } from '../components/InputComponent';
import { CheckboxComponent } from '../components/CheckboxComponent';
import { useCreateOrder } from '../createOrderContext';
import { useTranslation } from '@/provider/language-provider';

export const ColiSection = () => {
  const doTranslate = useTranslation(translations);
  const { errors, data, setData, } = useCreateOrder();
  return (
    <div className='space-y-2'>
      <Label>{doTranslate('Le colis')}</Label>
      {/* <SelectDropdownComponent
        label={'Select Product'}
        placeholder={'Choose product'}
        values={products}
        initialValue={data.product_id}
        handleOnValueChange={(value) => setData('product_id', value)}
        error={null}
      /> */}
      <InputComponent
        label={doTranslate('Product Name')}
        placeholder={''}
        value={data.product_list}
        handleOnChange={(e) => setData('product_list', e.target.value)}
        error={errors.product_list}
      />
      {/* Price */}
      <InputComponent
        label={doTranslate('Prix')}
        placeholder={''}
        value={data.price}
        handleOnChange={(e) => setData('price', e.target.value)}
        type="number"
        minNumber={1}
        error={errors.price}
      />
      {/* Free Delivery */}
      <CheckboxComponent
        label={doTranslate('Livraison gratuite?')}
        onChange={(checked) => setData('freeshipping', checked)}
        checked={data.freeshipping}
        error={null}
      />
    </div>
  );
};

const translations = {
  "Le colis": {
    "English": "The parcel",
    "French": "Le colis",
    "Arabic": "الطرد"
  },
  "Product Name": {
    "English": "Product Name",
    "French": "Nom du produit",
    "Arabic": "اسم المنتج"
  },
  "Prix": {
    "English": "Price",
    "French": "Prix",
    "Arabic": "السعر"
  },
  "Livraison gratuite?": {
    "English": "Free delivery?",
    "French": "Livraison gratuite ?",
    "Arabic": "توصيل مجاني؟"
  },
}