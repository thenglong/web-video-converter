import { Replay } from "vimond-replay"

import { useAppContext } from "../../context/AppContext"
import SourceMediaDropzone from "./SourceMediaDropzone"

import "./SourceMedia.css"

const SourceMedia = () => {
  const { mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  if (!blobUrl) return <SourceMediaDropzone />

  return (
    <div className="source-media--root">
      <Replay
        source={blobUrl}
        initialPlaybackProps={{ isPaused: true }}
      />
    </div>
  )
}

export default SourceMedia
