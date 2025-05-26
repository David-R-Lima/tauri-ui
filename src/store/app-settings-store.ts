import { Colors } from "@/enums/colors";
import { create } from "zustand";


interface ControlsState {
  color: Colors | undefined
  setColor: (color: Colors) => void
}

export const useAppSettingsStore = create<ControlsState>()((set) => ({
  color: localStorage.getItem("color") as Colors ?? Colors.blue,
  setColor: (color: Colors) => set({ color }),
}))