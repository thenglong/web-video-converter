import { useCallback } from "react"

import { Button } from "elementz"
import { useDropzone } from "react-dropzone"

import "./SourceMedia.css"

const SourceMedia = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, accept: "video/*" })

  return (
    <div {...getRootProps()} className="source-root">
      <input {...getInputProps()} />

      {isDragReject && "REjected"}

      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>
          Drag and drop some files here, or click to select
          files
        </p>
      )}
    </div>
  )
}

export default SourceMedia
