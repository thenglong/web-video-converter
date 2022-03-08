import { useMemo, useState } from "react"

import { fetchFile } from "@ffmpeg/ffmpeg"

import ConverterSetting from "./components/ConverterSetting/ConverterSetting"
import OutputMedia from "./components/OutputMedia/OutputMedia"
import Progress from "./components/Progress"
import SourceMedia from "./components/SourceMedia/SourceMedia"
import { useAppContext } from "./context/AppContext"

const options = [
  { value: "mp4", label: "MP4" },
  { value: "mp3", label: "MP3" },
  { value: "mkv", label: "MKV" },
  { value: "webm", label: "WebM" },
]

function App() {
  const [input, setInput] = useState()
  const [output, setOutput] = useState()
  const [percentage, setPercentage] = useState(0)
  const [selectedType, setSelectedType] = useState(
    options[0]
  )

  const { ffmpeg } = useAppContext()

  const convertToGif = async () => {
    // start timer
    const start = new Date().getTime()

    const inMemoryFilename = `working-${input.name}`

    // Write the file to memory
    ffmpeg.FS(
      "writeFile",
      inMemoryFilename,
      await fetchFile(input)
    )

    ffmpeg.setProgress((p) => {
      setPercentage(p.ratio * 100)
    })

    // Run the FFMpeg command
    // await ffmpeg.run('-i', inMemoryFilename, '-t', '20.5', '-ss', '2.0', '-f', 'mp4', 'out.mp4');
    await ffmpeg.run(
      "-i",
      inMemoryFilename,
      `out.${selectedType.value}`
    )

    // Read the result
    const data = ffmpeg.FS(
      "readFile",
      `out.${selectedType.value}`
    )

    // Create a URL and set output
    setOutput(
      new Blob([data.buffer], {
        type: `video/${selectedType.value}`,
      })
    )

    // unlink file
    ffmpeg.FS("unlink", inMemoryFilename)

    // end timer
    const end = new Date().getTime()
    const time = end - start
    console.log(time / 1000 / 60 + "minutes")
  }

  const inputObjectUrl = useMemo(() => {
    if (input) {
      return URL.createObjectURL(input)
    }
  }, [input])

  const outputObjectUrl = useMemo(() => {
    if (output) {
      return URL.createObjectURL(output)
    }
  }, [output])

  return (
    <div
      style={{
        width: "100%",
        background: "gray",
        display: "flex",
      }}
    >
      <SourceMedia />
      <ConverterSetting />
      <OutputMedia />
    </div>
  )

  // eslint-disable-next-line no-unreachable
  // return ready ? (
  //   <div className="App">
  //     {inputObjectUrl && (
  //       <ReactPlayer url={inputObjectUrl} controls />
  //     )}
  //
  //     <Select
  //       options={options}
  //       onChange={setSelectedType}
  //       defaultValue={options[0]}
  //     />
  //
  //     <input
  //       type="file"
  //       onChange={(e) => setInput(e.target.files?.item(0))}
  //       accept="image/*, audio/*, video/*"
  //     />
  //
  //     <h3>Results</h3>
  //     <button
  //       className="button-primary"
  //       onClick={convertToGif}
  //     >
  //       Convert
  //     </button>
  //
  //     {outputObjectUrl && (
  //       <ReactPlayer url={outputObjectUrl} controls />
  //     )}
  //     <Progress precentage={percentage} />
  //   </div>
  // ) : (
  //   <p>Loading...</p>
  // )
}

export default App
