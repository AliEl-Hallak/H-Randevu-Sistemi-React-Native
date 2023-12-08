import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert, Platform , Modal, FlatList } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { addDoc, collection ,} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getDocs } from 'firebase/firestore';
import LottieView from 'lottie-react-native';

const CreateAppointmentScreen = () => {


  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'doctors'));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDoctors(docs);
    };

    fetchDoctors();
  }, []);
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(false);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectDoctor(item)}
    >
      <Text style={styles.text}>{`${item.name} (${item.department}, ${item.clinic})`}</Text>
    </TouchableOpacity>
  );

  const handleCreateAppointment = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userEmail = user.email;
      const userId = user.uid;
      const dateString = appointmentDate.toISOString();

      await addDoc(collection(FIRESTORE_DB, 'appointments'), {
        title: appointmentTitle,
        date: dateString,
        doctorId: selectedDoctor,
        userId: userId,
        userEmail: userEmail,
      });

      Alert.alert('Başarılı', 'Randevu oluşturuldu');
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Randevunuz Oluşturuldu 📅",
          body: 'Yeni randevunuz başarıyla oluşturuldu. Randevu detaylarınızı kontrol ediniz.',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      Alert.alert('Hata', 'Randevu oluşturulamadı');
    }
    setAppointmentTitle("");
    setSelectedDoctor("");
    

  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAppointmentDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR');
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
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {formatDate(appointmentDate)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={appointmentDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
    <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedDoctor ? `${selectedDoctor.name} (${selectedDoctor.department}, ${selectedDoctor.clinic})` : 'Doktor Seç'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={doctors}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
  style={styles.createAppointmentButton}
  onPress={handleCreateAppointment}
>
  <Text style={styles.createAppointmentButtonText}>Randevu Oluştur</Text>
</TouchableOpacity>
   <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/r4.json')} // Make sure this path is correct
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dateInput: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  createAppointmentButton: {
    width: '50%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#4a90e2",
    borderRadius: 6,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Android için gölge efekti
  },
  createAppointmentButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
  lottieContainer: {
    alignItems: 'center', // Center the LottieView horizontally
    justifyContent: 'center', // Center the LottieView vertically
    marginTop: 0, // Add some space above the LottieView
  },
  lottieAnimation: {
    width: 300, // Adjust width as needed
    height: 200, // Adjust height as needed
  },
  


});

export default CreateAppointmentScreen;