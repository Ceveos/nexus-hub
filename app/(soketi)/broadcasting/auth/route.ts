import { NextResponse } from "next/server";


export async function POST(request: Request) {
  console.log("POST");
  const data = await request.formData();
  data.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  })
  return NextResponse.json({}, {
    status: 403
  });
}
