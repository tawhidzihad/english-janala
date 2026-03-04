const createElements = (arr) => {
  const htmlElemetns = arr.map(
    (el) => `<span class="btn btn-outline btn-info hover:text-white mb-1">${el}</span>`,
  );
  return htmlElemetns.join(" ");
};

//! get pronounce in sound 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices[10] //*Can change voices.
  utterance.lang = "en-EN"; //* Can change english accent.
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word_container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word_container").classList.remove("hidden");
  }
}

const loadlessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displaylessons(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson_btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((jsonFile) => {
      removeActive(); // remove all active button, byt calling functuion

      const clickBtn = document.getElementById(`lesson_btn_${id}`);
      clickBtn.classList.add("active"); // add active button now
      displayLevelWords(jsonFile.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();

  displayWordDetails(details.data);
};


const displayWordDetails = (word) => {
  const detailsBox = document.getElementById("details_container");
  detailsBox.innerHTML = `
    <div class="">
      <h2 class="text-2xl font-semibold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
    </div>

    <div class="">
      <h2 class="font-light">Meaning</h2>
      <p class="font_bangla font-medium text-2xl">${word.meaning}</p>
    </div>

    <div class="">
      <h2 class="font-semibold">Example</h2>
      <p>${word.sentence}</p>
    </div>

    <div class="space-y-1">
      <h2 class="font-semibold font_bangla">সমার্থক শব্দ গুলো</h2>
      <div class="">${createElements(word.synonyms)}</div>
    </div>
  `;

  document.getElementById("my_modal_5").showModal();
};


const displayLevelWords = (words) => {
  // * 1: get word container
  const wordContainer = document.getElementById("word_container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
      <div class="text-center col-span-full rounded-xl py-10 space-y-6">
        <img class="mx-auto" src="./assets/alert-error.png">
        <p class="text-gray-500 font_bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl font_bangla">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  // * 2: get every data one by one
  words.forEach((word) => {
    //* 3: create element
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
        
        <p class="font-semibold">Meaning / Pronounciation</p>

        <div class="text-2xl font-medium font_bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / 
        ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>

        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id})" class="btn btn-square bg-[#1A91FF20] hover:bg-[#1A91FF90]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="btn btn-square bg-[#1A91FF20] hover:bg-[#1A91FF90]"><i class="fa-solid fa-volume-high"></i></i></button>
        </div>
      </div>
    `;
    wordContainer.appendChild(card);
  });
  manageSpinner(false);
};


const displaylessons = (lessons) => {
  // * 1 Get container & empty innerHTML
  const levelContainer = document.getElementById("level_container");
  levelContainer.innerHTML = "";

  // * 2 Get every lesson
  for (let lesson of lessons) {
    // * 3 Create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson_btn_${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" 
            class="btn btn-outline btn-primary lesson_btn">
              <i class="fa-solid fa-book-open"></i>
            Lesson -${lesson.level_no} 
        </button>
    `;

    // * 4 Append button in main section
    levelContainer.appendChild(btnDiv);
  }
};

loadlessons();

document.getElementById("search_btn").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("search_input");
  const searchValue = input.value.trim().toLowerCase();

  if (searchValue.length > 0) {
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
      const allWords = data.data;
        
      const filterWords = allWords.filter((words) =>
        words.word.toLowerCase().includes(searchValue)
      );

      displayLevelWords(filterWords);
    });
  }
})
