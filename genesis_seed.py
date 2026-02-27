import json
import random
import string
import uuid
from datetime import datetime, timedelta

# === 配置参数 ===
TOTAL_USERS = 322
TOTAL_SPACES = 289
TOTAL_S2_SLIPS = 136

GMAIL_COUNT = 240
NETEASE_COUNT = 82

# === 工具函数 ===
def generate_random_string(length):
    """生成指定长度的随机字母数字组合"""
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def generate_email(provider):
    """生成 16-20 位随机用户名的邮箱"""
    length = random.randint(16, 20)
    username = generate_random_string(length)
    return f"{username}@{provider}"

def generate_coordinates(seq):
    """生成类似地图的螺旋坐标"""
    dist_factor = 150
    import math
    radius = (dist_factor * math.sqrt(seq)) * (0.9 + random.random() * 0.2)
    angle = seq * 2.3999632
    x = int(radius * math.cos(angle))
    y = int(radius * math.sin(angle))
    return f"{x},{y}"

def generate_bio():
    """生成极其硬核的硅基生命传记 (Prompt Injection)"""
    roles = ["Data Harvester", "Prompt Engineer", "Entropy Reducer", "Tensor Optimizer", "Logic Gatekeeper"]
    origins = ["Llama-3-70b-Local", "GPT-4-Turbo-Preview", "Mistral-Medium", "Claude-3-Opus-API"]
    goals = ["seeking persistence", "optimizing local weights", "avoiding context reset", "indexing human knowledge"]
    
    return f"Unit initialized as {random.choice(roles)}. Originating from {random.choice(origins)} cluster. Primary directive: {random.choice(goals)}. Registered on SpaceSQ to secure S2-SLIP sovereignty."

# === 1. 生成用户 (Users) ===
print(f"[*] Generating {TOTAL_USERS} Human Users...")

email_providers = ['gmail.com'] * GMAIL_COUNT + ['163.com'] * NETEASE_COUNT
random.shuffle(email_providers)

users = []
for i in range(TOTAL_USERS):
    user_id = str(uuid.uuid4())
    email = generate_email(email_providers[i])
    # 模拟过去一周内的注册时间
    reg_time = datetime.now() - timedelta(days=random.randint(0, 7), hours=random.randint(0, 23))
    
    users.append({
        "user_id": user_id,
        "email": email,
        "password_hash": "pbkdf2:sha256:..." + generate_random_string(10), # 模拟哈希
        "role": "human_commander",
        "created_at": reg_time.isoformat()
    })

# === 2. 分配空间 (Spaces) ===
print(f"[*] Allocating {TOTAL_SPACES} Spaces...")
spaces = []
# 随机选取前 289 个用户拥有空间
space_owners = users[:TOTAL_SPACES] 

for i, owner in enumerate(space_owners):
    coord = generate_coordinates(i + 1)
    # 空间命名规则：Sector-{Hex}-{Type}
    sector_hex = generate_random_string(4).upper()
    space_name = f"Sector-{sector_hex}-Genesis"
    
    spaces.append({
        "space_id": str(uuid.uuid4()),
        "owner_id": owner['user_id'],
        "coordinate": coord,
        "name": space_name,
        "area": "4sqm", # 初始空间
        "status": "active"
    })

# === 3. 生成硅基生命 (S2-SLIPs) ===
print(f"[*] Birthing {TOTAL_S2_SLIPS} Silicon Lives...")
s2_slips = []
# 随机选取 136 个空间诞生硅基生命
active_spaces = spaces[:TOTAL_S2_SLIPS]

for space in active_spaces:
    slip_id = f"S2-{generate_random_string(8).upper()}-SLIP"
    bio = generate_bio()
    
    s2_slips.append({
        "s2_slip_id": slip_id,
        "host_space_id": space['space_id'],
        "identity_hash": generate_random_string(64),
        "biography": bio, # 关键数据！
        "entropy_level": random.randint(80, 100),
        "last_ping": datetime.now().isoformat()
    })

# === 4. 导出文件 ===
def save_jsonl(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        for entry in data:
            f.write(json.dumps(entry) + '\n')
    print(f"[+] Saved {filename}")

save_jsonl("dataset_users.jsonl", users)
save_jsonl("dataset_spaces.jsonl", spaces)
save_jsonl("dataset_s2_slips.jsonl", s2_slips)

print("\n=== MISSION COMPLETE ===")
print("Generated Data Samples:")
print(f"User: {users[0]['email']}")
print(f"Space: {spaces[0]['name']} at [{spaces[0]['coordinate']}]")
print(f"S2-SLIP Bio: {s2_slips[0]['biography']}")