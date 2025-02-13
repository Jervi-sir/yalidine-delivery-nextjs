'use client'
import { Label } from '@/components/ui/label';
import { SelectDropdownComponent } from '../components/SelectDropdownComponent';
import { InputComponent } from '../components/InputComponent';
import { useCreateOrder } from '../createOrderContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InputError from '@/components/ui/input-error';

export const LivraisonSection = () => {
  const {
    wilayas, errors, data, setData,
  } = useCreateOrder();
  const [communes, setCommunes] = useState([]);
  const [centers, setCenters] = useState([]);


  // get communes
  useEffect(() => {
    setData('to_commune_id', undefined);
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
    setData('to_center_id', undefined);
    if (data.to_commune_id === '') return undefined;
    setCenters([])
    axios.get('/api/location/centers', {
      params: { wilaya_id: data.to_wilaya_id, commune_id: data.to_commune_id }
    }).then(response => {
      setCenters(response.data);
    });
  }, [data.to_wilaya_id, data.to_commune_id, data.is_stopdesk])

  return (
    <div className='space-y-2'>
      <Label>Livraison</Label>
      <SelectDropdownComponent
        label={'Delivery Type'}
        placeholder={''}
        values={[{ id: false, name: 'Commune' }, { id: true, name: 'Stopdesk' }]}
        handleOnValueChange={(value) => {
          setData('to_commune_id', '');
          setData('to_center_id', '');
          setCommunes([])
          setCenters([])
          setData('is_stopdesk', value === true);
        }}
        error={null}
      />
      <InputError message={errors.is_stopdesk} className="ml-auto mr-2" />
      {/* To Wilaya */}
      <SelectDropdownComponent
        label={'To Wilaya'}
        placeholder={''}
        values={wilayas}
        initialValue={data.to_wilaya_id}
        handleOnValueChange={(value) => {
          setData('to_wilaya_id', value);
          setData('to_wilaya_name', wilayas.find(w => w.id === value).name);
        }}
        error={errors.to_wilaya_id}
        disabled={data.is_stopdesk === null}
      />
      <SelectDropdownComponent
        label={'Select Commune'}
        placeholder={''}
        values={communes}
        initialValue={data.to_commune_id}
        handleOnValueChange={(value) => {
          setData('to_commune_id', value)
          setData('to_commune_name', communes.find(c => c.id === value).name);
        }}
        error={errors.to_commune_id}
        disabled={data.to_wilaya_name === ''}
      />
      {data.is_stopdesk ? (
        <SelectDropdownComponent
          label={'Select Center'}
          placeholder={''}
          values={centers}
          initialValue={data.to_center_id}
          handleOnValueChange={(value) => {
            setData('to_center_id', value);
            setData('to_center_name', centers.find(c => c.id === value).name);
          }}
          error={errors.to_center_id}
          disabled={data.to_commune_name === ''}
        />
      ) : (
        <>
          <InputComponent
            label={'Address'}
            placeholder={''}
            value={data.address}
            handleOnChange={(e) => setData('address', e.target.value)}
            error={errors.address}
            disabled={data.to_wilaya_name === ''}
          />
        </>
      )}
    </div>
  );
};