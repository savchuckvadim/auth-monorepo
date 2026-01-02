import { NextResponse } from "next/server";

export async function GET(request: Request) {
    console.log('GET logs');
    console.log(request);
    return NextResponse.json({ message: 'looged' }, { status: 200 });
}

export async function POST(request: Request) {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ message: 'logged' }, { status: 200 });
}
