import { Redis } from '@upstash/redis'

// 创建 Redis 客户端实例
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// 导出类型，方便其他文件使用
export type RedisClient = typeof redis