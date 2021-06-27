let questions = new Array();
let timeLimit = 10;

function loadQuestions() {
    $.getJSON('questions.json', function (data) {
        questions = data[0];
        timeLimit = data[1][0]["Time limit"];
    })
}
loadQuestions();
let answers = [];
let totalScore = 0;
let qNo = 1;
selection();

let nextBtn = document.querySelector(".next-btn");
nextBtn.addEventListener('click', function (e) {
    answers[qNo] = "Not Answered";
    qNo++;
    changeQues();
});

function changeQues() {
    let quiz = document.querySelector(".quiz");

    if (qNo > questions.length) {
        clearInterval(timerInterval);
        document.querySelector(".modal-title").innerText="Quiz over";
        nextBtn.innerText = "Submit";
        nextBtn.setAttribute('data-bs-toggle','modal');
        nextBtn.setAttribute('data-bs-target','#staticBackdrop');
        nextBtn.click();
        return;
    }
    quiz.innerHTML = `<div class="question">
                             ${questions[qNo - 1]["Question"]}
                         </div>
                         <div class="answers">
                             <ul>
                                 <li class="options">${questions[qNo - 1]["Option1"]}</li>
                                 <li class="options">${questions[qNo - 1]["Option2"]}</li>
                                 <li class="options">${questions[qNo - 1]["Option3"]}</li>
                                 <li class="options">${questions[qNo - 1]["Option4"]}</li>
                             </ul>
                         </div>`;
    if (qNo == questions.length) {
        nextBtn.innerText = "Submit";
        nextBtn.setAttribute('data-bs-toggle','modal');
        nextBtn.setAttribute('data-bs-target','#staticBackdrop');
        document.querySelector(".modal-title").innerText="Quiz over";

    }

    let headerText = document.querySelector(".header-text");
    headerText.innerHTML = `Question ${qNo}`;
    selection();
}


function result() {
    let body = document.querySelector("body");
    let res = ``;
    for (let i = 0; i < questions.length; i++) {
        let correctOption = questions[i]["Answer"];
        let str = ``;

        if (questions[i][correctOption].trim() == answers[i + 1].trim()) {
            str = `<tr>
            <td><span class="material-icons signs-right">
            check
            </span>${questions[i]["Question"]}</td>
            <td>${answers[i + 1]}</td>
            <td>${questions[i][correctOption]} 
            </td>
          </tr>`
        }
        else {
            str = `<tr>
            <td><span class="material-icons signs-wrong">
            clear
            </span>${questions[i]["Question"]}</td>
            <td>${answers[i + 1]}</td>
            <td>${questions[i][correctOption]}
            </td>
          </tr>`
        }
        res = res + str + "\n";
    }
    body.style.backgroundColor = "white";
    body.style.overflowY = "scroll";

    body.innerHTML = `<div class="result-container">
    <div class="heading">
        <h1>Its result time!!!</h1>
    </div>
    <div class="container">
    <div class="result-aux">
    <div class="final-score">Final Score: ${totalScore}/${questions.length}</div>
    <button onClick="restartQuiz()" class="another">Home</button>
    </div>
        <table class="table ">
            <thead class="table-info">
              <tr>
                <!-- <th scope="col">#</th> -->
                <th scope="col">Question</th>
                <th scope="col">Your Response</th>
                <th scope="col">Correct Response</th>
              </tr>
            </thead>
            <tbody>
                ${res}
            </tbody>
          </table>
    </div>
</div>`;
}

function restartQuiz() {
    location.assign("registeration.html");
}

function endQuiz() {
    clearInterval(timerInterval);
    for (let i = qNo; i <= questions.length; i++) {
        answers[i] = "Not Answered";
    }
    result();
}


function selection() {
    let options = document.querySelectorAll(".options");

    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener('click', function (e) {
            let ans = e.currentTarget.innerText;
            let actualOption = questions[qNo - 1]["Answer"];
            let actualAns = questions[qNo - 1][actualOption];
            if (ans.trim() == actualAns.trim()) {
                totalScore++;
            }
            answers[qNo] = ans;
            qNo++;
            changeQues();

        })
    }
}

let timePassed = 0;
let timeLeft = timeLimit;

function formatTimeLeft(time) {
    const minutes = Math.floor(time / 60);

    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}


let timerInterval = null;

function startTimer() {
    timerInterval = setInterval(() => {

        timePassed = timePassed += 1;
        if (timeLeft == 0) {
            clearInterval(timerInterval);
            document.querySelector(".modal-title").innerText="Time is up";
            nextBtn.innerText = "Submit";
            nextBtn.setAttribute('data-bs-toggle','modal');
            nextBtn.setAttribute('data-bs-target','#staticBackdrop');
            nextBtn.click();
            return;
        }
        timeLeft = timeLimit - timePassed;
        document.querySelector(".time").innerText = formatTimeLeft(timeLeft);
    }, 1000);
}

startTimer();