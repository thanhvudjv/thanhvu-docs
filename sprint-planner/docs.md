# Sprint Planner – Tài liệu thiết kế & hướng dẫn sử dụng

> Công cụ lập kế hoạch sprint dựa trên capacity BA / Dev Backend / Dev Frontend / Tester,  
> kết hợp ràng buộc môi trường Jackfruit → Develop → Staging → Production và phân bổ effort theo tuần.

---

## 1. Mục tiêu & Bối cảnh

### 1.1. Bối cảnh

- Release **1 lần / tháng**.
- Mỗi sprint có thể dài **4 hoặc 5 tuần** (tùy tháng).
- Trước khi release lên **Production**, mỗi ticket phải đi qua chuỗi môi trường:
  - `Jackfruit → Develop → Staging → Master (Production)`.
- **Tuần cuối** của sprint:
  - Dành cho verify trên **Staging**.
  - **Thứ 6 cuối tuần cuối**:
    - ~13:00: merge & deploy Production.
    - Sau ~2 tiếng: Tester verify trên môi trường **Master (Production)**.

Cấu trúc team:

- **5 Tester**
- **3 Dev Backend**
- **3 Dev Frontend**
- **2 BA**

Yêu cầu:

- Mỗi tháng có danh sách **ticket ưu tiên** (P1, P2, P3) theo thứ tự từ trên xuống.
- Không thể làm hết toàn bộ list → cần **chọn subset ticket**:
  - Không vượt **capacity** từng role (BA/BE/FE/Tester).
  - Tôn trọng **thứ tự ưu tiên**.
  - Đảm bảo **timeline theo tuần**.
  - Tôn trọng **dependency giữa Dev & Tester** (Coding xong mới test, v.v.).

### 1.2. Vấn đề cần giải quyết

1. Chỉ nhìn **tổng effort** theo role cả sprint:
   - Có thể “đủ tổng md”, nhưng bị **nghẽn theo tuần** (ví dụ tuần 3 Tester overload).
2. Quá phụ thuộc “cảm giác” của leader:
   - Khó giải thích minh bạch với phía Nhật.
   - Khó chứng minh ticket nào nên / không nên đưa vào sprint.

### 1.3. Mục tiêu của Sprint Planner

- Chuẩn hoá **cách estimate**:
  - BE/FE/Tester estimate theo **hạng mục chi tiết** (Study, Coding, CreateTC, Execution Jackfruit…).
- Tính toán **capacity** của từng role cho mỗi sprint.
- **Tự động quyết định** ticket nào nằm trong sprint:
  - Dựa trên **priority + order**.
  - Không vượt capacity của **BA/BE/FE/Tester** (có buffer).
- Thêm **chiều thời gian**:
  - Phân bổ effort theo **từng tuần**.
  - Kiểm tra tuần nào có nguy cơ **overload**.
- **Tùy biến**:
  - Thay đổi số người, số tuần, pattern Dev/Test mà **không cần sửa formula/phần mềm**.

Công nghệ sử dụng:

- **Google Sheet** + **Apps Script**:
  - Tạo cấu trúc sheet tự động.
  - Gắn sẵn công thức.
  - Có function tạo dữ liệu mẫu & clear dữ liệu.

---

## 2. Kiến trúc tổng thể

Hệ thống gồm các sheet:

1. `Guide` – hướng dẫn sử dụng.
2. `Capacity` – capacity của từng role.
3. `Config_TimePattern` – phân bổ effort theo tuần cho từng activity.
4. `Config_Dependency` – document các rule phụ thuộc giữa Dev/Tester/BA.
5. `Backlog_Sprint_Plan` – nhập backlog & estimate; tính toán tự động.
6. `Weekly_Load` – tổng hợp effort theo tuần.

Các function Apps Script chính:

- `setupSprintPlanningSheets()`: tạo / reset toàn bộ cấu trúc sheet & công thức.
- `generateSampleTickets()`: sinh ra khoảng **30 ticket mẫu** để demo.
- `clearSampleTickets()`: xóa dữ liệu ticket (giữ nguyên công thức & cấu trúc).

Quan hệ:

- `Backlog_Sprint_Plan`:
  - Đọc **capacity** từ `Capacity`.
  - Đọc **pattern theo tuần** từ `Config_TimePattern`.
  - Tính effort tổng, effort theo tuần, cumulative, và `Selected`.
- `Weekly_Load`:
  - Tổng effort theo tuần (chỉ lấy các ticket `Selected = "YES"`).

---

## 3. Chi tiết từng sheet

### 3.1. Sheet `Guide`

**Mục đích:**  
Tóm tắt vai trò của từng sheet & cách nhập dữ liệu.

**Nội dung:**  
Mỗi dòng là một sheet, gồm:

- `Sheet`: tên sheet.
- `Mục đích`: sheet dùng làm gì.
- `Cách nhập dữ liệu`: nhập cột nào, cột nào auto.

> Người mới chỉ cần đọc sheet này là nắm bức tranh tổng thể.

---

### 3.2. Sheet `Capacity` – Sức chứa theo role

**Mục đích:**  
Định nghĩa **capacity** của từng role trong sprint (theo man-day).

**Cấu trúc:**

| Role         | Headcount | WorkingDays | FocusRate | Gross_MD           | Usable_MD        |
|--------------|-----------|-------------|-----------|--------------------|------------------|
| BA           | 2         | 20 / 25     | 0.6       | =B2*C2*D2          | =E2*0.85         |
| Dev Backend  | 3         | 20 / 25     | 0.7       | =B3*C3*D3          | =E3*0.85         |
| Dev Frontend | 3         | 20 / 25     | 0.7       | =B4*C4*D4          | =E4*0.85         |
| Tester       | 5         | 20 / 25     | 0.7       | =B5*C5*D5          | =E5*0.85         |

**Giải thích:**

- `Headcount`: Số người của mỗi role.
- `WorkingDays`:
  - Sprint 4 tuần: ~20 ngày.
  - Sprint 5 tuần: ~25 ngày (sau khi trừ ngày nghỉ).
- `FocusRate`:
  - Phần trăm thời gian dành cho task sprint (phần còn lại là họp, support…).
  - Gợi ý:
    - Dev / Tester: ~0.7
    - BA: ~0.6
- `Gross_MD`:
  - Man-day lý thuyết = `Headcount × WorkingDays × FocusRate`.
- `Usable_MD`:
  - Man-day **thực sự dùng để planning**, sau khi trừ buffer (~15%).
  - Dùng làm **mốc so sánh** với tổng effort của ticket.

**Khi cần chỉnh:**

- Thay đổi số người trong role.
- Thay đổi length sprint (4 / 5 tuần).
- Muốn chỉnh buffer hoặc FocusRate.

---

### 3.3. Sheet `Config_TimePattern` – Phân bổ Effort theo tuần

**Mục đích:**  
Định nghĩa **pattern thời gian** cho từng activity: hoạt động diễn ra ở tuần nào, chiếm bao nhiêu % effort.

**Cấu trúc:**

| Role         | Activity      | W1  | W2  | W3  | W4  |
|--------------|---------------|-----|-----|-----|-----|
| Dev Backend  | BE_Study      | 1   | 0   | 0   | 0   |
| Dev Backend  | BE_Meeting    | 0.7 | 0.3 | 0   | 0   |
| Dev Backend  | BE_Coding     | 0.6 | 0.4 | 0   | 0   |
| Dev Backend  | BE_SelfTest   | 0   | 1   | 0   | 0   |
| Dev Backend  | BE_Review     | 0   | 0.5 | 0.5 | 0   |
| Dev Backend  | BE_FixBUG     | 0   | 0   | 0.4 | 0.6 |
| Dev Frontend | FE_Study      | 1   | 0   | 0   | 0   |
| Dev Frontend | FE_Meeting    | 0.7 | 0.3 | 0   | 0   |
| Dev Frontend | FE_Coding     | 0.6 | 0.4 | 0   | 0   |
| Dev Frontend | FE_SelfTest   | 0   | 1   | 0   | 0   |
| Dev Frontend | FE_Review     | 0   | 0.5 | 0.5 | 0   |
| Dev Frontend | FE_FixBUG     | 0   | 0   | 0.4 | 0.6 |
| Tester       | QA_Study      | 1   | 0   | 0   | 0   |
| Tester       | QA_Meeting    | 0.7 | 0.3 | 0   | 0   |
| Tester       | QA_CreateTC   | 0.7 | 0.3 | 0   | 0   |
| Tester       | QA_Review     | 0.5 | 0.5 | 0   | 0   |
| Tester       | QA_Exec_JF    | 0   | 0.4 | 0.6 | 0   |
| Tester       | QA_Exec_Dev   | 0   | 0   | 0.4 | 0.6 |
| Tester       | QA_Exec_Stg   | 0   | 0   | 0   | 1   |
| Tester       | QA_Exec_Mst   | 0   | 0   | 0   | 1   |

**Ý tưởng:**

- Mỗi activity có tổng `W1 + W2 + W3 + W4 ≈ 1`.
- Ví dụ:
  - `QA_Exec_JF`: 40% ở Week 2, 60% ở Week 3.
  - `QA_Exec_Stg`: 100% ở Week 4 (tuần verify Staging & gần release).
  - `BE_Coding`: chủ yếu ở Week 1–2.

**Tác dụng:**

- Các cột `BE_Wx`, `FE_Wx`, `QA_Wx` trong `Backlog_Sprint_Plan` sẽ dùng pattern này để tính:
  - `BE_W1_MD` = `BE_Study*W1 + BE_Meeting*W1 + …`
- Chỉ cần sửa pattern ở đây, toàn bộ planning theo tuần sẽ **tự cập nhật**.

---

### 3.4. Sheet `Config_Dependency` – Rule Phụ Thuộc Dev/Tester/BA

**Mục đích:**  
Ghi lại các **quy tắc phụ thuộc** giữa công việc của Dev / Tester / BA.

**Ví dụ cấu trúc:**

| Role    | Activity     | DependsOnRole | DependsOnActivity         | Notes                                                     |
|---------|--------------|---------------|---------------------------|-----------------------------------------------------------|
| Tester  | QA_Exec_JF   | Dev Backend   | BE_Coding+BE_SelfTest     | Chỉ test Jackfruit sau khi code xong & reflect lên JF     |
| Tester  | QA_Exec_JF   | Dev Frontend  | FE_Coding+FE_SelfTest     | Tương tự cho FE                                          |
| Tester  | QA_Exec_Dev  | Dev Backend   | BE_Coding (merged Dev)    | Chỉ test Develop sau khi merge & deploy lên Develop      |
| Tester  | QA_Exec_Stg  | Dev Backend   | BE_Review+BE_FixBUG       | Staging chỉ test sau khi fix bug blocker                 |
| Tester  | QA_Exec_Mst  | Dev Backend   | Release Prod              | Test Prod sau khi release thứ 6 tuần cuối               |
| Tester  | QA_CreateTC  | BA            | Spec Overview/Detail      | Có thể làm song song với Dev_Coding nếu spec clear      |
| Dev BE  | BE_Coding    | BA            | Spec Overview             | Bắt đầu coding sau khi BA overview                       |
| Dev FE  | FE_Coding    | BA            | Spec Overview             | Tương tự cho FE                                          |

Hiện tại:

- Sheet này mang tính **document**.
- Các rule được **gián tiếp phản ánh** trong `Config_TimePattern` (ví dụ: QA_Exec_Stg chỉ ở W4).

> Có thể mở rộng trong tương lai: thêm logic check “warning” nếu vi phạm dependency.

---

### 3.5. Sheet `Backlog_Sprint_Plan` – Lập kế hoạch sprint

**Mục đích:**  
Là nơi **nhập backlog & estimate**, đồng thời để hệ thống:

- Tính **tổng effort** per role.
- Tính **effort theo tuần**.
- Tính **cộng dồn** effort.
- Xác định **ticket nào được chọn** vào sprint (`Selected = YES`).

#### 3.5.1. Các nhóm cột chính

1. **Thông tin cơ bản:**
   - `Order`: Thứ tự ưu tiên (1,2,3…)
   - `Ticket`: Mã ticket (VD: SM0001).
   - `Priority`: P1, P2, P3…
   - `BA_Est_MD`: effort BA sơ bộ (man-day).

2. **Dev Backend (BE):**
   - `BE_Study`
   - `BE_Meeting`
   - `BE_Coding`
   - `BE_SelfTest`
   - `BE_Review`
   - `BE_FixBUG`
   - `BE_Total_MD` (tự tính = tổng các activity BE_***).

3. **Dev Frontend (FE):**
   - `FE_Study`
   - `FE_Meeting`
   - `FE_Coding`
   - `FE_SelfTest`
   - `FE_Review`
   - `FE_FixBUG`
   - `FE_Total_MD` (tự tính).

4. **Tester (QA):**
   - `QA_Study`
   - `QA_Meeting`
   - `QA_CreateTC`
   - `QA_Review`
   - `QA_Exec_JF` (Jackfruit)
   - `QA_Exec_Dev` (Develop)
   - `QA_Exec_Stg` (Staging)
   - `QA_Exec_Mst` (Master/Prod)
   - `QA_Total_MD` (tự tính).

5. **Effort theo tuần (Weekly):**
   - Backend:
     - `BE_W1_MD`, `BE_W2_MD`, `BE_W3_MD`, `BE_W4_MD`
     - Tính từ `BE_*` × pattern trong `Config_TimePattern`.
   - Frontend:
     - `FE_W1_MD` … `FE_W4_MD`
   - Tester:
     - `QA_W1_MD` … `QA_W4_MD`

6. **Cộng dồn & Selected:**
   - `BA_Cum`: Tổng BA_Est_MD từ dòng 2 đến dòng hiện tại.
   - `BE_Cum`: Tổng BE_Total_MD tích lũy.
   - `FE_Cum`: Tổng FE_Total_MD tích lũy.
   - `QA_Cum`: Tổng QA_Total_MD tích lũy.
   - `Selected`:
     - `"YES"` nếu:
       - `BA_Cum ≤ Capacity!Usable_MD (BA)`
       - `BE_Cum ≤ Capacity!Usable_MD (BE)`
       - `FE_Cum ≤ Capacity!Usable_MD (FE)`
       - `QA_Cum ≤ Capacity!Usable_MD (Tester)`

#### 3.5.2. Ý nghĩa của `Selected`

- Sau khi **sort** theo `Priority` & `Order`:
  - Đi từ trên xuống, mỗi ticket làm tăng cumulative:
    - `BA_Cum`, `BE_Cum`, `FE_Cum`, `QA_Cum`.
- Nếu thêm ticket mới làm một trong các cumulative vượt `Usable_MD`:
  - `Selected` sẽ không là `"YES"` nữa.
- Danh sách ticket có `Selected = "YES"` chính là **Sprint Backlog**:
  - Bảo đảm không vượt capacity bất kỳ role nào.
  - Tôn trọng thứ tự ưu tiên.

---

### 3.6. Sheet `Weekly_Load` – Tải công việc theo tuần

**Mục đích:**  
Cho cái nhìn tổng quan về **tải effort mỗi tuần** của từng role:

- Dev Backend
- Dev Frontend
- Tester

**Cấu trúc:**

| Role         | Week1_MD                                              | Week2_MD                                              | Week3_MD                                              | Week4_MD                                              |
|--------------|-------------------------------------------------------|-------------------------------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| Dev Backend  | SUM `BE_W1_MD` của ticket `Selected="YES"`            | SUM `BE_W2_MD` của ticket `Selected="YES"`            | …                                                     | …                                                     |
| Dev Frontend | SUM `FE_W1_MD` của ticket `Selected="YES"`            | SUM `FE_W2_MD` của ticket `Selected="YES"`            | …                                                     | …                                                     |
| Tester       | SUM `QA_W1_MD` của ticket `Selected="YES"`            | SUM `QA_W2_MD` của ticket `Selected="YES"`            | …                                                     | …                                                     |

**Cách dùng:**

- So sánh `WeekX_MD` với:
  - `Capacity!Usable_MD(role) / 4` (hoặc chia lệch theo thực tế).
- Nếu:
  - Tester Week 3 = 120% target md/tuần → tuần 3 có nguy cơ overload.
- Khi đó:
  - Bỏ bớt 1–2 ticket ưu tiên thấp hơn.
  - Hoặc điều chỉnh pattern trong `Config_TimePattern`.
  - Hoặc chuẩn bị resource hỗ trợ/OT có chủ đích.

---

## 4. Apps Script & các function

> Code chi tiết đã được cung cấp trong phần trao đổi, ở đây mô tả ở mức “chức năng”.

### 4.1. `setupSprintPlanningSheets()`

- Tạo / reset các sheet:
  - `Guide`, `Capacity`, `Config_TimePattern`, `Config_Dependency`,
    `Backlog_Sprint_Plan`, `Weekly_Load`.
- Thêm:
  - **Header**
  - **Công thức**
  - **Notes giải thích** cho từng cột.

Chạy **1 lần** khi tạo file mới, hoặc khi muốn reset cấu trúc.

### 4.2. `generateSampleTickets()`

- Tạo khoảng **30 ticket mẫu** trong `Backlog_Sprint_Plan`:
  - `Order`: 1 → 30
  - `Ticket`: TK-001 → TK-030
  - `Priority`: P1 (1–10), P2 (11–20), P3 (21–30)
  - BE/FE/QA được gán effort theo 3 “cấp độ” (small / medium / large).
- Dùng để:
  - Demo cho team.
  - Kiểm tra xem `Selected`, `Weekly_Load` hoạt động đúng.

### 4.3. `clearSampleTickets()`

- Xoá sạch dữ liệu input người dùng trong `Backlog_Sprint_Plan`:
  - `Order`, `Ticket`, `Priority`, `BA_Est_MD`
  - Activity BE_*, FE_*, QA_*
- **Không xoá**:
  - Header
  - Công thức (Total, Weekly, Cum, Selected).

Dùng khi:

- Muốn xoá toàn bộ dữ liệu mẫu / sprint cũ và bắt đầu nhập sprint mới.

---

## 5. Quy trình đề xuất khi sử dụng thực tế

### 5.1. Lần đầu áp dụng

1. Tạo 1 Google Sheet mới cho “Sprint Planner”.
2. Vào **Extensions → Apps Script**:
   - Dán code Apps Script (có 3 function).
   - Chạy `setupSprintPlanningSheets()`.
3. (Tuỳ chọn) Chạy `generateSampleTickets()`:
   - Mở `Backlog_Sprint_Plan` & `Weekly_Load` để xem demo.

### 5.2. Trước mỗi sprint (Tuần -1)

1. **Cập nhật Capacity**:
   - Sửa `Headcount`, `WorkingDays`, `FocusRate` nếu có thay
