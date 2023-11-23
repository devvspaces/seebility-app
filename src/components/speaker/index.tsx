import { IconButton } from "@chakra-ui/react";
import { PiSpeakerSimpleSlashBold, PiSpeakerHighBold } from "react-icons/pi";
import { useState } from "react";

export default function SpeakerButton() {
  const [isListening, setIsListening] = useState(false);
  return (
    <IconButton
      width={"4rem"}
      fontSize={"1.3rem"}
      color={"var(--primary)"}
      aria-label="Speak"
      icon={isListening ? <PiSpeakerSimpleSlashBold /> : <PiSpeakerHighBold />}
      onClick={() => setIsListening(!isListening)}
    />
  );
}
