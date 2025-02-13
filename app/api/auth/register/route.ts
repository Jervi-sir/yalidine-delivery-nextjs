import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createClient } from '@/database/postgresClient';

export async function POST(request) {
  try {
    const { name, email, password, repeatPassword } = await request.json();
    if(password !== repeatPassword) 
      return NextResponse.json({ message: 'passwords does not match' }, { status: 403 }); // Return a success response with status 201 (Created)
    console.log({ email, password });

    const hashedPassword = await hash(password, 10);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name,
        email, 
        password: hashedPassword,
        password_text: password
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'error', error: error.message }, { status: 500 }); // Return an error response
    }

    console.log('User created successfully:', data);
    return NextResponse.json({ message: 'success', data }, { status: 201 }); // Return a success response with status 201 (Created)

  } catch (e) {
    console.error('Error during user creation:', e);
    return NextResponse.json({ message: 'error', error: e.message }, { status: 500 }); // Return an error response
  }
}
