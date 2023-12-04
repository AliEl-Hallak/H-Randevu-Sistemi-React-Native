import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';

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
        userId: userId,
        userEmail: userEmail,
      });

      Alert.alert('Başarılı', 'Randevu oluşturuldu');
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Randevunuz Oluşturuldu 📅",
          body: 'Yeni randevunuz başarıyla oluşturuldu. Randevu detaylarınızı kontrol ediniz.',
        },
        trigger: { seconds: 1 }, // 1 saniye sonra gönder
      });
    } catch (error) {
      Alert.alert('Hata', 'Randevu oluşturulamadı');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yeni Randevu Oluştur</Text>
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
        placeholder="Randevu Tarihi (gg/aa/yyyy)"
      />
      <Button
        title="Randevu Oluştur"
        onPress={handleCreateAppointment}
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
    backgroundColor: '#fff', // Arka plan rengi
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
    borderColor: '#ddd', // Kenarlık rengi
    backgroundColor: '#f9f9f9', // Giriş alanı arka plan rengi
  },
});

export default CreateAppointmentScreen;
