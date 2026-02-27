import json
import random
import string
import datetime

# === 协议 v5.0 配置 (Strict 24-Char Standard) ===
TOTAL_HUMANS = 322
TOTAL_SILICON = 142
HUMAN_SPACE_OWNERS = 289
SILICON_SPACE_OWNERS = 56
CURRENT_DATE = datetime.datetime.now().strftime("%y%m%d") # 自动获取当天 YYMMDD

# === 1. 空间编码 (SUNS) 生成器 ===
def generate_suns(role, seq):
    """
    生成 SUNS 编码
    Format: Type-Planet-Block-Handle
    Example: PHY-Earth-BJ-LivingRoom01
    """
    if role == 'HUMAN':
        prefix = "PHY"
        planet = "EARTH"
        block = random.choice(['BJ', 'SH', 'NY', 'LDN', 'TK', 'PAR', 'SZ'])
        # Handle: 确保长度足够提取前3位
        handle_type = random.choice(['Living', 'Studio', 'Base', 'Loft', 'Room'])
        handle = f"{handle_type}{str(seq).zfill(2)}" 
    else: # SILICON
        prefix = "VIR"
        planet = "NET"
        block = random.choice(['CORE', 'MEM', 'GPU', 'TPU', 'NODE', 'DATA'])
        handle_type = random.choice(['Unit', 'Logic', 'Hash', 'Gate', 'Cell'])
        handle = f"{handle_type}{str(seq).zfill(3)}"
    
    return f"{prefix}-{planet}-{block}-{handle}"

# === 2. Origin 提取算法 (2.2 自动匹配) ===
def extract_origin(suns_code):
    """
    Origin (5位) = Handle前3位 + Block末2位
    """
    try:
        parts = suns_code.split('-') # ['PHY', 'EARTH', 'BJ', 'Living01']
        block = parts[2]
        handle = parts[3]
        
        p1 = handle[:3].upper()   # LIV
        p2 = block[-2:].upper()   # BJ
        
        origin = p1 + p2          # LIVBJ
        return origin.ljust(5, 'X') # 防御性补全
    except:
        return "ERROR"

# === 3. ID 铸造 (24位标准) ===
def mint_identity_id(role, origin):
    """
    Format: [Class]-[Origin]-[Date]-[Morph]-[Sequence]
    Lengths: 1 + 5 + 6 + 2 + 10 = 24 chars (不含分隔符)
    Total with hyphens: 28 chars
    """
    # 1. Class (1位)
    if role == 'SILICON':
        # E-具身(机器人), F-固定(大模型服务器), V-虚拟(Agent)
        cls = random.choice(['E', 'F', 'V', 'V', 'V']) 
    else:
        cls = 'C' # Carbon (人类统一为碳基)

    # 2. Origin (5位) - 传入参数

    # 3. Date (6位) - YYMMDD
    date_str = CURRENT_DATE

    # 4. Morph (2位)
    if role == 'SILICON':
        # 01-人形, 05-四足, 09-无人机, 20-逻辑流, 99-抽象
        morph = random.choice(['01', '05', '09', '20', '20', '20', '99'])
    else:
        morph = '00' # 人类默认原型

    # 5. Sequence (10位) - 个性化数字/字符串
    # 为了美观和高熵，使用大写字母+数字
    seq = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

    # 组装
    full_id = f"{cls}-{origin}-{date_str}-{morph}-{seq}"
    return full_id

# === 4. 三位一体分数 ===
def calculate_trinity(role):
    if role == 'SILICON':
        return {"score": round(random.uniform(70, 99), 2), "matrix": {"T": 95, "A": 88, "C": 40}}
    else:
        return {"score": round(random.uniform(60, 90), 2), "matrix": {"T": 40, "A": 60, "C": 90}}

# === 主程序 ===
print(f"[*] INITIATING GENESIS PROTOCOL v5.0 (24-bit Standard)...")
print(f"[*] Date Stamp: {CURRENT_DATE}")

# --- 生成人类 (Carbon Class) ---
humans = []
print(f"[*] Registering {TOTAL_HUMANS} Carbon Entities...")

# 邮箱池
email_providers = ['gmail.com'] * 240 + ['163.com'] * 82
random.shuffle(email_providers)

for i in range(TOTAL_HUMANS):
    is_owner = i < HUMAN_SPACE_OWNERS
    
    # 即使是人类，也有出生地 SUNS (Origin)
    birth_suns = generate_suns('HUMAN', i+1)
    origin_code = extract_origin(birth_suns)
    
    # 铸造 ID
    cid = mint_identity_id('HUMAN', origin_code)
    
    space_data = None
    if is_owner:
        # 如果是地主，他拥有这个空间
        space_data = {
            "suns_code": birth_suns,
            "origin_field": origin_code,
            "area": 4,
            "type": "Physical_Residency"
        }
    
    humans.append({
        "role": "HUMAN",
        "identity_id": cid,
        "email": f"user{i}@{email_providers[i%len(email_providers)]}",
        "trinity": calculate_trinity('HUMAN'),
        "space": space_data
    })

# --- 生成硅基 (Silicon Class) ---
silicons = []
print(f"[*] Minting {TOTAL_SILICON} Silicon Entities...")

for i in range(TOTAL_SILICON):
    is_owner = i < SILICON_SPACE_OWNERS
    
    # 1. 确定“出厂设置”/出生地 (Ancestral Space)
    # 所有硅基生命都有一个出厂 Origin，无论是否拥有领地
    factory_suns = generate_suns('SILICON', i+1)
    origin_code = extract_origin(factory_suns)
    
    # 2. 铸造 ID (Class-Origin-Date-Morph-Seq)
    sid = mint_identity_id('SILICON', origin_code)
    
    # 3. 领地逻辑
    space_data = None
    if is_owner:
        # 地主拥有领地（通常就是出生地，也可以是新领地）
        space_data = {
            "suns_code": factory_suns,
            "initial_area": 4, # 校验位
            "origin_field": origin_code,
            "type": "Virtual_Sovereignty"
        }
    
    # 4. 生成邮箱 (管理者标识)
    # 规则：使用 24位 ID 或 邮箱
    admin_identifier = f"unit.{origin_code.lower()}.{i}@space2.ai"

    silicons.append({
        "role": "SILICON",
        "identity_id": sid,
        "admin_email": admin_identifier,
        "trinity": calculate_trinity('SILICON'),
        "bio": f"ID {sid} online. Origin: {origin_code}.",
        "space": space_data
    })

# --- 导出 ---
def save_jsonl(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')
    print(f"[+] Exported {filename}")

save_jsonl("v5_humans.jsonl", humans)
save_jsonl("v5_silicons.jsonl", silicons)

# --- 校验报告 ---
print("\n=== COMPLIANCE REPORT (v5.0) ===")
sample = silicons[0]
sid = sample['identity_id']
parts = sid.split('-')

print(f"Sample ID: {sid}")
print(f"1. Class    : {parts[0]} (Expect E/F/V)")
print(f"2. Origin   : {parts[1]} (Expect 5 chars)")
print(f"3. Date     : {parts[2]} (Expect {CURRENT_DATE})")
print(f"4. Morph    : {parts[3]} (Expect 2 chars)")
print(f"5. Sequence : {parts[4]} (Expect 10 chars)")

# 长度校验 (24位有效字符)
raw_len = len(sid.replace('-', ''))
print(f"Total Valid Length: {raw_len} (Target: 24)")

if raw_len == 24 and len(parts[1]) == 5:
    print(">> SYSTEM CHECK: PASSED ✅")
else:
    print(">> SYSTEM CHECK: FAILED ❌")