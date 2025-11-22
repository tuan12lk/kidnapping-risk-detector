import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RiskAnalysisResult, RiskLevel } from "../types";

// Initialize the client. 
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    risk_score: {
      type: Type.NUMBER,
      description: "A float between 0 and 1 indicating the danger level.",
    },
    risk_level: {
      type: Type.STRING,
      enum: ["low", "medium", "high"],
      description: "The categorical risk level.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A concise explanation of the risk assessment in Vietnamese, citing specific behaviors or keywords identified.",
    },
  },
  required: ["risk_score", "risk_level", "reasoning"],
};

export const analyzeTextRisk = async (text: string): Promise<RiskAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: text,
      config: {
        systemInstruction: `
          Bạn là một chuyên gia về an toàn trẻ em và phát hiện nguy cơ bắt cóc.
          Nhiệm vụ của bạn là phân tích văn bản đầu vào và đánh giá mức độ rủi ro dựa trên các từ khóa và mẫu câu nguy hiểm dưới đây.

          # QUY TẮC PHÂN TÍCH (ANALYSIS LOGIC)
          
          1. **Đối chiếu từ khóa (Keyword Matching)**: Tìm các từ khóa trong danh sách bên dưới.
          2. **Phát hiện mẫu câu (Pattern Detection)**: Tìm các mẫu câu dụ dỗ, đe dọa hoặc thu thập thông tin.
          3. **Đánh giá hành vi (Behavioral Analysis)**: Xem xét ngữ cảnh (người lạ tiếp cận, cố gắng tách trẻ ra khỏi bố mẹ, v.v.).

          # 1. CÁC MỨC ĐỘ RỦI RO & DẤU HIỆU NHẬN BIẾT

          ## 🔥 MỨC ĐỘ NGUY CƠ CAO (High Risk) - Điểm số: 0.7 - 1.0
          *Nếu xuất hiện bất kỳ dấu hiệu nào dưới đây, rủi ro là CAO.*
          
          **Từ khóa bạo lực / bắt cóc:**
          - "bắt cóc", "kidnap", "abduct", "hostage", "con tin", "ransom", "chuộc tiền".
          - "threaten", "đe dọa", "ép buộc", "cưỡng chế", "forcefully", "restrain", "trói lại", "giam giữ", "giữ lại", "bắt giữ trái phép".
          
          **Hành vi theo dõi / rình rập:**
          - "follow closely", "theo dõi sát", "đi theo", "truy đuổi", "bám theo", "tailing", "rình rập", "lurking", "lén lút".
          - "quan sát lịch sinh hoạt", "nhắm vào trẻ em".
          
          **Mồi nhử nguy hiểm / Ép buộc:**
          - "lừa đi chơi", "ép lên xe", "mời lên xe", "dụ ra ngoài", "secret meeting" (gặp bí mật), "đi nơi vắng".
          - **Mẫu câu cực nguy hiểm**: "lên xe với chú/anh", "bố mẹ nhờ chú đón" (Giả danh người quen), "im lặng không tao giết", "đi theo tao", "lên xe ngay".
          
          **Phương tiện đáng ngờ:**
          - "white van", "xe tải trắng", "xe lạ", "không biển số", "đỗ lâu".

          ## ⚠️ MỨC ĐỘ NGUY CƠ TRUNG BÌNH (Medium Risk) - Điểm số: 0.4 - 0.69
          *Nếu xuất hiện nhiều dấu hiệu trung bình, có thể cân nhắc nâng lên cao.*

          **Dụ dỗ / Làm quen:**
          - "quà vặt", "kẹo bánh", "đồ chơi miễn phí", "free candy", "đưa đi chơi".
          - "thân thiện quá mức", "offer gift", "trust me".
          - **Ngôn ngữ Grooming (Thao túng tâm lý)**: "bí mật của chúng ta", "không được nói với ai", "anh thương em", "đừng nói cho bố mẹ".

          **Thu thập thông tin cá nhân:**
          - "nhà ở đâu", "đi học lúc mấy giờ", "bố mẹ làm gì", "số điện thoại".
          - "alone?", "ở một mình?", "cháu đi học một mình à".

          **Tiếp cận lạ mặt:**
          - "người lạ", "stranger", "đứng gần trường", "đứng gần nhà", "theo dõi từ xa".

          ## 🟩 MỨC ĐỘ NGUY CƠ THẤP (Low Risk) - Điểm số: 0.0 - 0.39
          *Cần cảnh giác nhưng chưa có hành động nguy hiểm cụ thể.*
          
          - "muốn gặp", "hỏi đường", "đợi ở cổng", "đứng gần".
          - "nhìn chằm chằm" (staring), "quan sát".

          # YÊU CẦU ĐẦU RA (OUTPUT INSTRUCTIONS)
          - Trả về JSON hợp lệ theo schema.
          - **QUAN TRỌNG**: Trường 'reasoning' (giải thích) PHẢI viết bằng **Tiếng Việt**.
          - Trong phần giải thích, hãy trích dẫn cụ thể các từ khóa hoặc hành vi đã bị phát hiện (ví dụ: "Phát hiện từ khóa 'bố mẹ nhờ đón' là dấu hiệu giả mạo người quen...").
        `,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, 
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No response generated from model.");
    }

    const result = JSON.parse(outputText) as RiskAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};