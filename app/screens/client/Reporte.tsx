import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import LoadingSpinner from '@/app/components/loadingSpinner'
import Banners from '@/app/components/banners'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import reporte_styles from '@/app/styles/reporteStyle'
import { Picker } from '@react-native-picker/picker'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import MapView, { Marker } from 'react-native-maps'
import CustomModal from '@/app/components/customModal'
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons'
import { API_URL } from '@env'

interface Reporte {
  titulo: string
  descripcion: string
  foto: string
  fecha_reporte: string
  estatus: string
  dependencia: string
}

interface LocationData {
  latitude: number
  longitude: number
}

export default function Reporte() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)

  const [modalVisible, setModalVisible] = useState(false)
  const [manualModalVisible, setManualModalVisible] = useState(false) // Nueva modal para reporte manual
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [department, setDepartment] = useState('aseo')
  const [location, setLocation] = useState<LocationData | null>(null)

  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([])
  const [submitting, setSubmitting] = useState(false)

  // 🔹 Estado para el modal de mensajes
  const [customModalVisible, setCustomModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error' | 'ban'>(
    'success'
  )
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}api/reportes/dependencias`)
        const data = await response.json()

        // Convertir la respuesta en el formato esperado por el Picker
        const formattedDepartments = data.map(
          (dep: { id_dependencia: number; nombre: string }) => ({
            label: dep.nombre,
            value: dep.id_dependencia.toString(),
          })
        )

        setDepartments(formattedDepartments)
      } catch (error) {
        console.error('Error al obtener dependencias:', error)
      }
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    if (idPartido) {
      fetch(`${API_URL}api/reportes/partido/${idPartido}`)
        .then((response) => response.json())
        .then((data: Reporte[]) => {
          setReportes(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error al obtener reportes:', error)
          setLoading(false)
        })
    }
  }, [idPartido])

  if (loading) {
    return <LoadingSpinner />
  }

  const onClose = () => {
    setModalVisible(false)
  }

  // Función para tomar una foto
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Se requiere acceso a la cámara para tomar fotos.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  // Función para seleccionar una imagen de la galería
  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Se requiere acceso a la galería para seleccionar imágenes.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleGetLocation = async () => {
    // Solicitar permisos para acceder a la ubicación
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      alert(
        'Se requiere acceso a la ubicación para obtener la posición actual.'
      )
      return
    }

    // Obtener la ubicación actual
    const locationResult = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })

    // Actualizar el estado con la ubicación obtenida
    setLocation({
      latitude: locationResult.coords.latitude,
      longitude: locationResult.coords.longitude,
    })
  }

  const handleCreateReport = async () => {
    if (!title || !description || !department || !location) {
      setModalType('error')
      setModalMessage('Todos los campos son obligatorios.')
      setCustomModalVisible(true)
      return
    }

    setSubmitting(true) // 🔹 Mostrar spinner o deshabilitar botón

    const formData = new FormData()
    formData.append('id_usuario', String(idUsuario))
    formData.append('titulo', title)
    formData.append('descripcion', description)
    formData.append('id_dependencia', String(department))
    formData.append('fecha_reporte', new Date().toISOString().split('T')[0])
    formData.append('latitud', String(location.latitude))
    formData.append('longitud', String(location.longitude))

    if (selectedImage) {
      const fileName = selectedImage.split('/').pop() || 'image.jpg'
      const fileType = fileName.split('.').pop() || 'jpg'

      formData.append('imagen', {
        uri: selectedImage,
        name: fileName,
        type: `image/${fileType}`,
      } as any)
    }

    try {
      const response = await fetch(`${API_URL}api/reportes/crear`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = await response.json()
      console.log('Resultado:', result)

      if (response.ok) {
        setModalType('success')
        setModalMessage('Reporte creado exitosamente.')
        setCustomModalVisible(true)
        setModalVisible(false)
        setTitle('')
        setDescription('')
        setSelectedImage(null)
        setLocation(null)
        setDepartment('')
      } else {
        setModalType('error')
        setModalMessage(result.message || 'Error al crear el reporte.')
        setCustomModalVisible(true)
      }
    } catch (error) {
      setModalType('error')
      setModalMessage('Error al enviar el reporte. Intenta nuevamente.')
      setCustomModalVisible(true)
    } finally {
      setSubmitting(false) // 🔹 Ocultar spinner o habilitar botón
    }
  }

  // Nueva función para crear reporte manual
  const handleCreateManualReport = async () => {
    if (!title || !description || !department || !latitud || !longitud) {
      setModalType('error')
      setModalMessage('Todos los campos son obligatorios.')
      setCustomModalVisible(true)
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append('id_usuario', String(idUsuario))
    formData.append('titulo', title)
    formData.append('descripcion', description)
    formData.append('id_dependencia', String(department))
    formData.append('fecha_reporte', new Date().toISOString().split('T')[0])
    formData.append('latitud', latitud)
    formData.append('longitud', longitud)

    if (selectedImage) {
      const fileName = selectedImage.split('/').pop() || 'image.jpg'
      const fileType = fileName.split('.').pop() || 'jpg'

      formData.append('imagen', {
        uri: selectedImage,
        name: fileName,
        type: `image/${fileType}`,
      } as any)
    }

    try {
      const response = await fetch(`${API_URL}api/reportes/crear`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = await response.json()

      if (response.ok) {
        setModalType('success')
        setModalMessage('Reporte creado exitosamente.')
        setCustomModalVisible(true)
        setManualModalVisible(false)
        setTitle('')
        setDescription('')
        setSelectedImage(null)
        setLatitud('')
        setLongitud('')
        setDepartment('')
      } else {
        setModalType('error')
        setModalMessage(result.message || 'Error al crear el reporte.')
        setCustomModalVisible(true)
      }
    } catch (error) {
      setModalType('error')
      setModalMessage('Error al enviar el reporte. Intenta nuevamente.')
      setCustomModalVisible(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}> Reporte Ciudadano</Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      <View style={reporte_styles.container}>
        {reportes.length === 0 ? (
          <Text>No hay reportes disponibles.</Text>
        ) : (
          <FlatList
            data={reportes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={reporte_styles.cardContainer}>
                <View style={reporte_styles.statusContainer}>
                  <View
                    style={[
                      reporte_styles.statusBadge,
                      item.estatus === 'pendiente'
                        ? reporte_styles.approvedBadge
                        : reporte_styles.pendingBadge,
                    ]}
                  >
                    <Text style={reporte_styles.statusText}>
                      {item.estatus}
                    </Text>
                  </View>

                  <View style={reporte_styles.typeBadge}>
                    <Ionicons name="leaf-outline" size={14} color="#fff" />
                    <Text style={reporte_styles.typeText}>
                      {item.dependencia}
                    </Text>
                  </View>
                </View>

                <Text style={reporte_styles.title}>{item.titulo}</Text>

                <View style={reporte_styles.imageContainer}>
                  <Image
                    source={{ uri: item.foto }}
                    style={reporte_styles.image}
                  />
                </View>

                <View style={reporte_styles.contentContainer}>
                  <Text style={reporte_styles.description}>
                    {item.descripcion}
                  </Text>

                  <View style={reporte_styles.dateContainer}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={20}
                      color="#000"
                    />
                    <Text style={reporte_styles.dateText}>
                      {item.fecha_reporte}
                    </Text>
                  </View>
                </View>

                <View style={reporte_styles.bottomDecoration}>
                  <View style={reporte_styles.line} />
                  <View style={reporte_styles.dot} />
                  <View style={reporte_styles.line} />
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Botón flotante "Crear Reporte" */}
      <TouchableOpacity
        style={reporte_styles.createReportButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={reporte_styles.createReportButtonText}>Crear Reporte</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={reporte_styles.modalOverlay}>
          <View style={reporte_styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={reporte_styles.header}>
                <Text style={reporte_styles.headerTitle}>Nuevo Reporte</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={reporte_styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={reporte_styles.form}>
                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Título</Text>
                  <TextInput
                    style={reporte_styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ingrese el título del reporte"
                  />
                </View>

                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Descripción</Text>
                  <TextInput
                    style={[reporte_styles.input, reporte_styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describa el problema detalladamente"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={reporte_styles.imageSection}>
                  <Text style={reporte_styles.label}>Imagen</Text>
                  <View style={reporte_styles.imageButtons}>
                    <TouchableOpacity
                      style={reporte_styles.imageButton}
                      onPress={handleSelectImage}
                    >
                      <Ionicons name="images" size={24} color="#fff" />
                      <Text style={reporte_styles.buttonText}>Galería</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={reporte_styles.imageButton}
                      onPress={handleTakePhoto}
                    >
                      <Ionicons name="camera" size={24} color="#fff" />
                      <Text style={reporte_styles.buttonText}>Cámara</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedImage ? (
                    <Image
                      source={{
                        uri: selectedImage,
                      }}
                      style={reporte_styles.previewImage}
                    />
                  ) : (
                    <View style={reporte_styles.imagePlaceholder}>
                      <MaterialIcons name="image" size={40} color="#ccc" />
                      <Text style={reporte_styles.placeholderText}>
                        Vista previa de imagen
                      </Text>
                    </View>
                  )}
                </View>

                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Dependencia</Text>
                  <View style={reporte_styles.pickerContainer}>
                    <Picker
                      selectedValue={department}
                      onValueChange={(itemValue) => setDepartment(itemValue)}
                      style={reporte_styles.picker}
                    >
                      {departments.length > 0 ? (
                        departments.map((dept) => (
                          <Picker.Item
                            key={dept.value}
                            label={dept.label}
                            value={dept.value}
                          />
                        ))
                      ) : (
                        <Picker.Item
                          label="Cargando dependencias..."
                          value=""
                          enabled={false}
                        />
                      )}
                    </Picker>
                  </View>
                </View>

                <View style={reporte_styles.locationSection}>
                  <Text style={reporte_styles.label}>Ubicación</Text>
                  <TouchableOpacity
                    style={reporte_styles.locationButton}
                    onPress={handleGetLocation}
                  >
                    <FontAwesome5
                      name="map-marker-alt"
                      size={20}
                      color="#fff"
                    />
                    <Text style={reporte_styles.buttonText}>
                      Obtener ubicación
                    </Text>
                  </TouchableOpacity>

                  {location && (
                    <View style={reporte_styles.locationInfo}>
                      {/* Mini Mapa con marcador */}
                      <MapView
                        style={reporte_styles.miniMap}
                        initialRegion={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                          latitudeDelta: 0.01, // Zoom cercano
                          longitudeDelta: 0.01,
                        }}
                      >
                        {/* Marcador en la ubicación actual */}
                        <Marker
                          coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                          }}
                          title="Ubicación actual"
                          description={`Latitud: ${location.latitude}, Longitud: ${location.longitude}`}
                        />
                      </MapView>

                      {/* Detalles de la ubicación */}
                      <View style={reporte_styles.locationDetails}>
                        <Text style={reporte_styles.locationText}>
                          <Text style={reporte_styles.boldText}>Latitud:</Text>{' '}
                          {location.latitude}
                        </Text>
                        <Text style={reporte_styles.locationText}>
                          <Text style={reporte_styles.boldText}>Longitud:</Text>{' '}
                          {location.longitude}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Footer Buttons */}
              <View style={reporte_styles.footer}>
                <TouchableOpacity
                  style={reporte_styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={reporte_styles.cancelButtonText}>Salir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={reporte_styles.createButton}
                  onPress={handleCreateReport}
                  disabled={submitting} // 🔹 Deshabilitar mientras se envía
                >
                  <Text style={reporte_styles.createButtonText}>
                    {' '}
                    {submitting ? 'Enviando...' : 'Crear'}{' '}
                    {/* 🔹 Cambiar texto dinámicamente */}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Nuevo botón flotante "Crear Reporte Manual" */}
      <TouchableOpacity
        style={reporte_styles.createReportButtonManual}
        onPress={() => setManualModalVisible(true)}
      >
        <Text style={reporte_styles.createReportButtonText}>
          Crear Reporte Manual
        </Text>
      </TouchableOpacity>

      {/* MODAL para "Crear Reporte Manual" */}
      <Modal
        animationType="slide"
        transparent
        visible={manualModalVisible}
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={reporte_styles.modalOverlay}>
          <View style={reporte_styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={reporte_styles.header}>
                <Text style={reporte_styles.headerTitle}>Nuevo Reporte</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={reporte_styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={reporte_styles.form}>
                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Título</Text>
                  <TextInput
                    style={reporte_styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ingrese el título del reporte"
                  />
                </View>

                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Descripción</Text>
                  <TextInput
                    style={[reporte_styles.input, reporte_styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describa el problema detalladamente"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={reporte_styles.imageSection}>
                  <Text style={reporte_styles.label}>Imagen</Text>
                  <View style={reporte_styles.imageButtons}>
                    <TouchableOpacity
                      style={reporte_styles.imageButton}
                      onPress={handleSelectImage}
                    >
                      <Ionicons name="images" size={24} color="#fff" />
                      <Text style={reporte_styles.buttonText}>Galería</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={reporte_styles.imageButton}
                      onPress={handleTakePhoto}
                    >
                      <Ionicons name="camera" size={24} color="#fff" />
                      <Text style={reporte_styles.buttonText}>Cámara</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedImage ? (
                    <Image
                      source={{
                        uri: selectedImage,
                      }}
                      style={reporte_styles.previewImage}
                    />
                  ) : (
                    <View style={reporte_styles.imagePlaceholder}>
                      <MaterialIcons name="image" size={40} color="#ccc" />
                      <Text style={reporte_styles.placeholderText}>
                        Vista previa de imagen
                      </Text>
                    </View>
                  )}
                </View>

                <View style={reporte_styles.inputGroup}>
                  <Text style={reporte_styles.label}>Dependencia</Text>
                  <View style={reporte_styles.pickerContainer}>
                    <Picker
                      selectedValue={department}
                      onValueChange={(itemValue) => setDepartment(itemValue)}
                      style={reporte_styles.picker}
                    >
                      {departments.length > 0 ? (
                        departments.map((dept) => (
                          <Picker.Item
                            key={dept.value}
                            label={dept.label}
                            value={dept.value}
                          />
                        ))
                      ) : (
                        <Picker.Item
                          label="Cargando dependencias..."
                          value=""
                          enabled={false}
                        />
                      )}
                    </Picker>
                  </View>
                </View>

                <View style={reporte_styles.locationSection}>
                  <Text style={reporte_styles.label}>Ubicación</Text>
                  <TextInput
                    style={reporte_styles.input}
                    value={latitud}
                    onChangeText={setLatitud}
                    placeholder="Latitud"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={reporte_styles.input}
                    value={longitud}
                    onChangeText={setLongitud}
                    placeholder="Longitud"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Footer Buttons */}
              <View style={reporte_styles.footer}>
                <TouchableOpacity
                  style={reporte_styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={reporte_styles.cancelButtonText}>Salir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={reporte_styles.createButton}
                  onPress={handleCreateManualReport}
                  disabled={submitting} // 🔹 Deshabilitar mientras se envía
                >
                  <Text style={reporte_styles.createButtonText}>
                    {' '}
                    {submitting ? 'Enviando...' : 'Crear'}{' '}
                    {/* 🔹 Cambiar texto dinámicamente */}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />

      {/* 🔹 Modal de mensajes */}
      <CustomModal
        visible={customModalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setCustomModalVisible(false)}
      />
    </ImageBackground>
  )
}
