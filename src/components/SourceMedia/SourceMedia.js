import { BigPlayButton, Player } from "video-react"

import { useAppContext } from "../../context/AppContext"
import SourceMediaDropzone from "./SourceMediaDropzone"

import "./SourceMedia.css"

const SourceMedia = () => {
  const { mediaSrc } = useAppContext()
  const { blobUrl } = mediaSrc.info || {}

  if (!blobUrl) return <SourceMediaDropzone />

  return (
    <div style={{ width: "100%" }}>
      <Player src={blobUrl}>
        <BigPlayButton position="center" />
      </Player>
      <pre>
        {/*{mediaSrc.info &&*/}
        {/*  JSON.stringify(mediaSrc.info, null, 2)}*/}
      </pre>
    </div>
  )
}

export default SourceMedia
