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
}

export function CreateOrderProvider({ children, products = [] }) {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setDataJson] = useState<FormData>(initialInput);

  const setData = (name: keyof FormData, value: FormData[keyof FormData]) => {
    setDataJson((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reset = () => {
    setDataJson(initialInput);
  }


  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [centers, setCenters] = useState([]);
  const [date, setDate] = useState(null);

  useEffect(() => {
    axios.get('/api/location/wilayas').then(response => {
      setWilayas(response.data);
      const savedFromWilaya = localStorage.getItem('from_wilaya_id');
      if (savedFromWilaya) {
        setData('from_wilaya_id', parseInt(savedFromWilaya));
      }
    });
  }, []);

  const handleWilayaChange = (wilayaId: number) => {
    setData('to_wilaya_id', wilayaId);
    setData('to_commune_id', '');
    setData('to_center_center_id', '');

    axios.get('/api/location/communes', {
      params: { wilaya_id: wilayaId }
    }).then(response => {
      setCommunes(response.data);
    });

    axios.get('/api/location/centers', {
      params: { wilaya_id: wilayaId }
    }).then(response => {
      setCenters(response.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/parcel/submit', data);
      reset();
      
      console.log('response: ', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    data,
    setData,
    processing,
    errors,
    wilayas,
    communes,
    centers,
    products,
    handleWilayaChange,
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
  product_id: string;
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