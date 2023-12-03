import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CreateAppointmentScreen = () => {
const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  const handleCreateAppointment = async () => {
    try {
        const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user.email;
    const userId = user.uid;
        
    await addDoc(collection(FIRESTORE_DB, 'appointments'), {
        title: appointmentTitle,
        date: appointmentDate,
        userId: userId, // Kullanıcının UID'sini ekleme
        userEmail: userEmail, // Kullanıcının e-posta adresini ekleme
      });
          
      Alert.alert('Başarılı', 'Randevu oluşturuldu');
    } catch (error) {
      Alert.alert('Hata', 'Randevu oluşturulamadı');
    }
  };


  return (
    <View style={styles.container}>
   <TextInput
  style={styles.input}
  value={appointmentTitle}
  onChangeText={setAppointmentTitle}
  placeholder="Randevu Başlığı"
/>
      <TextInput
        style={styles.input}
        value={appointmentDate}
        onChangeText={setAppointmentDate}
        placeholder="Randevu Tarihi"
      />
      <Button title="Randevu Oluştur" onPress={handleCreateAppointment} />
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    input: {
      width: '100%',
      marginVertical: 10,
      borderWidth: 1,
      padding: 10,
      borderRadius: 4,
    },
  });
export default CreateAppointmentScreen;