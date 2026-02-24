import React from "react";
import { SwitchMode } from "./SwitchMode";
import { handleParams } from "@/utils/kid";

const LearnCore = ({ onNext }: { onNext: () => void }) => {

  return (
    <SwitchMode
      mode="read"
      onClose={onNext}
      onSubmit={() =>
        handleParams([
          ["mode", "read"],
          ["lessonId", ""],
          ["page", "1"],
        ])
        
      }
    />
  );
};

export default LearnCore;
