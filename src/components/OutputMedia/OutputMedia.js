import { Replay } from "vimond-replay"

import { useAppContext } from "../../context/AppContext"

import "./OutputMedia.css"

const OutputMedia = () => {
  const { mediaOutput } = useAppContext()

  const { blobUrl } = mediaOutput.info || {}
  return (
    <div className="output-root">
      {blobUrl ? (
        <Replay
          source={blobUrl}
          initialPlaybackProps={{ isPaused: true }}
        />
      ) : (
        "Waiting for conversion..."
      )}
    </div>
  )
}

export default OutputMedia
