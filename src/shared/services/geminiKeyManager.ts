// Gemini 6-Key Manager with Sequential Rollover Failover & 3-Book Vision OCR Prompts
import { ApiKeyConnection } from '../types';

export const PROMPT_FUKUSHIMA = `
Bạn là chuyên gia phân tích tài liệu đề thi Kỹ sư CNTT Nhật Bản (FE - 基本情報技術者), chuyên sâu về sách của Fukushima-sensei: "福嶋先生の集中ゼミ 科目B・アルゴリズム編".
Hãy thực hiện OCR và phân tích hình ảnh trang sách theo cấu trúc Markdown chuẩn xác sau:
1. 【対話・解説】: Ghi lại các đoạn đối thoại giữa Thầy Fukushima (福嶋先生) và học sinh (ナナ/タクミ), diễn giải ý tưởng trực quan.
2. 【擬似言語コード】: Trích xuất toàn bộ khối mã giả IPA chuẩn xác từng ký tự (chú ý chỉ số mảng bắt đầu từ 1, mũi tên gán ←, so sánh =).
3. 【トレース表】: Chuyển đổi bảng chạy biến (トレース表) thành định dạng bảng Markdown với đầy đủ các cột biến số (i, j, value, flag...).
4. 【例題・演習問題】: Tách riêng phần câu hỏi mẫu, các lựa chọn trắc nghiệm và lời giải thích.
5. 【重要ポイント】: Tóm tắt 1-2 điểm mấu chốt cần nhớ để không bị lừa trong đề thi IPA.
`;

export const PROMPT_KAYANOKI = `
Bạn là chuyên gia phân tích tài liệu đề thi Kỹ sư CNTT Nhật Bản (FE - 基本情報技術者), chuyên sâu về sách của Kayanoki-sensei: "かやのき先生の基本情報技術者教室".
Hãy thực hiện OCR và phân tích hình ảnh trang sách theo cấu trúc Markdown chuẩn xác sau:
1. 【シラバス項目・タイトル】: Tiêu đề chương/mục và mã phân loại Syllabus 9.1 (ví dụ: テクノロジ系 基礎理論 / セキュリティ...).
2. 【クレバー方式の要点】: Trích xuất công thức ghi nhớ ngắn gọn (Clever Method Point) của Thầy Kayanoki.
3. 【図解・理論解説】: Nội dung giải thích lý thuyết chi tiết, trình bày mạch lạc, gạch đầu dòng rõ ràng.
4. 【過去問にチャレンジ】: Câu hỏi trắc nghiệm kèm theo và đáp án giải thích.
5. 【重要IT用語 (Mazii連携)】: Liệt kê các từ khóa chuyên ngành mới xuất hiện trong trang (kèm Kanji, Kana, nghĩa tiếng Việt).
`;

export const PROMPT_PAST_EXAM = `
Bạn là chuyên gia phân tích đề thi Kỹ sư CNTT Nhật Bản (FE - 基本情報技術者), chuyên sâu về sách: "パーフェクトラーニング過去問題集".
Hãy thực hiện OCR và phân tích đề thi theo cấu trúc Markdown chuẩn xác sau:
1. 【問題番号】: Số thứ tự câu hỏi (ví dụ: 問1, 問28...).
2. 【問題文】: Đề bài tiếng Nhật nguyên bản đầy đủ.
3. 【選択肢】: 4 đáp án lựa chọn [ア], [イ], [ウ], [エ].
4. 【正解】: Đáp án đúng chính thức.
5. 【解説】: Phân tích cặn kẽ tại sao đáp án đúng là đúng, và tại sao từng đáp án sai lại sai.
6. 【出題頻度・難易度】: Đánh giá mức độ quan trọng và độ khó trong kỳ thi CBT.
`;

export function getNextActiveKeyIndex(
  keys: ApiKeyConnection[],
  currentIndex: number
): number {
  if (keys.length === 0) return -1;

  // Search forward sequentially from currentIndex
  for (let i = 0; i < keys.length; i++) {
    const checkIdx = (currentIndex + i) % keys.length;
    if (keys[checkIdx].status === 'active') {
      return checkIdx;
    }
  }

  // All keys exhausted
  return -1;
}

export function markKeyExhausted(
  keys: ApiKeyConnection[],
  keyIndex: number
): { updatedKeys: ApiKeyConnection[]; nextIndex: number } {
  const updated = keys.map((k, idx) => {
    if (idx === keyIndex) {
      return { ...k, status: 'exhausted_429' as const };
    }
    return k;
  });

  const nextIndex = getNextActiveKeyIndex(updated, (keyIndex + 1) % updated.length);
  return { updatedKeys: updated, nextIndex };
}

// Convert base64 or blob to Gemini Generative Language Vision request
export async function callGeminiVisionOcr(
  imageBase64: string,
  mimeType: string,
  bookFormat: 'fukushima' | 'kayanoki' | 'pastexam',
  apiKey: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> {
  let prompt = PROMPT_FUKUSHIMA;
  if (bookFormat === 'kayanoki') prompt = PROMPT_KAYANOKI;
  if (bookFormat === 'pastexam') prompt = PROMPT_PAST_EXAM;

  // Strip prefix data:image/...;base64, if present
  const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 3072,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) {
      throw new Error(`429_RATE_LIMIT_EXHAUSTED: ${errText}`);
    }
    throw new Error(`GEMINI_API_ERROR (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API không trả về nội dung nhận diện.');
  }

  return text;
}
