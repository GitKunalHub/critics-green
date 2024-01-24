async function query(dataCG) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dataCG),
    }
  );
  const result = await response.json();
  return result;
}

query({
  inputs: "",
}).then((response) => {
  const topResult = response[0][0]; // Extracting the top result
  console.log(JSON.stringify(topResult.label));
});
