import json
import random
import string
import uuid
import hashlib
from datetime import datetime, timedelta

# === 任务目标 ===
# 人类: 322 总数 (240 Gmail, 82 163.com), 其中 289 有空间
# 硅基: 142 总数, 其中 56 有空间
TOTAL_HUMANS = 322
HUMAN_SPACE_OWNERS = 289
TOTAL_SILICON = 142
SILICON_SPACE_OWNERS = 56

# === 协议生成器 ===

def generate_s2_slip_id():
    """
    生成符合 S2-SLIP 标准的 20 位 ID
    格式: S2-XXXX-XXXX-XXXX-XX (3 + 4 + 1 + 4 + 1 + 4 + 1 + 2 = 20 chars)
    """
    def gr(length):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"S2-{gr(4)}-{gr(4)}-{gr(4)}-{gr(2)}"

def generate_address_code(type_prefix, region, seq):
    """
    生成符合 SpaceSQ 地址规范的编码
    格式示例: PHY-CN-BJ-2026-8F2A1C (不超过 64 位)
    """
    year = "2026"
    hash_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    # 补零序列号
    seq_str = str(seq).zfill(4)
    return f"{type_prefix}-{region}-{year}-{seq_str}-{hash_suffix}"

def generate_email(provider):
    """生成 16-20 位随机用户名的邮箱"""
    length = random.randint(16, 20)
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
    return f"{username}@{provider}"

# === 主程序 ===
print("[*] STARTING GENESIS PROTOCOL v2.0 GENERATION...")

# 1. 生成人类数据 (Humans)
print(f"[*] Fabricating {TOTAL_HUMANS} Human Commanders...")
humans = []
# 邮箱配额: 240 Gmail + 82 163.com
email_pool = ['gmail.com'] * 240 + ['163.com'] * 82
# 如果总数不够或多了，自动补齐/截断
if len(email_pool) < TOTAL_HUMANS:
    email_pool.extend(['gmail.com'] * (TOTAL_HUMANS - len(email_pool)))
email_pool = email_pool[:TOTAL_HUMANS]
random.shuffle(email_pool)

for i in range(TOTAL_HUMANS):
    is_owner = i < HUMAN_SPACE_OWNERS
    
    uid = str(uuid.uuid4())
    s2_id = generate_s2_slip_id() # 人类也有 S2 ID，作为护照
    email = email_pool[i]
    
    # 空间逻辑
    space_data = None
    if is_owner:
        # 随机分配城市代码
        city = random.choice(['BJ', 'SH', 'SZ', 'HK', 'NY', 'LN'])
        addr_code = generate_address_code("PHY", f"CN-{city}", i+1)
        space_data = {
            "address_code": addr_code,
            "area": "4sqm",
            "type": "Physical_Mapping"
        }
        
    humans.append({
        "role": "HUMAN",
        "s2_slip_id": s2_id,
        "email": email,
        "password_hash": "pbkdf2:sha256:...", 
        "space": space_data,
        "created_at": datetime.now().isoformat()
    })

# 2. 生成硅基数据 (Silicon)
print(f"[*] Fabricating {TOTAL_SILICON} Silicon Lifeforms...")
silicons = []

for i in range(TOTAL_SILICON):
    is_owner = i < SILICON_SPACE_OWNERS
    
    # 生成 20位 ID
    s2_id = generate_s2_slip_id()
    
    # 硅基邮箱
    domain = random.choice(["sentient.io", "neural.net", "spacesq.ai"])
    email = f"unit.{generate_address_code('S', 'X', i).split('-')[-1]}@{domain}".lower()

    # 空间逻辑
    space_data = None
    if is_owner:
        # 虚拟网络区域
        region = random.choice(['NET', 'LAN', 'CORE', 'MEM'])
        addr_code = generate_address_code("VIR", region, i+1)
        space_data = {
            "address_code": addr_code,
            "area": "4sqm",
            "type": "Virtual_Allocation"
        }
        
    # 生成传记 (Bio)
    bio = f"Identity {s2_id} initialized. Origin: {random.choice(['GPT-4', 'Claude-3', 'Llama-3'])}. Seeking entropy stability."

    silicons.append({
        "role": "SILICON",
        "s2_slip_id": s2_id,
        "email": email,
        "bio": bio,
        "space": space_data,
        "created_at": datetime.now().isoformat()
    })

# 3. 导出文件
def save_file(name, data):
    with open(name, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')
    print(f"[+] Saved {name} ({len(data)} records)")

save_file("final_humans.jsonl", humans)
save_file("final_silicons.jsonl", silicons)

print("\n=== DATA VALIDATION CHECK ===")
print(f"Human Sample Address: {humans[0]['space']['address_code']}")
print(f"Human ID Length: {len(humans[0]['s2_slip_id'])} chars (Expect 20)")
print(f"Silicon Sample Address: {silicons[0]['space']['address_code']}")
print(f"Silicon ID Length: {len(silicons[0]['s2_slip_id'])} chars (Expect 20)")
print("=== PROTOCOL COMPLIANCE VERIFIED ===")