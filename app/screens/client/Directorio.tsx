import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  FlatList,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import dashboard_styles from '@/app/styles/dashboardStyle'
import noticias_styles from '@/app/styles/noticiasStyle'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons'
import directorio_styles from '@/app/styles/directorioStyle'
import Banners from '@/app/components/banners'
import directorioData from '@/app/constants/datos'

export default function Directorio() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

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

        <Text style={noticias_styles.tituloNoticia}>
          Directorio de Servicios
        </Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      {/* Lista de Directorio */}
      <FlatList
        data={directorioData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={directorio_styles.containerDirectorio}
        renderItem={({ item }) => (
          <View style={directorio_styles.card}>
            <View style={directorio_styles.imageSection}>
              <Image
                source={{ uri: item.imagen }}
                style={directorio_styles.profileImage}
              />
              <View style={directorio_styles.serviceBadge}>
                <MaterialCommunityIcons
                  name={
                    item.icono as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={14}
                  color="white"
                />

                <Text style={directorio_styles.serviceText}>
                  {item.especialidad}
                </Text>
              </View>
            </View>

            <View style={directorio_styles.infoSection}>
              <Text style={directorio_styles.name}>{item.nombre}</Text>
              <Text style={directorio_styles.serviceDescription}>
                {item.descripcion}
              </Text>

              <View style={directorio_styles.contactInfo}>
                <Feather name="phone" size={16} color="#666" />
                <Text style={directorio_styles.phoneNumber}>
                  {item.telefono}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Componente de Banners */}
      <Banners idPartido={Number(idPartido)} />
    </ImageBackground>
  )
}
