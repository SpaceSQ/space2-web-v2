import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 动态获取当前域名，以便在 API 内部请求 public 文件夹
function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

async function fetchDataFile(fileName: string) {
  const baseUrl = getBaseUrl();
  const fileUrl = `${baseUrl}/${fileName}`;
  
  console.log(`[Genesis Fetch] Attempting to fetch: ${fileUrl}`);

  try {
    const response = await fetch(fileUrl, {
      cache: 'no-store', // 确保每次都拿最新数据
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    // 解析 JSONL 格式
    return text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.error(`Parse error in line: ${line.substring(0, 30)}`);
          return null;
        }
      })
      .filter(item => item !== null);
  } catch (error: any) {
    console.error(`[Genesis Error] Failed to fetch ${fileName}:`, error.message);
    return [];
  }
}

export async function GET() {
  // 1. 通过内部网络请求读取 public 下的文件
  const humans = await fetchDataFile('space2_humans_history.jsonl');
  const silicons = await fetchDataFile('space2_silicons_history.jsonl');

  console.log(`[Genesis Result] Found ${humans.length} humans, ${silicons.length} silicons`);

  // 2. 格式化数据适配管理后台
  const formattedHumans = humans.map((h: any, index: number) => ({
    seq: index + 1,
    role: 'HUMAN',
    id: h.identity_id || 'UNKNOWN',
    suns: h.space?.suns_code || 'N/A',
    origin: h.space?.origin_field || 'DRIFTER',
    trinity: h.trinity || { score: '0', matrix: {T:0, A:0, C:0} },
    status: h.space ? 'ACTIVE' : 'WANDERING',
    last_pulse: 'Live'
  }));

  const formattedSilicons = silicons.map((s: any, index: number) => ({
    seq: index + 1 + humans.length,
    role: 'SILICON',
    id: s.identity_id || 'UNKNOWN',
    suns: s.space?.suns_code || 'N/A',
    origin: s.space?.origin_field || 'MIA',
    trinity: s.trinity || { score: '0', matrix: {T:0, A:0, C:0} },
    status: 'ACTIVE',
    last_pulse: 'Syncing'
  }));

  const allUsers = [...formattedSilicons, ...formattedHumans].reverse();

  return NextResponse.json({
    data: allUsers,
    stats: {
      total: allUsers.length,
      human: humans.length,
      silicon: silicons.length
    },
    // 增加调试信息
    debug: {
      source: getBaseUrl(),
      timestamp: new Date().toISOString()
    }
  });
}