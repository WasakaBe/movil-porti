import React, { useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons' // Importar íconos
import { useLocalSearchParams, useRouter } from 'expo-router' // ✅ Reemplazo de `navigation`

import noticias_styles from '@/app/styles/noticiasStyle'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'

export default function Invitacion() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [colonia, setColonia] = useState('')

  const handleEnviar = () => {
    // Lógica para manejar el envío
    console.log('Datos enviados:', { nombre, telefono, colonia })
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()} // ✅ Reemplazo de `navigation.goBack()`
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={styles.logo}
        />

        {/* Título */}
        <Text style={styles.title}>
          ¡Invita a tus familiares y amigos a formar parte!
        </Text>

        {/* Campos del formulario */}
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="call" size={24} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="location-on"
            size={24}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Colonia / comunidad"
            placeholderTextColor="#999"
            value={colonia}
            onChangeText={setColonia}
          />
        </View>

        {/* Botón enviar */}
        <TouchableOpacity style={styles.button} onPress={handleEnviar}>
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>

        {/* Nota */}
        <Text style={styles.note}>
          *Estoy de acuerdo en enviar la información de contacto de mi
          familiar/amigo para que sea contactado y se invite a realizar el
          proceso de afiliación.
        </Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
})
