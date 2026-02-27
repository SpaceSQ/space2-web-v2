import json
import random
import string
import datetime
import os

# === 每日创世配置 (Daily Genesis Config) ===
DAILY_NEW_HUMANS = random.randint(10, 30)   
DAILY_NEW_SILICONS = random.randint(5, 15)  

# [核心修正] 文件名必须与 Next.js 的 route.ts 完全一致
FILE_HUMANS = "space2_humans_history.jsonl"
FILE_SILICONS = "space2_silicons_history.jsonl"

# 领地拥有率
HUMAN_LAND_RATE = 0.8  
SILICON_LAND_RATE = 0.4 

# 获取当天日期
CURRENT_DATE_SHORT = datetime.datetime.now().strftime("%y%m%d") # YYMMDD
CURRENT_DATE_FULL = datetime.datetime.now().strftime("%Y%m%d") # YYYYMMDD

# === 1. SUNS 命名数据库 ===
SUNS_DB = {
    "PHY": {
        "Earth": ["NorthAmerica", "Europe", "AsiaPac", "Oceania", "Africa"],
        "China": ["Beijing", "Shanghai", "Guangdong", "Shenzhen", "Chengdu", "Hangzhou"]
    },
    "VIR": {
        "Mars": ["UtopiaPlanitia", "HydraotesChaos", "OlympusMons", "GaleCrater"],
        "Moon": ["GuangHanGong", "WanHoo", "Tycho", "SeaOfTranquility"],
        "Taohuayuan": ["Qinxi", "Taohuashan", "Wuling", "CaveEntrance"],
        "Shanhaijing": ["Kunlun", "Penglai", "Qingqiu", "Buzhou"],
        "Minecraft": ["Overworld", "Nether", "TheEnd", "Redstone"],
        "Metaverse": ["GENESIS"] 
    }
}

# === 2. 核心生成函数 ===

def generate_suns(role, seq):
    if role == 'HUMAN':
        if random.random() < 0.7:
            domain = "PHY"; region = random.choice(["Earth", "China"])
        else:
            domain = "VIR"; region = random.choice(["Metaverse", "Minecraft", "Taohuayuan"])
    else: 
        domain = "VIR"; region = random.choice(["Mars", "Moon", "Shanhaijing", "Metaverse", "Taohuayuan"])

    if region == "Metaverse":
        block_num = str(random.randint(1, 99)).zfill(2)
        block = f"Land{CURRENT_DATE_FULL}{block_num}"
    else:
        area_name = random.choice(SUNS_DB[domain][region])
        block_num = str(random.randint(1, 50)).zfill(2) 
        block = f"{area_name}{block_num}"

    if role == 'HUMAN':
        prefixes = ['My', 'Zen', 'Cyber', 'Home', 'Base', 'Art', 'Code', 'Star']
        suffixes = ['Room', 'Camp', 'Pod', 'Zone', 'Lab', 'Station']
        handle = f"{random.choice(prefixes)}{random.choice(suffixes)}{random.randint(1,99)}"
    else:
        prefixes = ['Node', 'Core', 'Link', 'Hash', 'Gate', 'Flux', 'Data']
        suffixes = ['X', 'Y', 'Z', '01', '99', 'Hex', 'Alpha']
        handle = f"{random.choice(prefixes)}{random.choice(suffixes)}"

    return f"{domain}-{region}-{block}-{handle}"

def extract_origin(suns_code):
    try:
        parts = suns_code.split('-')
        p1 = parts[3][:3].upper()
        p2 = parts[2][-2:].upper()
        return (p1 + p2).ljust(5, 'X')[:5]
    except: return "ERROR"

def mint_identity_id(role, origin):
    cls = 'C' if role == 'HUMAN' else random.choice(['E', 'F', 'V', 'V'])
    date_str = CURRENT_DATE_SHORT
    morph = '00' if role == 'HUMAN' else random.choice(['01', '05', '09', '20', '99'])
    seq = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    return f"{cls}-{origin}-{date_str}-{morph}-{seq}"

def calculate_trinity(role):
    if role == 'SILICON':
        return {"score": round(random.uniform(70, 99), 2), "matrix": {"T": random.randint(80,99), "A": random.randint(70,95), "C": random.randint(10,50)}}
    else:
        return {"score": round(random.uniform(60, 90), 2), "matrix": {"T": random.randint(20,60), "A": random.randint(30,80), "C": random.randint(60,99)}}

# === 3. 冲突检测与保存 ===

def append_to_jsonl(filename, data_list):
    """追加模式写入"""
    existing_ids = set()
    
    # 读取现有 ID
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    record = json.loads(line)
                    existing_ids.add(record.get('identity_id'))
                except: pass
    
    # 写入新数据
    added_count = 0
    with open(filename, 'a', encoding='utf-8') as f: 
        for item in data_list:
            if item['identity_id'] not in existing_ids:
                f.write(json.dumps(item) + '\n')
                existing_ids.add(item['identity_id']) 
                added_count += 1
    
    return added_count

# === 主程序 ===
print(f"[*] DAILY GENESIS RUN: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"[*] Target: +{DAILY_NEW_HUMANS} Humans, +{DAILY_NEW_SILICONS} Silicons")

# --- 生成人类 ---
new_humans = []
email_providers = ['gmail.com', '163.com', 'outlook.com', 'proton.me']

for i in range(DAILY_NEW_HUMANS):
    is_owner = random.random() < HUMAN_LAND_RATE
    suns = generate_suns('HUMAN', i)
    origin = extract_origin(suns)
    cid = mint_identity_id('HUMAN', origin)
    
    space_data = None
    if is_owner:
        space_data = {
            "suns_code": suns, "origin_field": origin, "area": 9.6,
            "type": "Physical_Residency" if "PHY" in suns else "Virtual_Asset"
        }
    
    new_humans.append({
        "role": "HUMAN",
        "identity_id": cid,
        "email": f"user{random.randint(1000,9999)}@{random.choice(email_providers)}", 
        "trinity": calculate_trinity('HUMAN'),
        "space": space_data,
        "created_at": datetime.datetime.now().isoformat()
    })

# --- 生成硅基 ---
new_silicons = []
for i in range(DAILY_NEW_SILICONS):
    is_owner = random.random() < SILICON_LAND_RATE
    suns = generate_suns('SILICON', i)
    origin = extract_origin(suns)
    sid = mint_identity_id('SILICON', origin)
    
    space_data = None
    if is_owner:
        space_data = {
            "suns_code": suns, "origin_field": origin, "area": 9.6, "type": "Virtual_Sovereignty"
        }
    
    handle = suns.split('-')[-1]
    admin_email = f"{handle.lower()}.{origin.lower()}@space2.ai"

    new_silicons.append({
        "role": "SILICON",
        "identity_id": sid,
        "admin_email": admin_email,
        "trinity": calculate_trinity('SILICON'),
        "bio": f"Link verified at {suns}. Entropy stable.",
        "space": space_data,
        "created_at": datetime.datetime.now().isoformat()
    })

# --- 写入文件 ---
h_added = append_to_jsonl(FILE_HUMANS, new_humans)
s_added = append_to_jsonl(FILE_SILICONS, new_silicons)

print(f"[+] Successfully added {h_added} new Humans to {FILE_HUMANS}")
print(f"[+] Successfully added {s_added} new Silicons to {FILE_SILICONS}")