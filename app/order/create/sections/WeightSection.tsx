import { Label } from '@/components/ui/label';
import { RadioGroupComponent } from '../components/RadioGroupComponent';
import { InputComponent } from '../components/InputComponent';
import { useCreateOrder } from '../createOrderContext';
import { useTranslation } from '@/provider/language-provider';

export const WeightSection = ({ errors, data, setData }) => {
  const doTranslate = useTranslation(translations);

  return (
    <div>
      <Label>{doTranslate('Dimensions & poids')}</Label>
      <br />
      <Label >{doTranslate('Le colis dépasse les 5 KG?')}</Label>
      <div className='pt-4'>
        <RadioGroupComponent
          initialValue={data.more_then_5kg}
          values={[{ id: false, name: doTranslate('Non') }, { id: true, name: doTranslate('Oui') }]}
          handleOnValueChange={(e) => setData('more_then_5kg', e)}
        />
      </div>
      {
        data.more_then_5kg
        && <div className='space-y-4 mt-4'>
          <InputComponent
            label={doTranslate('Longueur en CM')}
            type='number'
            placeholder={''}
            value={data.order_length}
            handleOnChange={(e) => setData('order_length', e.target.value)}
            error={errors.order_length}
          />

          <InputComponent
            label={doTranslate('Largeur en CM')}
            type='number'
            placeholder={''}
            value={data.order_width}
            handleOnChange={(e) => setData('order_width', e.target.value)}
            error={errors.order_width}
          />
          <InputComponent
            label={doTranslate('Hauteur en CM')}
            type='number'
            placeholder={''}
            value={data.order_height}
            handleOnChange={(e) => setData('order_height', e.target.value)}
            error={errors.order_height}
          />
          <InputComponent
            label={doTranslate('Poids en KG')}
            type='number'
            placeholder={''}
            value={data.order_weight}
            handleOnChange={(e) => setData('order_weight', e.target.value)}
            error={errors.order_weight}
          />
        </div>
      }
    </div>
  );
};

const translations = {
  "Dimensions & poids": {
    "English": "Dimensions & weight",
    "French": "Dimensions et poids",
    "Arabic": "الأبعاد والوزن"
  },
  "Le colis dépasse les 5 KG?": {
    "English": "Does the parcel exceed 5 KG?",
    "French": "Le colis dépasse-t-il 5 KG ?",
    "Arabic": "هل يتجاوز الطرد 5 كجم؟"
  },
  "Non": {
    "English": "No",
    "French": "Non",
    "Arabic": "لا"
  },
  "Oui": {
    "English": "Yes",
    "French": "Oui",
    "Arabic": "نعم"
  },
  "Longueur en CM": {
    "English": "Length in CM",
    "French": "Longueur en CM",
    "Arabic": "الطول بالسنتمتر"
  },
  "Largeur en CM": {
    "English": "Width in CM",
    "French": "Largeur en CM",
    "Arabic": "العرض بالسنتمتر"
  },
  "Hauteur en CM": {
    "English": "Height in CM",
    "French": "Hauteur en CM",
    "Arabic": "الارتفاع بالسنتمتر"
  },
  "Poids en KG": {
    "English": "Weight in KG",
    "French": "Poids en KG",
    "Arabic": "الوزن بالكيلوجرام"
  },
}