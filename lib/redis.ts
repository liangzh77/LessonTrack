import { Redis } from '@upstash/redis'

// 构建正确的 Upstash Redis REST API URL
function buildRedisUrl(baseUrl: string): string {
  // 如果 URL 已经包含路径，直接返回
  if (baseUrl.includes('/v1/request')) {
    return baseUrl
  }

  // 否则添加正确的路径
  return `${baseUrl.replace(/\/$/, '')}/v1/request`
}

// 创建 Redis 客户端实例
export const redis = new Redis({
  url: buildRedisUrl(process.env.KV_REST_API_URL!),
  token: process.env.KV_REST_API_TOKEN!,
})

// 导出类型，方便其他文件使用
export type RedisClient = typeof redis