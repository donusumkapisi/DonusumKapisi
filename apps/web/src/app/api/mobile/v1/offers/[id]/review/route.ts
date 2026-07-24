import { NextResponse } from "next/server";
import { createReviewSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { createReview, ReviewNotAllowedError } from "@/lib/reviews";
import { toReviewDTO } from "@/lib/dto";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "HOMEOWNER") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const review = await createReview(id, session.userId, parsed.data);
    return NextResponse.json({ review: toReviewDTO(review, null) }, { status: 201 });
  } catch (error) {
    if (error instanceof ReviewNotAllowedError) {
      return NextResponse.json({ error: "Bu teklifi şu an değerlendiremezsiniz." }, { status: 403 });
    }
    return mobileErrorResponse(error);
  }
}
