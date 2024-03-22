const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient({
  keyFilename: "./key.json",
});

async function speechToText(audioData, languageCode) {
  try {
    // Don't need this line anymore (not encoded to base64 for HTTP transmission)
    // const audioBytes = Buffer.from(audioData, "base64");

    const audio = {
      content: audioData,
    };
    const config = {
      languageCode: languageCode,
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcripts = response.results.map(
      (result) => result.alternatives[0].transcript
    );
    console.log(transcripts);
    return transcripts;
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}
function transcribeGujarati(audioData) {
  return speechToText(audioData, "gu-IN");
}

function transcribeEnglish(audioData) {
  return speechToText(audioData, "en-GB");
}

module.exports = {
  transcribeGujarati,
  transcribeEnglish,
};
