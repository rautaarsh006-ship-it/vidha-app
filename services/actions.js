import { Linking, Alert } from "react-native";

// These are the commands Android's permission model actually allows a
// third-party app to perform. Reading/replying inside WhatsApp or Instagram
// is NOT on this list — see README.md for why.

export function makeCall(phoneNumber) {
  if (!phoneNumber) {
    Alert.alert("V.I.D.H.A", "I need a phone number or contact name to call.");
    return;
  }
  Linking.openURL(`tel:${phoneNumber}`);
}

export function sendSms(phoneNumber, message) {
  if (!phoneNumber) {
    Alert.alert("V.I.D.H.A", "Who should I text?");
    return;
  }
  const body = encodeURIComponent(message || "");
  Linking.openURL(`sms:${phoneNumber}?body=${body}`);
}

export function openApp(packageOrScheme) {
  // Example: openApp("whatsapp://send?text=hi")
  Linking.openURL(packageOrScheme).catch(() =>
    Alert.alert("V.I.D.H.A", "That app doesn't seem to be installed.")
  );
}

// Very simple command router — expand this as you add more intents.
export function parseAndRunCommand(text) {
  const lower = text.toLowerCase();

  const callMatch = lower.match(/call (.+)/);
  if (callMatch) {
    makeCall(callMatch[1].trim());
    return `Calling ${callMatch[1].trim()}...`;
  }

  const textMatch = lower.match(/text (.+?) saying (.+)/);
  if (textMatch) {
    sendSms(textMatch[1].trim(), textMatch[2].trim());
    return `Texting ${textMatch[1].trim()}...`;
  }

  return null; // not a device command — let it fall through to the chat AI
}
