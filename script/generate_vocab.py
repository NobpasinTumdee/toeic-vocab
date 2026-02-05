import json
import time
import nltk
# เปลี่ยนจาก googletrans มาใช้ deep_translator
from deep_translator import GoogleTranslator
from nltk.tag import pos_tag

# --- Setup: โหลดโมเดลสำหรับแยกประเภทคำ ---
print("กำลังเตรียมระบบแยกประเภทคำ...")
try:
    # ลองโหลดแบบใหม่
    nltk.download('averaged_perceptron_tagger_eng', quiet=True)
except:
    # ถ้าไม่ได้ ลองโหลดแบบเก่า (กันเหนียว)
    nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('universal_tagset', quiet=True)

# --- ฟังก์ชันแยกประเภทคำ ---
def get_part_of_speech(word):
    try:
        # ส่ง word เป็น list เข้าไปตรงๆ
        tag = pos_tag([word])[0][1]
        
        # Mapping รหัสย่อให้เป็นคำเต็ม
        if tag.startswith('N'): return 'noun'
        if tag.startswith('V'): return 'verb'
        if tag.startswith('J'): return 'adjective'
        if tag.startswith('R'): return 'adverb'
        if tag.startswith('PR'): return 'pronoun'
        if tag.startswith('IN'): return 'preposition'
        return 'other'
    except Exception as e:
        return 'unknown'

def main():
    # 1. อ่านไฟล์ Source
    try:
        with open('oxford_source.txt', 'r', encoding='utf-8') as f:
            raw_words = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print("❌ หาไฟล์ oxford_source.txt ไม่เจอ!")
        return

    # สร้าง Translator เตรียมไว้
    translator = GoogleTranslator(source='en', target='th')
    output_list = []
    
    print(f"เจอคำศัพท์ทั้งหมด {len(raw_words)} คำ กำลังเริ่มทำงาน...")

    # 2. วนลูปประมวลผล
    for index, word_eng in enumerate(raw_words):
        try:
            # A. หา Part of Speech
            pos = get_part_of_speech(word_eng)

            # B. แปลภาษา (ใช้คำสั่งของ deep-translator)
            word_thai = translator.translate(word_eng)

            # C. สร้าง Object
            item = {
                "id": index + 1,
                "word_eng": word_eng,
                "word_thai": word_thai,
                "part_of_speech": pos
            }
            
            output_list.append(item)
            
            # Print ดูผลลัพธ์
            print(f"[{index+1}/{len(raw_words)}] {word_eng} -> {word_thai} ({pos})")

            # D. พักนิดหน่อย (deep-translator จัดการ connection ดีกว่า แต่พักไว้หน่อยก็ดีครับ)
            time.sleep(0.2)

        except Exception as e:
            print(f"⚠️ Error ที่คำว่า '{word_eng}': {e}")
            # ถ้า Error ให้ใส่เป็นค่าว่างไปก่อน จะได้ไม่หยุดทำงาน
            item = {
                "id": index + 1,
                "word_eng": word_eng,
                "word_thai": "",
                "part_of_speech": pos
            }
            output_list.append(item)

    # 3. บันทึกไฟล์
    with open('words.json', 'w', encoding='utf-8') as f:
        json.dump(output_list, f, ensure_ascii=False, indent=4)

    print("\n✅ เสร็จเรียบร้อย! ไฟล์ถูกบันทึกที่ words.json")

if __name__ == "__main__":
    main()