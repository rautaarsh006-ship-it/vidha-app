import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { askVidha } from "../services/claudeApi";
import { startListening, stopListening, speak } from "../services/voice";
import { parseAndRunCommand } from "../services/actions";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey, I'm V.I.D.H.A. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const listRef = useRef(null);

  const send = useCallback(
    async (rawText) => {
      const text = (rawText ?? input).trim();
      if (!text) return;

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setInput("");

      // 1. Try to run it as a real device command first (call, text, etc.)
      const commandResult = parseAndRunCommand(text);
      if (commandResult) {
        setMessages((prev) => [...prev, { role: "assistant", content: commandResult }]);
        speak(commandResult);
        return;
      }

      // 2. Otherwise send it to Claude for a conversational reply
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await askVidha(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    },
    [input, messages]
  );

  const toggleMic = () => {
    if (listening) {
      stopListening();
      setListening(false);
    } else {
      setListening(true);
      startListening(
        (text) => {
          setListening(false);
          send(text);
        },
        () => setListening(false)
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.header}>V.I.D.H.A</Text>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={styles.bubbleText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.micButton, listening && styles.micButtonActive]}
          onPress={toggleMic}
        >
          <Text style={{ fontSize: 20 }}>{listening ? "●" : "🎤"}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a command..."
          placeholderTextColor="#888"
          onSubmitEditing={() => send()}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => send()}>
          <Text style={{ color: "white", fontWeight: "600" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b12" },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 10,
    letterSpacing: 2,
  },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 16, marginVertical: 6 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#6c5ce7" },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#1c1c28" },
  bubbleText: { color: "#fff", fontSize: 15 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  input: {
    flex: 1,
    backgroundColor: "#1c1c28",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1c1c28",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: { backgroundColor: "#e74c3c" },
  sendButton: {
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
