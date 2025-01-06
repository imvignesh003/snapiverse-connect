import { pipeline } from "@huggingface/transformers";

let classifier: any = null;

export const initializeClassifier = async () => {
  if (!classifier) {
    classifier = await pipeline(
      "text-classification",
      "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
      { device: "webgpu" }
    );
  }
  return classifier;
};

export const classifyContent = async (text: string): Promise<"productivity" | "entertainment"> => {
  const classifier = await initializeClassifier();
  const result = await classifier(text);
  
  // Map the sentiment to our zones (positive -> productivity, negative -> entertainment)
  // This is a simple example; in a real app, you'd want a model specifically trained for this task
  return result[0].label === "POSITIVE" ? "productivity" : "entertainment";
};