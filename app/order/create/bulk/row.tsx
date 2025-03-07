'use client';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectDropdownComponent } from './components/SelectDropdownComponent';
import { InputComponent } from './components/InputComponent';
import { CheckboxComponent } from './components/CheckboxComponent';
import { RadioGroupComponent } from './components/RadioGroupComponent';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from '@/provider/language-provider';
import { useCreateOrder } from './create-order-context';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';

export const ParcelRow = ({ wilayas, errors = {} as any, parcel, index }) => {
  const { parcels, removeParcel } = useCreateOrder(); // Get parcels and setData from context
  const data = parcels[index]; // Use the specific parcel data for this row

  return (
    <TableRow>
      {/* Remove */}
      <TableCell className="p-0 pr-1 pt-1 w-[100px]">
        <Button
          variant="destructive"
          size="icon"
          onClick={() => removeParcel(index)}
          disabled={parcels.length === 1} // Prevent removing the last parcel
        >
          <TrashIcon />
        </Button>
      </TableCell>
      {/* Expéditeur */}
      <SenderSection data={data} index={index} />
      {/* Destinataire */}
      <RecipientSection data={data} index={index} />
      {/* Livraison */}
      <DeliverySection data={data} parcel={parcel} index={index} />
      {/* Le colis */}
      <ParcelSection data={data} index={index} />
      {/* Dimensions & poids */}
      <DimensionSection data={data} index={index} />
    </TableRow>
  );
};

const SenderSection = ({ data, index }) => {
  const doTranslate = useTranslation(translations);
  const { setData, wilayas, errors, defaultSelectedFromWilaya } = useCreateOrder();

  useEffect(() => {
    if (defaultSelectedFromWilaya) {
      setTimeout(() => {
        setData(index, 'from_wilaya_id', parseInt(defaultSelectedFromWilaya))
        setData(index, 'from_wilaya_name', wilayas.find((w) => w.id === defaultSelectedFromWilaya)?.name || undefined)
      }, 300);
    }
  }, [defaultSelectedFromWilaya])

  return (
    <TableCell className="p-0 pr-1 pt-1 w-[120px]">
      <SelectDropdownComponent
        label={doTranslate('Wilaya départ')}
        placeholder={''}
        values={wilayas}
        initialValue={data?.from_wilaya_id}
        error={errors.from_wilaya_id}
        handleOnValueChange={(wilayaId) => {
          setData(index, 'from_wilaya_name', wilayas.find((w) => w.id === wilayaId)?.name || '');
          setData(index, 'from_wilaya_id', wilayaId);
          setTimeout(() => {
            localStorage.setItem('from_wilaya_id', wilayaId);
          }, 200);
        }}
      />
    </TableCell>
  )
}

const RecipientSection = ({ data, index }) => {
  const doTranslate = useTranslation(translations);
  const { setData, wilayas, errors } = useCreateOrder();

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    // Allow only numbers, preserving leading zeros
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setData(index, 'contactPhone', numericValue);
  };

  return (
    <React.Fragment>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <InputComponent
          label={doTranslate('Nom')}
          placeholder={''}
          value={data?.familyName}
          handleOnChange={(e) => setData(index, 'familyName', e.target.value)}
          error={errors.familyName}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <InputComponent
          label={doTranslate('Prénom')}
          placeholder={''}
          value={data?.firstName}
          handleOnChange={(e) => setData(index, 'firstName', e.target.value)}
          error={errors.firstName}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <InputComponent
          label={doTranslate('Téléphone')}
          placeholder={'0XXXXXXXXX'} // Example placeholder
          value={data?.contactPhone || ''} // Ensure controlled input with empty string fallback
          handleOnChange={handlePhoneChange}
          type="text" // Use text instead of number to allow leading zeros
          pattern="[0-9]*" // HTML5 pattern for numbers only
          inputMode="numeric" // Hint for numeric keyboard on mobile
          error={errors.contactPhone}
          required={false}
        />
      </TableCell>
    </React.Fragment>
  );
};

const DeliverySection = ({ data, parcel, index }) => {
  const doTranslate = useTranslation(translations);
  const { setData, wilayas, errors } = useCreateOrder();

  const [communes, setCommunes] = useState([]);
  const [centers, setCenters] = useState([]);

  // Fetch communes based on to_wilaya_id and is_stopdesk
  useEffect(() => {
    if (!data?.to_wilaya_id) {
      if (communes.length > 0) setCommunes([]);
      if (data?.to_commune_id) setData(index, 'to_commune_id', undefined);
      return;
    }

    if (!parcel && data?.to_commune_id) {
      setData(index, 'to_commune_id', undefined);
    }

    axios
      .get('/api/location/communes', {
        params: { wilaya_id: data?.to_wilaya_id, has_stop_desk: data?.is_stopdesk },
      })
      .then((response) => {
        setCommunes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching communes:', error);
      });
  }, [data?.to_wilaya_id, data?.is_stopdesk, parcel, index, communes.length]);

  // Fetch centers based on to_commune_id
  useEffect(() => {
    if (!data?.to_commune_id) {
      if (centers.length > 0) setCenters([]);
      if (data?.to_center_id) setData(index, 'to_center_id', undefined);
      return;
    }

    if (!parcel && data?.to_center_id) {
      setData(index, 'to_center_id', undefined);
    }

    axios
      .get('/api/location/centers', {
        params: { wilaya_id: data?.to_wilaya_id, commune_id: data?.to_commune_id },
      })
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error('Error fetching centers:', error);
      });
  }, [data?.to_wilaya_id, data?.to_commune_id, data?.is_stopdesk, parcel, index, centers.length]);

  const handleDeliveryTypeChange = (value) => {
    console.log(`[${index}] value:`, value); // Debug log
    setData(index, 'is_stopdesk', value);
    setData(index, 'to_commune_id', undefined);
    setData(index, 'to_center_id', undefined);
    setData(index, 'address', '');
    setCommunes([]);
    setCenters([]);
  };

  return (
    <React.Fragment>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <SelectDropdownComponent
          label={doTranslate('Delivery Type')}
          placeholder={''}
          initialValue={data?.is_stopdesk ?? false} // Default to false if undefined/null
          values={[
            { id: false, name: 'Commune' },
            { id: true, name: 'Stopdesk' },
          ]}
          handleOnValueChange={handleDeliveryTypeChange}
          error={errors.is_stopdesk}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <SelectDropdownComponent
          label={doTranslate('To Wilaya')}
          placeholder={''}
          values={wilayas}
          initialValue={data?.to_wilaya_id}
          handleOnValueChange={(value) => {
            console.log(`[${index}] Setting to_wilaya_id to:`, value); // Debug log
            setData(index, 'to_wilaya_id', value);
            setData(index, 'to_wilaya_name', wilayas.find((w) => w.id === value)?.name || '');
            setData(index, 'to_commune_id', undefined);
            setData(index, 'to_center_id', undefined);
            setData(index, 'address', '');
          }}
          error={errors.to_wilaya_id}
          disabled={data?.is_stopdesk === undefined}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <SelectDropdownComponent
          label={doTranslate('Select Commune')}
          placeholder={''}
          values={communes}
          initialValue={data?.to_commune_id}
          handleOnValueChange={(value) => {
            console.log(`[${index}] Setting to_commune_id to:`, value); // Debug log
            setData(index, 'to_commune_id', value);
            setData(index, 'to_commune_name', communes.find((c) => c.id === value)?.name || '');
            setData(index, 'to_center_id', undefined);
            setData(index, 'address', '');
          }}
          error={errors.to_commune_id}
          disabled={!data?.to_wilaya_id}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <SelectDropdownComponent
          label={doTranslate('Select Center')}
          placeholder={''}
          values={centers}
          initialValue={data?.to_center_id}
          handleOnValueChange={(value) => {
            console.log(`[${index}] Setting to_center_id to:`, value); // Debug log
            setData(index, 'to_center_id', value);
            const centerName = centers.find((c) => c.id === value)?.name || '';
            setData(index, 'to_center_name', centerName);
            setData(index, 'address', centerName);
          }}
          error={errors.to_center_id}
          disabled={!data?.to_commune_id}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <InputComponent
          label={doTranslate('Address')}
          placeholder={''}
          value={data?.address}
          handleOnChange={(e) => setData(index, 'address', e.target.value)}
          error={errors.address}
          disabled={!data?.to_wilaya_id}
        />
      </TableCell>
    </React.Fragment>
  );
};

const ParcelSection = ({ data, index }) => {
  const doTranslate = useTranslation(translations);
  const { setData, wilayas, errors } = useCreateOrder();

  return (
    <React.Fragment>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <InputComponent
          label={doTranslate('Product Name')}
          placeholder={''}
          value={data?.product_list}
          handleOnChange={(e) => setData(index, 'product_list', e.target.value)}
          error={errors.product_list}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <InputComponent
          label={doTranslate('Prix')}
          placeholder={''}
          value={data?.price}
          handleOnChange={(e) => setData(index, 'price', e.target.value)}
          type="number"
          minNumber={1}
          error={errors.price}
          required={false}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <CheckboxComponent
          label={''}
          onChange={(checked) => setData(index, 'freeshipping', checked)}
          checked={data?.freeshipping}
          error={null}
        />
      </TableCell>
    </React.Fragment>
  )
}

const DimensionSection = ({ data, index }) => {
  const doTranslate = useTranslation(translations);
  const { setData, wilayas, errors } = useCreateOrder();

  return (
    <React.Fragment>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        <RadioGroupComponent
          initialValue={data?.more_then_5kg}
          values={[
            { id: false, name: doTranslate('Non') },
            { id: true, name: doTranslate('Oui') },
          ]}
          handleOnValueChange={(e) => setData(index, 'more_then_5kg', e)}
        />
      </TableCell>
      <TableCell className="p-0 pr-1 pt-1 w-[120px]">
        {data?.more_then_5kg && (
          <>
            <InputComponent
              label={doTranslate('Longueur en CM')}
              type="number"
              placeholder={''}
              value={data?.order_length}
              handleOnChange={(e) => setData(index, 'order_length', e.target.value)}
              error={errors.order_length}
            />
            <InputComponent
              label={doTranslate('Largeur en CM')}
              type="number"
              placeholder={''}
              value={data?.order_width}
              handleOnChange={(e) => setData(index, 'order_width', e.target.value)}
              error={errors.order_width}
            />
            <InputComponent
              label={doTranslate('Hauteur en CM')}
              type="number"
              placeholder={''}
              value={data?.order_height}
              handleOnChange={(e) => setData(index, 'order_height', e.target.value)}
              error={errors.order_height}
            />
            <InputComponent
              label={doTranslate('Poids en KG')}
              type="number"
              placeholder={''}
              value={data?.order_weight}
              handleOnChange={(e) => setData(index, 'order_weight', e.target.value)}
              error={errors.order_weight}
            />
          </>
        )}
      </TableCell>
    </React.Fragment>
  )
}

const translations = {};