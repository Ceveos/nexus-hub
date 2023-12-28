import { NextResponse } from "next/server";


export async function POST(request: Request) {
  console.log("POST - USER AUTH");
  const data = await request.formData();
  data.forEach((value, key) => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    console.log(`${key}: ${value}`);
  })
  return NextResponse.json({}, {
    status: 403
  });
}
