
---
## **Báo cáo Phân tích Hiệu quả các Công cụ AI IDE**

### **1. Bối cảnh Khảo sát**
Báo cáo được tổng hợp từ khảo sát thực hiện vào cuối tháng 9/2025 với **46 lập trình viên** tại công ty. Với **83% (39 người) có trên 5 năm kinh nghiệm**, chủ yếu ở các mảng Backend và Frontend.

### **2. Tóm tắt Kết quả Chính**

Phân tích dữ liệu cho thấy **Gemini Code Assist chưa đáp ứng được kỳ vọng và yêu cầu công việc** của đội ngũ phát triển của Dr.JOY.
**Hơn 80% đánh giá công cụ chỉ ở mức trung bình hoặc kém**, với các lý do cốt lõi bao gồm:

1.  **Hiệu suất rất chậm, làm gián đoạn quy trình làm việc.**
2.  **Chất lượng gợi ý code thiếu tin cậy, thường xuyên sai logic hoặc không phù hợp ngữ cảnh.**
3.  **Trải nghiệm người dùng kém.**

Trong khi đó, **Cursor AI Editor được 93% người dùng khẳng định là vượt trội hơn hẳn Gemini Code Assist**. 

**Đề xuất chính:** Cân nhắc không gia hạn Gemini Code Assist vào tháng 3 sang năm và chuyển hướng nguồn lực sang thử nghiệm và áp dụng các công cụ hiệu quả hơn như Cursor AI.

---

### **3. Phân tích Chi tiết: Gemini Code Assist**

#### **A. Đánh giá Chung: Mức độ Hài lòng Rất Thấp**

Trong số 46 người tham gia đưa ra đánh giá, chỉ có **19%** cảm thấy Gemini Code Assist hoạt động tốt. Ngược lại, có tới **81%** cho rằng công cụ chỉ ở mức trung bình hoặc kém.

*   **Tốt (4-5 điểm):** 19% (6 người)
*   **Trung bình (3 điểm):** 62.5% (20 người)
*   **Kém (1-2 điểm):** 19% (6 người)

#### **Biểu đồ 1: Đánh giá Chất lượng Tổng thể của Gemini Code Assist**

#### **B. Các Vấn đề Cốt lõi**

Các phản hồi tiêu cực tập trung vào ba nhóm vấn đề chính:

*   **Vấn đề #1: Tốc độ phản hồi quá chậm (The #1 Blocker)**
    *   Đây là phàn nàn phổ biến nhất. Các nhận xét như *"Tốc độ phản hồi chậm"*, *"loading lâu rồi không trả về response gây khó chịu"* xuất hiện lặp đi lặp lại.

*   **Vấn đề #2: Chất lượng Gợi ý Thấp và Không đáng tin cậy**
    *   **Sai logic & Ngữ cảnh:** Nhiều developer báo cáo *"Gợi ý không chính xác / sai logic"* và *"Không phù hợp ngữ cảnh code"*. Công cụ không hiểu sâu về codebase lớn, dẫn đến các đề xuất vô dụng hoặc thậm chí sai lầm.
    *   **Hạn chế về Phân tích:** Các phản hồi như *"Khả năng làm việc với toàn bộ repository, nhiều file hạn chế"* và *"chưa cho phép add file vào context theo dạng folder"* cho thấy Gemini yếu trong việc xử lý các tác vụ phức tạp đòi hỏi hiểu biết toàn diện về dự án.

*   **Vấn đề #3: Tích hợp Kém và Trải nghiệm Người dùng (UX) không tốt**
    *   Nhiều người dùng gặp khó khăn trong việc đưa Gemini Code Assist vào quy trình làm việc hiện tại (*"Khó tích hợp workflow hiện tại"*).
    *   Các lỗi giao diện như *"vấn đề bị cut chữ"* hay *"câu trả lời dài, thao tác chưa thân thiện"* cũng làm giảm trải nghiệm.

---

### **4. So sánh Trực tiếp với Cursor AI và Copilot**

#### **A. Gemini Code Assist vs. Cursor AI**

Dựa trên phản hồi từ 29 người đã dùng cả hai công cụ, **Cursor AI so với Gemini Code Assist vượt trội hơn**.

**Đánh giá về Cursor AI so với Gemini Code Assist:**
*   **Tốt hơn nhiều:** 76% (22 người)
*   **Hơi tốt hơn:** 17% (5 người)
*   **Tương đương:** 7% (2 người)

*   **Điểm mạnh của Cursor AI:**
    *   **Gợi ý Chính xác & Sát ngữ cảnh**
    *   **Tốc độ Phản hồi Nhanh** 
    *   **Linh hoạt Lựa chọn Model AI:** Cho phép lựa chọn giữa GPT-4, Claude Sonnet, v.v., giúp tối ưu cho từng tác vụ cụ thể.
    *   **Tích hợp workflow mượt mà** và có nhiều tính năng nâng cao (làm việc với nhiều file, revert checkpoint).

*   **Biểu đồ 2: Gemini Code Assist vs. Cursor AI**

#### **B. Gemini Code Assist vs. Copilot IDE**

Trong 12 người đã dùng cả hai, Copilot cũng được đánh giá cao hơn.

**Đánh giá về Copilot IDE so với Gemini:**
*   **Tốt hơn nhiều:** 33% (4 người)
*   **Hơi tốt hơn:** 42% (5 người)
*   **Tương đương:** 17% (2 người)
*   **Kém hơn:** 8% (1 người)

*   **Điểm mạnh của Copilot:**
    *   Gợi ý tin cậy và tốc độ phản hồi nhanh.
    *   Tích hợp và ổn định với các IDE của JetBrains (IntelliJ, WebStorm)

*   **Biểu đồ 3: Gemini Code Assist vs. Copilot IDE**