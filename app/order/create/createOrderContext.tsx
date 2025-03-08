'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { wilayas as locallySavedWilaya } from '@/database/wilayas';
import { useToast } from '@/hooks/use-toast';
import { Parcel } from '@prisma/client';
import { ParcelSuccessModal } from './parcel-success-modal';

const CreateOrderContext = createContext(null);

export function CreateOrderProvider({ children, parcel = null, products = [], onUpdate = (data) => { } }) {
  const initialInput: FormData = {
    recipient: parcel?.recipient || '',
    firstName: parcel?.firstname || '',
    familyName: parcel?.familyname || '',
    contactPhone: parcel?.contact_phone || '',
    from_wilaya_id: parseInt(parcel?.from_wilaya_id) || undefined,
    from_wilaya_name: parcel?.from_wilaya_name || undefined,
    to_wilaya_id: parseInt(parcel?.to_wilaya_id) || undefined,
    to_wilaya_name: parcel?.to_wilaya_name || undefined,
    to_commune_id: parseInt(parcel?.to_commune_id) || undefined,
    to_commune_name: parcel?.to_commune_name || undefined,
    to_center_id: parseInt(parcel?.to_center_id) || undefined,
    to_center_name: parcel?.to_center_name || undefined,
    address: parcel?.address || undefined,
    is_stopdesk: parcel?.is_stopdesk || undefined,
    freeshipping: parcel?.freeshipping || false,
    price: parcel?.price || undefined,
    product_list: parcel?.product_list || undefined,
    do_insurance: parcel?.do_insurance  || false,
    has_exchange: parcel?.has_exchange  || false,
    more_then_5kg: parcel?.more_then_5kg || false,
    order_length: parcel?.order_length || undefined,
    order_width: parcel?.order_width || undefined,
    order_height: parcel?.order_height || undefined,
    order_weight: parcel?.order_weight || undefined,
  };

  const [data, setDataJson] = useState<FormData>(initialInput);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrorsJson] = useState<{ [key: string]: string }>({});
  const [wilayas, setWilayas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedParcel, setSubmittedParcel] = useState<Parcel | null>(null);
  const { toast } = useToast();

  const setData = (name: keyof FormData, value: string | number | boolean | null | undefined) => {
    setDataJson((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setError = (field: keyof FormData, message: string) => {
    setErrorsJson((prevErrors) => ({
      ...prevErrors,
      [field]: message,
    }));
  };
  const reset = () => {
    const savedFromWilaya = localStorage.getItem('from_wilaya_id');
    setDataJson({
      ...initialInput,
      from_wilaya_id: savedFromWilaya ? parseInt(savedFromWilaya) : undefined,
      from_wilaya_name: savedFromWilaya
        ? locallySavedWilaya.find((w) => w.id === parseInt(savedFromWilaya))?.name
        : undefined,
    });
    setErrorsJson({});
  };

  // get wilayas and set sender's wilaya
  useEffect(() => {
    setWilayas(locallySavedWilaya);
    if (!parcel) {
      const savedFromWilaya = localStorage.getItem('from_wilaya_id');
      if (savedFromWilaya) {
        setData('from_wilaya_id', parseInt(savedFromWilaya));
        setData('from_wilaya_name', locallySavedWilaya.find((w) => w.id === parseInt(savedFromWilaya))?.name);
      }
    }
  }, [parcel]);

  const variableIsNotValid = (value: any) => {
    if (value === undefined || value === null) return true;
    if (value === '') return true;
    const trimmedValue = value.toString().replace(/\s/g, '');
    return trimmedValue.length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorsJson({});

    const validations = [
      [!data.from_wilaya_id, 'from_wilaya_id', 'Missing from wilaya'],
      [variableIsNotValid(data.familyName), 'familyName', 'Missing family name'],
      [variableIsNotValid(data.firstName), 'firstName', 'Missing first name'],
      [variableIsNotValid(data.contactPhone), 'contactPhone', 'Missing contact phone'],
      [!/^\d{10}$/.test(data.contactPhone?.replace(/\s/g, '') || ''), 'contactPhone', 'Invalid phone format'],
      [data.is_stopdesk === undefined, 'is_stopdesk', 'Missing delivery type'],
      [!data.to_wilaya_id, 'to_wilaya_id', 'Missing destination wilaya'],
      [!data.to_commune_id, 'to_commune_id', 'Missing commune'],
      [data.is_stopdesk && !data.to_center_id, 'to_center_id', 'Missing center for stopdesk'],
      [!data.address, 'address', 'Missing address'],
      [variableIsNotValid(data.product_list), 'product_list', 'Missing product name'],
      [variableIsNotValid(data.price) || Number(data.price) < 1, 'price', 'Invalid price'],
    ];

    if (data.more_then_5kg) {
      validations.push(
        [variableIsNotValid(data.order_length) || Number(data.order_length) < 1, 'order_length', 'Invalid length'],
        [variableIsNotValid(data.order_width) || Number(data.order_width) < 1, 'order_width', 'Invalid width'],
        [variableIsNotValid(data.order_height) || Number(data.order_height) < 1, 'order_height', 'Invalid height'],
        [variableIsNotValid(data.order_weight) || Number(data.order_weight) < 1, 'order_weight', 'Invalid weight']
      );
    }

    for (const [condition, field, message] of validations) {
      if (condition) {
        setError(field as keyof FormData, message as any);
        return;
      }
    }

    const session = await getSession();

    try {
      setProcessing(true);
      let response;
      if (parcel) {
        response = await axios.put(`/api/parcel/${parcel?.id}`, {
          user_id: (session.user as any).id,
          user_email: session.user.email,
          tracking: parcel?.tracking,
          order_id: parcel?.order_id,
          ...data,
        });
      } else {
        response = await axios.post('/api/parcel/submit-bulk', {
          user_id: (session.user as any).id,
          user_email: session.user.email,
          parcels: [data]
        });
        setSubmittedParcel(response.data.parcels[0]);
        setIsModalOpen(true);
      }

      toast({
        title: 'Success',
        description: response.data.message,
      });
      // reset();
    } catch (error) {
      console.error('Error submitting parcel:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit parcel',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };


  const value = {
    data,
    setData,
    processing,
    errors,
    wilayas,
    products,
    handleSubmit,
    parcel,
    isModalOpen,
    setIsModalOpen,
    submittedParcel,
  };


  return (
    <CreateOrderContext.Provider value={value}>
      {children}
      {/* {submittedParcel && ( */}
        <ParcelSuccessModal
          isOpen={isModalOpen}
          onClose={() => {
            reset();
            setIsModalOpen(false);
            setSubmittedParcel(null);
          }}
          parcel={submittedParcel}
        />
      {/* )} */}
    </CreateOrderContext.Provider>
  );
}

export const useCreateOrder = () => {
  const context = useContext(CreateOrderContext);
  if (!context) {
    throw new Error('useCreateOrder must be used within a CreateOrderProvider');
  }
  return context;
};

interface FormData {
  recipient: string;
  firstName: string;
  familyName: string;
  contactPhone: string;
  from_wilaya_id: number | undefined;
  from_wilaya_name: string | undefined;
  to_wilaya_id: number | undefined;
  to_wilaya_name: string | undefined;
  to_commune_id: number | undefined;
  to_commune_name: string | undefined;
  to_center_id: number | undefined;
  to_center_name: string | undefined;
  address: string | undefined;
  is_stopdesk: boolean | undefined;
  freeshipping: boolean;
  price: number | undefined;
  product_list: string | undefined;
  do_insurance: boolean;
  has_exchange: boolean;
  more_then_5kg: boolean;
  order_length: number | undefined;
  order_width: number | undefined;
  order_height: number | undefined;
  order_weight: number | undefined;
}
