"use client";

import { useCallback, useMemo, useState } from "react";
import { frequentWords, topicInsights } from "../lib/mockData";
import { searchWechatArticles } from "../lib/wechatMonitor";
const tabs = [
  { id: "keyword", label: "关键词洞察" },
  { id: "accounts", label: "公众号榜单" },
];

const readingBuckets = [
  { label: "0-1k", value: 4 },
  { label: "1k-5k", value: 18 },
  { label: "5k-10k", value: 6 },
  { label: "10k+", value: 2 },
];

const publishBuckets = [
  { label: "08:00-10:00", value: 12 },
  { label: "10:00-12:00", value: 11 },
  { label: "14:00-16:00", value: 7 },
  { label: "18:00-20:00", value: 5 },
  { label: "20:00-22:00", value: 3 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("keyword");
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastFetchedKeyword, setLastFetchedKeyword] = useState("");
  const [autoSave, setAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedInfo, setLastSavedInfo] = useState(null);

  const persistSnapshot = useCallback(
    async (kw, items) => {
      if (!autoSave || !items.length) {
        return;
      }

      try {
        setIsSaving(true);
        const response = await fetch("/api/queries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: kw, articles: items }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || "保存失败");
        }

        setLastSavedInfo({
          keyword: kw,
          time: new Date().toISOString(),
        });
      } catch (error) {
        console.error("persist query failed", error);
      } finally {
        setIsSaving(false);
      }
    },
    [autoSave]
  );

  const fetchArticlesByKeyword = useCallback(async (kw) => {
    const trimmedKeyword = kw?.trim();

    if (!trimmedKeyword) {
      setErrorMessage("请输入关键词");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { articles: normalizedArticles } = await searchWechatArticles({
        keyword: trimmedKeyword,
      });

      if (!normalizedArticles.length) {
        setErrorMessage("没有找到相关的公众号文章");
      }

      setArticles(normalizedArticles.length ? normalizedArticles : []);
      setLastFetchedKeyword(trimmedKeyword);
      persistSnapshot(trimmedKeyword, normalizedArticles);
    } catch (error) {
      console.error("kw_search error", error);
      setErrorMessage(error?.message || "获取公众号文章失败");
    } finally {
      setIsLoading(false);
    }
  }, [persistSnapshot]);

  const handleSearch = () => fetchArticlesByKeyword(keyword);
  const isSearchDisabled = !keyword.trim() || isLoading;

  const topLiked = useMemo(() => {
    if (!articles.length) {
      return [];
    }
    return [...articles].sort((a, b) => b.likes - a.likes).slice(0, 5);
  }, [articles]);
  const topEngagement = useMemo(() => {
    if (!articles.length) {
      return [];
    }
    return [...articles].sort((a, b) => b.engagement - a.engagement).slice(0, 5);
  }, [articles]);

  const totals = useMemo(() => {
    const sampleCount = articles.length;

    if (!sampleCount) {
      return {
        sampleCount: 0,
        avgRead: 0,
        avgLikes: 0,
        engagementRate: 0,
      };
    }

    const totalRead = articles.reduce((sum, item) => sum + (item.read || 0), 0);
    const totalLikes = articles.reduce((sum, item) => sum + (item.likes || 0), 0);
    const avgEngagement =
      articles.reduce((sum, item) => sum + (item.engagement || 0), 0) / sampleCount;

    return {
      sampleCount,
      avgRead: Math.round(totalRead / sampleCount),
      avgLikes: Math.round(totalLikes / sampleCount),
      engagementRate: avgEngagement,
    };
  }, [articles]);

  const hasArticles = articles.length > 0;

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="surface-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">选题分析</h1>
            <p className="text-sm text-slate-500">
              输入关键字，AI 分析公众号文章，生成洞察与推荐报告。
            </p>
          </div>
          <button className="btn-secondary text-xs">历史记录</button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-3 py-1 font-medium transition ${
                activeTab === tab.id
                  ? "border-black bg-black text-white"
                  : "border-[var(--border)] text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入关键词，例如：人民日报"
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearchDisabled}
              className={["btn-primary", isSearchDisabled ? "cursor-not-allowed opacity-60" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {isLoading ? "获取中..." : "开始分析"}
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(event) => setAutoSave(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              自动保存到数据库
            </label>
          </div>
        </div>
        <div className="min-h-[1.25rem] text-xs text-slate-500">
          {errorMessage ? (
            <span className="text-red-500">{errorMessage}</span>
          ) : lastFetchedKeyword ? (
            <span>
              已加载「{lastFetchedKeyword}」的 {articles.length} 篇文章
            </span>
          ) : null}
          {autoSave && (
            <span className="ml-3 text-slate-400">
              {isSaving
                ? "正在保存…"
                : lastSavedInfo
                ? `已保存「${lastSavedInfo.keyword}」`
                : "保存就绪"}
            </span>
          )}
        </div>
      </section>
      {hasArticles && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="分析文章数" value={totals.sampleCount.toString()} icon="📚" />
            <StatCard label="平均阅读量" value={totals.avgRead.toLocaleString()} icon="👀" />
            <StatCard label="平均点赞数" value={totals.avgLikes.toLocaleString()} icon="❤️" />
            <StatCard
              label="平均互动率"
              value={`${(totals.engagementRate * 100).toFixed(1)}%`}
              icon="💬"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.7fr,1fr]">
            <div className="surface-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">点赞量 TOP5</h2>
                <span className="text-xs text-slate-400">来源：公众号文章 API</span>
              </div>
              <ol className="space-y-2 text-sm">
                {topLiked.map((article, index) => {
                  const fullTitle = article.title || "未命名文章";
                  const displayTitle = truncateText(fullTitle, 50);
                  const articleHref = article.url || article.shortLink || "#";

                  return (
                    <li
                      key={article.id}
                      className="rounded-lg border border-[var(--border)] px-3 py-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-base font-semibold text-slate-400">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            <a
                              href={articleHref}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-blue-600 hover:underline"
                              title={fullTitle}
                            >
                              {displayTitle}
                            </a>
                          </p>
                          <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>阅读 {article.read.toLocaleString()}</span>
                            <span>点赞 {article.likes.toLocaleString()}</span>
                            <span>互动率 {(article.engagement * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="surface-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">互动率 TOP5</h2>
                <span className="text-xs text-slate-400">实时刷新</span>
              </div>
              <ol className="space-y-2 text-sm">
                {topEngagement.map((article, index) => {
                  const fullTitle = article.title || "未命名文章";
                  const displayTitle = truncateText(fullTitle, 50);
                  const articleHref = article.url || article.shortLink || "#";

                  return (
                    <li
                      key={article.id}
                      className="rounded-lg border border-[var(--border)] px-3 py-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-base font-semibold text-violet-500">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            <a
                              href={articleHref}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-violet-600 hover:underline"
                              title={fullTitle}
                            >
                              {displayTitle}
                            </a>
                          </p>
                          <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>阅读 {article.read.toLocaleString()}</span>
                            <span>互动率 {(article.engagement * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
            <div className="surface-card p-4 space-y-3">
              <h2 className="text-base font-semibold text-slate-800">高频词云</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {frequentWords.map((item) => (
                  <span
                    key={item.word}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-slate-600"
                  >
                    {item.word}
                    <span className="ml-1 text-xs text-slate-400">{item.weight}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="surface-card p-4 space-y-4">
              <h2 className="text-base font-semibold text-slate-800">阅读量 & 时间分布</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <ChartCard title="阅读量分布">
                  <div className="space-y-2">
                    {readingBuckets.map((bucket) => (
                      <Bar key={bucket.label} label={bucket.label} value={bucket.value} max={20} />
                    ))}
                  </div>
                </ChartCard>
                <ChartCard title="发布时间分布">
                  <div className="space-y-2">
                    {publishBuckets.map((bucket) => (
                      <Bar key={bucket.label} label={bucket.label} value={bucket.value} max={12} />
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          </section>

          <section className="surface-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">选题洞察</h2>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-slate-500">
                AI �Ƽ�
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {topicInsights.map((insight, index) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs text-indigo-500">
                    <span className="font-semibold">#{index + 1}</span>
                    <span>互动率 ?? {insight.channel}</span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{insight.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{insight.angle}</p>
                  <p className="mt-1 text-xs text-slate-500">�Ƽ����ɣ�{insight.recommendation}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="surface-card p-4 flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Bar({ label, value, max }) {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function truncateText(value, maxLength = 50) {
  if (typeof value !== "string") {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}
