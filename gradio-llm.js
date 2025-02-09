import { Client } from "@gradio/client";

const client = await Client.connect("yuntian-deng/ChatGPT");
const result = await client.predict("/predict", { 		
		inputs: "Hello!!", 		
		top_p: 0, 		
		temperature: 0, 		
		chat_counter: 3, 		
		chatbot: [["Hello!",null]], 
});

console.log(result.data);
