const STATUS_STYLES = {
  草稿: "border-slate-200 bg-slate-50 text-slate-600",
  待审核: "border-amber-200 bg-amber-50 text-amber-700",
  正在生成: "border-slate-300 bg-slate-100 text-slate-700",
  已发布: "border-emerald-200 bg-emerald-50 text-emerald-700",
  失败: "border-rose-200 bg-rose-50 text-rose-700",
  待创作: "border-slate-200 bg-slate-50 text-slate-500",
  成功: "border-emerald-200 bg-emerald-50 text-emerald-700",
  未发布: "border-slate-200 bg-slate-50 text-slate-500",
};

export default function StatusBadge({ status = "草稿" }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["草稿"];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}
