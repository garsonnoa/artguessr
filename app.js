const artwork = {
  title: "Starry Night",
  artist: "Vincent van Gogh",
  image: "starry_night.jpg"
};

function submitGuess() {
  const input = document.getElementById("guessInput").value.toLowerCase();
  const result = document.getElementById("result");

  const title = artwork.title.toLowerCase();
  const artist = artwork.artist.toLowerCase();

  const titleCorrect = input.includes(title);
  const artistCorrect = input.includes(artist);

  if (titleCorrect && artistCorrect) {
    result.textContent = "Correct! 🎉";
    document.getElementById("art").style.filter = "brightness(1)";
  } 
  else if (titleCorrect || artistCorrect) {
    result.textContent = "Partially correct (one of them is right)";
    document.getElementById("art").style.filter = "brightness(0.3)";
  } 
  else {
    result.textContent = "Wrong ❌";
  }
}
