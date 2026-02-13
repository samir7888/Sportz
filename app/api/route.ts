import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // You can handle logic here, like connecting to a database
    const data = { message: 'Hello from the API!' };
    return NextResponse.json(data);
}


