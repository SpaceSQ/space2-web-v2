import json
import random
import string
import datetime

# === 协议 v6.0 配置 (SUNS & Registry Protocol) ===
TOTAL_HUMANS = 322
TOTAL_SILICON = 142
HUMAN_SPACE_OWNERS = 289
SILICON_SPACE_OWNERS = 56
CURRENT_DATE_SHORT = datetime.datetime.now().strftime("%y%m%d") # YYMMDD for ID
CURRENT_DATE_FULL = datetime.datetime.now().strftime("%y%m%d")  # YYMMDD for Metaverse Block

# === 1. SUNS 命名数据库 (预设列表) ===
SUNS_DB = {
    # --- PHY Domain (实体/孪生) ---
    "PHY": {
        "Earth": ["NorthAmerica", "Europe", "AsiaPac", "Oceania", "Africa"],
        "China": ["Beijing", "Shanghai", "Guangdong", "Shenzhen", "Chengdu", "Hangzhou"]
    },
    # --- VIR Domain (虚拟/元宇宙) ---
    "VIR": {
        "Mars": ["UtopiaPlanitia", "HydraotesChaos", "OlympusMons", "GaleCrater"],
        "Moon": ["GuangHanGong", "WanHoo", "Tycho", "SeaOfTranquility"],
        "Taohuayuan": ["Qinxi", "Taohuashan", "Wuling", "CaveEntrance"],
        "Shanhaijing": ["Kunlun", "Penglai", "Qingqiu", "Buzhou"],
        "Minecraft": ["Overworld", "Nether", "TheEnd", "Redstone"],
        "Metaverse": ["GENESIS"] # 特殊处理
    }
}

# === 2. SUNS 编码生成器 (核心逻辑) ===
def generate_suns_v6(role, seq):
    """
    生成符合 SUNS 标准的四段式编码
    格式: [Domain]-[Region]-[Block]-[Handle]
    总长度: < 64 chars
    """
    # 1. 确定 Domain & Region
    if role == 'HUMAN':
        # 人类主要在 PHY (地球/中国)，也有部分在 VIR (玩元宇宙)
        if random.random() < 0.7:
            domain = "PHY"
            region = random.choice(["Earth", "China"])
        else:
            domain = "VIR"
            region = random.choice(["Metaverse", "Minecraft", "Taohuayuan"])
    else: # SILICON
        # 硅基主要在 VIR (火星/月球/山海经/元宇宙)
        domain = "VIR"
        region = random.choice(["Mars", "Moon", "Shanhaijing", "Metaverse", "Taohuayuan"])

    # 2. 确定 Block (区域名 + 2位编号)
    if region == "Metaverse":
        # 规则: Land + 日期编号 (如 Land23092301)
        # 这里为了演示，随机生成 01-99 的编号
        block_num = str(random.randint(1, 99)).zfill(2)
        block = f"Land{CURRENT_DATE_FULL}{block_num}"
    else:
        # 常规规则: AreaName + 2位数字
        area_name = random.choice(SUNS_DB[domain][region])
        block_num = str(random.randint(1, 20)).zfill(2) # 假设每个区先开20个块
        block = f"{area_name}{block_num}"

    # 3. 确定 Handle (个性化句柄 3-12位)
    if role == 'HUMAN':
        prefixes = ['My', 'Zen', 'Cyber', 'Home', 'Base', 'Art', 'Code']
        suffixes = ['Room', 'Camp', 'Pod', 'Zone', 'Lab']
        handle_raw = random.choice(prefixes) + random.choice(suffixes)
        # 加上随机数确保唯一，且长度不超标
        handle = f"{handle_raw}{random.randint(1,9)}" 
    else:
        prefixes = ['Node', 'Core', 'Link', 'Hash', 'Gate', 'Flux']
        suffixes = ['X', 'Y', 'Z', '01', '99', 'Hex']
        handle = f"{random.choice(prefixes)}{random.choice(suffixes)}"

    # 组装
    suns = f"{domain}-{region}-{block}-{handle}"
    
    # 长度校验 (兜底)
    if len(suns) > 64:
        return generate_suns_v6(role, seq) # 递归重试
        
    return suns

# === 3. Origin 提取算法 (保持 v5 逻辑) ===
def extract_origin(suns_code):
    """
    Origin (5位) = Handle前3位 + Block末2位
    """
    try:
        parts = suns_code.split('-') 
        if len(parts) != 4: return "ERROR"
        
        block = parts[2]
        handle = parts[3]
        
        # 提取逻辑
        p1 = handle[:3].upper()   # Handle前3
        p2 = block[-2:].upper()   # Block末2
        
        origin = p1 + p2
        # 补全至5位 (防御性)
        return origin.ljust(5, 'X')[:5]
    except:
        return "ERROR"

# === 4. ID 铸造 (保持 v5 24位标准) ===
def mint_identity_id(role, origin):
    # Class
    cls = 'C' if role == 'HUMAN' else random.choice(['E', 'F', 'V', 'V'])
    # Date
    date_str = CURRENT_DATE_SHORT
    # Morph
    morph = '00' if role == 'HUMAN' else random.choice(['01', '05', '09', '20', '99'])
    # Sequence
    seq = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    
    return f"{cls}-{origin}-{date_str}-{morph}-{seq}"

# === 5. 三位一体分数 ===
def calculate_trinity(role):
    if role == 'SILICON':
        return {"score": round(random.uniform(70, 99), 2), "matrix": {"T": 95, "A": 88, "C": 40}}
    else:
        return {"score": round(random.uniform(60, 90), 2), "matrix": {"T": 40, "A": 60, "C": 90}}

# === 主程序 ===
print(f"[*] INITIATING GENESIS PROTOCOL v6.0 (SUNS Compliance)...")

# --- 生成人类 ---
humans = []
print(f"[*] Registering {TOTAL_HUMANS} Human Entities (PHY/VIR mix)...")
email_providers = ['gmail.com'] * 240 + ['163.com'] * 82
random.shuffle(email_providers)

for i in range(TOTAL_HUMANS):
    is_owner = i < HUMAN_SPACE_OWNERS
    
    # 生成 SUNS (即使无产者也有户籍归属)
    suns = generate_suns_v6('HUMAN', i)
    origin = extract_origin(suns)
    cid = mint_identity_id('HUMAN', origin)
    
    space_data = None
    if is_owner:
        space_data = {
            "suns_code": suns,
            "origin_field": origin,
            "area": 9.6, # 规范 3.3 定义初始体积 9.6 m3 (4平米 x 2.4层高)
            "type": "Physical_Residency" if "PHY" in suns else "Virtual_Asset"
        }
    
    humans.append({
        "role": "HUMAN",
        "identity_id": cid,
        "email": f"user{i}@{email_providers[i%len(email_providers)]}",
        "trinity": calculate_trinity('HUMAN'),
        "space": space_data
    })

# --- 生成硅基 ---
silicons = []
print(f"[*] Minting {TOTAL_SILICON} Silicon Entities (VIR dominant)...")

for i in range(TOTAL_SILICON):
    is_owner = i < SILICON_SPACE_OWNERS
    
    suns = generate_suns_v6('SILICON', i)
    origin = extract_origin(suns)
    sid = mint_identity_id('SILICON', origin)
    
    space_data = None
    if is_owner:
        space_data = {
            "suns_code": suns,
            "origin_field": origin,
            "area": 9.6, 
            "type": "Virtual_Sovereignty"
        }
    
    # 自动生成的 Handle 作为邮箱名
    handle = suns.split('-')[-1]
    admin_email = f"{handle.lower()}.{origin.lower()}@space2.ai"

    silicons.append({
        "role": "SILICON",
        "identity_id": sid,
        "admin_email": admin_email,
        "trinity": calculate_trinity('SILICON'),
        "bio": f"Link verified at {suns}. Entropy stable.",
        "space": space_data
    })

# --- 导出 ---
def save_jsonl(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')
    print(f"[+] Exported {filename}")

save_jsonl("v6_humans.jsonl", humans)
save_jsonl("v6_silicons.jsonl", silicons)

# --- 深度校验 (Deep Validation) ---
print("\n=== SUNS PROTOCOL COMPLIANCE CHECK ===")
def validate_suns(entry):
    suns = entry['space']['suns_code']
    parts = suns.split('-')
    
    # Check 1: Format
    if len(parts) != 4: return f"FAIL: Structure {suns}"
    
    domain, region, block, handle = parts
    
    # Check 2: Domain
    if domain not in ['PHY', 'VIR']: return f"FAIL: Invalid Domain {domain}"
    
    # Check 3: Region Match
    if region not in SUNS_DB[domain]: return f"FAIL: Region {region} not in {domain}"
    
    # Check 4: Block Logic
    if region == "Metaverse":
        if not block.startswith("Land"): return f"FAIL: Metaverse Block {block}"
    else:
        # Check if block ends with digits
        if not (block[-1].isdigit() and block[-2].isdigit()): return f"FAIL: Block Num {block}"
        
    # Check 5: Handle Length
    if not (3 <= len(handle) <= 12): return f"FAIL: Handle Length {handle}"
    
    return "PASS"

print("--- Validating Human Sample ---")
h_sample = humans[0]
if h_sample['space']:
    res = validate_suns(h_sample)
    print(f"Code: {h_sample['space']['suns_code']}")
    print(f"Origin Extracted: {h_sample['space']['origin_field']}")
    print(f"Status: {res}")

print("\n--- Validating Silicon Sample ---")
s_sample = silicons[0]
if s_sample['space']:
    res = validate_suns(s_sample)
    print(f"Code: {s_sample['space']['suns_code']}")
    print(f"Origin Extracted: {s_sample['space']['origin_field']}")
    print(f"Status: {res}")