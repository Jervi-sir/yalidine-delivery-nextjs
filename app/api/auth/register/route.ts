import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, repeatPassword } = await request.json();

    if (password !== repeatPassword) {
      return NextResponse.json({ message: 'passwords do not match' }, { status: 403 });
    }

    console.log({ name, email, password });

    const hashedPassword = await hash(password, 10);

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        password_text: password, // Consider removing this in production
      },
    });

    console.log('User created successfully:', data);
    return NextResponse.json({ message: 'success', data }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: 'error', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
