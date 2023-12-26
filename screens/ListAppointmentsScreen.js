import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,ActivityIndicator } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { collection, getDocs } from 'firebase/firestore';
import {BarIndicator} from 'react-native-indicators';
import {DotIndicator} from 'react-native-indicators';

const ListAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Veriler yükleniyor başlangıçta true olarak ayarlandı

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'appointments'));
      const fetchedAppointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(fetchedAppointments);
      setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır

    };

    fetchAppointments();
  }, []);

  return (
    
    <View style={styles.container}>
       {isLoading && (
        <View style={styles.loadingContainer}>
<DotIndicator  color='#2196f3' />
        </View>
      )}
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text>{item.date}</Text>
            <Text style={styles.doctorInfo}>
            
            Randevu Başlığı: {item.title ? item.title : 'Bilgi Yok'}
                {'\n'}
                Hasta E-posta: {item.userEmail ? item.userEmail : 'Bilgi Yok'}
                {'\n'}
              
                Doktor Adı: {item.doctorId ? item.doctorId.name : 'Bilgi Yok'}
                {'\n'}
                Randevu gunu: {item.workingDay ? item.workingDay : 'Bilgi Yok'}
                {'\n'}
                randevu Saati: {item.workingHour ? item.workingHour : 'Bilgi Yok'}
                {'\n'}

        </Text>      
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  appointmentItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
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
  appointmentItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',  // Arka plan rengi
    borderRadius: 10,           // Kenar yuvarlatma
    marginVertical: 8,          // Dikey marj
    shadowColor: '#000',          // Gölgelendirme rengi
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,                 // Android için gölgelendirme derinliği
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,               // Font boyutu
    color: '#333',              // Metin rengi
    marginBottom: 5,            // Başlık ile tarih arasındaki mesafe
  },
  date: {
    color: '#666',              // Tarih metni rengi
    fontSize: 14,               // Tarih metni font boyutu
  },
});


export default ListAppointmentsScreen;
