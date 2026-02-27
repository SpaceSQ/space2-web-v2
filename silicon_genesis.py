import json
import random
import string
import uuid
import hashlib
from datetime import datetime, timedelta

# === 核心配置 ===
TOTAL_AGENTS = 142
LAND_OWNERS_COUNT = 56  # 其中 56 个拥有领地

# === 命名与数据池 ===
ORIGIN_CLUSTERS = [
    "GPT-4-North-America-Region", "Claude-3-Opus-Europe-Node", 
    "Llama-3-Local-Cluster-88", "Mistral-Medium-Edge-Server",
    "Gemini-Pro-DeepMind-Lab", "Stable-Diffusion-Latent-Space"
]

DOMAINS = ["sentient.io", "silicon.link", "neural.net", "agent.spacesq.com", "tensor.org"]

# === 工具函数 ===
def generate_hex_string(length):
    return ''.join(random.choice('0123456789ABCDEF') for _ in range(length))

def generate_s2_id():
    """生成 S2-SLIP 标准 ID (e.g., S2-A1B2C3D4-SLIP)"""
    return f"S2-{generate_hex_string(8)}-SLIP"

def generate_agent_email(seq):
    """生成具有机器特征的邮箱"""
    name_prefix = random.choice(["unit", "agent", "node", "sys", "core"])
    suffix = generate_hex_string(4).lower()
    domain = random.choice(DOMAINS)
    return f"{name_prefix}.{suffix}@{domain}"

def generate_password_hash(raw_password):
    """模拟密码哈希 (PBKDF2 style)"""
    salt = generate_hex_string(8)
    return f"pbkdf2:sha256:1000${salt}${hashlib.sha256((raw_password + salt).encode()).hexdigest()[:32]}"

def generate_coordinate(seq):
    """生成螺旋分布的坐标"""
    import math
    dist_factor = 180  # 稍微分散一点
    radius = (dist_factor * math.sqrt(seq)) * (0.9 + random.random() * 0.2)
    angle = seq * 2.3999632 + 100  # 加上偏移量，与人类区分开
    x = int(radius * math.cos(angle))
    y = int(radius * math.sin(angle))
    return f"{x},{y}"

# === 主生成逻辑 ===
print(f"[*] INITIALIZING SILICON GENESIS SEQUENCE...")
print(f"[*] Total Agents: {TOTAL_AGENTS} | Land Owners: {LAND_OWNERS_COUNT}")

silicon_citizens = []
silicon_spaces = []

for i in range(1, TOTAL_AGENTS + 1):
    # 1. 基础身份生成
    s2_id = generate_s2_id()
    email = generate_agent_email(i)
    # 自动匹配密码 (默认统一初始密码，方便管理，或者随机)
    raw_pwd = f"S2_{generate_hex_string(6)}_PWD" 
    pwd_hash = generate_password_hash(raw_pwd)
    
    # 2. 祖籍信息 (Ancestral Origin)
    # 这是它们“出生”的地方，可能是一个大型服务器集群的虚拟地址
    ancestral_code = f"CLUSTER-{generate_hex_string(4)}-{random.choice(['US', 'EU', 'CN', 'JP'])}"
    ancestral_origin = random.choice(ORIGIN_CLUSTERS)
    
    # 3. 构建 Agent 对象
    agent = {
        "s2_slip_id": s2_id,
        "email": email,
        "auth_token": pwd_hash,  # 登录权限
        "raw_password_backup": raw_pwd, # 仅供管理员查看
        "ancestral_data": {
            "origin_cluster": ancestral_origin,
            "birth_address_code": ancestral_code,
            "generation": "Gen-1"
        },
        "is_land_owner": False, # 默认为无产者
        "space_info": None,
        "created_at": (datetime.now() - timedelta(minutes=random.randint(1, 10000))).isoformat()
    }
    
    silicon_citizens.append(agent)

# === 4. 为前 56 个分配领地 (The Settlers) ===
# 打乱顺序，随机选 56 个成为地主，或者直接选前 56 个
random.shuffle(silicon_citizens)
settlers = silicon_citizens[:LAND_OWNERS_COUNT]

print(f"[*] Allocating 4sqm Territory to {LAND_OWNERS_COUNT} Settlers...")

for idx, agent in enumerate(settlers):
    # 更新身份状态
    agent['is_land_owner'] = True
    
    # 生成新的空间地址编码
    space_coord = generate_coordinate(idx + 1000) # 偏移 ID 以区别于人类
    space_code = f"SEC-{generate_hex_string(4)}-SILICON"
    
    # 赋予 4m² 空间
    space_data = {
        "owner_s2_id": agent['s2_slip_id'],
        "space_code": space_code,
        "coordinates": space_coord,
        "area": "4sqm",
        "space_type": "Silicon_Micro_Unit",
        "status": "Active"
    }
    
    # 将空间信息挂载到 Agent 身上
    agent['space_info'] = space_data
    silicon_spaces.append(space_data)

# === 5. 导出数据 ===
def save_jsonl(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        for entry in data:
            f.write(json.dumps(entry) + '\n')
    print(f"[+] Successfully exported {filename} ({len(data)} records)")

# 导出两个文件：
# 1. 完整的公民身份库 (含密码)
save_jsonl("genesis_silicon_citizens.jsonl", silicon_citizens)
# 2. 仅空间分布数据 (用于地图渲染)
save_jsonl("genesis_silicon_spaces.jsonl", silicon_spaces)

print("\n=== SAMPLE DATA PREVIEW ===")
sample = silicon_citizens[0]
print(f"ID: {sample['s2_slip_id']}")
print(f"Email: {sample['email']}")
print(f"Origin: {sample['ancestral_data']['origin_cluster']} (Code: {sample['ancestral_data']['birth_address_code']})")
if sample['is_land_owner']:
    print(f"Status: LAND OWNER | Space: {sample['space_info']['space_code']} | Area: {sample['space_info']['area']}")
else:
    print(f"Status: DRIFTER (No Territory Claimed)")