import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端 (建议在生产环境使用 SERVICE_ROLE_KEY 以绕过 RLS 强制写入)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { addressId, email, area, targetName, sunsData } = body;

    // 1. 基础非空校验
    if (!email || !sunsData || !sunsData.region || !sunsData.blockName || !sunsData.blockNum || !sunsData.handle) {
      return NextResponse.json({ success: false, message: '缺失核心空间注册参数' }, { status: 400 });
    }

    const { region, blockName, blockNum, handle } = sunsData;

    // 2. SUNS v2.0 协议硬核正则校验 (钛合金锁)
    // L2: 必须是 2位大写字母(国家) 或 2位数字(数字大区)
    if (!/^[A-Z]{2}$/.test(region) && !/^\d{2}$/.test(region)) {
      return NextResponse.json({ success: false, message: 'L2 大区格式非法，需为2位字母或数字' }, { status: 400 });
    }
    // L3: 城市名 (4-16位大写字母)
    if (!/^[A-Z]{4,16}$/.test(blockName)) {
      return NextResponse.json({ success: false, message: 'L3 城市代码非法，需为4-16位纯字母' }, { status: 400 });
    }
    // L3: 网格号 (严格3位数字)
    if (!/^\d{3}$/.test(blockNum)) {
      return NextResponse.json({ success: false, message: 'L3 网格号非法，需为严格的3位数字' }, { status: 400 });
    }
    // L4: 主权标识 (4-15位大写字母或数字)
    if (!/^[A-Z0-9]{4,15}$/.test(handle)) {
      return NextResponse.json({ success: false, message: 'L4 主权标识非法，需为4-15位字母或数字' }, { status: 400 });
    }

    // 3. 48字节有效负载极简法则校验
    // 计算公式: L1(2) + L2(2) + L3_city(4~16) + L3_grid(3) + L4(4~15)
    const currentPayloadLength = 2 + 2 + blockName.length + 3 + handle.length;
    if (currentPayloadLength > 46) {
      return NextResponse.json({ 
        success: false, 
        message: `协议违规：总负载超标 (${currentPayloadLength} bytes)。必须为 L5 预留至少 2 bytes 空间。` 
      }, { status: 400 });
    }

    // 4. 后端强制标准组装 (杜绝前端伪造)
    const finalSunsCode = `S2-${region}-${blockName}${blockNum}-${handle}`;

    // 5. 校验母库是否允许挂载 (模拟物理底账校验逻辑)
    if (!addressId.startsWith('SH-BASE-')) {
       // 预留的物理合规性校验口
       // return NextResponse.json({ success: false, message: '物理母库 ID 未经审计' }, { status: 400 });
    }

    // 6. 执行数据库写入
    const { data, error } = await supabase
      .from('suns_registry_v1')
      .insert([
        {
          owner_email: email,
          domain: 'S2', // v2.0 强制锁定根域
          full_suns_code: finalSunsCode,
          master_base_id: addressId,
          total_area: parseFloat(area) || 125,
          target_name: targetName || 'Commander Base',
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      // 捕获唯一性约束冲突 (如果该地址已被抢注)
      if (error.code === '23505') {
        return NextResponse.json({ success: false, message: '该 SUNS L4 空间坐标已被其他指挥官锚定，请更换大区或主权标识。' }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: '底层矩阵写入失败: ' + error.message }, { status: 500 });
    }

    // 7. 成功返回
    return NextResponse.json({ 
      success: true, 
      did: data,
      message: 'SUNS v2.0 空间锚定成功'
    });

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ success: false, message: '服务器内部错误' }, { status: 500 });
  }
}