import Link from "next/link";
import { listKeywordQueries } from "../../lib/queryStorage";

const DEFAULT_PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

export default async function HistoryPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || DEFAULT_PAGE_SIZE;
  const { items, pagination } = listKeywordQueries({ page, pageSize });

  return (
    <div className="space-y-5">
      <section className="surface-card p-4 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">关键词历史</h1>
            <p className="text-sm text-slate-500">
              查看已保存的关键词检索与选题快照，支持分页和详情复盘。
            </p>
          </div>
          <Link href="/" className="btn-secondary text-xs">
            返回选题分析
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">关键词</th>
                <th className="px-3 py-2 font-medium">样本数</th>
                <th className="px-3 py-2 font-medium">阅读总量</th>
                <th className="px-3 py-2 font-medium">点赞总量</th>
                <th className="px-3 py-2 font-medium">平均互动</th>
                <th className="px-3 py-2 font-medium">保存时间</th>
                <th className="px-3 py-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-slate-400"
                  >
                    暂无数据，回到选题分析执行首次查询即可生成记录。
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--border)] text-slate-700"
                  >
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {item.keyword}
                    </td>
                    <td className="px-3 py-3">{item.totalArticles}</td>
                    <td className="px-3 py-3">{item.totalRead.toLocaleString()}</td>
                    <td className="px-3 py-3">{item.totalLikes.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      {(item.avgEngagement * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/history/${item.id}`} className="text-blue-600">
                        查看详情
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination {...pagination} />
      </section>
    </div>
  );
}

function Pagination({ page, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
      {pages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={`/history?page=${pageNumber}`}
          className={`rounded-full border px-3 py-1 ${
            pageNumber === page ? "border-black text-black" : "border-[var(--border)]"
          }`}
        >
          第 {pageNumber} 页
        </Link>
      ))}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString("zh-CN", { hour12: false });
    }
    return value;
  } catch (error) {
    return value;
  }
}
