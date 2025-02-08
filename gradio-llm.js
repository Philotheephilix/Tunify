import { client } from "@gradio/client";

const app = await client("deepseek-ai/deepseek-vl2-small");
const result = await app.predict("/predict", [		
				[["Hello!",null]], // undefined  in 'parameter_11' Chatbot component		
				0.9, // number (numeric value between 0 and 1.0) in 'Top-p' Slider component		
				0.1, // number (numeric value between 0 and 1.0) in 'Temperature' Slider component		
				0, // number (numeric value between 0.0 and 2.0) in 'Repetition penalty' Slider component		
				100, // number (numeric value between 0 and 4096) in 'Max Generation Tokens' Slider component		
				0, // number (numeric value between 0 and 8192) in 'Max History Tokens' Slider component		
				"deepseek-ai/deepseek-vl2-small", // string  in 'Select Models' Dropdown component
	]);

console.log(result.data);
