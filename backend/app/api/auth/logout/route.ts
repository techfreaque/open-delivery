import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(): Promise<
  NextResponse<{
    success: boolean;
  }>
> {
  // Delete the token cookie
  const _cookies = await cookies();
  _cookies.delete("token");

  return NextResponse.json({ success: true });
}
