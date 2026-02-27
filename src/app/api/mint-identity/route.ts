import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  console.log("🚀 Identity Minting Request Received"); 

  try {
    const body = await request.json();
    console.log("📦 Payload:", body); 

    const { 
      email, 
      realName, 
      idCard, 
      address, 
      birthDate,
      mode,
      customSequence 
    } = body;

    // 0. 基础校验
    if (!email || !realName || !idCard) {
      return NextResponse.json({ success: false, message: "参数缺失：姓名、身份证或邮箱为空。" }, { status: 400 });
    }

    // 1. 唯一性检查
    const { data: existing, error: checkError } = await supabase
      .from('identity_registry_v1')
      .select('s2_slip_id')
      .eq('owner_email', email)
      .eq('identity_class', 'D')
      .maybeSingle();

    if (checkError) {
      console.error("🔥 DB Check Error:", checkError);
      return NextResponse.json({ success: false, message: "数据库查询失败: " + checkError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: "Request Denied: 该邮箱已绑定唯一的具身数字人身份。" 
      }, { status: 409 });
    }

    // 2. 序列号处理
    let sequence = customSequence;
    if (!sequence || sequence.length !== 10 || !/^\d+$/.test(sequence)) {
       sequence = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    }

    // 3. 编号生成 (Raw Format, Total 24 Chars)
    const idClass = 'D'; 
    const cleanName = realName.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const origin = cleanName.padEnd(5, 'X').slice(0, 5); 

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`; 

    const morph = '02'; 

    // 组合24位无连接符编号
    const fullSlipId = `${idClass}${origin}${dateStr}${morph}${sequence}`;
    
    console.log("💎 Minting Raw ID:", fullSlipId);

    // 4. 写入身份注册表
    const { data: identityData, error: insertError } = await supabase
      .from('identity_registry_v1')
      .insert([{
        owner_email: email,
        s2_slip_id: fullSlipId, 
        identity_class: idClass,
        real_name: realName,     
        id_card_num: idCard,     
        postal_address: address, 
        birth_date: birthDate,
        origin_field: origin,
        morph_type: morph,
        is_embodied: true        
      }])
      .select()
      .single();

    if (insertError) {
      console.error("🔥 Insert Error:", insertError); 
      return NextResponse.json({ success: false, message: "身份写入失败: " + insertError.message }, { status: 500 });
    }

    // ==========================================
    // 🔥 5. 触发生命链 (Life Chain) 创世记录 🔥
    // ==========================================
    const { error: logError } = await supabase
      .from('life_chain_logs')
      .insert([{
        s2_slip_id: fullSlipId,
        event_type: 'GENESIS_MINT',
        event_desc: `Class D Embodied Digital Human [${origin}] Instantiated.`,
        metadata: {
          protocol: "Space² EDH v1.0",
          client_ip: request.headers.get('x-forwarded-for') || "Unknown",
          source: "Web_Terminal",
          anchor_type: "Biological_Human"
        }
      }]);

    if (logError) {
      console.error("⚠️ Life Chain Log Error (Non-fatal):", logError);
      // 注意：即使日志写入失败，我们也算身份铸造成功，不中断主流程，仅做内部报错
    } else {
      console.log("🧬 Life Chain Genesis Event Recorded!");
    }

    return NextResponse.json({ success: true, slip: identityData });

  } catch (error: any) {
    console.error("💥 Global Mint Error:", error);
    return NextResponse.json({ success: false, message: "服务内部错误: " + error.message }, { status: 500 });
  }
}