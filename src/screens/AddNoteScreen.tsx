import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Note } from '../types';
import { loadNotes, saveNotes } from '../storage';

type RootStackParamList = {
  Home: undefined;
  AddNote: undefined;
};

type AddNoteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddNote'>;

type Props = {
  navigation: AddNoteScreenNavigationProp;
};

const AddNoteScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [unlockDate, setUnlockDate] = useState('');

  const handleSave = async () => {
    if (text.trim() === '') {
      Alert.alert('Error', 'Please enter a note.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const notes = await loadNotes();

    // Check if already added today
    const todayNote = notes.find(note => note.date === today);
    if (todayNote) {
      Alert.alert('Note already exists', 'You have already added a note for today.');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      text: text.trim(),
      date: today,
      isLocked,
      unlockDate: isLocked ? unlockDate : undefined,
    };

    notes.push(newNote);
    await saveNotes(notes);
    Alert.alert('Success', 'Note added!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Your Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your thought for today..."
        multiline
        value={text}
        onChangeText={setText}
      />
      <View style={styles.lockContainer}>
        <Text style={styles.lockLabel}>Lock this note for future?</Text>
        <Switch value={isLocked} onValueChange={setIsLocked} />
      </View>
      {isLocked && (
        <TextInput
          style={styles.input}
          placeholder="Unlock date (YYYY-MM-DD)"
          value={unlockDate}
          onChangeText={setUnlockDate}
        />
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  lockLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddNoteScreen;