import { Button, Group, Select } from "elementz"

import "./ConverterSetting.css"
import {
  useAppContext,
  videoTypeOptions,
} from "../../context/AppContext"
import Progress from "../Progress"

const ConverterSetting = () => {
  const {
    mediaSrc,
    mediaSrcDropzone,
    setOutputType,
    convert,
    convertOptions,
    convertProgress: { isConverting, percentage },
  } = useAppContext()

  const { open: openFileDialog } = mediaSrcDropzone || {}

  const shouldDisableConvert =
    !mediaSrc.file || isConverting

  return (
    <Group
      space
      vertical
      full
      style={{ justifyContent: "center" }}
    >
      <Select.Nice
        md
        primary
        active
        full
        onChange={(value) => setOutputType(value)}
        value={convertOptions.type}
      >
        {videoTypeOptions.map((option) => (
          <Select.Option
            selected={option.value === convertOptions.type}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select.Nice>

      {mediaSrc.file && (
        <Button primary md onClick={openFileDialog}>
          Change Source
        </Button>
      )}

      <Button
        disabled={shouldDisableConvert}
        secondary
        md
        onClick={convert}
      >
        Convert
      </Button>

      <Progress
        precentage={percentage}
        style={{
          width: 175,
          height: 175,
          alignSelf: "center",
        }}
      />
    </Group>
  )
}

export default ConverterSetting
