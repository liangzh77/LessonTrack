import { NextResponse } from 'next/server'

export async function GET() {
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN

  if (!kvUrl || !kvToken) {
    return NextResponse.json({
      success: false,
      error: '缺少环境变量'
    }, { status: 500 })
  }

  // 构建正确的 URL
  function buildRedisUrl(baseUrl: string): string {
    if (baseUrl.includes('/v1/request')) {
      return baseUrl
    }
    return `${baseUrl.replace(/\/$/, '')}/v1/request`
  }

  const testUrl = buildRedisUrl(kvUrl)
  const results = []

  // 测试 1: Bearer Token
  try {
    const response1 = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['ping'])
    })
    const text1 = await response1.text()
    results.push({
      method: 'Bearer Token',
      status: response1.status,
      response: text1,
      success: response1.ok
    })
  } catch (error) {
    results.push({
      method: 'Bearer Token',
      status: 'error',
      response: error instanceof Error ? error.message : '未知错误',
      success: false
    })
  }

  // 测试 2: Basic Auth (有些 Upstash 实例使用这种方式)
  try {
    const response2 = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`default:${kvToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['ping'])
    })
    const text2 = await response2.text()
    results.push({
      method: 'Basic Auth (default:token)',
      status: response2.status,
      response: text2,
      success: response2.ok
    })
  } catch (error) {
    results.push({
      method: 'Basic Auth (default:token)',
      status: 'error',
      response: error instanceof Error ? error.message : '未知错误',
      success: false
    })
  }

  // 测试 3: 直接在 URL 中使用 token 作为查询参数
  try {
    const urlWithToken = `${testUrl}?_token=${encodeURIComponent(kvToken)}`
    const response3 = await fetch(urlWithToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['ping'])
    })
    const text3 = await response3.text()
    results.push({
      method: 'Query Parameter Token',
      status: response3.status,
      response: text3,
      success: response3.ok
    })
  } catch (error) {
    results.push({
      method: 'Query Parameter Token',
      status: 'error',
      response: error instanceof Error ? error.message : '未知错误',
      success: false
    })
  }

  return NextResponse.json({
    message: 'Redis 认证方式测试',
    testUrl,
    tokenPrefix: kvToken.substring(0, 20),
    results,
    recommendation: results.find(r => r.success) ?
      `使用 ${results.find(r => r.success)?.method} 方式成功` :
      '所有认证方式都失败，请检查令牌是否有效',
    timestamp: new Date().toISOString()
  })
}