import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    // 测试基本的 KV 连接
    const testKey = 'test_connection'
    const testValue = { timestamp: Date.now(), test: true }

    // 写入测试
    await kv.set(testKey, testValue)

    // 读取测试
    const result = await kv.get(testKey)

    // 清理测试数据
    await kv.del(testKey)

    return NextResponse.json({
      success: true,
      message: 'Vercel KV 连接正常',
      testResult: result,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN
      }
    })
  } catch (error) {
    console.error('Vercel KV connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN
      }
    }, { status: 500 })
  }
}