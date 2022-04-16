import "./OutputMedia.css"
import { BigPlayButton, Player } from "video-react"

import { useAppContext } from "../../context/AppContext"

const OutputMedia = () => {
  const { mediaOutput } = useAppContext()

  const { blobUrl } = mediaOutput.info || {}
  return (
    <div className="output-root">
      {blobUrl ? (
        <Player src={blobUrl}>
          <BigPlayButton position="center" />
        </Player>
      ) : (
        "Waiting for conversion..."
      )}
    </div>
  )
}

export default OutputMedia
