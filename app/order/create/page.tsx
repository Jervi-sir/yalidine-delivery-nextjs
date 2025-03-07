'use client'
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { ExpediteurSection } from './sections/ExpediteurSection';
import { DestinataireSection } from './sections/DestinataireSection';
import { LivraisonSection } from './sections/LivraisonSection';
import { ColiSection } from './sections/ColiSection';
import { WeightSection } from './sections/WeightSection';
import { CreateOrderProvider, useCreateOrder } from "./createOrderContext";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { useTranslation } from "@/provider/language-provider";

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

        <Button className="w-full" onClick={handleSubmit} disabled={false}>
          {processing ? doTranslate('Creating...') : doTranslate('Submit Parcel')}
        </Button>
      </div>
    </>
  );
}

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
  }
}
