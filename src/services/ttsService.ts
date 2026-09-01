import { fetch } from "expo/fetch";
import { File, Paths } from "expo-file-system";
import { createAudioPlayer } from "expo-audio";

const BACKEND_URL = "http://10.17.102.135:3001";

export async function speakVictor(text: string) {
  const start = Date.now();

  console.log("TTS request started");

  const response = await fetch(`${BACKEND_URL}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  console.log(
    "TTS response received:",
    Date.now() - start,
    "ms"
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Victor TTS failed: ${response.status} ${errorText}`
    );
  }

  const audioData = await response.arrayBuffer();

  console.log(
    "Audio downloaded:",
    Date.now() - start,
    "ms"
  );

  const file = new File(
    Paths.cache,
    `victor-${Date.now()}.wav`
  );

  file.write(new Uint8Array(audioData));

  const player = createAudioPlayer(file.uri);

  player.play();

  console.log(
    "Victor playback started:",
    Date.now() - start,
    "ms"
  );

  return player;
}