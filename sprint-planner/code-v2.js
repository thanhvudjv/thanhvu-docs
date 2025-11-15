/************************************************************
 * 1) SETUP TOÀN BỘ CẤU TRÚC SPRINT PLANNER
 ************************************************************/
function setupSprintPlanningSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  /***********************
   * SHEET: Guide
   ***********************/
  let guideSheet = ss.getSheetByName('Guide');
  if (guideSheet) ss.deleteSheet(guideSheet);
  guideSheet = ss.insertSheet('Guide');

  const guideData = [
    ['Sheet', 'Mục đích', 'Cách nhập dữ liệu'],
    ['Capacity',
     'Định nghĩa sức chứa (capacity) theo role cho mỗi sprint.',
     'Chỉnh Headcount, WorkingDays, FocusRate theo thực tế. Gross_MD và Usable_MD tự tính. Khi sprint 5 tuần thì đổi WorkingDays thành 25 (hoặc số ngày làm việc thực tế).'],
    ['Config_TimePattern',
     'Định nghĩa tỉ lệ phân bổ effort theo từng tuần cho mỗi activity (BE/FE/Tester).',
     'Chỉnh các cột W1–W4 để thay đổi cách effort của từng activity được dàn trải qua các tuần. Tổng W1+W2+W3+W4 cho mỗi activity nên ≈ 1.'],
    ['Config_Dependency',
     'Ghi chú/desgin rule phụ thuộc giữa Dev–Tester–BA.',
     'Chủ yếu để team tham chiếu. Các rule dependency được phản ánh vào pattern ở Config_TimePattern (VD QA_Exec_Stg chỉ dồn Week4).'],
    ['Backlog_Sprint_Plan',
     'Nhập danh sách ticket, effort chi tiết theo activity; hệ thống tự tính tổng md, phân bổ theo tuần và quyết định ticket nào nằm trong sprint.',
     'Nhập dữ liệu ở các cột Order, Ticket, Priority, BA_Est_MD, BE_*, FE_*, QA_*. Các cột Total, Weekly, Cum, Selected có công thức sẵn.'],
    ['Weekly_Load',
     'Tổng hợp effort theo tuần + % sử dụng capacity cho BE/FE/Tester.',
     'Không cần nhập gì. Dùng để kiểm tra tuần nào bị quá tải dựa trên các ticket Selected = "YES".']
  ];
  guideSheet.getRange(1, 1, guideData.length, guideData[0].length).setValues(guideData);
  guideSheet.setFrozenRows(1);

  /***********************
   * SHEET: Capacity
   ***********************/
  let capSheet = ss.getSheetByName('Capacity');
  if (capSheet) ss.deleteSheet(capSheet);
  capSheet = ss.insertSheet('Capacity');

  // Row1: header, Row2: mô tả, Row3+: data
  const capacityData = [
    ['Role',        'Headcount',                    'WorkingDays',                            'FocusRate',                                      'Gross_MD',                       'Usable_MD'],
    ['Loại nhân sự','Số người mỗi role',            'Số ngày làm việc trong sprint',          'Tỉ lệ thời gian dành cho task sprint',          'Tự động = Headcount*Days*Rate',  'Tự động = Gross_MD*0.85 (buffer)'],
    ['BA',          2,                              20,                                       0.6,                                             '=B3*C3*D3',                      '=E3*0.85'],
    ['Dev Backend', 3,                              20,                                       0.7,                                             '=B4*C4*D4',                      '=E4*0.85'],
    ['Dev Frontend',3,                              20,                                       0.7,                                             '=B5*C5*D5',                      '=E5*0.85'],
    ['Tester',      5,                              20,                                       0.7,                                             '=B6*C6*D6',                      '=E6*0.85'],
  ];
  capSheet.getRange(1, 1, capacityData.length, capacityData[0].length).setValues(capacityData);
  capSheet.setFrozenRows(2);

  /***********************
   * SHEET: Config_TimePattern
   ***********************/
  let cfgTime = ss.getSheetByName('Config_TimePattern');
  if (cfgTime) ss.deleteSheet(cfgTime);
  cfgTime = ss.insertSheet('Config_TimePattern');

  const timePatternData = [
    ['Role','Activity','W1','W2','W3','W4'],
    ['Loại resource','Tên activity (trùng với cột activity ở Backlog_Sprint_Plan)','Tỉ lệ effort tuần 1','Tỉ lệ effort tuần 2','Tỉ lệ effort tuần 3','Tỉ lệ effort tuần 4'],
    ['Dev Backend','BE_Study',   1,   0,   0,   0],
    ['Dev Backend','BE_Meeting', 0.7, 0.3, 0,   0],
    ['Dev Backend','BE_Coding',  0.6, 0.4, 0,   0],
    ['Dev Backend','BE_SelfTest',0,   1,   0,   0],
    ['Dev Backend','BE_Review',  0,   0.5, 0.5, 0],
    ['Dev Backend','BE_FixBUG',  0,   0,   0.4, 0.6],
    ['Dev Frontend','FE_Study',   1,   0,   0,   0],
    ['Dev Frontend','FE_Meeting', 0.7, 0.3, 0,   0],
    ['Dev Frontend','FE_Coding',  0.6, 0.4, 0,   0],
    ['Dev Frontend','FE_SelfTest',0,   1,   0,   0],
    ['Dev Frontend','FE_Review',  0,   0.5, 0.5, 0],
    ['Dev Frontend','FE_FixBUG',  0,   0,   0.4, 0.6],
    ['Tester','QA_Study',        1,   0,   0,   0],
    ['Tester','QA_Meeting',      0.7, 0.3, 0,   0],
    ['Tester','QA_CreateTC',     0.7, 0.3, 0,   0],
    ['Tester','QA_Review',       0.5, 0.5, 0,   0],
    ['Tester','QA_Exec_JF',      0,   0.4, 0.6, 0],
    ['Tester','QA_Exec_Dev',     0,   0,   0.4, 0.6],
    ['Tester','QA_Exec_Stg',     0,   0,   0,   1],
    ['Tester','QA_Exec_Mst',     0,   0,   0,   1],
  ];
  cfgTime.getRange(1, 1, timePatternData.length, timePatternData[0].length).setValues(timePatternData);
  cfgTime.setFrozenRows(2);

  /***********************
   * SHEET: Config_Dependency
   ***********************/
  let cfgDep = ss.getSheetByName('Config_Dependency');
  if (cfgDep) ss.deleteSheet(cfgDep);
  cfgDep = ss.insertSheet('Config_Dependency');

  const depData = [
    ['Role','Activity','DependsOnRole','DependsOnActivity','Notes'],
    ['Role chứa activity','Tên activity cần rule phụ thuộc','Role bị phụ thuộc','Activity của role đó','Giải thích rule để team dễ hiểu'],
    ['Tester','QA_Exec_JF','Dev Backend','BE_Coding+BE_SelfTest','Chỉ test Jackfruit sau khi code xong & reflect lên Jackfruit'],
    ['Tester','QA_Exec_JF','Dev Frontend','FE_Coding+FE_SelfTest','Tương tự cho FE nếu có'],
    ['Tester','QA_Exec_Dev','Dev Backend','BE_Coding (merged to Dev)','Chỉ test Develop khi code đã merge & deploy lên Develop'],
    ['Tester','QA_Exec_Dev','Dev Frontend','FE_Coding (merged to Dev)','Tương tự cho FE'],
    ['Tester','QA_Exec_Stg','Dev Backend','BE_Review+BE_FixBUG','Chỉ test Staging sau khi fix xong bug blocker'],
    ['Tester','QA_Exec_Mst','Dev Backend','Release Prod','Chỉ test Prod sau thời điểm release thứ 6 tuần cuối'],
    ['Tester','QA_CreateTC','BA','Spec Overview/Detail','Có thể chạy song song với Dev_Coding nếu spec đủ clear'],
    ['Dev Backend','BE_Coding','BA','Spec Overview','Bắt đầu coding sau khi BA overview'],
    ['Dev Frontend','FE_Coding','BA','Spec Overview','Bắt đầu coding sau khi BA overview'],
  ];
  cfgDep.getRange(1, 1, depData.length, depData[0].length).setValues(depData);
  cfgDep.setFrozenRows(2);

  /***********************
   * SHEET: Backlog_Sprint_Plan
   ***********************/
  let backSheet = ss.getSheetByName('Backlog_Sprint_Plan');
  if (backSheet) ss.deleteSheet(backSheet);
  backSheet = ss.insertSheet('Backlog_Sprint_Plan');

  const headers = [
    'Order', 'Ticket', 'Priority', 'BA_Est_MD',
    // Dev Backend activity
    'BE_Study','BE_Meeting','BE_Coding','BE_SelfTest','BE_Review','BE_FixBUG','BE_Total_MD',
    // Dev Frontend activity
    'FE_Study','FE_Meeting','FE_Coding','FE_SelfTest','FE_Review','FE_FixBUG','FE_Total_MD',
    // Tester activity
    'QA_Study','QA_Meeting','QA_CreateTC','QA_Review','QA_Exec_JF','QA_Exec_Dev','QA_Exec_Stg','QA_Exec_Mst','QA_Total_MD',
    // Weekly BE
    'BE_W1_MD','BE_W2_MD','BE_W3_MD','BE_W4_MD',
    // Weekly FE
    'FE_W1_MD','FE_W2_MD','FE_W3_MD','FE_W4_MD',
    // Weekly QA
    'QA_W1_MD','QA_W2_MD','QA_W3_MD','QA_W4_MD',
    // Cum & Selected
    'BA_Cum','BE_Cum','FE_Cum','QA_Cum','Selected'
  ];

  const headerDesc = [
    'Thứ tự ưu tiên (1,2,3...). Nên sort theo cột này + Priority.',
    'Mã ticket (VD: SM0001, RV0010...).',
    'Mức ưu tiên business: P1/P2/P3...',
    'Effort BA sơ bộ cho ticket (man-day).',
    'BE: Study/đọc spec, code hiện tại.',
    'BE: Họp liên quan ticket (share viewpoint/spec...).',
    'BE: Coding chức năng.',
    'BE: Tự test (self test, unit test).',
    'BE: Review code.',
    'BE: Dự trù fix bug trong sprint.',
    'BE: Tổng effort Backend (tự tính).',
    'FE: Study/đọc spec, design UI.',
    'FE: Họp liên quan ticket.',
    'FE: Coding frontend.',
    'FE: Tự test frontend.',
    'FE: Review code FE.',
    'FE: Dự trù fix bug FE.',
    'FE: Tổng effort Frontend (tự tính).',
    'QA: Study/đọc spec, hiểu flow.',
    'QA: Họp share viewpoint/spec.',
    'QA: Tạo test case.',
    'QA: Review test case / test viewpoint.',
    'QA: Execution test môi trường Jackfruit.',
    'QA: Execution test môi trường Develop.',
    'QA: Execution test môi trường Staging.',
    'QA: Execution test môi trường Master/Prod.',
    'QA: Tổng effort Tester (tự tính).',
    'BE effort tuần 1 (tự động theo Config_TimePattern).',
    'BE effort tuần 2.',
    'BE effort tuần 3.',
    'BE effort tuần 4.',
    'FE effort tuần 1.',
    'FE effort tuần 2.',
    'FE effort tuần 3.',
    'FE effort tuần 4.',
    'QA effort tuần 1.',
    'QA effort tuần 2.',
    'QA effort tuần 3.',
    'QA effort tuần 4.',
    'BA md tích lũy đến dòng hiện tại.',
    'BE md tích lũy đến dòng hiện tại.',
    'FE md tích lũy đến dòng hiện tại.',
    'QA md tích lũy đến dòng hiện tại.',
    '"YES" nếu ticket nằm trong sprint (không vượt capacity BA/BE/FE/QA).'
  ];

  backSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  backSheet.getRange(2, 1, 1, headerDesc.length).setValues([headerDesc]);
  backSheet.setFrozenRows(2);

  // Dòng 3 sẽ là dòng đầu tiên chứa dữ liệu & công thức
  // Tổng BE / FE / QA
  backSheet.getRange('K3').setFormula('=E3+F3+G3+H3+I3+J3');                 // BE_Total_MD
  backSheet.getRange('R3').setFormula('=L3+M3+N3+O3+P3+Q3');                 // FE_Total_MD
  backSheet.getRange('AA3').setFormula('=S3+T3+U3+V3+W3+X3+Y3+Z3');          // QA_Total_MD

  // BE weekly dùng Config_TimePattern (Dev Backend rows 3–8)
  backSheet.getRange('AB3').setFormula(
    '=E3*Config_TimePattern!$C$3+F3*Config_TimePattern!$C$4+G3*Config_TimePattern!$C$5+H3*Config_TimePattern!$C$6+I3*Config_TimePattern!$C$7+J3*Config_TimePattern!$C$8'
  );
  backSheet.getRange('AC3').setFormula(
    '=E3*Config_TimePattern!$D$3+F3*Config_TimePattern!$D$4+G3*Config_TimePattern!$D$5+H3*Config_TimePattern!$D$6+I3*Config_TimePattern!$D$7+J3*Config_TimePattern!$D$8'
  );
  backSheet.getRange('AD3').setFormula(
    '=E3*Config_TimePattern!$E$3+F3*Config_TimePattern!$E$4+G3*Config_TimePattern!$E$5+H3*Config_TimePattern!$E$6+I3*Config_TimePattern!$E$7+J3*Config_TimePattern!$E$8'
  );
  backSheet.getRange('AE3').setFormula(
    '=E3*Config_TimePattern!$F$3+F3*Config_TimePattern!$F$4+G3*Config_TimePattern!$F$5+H3*Config_TimePattern!$F$6+I3*Config_TimePattern!$F$7+J3*Config_TimePattern!$F$8'
  );

  // FE weekly dùng Config_TimePattern (Dev Frontend rows 9–14)
  backSheet.getRange('AF3').setFormula(
    '=L3*Config_TimePattern!$C$9+M3*Config_TimePattern!$C$10+N3*Config_TimePattern!$C$11+O3*Config_TimePattern!$C$12+P3*Config_TimePattern!$C$13+Q3*Config_TimePattern!$C$14'
  );
  backSheet.getRange('AG3').setFormula(
    '=L3*Config_TimePattern!$D$9+M3*Config_TimePattern!$D$10+N3*Config_TimePattern!$D$11+O3*Config_TimePattern!$D$12+P3*Config_TimePattern!$D$13+Q3*Config_TimePattern!$D$14'
  );
  backSheet.getRange('AH3').setFormula(
    '=L3*Config_TimePattern!$E$9+M3*Config_TimePattern!$E$10+N3*Config_TimePattern!$E$11+O3*Config_TimePattern!$E$12+P3*Config_TimePattern!$E$13+Q3*Config_TimePattern!$E$14'
  );
  backSheet.getRange('AI3').setFormula(
    '=L3*Config_TimePattern!$F$9+M3*Config_TimePattern!$F$10+N3*Config_TimePattern!$F$11+O3*Config_TimePattern!$F$12+P3*Config_TimePattern!$F$13+Q3*Config_TimePattern!$F$14'
  );

  // QA weekly dùng Config_TimePattern (Tester rows 15–22)
  backSheet.getRange('AJ3').setFormula(
    '=S3*Config_TimePattern!$C$15+T3*Config_TimePattern!$C$16+U3*Config_TimePattern!$C$17+V3*Config_TimePattern!$C$18+W3*Config_TimePattern!$C$19+X3*Config_TimePattern!$C$20+Y3*Config_TimePattern!$C$21+Z3*Config_TimePattern!$C$22'
  );
  backSheet.getRange('AK3').setFormula(
    '=S3*Config_TimePattern!$D$15+T3*Config_TimePattern!$D$16+U3*Config_TimePattern!$D$17+V3*Config_TimePattern!$D$18+W3*Config_TimePattern!$D$19+X3*Config_TimePattern!$D$20+Y3*Config_TimePattern!$D$21+Z3*Config_TimePattern!$D$22'
  );
  backSheet.getRange('AL3').setFormula(
    '=S3*Config_TimePattern!$E$15+T3*Config_TimePattern!$E$16+U3*Config_TimePattern!$E$17+V3*Config_TimePattern!$E$18+W3*Config_TimePattern!$E$19+X3*Config_TimePattern!$E$20+Y3*Config_TimePattern!$E$21+Z3*Config_TimePattern!$E$22'
  );
  backSheet.getRange('AM3').setFormula(
    '=S3*Config_TimePattern!$F$15+T3*Config_TimePattern!$F$16+U3*Config_TimePattern!$F$17+V3*Config_TimePattern!$F$18+W3*Config_TimePattern!$F$19+X3*Config_TimePattern!$F$20+Y3*Config_TimePattern!$F$21+Z3*Config_TimePattern!$F$22'
  );

  // Cum formulas – bắt đầu từ dòng 3
  backSheet.getRange('AN3').setFormula('=IF(D3="","",IF(ROW()=3,D3,AN2+D3))');   // BA_Cum
  backSheet.getRange('AO3').setFormula('=IF(K3="","",IF(ROW()=3,K3,AO2+K3))');   // BE_Cum
  backSheet.getRange('AP3').setFormula('=IF(R3="","",IF(ROW()=3,R3,AP2+R3))');   // FE_Cum
  backSheet.getRange('AQ3').setFormula('=IF(AA3="","",IF(ROW()=3,AA3,AQ2+AA3))');// QA_Cum

  // Selected: so sánh với Capacity!F3..F6 (BA, BE, FE, Tester)
  backSheet.getRange('AR3').setFormula(
    '=IF(AND(AN3<=Capacity!$F$3,AO3<=Capacity!$F$4,AP3<=Capacity!$F$5,AQ3<=Capacity!$F$6),"YES","")'
  );

  // Copy công thức dòng 3 xuống, ví dụ tới dòng 200
  const lastRowForFormula = 200;
  backSheet.getRange('K3:AR3').copyTo(backSheet.getRange('K4:AR' + lastRowForFormula), {contentsOnly:false});

  /***********************
   * SHEET: Weekly_Load (heatmap, với % Util)
   ***********************/
  rebuildWeeklyLoad();
}

/************************************************************
 * 2) TẠO LẠI SHEET Weekly_Load VỚI HEATMAP % UTILIZATION
 ************************************************************/
function rebuildWeeklyLoad() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let weeklySheet = ss.getSheetByName('Weekly_Load');
  if (weeklySheet) ss.deleteSheet(weeklySheet);
  weeklySheet = ss.insertSheet('Weekly_Load');

  const header = [
    'Role',
    'W1_MD','W1_Cap','W1_Util',
    'W2_MD','W2_Cap','W2_Util',
    'W3_MD','W3_Cap','W3_Util',
    'W4_MD','W4_Cap','W4_Util'
  ];
  const headerDesc = [
    'Tên role.',
    'Tổng effort (md) của role ở Week1 cho các ticket Selected = "YES".',
    'Capacity (md) cho role ở Week1. Mặc định = Usable_MD/4 (sprint 4 tuần).',
    'Tỉ lệ sử dụng Week1 = W1_MD / W1_Cap.',
    'Tổng effort Week2.',
    'Capacity Week2.',
    'Tỉ lệ sử dụng Week2.',
    'Tổng effort Week3.',
    'Capacity Week3.',
    'Tỉ lệ sử dụng Week3.',
    'Tổng effort Week4.',
    'Capacity Week4.',
    'Tỉ lệ sử dụng Week4.'
  ];

  weeklySheet.getRange(1,1,1,header.length).setValues([header]);
  weeklySheet.getRange(2,1,1,headerDesc.length).setValues([headerDesc]);
  weeklySheet.setFrozenRows(2);

  // Role rows
  weeklySheet.getRange(3,1).setValue('Dev Backend');
  weeklySheet.getRange(4,1).setValue('Dev Frontend');
  weeklySheet.getRange(5,1).setValue('Tester');

  // Dev Backend row 3
  weeklySheet.getRange('B3').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AB:$AB)');
  weeklySheet.getRange('C3').setFormula('=Capacity!$F$4/4');  // BE usable (Dev Backend) ở F4
  weeklySheet.getRange('D3').setFormula('=IF(C3=0,"",B3/C3)');

  weeklySheet.getRange('E3').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AC:$AC)');
  weeklySheet.getRange('F3').setFormula('=Capacity!$F$4/4');
  weeklySheet.getRange('G3').setFormula('=IF(F3=0,"",E3/F3)');

  weeklySheet.getRange('H3').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AD:$AD)');
  weeklySheet.getRange('I3').setFormula('=Capacity!$F$4/4');
  weeklySheet.getRange('J3').setFormula('=IF(I3=0,"",H3/I3)');

  weeklySheet.getRange('K3').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AE:$AE)');
  weeklySheet.getRange('L3').setFormula('=Capacity!$F$4/4');
  weeklySheet.getRange('M3').setFormula('=IF(L3=0,"",K3/L3)');

  // Dev Frontend row 4
  weeklySheet.getRange('B4').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AF:$AF)');
  weeklySheet.getRange('C4').setFormula('=Capacity!$F$5/4');  // FE usable ở F5
  weeklySheet.getRange('D4').setFormula('=IF(C4=0,"",B4/C4)');

  weeklySheet.getRange('E4').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AG:$AG)');
  weeklySheet.getRange('F4').setFormula('=Capacity!$F$5/4');
  weeklySheet.getRange('G4').setFormula('=IF(F4=0,"",E4/F4)');

  weeklySheet.getRange('H4').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AH:$AH)');
  weeklySheet.getRange('I4').setFormula('=Capacity!$F$5/4');
  weeklySheet.getRange('J4').setFormula('=IF(I4=0,"",H4/I4)');

  weeklySheet.getRange('K4').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AI:$AI)');
  weeklySheet.getRange('L4').setFormula('=Capacity!$F$5/4');
  weeklySheet.getRange('M4').setFormula('=IF(L4=0,"",K4/L4)');

  // Tester row 5
  weeklySheet.getRange('B5').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AJ:$AJ)');
  weeklySheet.getRange('C5').setFormula('=Capacity!$F$6/4');  // Tester usable ở F6
  weeklySheet.getRange('D5').setFormula('=IF(C5=0,"",B5/C5)');

  weeklySheet.getRange('E5').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AK:$AK)');
  weeklySheet.getRange('F5').setFormula('=Capacity!$F$6/4');
  weeklySheet.getRange('G5').setFormula('=IF(F5=0,"",E5/F5)');

  weeklySheet.getRange('H5').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AL:$AL)');
  weeklySheet.getRange('I5').setFormula('=Capacity!$F$6/4');
  weeklySheet.getRange('J5').setFormula('=IF(I5=0,"",H5/I5)');

  weeklySheet.getRange('K5').setFormula('=SUMIF(Backlog_Sprint_Plan!$AR:$AR,"YES",Backlog_Sprint_Plan!$AM:$AM)');
  weeklySheet.getRange('L5').setFormula('=Capacity!$F$6/4');
  weeklySheet.getRange('M5').setFormula('=IF(L5=0,"",K5/L5)');

  // Định dạng % cho cột Util
  weeklySheet.getRange('D3:D5').setNumberFormat('0.0%');
  weeklySheet.getRange('G3:G5').setNumberFormat('0.0%');
  weeklySheet.getRange('J3:J5').setNumberFormat('0.0%');
  weeklySheet.getRange('M3:M5').setNumberFormat('0.0%');

  // Conditional Formatting cho Util
  const rangeList = weeklySheet.getRangeList(['D3:D5','G3:G5','J3:J5','M3:M5']);
  let rules = weeklySheet.getConditionalFormatRules();

  // >110%: đỏ nhạt
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(1.1)
      .setBackground('#f4c7c3')
      .setRanges(rangeList.getRanges())
      .build()
  );
  // 90–110%: vàng
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.9, 1.1)
      .setBackground('#fff2cc')
      .setRanges(rangeList.getRanges())
      .build()
  );
  // <90%: xanh nhạt
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.9)
      .setBackground('#d9ead3')
      .setRanges(rangeList.getRanges())
      .build()
  );

  weeklySheet.setConditionalFormatRules(rules);
  weeklySheet.autoResizeColumns(1, header.length);
}

/************************************************************
 * 3) TẠO DỮ LIỆU MẪU (30 TICKET)
 ************************************************************/
function generateSampleTickets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Backlog_Sprint_Plan');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet "Backlog_Sprint_Plan". Hãy chạy setupSprintPlanningSheets() trước.');
    return;
  }

  // Clear trước khi generate
  clearSampleTickets();

  const startRow = 3;      // dòng bắt đầu dữ liệu (sau header + mô tả)
  const numTickets = 30;

  const levels = {
    1: { // nhỏ
      BA: 0.5,
      BE: [0.3, 0.2, 1.0, 0.5, 0.3, 0.3],
      FE: [0.3, 0.2, 0.8, 0.4, 0.3, 0.3],
      QA: [0.3, 0.2, 0.8, 0.3, 0.8, 0.4, 0.4, 0.2]
    },
    2: { // vừa
      BA: 1.0,
      BE: [0.5, 0.3, 2.0, 0.8, 0.4, 0.5],
      FE: [0.5, 0.3, 1.5, 0.7, 0.4, 0.5],
      QA: [0.5, 0.3, 1.5, 0.5, 1.0, 0.6, 0.5, 0.3]
    },
    3: { // lớn
      BA: 1.5,
      BE: [0.8, 0.5, 3.0, 1.2, 0.6, 0.8],
      FE: [0.8, 0.5, 2.5, 1.0, 0.6, 0.8],
      QA: [0.7, 0.4, 2.0, 0.7, 1.5, 0.8, 0.7, 0.4]
    }
  };

  for (let i = 0; i < numTickets; i++) {
    const row = startRow + i;
    const order = i + 1;
    const ticket = 'TK-' + ('000' + order).slice(-3);

    let priority;
    if (order <= 10) priority = 'P1';
    else if (order <= 20) priority = 'P2';
    else priority = 'P3';

    const r = Math.random();
    let level = 1;
    if (r < 0.33) level = 1;
    else if (r < 0.66) level = 2;
    else level = 3;

    const cfg = levels[level];

    // A–D: Order, Ticket, Priority, BA_Est_MD
    sheet.getRange(row, 1, 1, 4).setValues([[order, ticket, priority, cfg.BA]]);

    // E–J: BE_Study..BE_FixBUG
    sheet.getRange(row, 5, 1, 6).setValues([cfg.BE]);

    // L–Q: FE_Study..FE_FixBUG
    sheet.getRange(row, 12, 1, 6).setValues([cfg.FE]);

    // S–Z: QA_Study..QA_Exec_Mst
    sheet.getRange(row, 19, 1, 8).setValues([cfg.QA]);
  }
}

/************************************************************
 * 4) XOÁ DỮ LIỆU TICKET (GIỮ NGUYÊN CÔNG THỨC)
 ************************************************************/
function clearSampleTickets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Backlog_Sprint_Plan');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet "Backlog_Sprint_Plan". Hãy chạy setupSprintPlanningSheets() trước.');
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 2) return; // chỉ có header + mô tả

  const numRows = lastRow - 2; // số dòng dữ liệu
  // Xóa các cột user nhập tay, giữ nguyên công thức
  // A–D: Order, Ticket, Priority, BA_Est_MD
  sheet.getRange(3, 1, numRows, 4).clearContent();
  // E–J: BE_Study..BE_FixBUG
  sheet.getRange(3, 5, numRows, 6).clearContent();
  // L–Q: FE_Study..FE_FixBUG
  sheet.getRange(3, 12, numRows, 6).clearContent();
  // S–Z: QA_Study..QA_Exec_Mst
  sheet.getRange(3, 19, numRows, 8).clearContent();
}
