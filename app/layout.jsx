"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "./globals.css";

const NAV_LINKS = [
  { href: "/", label: "选题分析" },
  { href: "/creation", label: "内容创作" },
  { href: "/publishing", label: "发布管理" },
  { href: "/history", label: "选题历史" },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="zh-CN">
      <body className="bg-[var(--background)] text-[var(--text)]">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside className="w-full border-b border-[var(--border)] bg-[var(--surface)] px-5 py-6 lg:flex lg:min-h-screen lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  内容工厂 · Agent
                </p>
                <h1 className="mt-2 text-xl font-semibold text-slate-900">
                  选题洞察 · AI 创作
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  数据驱动选题、创作、分发流水线。强调信息干净与操作高效。
                </p>
              </div>

              <nav className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-pill ${isActive ? "nav-pill-active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="rounded-lg border border-[var(--border)] p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">系统状态</p>
                <p className="mt-2">洞察模型：Gala-Insight v2.1</p>
                <p>内容生成：OpenAI + 内部模版</p>
                <p>渠道：公众号 / 视频号</p>
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-400">
              <p>版本：Alpha v0.3</p>
              <p>下一步：知识库对接 · 成效回传</p>
            </div>
          </aside>

          <main className="flex-1 px-3 py-5 sm:px-4 lg:px-6 lg:py-8 xl:px-8">
            <div className="flex w-full flex-col gap-5 lg:gap-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
