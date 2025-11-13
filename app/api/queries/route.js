import { NextResponse } from "next/server";
import {
  listKeywordQueries,
  saveKeywordQuerySnapshot,
} from "../../../lib/queryStorage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { keyword, articles } = body || {};

    if (!keyword || !Array.isArray(articles)) {
      return NextResponse.json(
        { success: false, message: "缺少关键词或文章数据" },
        { status: 400 }
      );
    }

    const record = saveKeywordQuerySnapshot({ keyword, articles });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("save keyword query failed", error);
    return NextResponse.json(
      { success: false, message: error.message || "保存失败" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const data = listKeywordQueries({ page, pageSize });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("list keyword queries failed", error);
    return NextResponse.json(
      { success: false, message: error.message || "查询失败" },
      { status: 500 }
    );
  }
}
