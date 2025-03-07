import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { useTranslation } from '@/provider/language-provider';

export const ExpediteurSection = ({ wilayas, data, setData }) => {
  const doTranslate = useTranslation(translations);
  return (
    <div className='space-y-2'>
      <Label >{doTranslate('Expéditeur')}</Label>
      <SelectDropdownComponent
        label={doTranslate('Wilaya de départ')}
        placeholder={doTranslate('Enter from wilaya name')}
        values={wilayas}
        initialValue={data.from_wilaya_id} // Set initial value from localStorage
        error={null}
        handleOnValueChange={(wilayaId) => {
          setData('from_wilaya_name', wilayas.find(w => w.id === wilayaId).name);
          setData('from_wilaya_id', wilayaId);
          localStorage.setItem('from_wilaya_id', wilayaId);
        }}
      />
    </div>
  );
};

const translations = {
  "Expéditeur": {
    "English": "Sender",
    "French": "Expéditeur",
    "Arabic": "المرسل"
  },
  "Wilaya de départ": {
    "English": "Departure Wilaya",
    "French": "Wilaya de départ",
    "Arabic": "ولاية المغادرة"
  },
  "Enter from wilaya name": {
    "English": "Enter from wilaya name",
    "French": "Entrez le nom de la wilaya de départ",
    "Arabic": "أدخل اسم الولاية"
  },
}