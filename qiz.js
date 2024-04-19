"use strict"

// 基本データ

// 地理のクイズデータ
const data = [
    {
        question: "日本で一番面積の大きい都道府県は？",
        answers: ["北海道", "岩手県", "沖縄県", "東京都"],
        correct: "北海道"
    },
    {
        question: "日本で一番人口の多い都道府県は？",
        answers: ["北海道", "岩手県", "沖縄県", "東京都"],
        correct: "東京都"
    },
    {
        question: "岩手県はどれ？",
        answers: ["北海道", "岩手県", "沖縄県", "東京都"],
        correct: "岩手県"
    },
];


// 出題する問題集
const QUESTION_LENGTH = 3;
// time/ms
const answer_time_ms = 10000;
const interval_time_ms = 10;
// 出題する問題データ
// slice 指定した範囲で値を切り取って代入
// let questions = data.slice(0, QUESTION_LENGTH)
let questions = getRandomQuestions();
// 出題する問題のインデックス
let questionIndex = 0;
// 正解数
let correctCount = 0;

let intercalId = null;
// 経過時間
let elapsedTime = 0;




// 要素一覧


const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");

const startbtn = document.getElementById("startbtn");

const questionNumber = document.getElementById("questionNumber");
let questionText = document.getElementById("questionText");
const optionbtn = document.querySelectorAll("#questionPage button");
const questionProgress = document.getElementById("questionProgress");

let resultMsg = document.getElementById("resultMessege");
const backbtn = document.getElementById("backBtn");

const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");

let startTime = null;


// 処理

startbtn.addEventListener("click", clickStartBtn);

optionbtn.forEach((button) => {
    button.addEventListener("click", clickOptionBtn);
});


nextButton.addEventListener("click", clickNextBtn);

backbtn.addEventListener("click", clickBackBtn);
// 関数一覧

function questionTimeOver() {
    questionResult.innerText = "x"
    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";

    } else {
        nextButton.innerText = "つぎのもんだいへ"
    }
    dialog.showModal();
}



function isQuestionEnd() {
    // 問題が最後かどうかを判定する
    return questionIndex + 1 === QUESTION_LENGTH;
}

function getRandomQuestions() {
    // 出題する問題リスト
    const questionIndexList = [];
    while (questionIndexList.length !== QUESTION_LENGTH) {
        // 生成,data.lengthが上限
        const index = Math.floor(Math.random() * data.length);
        // インデックスリストにあるかないかif,なかったら追加
        if (!questionIndexList.includes(index)) {
            questionIndexList.push(index);
        }
    }
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}

function setResult() {
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    // 正解率を表示
    resultMsg.innerText = `正解率:${accuracy}%`;
}

function setQuestion() {
    // 問題取得
    const question = questions[questionIndex];
    // 問題番号の表示
    questionNumber.innerText = `第  ${questionIndex + 1} 問`;
    // 問題文表示
    questionText.innerText = question.question;
    // 選択肢を表示
    for (let i = 0; i < optionbtn.length; i++) {
        optionbtn[i].innerText = question.answers[i];
    }
}



// イベント関係の関数一覧
function clickOptionBtn(event) {
    stopPrpgress();
    // 全ての選択肢を無効化する
    optionbtn.forEach((button) => {
        button.setAttribute("disabled", "disabled");
    });

    const optiontext = event.target.innerText;

    const correcttext = questions[questionIndex].correct;

    if (optiontext === correcttext) {
        correctCount++;
        questionResult.innerText = "○";

    } else {
        questionResult.innerText = "×";
    }

    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }
    dialog.showModal();

}

function clickStartBtn() {
    reset();
    setQuestion();
    // startProgress();
    // 画面に入るちょくぜんにけす
    startProgress();
    // スタート画面を非表示にする
    startPage.classList.add("hidden");
    // 問題画面を表示する
    questionPage.classList.remove("hidden");
    // 結果画面を非表示にする
    resultPage.classList.add("hidden");
}

function clickNextBtn() {

    if (isQuestionEnd()) {
        setResult();
        dialog.close();
        startPage.classList.add("hidden");
        questionPage.classList.add("hidden");
        resultPage.classList.remove("hidden");
    } else {
        questionIndex++;
        setQuestion();
        intercalId = null;
        elapsedTime = 0;
        for (let i = 0; i < optionbtn.length; i++) {
            optionbtn[i].removeAttribute("disabled")
        }
    }
    dialog.close();
    startProgress();

}

function clickBackBtn() {
    startPage.classList.remove("hidden");
    questionPage.classList.add("hidden");
    resultPage.classList.add("hidden");
}
function startProgress() {
    startTime = Date.now();

    intercalId = setInterval(() => {
        const currentTome = Date.now();
        const progress = ((currentTome - startTime) / answer_time_ms) * 100;

        questionProgress.value = progress;
        if (startTime + answer_time_ms <= currentTome) {
            stopPrpgress();
            questionTimeOver();
            return;
        }
        // elapsedTime +=interval_time_ms;
    }, interval_time_ms);
    // intercalId= setInterval(() => {
    //     const progress = (elapsedTime/answer_time_ms)*100;
    //     questionProgress.value=progress;
    //     if(answer_time_ms <= elapsedTime){
    //         stopPrpgress();
    //         return;
    //     }
    //     elapsedTime +=interval_time_ms;
    // }, interval_time_ms);
}



function stopPrpgress() {
    if (intercalId !== null) {
        clearInterval(intercalId);
        intercalId = null;
    }
}


function reset() {
    questions = getRandomQuestions();
    questionIndex = 0;
    correctCount = 0;
     intercalId = null;
     elapsedTime = 0;
    for (let i = 0; i < optionbtn.length; i++) {
        optionbtn[i].removeAttribute("disabled");
    }
}