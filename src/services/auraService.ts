type VictorResponse = {
  reply: string;
  speech: string;
};

export async function sendToVictor(
  message: string
): Promise<VictorResponse> {
  const response = await fetch(
    "http://10.17.102.135:3001/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Victor request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return {
    reply: data.reply,
    speech: data.speech,
  };
}