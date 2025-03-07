'use client';
import { Label } from '@/components/ui/label';
import { InputComponent } from '../components/InputComponent';
import { useTranslation } from '@/provider/language-provider';

export const DestinataireSection = ({ errors, data, setData }) => {
  const doTranslate = useTranslation(translations);
  return (
    <div className='space-y-2'>
      <Label>{doTranslate('Destinataire')}</Label>
      <InputComponent
        label={doTranslate('Nom')}
        placeholder={''}
        value={data.familyName}
        handleOnChange={(e) => setData('familyName', e.target.value)}
        error={errors.familyName}
      />
      <InputComponent
        label={doTranslate('Prénom')}
        placeholder={''}
        value={data.firstName}
        handleOnChange={(e) => setData('firstName', e.target.value)}
        error={errors.firstName}
      />
      <InputComponent
        label={doTranslate('Téléphone')}
        placeholder={''}
        value={data.contactPhone}
        handleOnChange={(e) => setData('contactPhone', e.target.value)}
        error={errors.contactPhone}
      />
    </div>
  );
};

const translations = {
  "Destinataire": {
    "English": "Recipient",
    "French": "Destinataire",
    "Arabic": "المستلم"
  },
  "Nom": {
    "English": "Last Name",
    "French": "Nom",
    "Arabic": "الاسم"
  },
  "Prénom": {
    "English": "First Name",
    "French": "Prénom",
    "Arabic": "الاسم الأول"
  },
  "Téléphone": {
    "English": "Phone number",
    "French": "Téléphone",
    "Arabic": "رقم الهاتف"
  },
}