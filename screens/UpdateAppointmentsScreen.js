import React, { useState, useEffect } from 'react';
import { View,Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
import {DotIndicator} from 'react-native-indicators';

const UpdateAppointmentScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const appointmentId = route.params.appointmentId;
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true); // Bekleme durumunu başlat

      await updateDoc(appointmentRef, {
        title: title,
        date: date,
      });
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

      Alert.alert("Başarılı", "Randevu güncellendi", [
        { text: 'Tamam', onPress: () => navigation.navigate('Appointment') }
      ]);
      
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Randevunuz Güncellendi ✅",
          body: 'Randevu detaylarınız başarıyla güncellendi. Yeni randevu bilgilerinizi kontrol ediniz.',
        },
        trigger: { seconds: 1 }, // 1 saniye sonra gönder
      });

    } catch (error) {
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

      Alert.alert("Hata", "Randevu güncellenemedi: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
                  {isLoading && (
        <View style={styles.loadingContainer}>
<DotIndicator  color='#2196f3' />
        </View>
      )}
      <Text style={styles.header}>Randevu Güncelleme</Text>
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
        placeholder="Randevu Tarihi (gg/aa/yyyy)"
      />


<View  style={styles.button}>
<Button
       
       title="Randevuyu Güncelle"
       onPress={handleUpdate}
       color="#4a90e2"
     />
</View>
     
         <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/update.json')} // Make sure this path is correct
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
    padding: 20,
    backgroundColor: '#fff', // Arka plan rengi
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    width :"100%",
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  lottieContainer: {
    flexGrow: 1, // This will push the container to the bottom
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 400,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9', // Giriş alanı arka plan rengi
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
});

export default UpdateAppointmentScreen;
