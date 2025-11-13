import Link from "next/link";
import { notFound } from "next/navigation";
import { getKeywordQueryById } from "../../../lib/queryStorage";

export const dynamic = "force-dynamic";

export default function KeywordHistoryDetail({ params }) {
  const record = getKeywordQueryById(Number(params.id));

  if (!record) {
    notFound();
  }

  const articles = record.snapshot?.articles ?? [];

  return (
    <div className="space-y-5">
      <section className="surface-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              历史快照
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              关键词：「{record.keyword}」
            </h1>
            <p className="text-sm text-slate-500">
              保存时间：{formatDate(record.createdAt)} · 样本 {record.totalArticles} 篇
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/history" className="btn-secondary text-xs">
              返回列表
            </Link>
            <Link href="/?keywordReload=true" className="btn-primary text-xs">
              跳转选题分析
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="样本数" value={record.totalArticles.toString()} />
          <MetricCard label="阅读总量" value={record.totalRead.toLocaleString()} />
          <MetricCard label="点赞总量" value={record.totalLikes.toLocaleString()} />
          <MetricCard
            label="平均互动率"
            value={`${(record.avgEngagement * 100).toFixed(1)}%`}
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-800">文章快照</h2>
          <div className="mt-3 overflow-x-auto border border-[var(--border)] rounded-xl">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-2 font-medium">标题</th>
                  <th className="px-3 py-2 font-medium">阅读</th>
                  <th className="px-3 py-2 font-medium">点赞</th>
                  <th className="px-3 py-2 font-medium">在看</th>
                  <th className="px-3 py-2 font-medium">互动率</th>
                  <th className="px-3 py-2 font-medium">公众号</th>
                  <th className="px-3 py-2 font-medium">发布时间</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-slate-400"
                    >
                      本快照没有文章数据
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => {
                    const originalTitle = article.title || "未命名文章";
                    const displayTitle = truncateText(originalTitle);
                    
                    return (
                      <tr
                        key={article.id}
                        className="border-t border-[var(--border)] text-slate-700"
                      >
                        <td className="px-3 py-3 font-medium text-slate-900">
                          <a
                            href={article.url || article.shortLink || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600"
                            title={originalTitle}
                          >
                            {displayTitle}
                          </a>
                        </td>
                        <td className="px-3 py-3">{Number(article.read || 0).toLocaleString()}</td>
                        <td className="px-3 py-3">
                          {Number(article.likes || article.praise || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          {Number(article.looking || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          {((article.engagement || 0) * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-500">{article.wxName}</td>
                        <td className="px-3 py-3 text-xs text-slate-500">
                          {formatDate(
                            article.publishTimeStr ||
                              article.publish_time_str ||
                              article.publishTime ||
                              article.publish_time
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString("zh-CN", { hour12: false });
  }
  return value;
}

function truncateText(value, maxLength = 100) {
  if (typeof value !== "string") {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}
