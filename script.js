console.log("Linked");
let CurrentSong = new Audio();

function convertSecondsToMinutes(seconds) {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds to always have two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Combine minutes and seconds in MM:SS format
  return `${formattedMinutes}:${formattedSeconds}`;
}




async function GetSongs() {
  // fetching songs from api
  let songs = await fetch("http://127.0.0.1:5500/songs/");
  let response = await songs.text();
  // console.log(response);

  // creating a div and storing response inside so that we can get our songs link from the response output.
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  console.log(as);

  // getting songs link from response and pushing in songsfolder array.
  let songsfolder = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songsfolder.push(element.href.split("/songs/")[1]);
    }
  }
  return songsfolder;
}

//playing songs using JS.
const playMusic = (track) => {
  CurrentSong.src = "/Songs/" + track;
  CurrentSong.play();
  Play.src = "/Assets/pause.svg";
};

async function playSongs() {
  let songs = await GetSongs();
  console.log(songs);

  // adding song list in the library
  let songList = document
    .querySelector(".songslist")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songList.innerHTML =
      songList.innerHTML +
      `<li class = "LibrarySongsList">
            <img src="/Assets/song.svg" alt="song">
            <div class="songName">${song.replaceAll("%20", " ")}</div>
            <img src="/Assets/play.svg" alt="play">
        </li>`;
  }

  // adding song in the popular albums
  let rightBottom = document.querySelector(".RightBottom");
  for (const song of songs) {
    let p = document.createElement("p");
    p.textContent = song.replaceAll("%20", " ");

    let albumCard = document.createElement("div");
    albumCard.className = "albumcard";

    let img = document.createElement("img");
    img.src = "/Assets/card.jfif";
    img.alt = "albumPhoto";

    albumCard.appendChild(img);
    albumCard.appendChild(p);

    albumCard.addEventListener("click", () => {
      playMusic(song);
      document.querySelector(".DisplaySongName").innerHTML = song.replaceAll(
        "%20",
        " "
      );
    });

    rightBottom.appendChild(albumCard);
  }

  // adding click eventlistener so that on your click music get started
  Array.from(
    document.querySelector(".listss").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".songName").innerHTML.trim());

      playMusic(e.querySelector(".songName").innerHTML.trim());

      document.querySelector(".DisplaySongName").innerHTML = `${e
        .querySelector(".songName")
        .innerHTML.trim()}`;
    });
  });

  // adding event listener to play
  Play.addEventListener("click", () => {
    if (CurrentSong.paused) {
      CurrentSong.play();
      Play.src = "/Assets/pause.svg";
    } else {
      CurrentSong.pause();
      Play.src = "/Assets/play.svg";
    }
  });

  // adding time & duration function
  CurrentSong.addEventListener("timeupdate", () => {
    // console.log(CurrentSong.currentTime,CurrentSong.duration);
    document.querySelector(
      ".DisplaySongTime"
    ).innerHTML = `${convertSecondsToMinutes(
      CurrentSong.currentTime
    )} : ${convertSecondsToMinutes(CurrentSong.duration)}`;

    // making SeekSongBar working so that it moves as per the song
    document.querySelector(".SeekSongBar").style.left =
      (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
  });

  // adding a event litener to seekbar so that we can play song from where time we want
  document.querySelector(".SongBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".SeekSongBar").style.left = percent + "%";
    CurrentSong.currentTime = (CurrentSong.duration * percent) / 100;
  });

  let currentIndex = 0;
  const updateSongDisplay = (song) => {
    document.querySelector('.DisplaySongName').innerHTML = song.replaceAll("%20", " ");
  };
  
  const updateSongTime = () => {
    document.querySelector('.DisplaySongTime').innerHTML = `${convertSecondsToMinutes(CurrentSong.currentTime)} : ${convertSecondsToMinutes(CurrentSong.duration)}`;
    document.querySelector('.SeekSongBar').style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + '%';
  };
  
  const playNextSong = () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playMusic(songs[currentIndex]);
    updateSongDisplay(songs[currentIndex]);
    updateSongTime();
  };
  
  const playPreviousSong = () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playMusic(songs[currentIndex]);
    updateSongDisplay(songs[currentIndex]);
    updateSongTime();
  };

  const nextButton = document.querySelector("#Next");
  if (nextButton) {
    nextButton.addEventListener("click", playNextSong);
  }

  const previousButton = document.querySelector("#Previous");
  if (previousButton) {
    previousButton.addEventListener("click", playPreviousSong);
  }

  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', (e) => {
    CurrentSong.volume = e.target.value;
  });
}

playSongs();
