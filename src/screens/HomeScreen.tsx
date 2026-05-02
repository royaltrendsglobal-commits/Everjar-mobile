import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Note } from '../types';
import { loadNotes } from '../storage';

type RootStackParamList = {
  Home: undefined;
  AddNote: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const daysCollected = notes.length;
  const progress = Math.min(daysCollected / 365 * 100, 100);

  const renderNote = ({ item }: { item: Note }) => {
    const today = new Date().toISOString().split('T')[0];
    const canView = !item.isLocked || (item.unlockDate && item.unlockDate <= today);
    return (
      <View style={styles.noteItem}>
        <Text style={styles.noteDate}>{new Date(item.date).toDateString()}</Text>
        {item.isLocked && <Text style={styles.lockedText}>🔒 Locked until {item.unlockDate}</Text>}
        {canView ? (
          <Text style={styles.noteText}>{item.text}</Text>
        ) : (
          <Text style={styles.noteText}>This note is locked. Come back later!</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EverJar</Text>
      <Text style={styles.subtitle}>One note a day. A lifetime of love.</Text>
      <Text style={styles.progressText}>Days collected: {daysCollected} / 365 ({progress.toFixed(1)}%)</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNote')}>
        <Text style={styles.addButtonText}>Add Today's Note</Text>
      </TouchableOpacity>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        style={styles.notesList}
      />
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  noteDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  lockedText: {
    fontSize: 12,
    color: '#ff9800',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;