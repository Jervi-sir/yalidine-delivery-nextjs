'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { wilayas as locallySavedWilaya } from '@/database/wilayas';
import { useToast } from '@/hooks/use-toast';
import { Parcel } from '@prisma/client';
import { ParcelSuccessModal } from './parcel-success-modal';

const CreateOrderContext = createContext(null);

export function CreateOrderProvider({ children, parcel = null, products = [], initialInput = undefined, onUpdate = (data) => {} }) {
  const [parcels, setParcels] = useState<FormData[]>([initialInput]); // Array of parcels
  const [processing, setProcessing] = useState(false);
  const [errors, setErrorsJson] = useState<{ [key: string]: string }[]>([{}]); // Array of error objects
  const { toast } = useToast();
  const [wilayas, setWilayas] = useState([]);
  const [defaultSelectedFromWilaya, setDefaultSelectedFromWilaya] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedParcels, setSubmittedParcels] = useState<Parcel[]>([]);

  // Set data for a specific parcel by index
  const setData = (index: number, name: keyof FormData, value: string | number | boolean | null) => {
    setParcels((prevParcels) => {
      const updatedParcels = [...prevParcels];
      updatedParcels[index] = {
        ...updatedParcels[index],
        [name]: value,
      };
      return updatedParcels;
    });
  };

  // Set error for a specific parcel by index
  const setError = (index: number, field: keyof FormData, message: string) => {
    setErrorsJson((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: message,
      };
      return updatedErrors;
    });
  };

  // Add a new parcel
  const addParcel = () => {
    setParcels((prevParcels) => [...prevParcels, { ...initialInput }]);
    setErrorsJson((prevErrors) => [...prevErrors, {}]);
  };

  // Remove a parcel by index
  const removeParcel = (index: number) => {
    setParcels((prevParcels) => prevParcels.filter((_, i) => i !== index));
    setErrorsJson((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  // Reset all parcels
  const reset = () => {
    const savedFromWilaya = localStorage.getItem('from_wilaya_id');
    // const resetParcel = {
    //   ...initialInput,
    //   from_wilaya_id: savedFromWilaya ? parseInt(savedFromWilaya) : null,
    //   from_wilaya_name: savedFromWilaya
    //     ? locallySavedWilaya.find((w) => w.id === parseInt(savedFromWilaya))?.name
    //     : null,
    // };
    // setParcels([resetParcel]);
    setParcels([]);
    setErrorsJson([{}]);
  };

  // Load wilayas and set default sender wilaya
  useEffect(() => {
    setWilayas(locallySavedWilaya);
    if (!parcel) {
      const savedFromWilaya = localStorage.getItem('from_wilaya_id');
      setDefaultSelectedFromWilaya(savedFromWilaya);
      // if (savedFromWilaya) {
      //   setParcels((prevParcels) =>
      //     prevParcels.map((p: any, i) => ({
      //       ...p,
      //       from_wilaya_id: i === 0 ? parseInt(savedFromWilaya) : p.from_wilaya_id,
      //       from_wilaya_name: i === 0
      //         ? locallySavedWilaya.find((w) => w.id === parseInt(savedFromWilaya))?.name
      //         : p.from_wilaya_name,
      //     }))
      //   );
      // }
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
    setErrorsJson(parcels.map(() => ({}))); // Reset errors for all parcels
    const session = await getSession();

    try {
      setProcessing(true);
      if (parcel) {
        // Update existing parcel (assuming only one parcel is being updated)
        const response = await axios.put(`/api/parcel/${parcel?.id}`, {
          user_id: (session.user as any).id,
          user_email: session.user.email,
          tracking: parcel?.tracking,
          order_id: parcel?.order_id,
          ...parcels[0], // Assuming only one parcel for update case
        });
        toast({
          title: 'Success',
          description: response.data.message,
        });
      } else {
        // Create all parcels in bulk
        const response = await axios.post('/api/parcel/submit-bulk', {
          user_id: (session.user as any).id,
          user_email: session.user.email,
          parcels: parcels, // Send all parcels as an array
        });
        toast({
          title: 'Success',
          description: response.data.message,
        });
        setSubmittedParcels(response.data.parcels);
        setIsModalOpen(true);
      }

      // reset(); // Reset after successful submission
    } catch (error) {
      console.error('Error submitting parcels:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit parcels',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const value = {
    parcels,
    setData,
    processing,
    errors,
    wilayas,
    products,
    handleSubmit,
    addParcel,
    removeParcel,
    parcel,
    defaultSelectedFromWilaya,
    isModalOpen,
    submittedParcels,
    setIsModalOpen
  };

  return (
    <CreateOrderContext.Provider value={value}>
      {children}
      <ParcelSuccessModal
        isOpen={isModalOpen}
        onClose={() => {
          reset();
          setIsModalOpen(false);
        }}
        parcels={submittedParcels}
      />
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