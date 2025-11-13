import { API_KEY_NAMES, getApiKey } from "./apiKeys";

const WECHAT_KW_SEARCH_URL =
  "https://www.dajiala.com/fbmain/monitor/v3/kw_search";

/**
 * Calls the 大家啦公众号监控关键词接�?
 * @param {Object} params
 * @param {string} params.keyword
 * @param {number} [params.sortType=1]
 * @param {number} [params.mode=1]
 * @param {number} [params.period=7]
 * @param {number} [params.page=1]
 * @param {number} [params.type=1]
 * @param {string} [params.anyKeyword=""]
 * @param {string} [params.excludedKeyword=""]
 * @returns {Promise<{payload: Object, raw: ApifoxModel, articles: Array}>}
 */
export async function searchWechatArticles({
  keyword,
  sortType = 1,
  mode = 1,
  period = 7,
  page = 1,
  type = 1,
  anyKeyword = "",
  excludedKeyword = "",
} = {}) {
  if (!keyword?.trim()) {
    throw new Error("关键词不能为空");
  }

  const payload = buildKwSearchPayload({
    keyword,
    sortType,
    mode,
    period,
    page,
    type,
    anyKeyword,
    excludedKeyword,
  });

  const response = await fetch(WECHAT_KW_SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await safeParseJSON(response);

  if (!response.ok) {
    throw new Error(body?.msg || "公众号文章接口请求失败");
  }

  if (typeof body?.code === "number" && body.code !== 0) {
    throw new Error(body?.msg || "公众号文章接口返回错误");
  }

  return {
    payload,
    raw: body,
    articles: normalizeWechatArticles(body?.data ?? []),
  };
}

function buildKwSearchPayload({
  keyword,
  sortType,
  mode,
  period,
  page,
  type,
  anyKeyword,
  excludedKeyword,
}) {
  return {
    kw: keyword,
    sort_type: sortType,
    mode,
    period,
    page,
    key: getApiKey(API_KEY_NAMES.WECHAT_MONITOR),
    any_kw: anyKeyword,
    ex_kw: excludedKeyword,
    verifycode: "",
    type,
  };
}

function safeParseJSON(response) {
  return response
    .json()
    .catch(() => ({ msg: "公众号文章接口返回非 JSON" }));
}

/**
 * 将接口返回转换为页面可直接消费的结构.
 * @param {Array<Datum>} data
 */
export function normalizeWechatArticles(data = []) {
  return data.map((item, index) => {
    const read = Number(item?.read) || 0;
    const likes = Number(item?.praise) || 0;
    const looking = Number(item?.looking) || 0;
    const interactions = likes + looking;
    const engagement =
      read > 0 ? Number((interactions / read).toFixed(4)) : 0;

    return {
      id: item?.short_link || item?.url || item?.wx_id || `article-${index}`,
      title: item?.title || "未命名文章",
      read,
      likes,
      looking,
      engagement,
      avatar: item?.avatar,
      classify: item?.classify,
      content: item?.content,
      ghid: item?.ghid,
      ipWording: item?.ip_wording,
      isOriginal: item?.is_original === 1,
      publishTime: item?.publish_time,
      publishTimeStr: item?.publish_time_str,
      updateTime: item?.update_time,
      updateTimeStr: item?.update_time_str,
      shortLink: item?.short_link,
      url: item?.url,
      wxId: item?.wx_id,
      wxName: item?.wx_name,
    };
  });
}


