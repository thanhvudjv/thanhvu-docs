# Hướng dẫn chỉnh `Config_TimePattern` theo thực tế của team

> Mục tiêu: Giúp team tự điều chỉnh `Config_TimePattern` sao cho phản ánh đúng **cách làm việc thực tế**, từ đó:
> - Phân bổ effort theo tuần hợp lý hơn
> - Weekly_Load dễ “bắt bệnh” nghẽn ở tuần nào
> - Sprint plan bám sát reality hơn, không chỉ là lý thuyết

---

## 1. `Config_TimePattern` là gì?

Sheet `Config_TimePattern` có dạng:

| Role         | Activity      | W1  | W2  | W3  | W4  |
|--------------|---------------|-----|-----|-----|-----|
| Dev Backend  | BE_Study      | 1   | 0   | 0   | 0   |
| Dev Backend  | BE_Coding     | 0.6 | 0.4 | 0   | 0   |
| Tester       | QA_CreateTC   | 0.7 | 0.3 | 0   | 0   |
| Tester       | QA_Exec_JF    | 0   | 0.4 | 0.6 | 0   |
| Tester       | QA_Exec_Stg   | 0   | 0   | 0   | 1   |

**Ý nghĩa:**

- Mỗi dòng là **1 loại công việc** (activity) của 1 role.
- `W1..W4` là **tỉ lệ effort** của activity đó rơi vào từng tuần.

Ví dụ:

- Activity: `QA_Exec_JF`  
  Pattern: `W1=0, W2=0.4, W3=0.6, W4=0`

Nếu một ticket có `QA_Exec_JF = 5 md`, thì:

- Week 2 nhận: `5 × 0.4 = 2 md`
- Week 3 nhận: `5 × 0.6 = 3 md`

> Nói ngắn gọn: **Config_TimePattern mô tả “hành vi chuẩn” của team theo tuần**,  
> dev/test chỉ estimate tổng md cho từng activity, việc trải theo tuần do pattern lo.

---

## 2. Nguyên tắc chung khi chỉnh Time Pattern

### 2.1. Tổng W1 + W2 + W3 + W4 ≈ 1

- Để dễ hiểu, nên thiết kế sao cho **tổng 4 cột ~ 1.0**.
- Nếu hơn hoặc kém một chút (0.9, 1.1) vẫn được, nhưng tránh chênh quá lớn.

### 2.2. Mỗi activity trả lời 2 câu hỏi

Khi chỉnh từng dòng, hãy tự hỏi:

1. Activity này **bắt đầu từ tuần mấy** một cách hợp lý?
2. Activity này **kéo dài bao lâu** và **đỉnh điểm ở tuần nào**?

Ví dụ:

- `BE_Study`: hầu như tuần 1 ⇒ (1, 0, 0, 0)
- `BE_Coding`: từ W1 đến W2 (và chút W3) ⇒ (0.4, 0.4, 0.2, 0)
- `QA_Exec_Stg`: sát release ⇒ (0, 0, 0, 1)

### 2.3. Ràng buộc logic (để không “ngược đời”)

- Những cái **phải sớm**:
  - Study, họp share spec, create test case ⇒ W1–W2.
- Những cái **phải sau coding**:
  - QA_Exec_JF, QA_Exec_Dev ⇒ W2–W3–W4, không nên có ở W1.
- Những cái **gắn với tuần cuối**:
  - QA_Exec_Stg, QA_Exec_Mst, fix bug cuối ⇒ W4 là chủ yếu.

---

## 3. Gợi ý pattern cho từng nhóm activity

### 3.1. Dev Backend / Dev Frontend

#### 3.1.1. Study

**Mô tả:** Đọc spec, đọc code cũ, hiểu overall.

Gợi ý pattern chuẩn:

| Activity  | W1  | W2 | W3 | W4 |
|-----------|-----|----|----|----|
| \*_Study  | 1.0 | 0  | 0  | 0  |

**Khi nào chỉnh?**

- Nếu team thường phải “ngâm” backlog lâu, có thể:  
  `(0.8, 0.2, 0, 0)` – vẫn giữ đa số ở W1.

---

#### 3.1.2. Meeting (share viewpoint/spec)

**Mô tả:** Họp daily, họp share spec, align scope.

Pattern mặc định:

| Activity   | W1  | W2  | W3 | W4 |
|------------|-----|-----|----|----|
| \*_Meeting | 0.7 | 0.3 | 0  | 0  |

**Khi nào chỉnh?**

- Nếu team hay phải clarify giữa sprint, có thể:

| W1  | W2  | W3  | W4 |
|-----|-----|-----|----|
| 0.6 | 0.3 | 0.1 | 0  |

---

#### 3.1.3. Coding

**Mặc định (team start sớm, spec khá rõ):**

| Activity  | W1  | W2  | W3 | W4 |
|-----------|-----|-----|----|----|
| \*_Coding | 0.6 | 0.4 | 0  | 0  |

**Trường hợp spec hay trễ, coding dồn về giữa sprint:**

| W1  | W2  | W3  | W4 |
|-----|-----|-----|----|
| 0.2 | 0.5 | 0.3 | 0  |

**Trường hợp team muốn “chắc chắn xong code sớm” để dành W3–W4 cho test/fix:**

| W1  | W2  | W3 | W4 |
|-----|-----|----|----|
| 0.7 | 0.3 | 0  | 0  |

---

#### 3.1.4. SelfTest

**Logic:**  
Self test xảy ra **sau khi coding** gần xong.

**Mặc định:**

| Activity     | W1 | W2  | W3  | W4 |
|--------------|----|-----|-----|----|
| \*_SelfTest  | 0  | 1.0 | 0   | 0  |

**Nếu Dev thường dính self test sang W3:**

| W1 | W2  | W3  | W4 |
|----|-----|-----|----|
| 0  | 0.7 | 0.3 | 0  |

---

#### 3.1.5. Review

**Mặc định:**

| Activity   | W1 | W2  | W3  | W4 |
|------------|----|-----|-----|----|
| \*_Review  | 0  | 0.5 | 0.5 | 0  |

**Khi code thường xong trễ → review dồn W3:**

| W1 | W2 | W3  | W4 |
|----|----|-----|----|
| 0  | 0.2| 0.8 | 0  |

---

#### 3.1.6. FixBUG

**Logic:**  
Bug Dev thường bị phát hiện từ giữa sprint trở đi → dồn W3–W4.

**Mặc định:**

| Activity   | W1 | W2 | W3  | W4  |
|------------|----|----|-----|-----|
| \*_FixBUG  | 0  | 0  | 0.4 | 0.6 |

**Nếu bạn thấy bug thường bùng khá sớm (vì test JF/Dev sớm):**

| W1 | W2  | W3  | W4  |
|----|-----|-----|-----|
| 0  | 0.2 | 0.4 | 0.4 |

---

### 3.2. Tester (QA)

#### 3.2.1. QA_Study & QA_Meeting

**Mặc định:**

| Activity    | W1  | W2 | W3 | W4 |
|-------------|-----|----|----|----|
| QA_Study    | 1.0 | 0  | 0  | 0  |
| QA_Meeting  | 0.7 | 0.3| 0  | 0  |

> Đa số QA muốn hiểu spec càng sớm càng tốt → giữ như vậy là hợp lý.

---

#### 3.2.2. QA_CreateTC & QA_Review

**CreateTC**: Tạo test case  
**Review**: Review test case / test viewpoint

**Mặc định:**

| Activity     | W1  | W2  | W3 | W4 |
|--------------|-----|-----|----|----|
| QA_CreateTC  | 0.7 | 0.3 | 0  | 0  |
| QA_Review    | 0.5 | 0.5 | 0  | 0  |

**Nếu spec thường chưa ổn ở W1 → nên dồn sang W2:**

| Activity     | W1  | W2  | W3 | W4 |
|--------------|-----|-----|----|----|
| QA_CreateTC  | 0.3 | 0.7 | 0  | 0  |
| QA_Review    | 0.3 | 0.7 | 0  | 0  |

---

#### 3.2.3. QA_Exec_JF (Jackfruit)

**Logic:**

- Chỉ xảy ra **sau khi Dev coding & selftest xong và deploy JF**.
- Thực tế thường từ W2–W3.

**Mặc định:**

| Activity    | W1 | W2  | W3  | W4 |
|-------------|----|-----|-----|----|
| QA_Exec_JF  | 0  | 0.4 | 0.6 | 0  |

**Khi team code hay trễ (JF test chủ yếu W3):**

| W1 | W2 | W3  | W4 |
|----|----|-----|----|
| 0  | 0.2| 0.8 | 0  |

---

#### 3.2.4. QA_Exec_Dev (Develop)

**Logic:**

- Sau khi code được merge lên branch Develop.
- Nên “đi sau” JF một chút.

**Mặc định:**

| Activity     | W1 | W2 | W3  | W4  |
|--------------|----|----|-----|-----|
| QA_Exec_Dev  | 0  | 0  | 0.4 | 0.6 |

**Nếu muốn Dev test xảy ra sớm hơn (đỡ dồn vào W4):**

| W1 | W2 | W3  | W4  |
|----|----|-----|-----|
| 0  | 0.2| 0.5 | 0.3 |

---

#### 3.2.5. QA_Exec_Stg (Staging)

**Logic:**

- Pre-release test, gắn với tuần cuối.

**Mặc định (đề xuất):**

| Activity     | W1 | W2 | W3 | W4  |
|--------------|----|----|----|-----|
| QA_Exec_Stg  | 0  | 0  | 0  | 1.0 |

Nếu sprint 5 tuần, bạn có thể dàn:

| W1 | W2 | W3 | W4  | W5  |
|----|----|----|-----|-----|
| 0  | 0  | 0  | 0.4 | 0.6 |

*(Khi đó script cần hỗ trợ 5 tuần – phần này là design tiếp theo)*

---

#### 3.2.6. QA_Exec_Mst (Prod/Master)

**Logic:**

- Test trên Production sau release (thường thứ 6 tuần cuối).
- Effort nhỏ nhưng **bắt buộc ở cuối sprint**.

**Mặc định:**

| Activity     | W1 | W2 | W3 | W4  |
|--------------|----|----|----|-----|
| QA_Exec_Mst  | 0  | 0  | 0  | 1.0 |

Nếu muốn tách phần “chuẩn bị test Prod”:

| W1 | W2 | W3  | W4  |
|----|----|-----|-----|
| 0  | 0  | 0.3 | 0.7 |

---

## 4. Quy trình thực tế để tinh chỉnh Time Pattern

### Bước 1. Dùng pattern mặc định trong 1–2 sprint

- Chạy sprint bình thường.
- Sau mỗi sprint, mở sheet `Weekly_Load`:
  - Xem tuần nào/role nào thường xuyên **Util > 110% (màu đỏ)**.
  - So sánh với cảm nhận thực tế của team:
    - “Tuần 3 tester chết ngộp bug” hay “Dev luôn OT tuần 2”, …

### Bước 2. So với reality, tìm chỗ lệch

Ví dụ:

- `Weekly_Load` cho thấy QA Week4 luôn đỏ, còn Week2 xanh lè.
- QA báo lại:
  - “Thực tế tụi em test Jackfruit nhiều ở Week3, Dev test dồn Week4”.

Điều này gợi ý:

- QA_Exec_JF / QA_Exec_Dev đang dồn quá vào W4 trong pattern.
- Nên **dịch một phần effort sang W2–W3**.

### Bước 3. Chỉnh pattern cho đúng “thói quen” mới

- Chọn 1–2 activity gây nghẽn (thường là QA_Exec_JF / Dev / Stg, hoặc BE_FixBUG).
- Điều chỉnh nhẹ pattern:
  - Ví dụ QA_Exec_Dev: từ (0,0,0.4,0.6) → (0,0.2,0.5,0.3).
- Chạy lại `Recalculate`, xem `Weekly_Load` có đỡ đỏ không.

### Bước 4. Coi việc chỉnh pattern là “tuning hệ thống”

- Không chỉnh pattern liên tục giữa sprint.
- Nên chỉnh ở **retrospective** sau sprint:
  - “Từ sprint sau, QA sẽ test JF sớm hơn, không chờ quá trễ” → reflect bằng cách tăng W2, giảm W3/W4.

---

## 5. Checklist nhanh khi team muốn chỉnh

Trước khi sửa một dòng trong `Config_TimePattern`, hãy hỏi:

1. **Activity này thực tế team đang làm vào tuần mấy?**
   - (ghi ra giấy W1,W2,W3,W4, đánh dấu X)
2. **Tuần nào đang bị quá tải trong thực tế?**
   - Nếu W3 QA quá tải, có thể:
     - Giảm pattern QA_Exec_JF/Dev ở W3, tăng W2/W4.
3. **Có vi phạm dependency không?**
   - Không để QA_Exec_JF có effort ở W1.
   - Không để QA_Exec_Stg rải sang W2 khi Dev còn chưa merge xong.
4. **Sau khi sửa, tổng W1+W2+W3+W4 có khoảng ~1.0 không?**

Nếu 4 câu trên đều ok → chỉnh pattern đó là hợp lý.

---

> Gợi ý:  
> Bạn có thể in riêng tài liệu này cho Dev Leader, Test Leader, BA,  
> đánh dấu các activity mà team mình có “đặc điểm riêng” để cùng thống nhất pattern chuẩn cho công ty.
