"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { creationTopics, unsplashMock } from "../../lib/mockData";

const toneOptions = ["硬核拆解", "实操指南", "案例复盘", "采访感"];

export default function CreationPage() {
  const [selectedTopicId, setSelectedTopicId] = useState(creationTopics[0].id);
  const [selectedImages, setSelectedImages] = useState([unsplashMock[0].id]);
  const [draftValue, setDraftValue] = useState(
    "## 三段式职场提效流程\n\n1. 识别高频任务 + AI 建模\n2. 套用提示词模板批量生成\n3. 结合业务语境进行微调\n\n> AI 将在这里继续补全正文"
  );

  const selectedTopic = useMemo(
    () => creationTopics.find((topic) => topic.id === selectedTopicId),
    [selectedTopicId]
  );

  const toggleImage = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="surface-card p-5 lg:p-6">
        <p className="section-heading">创作流程</p>
        <h1 className="mt-2 text-2xl">内容创作 · 一键成稿</h1>
        <p className="mt-2 text-sm text-slate-500">
          选题、语气、素材一步配置，生成草稿后可直接同步到发布管理。
        </p>
      </section>

      <section className="grid gap-5 lg:gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="surface-card p-4 space-y-3">
          <div>
            <p className="section-heading">候选选题</p>
            <p className="mt-1 text-sm text-slate-500">来自洞察面板</p>
          </div>
          <div className="space-y-2">
            {creationTopics.map((topic) => {
              const isActive = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? "border-black text-slate-900"
                      : "border-[var(--border)] text-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{topic.title}</p>
                      <p className="text-xs text-slate-500">{topic.angle}</p>
                    </div>
                    <StatusBadge status={topic.status} />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5 lg:space-y-6">
          <div className="surface-card p-4 lg:p-5 space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-heading">Step 1</p>
                <h2 className="text-lg">选题设定</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                自动同步洞察信息
              </span>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <InputBlock label="标题">
                <input
                  type="text"
                  value={selectedTopic.title}
                  readOnly
                  className="rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm"
                />
              </InputBlock>
              <InputBlock label="目标受众">
                <input
                  type="text"
                  defaultValue="To B 运营负责人 / 职场人"
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                />
              </InputBlock>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputBlock label="内容结构">
                <textarea
                  rows={4}
                  defaultValue={"1. 选题引入\n2. 用户痛点数据\n3. AI 解决方案\n4. 案例拆解\n5. 行动清单"}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                />
              </InputBlock>
              <InputBlock label="语气风格">
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-slate-600"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </InputBlock>
            </div>
          </div>

          <div className="surface-card p-4 lg:p-5 space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <p className="section-heading">Step 2</p>
                <h2 className="text-lg">AI 草稿</h2>
              </div>
              <StatusBadge status="正在生成" />
            </header>
            <textarea
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
              rows={14}
              className="w-full rounded-lg border border-[var(--border)] bg-slate-50 px-4 py-4 font-mono text-sm"
            />
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500">
              <p>预计 23 秒生成完毕 · 支持 Markdown</p>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs">重新生成</button>
                <button className="btn-primary text-xs">继续写完</button>
              </div>
            </div>
          </div>

          <div className="surface-card p-4 lg:p-5 space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <p className="section-heading">Step 3</p>
                <h2 className="text-lg">素材图库（Unsplash）</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                已选 {selectedImages.length} 张
              </span>
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              {unsplashMock.map((image) => {
                const isActive = selectedImages.includes(image.id);
                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => toggleImage(image.id)}
                    className={`relative h-48 overflow-hidden rounded-lg border transition ${
                      isActive ? "border-black" : "border-[var(--border)]"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.description}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-left text-xs text-white">
                      {image.description}
                    </div>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="搜索更多素材，如：live streaming"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            />
          </div>

          <div className="rounded-lg border border-dashed border-[var(--border)] px-4 py-4 text-sm text-slate-600">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>保存后可在发布管理页统一查看并推送渠道。</p>
              <div className="flex gap-2">
                <button className="btn-secondary">保存草稿</button>
                <button className="btn-primary">保存并进入发布管理</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InputBlock({ label, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
