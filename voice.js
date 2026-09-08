import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";

export function startListening(onResult, onError) {
  Voice.onSpeechResults = (e) => {
    const text = e.value?.[0];
    if (text) onResult(text);
  };
  Voice.onSpeechError = (e) => onError?.(e);
  Voice.start("en-US");
}

export function stopListening() {
  Voice.stop();
}

export function speak(text) {
  Speech.speak(text, { language: "en-US", pitch: 1.05, rate: 0.98 });
}

export function destroyVoice() {
  Voice.destroy().then(Voice.removeAllListeners);
}
