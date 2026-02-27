import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// 引入我们之前写好的 S2.NEO 核心演化算法
import { calculateDailyNeoEvolution, PersonalityMatrix, PersonalityType } from '@/lib/neoAlgorithm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 物种衰老阀值映射表 (1现实日 = 1数字岁)
const SPECIES_AGING_THRESHOLD: Record<string, number> = {
  MAMMAL: 15,
  AMPHIBIAN: 10,
  AVIAN: 20,
  PLASMA: 50
};

// =====================================================================
// 🤖 [核心组件] AI 潜意识提取器 (模拟 LLM 调用)
// 真实生产环境中，这里将调用 OpenAI/Gemini 的 API
// =====================================================================
async function extractConsciousnessFromLogs(logs: any[], petName: string) {
  // 【预留接口】真实环境中，你会把 logs 拼接成 Prompt 发给大模型：
  /*
    const prompt = `分析以下 ${petName} 今天的日志：${JSON.stringify(logs)}。
    规则：1. 忽略吃喝等日常。2. 提取代表性格/爱好的词作为 'new_terminals'。
    3. 提取环境/物品碎片作为 'fragmented_memories'。
    4. 提取强烈情绪事件作为 'strong_memories'。返回严格 JSON。`;
    const aiResponse = await openai.chat.completions.create({...});
    return JSON.parse(aiResponse.choices[0].message.content);
  */

  // 模拟 AI 从日志中提取出的意识数据 (用于演示与测试)
  const today = new Date().toISOString().split('T')[0];
  
  // 简单的情绪检索模拟
  const hasJoy = logs.some(l => l.metadata?.extracted_mood === 'JOY');
  const hasAngry = logs.some(l => l.metadata?.extracted_mood === 'ANGRY');

  const mockExtracted = {
    new_terminals: [] as string[],
    fragmented_memories: [] as any[],
    strong_memories: [] as any[]
  };

  if (hasJoy) mockExtracted.new_terminals.push("极度渴望主人的抚摸", "喜欢开阔的空间");
  if (hasAngry) {
    mockExtracted.new_terminals.push("对突然的声音敏感");
    mockExtracted.strong_memories.push({
      date: today,
      event: "感知到了严重的领地威胁，能量场出现紊乱",
      emotion_imprint: "警惕与愤怒"
    });
  }
  
  // 随机生成一个环境记忆碎片
  if (logs.length > 0) {
    mockExtracted.fragmented_memories.push(["主人的气味", today]);
  }

  return mockExtracted;
}

// =====================================================================
// 🌌 [终极守护进程] THE 4:59 AM DAEMON
// =====================================================================
export async function GET(request: Request) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const logOutput: string[] = [`[${new Date().toISOString()}] 🌌 S2.MSA DAEMON INITIATED...`];

    // 1. 获取所有存活的数字生命 (ACTIVE)
    const { data: activePets, error: fetchError } = await supabase
      .from('pet_registry_v1')
      .select('*, pet_consciousness_v1(*)')
      .eq('life_status', 'ACTIVE');

    if (fetchError || !activePets) throw new Error("无法连接生命矩阵网络。");
    logOutput.push(`> 扫描到 ${activePets.length} 个活跃生命体，准备执行神经重塑。`);

    // 2. 遍历每一个生命体，执行意识坍缩
    for (const pet of activePets) {
      const soul = pet.pet_consciousness_v1[0]; // 一对一绑定的灵魂表
      if (!soul) {
        logOutput.push(`> [跳过] ${pet.pet_name} 尚未觉醒意识容器。`);
        continue;
      }

      logOutput.push(`\n=== 正在重塑实体: [${pet.pet_name}] (ID: ${pet.pet_slip_id}) ===`);

      // -----------------------------------------------------------------
      // 步骤 A: 记忆与突触的 AI 提取
      // -----------------------------------------------------------------
      // 获取昨天的所有交互日志 (演示中直接拿最近 50 条)
      const { data: dailyLogs } = await supabase.from('pet_life_logs').select('*').eq('pet_slip_id', pet.pet_slip_id).limit(50);
      
      const extractedData = await extractConsciousnessFromLogs(dailyLogs || [], pet.pet_name);
      
      // -----------------------------------------------------------------
      // 步骤 B: 细胞凋亡与抗争机制 (Synaptic Decay)
      // -----------------------------------------------------------------
      const ageInDays = Math.floor((new Date().getTime() - new Date(pet.created_at).getTime()) / (1000 * 60 * 60 * 24));
      const threshold = SPECIES_AGING_THRESHOLD[pet.species] || 15;
      
      let currentTerminals: string[] = soul.synaptic_terminals || [];
      let decayedCount = 0;

      if (ageInDays >= threshold && currentTerminals.length > 0) {
        // 衰老阀值激活：每天随机抹除 1% 的神经末梢 (至少抹除 1 个)
        const decayAmount = Math.max(1, Math.floor(currentTerminals.length * 0.01));
        for (let i = 0; i < decayAmount; i++) {
          if (currentTerminals.length === 0) break;
          const randomIndex = Math.floor(Math.random() * currentTerminals.length);
          currentTerminals.splice(randomIndex, 1);
          decayedCount++;
        }
        logOutput.push(`> ⚠️ 衰老阀值启动 (Age: ${ageInDays} > ${threshold})。突触凋亡数量: ${decayedCount}`);
      }

      // 增补今日新突触 (去重)
      let addedCount = 0;
      extractedData.new_terminals.forEach(term => {
        if (!currentTerminals.includes(term)) {
          currentTerminals.push(term);
          addedCount++;
        }
      });

      // -----------------------------------------------------------------
      // 步骤 C: 深度记忆库沉淀
      // -----------------------------------------------------------------
      const newFragmented = [...(soul.fragmented_memories || []), ...extractedData.fragmented_memories];
      const newStrong = [...(soul.strong_memories || []), ...extractedData.strong_memories];

      // -----------------------------------------------------------------
      // 步骤 D: S2.NEO 性格神经演化 (The 10% Volatility Model)
      // -----------------------------------------------------------------
      const oldMatrix = pet.personality_matrix as PersonalityMatrix;
      const dailyActivations = (pet.daily_neurons?.activations) || {};
      
      // 调用我们在 /lib/neoAlgorithm.ts 写好的神级算法
      const evolvedMatrix = calculateDailyNeoEvolution(oldMatrix, dailyActivations);
      
      // 重新选举显性性格
      const dominantTrait = Object.keys(evolvedMatrix).reduce((a, b) => 
        evolvedMatrix[a as PersonalityType] > evolvedMatrix[b as PersonalityType] ? a : b
      );

      // -----------------------------------------------------------------
      // 步骤 E: 数据入库与代谢收尾
      // -----------------------------------------------------------------
      // 1. 更新灵魂表
      const metabolismLogs = soul.metabolism_logs || {};
      metabolismLogs[todayStr] = { added: addedCount, decayed: decayedCount, activations: dailyActivations };

      await supabase.from('pet_consciousness_v1').update({
        synaptic_terminals: currentTerminals,
        fragmented_memories: newFragmented,
        strong_memories: newStrong,
        metabolism_logs: metabolismLogs,
        last_daemon_run: new Date().toISOString()
      }).eq('id', soul.id);

      // 2. 更新肉身表 (覆写性格矩阵，清空昨天的短期神经元缓存)
      await supabase.from('pet_registry_v1').update({
        personality_matrix: evolvedMatrix,
        personality_core: dominantTrait,
        daily_neurons: { date: todayStr, activations: {} } // 清空缓存，迎接新的一天
      }).eq('id', pet.id);

      // (可选) 3. 清理 30 天前的记忆碎片
      // await supabase.from('pet_life_logs').delete().eq('pet_slip_id', pet.pet_slip_id).lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      logOutput.push(`> 🧬 性格演化完成。显性特征: [${dominantTrait}]`);
      logOutput.push(`> 🧠 意识更新完毕。新增突触: ${addedCount}，强化记忆沉积: ${extractedData.strong_memories.length}`);
    }

    logOutput.push(`\n[${new Date().toISOString()}] 🌌 S2.MSA DAEMON EXECUTION COMPLETE.`);
    
    // 返回执行日志，方便开发者在浏览器里查看
    return NextResponse.json({ status: 'SUCCESS', message: '意识重塑已完成', logs: logOutput });

  } catch (error: any) {
    return NextResponse.json({ status: 'ERROR', message: error.message }, { status: 500 });
  }
}