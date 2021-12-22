import React, { useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import Select from "react-select";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Progress from "./components/Progress";
const ffmpeg = createFFmpeg({
  log: true,
  corePath: `${process.env.PUBLIC_URL}/ffmpeg-core.js`,
});

const options = [
  { value: "mp4", label: "MP4" },
  { value: "mp3", label: "MP3" },
  { value: "mkv", label: "MKV" },
];

function App() {
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState();
  const [output, setOutput] = useState();
  const [percentage, setPercentage] = useState(0);
  const [selectedType, setSelectedType] = useState(options[0]);

  useEffect(() => {
    const load = async () => {
      await ffmpeg.load();
      setReady(true);
    };

    load();
  }, []);

  const convertToGif = async () => {
    // start timer
    const start = new Date().getTime();

    const inMemoryFilename = `working-${input.name}`;

    // Write the file to memory
    ffmpeg.FS("writeFile", inMemoryFilename, await fetchFile(input));

    ffmpeg.setProgress(p => {
      setPercentage(p.ratio * 100);
    });

    console.log(inMemoryFilename);

    // Run the FFMpeg command
    // await ffmpeg.run('-i', inMemoryFilename, '-t', '20.5', '-ss', '2.0', '-f', 'mp4', 'out.mp4');
    await ffmpeg.run("-i", inMemoryFilename, `out.${selectedType.value}`);

    // Read the result
    const data = ffmpeg.FS("readFile", `out.${selectedType.value}`);

    // Create a URL and set output
    setOutput(new Blob([data.buffer], { type: `video/${selectedType.value}` }));

    // unlink file
    ffmpeg.FS("unlink", inMemoryFilename);

    // end timer
    const end = new Date().getTime();
    const time = end - start;
    console.log(time / 1000 / 60 + "minutes");
  };

  const inputObjectUrl = useMemo(() => {
    if (input) {
      return URL.createObjectURL(input);
    }
  }, [input]);

  const outputObjectUrl = useMemo(() => {
    if (output) {
      return URL.createObjectURL(output);
    }
  }, [output]);

  return ready ? (
    <div className="App">
      {inputObjectUrl && <ReactPlayer url={inputObjectUrl} controls />}

      <Select
        options={options}
        onChange={setSelectedType}
        defaultValue={options[0]}
      />

      <input
        type="file"
        onChange={e => setInput(e.target.files?.item(0))}
        accept="image/*, audio/*, video/*"
      />

      <h3>Results</h3>
      <button className="button-primary" onClick={convertToGif}>
        Convert
      </button>

      {/* { gif && <img src={gif} width="250" />} */}
      {outputObjectUrl && <ReactPlayer url={outputObjectUrl} controls />}
      <Progress precentage={percentage} />
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
