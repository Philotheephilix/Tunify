from gradio_client import Client

client = Client("https://r3gm-rvc-hfv2.hf.space/")
result = client.predict(
	"https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav",
	fn_index=5
)
print(result)