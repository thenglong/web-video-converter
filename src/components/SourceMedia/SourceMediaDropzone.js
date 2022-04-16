import classnames from "classnames"
import { Button } from "elementz"

import { useAppContext } from "../../context/AppContext"

import "./SourceMediaDropzone.css"

const SourceMediaDropzone = () => {
  const { mediaSrcDropzone } = useAppContext()

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open: openFileDialog,
  } = mediaSrcDropzone || {}

  return (
    <div
      {...getRootProps()}
      className={classnames("source-root", {
        "source-root--active": isDragAccept,
        "source-root--rejected": isDragReject,
      })}
    >
      <input {...getInputProps()} />

      {isDragAccept && <p>Drop here</p>}
      {isDragReject && <p>Unsupported file</p>}

      {!isDragActive && (
        <>
          <Button onClick={openFileDialog} primary>
            Browse Video
          </Button>
          <p>
            Drag and drop video file here, or click to
            select a file
          </p>
        </>
      )}
    </div>
  )
}

export default SourceMediaDropzone
