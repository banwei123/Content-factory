import { NextResponse } from "next/server";
import { getKeywordQueryById } from "../../../../lib/queryStorage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const record = getKeywordQueryById(Number(id));
    if (!record) {
      return NextResponse.json(
        { success: false, message: "记录不存在" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("get keyword query failed", error);
    return NextResponse.json(
      { success: false, message: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
