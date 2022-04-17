import { BigPlayButton, Player } from "video-react"

import { useAppContext } from "../../context/AppContext"
import SourceMediaDropzone from "./SourceMediaDropzone"

import "./SourceMedia.css"

const SourceMedia = () => {
  const { mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  if (!blobUrl) return <SourceMediaDropzone />

  return (
    <div className="source-media--root">
      <Player src={blobUrl}>
        <BigPlayButton position="center" />
      </Player>
    </div>
  )
}

export default SourceMedia
