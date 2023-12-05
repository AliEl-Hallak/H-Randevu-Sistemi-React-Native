import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';

const DoctorAdd = () => {
  const [department, setDepartment] = useState('');
  const [clinic, setClinic] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const handleAddDoctor = async () => {
    try {
      await addDoc(collection(FIRESTORE_DB, 'doctors'), {
        department,
        clinic,
        name: doctorName,
      });

      Alert.alert('Başarılı', 'Doktor bilgileri eklendi');
    } catch (error) {
      Alert.alert('Hata', 'Doktor bilgileri eklenemedi');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doktor Ekle</Text>
      <TextInput
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        placeholder="Anabilim Dalı"
      />
      <TextInput
        style={styles.input}
        value={clinic}
        onChangeText={setClinic}
        placeholder="Poliklinik"
      />
      <TextInput
        style={styles.input}
        value={doctorName}
        onChangeText={setDoctorName}
        placeholder="Doktor Adı"
      />
      <Button
        title="Ekle"
        onPress={handleAddDoctor}
        color="#4a90e2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
});

export default DoctorAdd;
