import { getInfo } from "react-mediainfo"

export const getSimplifiedMediaInfo = async (file) => {
  const [overallTrack, _videoTrack, _audioTrack] =
    await getInfo(file).then((info) => info.media.track)

  const blobUrl = URL.createObjectURL(file)

  return {
    blobUrl,
    name: file.name,
    fileSize: file.size,
    fileSizeInMb: file.size / 1000 / 1000,
    duration: overallTrack.Duration,
    durationInMinutes: overallTrack.Duration / 60,
    format: overallTrack.Format,
    frameCount: overallTrack.FrameCount,
    frameRate: overallTrack.FrameRate,
  }
}
