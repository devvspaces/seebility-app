import { useRef, useEffect, useState } from "react";
import styles from './index.module.css';
import { Box } from "@chakra-ui/react";

const SoundAmplitudeBars: React.FC = () => {

  const frequencyCount = 50; // State for frequency count

  const barsRef = useRef<(HTMLDivElement | null)[]>(
    Array.from({ length: frequencyCount }, () => null)
  ); // Ref for bars

  useEffect(() => {
    let audioContext: AudioContext, analyzer: AnalyserNode;
    const audioElement = new Audio("/voices/welcome.mp3");

    audioContext = new window.AudioContext();
    analyzer = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(audioElement);

    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    const bufferLength = frequencyCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyzer.getByteFrequencyData(dataArray);

      barsRef.current.forEach((bar, index) => {
        if (bar) {
          const barHeight = (dataArray[index]) * (100 / 255); // Adjust to scale bar height
          bar.style.height = `${barHeight}%`;
        } 
      });

      requestAnimationFrame(draw);
    };

    audioElement.addEventListener("canplay", () => {
      audioElement.play();
      draw();
    });

    return () => {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();
    };
  }, []);

  return (
    <Box className={styles.soundBars} mt={5}>
      {Array.from({ length: frequencyCount }, (_, index) => (
        <Box bg={'blue.400'} key={index} ref={(element) => (barsRef.current[index] = element)} className={styles.bar} />
      ))}
    </Box>
  );
};

export default SoundAmplitudeBars;
