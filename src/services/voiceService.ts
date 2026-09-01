import { File } from "expo-file-system";
import { fetch } from "expo/fetch";

export async function transcribeVoice(
  audioUri: string
): Promise<string> {
  const file = new File(audioUri);

  const formData = new FormData();

  formData.append("audio", file);

  const response = await fetch(
    "http://10.17.102.135:3001/voice/transcribe",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Transcription failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return data.text;
}