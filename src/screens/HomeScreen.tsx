import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

//import { migrateLocalData } from "../services/planetService";

import { colors } from '../theme/colors';
import { PlanetData, NavItem } from '../types/planet';
import { GalaxyBackground } from '../components/GalaxyBackground';
import { Planet } from '../components/Planet';
import { Header } from '../components/Header';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { BottomNav } from '../components/ButtomNav';
import CreatePlanetModal from '../components/CreatePlanetModal';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  getPlanets,
  createPlanet,
  deletePlanet,
  updatePlanet,
} from '../services/planetService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 1.2;


const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'explore', icon: 'planet', label: 'Explore' },
  { id: 'nova', icon: 'nova', label: 'NOVA' },
  { id: 'profile', icon: 'profile', label: 'Profile' },
];

function generatePlanetPosition(existingPlanets: PlanetData[]) {
  let top = 0;
  let left = 0;
  let validPosition = false;

  while (!validPosition) {
    top = 120 + Math.random() * (CANVAS_HEIGHT - 250);
    left = 30 + Math.random() * (CANVAS_WIDTH - 140);
    validPosition = true;

    for (const planet of existingPlanets) {
      const dx = left - planet.left;
      const dy = top - planet.top;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minimumDistance = planet.size / 2 + 100 / 2 + 40;

      if (distance < minimumDistance) {
        validPosition = false;
        break;
      }
    }
  }

  return { top, left };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeNav, setActiveNav] = useState('home');

  type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<HomeNavigationProp>();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    });

  const navBottom = insets.bottom + 14;
  const fabBottom = navBottom + 78;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [planets, setPlanets] = useState<PlanetData[]>([]);

useEffect(() => {
  async function fetchPlanets() {
    try {
      const savedPlanets = await getPlanets();
      setPlanets(savedPlanets);
    } catch (error) {
      console.error("Failed to load planets:", error);
    }
  }

  fetchPlanets();
}, []);

  const handleCreatePlanet = async (name: string) => {
    try {
      const position = generatePlanetPosition(planets);

      const planetColors = [
        { coreColor: colors.accentPurple, midColor: '#B18CFF', shadowColor: '#2E1065' },
        { coreColor: colors.accentTeal, midColor: '#8FF3FF', shadowColor: '#083344' },
        { coreColor: '#F59E0B', midColor: '#FFD48A', shadowColor: '#5A2E04' },
        { coreColor: '#F472B6', midColor: '#FBC7E3', shadowColor: '#5B1042' },
      ];

      const randomColor = planetColors[Math.floor(Math.random() * planetColors.length)];

      const newPlanet: PlanetData = {
        id: Date.now().toString(),
        name,
        itemCount: 0,
        size: 100,
        top: position.top,
        left: position.left,
        coreColor: randomColor.coreColor,
        midColor: randomColor.midColor,
        shadowColor: randomColor.shadowColor,
        glowColor: randomColor.coreColor,
        hasRing: false,
        hasMoon: false,
      };

      await createPlanet(newPlanet);
      setPlanets((previous) => [...previous, newPlanet]);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to create planet:', error);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <GalaxyBackground width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header worldCount={planets.length} onSearchPress={() => {}} />

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.scroll,
              { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
              animatedStyle,
            ]}
          >
            {planets.map((planet) => (
              <Planet
                key={planet.id}
                planet={planet}
                onPress={() => {
                  navigation.navigate('Collection', { planet });
                }}
                onLongPress={(pressedPlanet) => {
                  setSelectedPlanet(pressedPlanet);
                }}
              />
            ))}
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>

      <View style={[styles.dragHint, { bottom: navBottom + 92 }]} pointerEvents="none">
        <View style={styles.dragDots}>
          <View style={styles.dragDot} />
          <View style={styles.dragDot} />
          <View style={styles.dragDot} />
        </View>
        <Text style={styles.dragText}>DRAG TO EXPLORE</Text>
      </View>

      <FloatingActionButton bottom={fabBottom} onPress={() => setModalVisible(true)} />

      <CreatePlanetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreatePlanet={handleCreatePlanet}
      />

      <BottomNav
        items={NAV_ITEMS}
        activeId={activeNav}
        onSelect={setActiveNav}
        bottom={navBottom}
      />

      {/* Rename Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={renameVisible}
        onRequestClose={() => setRenameVisible(false)}
      >
        <View style={styles.menuBackdrop}>
          <View style={styles.planetMenu}>
            <Text style={styles.menuTitle}>Rename Planet</Text>

            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="Planet name"
              placeholderTextColor={colors.textTertiary || '#888'}
              style={styles.renameInput}
              autoFocus
            />

            <Pressable
              style={styles.menuButton}
              onPress={async () => {
                if (!selectedPlanet) return;
                const trimmedName = renameValue.trim();
                if (!trimmedName) return;

                try {
                  const updatedPlanet = {
                     ...selectedPlanet,
                     name: trimmedName,
               };

               const savedPlanet = await updatePlanet(updatedPlanet);

               setPlanets((current) =>
                 current.map((p) =>
                 p.id === savedPlanet.id ? savedPlanet : p
                )
                );
                  setRenameVisible(false);
                  setSelectedPlanet(null);
                } catch (error) {
                  console.error('Failed to rename planet:', error);
                }
              }}
            >
              <Text style={styles.menuButtonText}>Save</Text>
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => {
                setRenameVisible(false);
                setSelectedPlanet(null);
              }}
            >
              <Text style={styles.menuButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Options Menu Modal */}
      {selectedPlanet && !renameVisible && (
        <Modal
          transparent
          animationType="fade"
          visible={!!selectedPlanet}
          onRequestClose={() => setSelectedPlanet(null)}
        >
          <Pressable style={styles.menuBackdrop} onPress={() => setSelectedPlanet(null)}>
            <View style={styles.planetMenu}>
              <Text style={styles.menuTitle}>{selectedPlanet.name}</Text>

              <Pressable
                style={styles.menuButton}
                onPress={() => {
                  setRenameValue(selectedPlanet.name);
                  setRenameVisible(true);
                }}
              >
                <Text style={styles.menuButtonText}>✏️ Rename</Text>
              </Pressable>

              <Pressable
                style={styles.menuButton}
                onPress={() => {
                  const planetToDelete = selectedPlanet;
                  setSelectedPlanet(null);

                  Alert.alert(
                    'Delete planet?',
                    `Delete "${planetToDelete.name}"? This cannot be undone.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await deletePlanet(planetToDelete.id);
                            setPlanets((current) =>
                              current.filter((p) => p.id !== planetToDelete.id)
                            );
                          } catch (error) {
                            console.error('Failed to delete planet:', error);
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.deleteButtonText}>🗑 Delete</Text>
              </Pressable>

              <Pressable
                style={styles.menuButton}
                onPress={() => setSelectedPlanet(null)}
              >
                <Text style={styles.menuButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.spaceDeep || '#0B0D1B',
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  dragHint: {
    position: 'absolute',
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dragDots: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dragDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary || '#888',
    marginRight: 3,
    opacity: 0.6,
  },
  dragText: {
    color: colors.textTertiary || '#888',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetMenu: {
    width: 280,
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#312E81',
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#312E81',
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  renameInput: {
    backgroundColor: '#0F172A',
    color: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
});