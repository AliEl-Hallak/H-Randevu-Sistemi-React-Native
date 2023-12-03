import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';

const UpdateAppointmentScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const appointmentId = route.params.appointmentId;

  useEffect(() => {
    const loadAppointmentData = async () => {
      const docRef = doc(FIRESTORE_DB, 'appointments', appointmentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setDate(docSnap.data().date);
      } else {
        Alert.alert("Randevu bulunamadı");
      }
    };

    loadAppointmentData();
  }, [appointmentId]);

  const handleUpdate = async () => {
    const appointmentRef = doc(FIRESTORE_DB, 'appointments', appointmentId);

    try {
      await updateDoc(appointmentRef, {
        title: title,
        date: date,
      });
      Alert.alert("Başarılı", "Randevu güncellendi");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Hata", "Randevu güncellenemedi: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Randevu Başlığı"
      />
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Randevu Tarihi"
      />
      <Button
        title="Randevuyu Güncelle"
        onPress={handleUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default UpdateAppointmentScreen;
