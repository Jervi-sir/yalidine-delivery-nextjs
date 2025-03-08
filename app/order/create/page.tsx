'use client'
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { CreateOrderProvider, useCreateOrder } from "./createOrderContext";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { useTranslation } from "@/provider/language-provider";
import { InputComponent } from "./components/InputComponent";
import { RadioGroupComponent } from "./components/RadioGroupComponent";
import { Label } from "@/components/ui/label";
import { CheckboxComponent } from "./components/CheckboxComponent";
import { SelectDropdownComponent } from "./components/SelectDropdownComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import InputError from "@/components/ui/input-error";

export default function Page() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Parcle', 'Create']);
  return (
    <CreateOrderProvider>
      <OrderCreateContent />
    </CreateOrderProvider>
  );
}

const OrderCreateContent = () => {
  const doTranslate = useTranslation(translations);
  const {
    handleSubmit, processing,
    data, setData, wilayas, errors, parcel
  } = useCreateOrder();
  return (
    <>
      <div className='p-4 border rounded-lg shadow-md '>
        <h2 className="text-xl font-bold mb-4">{doTranslate('Create Parcel')}</h2>
        {/*--- Expéditeur ---*/}
        <ExpediteurSection data={data} setData={setData} wilayas={wilayas} />
        <Separator className='my-4' />
        {/*--- Destinataire ---*/}
        <DestinataireSection data={data} setData={setData} errors={errors} />
        <Separator className='my-4' />
        {/*--- Livraison ---*/}
        <LivraisonSection data={data} setData={setData} wilayas={wilayas} parcel={parcel} errors={errors} />
        <Separator className='my-4' />
        {/*--- Coli ---*/}
        <ColiSection data={data} setData={setData} errors={errors} />
        <Separator className='my-4' />
        {/*--- Dimension & poids ---*/}
        <WeightSection data={data} setData={setData} errors={errors} />
        <Separator className='my-4' />

        <Button className="w-full" onClick={handleSubmit} disabled={processing}>
          {processing ? doTranslate('Creating...') : doTranslate('Submit Parcel')}
        </Button>
      </div>
    </>
  );
}
/*
|--------------------------------------------------------------------------
| ExpediteurSection
|--------------------------------------------------------------------------
*/
export const ExpediteurSection = ({ wilayas, data, setData }) => {
  const doTranslate = useTranslation(translations);
  return (
    <div className='space-y-2'>
      <Label >{doTranslate('Expéditeur')}</Label>
      <SelectDropdownComponent
        label={doTranslate('Wilaya de départ')}
        placeholder={doTranslate('Enter from wilaya name')}
        values={wilayas}
        initialValue={data?.from_wilaya_id} // Set initial value from localStorage
        error={null}
        handleOnValueChange={(wilayaId) => {
          setData('from_wilaya_name', wilayas.find(w => w.id === wilayaId).name);
          setData('from_wilaya_id', wilayaId);
          localStorage.setItem('from_wilaya_id', wilayaId);
        }}
        required={true}
      />
    </div>
  );
};
/*
|--------------------------------------------------------------------------
| DestinataireSection
|--------------------------------------------------------------------------
*/
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
        required={true}
      />
      <InputComponent
        label={doTranslate('Prénom')}
        placeholder={''}
        value={data.firstName}
        handleOnChange={(e) => setData('firstName', e.target.value)}
        error={errors.firstName}
        required={true}
      />
      <InputComponent
        label={doTranslate('Téléphone')}
        placeholder={''}
        value={data.contactPhone}
        handleOnChange={(e) => setData('contactPhone', e.target.value)}
        error={errors.contactPhone}
        minLength={10}
        required={true}
      />
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| LivraisonSection
|--------------------------------------------------------------------------
*/
export const LivraisonSection = ({ wilayas, errors, data, setData, parcel }) => {
  const doTranslate = useTranslation(translations);
  const [communes, setCommunes] = useState([]);
  const [centers, setCenters] = useState([]);

  // get communes
  useEffect(() => {
    if (!parcel) setData('to_commune_id', '');
    if (data.to_wilaya_id === '') return undefined;
    setCommunes([])
    axios.get('/api/location/communes', {
      params: { wilaya_id: data.to_wilaya_id, has_stop_desk: data.is_stopdesk }
    }).then(response => {
      setCommunes(response.data);
    });
  }, [data.to_wilaya_id, data.is_stopdesk])

  // get communes
  useEffect(() => {
    if (data.to_commune_id === '') return undefined;
    if (!parcel) setData('to_center_id', '');
    setCenters([])
    axios.get('/api/location/centers', {
      params: { wilaya_id: data.to_wilaya_id, commune_id: data.to_commune_id }
    }).then(response => {
      setCenters(response.data);
    });
  }, [data.to_wilaya_id, data.to_commune_id, data.is_stopdesk])

  return (
    <div className='space-y-2'>
      <Label>{doTranslate('Livraison')}</Label>
      <SelectDropdownComponent
        label={doTranslate('Delivery Type')}
        placeholder={''}
        initialValue={data.is_stopdesk}
        values={[{ id: false, name: 'Commune' }, { id: true, name: 'Stopdesk' }]}
        handleOnValueChange={(value) => {
          setData('to_commune_id', '');
          setData('to_center_id', '');
          setData('address', '');
          setCommunes([])
          setCenters([])
          setData('is_stopdesk', value === true);
        }}
        error={errors.is_stopdesk}
        required={true}
      />
      <InputError message={errors.is_stopdesk} className="ml-auto mr-2" />
      {/* To Wilaya */}
      <SelectDropdownComponent
        label={doTranslate('To Wilaya')}
        placeholder={''}
        values={wilayas}
        initialValue={data.to_wilaya_id}
        handleOnValueChange={(value) => {
          setData('to_wilaya_id', value);
          setData('to_wilaya_name', wilayas.find(w => w.id === value).name);
        }}
        error={errors.to_wilaya_id}
        disabled={data?.is_stopdesk === undefined}
        required={true}
      />
      <SelectDropdownComponent
        label={doTranslate('Select Commune')}
        placeholder={''}
        values={communes}
        initialValue={data.to_commune_id}
        handleOnValueChange={(value) => {
          setData('to_commune_id', value)
          setData('to_commune_name', communes.find(c => c.id === value).name);
        }}
        error={errors.to_commune_id}
        disabled={!data?.to_wilaya_id}
        required={true}
      />
      {/* {data.is_stopdesk ? ( */}
      <SelectDropdownComponent
        label={doTranslate('Select Center')}
        placeholder={''}
        values={centers}
        initialValue={data.to_center_id}
        handleOnValueChange={(value) => {
          setData('to_center_id', value);
          setData('to_center_name', centers.find(c => c.id === value).name);
          setData('address', centers.find(c => c.id === value).name)
        }}
        error={errors.to_center_id}
        disabled={!data?.to_commune_id || (data?.is_stopdesk.toString() !== 'true')}
        required={data?.to_commune_id && data?.is_stopdesk.toString() === 'true'}
      />
      {/* ) : ( */}
      <InputComponent
        label={doTranslate('Address')}
        placeholder={''}
        value={data.address}
        handleOnChange={(e) => setData('address', e.target.value)}
        error={errors.address}
        disabled={data.to_wilaya_name === ''}
        required={true}
      />
      {/* )} */}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Coli Section
|--------------------------------------------------------------------------
*/
export const ColiSection = ({ errors, data, setData }) => {
  const doTranslate = useTranslation(translations);
  return (
    <div className='space-y-2'>
      <Label>{doTranslate('Le colis')}</Label>
      <InputComponent
        label={doTranslate('Product Name')}
        placeholder={''}
        value={data.product_list}
        handleOnChange={(e) => setData('product_list', e.target.value)}
        error={errors.product_list}
        required={true}
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
        required={true}
      />
      {/* Free Delivery */}
      <CheckboxComponent
        label={doTranslate('Livraison gratuite?')}
        onChange={(checked) => setData('freeshipping', checked)}
        checked={data.freeshipping}
        error={null}
      />
      {/* Free Delivery */}
      <CheckboxComponent
        label={doTranslate('Avec Assurance?')}
        onChange={(checked) => setData('do_insurance', checked)}
        checked={data.do_insurance}
        error={null}
      />
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| WeightSection
|--------------------------------------------------------------------------
*/
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
            required={data?.more_then_5kg?.toString() === 'true'}
          />

          <InputComponent
            label={doTranslate('Largeur en CM')}
            type='number'
            placeholder={''}
            value={data.order_width}
            handleOnChange={(e) => setData('order_width', e.target.value)}
            error={errors.order_width}
            required={data?.more_then_5kg?.toString() === 'true'}
          />
          <InputComponent
            label={doTranslate('Hauteur en CM')}
            type='number'
            placeholder={''}
            value={data.order_height}
            handleOnChange={(e) => setData('order_height', e.target.value)}
            error={errors.order_height}
            required={data?.more_then_5kg?.toString() === 'true'}
          />
          <InputComponent
            label={doTranslate('Poids en KG')}
            type='number'
            placeholder={''}
            value={data.order_weight}
            handleOnChange={(e) => setData('order_weight', e.target.value)}
            error={errors.order_weight}
            required={data?.more_then_5kg?.toString() === 'true'}
          />
        </div>
      }
    </div>
  );
};

const translations = {
  "Create Parcel": {
    "English": "Create Parcel",
    "French": "Créer un colis",
    "Arabic": "إنشاء طرد"
  },
  "Creating...": {
    "English": "Creating...",
    "French": "Création en cours...",
    "Arabic": "جاري الإنشاء..."
  },
  "Submit Parcel": {
    "English": "Submit Parcel",
    "French": "Soumettre le colis",
    "Arabic": "إرسال الطرد"
  },
  // Coli section
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
  // Desctinatire Section
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
  // Expediteur section
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
  // Libraison Section
  "Livraison": {
    "English": "Delivery",
    "French": "Livraison",
    "Arabic": "التوصيل"
  },
  "Delivery Type": {
    "English": "Delivery Type",
    "French": "Type de livraison",
    "Arabic": "نوع التوصيل"
  },
  "To Wilaya": {
    "English": "To Wilaya",
    "French": "Vers Wilaya",
    "Arabic": "إلى ولاية"
  },
  "Select Commune": {
    "English": "Select Commune",
    "French": "Sélectionner la commune",
    "Arabic": "اختر بلدية"
  },
  "Select Center": {
    "English": "Select Center",
    "French": "Sélectionner le centre",
    "Arabic": "اختر مركزاً"
  },
  "Address": {
    "English": "Address",
    "French": "Adresse",
    "Arabic": "العنوان"
  },

  // Weight Section
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
