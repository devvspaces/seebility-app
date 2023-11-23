import speakers from "./speakers";

export function getLengthType(lengthType: "TIME" | "WORD") {
  if (lengthType === "TIME") {
    return "minutes";
  } else {
    return "words";
  }
}

export function findSpeaker(name: string) {
  return speakers.find((speaker) => speaker.name === name);
}
