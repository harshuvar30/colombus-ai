import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import Replicate from "replicate"
const replicate = new Replicate({
  auth:process.env.REPLICATE_API_TOKEN
})

// const instructionMessage: ChatCompletionMessageParam = {
//   role: "system",
//   content: "Answer questions as short and quickly as possible. You must do it under 75 tokens."
// }

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt} = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired.", {status:403})
    }


    const input = {
      fps: 30,
      width: 1024,
      height: 576,
      prompt: prompt,
      guidance_scale: 17.5
  };
 
  const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input });
    if(!isPro)
    await increaseApiLimit();
    return NextResponse.json(response);
  } catch (error) {
    console.log('[VIDEO_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};