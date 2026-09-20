#!/usr/bin/env python3
"""Generate FE_Exam_Study_Tracker.xlsx: Professional 7-Sheet Japanese-Vietnamese FE Exam Workbook.
Uses openpyxl with Sumi & Slate styling, automated formulas, conditional formatting, and data validation.
"""

import json
from datetime import date, timedelta
from pathlib import Path
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BASE_DIR = Path(__file__).resolve().parent.parent
OUT_XLSX = BASE_DIR / "FE_Exam_Study_Tracker.xlsx"
DESKTOP_XLSX = Path("/Users/hoangson/Desktop/FE_Exam_Study_Tracker.xlsx")
VOCAB_JSON = BASE_DIR / "src/shared/constants/fe_vocab.json"

wb = openpyxl.Workbook()
# remove default sheet
wb.remove(wb.active)

# --- Style Palette (Sumi & Slate) ---
FONT_FAMILY = "Arial"
COLOR_HEADER_BG = "1F242D"       # Deep Slate Charcoal
COLOR_HEADER_FG = "FFFFFF"       # Crisp White
COLOR_SUBHEADER_BG = "2D3748"    # Medium Slate
COLOR_CARD_BG = "F7FAFC"         # Clean Off-white
COLOR_ACCENT_BLUE = "0052CC"     # Tokyo Blue
COLOR_ACCENT_GREEN = "059669"    # Emerald Pass
COLOR_ACCENT_AMBER = "D97706"    # Amber Caution
COLOR_ACCENT_RED = "DC2626"      # Crimson Fail
COLOR_ZEBRA = "F8FAFC"           # Subtle zebra striping
COLOR_BORDER = "E2E8F0"

font_title = Font(name=FONT_FAMILY, size=15, bold=True, color=COLOR_HEADER_BG)
font_subtitle = Font(name=FONT_FAMILY, size=10, italic=True, color="4A5568")
font_section = Font(name=FONT_FAMILY, size=12, bold=True, color="1E293B")
font_header = Font(name=FONT_FAMILY, size=10, bold=True, color=COLOR_HEADER_FG)
font_bold = Font(name=FONT_FAMILY, size=10, bold=True)
font_regular = Font(name=FONT_FAMILY, size=10)
font_small = Font(name=FONT_FAMILY, size=9, color="64748B")

fill_header = PatternFill(start_color=COLOR_HEADER_BG, end_color=COLOR_HEADER_BG, fill_type="solid")
fill_subheader = PatternFill(start_color=COLOR_SUBHEADER_BG, end_color=COLOR_SUBHEADER_BG, fill_type="solid")
fill_zebra = PatternFill(start_color=COLOR_ZEBRA, end_color=COLOR_ZEBRA, fill_type="solid")
fill_card = PatternFill(start_color="EDF2F7", end_color="EDF2F7", fill_type="solid")
fill_pass = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid") # light green
fill_fail = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # light red
fill_warning = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # light yellow

border_thin = Side(style="thin", color=COLOR_BORDER)
border_header = Side(style="thin", color="4B5563")
box_border = Border(left=border_thin, right=border_thin, top=border_thin, bottom=border_thin)
box_border_header = Border(left=border_header, right=border_header, top=border_header, bottom=border_header)

align_center = Alignment(horizontal="center", vertical="center")
align_left = Alignment(horizontal="left", vertical="center")
align_right = Alignment(horizontal="right", vertical="center")

# ==============================================================================
# SHEET 1: 📊 ダッシュボード (DASHBOARD)
# ==============================================================================
ws_dash = wb.create_sheet(title="📊 ダッシュボード")
ws_dash.views.sheetView[0].showGridLines = True

ws_dash["B2"] = "基本情報技術者試験 (FE) 学習進捗管理ダッシュボード"
ws_dash["B2"].font = font_title
ws_dash["B3"] = "FE Exam Master Study Dashboard & Executive Readiness Engine (Syllabus Ver. 9.1)"
ws_dash["B3"].font = font_subtitle

# KPI Summary Cards Block
kpis = [
    ("B5", "C5", "B6", "C6", "総学習時間 (Giờ đã học)", "='📅 日別計画・実績'!F5", "時間 (h)", "font-kpi"),
    ("D5", "E5", "D6", "E6", "目標総時間 (Mục tiêu)", 135, "時間 (135h)", "font-kpi"),
    ("F5", "G5", "F6", "G6", "計画達成率 (Tiến độ)", "=B6/D6", "%", "font-percent"),
    ("H5", "I5", "H6", "I6", "週末補修時間 (Cần bù)", "='📅 日別計画・実績'!H5", "時間 (h)", "font-kpi"),
]

for top_l, top_r, bot_l, bot_r, title, val, unit, style in kpis:
    ws_dash.merge_cells(f"{top_l}:{top_r}")
    ws_dash.merge_cells(f"{bot_l}:{bot_r}")
    ws_dash[top_l] = title
    ws_dash[top_l].font = font_small
    ws_dash[top_l].alignment = align_center
    ws_dash[top_l].fill = fill_card
    
    ws_dash[bot_l] = val
    ws_dash[bot_l].font = Font(name=FONT_FAMILY, size=14, bold=True, color="1E3A8A")
    ws_dash[bot_l].alignment = align_center
    ws_dash[bot_l].fill = fill_card
    if style == "font-percent":
        ws_dash[bot_l].number_format = "0.0%"

# Table 1: 3 Books Progress
ws_dash["B9"] = "📚 対象書籍 3冊の学習進捗サマリー (Tiến độ 3 Cuốn Sách)"
ws_dash["B9"].font = font_section

book_headers = [
    ("B10", "書籍名 (Tên sách)"),
    ("C10", "対応科目 (Môn)"),
    ("D10", "総章数/セット (Tổng chương)"),
    ("E10", "完了数 (Đã xong)"),
    ("F10", "進捗率 (Tiến độ)"),
    ("G10", "スキャン状況 (Scan PDF)"),
    ("H10", "学習ステータス (Trạng thái)"),
]

for cell_id, text in book_headers:
    ws_dash[cell_id] = text
    ws_dash[cell_id].font = font_header
    ws_dash[cell_id].fill = fill_header
    ws_dash[cell_id].alignment = align_center

book_rows = [
    ("かやのき先生の基本情報技術者教室 (Syllabus 9.1)", "科目A & B (Lý thuyết toàn diện)", 12, "='📚 3冊の学習進捗'!F18", "=E11/D11", "='📚 3冊の学習進捗'!E18", "進行中 (Đang học)"),
    ("福嶋先生の集中ゼミ 科目B・アルゴリズム編", "科目B (Thuật toán & Ngôn ngữ giả)", 10, "='📚 3冊の学習進捗'!F31", "=E12/D12", "='📚 3冊の学習進捗'!E31", "進行中 (Đang học)"),
    ("パーフェクトラーニング過去問題集 (R08)", "科目A & B (4 bộ đề + 25 PDF)", 4, "='📚 3冊の学習進捗'!F39", "=E13/D13", "='📚 3冊の学習進捗'!E39", "未着手 (Chưa làm)"),
]

for r_idx, row in enumerate(book_rows, start=11):
    for c_idx, val in enumerate(row, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_dash[f"{col_letter}{r_idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (4, 5):
            cell.alignment = align_center
        elif c_idx == 6:
            cell.alignment = align_center
            cell.number_format = "0.0%"
        elif c_idx in (7, 8):
            cell.alignment = align_center

# Table 2: Japanese Holidays & Special Kickstart Week
ws_dash["B15"] = "🎌 日本の祝日 & キックスタート休暇カレンダー (Lịch Nghỉ Lễ & Kickstart)"
ws_dash["B15"].font = font_section

holiday_headers = [
    ("B16", "期間 / 日付 (Ngày)"),
    ("C16", "祝日名・休暇名 (Tên ngày lễ)"),
    ("D16", "日数 (Số ngày)"),
    ("E16", "学習計画 (Giờ/ngày)"),
    ("F16", "戦略メモ (Chiến lược học tập)"),
]

for cell_id, text in holiday_headers:
    ws_dash[cell_id] = text
    ws_dash[cell_id].font = font_header
    ws_dash[cell_id].fill = fill_subheader
    ws_dash[cell_id].alignment = align_center

holiday_rows = [
    ("2026/09/21 - 09/27", "★ 特別全休キックスタート週 (Nghỉ trọn tuần)", "7日間", "2.5 - 3.0h", "Tạo trớn ban đầu: 60% lý thuyết かやのき + 40% thuật toán 福嶋 (Ramping Cadence chống kiệt sức)"),
    ("2026/10/12 (月)", "スポーツの日 (Sports Day)", "1日", "2.5h", "Luyện bài tập cấu trúc dữ liệu & thuật toán tìm kiếm"),
    ("2026/11/03 (火)", "文化の日 (Culture Day)", "1日", "2.5h", "Ôn tập chuyên đề Cơ sở dữ liệu & Mạng máy tính"),
    ("2026/11/23 (月)", "勤労感謝の日 (Labor Thanksgiving)", "1日", "2.5h", "Chuyên đề An toàn thông tin & Giải đề thi thử số 1"),
    ("2026/12/28 - 2027/01/03", "年末年始休暇 (Nghỉ Tết Dương Lịch)", "7日間", "3.0 - 4.0h", "TỔNG ÔN BỨT TỐC: Giải đề thi quá khứ R05, R06, R07 + Phân tích câu sai"),
    ("2027/01/11 (月)", "成人の日 (Coming of Age Day)", "1日", "3.0h", "Tổng duyệt đề thi thử R08 trước thềm đăng ký thi chính thức"),
]

for r_idx, row in enumerate(holiday_rows, start=17):
    for c_idx, val in enumerate(row, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_dash[f"{col_letter}{r_idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 4, 5):
            cell.alignment = align_center
        else:
            cell.alignment = align_left

# ==============================================================================
# SHEET 2: 📅 日別計画・実績 (DAILY STUDY LOG)
# ==============================================================================
ws_sched = wb.create_sheet(title="📅 日別計画・実績")
ws_sched.views.sheetView[0].showGridLines = True

ws_sched["B2"] = "日別学習計画・実績ログ (Daily Study Schedule & Actual Log)"
ws_sched["B2"].font = font_title
ws_sched["B3"] = "Bắt đầu: 2026/09/21 | Tự động tính giờ bù cuối tuần (Weekend Catch-up Buffer) & Phân bổ môn xen kẽ"
ws_sched["B3"].font = font_subtitle

# Summary formula row at top
ws_sched["D5"] = "合計 (Tổng cộng):"
ws_sched["D5"].font = font_bold
ws_sched["D5"].alignment = align_right
ws_sched["E5"] = "=SUM(E8:E120)"
ws_sched["E5"].font = font_bold
ws_sched["E5"].alignment = align_center
ws_sched["F5"] = "=SUM(F8:F120)"
ws_sched["F5"].font = font_bold
ws_sched["F5"].alignment = align_center
ws_sched["H5"] = "=SUM(H8:H120)"
ws_sched["H5"].font = font_bold
ws_sched["H5"].alignment = align_center

sched_headers = [
    ("B7", "Day"),
    ("C7", "日付 (Ngày)"),
    ("D7", "曜日 (Thứ)"),
    ("E7", "計画時間 (h)"),
    ("F7", "実績時間 (h)"),
    ("G7", "差異 (h)"),
    ("H7", "週末補修 (h)"),
    ("I7", "区分 (Loại ngày)"),
    ("J7", "対象科目 (Môn)"),
    ("K7", "学習内容 / 書籍章 (Chương / Bài học)"),
    ("L7", "集中度 (1-5★)"),
    ("M7", "Scan確認"),
    ("N7", "状態 (Status)"),
    ("O7", "学習メモ / 気づき (Ghi chú bài học)"),
]

for cell_id, text in sched_headers:
    ws_sched[cell_id] = text
    ws_sched[cell_id].font = font_header
    ws_sched[cell_id].fill = fill_header
    ws_sched[cell_id].alignment = align_center

# Generate 112 days (16 weeks) starting Monday 2026-09-21
start_d = date(2026, 9, 21)
jp_weekdays = ["月 (T2)", "火 (T3)", "水 (T4)", "木 (T5)", "金 (T6)", "土 (T7)", "日 (CN)"]

# Japanese holiday lookup set
jp_holidays_map = {
    date(2026, 9, 21): "敬老の日",
    date(2026, 9, 22): "国民の休日",
    date(2026, 9, 23): "秋分の日",
    date(2026, 10, 12): "スポーツの日",
    date(2026, 11, 3): "文化の日",
    date(2026, 11, 23): "勤労感謝の日",
    date(2027, 1, 11): "成人の日",
    date(2027, 2, 11): "建国記念の日",
    date(2027, 2, 23): "天皇誕生日",
}

for i in range(100):
    curr_d = start_d + timedelta(days=i)
    r_idx = 8 + i
    w_idx = curr_d.weekday() # 0 = Monday, 6 = Sunday
    w_str = jp_weekdays[w_idx]
    
    # Determine Day Type & Planned Hours
    is_kickstart_week = (date(2026, 9, 21) <= curr_d <= date(2026, 9, 27))
    is_nenmatsu = (date(2026, 12, 28) <= curr_d <= date(2027, 1, 3))
    is_holiday = curr_d in jp_holidays_map
    
    if is_kickstart_week:
        day_type = "★ 全休キックスタート"
        planned_h = 2.5
    elif is_nenmatsu:
        day_type = "🎌 年末年始休暇"
        planned_h = 3.5
    elif is_holiday:
        day_type = f"🎌 祝日 ({jp_holidays_map[curr_d]})"
        planned_h = 2.5
    elif w_idx in (5, 6): # Weekend
        day_type = "週末 (Cuối tuần)"
        planned_h = 2.5
    else:
        day_type = "平日 (Ngày thường)"
        planned_h = 1.0

    # Subject alternating strategy
    if w_idx in (0, 2, 4): # Mon, Wed, Fri
        subj = "科目A (かやのき)"
        content_hint = f"かやのき 第{(i//7)%12 + 1}章: Lý thuyết trọng tâm"
    elif w_idx in (1, 3, 5): # Tue, Thu, Sat
        subj = "科目B (福嶋)"
        content_hint = f"福嶋 アルゴリズム 第{(i//7)%10 + 1}章: Ngôn ngữ giả & Trace"
    else: # Sun
        subj = "過去問・復習"
        content_hint = "Tổng ôn tập tuần & Luyện đề quá khứ R08"

    ws_sched[f"B{r_idx}"] = f"Day {i+1:03d}"
    ws_sched[f"C{r_idx}"] = curr_d.strftime("%Y/%m/%d")
    ws_sched[f"D{r_idx}"] = w_str
    ws_sched[f"E{r_idx}"] = planned_h
    ws_sched[f"F{r_idx}"] = 0.0 # Actual hours (to be logged by user)
    ws_sched[f"G{r_idx}"] = f"=F{r_idx}-E{r_idx}" # Variance
    ws_sched[f"H{r_idx}"] = f"=IF(G{r_idx}<0, -G{r_idx}, 0)" # Catch up required
    ws_sched[f"I{r_idx}"] = day_type
    ws_sched[f"J{r_idx}"] = subj
    ws_sched[f"K{r_idx}"] = content_hint
    ws_sched[f"L{r_idx}"] = ""
    ws_sched[f"M{r_idx}"] = "未" # Scan status
    ws_sched[f"N{r_idx}"] = "未着手"
    ws_sched[f"O{r_idx}"] = ""

    # Styling
    for c_idx in range(2, 16):
        col_letter = get_column_letter(c_idx)
        cell = ws_sched[f"{col_letter}{r_idx}"]
        cell.font = font_regular
        cell.border = box_border
        if is_kickstart_week:
            cell.fill = fill_warning
        elif w_idx in (5, 6) or is_holiday:
            cell.fill = fill_zebra

    ws_sched[f"B{r_idx}"].alignment = align_center
    ws_sched[f"C{r_idx}"].alignment = align_center
    ws_sched[f"D{r_idx}"].alignment = align_center
    ws_sched[f"E{r_idx}"].alignment = align_center
    ws_sched[f"F{r_idx}"].alignment = align_center
    ws_sched[f"G{r_idx}"].alignment = align_center
    ws_sched[f"H{r_idx}"].alignment = align_center
    ws_sched[f"I{r_idx}"].alignment = align_center
    ws_sched[f"J{r_idx}"].alignment = align_center
    ws_sched[f"L{r_idx}"].alignment = align_center
    ws_sched[f"M{r_idx}"].alignment = align_center
    ws_sched[f"N{r_idx}"].alignment = align_center

# ==============================================================================
# SHEET 3: 📚 3冊の学習進捗 (3 BOOKS SYLLABUS)
# ==============================================================================
ws_books = wb.create_sheet(title="📚 3冊の学習進捗")
ws_books.views.sheetView[0].showGridLines = True

ws_books["B2"] = "3冊の教材・分野別進捗管理 (3 Books Detailed Syllabus & Scan Tracker)"
ws_books["B2"].font = font_title
ws_books["B3"] = "Theo dõi mục lục chi tiết, trạng thái scan PDF và số sao hiểu bài của 3 cuốn sách"
ws_books["B3"].font = font_subtitle

syllabus_headers = [
    ("B5", "章番号 / ID"),
    ("C5", "章の名称 (Tên chương / Mục kiến thức)"),
    ("D5", "分野 / シラバス区分 (Phân loại Syllabus 9.1)"),
    ("E5", "スキャン状況 (Scan PDF)"),
    ("F5", "完了状態 (Hoàn thành)"),
    ("G5", "理解度 (1-5★)"),
    ("H5", "完了日 (Ngày xong)"),
    ("I5", "重要ポイント / メモ (Ghi chú cốt lõi)"),
]

for cell_id, text in syllabus_headers:
    ws_books[cell_id] = text
    ws_books[cell_id].font = font_header
    ws_books[cell_id].fill = fill_header
    ws_books[cell_id].alignment = align_center

# Book 1: かやのき先生
ws_books["B6"] = "【書棚1】令和08年 かやのき先生の基本情報技術者教室 (Syllabus 9.1)"
ws_books["B6"].font = font_bold
ws_books["B6"].fill = fill_card

kayanoki_chapters = [
    ("Ch 01", "基礎理論 (離散数学・応用数学・情報理論)", "テクノロジ系 - 基礎理論", "未スキャン", "未着手", "", "", "Toán nhị phân, số bù 2, logic, tập hợp"),
    ("Ch 02", "アルゴリズムとデータ構造の基礎", "テクノロジ系 - 基礎理論", "未スキャン", "未着手", "", "", "Mảng, danh sách, cây, sắp xếp, tìm kiếm cơ bản"),
    ("Ch 03", "ハードウェアとコンピュータ構成要素", "テクノロジ系 - コンピュータ", "未スキャン", "未着手", "", "", "CPU, RAM, ROM, Bus, thiết bị ngoại vi"),
    ("Ch 04", "システム構成要素と稼働率 (MTBF/MTTR)", "テクノロジ系 - システム構成", "未スキャン", "未着手", "", "", "Độ khả dụng hệ thống, Dual/Duplex, RAID"),
    ("Ch 05", "ソフトウェアとオペレーティングシステム (OS)", "テクノロジ系 - OS・ソフト", "未スキャン", "未着手", "", "", "Tiến trình, quản lý bộ nhớ ảo, phân trang, ngắt"),
    ("Ch 06", "データベースとSQL (正規化・トランザクション)", "テクノロジ系 - データベース", "未スキャン", "未着手", "", "", "RDBMS, khóa chính/ngoại, 1NF-3NF, ACID, Commit/Rollback"),
    ("Ch 07", "ネットワーク技術 (TCP/IP・ルーティング・DNS)", "テクノロジ系 - ネットワーク", "未スキャン", "未着手", "", "", "Mô hình OSI, TCP/UDP, IP, Subnet mask, Port"),
    ("Ch 08", "情報セキュリティ (暗号・署名・攻撃手法・FW)", "テクノロジ系 - セキュリティ", "未スキャン", "未着手", "", "", "Trọng tâm môn A&B: Mã hóa khóa công khai, SHA, WAF, XSS, SQLi"),
    ("Ch 09", "システム開発技術 (設計・テスト・アジャイル)", "テクノロジ系 - 開発技術", "未スキャン", "未着手", "", "", "Quy trình Waterfall, Agile, White-box / Black-box test"),
    ("Ch 10", "プロジェクトマネジメント (WBS・EVM・日程計算)", "マネジメント系 - プロジェクト", "未スキャン", "未着手", "", "", "Mỏ điểm dễ ăn: Arrow diagram, Critical Path, Float"),
    ("Ch 11", "サービスマネジメントとシステム監査 (ITIL・SLA)", "マネジメント系 - サービス", "未スキャン", "未着手", "", "", "SLA, Quản lý sự cố, Quản lý thay đổi, Kiểm toán hệ thống"),
    ("Ch 12", "経営戦略・システム戦略・企業と法務", "ストラテジ系 - 経営・法務", "未スキャン", "未着手", "", "", "SWOT, PPM, Bản quyền, Luật bảo vệ thông tin cá nhân"),
]

for idx, ch in enumerate(kayanoki_chapters, start=7):
    for c_idx, val in enumerate(ch, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_books[f"{col_letter}{idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 5, 6, 7, 8):
            cell.alignment = align_center

# Book 2: 福嶋先生
ws_books["B19"] = "【書棚2】福嶋先生の集中ゼミ 科目B・アルゴリズム編 (2024年版)"
ws_books["B19"].font = font_bold
ws_books["B19"].fill = fill_card

fukushima_chapters = [
    ("Ch 01", "擬似言語の基礎構文・変数のスコープ・配列仕様", "科目B - 言語仕様", "未スキャン", "未着手", "", "", "Quy tắc chỉ số mảng từ 1, mũi tên gán, cấu trúc rẽ nhánh/vòng lặp"),
    ("Ch 02", "配列の基本操作とトレース表の書き方", "科目B - トレース技法", "未スキャン", "未着手", "", "", "Cách lập bảng trace biến, kiểm tra giá trị qua từng bước"),
    ("Ch 03", "線形探索と2分探索アルゴリズムの徹底解剖", "科目B - 探索", "未スキャン", "未着手", "", "", "Kỹ thuật lính canh 番兵法, công thức tìm mid = (low+high)/2"),
    ("Ch 04", "整列アルゴリズム (バブル・選択・挿入ソート)", "科目B - ソート基本", "未スキャン", "未着手", "", "", "Đếm số lần hoán đổi, số lần so sánh, điều kiện dừng"),
    ("Ch 05", "高度な整列 (クイックソート・マージソート)", "科目B - ソート応用", "未スキャン", "未着手", "", "", "Kỹ thuật chia để trị, pivot, mảng phụ trợ"),
    ("Ch 06", "スタックとキューの擬似言語実装と応用", "科目B - データ構造", "未スキャン", "未着手", "", "", "Push/Pop mảng, vòng lặp Queue tròn (Ring buffer)"),
    ("Ch 07", "2分木と木構造の巡回アルゴリズム (先行/中間/後続)", "科目B - 木構造", "未スキャン", "未着手", "", "", "DFS/BFS trên cây nhị phân, thao tác chèn/xóa nút"),
    ("Ch 08", "再帰関数のトレースとコールスタックの理解", "科目B - 再帰", "未スキャン", "未着手", "", "", "Đệ quy Fibonacci, tính giai thừa, điều kiện dừng"),
    ("Ch 09", "グラフの最短経路問題 (ダイクストラ法)", "科目B - グラフ", "未スキャン", "未着手", "", "", "Bảng trọng số ma trận kề, cập nhật khoảng cách ngắn nhất"),
    ("Ch 10", "科目B 実戦模擬問題演習 (総合問題)", "科目B - 実戦演習", "未スキャン", "未着手", "", "", "Rèn luyện áp lực thời gian 6-8 phút/bài thuật toán lớn"),
]

for idx, ch in enumerate(fukushima_chapters, start=20):
    for c_idx, val in enumerate(ch, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_books[f"{col_letter}{idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 5, 6, 7, 8):
            cell.alignment = align_center

# Book 3: パーフェクトラーニング
ws_books["B31"] = "【書棚3】令和08年 基本情報技術者 パーフェクトラーニング過去問題集"
ws_books["B31"].font = font_bold
ws_books["B31"].fill = fill_card

past_papers = [
    ("Set 01", "令和05年 公開問題 (科目A 60問 + 科目B 20問)", "過去問演習", "未スキャン", "未着手", "", "", "Bộ đề công bố chính thức năm R05 của IPA"),
    ("Set 02", "令和06年 公開問題 (科目A 60問 + 科目B 20問)", "過去問演習", "未スキャン", "未着手", "", "", "Bộ đề công bố chính thức năm R06 của IPA"),
    ("Set 03", "令和07年 公開問題 (科目A 60問 + 科目B 20問)", "過去問演習", "未スキャン", "未着手", "", "", "Bộ đề công bố chính thức năm R07 của IPA"),
    ("Set 04", "令和08年 予想模擬問題 (科目A 60問 + 科目B 20問)", "予想模試", "未スキャン", "未着手", "", "", "Đề thi thử dự đoán xác thực theo Syllabus 9.1 mới nhất"),
]

for idx, ch in enumerate(past_papers, start=32):
    for c_idx, val in enumerate(ch, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_books[f"{col_letter}{idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 5, 6, 7, 8):
            cell.alignment = align_center

# Book summary formulas
ws_books["E18"] = "未"
ws_books["F18"] = '=COUNTIF(F7:F18, "完了")'
ws_books["E31"] = "未"
ws_books["F31"] = '=COUNTIF(F20:F29, "完了")'
ws_books["E39"] = "未"
ws_books["F39"] = '=COUNTIF(F32:F35, "完了")'

# ==============================================================================
# SHEET 4: 📝 模擬試験・過去問スコア (MOCK EXAM SCORES)
# ==============================================================================
ws_mock = wb.create_sheet(title="📝 模擬試験・過去問スコア")
ws_mock.views.sheetView[0].showGridLines = True

ws_mock["B2"] = "模擬試験・過去問 得点記録 & IPA合否判定 (Mock Exam Score Analytics)"
ws_mock["B2"].font = font_title
ws_mock["B3"] = "Chuẩn đỗ IPA: Cả 2 môn đều phải >= 600/1000 điểm | Mức an toàn: >= 700 điểm"
ws_mock["B3"].font = font_subtitle

mock_headers = [
    ("B5", "回数 / ID"),
    ("C5", "実施日 (Ngày làm)"),
    ("D5", "試験セット名 (Tên đề thi)"),
    ("E5", "科目A正解数 (/60)"),
    ("F5", "科目A正解率 (%)"),
    ("G5", "科目Aスコア (/1000)"),
    ("H5", "科目A判定"),
    ("I5", "科目Bアルゴリズム (/16)"),
    ("J5", "科目Bセキュリティ (/4)"),
    ("K5", "科目B合計 (/20)"),
    ("L5", "科目B正解率 (%)"),
    ("M5", "科目Bスコア (/1000)"),
    ("N5", "科目B判定"),
    ("O5", "総合判定 (Pass/Fail)"),
    ("P5", "所要時間 (Phút)"),
    ("Q5", "分析 & 弱点メモ (Ghi chú điểm yếu)"),
]

for cell_id, text in mock_headers:
    ws_mock[cell_id] = text
    ws_mock[cell_id].font = font_header
    ws_mock[cell_id].fill = fill_header
    ws_mock[cell_id].alignment = align_center

sample_mocks = [
    ("Mock 01", "", "令和05年 公開問題 (R05)", 0, "=E6/60", "=F6*1000", '=IF(G6>=700,"安全圏",IF(G6>=600,"合格","不合格"))', 0, 0, "=I6+J6", "=K6/20", "=L6*1000", '=IF(M6>=700,"安全圏",IF(M6>=600,"合格","不合格"))', '=IF(AND(G6>=600,M6>=600),"★ 合格 (PASS)","✕ 不合格 (FAIL)")', "", ""),
    ("Mock 02", "", "令和06年 公開問題 (R06)", 0, "=E7/60", "=F7*1000", '=IF(G7>=700,"安全圏",IF(G7>=600,"合格","不合格"))', 0, 0, "=I7+J7", "=K7/20", "=L7*1000", '=IF(M7>=700,"安全圏",IF(M7>=600,"合格","不合格"))', '=IF(AND(G7>=600,M7>=600),"★ 合格 (PASS)","✕ 不合格 (FAIL)")', "", ""),
    ("Mock 03", "", "令和07年 公開問題 (R07)", 0, "=E8/60", "=F8*1000", '=IF(G8>=700,"安全圏",IF(G8>=600,"合格","不合格"))', 0, 0, "=I8+J8", "=K8/20", "=L8*1000", '=IF(M8>=700,"安全圏",IF(M8>=600,"合格","不合格"))', '=IF(AND(G8>=600,M8>=600),"★ 合格 (PASS)","✕ 不合格 (FAIL)")', "", ""),
    ("Mock 04", "", "令和08年 予想模試 (R08)", 0, "=E9/60", "=F9*1000", '=IF(G9>=700,"安全圏",IF(G9>=600,"合格","不合格"))', 0, 0, "=I9+J9", "=K9/20", "=L9*1000", '=IF(M9>=700,"安全圏",IF(M9>=600,"合格","不合格"))', '=IF(AND(G9>=600,M9>=600),"★ 合格 (PASS)","✕ 不合格 (FAIL)")', "", ""),
    ("Mock 05", "", "DEKIDAS-WEB 模擬演習 01", 0, "=E10/60", "=F10*1000", '=IF(G10>=700,"安全圏",IF(G10>=600,"合格","不合格"))', 0, 0, "=I10+J10", "=K10/20", "=L10*1000", '=IF(M10>=700,"安全圏",IF(M10>=600,"合格","不合格"))', '=IF(AND(G10>=600,M10>=600),"★ 合格 (PASS)","✕ 不合格 (FAIL)")', "", ""),
]

for idx, m in enumerate(sample_mocks, start=6):
    for c_idx, val in enumerate(m, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_mock[f"{col_letter}{idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 3, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16):
            cell.alignment = align_center
        if c_idx in (6, 12):
            cell.number_format = "0.0%"
        if c_idx in (7, 13):
            cell.number_format = "#,##0"

# ==============================================================================
# SHEET 5: 🔁 復習・間違いノート (ERROR NOTE & SPACED REPETITION)
# ==============================================================================
ws_err = wb.create_sheet(title="🔁 復習・間違いノート")
ws_err.views.sheetView[0].showGridLines = True

ws_err["B2"] = "誤答・復習ノート (Error Notebook & 3-Cycle Spaced Repetition)"
ws_err["B2"].font = font_title
ws_err["B3"] = "Chu trình ôn lại ngắt quãng 3 lần: Lần 1 (Sau 1 ngày) -> Lần 2 (Sau 3 ngày) -> Lần 3 (Sau 7 ngày)"
ws_err["B3"].font = font_subtitle

err_headers = [
    ("B5", "ID"),
    ("C5", "出題元 / 問題番号 (Nguồn & Câu số)"),
    ("D5", "分野 / シラバス項目 (Chuyên đề)"),
    ("E5", "問題の要約 (Tóm tắt câu hỏi)"),
    ("F5", "正解 (Đáp án đúng)"),
    ("G5", "自分の誤答 (Đáp án mình chọn)"),
    ("H5", "間違いの原因 (Nguyên nhân sai)"),
    ("I5", "なぜ間違えたか / ポイント (Bản chất & Điểm cốt lõi)"),
    ("J5", "復習1回目 (Lần 1)"),
    ("K5", "復習2回目 (Lần 2)"),
    ("L5", "復習3回目 (Lần 3)"),
    ("M5", "習得状態 (Mastery)"),
]

for cell_id, text in err_headers:
    ws_err[cell_id] = text
    ws_err[cell_id].font = font_header
    ws_err[cell_id].fill = fill_header
    ws_err[cell_id].alignment = align_center

# Sample mistake entries as guide
sample_errs = [
    ("ERR-001", "かやのき Ch04 問12", "システム構成", "MTBFとMTTRから稼働率を求める計算問題", "ア (0.96)", "ウ (0.80)", "計算・公式の混同", "公式: MTBF / (MTBF + MTTR). Đọc nhầm số liệu của 2 server dự phòng.", "〇 (Đạt)", "〇 (Đạt)", "未", "復習中"),
    ("ERR-002", "福嶋 Ch03 例題2", "科目B・2分探索", "探索範囲の更新時 low = mid + 1 の +1 を忘れて無限ループになるバグ", "イ (low ← mid + 1)", "エ (low ← mid)", "アルゴリズム理解不足", "Khi cập nhật khoảng tìm kiếm nửa sau, bắt buộc phải loại trừ vị trí mid hiện tại bằng +1.", "〇 (Đạt)", "未", "未", "復習中"),
    ("ERR-003", "パーフェクト R05 問28", "セキュリティ", "公開鍵暗号方式における秘密鍵の役割 (暗号化 vs 署名)", "エ (送信者の秘密鍵で署名)", "ア (受信者の公開鍵で署名)", "日本語の読解ミス", "Chữ ký số dùng khóa bí mật của người gửi để ký, khóa công khai của người gửi để xác thực!", "未", "未", "未", "要復習"),
]

for idx, e in enumerate(sample_errs, start=6):
    for c_idx, val in enumerate(e, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_err[f"{col_letter}{idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 7, 10, 11, 12, 13):
            cell.alignment = align_center

# ==============================================================================
# SHEET 6: 📖 IT専門用語集 (IT VOCAB GLOSSARY)
# ==============================================================================
ws_vocab = wb.create_sheet(title="📖 IT専門用語集")
ws_vocab.views.sheetView[0].showGridLines = True

ws_vocab["B2"] = "IT専門用語集 - Mazii連携 (FE Core Japanese IT Glossary from Mazii)"
ws_vocab["B2"].font = font_title
ws_vocab["B3"] = "Trích xuất từ cơ sở dữ liệu từ điển Mazii SQLite (dict.sqlite) | Phân loại theo 3 nhóm kiến thức IPA"
ws_vocab["B3"].font = font_subtitle

vocab_headers = [
    ("B5", "ID"),
    ("C5", "用語 (Thuật ngữ Kanji/Kana)"),
    ("D5", "読み方 (Phiên âm Hiragana/Kana)"),
    ("E5", "英語表記 (Thuật ngữ tiếng Anh)"),
    ("F5", "ベトナム語の意味 (Giải nghĩa tiếng Việt Mazii)"),
    ("G5", "シラバス分野 (Phân loại)"),
    ("H5", "重要度 (Độ quan trọng)"),
    ("I5", "習得 (Mastered)"),
    ("J5", "暗記メモ (Ghi chú cá nhân)"),
]

for cell_id, text in vocab_headers:
    ws_vocab[cell_id] = text
    ws_vocab[cell_id].font = font_header
    ws_vocab[cell_id].fill = fill_header
    ws_vocab[cell_id].alignment = align_center

# Load vocab from fe_vocab.json
if VOCAB_JSON.exists():
    with open(VOCAB_JSON, "r", encoding="utf-8") as f:
        vocab_data = json.load(f)
else:
    vocab_data = []

for idx, v in enumerate(vocab_data, start=6):
    row_vals = [
        v.get("id", f"FE-{idx:03d}"),
        v.get("expression", ""),
        v.get("reading", ""),
        v.get("en", ""),
        v.get("vi", ""),
        v.get("category", ""),
        v.get("importance", "⭐⭐⭐"),
        "未" if not v.get("mastered") else "済",
        v.get("notes", "")
    ]
    for c_idx, val in enumerate(row_vals, start=2):
        col_letter = get_column_letter(c_idx)
        cell = ws_vocab[f"{col_letter}{idx}"]
        cell.value = val
        cell.font = font_regular
        cell.border = box_border
        if c_idx in (2, 8, 9):
            cell.alignment = align_center
        elif c_idx == 4:
            cell.alignment = align_left

# ==============================================================================
# SHEET 7: ⚙️ 設定・祝日一覧 (SETTINGS & HOLIDAYS)
# ==============================================================================
ws_settings = wb.create_sheet(title="⚙️ 設定・祝日一覧")
ws_settings.views.sheetView[0].showGridLines = True

ws_settings["B2"] = "システム設定 & 日本祝日一覧 (Master Parameters & Holidays)"
ws_settings["B2"].font = font_title
ws_settings["B3"] = "Bảng tham số chuẩn kỳ thi FE và lịch đỏ Nhật Bản năm 2026 - 2027"
ws_settings["B3"].font = font_subtitle

# Parameters
ws_settings["B5"] = "システム設定パラメータ (Tham số hệ thống)"
ws_settings["B5"].font = font_section

settings_rows = [
    ("目標総学習時間 (Tổng giờ học mục tiêu)", 135, "時間 (h) - Đủ để cày nát 3 cuốn sách và giải đề"),
    ("合格基準スコア (Điểm đỗ tối thiểu IPA)", 600, "点 / 1000点 (Áp dụng cho CẢ HAI môn A và B)"),
    ("安全圏目標スコア (Ngưỡng điểm an toàn)", 700, "点 / 1000点 (Đảm bảo đỗ chắc chắn không sợ sai số IRT)"),
    ("平日1日目標 (Mục tiêu ngày thường)", 1.0, "時間/日 (Sau giờ làm việc tại nhà)"),
    ("週末1日目標 (Mục tiêu cuối tuần)", 2.5, "時間/日 (Thứ 7 & Chủ Nhật)"),
    ("祝日1日目標 (Mục tiêu ngày nghỉ lễ đơn)", 2.5, "時間/日 (Các ngày lịch đỏ trong tuần)"),
    ("キックスタート全休目標 (Tuần nghỉ 21-27/09)", 2.5, "時間/日 (7 ngày liên tục = ~18-21 giờ)"),
    ("年末年始目標 (Tết 28/12 - 03/01)", 3.5, "時間/日 (7 ngày bứt tốc giải đề quá khứ)"),
    ("受験料 (Lệ phí thi FE chính thức)", 7500, "円 (Đã bao gồm thuế)"),
]

for idx, s in enumerate(settings_rows, start=6):
    ws_settings[f"B{idx}"] = s[0]
    ws_settings[f"C{idx}"] = s[1]
    ws_settings[f"D{idx}"] = s[2]
    ws_settings[f"B{idx}"].font = font_regular
    ws_settings[f"C{idx}"].font = font_bold
    ws_settings[f"D{idx}"].font = font_small
    ws_settings[f"B{idx}"].border = box_border
    ws_settings[f"C{idx}"].border = box_border
    ws_settings[f"D{idx}"].border = box_border
    ws_settings[f"C{idx}"].alignment = align_center

# Auto-adjust column widths for all sheets
for sheet in wb.worksheets:
    for col in sheet.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val_str = str(cell.value or '')
            # approximate width for CJK characters
            cjk_len = sum(2 if ord(c) > 127 else 1 for c in val_str)
            if cjk_len > max_len:
                max_len = cjk_len
        sheet.column_dimensions[col_letter].width = min(max(max_len + 3, 11), 50)

# Save to Scratch and Desktop
wb.save(OUT_XLSX)
print(f"Saved Excel Workbook: {OUT_XLSX}")

try:
    import shutil
    shutil.copy2(OUT_XLSX, DESKTOP_XLSX)
    print(f"Successfully copied to Desktop: {DESKTOP_XLSX}")
except Exception as e:
    print(f"Could not copy to Desktop: {e}")
