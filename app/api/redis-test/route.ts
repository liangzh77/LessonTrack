import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET() {
  // 检查环境变量是否存在
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN

  if (!kvUrl || !kvToken) {
    return NextResponse.json({
      success: false,
      error: '缺少必要的环境变量',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasKvUrl: !!kvUrl,
        hasKvToken: !!kvToken,
        kvUrlPrefix: kvUrl?.substring(0, 50) + '...',
        tokenPrefix: kvToken?.substring(0, 15) + '...',
        message: '请在 Vercel 控制台配置 KV_REST_API_URL 和 KV_REST_API_TOKEN'
      }
    }, { status: 500 })
  }

  try {
    // 测试 Redis 连接
    const testKey = 'test_connection'
    const testValue = { timestamp: Date.now(), test: true }

    // 写入测试
    await redis.set(testKey, JSON.stringify(testValue))

    // 读取测试
    const result = await redis.get(testKey)

    // 清理测试数据
    await redis.del(testKey)

    return NextResponse.json({
      success: true,
      message: 'Upstash Redis 连接正常',
      testResult: result ? JSON.parse(result as string) : null,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasKvUrl: !!kvUrl,
        hasKvToken: !!kvToken,
        kvUrlPrefix: kvUrl.substring(0, 50) + '...',
        tokenPrefix: kvToken.substring(0, 15) + '...'
      }
    })
  } catch (error) {
    console.error('Upstash Redis connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasKvUrl: !!kvUrl,
        hasKvToken: !!kvToken,
        kvUrlPrefix: kvUrl.substring(0, 50) + '...',
        tokenPrefix: kvToken.substring(0, 15) + '...',
        suggestion: '请检查 Vercel 控制台中的环境变量配置是否正确'
      }
    }, { status: 500 })
  }
}