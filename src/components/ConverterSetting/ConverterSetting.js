import { Group, Select } from "elementz"
import "./ConverterSetting.css"

const options = [
  { value: "mp4", label: "MP4" },
  { value: "mp3", label: "MP3" },
  { value: "mkv", label: "MKV" },
  { value: "webm", label: "WebM" },
]

const ConverterSetting = () => {
  return (
    <Group space className="mt-20" ns>
      <Select.Nice sm primary active>
        {options.map((option) => (
          <Select.Option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select.Nice>
    </Group>
  )
}

export default ConverterSetting
