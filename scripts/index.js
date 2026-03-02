const loadlessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displaylessons(json.data));
};

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((jsonFile) => displayLevelWords(jsonFile.data));
};

const displayLevelWords = (words) => {
  // * 1: get word container
  const wordContainer = document.getElementById("word_container");
  wordContainer.innerHTML = "";

  // * 2: get every data one by one
  words.forEach((word) => {
    //* 3: create element
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl">${word.word}</h2>
        <p class="font-semibold">Meaning / Pronounciation</p>
        <div class="text-2xl font-medium font_bangla">"${word.meaning} / ${word.pronunciation}"</div>
        <div class="flex justify-between items-center">
          <button class="btn bg-[#1A91FF20] hover:bg-[#1A91FF90]"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-[#1A91FF20] hover:bg-[#1A91FF90]"><i class="fa-solid fa-volume-high"></i></i></button>
        </div>
      </div>
    `;
    wordContainer.appendChild(card);
  });
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
        <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>
            Lesson -${lesson.level_no} 
        </button>
    `;

    // * 4 Append button in main section
    levelContainer.appendChild(btnDiv);
  }
};

loadlessons();
