'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { wilayas as locallySavedWilaya } from '@/database/wilayas';
import { useToast } from '@/hooks/use-toast';
const CreateOrderContext = createContext(null);



export function CreateOrderProvider({ children, parcel = null, products = [], onUpdate = (data) => { } }) {
  const initialInput: FormData = {
    recipient: parcel?.recipient || '', firstName: parcel?.firstname || '', familyName: parcel?.familyname || '', contactPhone: parcel?.contact_phone || '',
    //locations
    from_wilaya_id: parseInt(parcel?.from_wilaya_id) || undefined, from_wilaya_name: parcel?.from_wilaya_name || undefined,
    to_wilaya_id: parseInt(parcel?.to_wilaya_id) || undefined, to_wilaya_name: parcel?.to_wilaya_name || undefined,
    to_commune_id: parseInt(parcel?.to_commune_id) || undefined, to_commune_name: parcel?.to_commune_name || undefined,
    to_center_id: parseInt(parcel?.to_center_id) || undefined, to_center_name: parcel?.to_center_name || undefined,
    address: parcel?.address || undefined, order_date: parcel?.order_date || undefined,
    is_stopdesk: parcel?.is_stopdesk || undefined, do_insurance: parcel?.do_insurance || false, declared_value: parcel?.declared_value || 0,
    freeshipping: parcel?.freeshipping || false, has_exchange: parcel?.has_exchange || false, product_id: parcel?.product_id || '',
    quantity: parcel?.quantity || '', amount: parcel?.amount || '', price: parcel?.price || 2343,
    product_to_collect: parcel?.product_to_collect || undefined, more_then_5kg: parcel?.more_then_5kg || false,
    order_length: parcel?.order_length || undefined, order_width: parcel?.order_width || undefined,
    order_height: parcel?.order_height || undefined, order_weight: parcel?.order_weight || undefined,
    product_list: parcel?.product_list || undefined
  }

  const [processing, setProcessing] = useState(false);
  const [errors, setErrorsJson] = useState<{ [key: string]: string }>({}); // Define the type of errors
  const [data, setDataJson] = useState<FormData>(initialInput);
  const { toast } = useToast();

  const setData = (name: keyof FormData, value: string | number | boolean | null | undefined) => {
    setDataJson((prevData) => {
      let parsedValue: FormData[keyof FormData] = value as FormData[keyof FormData]; // Default to the provided value
      // Handle empty string cases based on the field's expected type
      // if (value === '') {
      //   if (typeof initialInput[name] === 'number') {
      //     parsedValue = undefined as FormData[keyof FormData]; // Or null if appropriate
      //   } else if (typeof initialInput[name] === 'boolean') {
      //     parsedValue = false as FormData[keyof FormData];
      //   } else {
      //     parsedValue = '' as FormData[keyof FormData]; // Keep it as an empty string
      //   }
      // }
      return {
        ...prevData,
        [name]: parsedValue,
      };
    });
  };
  // const setErrors = (errors: { [key: string]: string }) => {
  //   setErrorsJson(errors);
  // };
  const setError = (field: keyof FormData, message: string) => {
    setErrorsJson((prevErrors) => ({
      ...prevErrors,
      [field]: message,
    }));
  };
  const reset = () => {
    const old_from_wilaya_id = data.from_wilaya_id;
    setDataJson(initialInput);
    setData('from_wilaya_id', old_from_wilaya_id);
    setData('from_wilaya_name', wilayas.find(w => w.id === old_from_wilaya_id).name);
    setErrorsJson({}); // Also reset errors on reset
  };

  const [wilayas, setWilayas] = useState([]);

  // get wilayas and set sender's wilaya
  useEffect(() => {
    setWilayas(locallySavedWilaya);
    if (!parcel) {
      const savedFromWilaya = localStorage.getItem('from_wilaya_id');
      console.log('savedFromWilaya: ', savedFromWilaya);
      if (savedFromWilaya) {
        setData('from_wilaya_id', parseInt(savedFromWilaya));
        setData('from_wilaya_name', locallySavedWilaya.find(w => w.id === parseInt(savedFromWilaya)).name);
      }
    }
  }, [parcel]);

  const variableIsNotValid = (value) => {
    if (value === undefined) return true;
    if (value === '') return true;
    const trimedValue = value.toString().replace(/\s/g, '');
    if (trimedValue.length === 0) return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorsJson({})
    // wilaya depart is selected
    if (variableIsNotValid(data.from_wilaya_id)) return setError('from_wilaya_id', 'missing from wilaya id')
    // name and prenom are provided
    if (variableIsNotValid(data.familyName)) return setError('familyName', 'missing familyName');
    if (variableIsNotValid(data.firstName)) return setError('firstName', 'missing firstName');
    if (variableIsNotValid(data.contactPhone)) return setError('contactPhone', 'missing contactPhone');
    // phone is provided and is phone number
    const phoneRegex = /^\d{10}$/; // Matches 0 followed by 9 digits
    if (!phoneRegex.test(data.contactPhone.replaceAll(/\s/g, ''))) return setError('contactPhone', 'contactPhone is not correctly formatted');
    // delivery type is provided
    if (data.is_stopdesk === undefined) return setError('is_stopdesk', 'missing Delivery Type');
    // to wilaya and commune are provided
    if (!data.to_wilaya_id) return setError('to_wilaya_id', 'missing Wilaya');
    if (!data.to_commune_id) return setError('to_commune_id', 'missing Commune');
    // the delivery is stopdesk the center should be provided
    if ((data.is_stopdesk === true) && !data.to_center_id) return setError('to_center_id', 'missing Center');
    // the delivery is commune the address should be provided
    if (!data.address) return setError('address', 'missing Address');
    // coli name is provided
    if (variableIsNotValid(data.product_list)) return setError('product_list', 'missing Product Name');
    // includes the price
    if (variableIsNotValid(data.price)) return setError('price', 'missing price');
    if (data.price < 1) return setError('price', 'missing price');
    // if is above 5kg the longeur and largeur, and hauteur and poids should be provided
    if (data.more_then_5kg) {
      if (variableIsNotValid(data.order_length)) return setError('order_length', 'missing length');
      if (data.order_length < 1) return setError('order_length', 'missing length');
      if (variableIsNotValid(data.order_width)) return setError('order_width', 'missing width');
      if (data.order_width < 1) return setError('order_width', 'missing width');
      if (variableIsNotValid(data.order_height)) return setError('order_height', 'missing height');
      if (data.order_height < 1) return setError('order_height', 'missing height');
      if (variableIsNotValid(data.order_weight)) return setError('order_weight', 'missing weight');
      if (data.order_weight < 1) return setError('order_weight', 'missing weight');
    }
    const session = await getSession();

    try {
      setProcessing(true)
      if (parcel) {
        // Update existing parcel
        if (onUpdate) {
          try {
            // await onUpdate(data); // Call the onUpdate function
            const response = await axios.put(`/api/parcel/${parcel?.id}`, { 
              tracking: parcel?.tracking, 
              order_id: parcel?.order_id,
              ...data 
            });
            // onSave(response.data); // Notify the parent component of the update
            // onOpenChange(false); // Close the dialog
            toast({
              title: 'Success',
              description: response.data.message,
            });
            reset();
            return response.data;
          } catch (error) {
            console.error('Error updating parcel:', error);
            // Handle error
          }
        }
      } else {
        // Create new parcel
        const session = await getSession();
        const response = await axios.post('/api/parcel/submit', {
          user_id: (session.user as any).id,
          user_email: session.user.email,
          ...data,
        });
        toast({
          title: 'Success',
          description: response.data.message,
        });
        console.log('response: ', response.data);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false)
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
    parcel
  };

  return (
    <CreateOrderContext.Provider value={value}>
      {children}
    </CreateOrderContext.Provider>
  );
}

export const useCreateOrder = () => {
  const context = useContext(CreateOrderContext);
  if (!context) {
    throw new Error('useCreateOrder must be used within an OrderProvider');
  }
  return context;
};

interface FormData {
  recipient: string;
  firstName: string;
  familyName: string;
  contactPhone: string;
  from_wilaya_id: number | null;
  from_wilaya_name: string | null;
  to_wilaya_id: number | null;
  to_wilaya_name: string | null;
  to_commune_id: number | null;
  to_commune_name: string | null;
  to_center_id: number | null;
  to_center_name: string | null;
  address: string;
  order_date: Date | null;
  is_stopdesk: boolean | null;
  do_insurance: boolean;
  declared_value: number;
  freeshipping: boolean;
  has_exchange: boolean;
  product_id: string | null;
  product_list: string | null;
  quantity: string;
  amount: string;
  price: number | null;
  product_to_collect: string | null;
  more_then_5kg: boolean;
  order_length: number | null;
  order_width: number | null;
  order_height: number | null;
  order_weight: number | null;

  tracking?: string | null;
  import_id?: number | null;
  label?: string | null;
  labels?: string | null;
  message?: string | null;
  success?: boolean | null;
  importId?: number | null;
  status?: string | null;
  paymentId?: string | null;
}