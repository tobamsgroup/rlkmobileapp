import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import LottieView from 'lottie-react-native';
import React, { ReactNode, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import ReactNativeModal from 'react-native-modal';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';

type Tool = 'pen' | 'brush' | 'erase';

type Stroke = {
  path: string;
  color: string;
  width: number;
  mode: Tool;
};

const COLORS = [
  '#000000', // black
  '#FFFFFF', // white
  '#808080', // gray
  '#FF0000', // red
  '#FF6B6B', // light red
  '#FF8C00', // orange
  '#FFA500', // amber
  '#FFBB33', // yellow-orange
  '#FFD700', // gold
  '#00C851', // green
  '#2ECC71', // emerald
  '#00AAFF', // sky blue
  '#1E90FF', // dodger blue
  '#0057FF', // deep blue
  '#AA66CC', // purple
  '#8E44AD', // deep purple
  '#FF69B4', // pink
  '#FF1493', // deep pink
  '#A0522D', // brown
  '#4B0082', // indigo
];

type Mode = 'TYPE' | 'DRAW' | 'RECORD';

export default function Journal({ onNext }: { onNext: () => void }) {
  const [mode, setMode] = useState<Mode>('TYPE');
  const [textAnswer, setTextAnswer] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [openColors, setOpenColors] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const player = useAudioPlayer();
  const [pauseRecording, setPauseRecording] = useState(false);
  const [recordMode, setRecordMode] = useState('start');
  const [openModal, setOpenModal] = useState(false)

  const startRecording = async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) return;

    await AudioModule.setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await recorder.prepareToRecordAsync();
    await recorder.record();
    setRecordMode('recording');
  };

  const stopRecording = async () => {
    await recorder.stop();

    if (recorder.uri) {
      setAudioUri(recorder.uri);
    }
    setRecordMode('stop');
  };

  const playRecording = async () => {
    if (!audioUri) return;

    await player.replace({ uri: audioUri });
    await player.play();
  };

  const retryRecord = async () => {
    // If currently recording, stop it first
    if (recorderState.isRecording) {
      await recorder.stop();
    }

    // Start fresh recording session
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const reRecord = async () => {
    setAudioUri(null);
    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecordMode('recording');
  };

  const togglePlayback = async () => {
    if (pauseRecording) {
      recorder.record();
    } else {
      recorder.pause();
    }
    setPauseRecording((prev) => !prev);
  };

  const handleSubmit = () => {
    setOpenModal(true)
  };

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentPath, setCurrentPath] = useState('');

  /* ---------------- TOOL CONFIG ---------------- */

  const getStrokeWidth = () => {
    if (tool === 'brush') return 12;
    if (tool === 'erase') return 20;
    return 4; // pen
  };

  const getStrokeColor = () => {
    if (tool === 'erase') return '#FFFFFF';
    return color;
  };

  /* ---------------- DRAW LOGIC ---------------- */

  const beginPath = (path: string) => {
    setCurrentPath(path);
  };

  const updatePath = (path: string) => {
    setCurrentPath(path);
  };

  const endPath = (path: string) => {
    const newStroke: Stroke = {
      path,
      color: getStrokeColor(),
      width: getStrokeWidth(),
      mode: tool,
    };

    setStrokes((prev) => [...prev, newStroke]);
    setRedoStack([]); // reset redo
    setCurrentPath('');
  };

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(beginPath)(`M ${e.x} ${e.y}`);
    })
    .onUpdate((e) => {
      runOnJS(updatePath)(`${currentPath} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      runOnJS(endPath)(currentPath);
    });

  /* ---------------- ACTIONS ---------------- */

  const undo = () => {
    if (strokes.length === 0) return;

    const last = strokes[strokes.length - 1];
    setRedoStack((prev) => [...prev, last]);
    setStrokes((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const lastRedo = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setStrokes((prev) => [...prev, lastRedo]);
  };

  const clearAll = () => {
    setStrokes([]);
    setRedoStack([]);
  };

  const Tab = ({ label, icon }: { label: Mode; icon: ReactNode }) => {
    const active = mode === label;

    return (
      <Pressable
        onPress={() => setMode(label)}
        className={`flex-1 py-3 rounded-xl flex-row justify-center gap-2 px-1 items-center ${
          active ? 'bg-[#3F9243]' : 'bg-[#FFF7CC]'
        }`}
      >
        {icon}
        <Text
          className={`font-bold ${active ? 'text-white' : 'text-[#806C00]'}`}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView>
      <View className="flex-1 ustify-center">
        <View className="bg-white rounded-3xl p-6">
          <Text className="text-[20px] font-sansSemiBold text-dark text-center mb-4">
            What Did You Learn?
          </Text>

          {/* Tabs */}
          <View className="flex-row gap-3 mb-6">
            <Tab
              label="TYPE"
              icon={
                <ICONS.Keyboard
                  stroke={mode === 'TYPE' ? 'white' : '#806C00'}
                />
              }
            />
            <Tab
              label="DRAW"
              icon={
                <ICONS.Palette stroke={mode === 'DRAW' ? 'white' : '#806C00'} />
              }
            />
            <Tab
              label="RECORD"
              icon={
                <ICONS.MicrophoneOutlined
                  stroke={mode === 'RECORD' ? 'white' : '#806C00'}
                />
              }
            />
          </View>
          <View className="border w-full border-[#D3D2D333] mb-6" />

          {/* TYPE MODE */}
          {mode === 'TYPE' && (
            <View>
              <Text className="mb-4 text-dark text-[16px] font-sans">
                Enter your answer below
              </Text>
              <TextInput
                value={textAnswer}
                onChangeText={setTextAnswer}
                multiline
                placeholder="Type here..."
                className="h-[200px] border-2 border-[#D3D2D3] bg-[#D3D2D333] rounded-[16px] p-3 font-sans text-dark leading-[1.5]"
              />
            </View>
          )}

          {/* DRAW MODE */}
          {mode === 'DRAW' && (
            <View className="flex-1 border border-[#D3D2D366] rounded-[8px]">
              {/* Toolbar */}
              <View className="flex-row justify-between mb-4 bg-white  rounded-2xl border-b border-b-[#D3D2D366]">
                <Pressable
                  onPress={() => setTool('erase')}
                  className="border-r items-center justify-center p-2 border-r-[#D3D2D366]"
                >
                  <Pressable
                    onPress={() => setTool('erase')}
                    className={twMerge(
                      'w-9 h-9  items-center justify-center rounded-[8px]',
                      tool === 'erase' && 'bg-[#DBEFDC80]',
                    )}
                  >
                    <ICONS.Eraser
                      stroke={tool === 'erase' ? '#3F9243' : '#474348'}
                    />
                  </Pressable>
                </Pressable>

                <Pressable
                  onPress={() => setOpenColors(true)}
                  className="border-r items-center justify-center p-2 border-r-[#D3D2D366]"
                >
                  <Pressable
                    onPress={() => setOpenColors(true)}
                    className={twMerge(
                      '  items-center justify-center rounded-[8px] flex-row gap-3',
                    )}
                  >
                    <View
                      style={{ backgroundColor: color }}
                      className="w-6 h-6 rounded-full bg-red-100"
                    />
                    <ICONS.ColorPalette />
                  </Pressable>
                </Pressable>

                <Pressable
                  onPress={() => setTool('pen')}
                  className="border-r items-center justify-center p-2 border-r-[#D3D2D366]"
                >
                  <Pressable
                    onPress={() => setTool('pen')}
                    className={twMerge(
                      'w-9 h-9  items-center justify-center rounded-[8px]',
                      tool === 'pen' && 'bg-[#DBEFDC80]',
                    )}
                  >
                    <ICONS.PencilOutlined
                      stroke={tool === 'pen' ? '#3F9243' : '#474348'}
                    />
                  </Pressable>
                </Pressable>

                <Pressable
                  onPress={() => setTool('brush')}
                  className="border-r items-center justify-center p-2 border-r-[#D3D2D366]"
                >
                  <Pressable
                    onPress={() => setTool('brush')}
                    className={twMerge(
                      'w-9 h-9  items-center justify-center rounded-[8px]',
                      tool === 'brush' && 'bg-[#DBEFDC80]',
                    )}
                  >
                    <ICONS.Brush
                      stroke={tool === 'brush' ? '#3F9243' : '#474348'}
                    />
                  </Pressable>
                </Pressable>

                <Pressable
                  onPress={undo}
                  className="border-r items-center justify-center p-2 border-r-[#D3D2D366]"
                >
                  <Pressable
                    onPress={undo}
                    className={twMerge(
                      'w-9 h-9  items-center justify-center rounded-[8px]',
                    )}
                  >
                    <ICONS.ArrowBackUp />
                  </Pressable>
                </Pressable>

                <Pressable
                  onPress={redo}
                  className=" items-center justify-center p-2"
                >
                  <Pressable
                    onPress={redo}
                    className={twMerge(
                      'w-9 h-9  items-center justify-center rounded-[8px]',
                    )}
                  >
                    <ICONS.ArrowForwardUp />
                  </Pressable>
                </Pressable>
              </View>

              {/* Color Palette */}
              {openColors && (
                <View className="flex-row mb-4 px-4 border-b-[#D3D2D366] border-b pb-4">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {COLORS.map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => {
                          setColor(c);
                          setOpenColors(false);
                        }}
                        className={twMerge(
                          'w-8 h-8 rounded-full mr-3',
                          c === '#FFFFFF' && 'border border-[#D3D2D3]',
                        )}
                        style={{
                          backgroundColor: c,
                        }}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Canvas */}
              <GestureDetector gesture={gesture}>
                <View className="flex-1 bg-white rounded-3xl overflow-hidden">
                  <Svg height="500" width="500">
                    {strokes.map((stroke, index) => (
                      <Path
                        key={index}
                        d={stroke.path}
                        stroke={stroke.color}
                        strokeWidth={stroke.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity={stroke.mode === 'brush' ? 0.6 : 1}
                      />
                    ))}

                    {currentPath !== '' && (
                      <Path
                        d={currentPath}
                        stroke={getStrokeColor()}
                        strokeWidth={getStrokeWidth()}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity={tool === 'brush' ? 0.6 : 1}
                      />
                    )}
                  </Svg>
                </View>
              </GestureDetector>
            </View>
          )}

          {/* RECORD MODE */}
          {mode === 'RECORD' && (
            <View>
              {!recorder.isRecording && !audioUri && recordMode === 'start' && (
                <Pressable
                  onPress={startRecording}
                  className="border-2 border-[#D3D2D3] border-b-4 border-b-[#D3D2D3] rounded-[16px] p-6 items-center flex-row gap-4"
                >
                  <ICONS.MicrophoneFilled />
                  <View>
                    <Text className="text-[16px] font-sansSemiBold ">
                      TAP TO SPEAK
                    </Text>
                    <Text className="text-[#474348] font-sans mt-2">
                      Share your thoughts out loud!
                    </Text>
                  </View>
                </Pressable>
              )}

              {recordMode === 'recording' && (
                <>
                  <View className="flex items-center justify-center gap-4 border-2 border-[#D3D2D3] border-b-4 border-b-[#D3D2D3] rounded-[16px] p-6  flex-row">
                    {pauseRecording ? (
                      <Image
                        source={IMAGES.Recording}
                        alt="recording"
                        className="w-40 h-10 object-cover"
                      />
                    ) : (
                      <View className="w-40  h-10 object-cover">
                        <LottieView
                          source={require('../../assets/lottie/microphone.json')}
                          autoPlay
                          loop
                          style={{
                            width: '100%',
                            height: 40,
                            padding: 0,
                            margin: 0,
                          }}
                        />
                      </View>
                    )}
                  </View>

                  <View className="flex-row justify-center items-center gap-5 mt-8">
                    <Pressable onPress={togglePlayback}>
                      {pauseRecording ? (
                        <ICONS.VoiceSpeaker />
                      ) : (
                        <ICONS.PauseFilled width={48} height={48} />
                      )}
                    </Pressable>
                    <Pressable onPress={retryRecord}>
                      <ICONS.ReadModeReset width={48} height={48} />
                    </Pressable>

                    <Pressable onPress={stopRecording}>
                      <ICONS.ReadModePause width={48} height={48} />
                    </Pressable>
                  </View>
                </>
              )}

              {audioUri && recordMode === 'stop' && (
                <>
                  <Pressable
                    onPress={startRecording}
                    className="border-2 border-[#099137] border-b-4 border-b-[#099137] rounded-[16px] p-6 items-center flex-row gap-4 bg-[#F1F9F1]"
                  >
                    <ICONS.Check width={40} height={40} />
                    <View>
                      <Text className="text-[16px] font-sansSemiBold ">
                        Great job! Recording complete
                      </Text>
                      <Text className="text-[#474348] font-sans mt-2">
                        Your answer is saved.
                      </Text>
                    </View>
                  </Pressable>
                  <View className="mt-4 items-center gap-4">
                    <View className="flex-row gap-4">
                      <Pressable
                        onPress={playRecording}
                        className="rounded-full"
                      >
                        <ICONS.VoiceSpeaker />
                      </Pressable>

                      <Pressable onPress={reRecord} className=" rounded-full">
                        <ICONS.ReadModeReset width={48} height={48} />
                      </Pressable>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        {/* Submit */}
        <Button text="SUBMIT" onPress={() => setOpenModal(true)} className="mt-8" />

        <ReactNativeModal isVisible={openModal}>
          <View className="bg-[#DBEFDC] border-2 border-[#6ABC6D] rounded-[24px] p-5">
            <View className="bg-white rounded-[24px] p-5 mb-6 items-center justify-center">
              <ICONS.PartyingFace />
              <Text className='text-[20px] text-[#265828] font-sansSemiBold text-center leading-[1.5]'>High five! Answer{'\n'}submitted!</Text>
              <Text className='text-[16px] text-center mt-2 font-sansMedium text-dark leading-[1.5]'>Get ready for the next{'\n'}challenge 🚀</Text>
            </View>
            <Button onPress={onNext} text="NEXT LESSON" />
            <Button
            onPress={() => setOpenModal(false)}
              text="TRY AGAIN"
              className="bg-[#FFF7CC] border-b-[#806C00] border-[#806C00]  border border-b-4  mt-6 "
              textClassname="text-[#806C00]"
            />
          </View>
        </ReactNativeModal>
      </View>
    </GestureHandlerRootView>
  );
}
