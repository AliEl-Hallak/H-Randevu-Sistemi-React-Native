import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebasseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

const ListOneAppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const userId = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

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
      }
    };

    fetchAppointments();
  }, [userId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.doctorInfo}>
  Clinic: {item.doctorId ? item.doctorId.clinic : 'Bilgi Yok'}
  {'\n'}
  Department: {item.doctorId ? item.doctorId.department : 'Bilgi Yok'}
  {'\n'}
  Name: {item.doctorId ? item.doctorId.name : 'Bilgi Yok'}
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
                <Text>Güncelle</Text>
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
                <Text>Sil</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#ffffff',      // Parlak beyaz arka plan
    borderRadius: 20,                // Daha belirgin yuvarlatılmış köşeler
    padding: 20,                     // Geniş iç boşluk
    marginVertical: 12,              // Daha fazla dikey aralık
    marginHorizontal: 15,            // Daha fazla yatay aralık
    borderWidth: 2,                  // Daha kalın çerçeve
    borderColor: '#d3d3d3',          // Açık gri çerçeve rengi
    shadowColor: '#000',             // Gölge rengi
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,             // Gölge opaklığı
    shadowRadius: 3.84,              // Gölge yarıçapı
    elevation: 5,                    // Android için gölge efekti
  },
  title: {
     
    fontSize: 22,                    // Daha büyük ve belirgin başlık fontu
    fontWeight: '700',               // Ağır font ağırlığı
    color: '#2a2a2a',                // Koyu gri başlık rengi
    marginBottom: 10,                // Başlık alt boşluk
  },
  date: {
    fontSize: 18,                    // Büyütülmüş tarih fontu
    fontWeight: '500',               // Orta kalınlıkta font ağırlığı
    color: '#4a4a4a',                // Koyu gri tarih rengi
    marginBottom: 15,                // Arttırılmış tarih alt boşluk
  },
  doctorInfo: {
    fontSize: 16,                    // Net doktor bilgisi fontu
    color: '#606060',                // Koyu gri metin rengi
    lineHeight: 24,                  // Geniş satır yüksekliği
    fontStyle: 'italic',             // İtalik font stili
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
  lottieContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 350,
  },
});

export default ListOneAppointmentsScreen;
