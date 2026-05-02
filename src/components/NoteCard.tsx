import React from "react";
import { View, Text } from "react-native";

export default function NoteCard({ note }) {
  const today = new Date().toISOString().split('T')[0];
  const canView = !note.isLocked || (note.unlockDate && note.unlockDate <= today);

  return (
    <View style={{ padding: 10, marginVertical: 5, backgroundColor: "#f5c5b0", borderRadius: 10 }}>
      <Text style={{ fontSize: 14, color: '#999', marginBottom: 5 }}>{new Date(note.date).toDateString()}</Text>
      {note.isLocked && <Text style={{ fontSize: 12, color: '#ff9800', fontStyle: 'italic', marginBottom: 5 }}>🔒 Locked until {note.unlockDate}</Text>}
      {canView ? (
        <Text>{note.text}</Text>
      ) : (
        <Text>This note is locked. Come back later!</Text>
      )}
    </View>
  );
}