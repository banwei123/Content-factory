import db from "./db";

const INSERT_QUERY = db.prepare(`
  INSERT INTO keyword_queries (
    keyword,
    total_articles,
    total_read,
    total_likes,
    avg_engagement,
    articles_json
  )
  VALUES (
    @keyword,
    @total_articles,
    @total_read,
    @total_likes,
    @avg_engagement,
    @articles_json
  )
`);

const SELECT_PAGED = db.prepare(`
  SELECT
    id,
    keyword,
    total_articles AS totalArticles,
    total_read AS totalRead,
    total_likes AS totalLikes,
    avg_engagement AS avgEngagement,
    created_at AS createdAt
  FROM keyword_queries
  ORDER BY datetime(created_at) DESC, id DESC
  LIMIT @limit OFFSET @offset
`);

const COUNT_QUERY = db.prepare(`SELECT COUNT(1) as count FROM keyword_queries`);

const SELECT_ONE = db.prepare(`
  SELECT
    id,
    keyword,
    total_articles AS totalArticles,
    total_read AS totalRead,
    total_likes AS totalLikes,
    avg_engagement AS avgEngagement,
    articles_json AS articlesJson,
    created_at AS createdAt
  FROM keyword_queries
  WHERE id = @id
`);

export function saveKeywordQuerySnapshot({ keyword, articles }) {
  if (!keyword?.trim()) {
    throw new Error("关键词不能为空");
  }

  if (!Array.isArray(articles)) {
    throw new Error("文章数据格式不正确");
  }

  const metrics = computeMetrics(articles);

  const payload = {
    keyword: keyword.trim(),
    total_articles: metrics.sampleCount,
    total_read: metrics.totalRead,
    total_likes: metrics.totalLikes,
    avg_engagement: metrics.engagementRate,
    articles_json: JSON.stringify({
      snapshotAt: new Date().toISOString(),
      articles,
    }),
  };

  const result = INSERT_QUERY.run(payload);
  return getKeywordQueryById(result.lastInsertRowid);
}

export function getKeywordQueryById(id) {
  const row = SELECT_ONE.get({ id });
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    keyword: row.keyword,
    totalArticles: row.totalArticles,
    totalRead: row.totalRead,
    totalLikes: row.totalLikes,
    avgEngagement: row.avgEngagement,
    createdAt: row.createdAt,
    snapshot: parseArticlesJson(row.articlesJson),
  };
}

export function listKeywordQueries({ page = 1, pageSize = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(50, Math.max(5, Number(pageSize) || 10));
  const offset = (safePage - 1) * safePageSize;

  const rows = SELECT_PAGED.all({
    limit: safePageSize,
    offset,
  });
  const total = COUNT_QUERY.get().count;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));

  return {
    items: rows.map((row) => ({
      ...row,
      createdAt: row.createdAt,
    })),
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages,
    },
  };
}

function computeMetrics(articles) {
  const sampleCount = articles.length;
  const totalRead = articles.reduce((sum, item) => sum + (Number(item.read) || 0), 0);
  const totalLikes = articles.reduce(
    (sum, item) => sum + (Number(item.likes) || Number(item.praise) || 0),
    0
  );
  const engagementRate =
    sampleCount > 0
      ? Number(
          (
            articles.reduce((sum, item) => sum + (Number(item.engagement) || 0), 0) /
            sampleCount
          ).toFixed(4)
        )
      : 0;

  return { sampleCount, totalRead, totalLikes, engagementRate };
}

function parseArticlesJson(payload) {
  try {
    const parsed = JSON.parse(payload);
    return {
      snapshotAt: parsed.snapshotAt,
      articles: Array.isArray(parsed.articles) ? parsed.articles : [],
    };
  } catch (error) {
    return { snapshotAt: null, articles: [] };
  }
}
