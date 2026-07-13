export type VoiceCallState = "connecting" | "listening" | "speaking";

type VoiceCallHandlers = {
  onStateChange: (state: VoiceCallState) => void;
  onError: (message: string) => void;
};

export type VoiceCallSession = {
  disconnect: () => void;
  /** Cuts off a response that's actively speaking — used for the soft "stop starting long replies"
   * cutoff 10s before the cap, ahead of the hard hangup that tears down the connection regardless. */
  cancelResponse: () => void;
  remoteStream: MediaStream;
  localStream: MediaStream;
};

type FunctionCallOutputItem = {
  type: "function_call";
  name: string;
  call_id: string;
  arguments: string;
};

/**
 * Connects the browser to an OpenAI Realtime session over WebRTC and wires the one function tool
 * (`save_question_for_serhii`) back to our own `/api/voice/unanswered`. Protocol details (event
 * names, the raw-SDP `/v1/realtime/calls` exchange, the `response.done` → `output[].type ===
 * "function_call"` shape) are taken from OpenAI's current Realtime docs, not guessed — but this is
 * still a fast-moving API, so if a field ever comes back `undefined` here, that's the first place
 * to check against OpenAI's own reference before assuming a bug in this file.
 */
export async function startVoiceCall(
  clientSecret: string,
  locale: string,
  visitorEmail: string,
  handlers: VoiceCallHandlers
): Promise<VoiceCallSession> {
  const pc = new RTCPeerConnection();
  const remoteStream = new MediaStream();

  pc.ontrack = (event) => {
    event.streams[0]?.getTracks().forEach((track) => remoteStream.addTrack(track));
  };

  const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  const dataChannel = pc.createDataChannel("oai-events");

  function send(event: Record<string, unknown>) {
    if (dataChannel.readyState === "open") dataChannel.send(JSON.stringify(event));
  }

  dataChannel.addEventListener("open", () => {
    handlers.onStateChange("listening");
    // The agent greets first, per its own instructions — nudge it to start speaking.
    send({ type: "response.create" });
  });

  dataChannel.addEventListener("message", (event) => {
    let serverEvent: Record<string, unknown>;
    try {
      serverEvent = JSON.parse(event.data);
    } catch {
      return;
    }

    if (serverEvent.type === "response.created") {
      handlers.onStateChange("speaking");
    }

    if (serverEvent.type === "response.done") {
      handlers.onStateChange("listening");
      const response = serverEvent.response as { output?: unknown[] } | undefined;
      const output = (response?.output ?? []) as FunctionCallOutputItem[];
      for (const item of output) {
        if (item.type === "function_call" && item.name === "save_question_for_serhii") {
          void handleSaveQuestion(send, item, locale, visitorEmail);
        }
      }
    }

    if (serverEvent.type === "error") {
      const error = serverEvent.error as { message?: string } | undefined;
      handlers.onError(error?.message || "Realtime error");
    }
  });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  let sdpResponse: Response;
  try {
    sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        "Content-Type": "application/sdp",
      },
    });
  } catch (err) {
    localStream.getTracks().forEach((track) => track.stop());
    pc.close();
    throw err;
  }

  if (!sdpResponse.ok) {
    localStream.getTracks().forEach((track) => track.stop());
    pc.close();
    throw new Error("Failed to establish voice call");
  }

  const answerSdp = await sdpResponse.text();
  await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

  function disconnect() {
    dataChannel.close();
    pc.getSenders().forEach((sender) => sender.track?.stop());
    localStream.getTracks().forEach((track) => track.stop());
    pc.close();
  }

  function cancelResponse() {
    send({ type: "response.cancel" });
  }

  return { disconnect, cancelResponse, remoteStream, localStream };
}

async function handleSaveQuestion(
  send: (event: Record<string, unknown>) => void,
  item: FunctionCallOutputItem,
  fallbackLanguage: string,
  visitorEmail: string
) {
  let output = "Saved — tell the visitor you've passed it to Serhii.";
  try {
    const args = JSON.parse(item.arguments) as {
      question: string;
      conversationSummary?: string;
      language?: string;
    };
    await fetch("/api/voice/unanswered", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: args.question,
        conversationSummary: args.conversationSummary,
        language: args.language || fallbackLanguage,
        visitorEmail,
      }),
    });
  } catch {
    output = "Could not save it right now — tell the visitor you'll remember it anyway.";
  }

  send({
    type: "conversation.item.create",
    item: { type: "function_call_output", call_id: item.call_id, output },
  });
  send({ type: "response.create" });
}
