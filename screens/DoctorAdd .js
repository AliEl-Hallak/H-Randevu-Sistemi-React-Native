import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import LottieView from 'lottie-react-native';

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
   <TouchableOpacity style={styles.saveButton} onPress={handleAddDoctor}>
        <Text style={styles.saveButtonText}>Ekle</Text>
      </TouchableOpacity>

     
      <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/r10.json')} // Make sure this path is correct
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
        </View>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the start
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop:10,
    width :'100%',
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    marginVertical: 10, // Reduced vertical margin
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  lottieContainer: {
    flexGrow: 1, // This will push the container to the bottom
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 200,
  },
});


export default DoctorAdd;
