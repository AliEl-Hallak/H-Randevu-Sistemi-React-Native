import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebasseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

export default ListOneAppointmentsScreen;
