import { NextResponse } from 'next/server'

export async function GET() {
  // 获取所有相关的环境变量
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,

    // Redis/KV 相关环境变量
    KV_REST_API_URL: process.env.KV_REST_API_URL || '未设置',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN || '未设置',
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN || '未设置',
    KV_URL: process.env.KV_URL || '未设置',
    REDIS_URL: process.env.REDIS_URL || '未设置',

    // Vercel 自动设置的环境变量
    VERCEL: process.env.VERCEL || '未设置',
    VERCEL_ENV: process.env.VERCEL_ENV || '未设置',
    VERCEL_URL: process.env.VERCEL_URL || '未设置',

    // 显示所有以 KV_ 开头的环境变量
    kvEnvironmentVariables: Object.keys(process.env)
      .filter(key => key.startsWith('KV_'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? '已设置' : '未设置'
        return acc
      }, {} as Record<string, string>)
  }

  // 构建实际使用的 Redis URL
  function buildRedisUrl(baseUrl: string): string {
    if (baseUrl.includes('/v1/request')) {
      return baseUrl
    }
    return `${baseUrl.replace(/\/$/, '')}/v1/request`
  }

  // 提供详细的令牌信息（安全地显示前缀）
  const tokenInfo = {
    KV_REST_API_TOKEN_LENGTH: process.env.KV_REST_API_TOKEN?.length || 0,
    KV_REST_API_TOKEN_PREFIX: process.env.KV_REST_API_TOKEN?.substring(0, 20) || '未设置',
    KV_REST_API_URL_RAW: process.env.KV_REST_API_URL || '未设置',
    KV_REST_API_URL_PROCESSED: process.env.KV_REST_API_URL ? buildRedisUrl(process.env.KV_REST_API_URL) : '未设置'
  }

  return NextResponse.json({
    message: '环境变量调试信息',
    environment: envVars,
    tokenDetails: tokenInfo,
    allKvKeys: Object.keys(process.env).filter(key =>
      key.toLowerCase().includes('kv') ||
      key.toLowerCase().includes('redis') ||
      key.toLowerCase().includes('upstash')
    ),
    timestamp: new Date().toISOString()
  })
}