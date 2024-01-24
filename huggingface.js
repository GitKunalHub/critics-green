import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const HF_ACCESS_TOKEN = process.env.HUGGINGFACE_API_KEY;

const inference = new HfInference(HF_ACCESS_TOKEN);
