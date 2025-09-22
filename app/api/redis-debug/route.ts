import { NextResponse } from 'next/server'

export async function GET() {
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN

  // 构建正确的 URL
  function buildRedisUrl(baseUrl: string): string {
    if (baseUrl.includes('/v1/request')) {
      return baseUrl
    }
    return `${baseUrl.replace(/\/$/, '')}/v1/request`
  }

  const processedUrl = kvUrl ? buildRedisUrl(kvUrl) : '未设置'

  // 尝试直接 HTTP 请求测试连接
  let httpTestResult = null
  let httpError = null

  if (kvUrl && kvToken) {
    try {
      // 构造一个简单的 Redis PING 命令
      const testCommand = ['ping']

      const response = await fetch(processedUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCommand)
      })

      const responseText = await response.text()

      httpTestResult = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        ok: response.ok
      }
    } catch (error) {
      httpError = error instanceof Error ? error.message : '未知错误'
    }
  }

  return NextResponse.json({
    message: 'Redis 连接详细调试信息',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasKvUrl: !!kvUrl,
      hasKvToken: !!kvToken,
    },
    urlInfo: {
      rawUrl: kvUrl || '未设置',
      processedUrl: processedUrl,
      urlLength: kvUrl?.length || 0,
      hasV1Request: kvUrl?.includes('/v1/request') || false
    },
    tokenInfo: {
      tokenLength: kvToken?.length || 0,
      tokenPrefix: kvToken?.substring(0, 20) || '未设置',
      tokenSuffix: kvToken?.substring(kvToken.length - 10) || '未设置',
      tokenFormat: kvToken?.startsWith('ARjr') ? 'Upstash格式' : '未知格式'
    },
    httpTest: {
      result: httpTestResult,
      error: httpError,
      testUrl: processedUrl
    },
    timestamp: new Date().toISOString()
  })
}