import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Platform , Modal, FlatList } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { addDoc, collection ,} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDocs } from 'firebase/firestore';
import LottieView from 'lottie-react-native';

const CreateAppointmentScreen = ({ navigation }) => {


  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    if (!appointmentTitle.trim()) {
      newErrors.appointmentTitle = 'Lütfen bir randevu başlığı giriniz.';
      isValid = false;
    }

    if (!selectedDoctor) {
      newErrors.selectedDoctor = 'Lütfen bir doktor seçiniz.';
      isValid = false;
    }

    // Tarih kontrolü için ekstra bir durum gerekli olabilir
    // Örneğin, bugünden önceki bir tarihi seçmek yasak olabilir

    setError(newErrors);
    return isValid;
  };
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setError(prevState => ({ ...prevState, selectedDoctor: '' })); // Hata mesajını temizle

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
    if (validateInput()) {
    try {
      setIsLoading(true); // Bekleme durumunu başlat

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
      setIsLoading(false); // Bekleme durumunu başlat

      Alert.alert("Başarılı", "Randevu oluşturuldu", [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Randevunuz Oluşturuldu 📅",
          body: 'Yeni randevunuz başarıyla oluşturuldu. Randevu detaylarınızı kontrol ediniz.',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      setIsLoading(false); // Bekleme durumunu başlat

      Alert.alert('Hata', 'Randevu oluşturulamadı');
    }
    setAppointmentTitle("");
    setSelectedDoctor("");
  }

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
  style={error.appointmentTitle ? styles.inputError : styles.input}
  value={appointmentTitle}
  onChangeText={(text) => {
    setAppointmentTitle(text);
    if (error.appointmentTitle) {
      setError(prevState => ({ ...prevState, appointmentTitle: '' }));
    }
  }}
  maxLength={30}
  placeholder="Randevu Başlığı"
/>
{error.appointmentTitle ? <Text style={styles.errorText}>{error.appointmentTitle}</Text> : null}

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
      {error.selectedDoctor ? <Text style={styles.errorText}>{error.selectedDoctor}</Text> : null}

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
            source={require('../resim/r3.json')} // Make sure this path is correct
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
        </View>
        {/* Bekleme göstergesi */}
 {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputError: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
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
  inputError: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',    
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    // Diğer stil tanımlamaları
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
    height: 400, // Adjust height as needed
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

export default CreateAppointmentScreen;