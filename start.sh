#!/usr/bin/env bash
# FE Study Hub - 1-Click Launch Script for macOS
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "========================================================="
echo "   FE STUDY HUB | 基本情報技術者試験 学習プラットフォーム"
echo "========================================================="

# 1. Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "==> Cài đặt thư viện npm..."
    npm install
fi

# 2. Ensure .env.local exists with keys
if [ ! -f ".env.local" ]; then
    echo "==> Trích xuất 6 API keys từ Omniroute vào .env.local..."
    python3 scripts/setup_env_keys.py
fi

# 3. Check for leaked secrets
bash scripts/check-secrets.sh

# 4. Open browser
echo "==> Đang mở trình duyệt tại http://localhost:5173 ..."
sleep 1 && open "http://localhost:5173" &

# 5. Start Vite Dev Server
echo "==> Khởi chạy Vite Dev Server..."
npm run dev
