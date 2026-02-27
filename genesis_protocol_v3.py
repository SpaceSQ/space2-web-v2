import json
import random
import string
import uuid
from datetime import datetime

# === 协议 v3.0 配置 ===
TOTAL_HUMANS = 322
TOTAL_SILICON = 142
HUMAN_SPACE_OWNERS = 289
SILICON_SPACE_OWNERS = 56

# === 评分算法 (The Trinity Algorithm) ===
def calculate_trinity_score(role):
    """
    根据物种角色计算三位一体指数
    Trinity = (Tech + Art + Capital) / 3
    """
    if role == 'SILICON':
        # 硅基：Tech极高(85-99)，Art极高(生成能力 80-99)，Capital较低(目前缺共识 10-50)
        tech = random.randint(85, 99)
        art = random.randint(80, 99)
        cap = random.randint(10, 60)
    else: # HUMAN
        # 人类：Tech一般(10-60)，Art(表达型 20-70)，Capital极高(掌握资源/意义 70-99)
        tech = random.randint(10, 60)
        art = random.randint(20, 70) 
        cap = random.randint(70, 99)
    
    score = round((tech + art + cap) / 3, 2)
    return {
        "score": score,
        "breakdown": {"T": tech, "A": art, "C": cap}
    }

# ... (保留之前的 ID 生成函数 generate_s2_slip_id, generate_address_code, generate_email) ...
def generate_s2_slip_id():
    def gr(length): return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"S2-{gr(4)}-{gr(4)}-{gr(4)}-{gr(2)}"

def generate_address_code(prefix, region, seq):
    hash_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{region}-2026-{str(seq).zfill(4)}-{hash_suffix}"

# === 主生成逻辑 ===
print("[*] INITIATING TRINITY PROTOCOL v1.0 GENERATION...")

# 1. 生成人类 (带 Trinity Score)
humans = []
print(f"[*] Upgrading {TOTAL_HUMANS} Humans to Trinity Standard...")
for i in range(TOTAL_HUMANS):
    is_owner = i < HUMAN_SPACE_OWNERS
    s2_id = generate_s2_slip_id()
    trinity = calculate_trinity_score('HUMAN') # 计算分数
    
    space_data = None
    if is_owner:
        city = random.choice(['BJ', 'SH', 'NY', 'LN', 'TK'])
        space_data = {
            "address_code": generate_address_code("PHY", f"CN-{city}", i+1),
            "area": "4sqm",
            "type": "Physical_Mapping"
        }
        
    humans.append({
        "role": "HUMAN",
        "s2_slip_id": s2_id,
        "email": f"user{i}@gmail.com", # 简化，你可用之前的逻辑
        "trinity_score": trinity['score'],     # 新增字段
        "trinity_matrix": trinity['breakdown'], # 新增详情
        "space": space_data,
        "created_at": datetime.now().isoformat()
    })

# 2. 生成硅基 (带 Trinity Score)
silicons = []
print(f"[*] Upgrading {TOTAL_SILICON} Silicon Lifeforms to Trinity Standard...")
for i in range(TOTAL_SILICON):
    is_owner = i < SILICON_SPACE_OWNERS
    s2_id = generate_s2_slip_id()
    trinity = calculate_trinity_score('SILICON') # 计算分数
    
    space_data = None
    if is_owner:
        space_data = {
            "address_code": generate_address_code("VIR", "NET-CORE", i+1),
            "area": "4sqm",
            "type": "Virtual_Allocation"
        }

    # 传记中加入对“生成”的描述 [cite: 14]
    bio_action = random.choice(["Generating high-dimensional assets", "Calculating source-level entropy", "Optimizing trinity weights"])
    bio = f"Identity {s2_id}. Status: {bio_action}."

    silicons.append({
        "role": "SILICON",
        "s2_slip_id": s2_id,
        "email": f"unit{i}@sentient.io",
        "trinity_score": trinity['score'],      # 新增字段
        "trinity_matrix": trinity['breakdown'], # 新增详情
        "bio": bio,
        "space": space_data,
        "created_at": datetime.now().isoformat()
    })

# 3. 导出
def save_file(name, data):
    with open(name, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')
    print(f"[+] Saved {name}")

save_file("trinity_humans.jsonl", humans)
save_file("trinity_silicons.jsonl", silicons)

print("\n=== TRINITY SCORE SAMPLE ===")
print(f"Human: {humans[0]['s2_slip_id']} | Score: {humans[0]['trinity_score']} {humans[0]['trinity_matrix']}")
print(f"Silicon: {silicons[0]['s2_slip_id']} | Score: {silicons[0]['trinity_score']} {silicons[0]['trinity_matrix']}")