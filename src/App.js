import { Loading } from "elementz"

import ConverterSetting from "./components/ConverterSetting/ConverterSetting"
import OutputMedia from "./components/OutputMedia/OutputMedia"
import SourceMedia from "./components/SourceMedia/SourceMedia"
import { useAppContext } from "./context/AppContext"

import "./App.css"

function App() {
  const {
    ffmpegWasm: { isLoading },
  } = useAppContext()

  if (isLoading)
    return (
      <div className="app--loading-fullscreen">
        <Loading primary xl />
      </div>
    )

  return (
    <div className="app-wrapper">
      <SourceMedia />
      <ConverterSetting />
      <OutputMedia />
    </div>
  )
}

export default App
