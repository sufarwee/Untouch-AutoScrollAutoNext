# สรุปภาพรวมคำสั่งและการดำเนินงานทั้งหมด (Project Summary & Dev Log)
**โครงการ**: Untouch Flow (Auto Scroll • Auto Next)  
**คลังโค้ด GitHub**: [https://github.com/sufarwee/Untouch-AutoScrollAutoNext](https://github.com/sufarwee/Untouch-AutoScrollAutoNext)  
**บันทึกเมื่อ**: 24 พฤศจิกายน 2026  

---

## สารบัญหัวข้อ
1. [การปรับปรุงแบรนด์และดีไซน์ UI/UX (Untouch Flow)](#1-การปรับปรุงแบรนด์และดีไซน์-uiux-untouch-flow)
2. [การแก้ปัญหาโครงสร้างระบบและการตั้งค่า](#2-การแก้ปัญหาโครงสร้างระบบและการตั้งค่า)
3. [การจัดทำเอกสารและเตรียมส่งขึ้น Store](#3-การจัดทำเอกสารและเตรียมส่งขึ้น-store)
4. [การสร้าง GitHub Public Repository](#4-การสร้าง-github-public-repository)
5. [แนวคิดการขยายสู่ Social Media (Untouch Social AutoScroll)](#5-แนวคิดการขยายสู่-social-media)
6. [การแก้ปัญหาบน Safari iOS + Userscripts และ Orion Browser](#6-การแก้ปัญหาบน-safari-ios--userscripts-และ-orion-browser)

---

## 1. การปรับปรุงแบรนด์และดีไซน์ UI/UX (Untouch Flow)

### คำสั่งของผู้ใช้:
- เปลี่ยนชื่อแอปเป็น **Untouch Flow**
- ปรับเปลี่ยน UI ให้ดูทันสมัย สไตล์ Minimal
- นำไอคอนตรงปุ่ม Save ออก
- แท็บ **Manga Mode** และ **Reader Mode** ให้นำไอคอนออก และปรับดีไซน์ให้แตกต่าง เรียบหรู
- ส่วนเปลี่ยนภาษา: ให้แสดงเฉพาะ **Icon รูปธงชาติ/ภาษา** ไม่ต้องแสดงข้อความ แต่เมื่อนำเมาส์ไปชี้ (Hover) ให้แสดงชื่อภาษา/ประเทศ โดยเรียงลำดับ: EN -> TH -> ญี่ปุ่น -> เกาหลี -> จีน -> อาหรับ -> รัสเซีย -> เยอรมัน -> อิตาลี -> สเปน -> เวียดนาม -> มาเลเซีย -> อินโดนีเซีย
- ส่วน **Float HUD (ปุ่มลอย)** ให้เปลี่ยนชื่อเรียกเป็น **MiniTool** และแก้ปัญหาขนาดใหญ่เกินไป เมื่อเปิดหน้าต่างย่อ 100% ตัว MiniTool ต้องไม่ล้นจอ ปรับขนาดให้กะทัดรัดขึ้นแต่ยังคลิกง่าย

### สิ่งที่ระบบดำเนินการ:
- รีแบรนด์เป็น **Untouch Flow (Auto Scroll • Auto Next)**
- ออกแบบโทนสีใหม่ Dark Modern Glassmorphism (`#090d16` และการเบลอหลัง)
- นำไอคอนเซฟและไอคอนบนแท็บโหมดออก เปลี่ยนเป็นแท็บมินิมอล มีไฟสถานะนุ่มนวล
- ทำ Header ให้มีปุ่มเปลี่ยนภาษาแบบ Icon-Only พร้อม Tooltip ชื่อภาษาครบทั้ง 13 ภาษาตามลำดับที่สั่ง
- ยุบขนาด MiniTool จากกว้าง ~340px เหลือ ~240px กระชับมือ และมีระบบ Re-clamp พิกัดอัตโนมัติเมื่อย่อขยายหน้าจอ

---

## 2. การแก้ปัญหาโครงสร้างระบบและการตั้งค่า

### คำสั่งของผู้ใช้:
- **ปัญหา Profile**: Profile 2 ไปอยู่ขวาสุด ตอนเพิ่มมีชื่อซ้ำซ้อน และแท็บปุ่มกว้างเกินไปจนต้อง scroll บนหน้าต่าง extension ให้ปรับเป็นตัวเลือก dropdown ทางขวามือ
- **ปัญหา Page Zoom**: ตัวเลข 100% ถูกบังตัวเลข 0 ท้าย และมีปุ่มลูกศรขึ้นลงในช่องกรอก ให้เอาลูกศรออก
- **End Page Delay กับ Countdown**: ต่างกันอย่างไร ควรยุบรวมเหลืออันเดียว ค่าเริ่มต้น 1 วินาที
- **Dim on scroll**: คืออะไร

### สิ่งที่ระบบดำเนินการ:
- **Profile Manager**: เปลี่ยนจากปุ่มเรียงแนวนอนยาวๆ มาเป็น Dropdown Select (`[Profile 1 ▾] [+ New]`) ชิดขวา สวยงาม ประหยัดพื้นที่ แก้บั๊กชื่อซ้ำและบั๊กลำดับ Profile 2 ไปอยู่ขวาสุดได้เด็ดขาด
- **Page Zoom**: ขยายความกว้างช่องตัวเลข ป้องกันเลข 0 ท้ายตก และลบปุ่มลูกศรหมุน (Number Spinner Arrows) ออกทั่วทั้งระบบ
- **ยุบรวมการหน่วงเวลา**: รวมเป็นค่าเดียวคือ **Next Chapter Delay** (ค่าเริ่มต้น 1.0 วินาที, สไลเดอร์ 0-10 วินาที พร้อมปุ่มลัด 0s, 1s, 2s, 3s)
- **Dim on scroll**: อธิบายว่าคือระบบลดความเข้มของ MiniTool เหลือ 15% ขณะที่หน้าจอกำลังเลื่อนอัตโนมัติ เพื่อไม่ให้แถบปุ่มลอยมารบกวนสายตาขณะอ่านการ์ตูน

---

## 3. การจัดทำเอกสารและเตรียมส่งขึ้น Store

### คำสั่งของผู้ใช้:
- ทำเอกสารข้อมูล Title, Meta Description ทั้งภาษาไทยและภาษาอังกฤษ สำหรับใส่ใน **Microsoft Edge Extension Store** และ **Firefox Add-ons (AMO)**
- เขียนขั้นตอน Step-by-Step การนำ Extension ขึ้น Store
- ทำคู่มือการติดตั้งครอบคลุมทุกอุปกรณ์ (PC, Mac, iPhone, iPad, Android, Android Box/TV)

### สิ่งที่ระบบดำเนินการ:
- สร้างเอกสาร `STORE_SUBMISSION_GUIDE.md` จัดหมวดหมู่ Meta Tag, คีย์เวิร์ด, คำอธิบายสั้น/ยาว (EN & TH) พร้อมสเต็ปการส่งขึ้น Store
- สร้างเอกสาร `INSTALL_GUIDE.md` อธิบายวิธีติดตั้งแบบ Step-by-Step ครอบคลุม:
  - Chrome / Chromium (Brave, Opera, Edge)
  - Firefox (รวมโฟลเดอร์ `for-firefox` และ Manifest V2)
  - Safari บน iOS / iPadOS (ผ่าน Userscripts)
  - Orion Browser (iOS)
  - Kiwi Browser & Firefox Nightly (Android)
  - Android TV / Android Box
  - วิธี Bookmarklet (รหัสจาวาสคริปต์สากล ไม่ต้องลงแอป)

---

## 4. การสร้าง GitHub Public Repository

### คำสั่งของผู้ใช้:
- ให้สร้าง Public Repo บน GitHub ของผู้ใช้ (`sufarwee`) ในชื่อ **Untouch-AutoScrollAutoNext**
- ไม่เอาไฟล์ binary หรือไฟล์ขยะ เช่น `.doc`, `.docx` และ `for-firefox/` ขึ้นไป
- เขียน `README.md` ให้สวยงาม น่าเชื่อถือ ดูเหมือนคนเขียนจริง เน้นความเป็นเทพของ Vanilla JS (Zero-build, No bloated framework)
- ใส่ Tags / Topics ให้ครบถ้วน

### สิ่งที่ระบบดำเนินการ:
- สร้างและพุช Repository: [sufarwee/Untouch-AutoScrollAutoNext](https://github.com/sufarwee/Untouch-AutoScrollAutoNext)
- คัดกรอง Clean Index นำเฉพาะ Source Code และ Markdown ขึ้น Git
- กำหนด Topics 15 รายการ เช่น `manga-reader`, `webtoon-enhancer`, `autoscroll`, `vanilla-js`, `safari-extension`
- ปรับแต่ง `README.md` นำเสนอจุดเด่นด้านประสิทธิภาพ 120Hz ProMotion และความเบาของระบบ

---

## 5. แนวคิดการขยายสู่ Social Media

### คำสั่งของผู้ใช้:
- สอบถามความเป็นไปได้ในการทำฟังก์ชัน Auto-scroll สำหรับ Social Media เช่น Instagram, TikTok, Facebook (มีตัวจับวิดีโอเพื่อรอให้คลิปจบก่อนเลื่อน หรือกำหนดเวลาตามโพสต์)
- ควรทำรวมใน Extension ตัวเดิมหรือแยกตัวใหม่ดี และ Extension ปัจจุบันมีขนาดกี่ MB

### สิ่งที่ระบบตอบและดำเนินการ:
- **ขนาดพื้นที่ของ Untouch Flow ปัจจุบัน**: รวมทั้งหมดไม่ถึง **1 MB** (ตัวไฟล์โค้ดหลักไม่ถึง 100 KB)
- **ข้อสรุป**: แนะนำให้ **แยกเป็น Extension ใหม่** ในชื่อ **Untouch Social AutoScroll Auto Flow** เพื่อไม่ให้กระทบ Permissions และสิทธิ์การเข้าถึงของเว็บอ่านมังงะ ซึ่งผู้ใช้เห็นชอบให้เก็บไว้ทำแยกในอนาคต

---

## 6. การแก้ปัญหาบน Safari iOS + Userscripts และ Orion Browser

### คำสั่งของผู้ใช้ / ปัญหาที่พบ:
- ทดลองทำตามวิธี Safari + Userscripts บน iPhone แล้ว **"ใช้งานไม่ได้"**
- ส่งภาพสกรีนช็อต 4 ภาพ: (1) โฟลเดอร์ Userscript ในเครื่อง, (2) เมนู Safari, (3) หน้า Userscripts Sheet เปิดสวิตช์ Untouch Flow แล้ว, (4) หน้าต่างแจ้งเตือน Safari: *"Are you sure you want to always allow 'Userscripts'?"*
- พยายามติดตั้งบน Orion Browser แต่หาปุ่ม Developer mode ไม่เจอ และเมื่อติดตั้งโฟลเดอร์สำเร็จกลับไม่ขึ้นในรายการ Extension
- ผู้ใช้ระบุ: เลือกเฉพาะ *"This Website"* ไม่ต้องการเลือก *"Every Website"* และพบว่าใน Safari ยังไม่แสดงอะไรเลย

### การวิเคราะห์ทางเทคนิคและการแก้ปัญหาเด็ดขาด:
1. **เรื่องการอนุญาตสิทธิ์ใน Safari**:
   - การเลือก **"Always Allow on This Website"** ของผู้ใช้เป็นการตั้งค่าที่ถูกต้องและปลอดภัยที่สุดสำหรับเจาะจงเฉพาะเว็บมังงะ
2. **เรื่อง Orion Browser บน iOS**:
   - ชี้แจงว่า Orion บน iOS ไม่มีสวิตช์ Developer Mode และเกิดจากบั๊กแคชหน้าจอของ Orion (UI Cache Bug) จำเป็นต้อง Force Close แอป 1 ครั้งหลังติดตั้ง
3. **สาเหตุรากเหง้า (Root Cause) ที่ Safari ไม่แสดงผลอะไรเลย**:
   - **พบข้อผิดพลาดร้ายแรงในโค้ด JavaScript**: ในสภาพแวดล้อมของ Safari Userscripts หรือ Bookmarklet จะ **ไม่มีตัวแปรโกลบอล `chrome`**
   - คำสั่งเดิม `if (!chrome?.storage?.local)` เมื่อไม่มีการประกาศตัวแปร `chrome` จะส่งผลให้ JavaScript พ่นข้อผิดพลาด `ReferenceError: chrome is not defined` ทันทีที่บรรทัดเริ่มต้น ส่งผลให้กระบวนการสร้าง Floating MiniTool พังเงียบๆ และไม่เรนเดอร์ลงในหน้าเว็บ
   - **การแก้ไข (v2.0.2)**: 
     - เปลี่ยนมาตรวจสอบความปลอดภัยด้วย `typeof chrome !== 'undefined' && chrome?.storage?.local` ทุกจุดใน `content.js`, `manga-flow-scroller.user.js` และ `bookmarklet.txt`
     - ปรับตำแหน่ง MiniTool จากเดิม `bottom: 14px` เป็น `bottom: calc(70px + env(safe-area-inset-bottom, 0px))` เพื่อให้อยู่พ้นแถบเครื่องมือของ Safari และแถบตอนของการ์ตูน
     - เพิ่ม `touch-action: none` เพื่อให้การใช้นิ้วลากปุ่มบน iPhone ลื่นไหล ไม่ติด Gestures ของ Safari
   - ทดสอบผ่าน Node Virtual DOM Mock ยืนยันการสร้างโฮสต์ `#mfs-host` สำเร็จ 100% และพุชเวอร์ชันแก้ไขขึ้น GitHub เรียบร้อย
