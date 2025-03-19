import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = 'AIzaSyDhVm9Q1FpVLGr2CABPkboikb8L1zgA_dM';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function runchat(prompt) {
    try {
        const chatSession = model.startChat({ generationConfig });
        const result = await chatSession.sendMessage(prompt);

        if (!result || !result.response || !result.response.text) {
            throw new Error("Invalid API response");
        }

        return result.response.text();
    } catch (error) {
        console.error("Error in runchat:", error);
        return "";
    }
}