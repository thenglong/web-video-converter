import { Loading } from "elementz"

import ConverterSetting from "./components/ConverterSetting/ConverterSetting"
import OutputMedia from "./components/OutputMedia/OutputMedia"
import SourceMedia from "./components/SourceMedia/SourceMedia"
import { useAppContext } from "./context/AppContext"

function App() {
  const {
    ffmpegWasm: { isLoading },
  } = useAppContext()

  if (isLoading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeContent: "center",
        }}
      >
        <Loading primary xl />
      </div>
    )

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr)",
        gridGap: "1rem",
      }}
    >
      <SourceMedia />
      <ConverterSetting />
      <OutputMedia />
    </div>
  )
}

export default App
