import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const address = process.env.MASTER_WALLET_ADDRESS
    return NextResponse.json({ address: address }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
