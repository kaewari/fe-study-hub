#!/usr/bin/env python3
"""Extract FE (基本情報技術者) core IT vocabulary from Mazii SQLite dictionary.
Source: /Users/hoangson/Projects/YouTube JP Caption Studio/data/dict/dict.sqlite
Outputs: fe_vocab.json
"""

import json
import sqlite3
from pathlib import Path

DICT_PATH = Path("/Users/hoangson/Projects/YouTube JP Caption Studio/data/dict/dict.sqlite")
OUT_JSON = Path("/Users/hoangson/.gemini/antigravity/scratch/fe-study-hub/src/shared/constants/fe_vocab.json")
OUT_JSON.parent.mkdir(parents=True, exist_ok=True)

# Curated high-yield Fundamental IT (FE) terms across 3 IPA areas
FE_TERMS_CATALOG = [
    # --- テクノロジ系 (Technology) : 基礎理論 & アルゴリズム ---
    {"term": "アルゴリズム", "en": "Algorithm", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "擬似言語", "en": "Pseudo-language / Pseudo-code", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "配列", "en": "Array", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "スタック", "en": "Stack (LIFO)", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "キュー", "en": "Queue (FIFO)", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "木構造", "en": "Tree Structure", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "2分探索木", "en": "Binary Search Tree", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "線形探索", "en": "Linear Search", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐"},
    {"term": "二分探索", "en": "Binary Search", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "ハッシュ法", "en": "Hashing", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "再帰", "en": "Recursion", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "整列", "en": "Sorting", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "クイックソート", "en": "Quick Sort", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "マージソート", "en": "Merge Sort", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐"},
    {"term": "ヒープソート", "en": "Heap Sort", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐"},
    {"term": "計算量", "en": "Computational Complexity (O-notation)", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "論理演算", "en": "Logical Operation (AND, OR, XOR)", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "基数変換", "en": "Radix Conversion (2, 8, 10, 16진)", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "補数", "en": "Complement (2's complement)", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐⭐"},
    {"term": "浮動小数点", "en": "Floating Point", "category": "テクノロジ系 - 基礎理論", "importance": "⭐⭐"},

    # --- テクノロジ系 (Technology) : コンピュータ構成 & OS ---
    {"term": "主記憶", "en": "Main Memory (RAM)", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "補助記憶", "en": "Secondary Storage", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐"},
    {"term": "キャッシュメモリ", "en": "Cache Memory", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "仮想記憶", "en": "Virtual Memory", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "ページング", "en": "Paging", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "スワッピング", "en": "Swapping", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐"},
    {"term": "割り込み", "en": "Interrupt", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "パイプライン", "en": "Pipelining", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "排他制御", "en": "Exclusive Control / Mutual Exclusion", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "デッドロック", "en": "Deadlock", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "スループット", "en": "Throughput", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "ターンアラウンドタイム", "en": "Turnaround Time", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐"},
    {"term": "稼働率", "en": "Availability / Uptime Rate (MTBF / MTBF+MTTR)", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "平均故障間隔", "en": "MTBF (Mean Time Between Failures)", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "平均修復時間", "en": "MTTR (Mean Time To Repair)", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "デュアルシステム", "en": "Dual System", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "デュプレックスシステム", "en": "Duplex System", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},
    {"term": "RAID", "en": "RAID (Redundant Array of Inexpensive Disks)", "category": "テクノロジ系 - システム構成", "importance": "⭐⭐⭐"},

    # --- テクノロジ系 (Technology) : データベース & ネットワーク ---
    {"term": "関係データベース", "en": "Relational Database (RDB)", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "主キー", "en": "Primary Key", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "外部キー", "en": "Foreign Key", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "正規化", "en": "Normalization (1NF, 2NF, 3NF)", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "トランザクション", "en": "Transaction (ACID properties)", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "コミット", "en": "Commit", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "ロールバック", "en": "Rollback", "category": "テクノロジ系 - データベース", "importance": "⭐⭐⭐"},
    {"term": "インデックス", "en": "Index", "category": "テクノロジ系 - データベース", "importance": "⭐⭐"},
    {"term": "サブネットマスク", "en": "Subnet Mask", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},
    {"term": "デフォルトゲートウェイ", "en": "Default Gateway", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},
    {"term": "ルーティング", "en": "Routing", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},
    {"term": "DNS", "en": "Domain Name System", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},
    {"term": "DHCP", "en": "Dynamic Host Configuration Protocol", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},
    {"term": "MACアドレス", "en": "MAC Address", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐"},
    {"term": "ポート番号", "en": "Port Number", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},
    {"term": "TCP/IP", "en": "TCP/IP Protocol Suite", "category": "テクノロジ系 - ネットワーク", "importance": "⭐⭐⭐"},

    # --- テクノロジ系 (Technology) : 情報セキュリティ (科目A & 科目B siêu trọng tâm) ---
    {"term": "情報セキュリティ", "en": "Information Security (CIA)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "機密性", "en": "Confidentiality", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "完全性", "en": "Integrity", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "可用性", "en": "Availability", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "脆弱性", "en": "Vulnerability", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "共通鍵暗号", "en": "Symmetric-Key Cryptography (AES)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "公開鍵暗号", "en": "Public-Key Cryptography (RSA)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "公開鍵", "en": "Public Key", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "秘密鍵", "en": "Private / Secret Key", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "ハッシュ関数", "en": "Hash Function (SHA-256)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "デジタル署名", "en": "Digital Signature", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "認証局", "en": "Certificate Authority (CA)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "電子証明書", "en": "Digital Certificate", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "多要素認証", "en": "Multi-Factor Authentication (MFA)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "ファイアウォール", "en": "Firewall", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "パケットフィルタリング", "en": "Packet Filtering", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "マルウェア", "en": "Malware", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "ランサムウェア", "en": "Ransomware", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "フィッシング", "en": "Phishing", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "SQLインジェクション", "en": "SQL Injection", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "クロスサイトスクリプティング", "en": "Cross-Site Scripting (XSS)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "DoS攻撃", "en": "Denial of Service (DoS/DDoS)", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "ソーシャルエンジニアリング", "en": "Social Engineering", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "標的型攻撃", "en": "Targeted Attack / APT", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},
    {"term": "ゼロデイ攻撃", "en": "Zero-Day Attack", "category": "テクノロジ系 - セキュリティ", "importance": "⭐⭐⭐"},

    # --- マネジメント系 (Management) : プロジェクト & サービスマネジメント ---
    {"term": "プロジェクトマネジメント", "en": "Project Management", "category": "マネジメント系 - プロジェクト", "importance": "⭐⭐⭐"},
    {"term": "WBS", "en": "Work Breakdown Structure", "category": "マネジメント系 - プロジェクト", "importance": "⭐⭐⭐"},
    {"term": "アローダイヤグラム", "en": "Arrow Diagram (PERT Chart)", "category": "マネジメント系 - プロジェクト", "importance": "⭐⭐⭐"},
    {"term": "クリティカルパス", "en": "Critical Path", "category": "マネジメント系 - プロジェクト", "importance": "⭐⭐⭐"},
    {"term": "ガントチャート", "en": "Gantt Chart", "category": "マネジメント系 - プロジェクト", "importance": "⭐⭐"},
    {"term": "ファンクションポイント法", "en": "Function Point Method", "category": "マネジメント系 - プロジェクト", "importance": "⭐⭐⭐"},
    {"term": "サービスマネジメント", "en": "IT Service Management (ITIL)", "category": "マネジメント系 - サービス", "importance": "⭐⭐⭐"},
    {"term": "SLA", "en": "Service Level Agreement", "category": "マネジメント系 - サービス", "importance": "⭐⭐⭐"},
    {"term": "SLM", "en": "Service Level Management", "category": "マネジメント系 - サービス", "importance": "⭐⭐"},
    {"term": "インシデント管理", "en": "Incident Management", "category": "マネジメント系 - サービス", "importance": "⭐⭐⭐"},
    {"term": "問題管理", "en": "Problem Management", "category": "マネジメント系 - サービス", "importance": "⭐⭐⭐"},
    {"term": "変更管理", "en": "Change Management", "category": "マネジメント系 - サービス", "importance": "⭐⭐"},
    {"term": "システム監査", "en": "System Audit", "category": "マネジメント系 - 監査", "importance": "⭐⭐⭐"},

    # --- ストラテジ系 (Strategy) : 経営戦略 & システム戦略 & 法務 ---
    {"term": "経営戦略", "en": "Corporate Strategy", "category": "ストラテジ系 - 経営", "importance": "⭐⭐⭐"},
    {"term": "SWOT分析", "en": "SWOT Analysis", "category": "ストラテジ系 - 経営", "importance": "⭐⭐⭐"},
    {"term": "PPM", "en": "Product Portfolio Management", "category": "ストラテジ系 - 経営", "importance": "⭐⭐⭐"},
    {"term": "BSC", "en": "Balanced Scorecard", "category": "ストラテジ系 - 経営", "importance": "⭐⭐⭐"},
    {"term": "KPI", "en": "Key Performance Indicator", "category": "ストラテジ系 - 経営", "importance": "⭐⭐⭐"},
    {"term": "CSF", "en": "Critical Success Factor", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "ROI", "en": "Return On Investment", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "損益分岐点", "en": "Break-even Point", "category": "ストラテジ系 - 経営", "importance": "⭐⭐⭐"},
    {"term": "デファクトスタンダード", "en": "De Facto Standard", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "BPR", "en": "Business Process Reengineering", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "ERP", "en": "Enterprise Resource Planning", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "CRM", "en": "Customer Relationship Management", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "SCM", "en": "Supply Chain Management", "category": "ストラテジ系 - 経営", "importance": "⭐⭐"},
    {"term": "知的財産権", "en": "Intellectual Property Rights", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "著作権法", "en": "Copyright Act", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "特許権", "en": "Patent Right", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "個人情報保護法", "en": "Act on the Protection of Personal Information", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "不正アクセス禁止法", "en": "Unauthorized Computer Access Act", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "労働者派遣法", "en": "Worker Dispatching Act", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "請負契約", "en": "Contract for Work (Ukeoi)", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
    {"term": "準委任契約", "en": "Quasi-Mandate Contract (Jun-inin)", "category": "ストラテジ系 - 法務", "importance": "⭐⭐⭐"},
]

def main():
    conn = sqlite3.connect(DICT_PATH)
    cur = conn.cursor()

    vocab_list = []
    found_count = 0

    # High precision IT definitions override for FE contexts
    IT_GLOSSARY_ACCURATE = {
        "アルゴリズム": "Thuật toán (Trình tự hữu hạn các bước tính toán để giải quyết bài toán)",
        "擬似言語": "Ngôn ngữ giả (Mã giả chuẩn của IPA dùng trong bài thi môn B)",
        "配列": "Mảng dữ liệu (Cấu trúc lưu trữ tuần tự các phần tử cùng kiểu)",
        "スタック": "Ngăn xếp Stack (Cơ chế vào sau ra trước LIFO - Push / Pop)",
        "キュー": "Hàng đợi Queue (Cơ chế vào trước ra trước FIFO - Enqueue / Dequeue)",
        "木構造": "Cấu trúc cây Tree (Gốc Root, Nút Node, Lá Leaf, Cây con Subtree)",
        "2分探索木": "Cây nhị phân tìm kiếm BST (Nút con trái < Nút cha <= Nút con phải)",
        "線形探索": "Tìm kiếm tuyến tính (Quét tuần tự từ đầu đến cuối O(n), kèm kỹ thuật lính canh 番兵法)",
        "二分探索": "Tìm kiếm nhị phân (Chia đôi khoảng tìm kiếm O(log n), yêu cầu mảng đã sắp xếp)",
        "ハッシュ法": "Bảng băm Hashing (Ánh xạ khóa qua hàm băm O(1), xử lý va chạm collision)",
        "再帰": "Đệ quy Recursion (Hàm tự gọi lại chính nó với điều kiện dừng cơ sở)",
        "整列": "Thuật toán sắp xếp Sort (Chuyển đổi thứ tự phần tử tăng dần hoặc giảm dần)",
        "クイックソート": "Sắp xếp nhanh Quicksort (Chọn pivot phân hoạch, độ phức tạp trung bình O(n log n))",
        "マージソート": "Sắp xếp trộn Merge sort (Chia để trị, ổn định stable sort, O(n log n))",
        "ヒープソート": "Sắp xếp vun đống Heapsort (Dựa trên cấu trúc cây nhị phân Heap, O(n log n))",
        "計算量": "Độ phức tạp tính toán (Độ phức tạp thời gian & không gian ký hiệu Big-O)",
        "論理演算": "Phép toán logic (AND nhân logic, OR cộng logic, XOR loại trừ, NOT phủ định)",
        "基数変換": "Chuyển đổi cơ số (Hệ 2 nhị phân, hệ 10 thập phân, hệ 16 thập lục phân)",
        "補数": "Số bù (Số bù 2 dùng để biểu diễn số âm trong hệ nhị phân)",
        "浮動小数点": "Số thực dấu phẩy động (Tiêu chuẩn IEEE 754: Dấu Sign, Phần mũ Exponent, Phần định trị Mantissa)",
        "主記憶": "Bộ nhớ chính RAM (Lưu trữ chương trình và dữ liệu đang thực thi)",
        "補助記憶": "Bộ nhớ phụ (Ổ cứng SSD, HDD lưu trữ dữ liệu lâu dài không mất điện)",
        "キャッシュメモリ": "Bộ nhớ đệm Cache (SRAM tốc độ cao giữa CPU và RAM giảm độ trễ)",
        "仮想記憶": "Bộ nhớ ảo Virtual Memory (Mở rộng không gian địa chỉ RAM ra ổ đĩa phụ)",
        "ページング": "Phân trang Paging (Chia bộ nhớ ảo thành các trang page có kích thước cố định)",
        "スワッピング": "Hoán đổi Swapping (Chuyển tiến trình từ RAM ra bộ nhớ phụ khi thiếu bộ nhớ)",
        "割り込み": "Ngắt Interrupt (Ngắt phần cứng ngoại vi và ngắt mềm từ chương trình)",
        "パイプライン": "Đường ống lệnh Pipelining (Thực thi gối đầu các giai đoạn Fetch, Decode, Execute)",
        "排他制御": "Kiểm soát độc quyền Mutex/Lock (Ngăn chặn tranh chấp tài nguyên chia sẻ Race Condition)",
        "デッドロック": "Khoá chết Deadlock (Hai hay nhiều tiến trình chờ tài nguyên lẫn nhau vô tận)",
        "スループット": "Thông lượng Throughput (Khối lượng công việc xử lý được trên một đơn vị thời gian)",
        "稼働率": "Độ khả dụng / Tỷ lệ hoạt động (Công thức: MTBF / (MTBF + MTTR))",
        "平均故障間隔": "MTBF (Thời gian trung bình giữa 2 lần xảy ra sự cố hỏng hóc)",
        "平均修復時間": "MTTR (Thời gian trung bình để sửa chữa khắc phục sự cố xong)",
        "デュアルシステム": "Hệ thống kép Dual System (2 máy chạy song song đối chiếu kết quả)",
        "デュプレックスシステム": "Hệ thống dự phòng Duplex System (1 máy chính Active, 1 máy Standby chờ sẵn)",
        "RAID": "Dàn đĩa RAID (RAID 0 phân dải, RAID 1 sao lưu gương, RAID 5 phân tán chẵn lẻ)",
        "関係データベース": "Cơ sở dữ liệu quan hệ RDBMS (Dữ liệu tổ chức thành các bảng gồm hàng và cột)",
        "主キー": "Khóa chính Primary Key (Định danh duy nhất một bản ghi trong bảng, không null)",
        "外部キー": "Khóa ngoại Foreign Key (Khóa tham chiếu đến khóa chính của bảng khác đảm bảo toàn vẹn)",
        "正規化": "Chuẩn hóa dữ liệu Normalization (Giảm thiểu dư thừa, tránh dị thường bất thường 1NF, 2NF, 3NF)",
        "トランザクション": "Giao dịch Transaction (Bảo đảm 4 tính chất ACID: Nguyên tử, Nhất quán, Cô lập, Bền vững)",
        "コミット": "Commit (Xác nhận lưu vĩnh viễn các thay đổi của giao dịch vào CSDL)",
        "ロールバック": "Rollback (Hủy bỏ giao dịch và khôi phục trạng thái CSDL về trước khi xảy ra lỗi)",
        "サブネットマスク": "Subnet Mask (Tách địa chỉ IP thành phần mạng Network ID và phần máy Host ID)",
        "デフォルトゲートウェイ": "Cổng mặc định Default Gateway (Router chuyển tiếp gói tin ra ngoài mạng nội bộ)",
        "DNS": "Hệ thống phân giải tên miền DNS (Chuyển đổi Domain name sang IP address)",
        "DHCP": "Giao thức cấp phát IP động DHCP (Tự động gán IP và cấu hình mạng cho thiết bị)",
        "情報セキュリティ": "An toàn thông tin (Đảm bảo 3 yếu tố CIA: Confidentiality, Integrity, Availability)",
        "共通鍵暗号": "Mã hóa khóa đối xứng (Dùng chung 1 khóa để mã hóa và giải mã, thuật toán AES/DES)",
        "公開鍵暗号": "Mã hóa khóa công khai bất đối xứng (Khóa công khai mã hóa, khóa bí mật giải mã, RSA/ECC)",
        "公開鍵": "Khóa công khai (Public Key - Được công bố rộng rãi để người khác mã hóa gửi cho mình)",
        "秘密鍵": "Khóa bí mật (Private Key - Lưu trữ tuyệt mật để giải mã hoặc tạo chữ ký điện tử)",
        "ハッシュ関数": "Hàm băm một chiều Hash (Tạo chuỗi băm cố định kiểm tra tính toàn vẹn, SHA-256)",
        "デジタル署名": "Chữ ký điện tử (Dùng khóa bí mật của người gửi để ký, chứng minh nguồn gốc và chống chối bỏ)",
        "認証局": "Cơ quan chứng thực CA (Tổ chức cấp phát chứng chỉ số và bảo đảm tính xác thực của khóa công khai)",
        "多要素認証": "Xác thực đa yếu tố MFA (Kết hợp ít nhất 2 trong 3 yếu tố: Tri thức, Sở hữu, Sinh trắc)",
        "ファイアウォール": "Tường lửa Firewall (Kiểm soát lưu lượng mạng dựa trên quy tắc lọc gói tin)",
        "SQLインジェクション": "Tấn công SQL Injection (Chèn câu lệnh SQL độc hại qua ô nhập liệu của người dùng)",
        "クロスサイトスクリプティング": "Tấn công XSS (Chèn mã kịch bản độc hại JavaScript thực thi trên trình duyệt nạn nhân)",
        "WBS": "Cơ cấu phân rã công việc WBS (Chia nhỏ dự án thành các gói công việc cụ thể)",
        "クリティカルパス": "Đường găng Critical Path (Chuỗi công việc dài nhất quyết định tổng thời gian hoàn thành dự án)",
        "SLA": "Thỏa thuận mức dịch vụ SLA (Cam kết giữa nhà cung cấp dịch vụ và khách hàng về uptime/chất lượng)",
        "SWOT分析": "Phân tích SWOT (Đánh giá Điểm mạnh S, Điểm yếu W, Cơ hội O, Thách thức T)",
        "個人情報保護法": "Luật bảo vệ thông tin cá nhân Nhật Bản (Quy định lưu trữ, sử dụng và bảo mật dữ liệu người dùng)"
    }

    for idx, item in enumerate(FE_TERMS_CATALOG, 1):
        term = item["term"]
        cur.execute("SELECT reading, glosses FROM mazii WHERE expression = ? LIMIT 1", (term,))
        row = cur.fetchone()

        reading = ""
        vi_means = []

        if row:
            reading = row[0]
            try:
                raw_glosses = json.loads(row[1]) if row[1] else []
                vi_means = [g for g in raw_glosses if g]
            except Exception:
                vi_means = []

        if not vi_means:
            cur.execute("SELECT glosses FROM javi WHERE expression = ? LIMIT 1", (term,))
            javi_row = cur.fetchone()
            if javi_row and javi_row[0]:
                try:
                    vi_means = json.loads(javi_row[0])
                except Exception:
                    vi_means = [javi_row[0]]

        if term in IT_GLOSSARY_ACCURATE:
            vi_text = IT_GLOSSARY_ACCURATE[term]
        elif vi_means:
            found_count += 1
            vi_text = "; ".join(vi_means[:2])
        else:
            vi_text = item["en"]

        vocab_entry = {
            "id": f"FE-{idx:03d}",
            "expression": term,
            "reading": reading if reading else term,
            "en": item["en"],
            "vi": vi_text,
            "category": item["category"],
            "importance": item["importance"],
            "mastered": False,
            "reviewCount": 0,
            "notes": ""
        }
        vocab_list.append(vocab_entry)

    conn.close()

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(vocab_list, f, ensure_ascii=False, indent=2)

    print(f"Extracted {len(vocab_list)} FE terms (Found in Mazii DB: {found_count}) -> {OUT_JSON}")

if __name__ == "__main__":
    main()
