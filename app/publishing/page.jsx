"use client";

import { useMemo, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { managedArticles } from "../../lib/mockData";

const statusFilters = ["全部", "草稿", "待审核", "已发布"];
const channelFilters = ["全部", "小红书", "公众号"];

export default function PublishingPage() {
  const [status, setStatus] = useState("全部");
  const [channel, setChannel] = useState("全部");
  const [selectedId, setSelectedId] = useState(managedArticles[0].id);

  const filteredArticles = useMemo(() => {
    return managedArticles.filter((article) => {
      const statusOk = status === "全部" || article.status === status;
      const channelOk = channel === "全部" || article.channels.includes(channel);
      return statusOk && channelOk;
    });
  }, [status, channel]);

  const selectedArticle =
    managedArticles.find((article) => article.id === selectedId) || filteredArticles[0];

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="surface-card p-5 lg:p-6">
        <p className="section-heading">发布管理</p>
        <h1 className="mt-2 text-2xl">渠道联动 · 发布驾驶舱</h1>
        <p className="mt-2 text-sm text-slate-500">
          统一管理 AI 生成文章的审核状态、渠道推送与日志记录。
        </p>
      </section>

      <section className="surface-card p-5 lg:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">筛选与批量操作</p>
            <p className="text-xs text-slate-500">快速定位可发布内容</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">批量发至小红书</button>
            <button className="btn-primary">批量发至公众号</button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <FilterGroup label="状态" value={status} options={statusFilters} onChange={setStatus} />
          <FilterGroup label="渠道" value={channel} options={channelFilters} onChange={setChannel} />
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-600">搜索</span>
            <input
              placeholder="输入标题或选题关键词"
              className="rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="surface-card p-0">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <div>
              <p className="section-heading">文章列表</p>
              <h2 className="text-lg">AI 生成 + 人工编辑</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              {filteredArticles.length} 篇
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-6 py-3 font-medium">标题</th>
                  <th className="px-4 py-3 font-medium">选题</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">渠道</th>
                  <th className="px-4 py-3 font-medium">创建时间</th>
                  <th className="px-6 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    onClick={() => setSelectedId(article.id)}
                    className={`border-t border-[var(--border)] text-slate-600 hover:bg-slate-50 ${
                      selectedId === article.id ? "bg-slate-50" : ""
                    }`}
                  >
                    <td className="px-6 py-3">
                      <p className="font-semibold text-slate-900">{article.title}</p>
                      <p className="text-xs text-slate-400">最近更新 · {article.lastUpdated}</p>
                    </td>
                    <td className="px-4 py-3">{article.topic}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {article.channels.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-[var(--border)] px-2 py-1 text-xs"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{article.createdAt}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-2 text-xs">
                        <button className="btn-secondary text-xs">编辑</button>
                        <button className="btn-secondary text-xs">推送小红书</button>
                        <button className="btn-secondary text-xs">推送公众号</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card p-5 lg:p-6">
          {selectedArticle ? (
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-heading">文章详情</p>
                  <h3 className="mt-2 text-xl text-slate-900">{selectedArticle.title}</h3>
                </div>
                <StatusBadge status={selectedArticle.status} />
              </div>

              <p>{selectedArticle.contentPreview}</p>

              <div className="rounded-lg border border-[var(--border)] p-4">
                <p className="text-sm font-semibold text-slate-700">操作区</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-secondary">预览链接</button>
                  <button className="btn-primary">发布到小红书</button>
                  <button className="btn-secondary">发布到公众号</button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">状态流</p>
                <div className="mt-3 space-y-2">
                  {selectedArticle.history.map((item) => (
                    <div
                      key={item.time}
                      className="rounded-lg border border-[var(--border)] px-3 py-2"
                    >
                      <p className="font-medium text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">发布记录</p>
                <div className="mt-3 space-y-2">
                  {selectedArticle.logs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-[var(--border)] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <strong>{log.channel}</strong>
                        <StatusBadge status={log.status} />
                      </div>
                      <p className="mt-1 text-slate-600">{log.detail}</p>
                      <p className="text-xs text-slate-500">{log.time || "待执行"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">请选择左侧文章查看详情</p>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isActive ? "border-black text-black" : "border-[var(--border)] text-slate-500"
              }`}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
