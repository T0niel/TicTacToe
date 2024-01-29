const playContainer = document.querySelector(".play-container");
const alertParagraph = document.querySelector(".alert");
const playbtn = document.querySelector(".play-btn");
const pickContainer = document.querySelector(".pick-container");
const resetBtn = document.querySelector(".reset-btn");
const playerScore = document.querySelector(".player-score");
const botScore = document.querySelector(".bot-score");

const start = function (row, col) {
    playContainer.style.cssText = `grid-template-columns: repeat(${col}, 1fr); grid-template-rows: repeat(${row}, 1fr)`;
    let board = Board(row, col);
    const initalizeSquares = (
        () => {
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    const div = document.createElement("div");
                    div.classList.add("square");
                    div.setAttribute("data-row", `${i}`);
                    div.setAttribute("data-col", `${j}`);
                    playContainer.appendChild(div);
                }
            }
        })()

    const squares = document.querySelectorAll(".square");

    function print() {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                const correspondingSquare = document.querySelector(`div[data-row="${i}"][data-col="${j}"]`);
                correspondingSquare.textContent = (board.squares[i][j].type === 1 ? "X" : board.squares[i][j].type === 2 ? "O" : "");
            }
        }
    }

    if (!board.playerFirst) {
        board.bot.play();
        print();
    }

    //returns true if we are still playing
    function evaluatePosition() {
        if (board.playerWon()) {
            alert("You won");
            let clickEvent = new MouseEvent("click");
            resetBtn.dispatchEvent(clickEvent);
            playerScore.textContent = playerScore.textContent.split(' ')[0] + " " + (+playerScore.textContent.split(' ')[1] + 1);
            return false;
        }
        else if (board.botWon()) {
            alert("You lost!");
            let clickEvent = new MouseEvent("click");
            resetBtn.dispatchEvent(clickEvent);
            botScore.textContent = botScore.textContent.split(' ')[0] + " " + (+botScore.textContent.split(' ')[1] + 1);
            return false;
        }
        else if (board.draw()) {
            alert("Draw!");
            let clickEvent = new MouseEvent("click");
            resetBtn.dispatchEvent(clickEvent);
            return false;
        }

        return true;
    }

    squares.forEach(square => square.addEventListener("click", (e) => {
        const playRow = e.target.getAttribute("data-row");
        const playCol = e.target.getAttribute("data-col");

        if (!board.playAt(+playRow, +playCol)) {
            alertParagraph.textContent = "Cannot move there!";
        } else {
            //if we clicked somewere wrong before then display that to none
            if (alertParagraph.textContent.length > 0) {
                alertParagraph.textContent = "";
            }

            print();
            if (evaluatePosition()) {
                board.bot.play();
                print();
                evaluatePosition();
            }
        }
    }))

};

function resetSquares() {
    const squares = document.querySelectorAll(".square");

    squares.forEach(square => {
        playContainer.removeChild(square);
    });
}

pickContainer.style.display = "none";

playbtn.addEventListener("click", () => {
    if (pickContainer.style.display === "none") {
        pickContainer.style.display = "flex";
    } else {
        pickContainer.style.display = "none";
    }
});

function resetBtnOnClick(row, col) {
    return () => {
        resetSquares();
        start(row, col);
        start.print();
    }
}

function askUserIfResetGame(row, col) {
    const proceed = confirm("This will reset the game are you sure?");

    if (proceed) {
        resetSquares();
        start(row, col);
        resetBtn.addEventListener("click", resetBtnOnClick(row, col));
        pickContainer.style.display = "none";
    }
}

pickContainer.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "3x3":
            askUserIfResetGame(3, 3);
            break;
        case "6x6":
            askUserIfResetGame(6, 6);
            break;
        case "9x9":
            askUserIfResetGame(9, 9);
            break;
    }
})

resetBtn.addEventListener("click", resetBtnOnClick(3, 3));

start(3, 3);
