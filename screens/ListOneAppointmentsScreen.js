import React, { useState, useEffect } from 'react';
import { Alert, View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebasseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {

  DotIndicator,
 
} from 'react-native-indicators';
const ListOneAppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const userId = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;
  const [isLoading, setIsLoading] = useState(true); // Veriler yükleniyor başlangıçta true olarak ayarlandı
  const [noAppointments, setNoAppointments] = useState(false); // Randevu olmadığını belirlemek için bir state

  useEffect(() => {
    const fetchAppointments = async () => {
      if (userId) {
        // Kullanıcıya ait randevuları Firestore'dan çekme
        const q = query(collection(FIRESTORE_DB, 'appointments'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(fetchedAppointments);
        setIsLoading(false); // Veriler yüklendiğinde beklemeyi kaldır
        setNoAppointments(fetchedAppointments.length === 0); // Randevu sayısına göre noAppointments'i güncelle
      }
    };

    fetchAppointments();
  }, [userId]);

  return (
    <View style={styles.container}>
     
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color='#2196f3' />
        </View>
      )}
      {noAppointments && !isLoading && (
        
         <View style={styles.lottieContainer}>
         <LottieView
           source={require('../resim/Nodataavla.json')}
           autoPlay
           loop
           style={styles.lottieAnimation}
         />
          <Text style={styles.noAppointmentsText}>Herhangi bir randevunuz bulunmamaktadır.</Text>
       </View>
      )}
      {!noAppointments && (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.appointmentItem}>
           
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.doctorInfo}>
              Randevu Başlığı: {item.title ? item.title : 'Bilgi Yok'}
                {'\n'}
                Doktor Adı: {item.doctorId ? item.doctorId.name : 'Bilgi Yok'}
                {'\n'}
                Randevu gunu: {item.workingDay ? item.workingDay : 'Bilgi Yok'}
                {'\n'}
                randevu Saati: {item.workingHour ? item.workingHour : 'Bilgi Yok'}
                {'\n'}

              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('UpdateAppointments', {
                      appointmentId: item.id,
                      title: item.title,
                      date: item.date,
                    })
                  }>
      <Icon name="update" size={30} color="#4a70e2" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('DeletAppointment', {
                      appointmentId: item.id,
                      title: item.title,
                      date: item.date,
                    })
                  }>
              <Icon name="delete" size={30} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsText: { 
    color: 'gray',
    fontSize: 18,
    textAlign: 'center',
  },
  appointmentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: '#d3d3d3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2a2a2a',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4a4a4a',
    marginBottom: 15,
  },
  doctorInfo: {
    fontSize: 16,
    color: '#606060',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
 
  lottieContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 400,
  },
});

export default ListOneAppointmentsScreen;
