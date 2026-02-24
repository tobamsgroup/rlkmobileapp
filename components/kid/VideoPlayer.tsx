import { SCREEN_HEIGHT } from '@/utils/scale';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type VideoPlayerProps = {
  src: string;
  thumbnail?: any; // e.g. require(...) or { uri: string }
  onVideoEnd?: () => void;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnail,
  onVideoEnd,
}) => {
  const [showPlayer, setShowPlayer] = useState(true);

  const player = useVideoPlayer(src, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <View style={{
        height:SCREEN_HEIGHT * 0.5
    }} className="relative w-full bg-[#265828]  h-full rounded-[20px] overflow-hidden">


      {/* Video View */}
      {/* {showPlayer && ( */}
      <VideoView
        style={{
          width: '100%',
          height: '100%',
        }}
        player={player}
        className="w-full h-full rounded-[20px]"
        allowsFullscreen
        allowsPictureInPicture
      />
      {/* )} */}
    </View>
  );
};

export default VideoPlayer;
