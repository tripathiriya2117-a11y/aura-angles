import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import { transcribeVoice } from "../../services/voiceService";
import { sendToVictor } from "../../services/auraService";
import { speakVictor } from "../../services/ttsService";

export default function VoiceButton() {
  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  const recorderState = useAudioRecorderState(recorder);

  const [permissionGranted, setPermissionGranted] =
    useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  useEffect(() => {
    async function setupAudio() {
      const status =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        console.log("Microphone permission denied");
        return;
      }

      setPermissionGranted(true);

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    }

    setupAudio();
  }, []);

  const toggleRecording = async () => {
    if (!permissionGranted) {
      console.log("Microphone permission not granted");
      return;
    }

    if (isProcessing) {
      return;
    }

    if (recorderState.isRecording) {
      await recorder.stop();

      if (!recorder.uri) {
        console.error("No recording URI");
        return;
      }

      console.log("Recording stopped:", recorder.uri);

      setIsProcessing(true);

      try {
        // 1. Speech → text
        const text = await transcribeVoice(recorder.uri);

        console.log("Victor heard:", text);

        // 2. Text → Victor brain
        const result = await sendToVictor(text);

        console.log("Victor:", result.reply);
        console.log("Victor speech:", result.speech);


        // 3. Victor text → Victor voice
        await speakVictor(result.speech);


        console.log("Victor finished speaking");
      } catch (error) {
        console.error("Victor voice pipeline failed:", error);
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    await recorder.prepareToRecordAsync();
    recorder.record();

    console.log("Victor listening...");
  };

  return (
    <Pressable
      style={[
        styles.button,
        recorderState.isRecording && styles.recording,
        isProcessing && styles.processing,
      ]}
      onPress={toggleRecording}
      disabled={isProcessing}
    >
      <View style={styles.inner}>
        <Text style={styles.icon}>
          {recorderState.isRecording
            ? "■"
            : isProcessing
            ? "◌"
            : "🎙️"}
        </Text>

        <Text style={styles.label}>
          {recorderState.isRecording
            ? "LISTENING"
            : isProcessing
            ? "VICTOR IS SPEAKING"
            : "TALK TO VICTOR"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    alignSelf: "center",
    bottom: 150,
    width: 180,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1E1B4B",
    borderWidth: 1,
    borderColor: "#312E81",
    justifyContent: "center",
    alignItems: "center",
  },

  recording: {
    borderColor: "#8B5CF6",
  },

  processing: {
    borderColor: "#6366F1",
  },

  inner: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 18,
    marginRight: 8,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
});