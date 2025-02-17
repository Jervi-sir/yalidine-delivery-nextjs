import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/prisma/prisma';

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    // Basic validation
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: 'Invalid parcel ID' }, { status: 400 });
    }

    // Update the parcel in the database
    const updatedParcel = await prisma.parcel.update({
      where: { id: Number(id) },
      data: {
        // Map the fields from the request data to the parcel fields
        firstname: data.firstName,
        familyname: data.familyName,
        contact_phone: data.contactPhone,
        from_wilaya_id: data.from_wilaya_id,
        from_wilaya_name: data.from_wilaya_name,
        to_wilaya_id: data.to_wilaya_id,
        to_wilaya_name: data.to_wilaya_name,
        to_commune_id: data.to_commune_id,
        to_commune_name: data.to_commune_name,
        to_center_id: data.to_center_id,
        to_center_name: data.to_center_name,
        address: data.address,
        is_stopdesk: data.is_stopdesk,
        do_insurance: data.do_insurance,
        declared_value: data.declared_value,
        freeshipping: data.freeshipping,
        product_list: data.product_list,
        price: data.price,
        height: data.height,
        width: data.width,
        length: data.length,
        weight: data.weight,
        // Add other fields as needed
      },
    });

    return NextResponse.json(updatedParcel, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update parcel', error: error.message }, { status: 500 });
  }
}
