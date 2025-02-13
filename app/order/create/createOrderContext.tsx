'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CreateOrderContext = createContext(null);

const initialInput: FormData = {
  recipient: '', firstName: '', familyName: '', contactPhone: '',
  from_wilaya_id: undefined, to_wilaya_id: undefined, to_commune_id: undefined, to_center_center_id: undefined, address: '',
  order_date: undefined, is_stopdesk: undefined, do_insurance: false, declared_value: 0,
  freeshipping: false, has_exchange: false, product_id: '', quantity: '', amount: '', price: undefined, product_to_collect: undefined,
  more_then_5kg: false, order_length: undefined, order_width: undefined, order_height: undefined, order_weight: undefined,
  product_list: undefined
}

export function CreateOrderProvider({ children, products = [] }) {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrorsJson] = useState<{ [key: string]: string }>({}); // Define the type of errors
  const [data, setDataJson] = useState<FormData>(initialInput);

  const setData = (name: keyof FormData, value: string | number | boolean | null | undefined) => {
    setDataJson((prevData) => {
      let parsedValue: FormData[keyof FormData] = value as FormData[keyof FormData]; // Default to the provided value
      // Handle empty string cases based on the field's expected type
      if (value === '') {
        if (typeof initialInput[name] === 'number') {
          parsedValue = undefined as FormData[keyof FormData]; // Or null if appropriate
        } else if (typeof initialInput[name] === 'boolean') {
          parsedValue = false as FormData[keyof FormData];
        } else {
          parsedValue = '' as FormData[keyof FormData]; // Keep it as an empty string
        }
      }
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
    setDataJson(initialInput);
    setErrorsJson({}); // Also reset errors on reset
  };

  const [wilayas, setWilayas] = useState([]);

  // get wilayas and set sender's wilaya
  useEffect(() => {
    axios.get('/api/location/wilayas').then(response => {
      setWilayas(response.data);
      const savedFromWilaya = localStorage.getItem('from_wilaya_id');
      if (savedFromWilaya) {
        setData('from_wilaya_id', parseInt(savedFromWilaya));
      }
    });
  }, []);

  const variableIsNotValid = (value) => {
    if (value === undefined) return true;
    if (value === '') return true;
    const trimedValue = value.toString().replace(/\s/g,'');
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
    if (!phoneRegex.test(data.contactPhone.replaceAll(/\s/g,''))) return setError('contactPhone', 'contactPhone is not correctly formatted');
    // delivery type is provided
    if (data.is_stopdesk === undefined) return setError('is_stopdesk', 'missing Delivery Type');
    // to wilaya and commune are provided
    if (!data.to_wilaya_id) return setError('to_wilaya_id', 'missing Wilaya');
    if (!data.to_commune_id) return setError('to_commune_id', 'missing Commune');
    // the delivery is stopdesk the center should be provided
    if ((data.is_stopdesk === true) && !data.to_center_center_id) return setError('to_center_center_id', 'missing Center');
    // the delivery is commune the address should be provided
    if ((data.is_stopdesk !== true) && !data.address) return setError('address', 'missing Address');
    // coli name is provided
    if (variableIsNotValid(data.product_list)) return setError('product_list', 'missing Product Name');
    // includes the price
    if (variableIsNotValid(data.price)) return setError('price', 'missing price');
    if (data.price < 1) return setError('price', 'missing price');
    // if is above 5kg the longeur and largeur, and hauteur and poids should be provided
    if (data.more_then_5kg) {
      if (variableIsNotValid(data.order_length))  return setError('order_length', 'missing length');
        if (data.order_length < 1)               return setError('order_length', 'missing length');
      if (variableIsNotValid(data.order_width))   return setError('order_width', 'missing width');
        if (data.order_width < 1)                return setError('order_width', 'missing width');
      if (variableIsNotValid(data.order_height))  return setError('order_height', 'missing height');
        if (data.order_height < 1)               return setError('order_height', 'missing height');
      if (variableIsNotValid(data.order_weight))  return setError('order_weight', 'missing weight');
        if (data.order_weight < 1)               return setError('order_weight', 'missing weight');
    }

    try {
      setProcessing(true)
      const response = await axios.post('/api/parcel/submit', data);
      reset();

      console.log('response: ', response.data);
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
  to_wilaya_id: number | null;
  to_commune_id: number | null;
  to_center_center_id: number | null;
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
}