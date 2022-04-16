import { atom } from "recoil"

const mediaSourceState = atom({
  key: "mediaSourceState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
})
