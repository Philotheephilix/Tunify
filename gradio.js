import { Client } from "@gradio/client";

const client = await Client.connect("r3gm/RVC_HF");
const result = await client.predict("/run_infer_script", { 		
		f0up_key:0 , 		
		filter_radius: 5, 		
		index_rate: 0, 		
		rms_mix_rate: 0, 		
		protect: 0, 		
		hop_length: 1, 		
		f0method: "rmvpe", 		
		input_path: "https://raw.githubusercontent.com/Philotheephilix/Tunify/main/public/amidreaming.wav", 		
		output_path: "/home/user/app/assets/audios/output.wav", 		
		pth_path: "logs/Justin_Bieber_v2/Justin_Bieber_v2.pth", 		
		index_path: "logs/Justin_Bieber_v2/added_IVF1005_Flat_nprobe_1_Justin_Bieber_v2_v2.index", 		
		clean_strength: 0, 		
		export_format: "WAV", 		
		embedder_model: "hubert", 		
		embedder_model_custom: "", 		
		upscale_audio: true, 
});

console.log(result.data);
