const playbtn = document.querySelector(".play"),
  pausebtn = document.querySelector(".pause"),
  forward = document.querySelector(".forward"),
  back = document.querySelectorAll(".back")[1],
  prev_ep = document.querySelector(".previous-episode"),
  next_ep = document.querySelector(".next-episode"),
  total_time = document.querySelector("#total_time"),
  left_time = document.querySelector("#left"),
  audio = document.querySelector("audio"),
  episode_el = document.querySelector("#episode"),
  timeline = document.querySelector(".soundline"),
  volume_el = document.querySelector(".volume");

const play = () => {
  audio.play();
  pausebtn.classList.remove("hidden");
  playbtn.classList.add("hidden");
};

const pause = () => {
  audio.pause();
  playbtn.classList.remove("hidden");
  pausebtn.classList.add("hidden");
};

const getEpisode = (is_prev = false, is_next = false) => {
  let episode =
    +localStorage.getItem("episode") +
    (is_next === true ? 1 : "") -
    (is_prev === true ? 1 : "");
  if (episode > 1) {
  } else {
    episode = 1;
    localStorage.setItem("episode", "0001");
  }
  return episode.toString().padStart(4, "0");
};

const next_episode = () => {
  const episode = getEpisode(false, true);
  doShit(episode, true);
};

const prev_episode = () => {
  const episode = getEpisode(true);
  doShit(episode, true);
};

const changeCurrentTime = () => {
  const curr = audio.currentTime;
  console.log(curr);
  /*if (curr === audio.duration) {
	  next_episode();
  }*/
  if (curr !== 0) {
    left_time.innerHTML =
      Math.floor(curr / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      Math.floor(curr % 60)
        .toString()
        .padStart(2, "0");
    localStorage.setItem("current_time_" + getEpisode(), curr);
    timeline.style.setProperty(
      "--width",
      (audio.currentTime / audio.duration) * 100 + "%"
    );
  }
};

const changeVolumeEl = () => {
  const new_volume = audio.volume;
  localStorage.setItem("volume", new_volume);
  if (new_volume % 1 >= 0.05 && new_volume < 0.33) {
    volume_el.classList.remove("volume-max", "volume-min", "volume-muted");
    volume_el.classList.add("volume-none");
  } else if (new_volume > 0.33 && new_volume < 0.66) {
    volume_el.classList.remove("volume-max", "volume-none", "volume-muted");
    volume_el.classList.add("volume-min");
  } else if (new_volume > 0.66) {
    volume_el.classList.remove("volume-min", "volume-none", "volume-muted");
    volume_el.classList.add("volume-max");
  } else if (new_volume === 0) {
    volume_el.classList.remove("volume-min", "volume-none", "volume-max");
    volume_el.classList.add("volume-muted");
  }
  volume_el.setAttribute("title", new_volume);
};

const testFileExists = (src) => {
  var http = new XMLHttpRequest();

  http.open("HEAD", src, false);
  http.send();

  return http.status != 404;
};

const isFoundFile = (episode, reset = false) => {
  audio.src = `/src/${episode}.m4a`;
  episode_el.innerHTML = episode;
  document.title = "Toolroom Radio " + episode;
  audio.volume = +localStorage.getItem("volume") ?? 1;
  if (reset) {
    audio.currentTime = 0;
    audio.load();
    localStorage.setItem("episode", episode);
    episode_el.innerHTML = episode;
    document.title = "Toolroom Radio " + episode;
    if (playbtn.classList.contains("hidden")) {
      play();
    }
  }
  changeVolumeEl();
};

const doShit = (episode, reset) => {
  if (testFileExists(`/src/${episode}.m4a`)) {
    isFoundFile(episode, reset);
  } else {
    const swaltoast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
    });
    const toast = swaltoast.fire({
      icon: "info",
      title: "Downloading episode, please wait...",
    });
    axios.get(`/redirect.php?number=${episode}`).then(() => {
      toast.close();
      swaltoast
        .mixin({
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        })
        .fire({
          icon: "success",
          title: "Episode was downloaded",
        });
      isFoundFile(episode, reset);
    });
  }
};

const audioSet = () => {
  const duration = audio.duration;
  console.log(audio);
  total_time.innerHTML =
    Math.floor(duration / 60) + ":" + Math.floor(duration % 60);

  if (localStorage.getItem("current_time_" + getEpisode()) != undefined) {
    audio.currentTime = +localStorage.getItem("current_time_" + getEpisode());
    changeCurrentTime();
  } else {
    left_time.innerHTML = "00:00";
  }
};

window.onload = () => {
  const episode = getEpisode();
  doShit(episode);
};

audio.onloadedmetadata = () => {
  audioSet();
};

playbtn.addEventListener("click", () => {
  play();
});

pausebtn.addEventListener("click", () => {
  pause();
});

back.addEventListener("click", () => {
  audio.currentTime -= 10;
  changeCurrentTime();
});

forward.addEventListener("click", () => {
  console.log(audio.currentTime + 10);
  audio.currentTime += 10;
  console.log(audio.currentTime);
  changeCurrentTime();
});

next_ep.addEventListener("click", () => {
  next_episode();
});

prev_ep.addEventListener("click", () => {
  prev_episode();
});

document.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.code === "Space") {
    if (playbtn.classList.contains("hidden")) {
      pause();
    } else {
      play();
    }
  }
  if (event.code === "ArrowLeft") {
    audio.currentTime -= 10;
    changeCurrentTime();
  }
  if (event.code === "ArrowRight") {
    audio.currentTime += 10;
    changeCurrentTime();
  }
  if (event.code === "ArrowUp") {
    if (audio.volume < 1) {
      audio.volume = +(audio.volume + 0.05).toFixed(2);
      localStorage.setItem("volume", audio.volume);
      changeVolumeEl();
    }
  }
  if (event.code === "ArrowDown") {
    audio.volume = +(audio.volume - 0.05).toFixed(2);
    localStorage.setItem("volume", audio.volume);
    changeVolumeEl();
  }
});

setInterval(() => {
  changeCurrentTime();
}, 500);
