import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import LottieView from 'lottie-react-native';


const DoctorAdd = ({ navigation }) => {
  const [department, setDepartment] = useState('');
  const [clinic, setClinic] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [error, setError] = useState({ department: '', clinic: '', doctorName: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setError({ department: '', clinic: '', doctorName: '' }); // Önceki hataları temizleyin

    if (!department.trim()) {
      setError(prevState => ({ ...prevState, department: 'Anabilim Dalını doldurunuz.' }));
      isValid = false;
    } else {
      setError(prevState => ({ ...prevState, department: '' }));
    }

    if (!clinic.trim()) {
      setError(prevState => ({ ...prevState, clinic: 'Polikliniği doldurunuz.' }));
      isValid = false;
    } else {
      setError(prevState => ({ ...prevState, clinic: '' }));
    }

    if (!doctorName.trim()) {
      setError(prevState => ({ ...prevState, doctorName: 'Doktor Adını doldurunuz.' }));
      isValid = false;
    } else {
      setError(prevState => ({ ...prevState, doctorName: '' }));
    }

    return isValid;
  };

  const handleAddDoctor = async () => {
    if (!validateForm()) {
      return;
    }

    try {
            setIsLoading(true); // Bekleme durumunu başlat

      await addDoc(collection(FIRESTORE_DB, 'doctors'), {
        department,
        clinic,
        name: doctorName,
      });
   
      setIsLoading(false); // Bekleme durumunu sonlandır

      Alert.alert("Başarılı", "Doktor bilgileri eklendi", [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      setIsLoading(false); // Bekleme durumunu sonlandır
      setError('Doktor bilgileri eklenemedi');
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doktor Ekle</Text>

      {/* Anabilim Dalı */}
      <TextInput
        style={error.department ? styles.inputError : styles.input}
        value={department}
        onChangeText={(text) => {
          setDepartment(text);
          validateForm(); // Her değişiklikte doğrulamayı tetikleyin
        }}
        placeholder="Anabilim Dalı"
      />
      {error.department ? <Text style={styles.errorText}>{error.department}</Text> : null}

      {/* Poliklinik */}
      <TextInput
        style={error.clinic ? styles.inputError : styles.input}
        value={clinic}
        onChangeText={(text) => {
          setClinic(text);
          validateForm(); // Her değişiklikte doğrulamayı tetikleyin
        }}
        placeholder="Poliklinik"
      />
      {error.clinic ? <Text style={styles.errorText}>{error.clinic}</Text> : null}

      {/* Doktor Adı */}
      <TextInput
        style={error.doctorName ? styles.inputError : styles.input}
        value={doctorName}
        onChangeText={(text) => {
          setDoctorName(text);
          validateForm(); // Her değişiklikte doğrulamayı tetikleyin
        }}
        placeholder="Doktor Adı"
      />
      {error.doctorName ? <Text style={styles.errorText}>{error.doctorName}</Text> : null}

      {/* Ekleme Butonu */}
      <TouchableOpacity style={styles.saveButton} onPress={handleAddDoctor}>
        <Text style={styles.saveButtonText}>Ekle</Text>
      </TouchableOpacity>

      {/* Bekleme göstergesi */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      )}
      {/* Lottie Animasyon */}
      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../resim/r10.json')} // Animasyon dosya yolu doğru olmalı
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  inputError: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',    
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    // Diğer stil tanımlamaları
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
