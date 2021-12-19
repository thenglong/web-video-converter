import React, { useState, useEffect } from "react";
import "./App.css";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({
  log: true,
  corePath: `${process.env.PUBLIC_URL}/ffmpeg-core.js`,
});

function App() {
  console.log(process.env.PUBLIC_URL);

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [percentage, setPercentage] = useState(0);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  console.log(percentage);

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    // start timer
    const start = new Date().getTime();

    const inMemoryFilename = `working-${video.name}`;

    // Write the file to memory
    ffmpeg.FS("writeFile", inMemoryFilename, await fetchFile(video));

    ffmpeg.setProgress(p => {
      setPercentage(p.ratio * 100);
    });

    console.log(inMemoryFilename);

    // Run the FFMpeg command
    // await ffmpeg.run('-i', inMemoryFilename, '-t', '20.5', '-ss', '2.0', '-f', 'mp4', 'out.mp4');
    await ffmpeg.run("-i", inMemoryFilename, "out.mp4");

    // Read the result
    const data = ffmpeg.FS("readFile", "out.mp4");

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    setGif(url);

    // unlink file
    ffmpeg.FS("unlink", inMemoryFilename);

    // end timer
    const end = new Date().getTime();
    const time = end - start;
    console.log(time / 1000 / 60 + "minutes");
  };

  return ready ? (
    <div className="App">
      {video && <video controls width="250" src={URL.createObjectURL(video)} />}

      <input type="file" onChange={e => setVideo(e.target.files?.item(0))} />

      <h3>Results</h3>
      <button onClick={convertToGif}>Convert</button>

      {/* { gif && <img src={gif} width="250" />} */}
      {gif && <video controls width="250" src={gif} />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
