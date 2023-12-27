import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import { doc, updateDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
import { DotIndicator } from 'react-native-indicators';
import CustomAlert from '../CustomAlert';

const UpdateAppointmentScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [workingDay, setWorkingDay] = useState('');
  const [workingHour, setWorkingHour] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const appointmentId = route.params.appointmentId;
  
  const handleSelectWorkingDay = (day) => {
    setWorkingDay(day);
  };

  // Çalışma saati seçildiğinde çağrılan fonksiyon
  const handleSelectWorkingHour = (hour) => {
    setWorkingHour(hour);
  };

  useEffect(() => {
    const loadAppointmentData = async () => {
      const docRef = doc(FIRESTORE_DB, 'appointments', appointmentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDate(data.date);
        if (data.doctorId) {
          setDoctorName(`${data.doctorId.name} (${data.doctorId.department}, ${data.doctorId.clinic})`);
          setSelectedDoctor(data.doctorId);
        } else {
          setDoctorName('');
        }
        setWorkingDay(data.workingDay || '');
        setWorkingHour(data.workingHour || '');
      } else {
        Alert.alert("Randevu bulunamadı");
      }

      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'doctors'));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDoctors(docs);
    };

    loadAppointmentData();
  }, [appointmentId]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorName(`${doctor.name} (${doctor.department}, ${doctor.clinic})`);
    setWorkingDays(doctor.workingDays || []);
    setWorkingHours(doctor.workingHours || []);
    setModalVisible(false);
  };

  
  const handleUpdate = async () => {
    const appointmentRef = doc(FIRESTORE_DB, 'appointments', appointmentId);

    try {
      setIsLoading(true);

      await updateDoc(appointmentRef, {
        title: title,
        date: date,
        doctorId: selectedDoctor,
        workingDay: workingDay,
        workingHour: workingHour,
      });

      setIsLoading(false);
      setAlertVisible(true);

      

     

    } catch (error) {
      setIsLoading(false);
      Alert.alert("Hata", "Randevu güncellenemedi: " + error.message);
    }
  };
  
  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectDoctor(item)}
      style={styles.listItem}
    >
      <Text style={styles.listItemText}>
        {`${item.name} (${item.department}, ${item.clinic})`}
      </Text>
    </TouchableOpacity>
  );
  const handleAlertClose = () => {
    setAlertVisible(false);
    navigation.navigate('Appointment')  
    // Bildirim gönderme işlemi buraya taşındı
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Randevunuz Güncellendi",
        body: 'Randevu detaylarınız başarıyla güncellendi.',
      },
      trigger: { seconds: 1 },
    });
  };


  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color='#2196f3' />
        </View>
      )}
    <View style={styles.cont2}>

      <Text style={styles.header}>Randevu Güncelleme</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Randevu Başlığı"
      />
    

      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {doctorName ? doctorName : "Doktor Seç"}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={doctors}
              renderItem={renderDoctorItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Çalışma günü ve saati seçimi için ek UI elemanları */}
      {workingDays.length > 0 && (
        <View style={styles.pickerContainer}>
          <FlatList
            data={workingDays}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.pickerItem, workingDay === item ? styles.pickerItemSelected : {}]}
                onPress={() => handleSelectWorkingDay(item)}
              >
                <Text style={styles.pickerItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      )}

      {workingHours.length > 0 && (
        <View style={styles.pickerContainer}>
        <FlatList
          data={workingHours}
          horizontal
          contentContainerStyle={styles.pickerContentContainer} // Stil burada uygulanıyor
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.pickerItem, workingHour === item ? styles.pickerItemSelected : {}]}
              onPress={() => handleSelectWorkingHour(item)}
            >
              <Text style={styles.pickerItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>
      
      )}

      <View style={styles.button}>
        <Button
          title="Randevuyu Güncelle"
          onPress={handleUpdate}
          color="#4a90e2"
        />
      </View>

      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../resim/update.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
    </View>
    <CustomAlert
        visible={alertVisible}
        message="Başarılı, Randevu güncellendi"
        onClose={handleAlertClose}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  listItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  cont2: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    
    textAlign:'center',
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    
  },
  lottieContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 300,
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
  pickerContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  pickerItemSelected: {
    backgroundColor: '#4a90e2',
  },
  pickerItemText: {
    color: '#000',
    textAlign: 'center',
  },
});

export default UpdateAppointmentScreen;
