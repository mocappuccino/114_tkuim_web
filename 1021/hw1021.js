// --- 作業 1: 溫度轉換器 ---
//使用 prompt() 讀入溫度與單位（C 或 F）。
let tempInput = prompt("請輸入溫度數值 (例如: 25):");
let unitInput = prompt("請輸入單位 (C 或 F):");


let temp = parseFloat(tempInput);
let resultMessage = ""; 


if (unitInput.toUpperCase() === 'C') {
    // 攝氏轉華氏: F = C * 9 / 5 + 32
    let fahrenheit = (temp * 9 / 5) + 32;
    resultMessage = `${temp}°C 等於 ${fahrenheit.toFixed(2)}°F`;

} else if (unitInput.toUpperCase() === 'F') {
    // 華氏轉攝氏: C = (F - 32) * 5 / 9
    let celsius = (temp - 32) * 5 / 9;
    resultMessage = `${temp}°F 等於 ${celsius.toFixed(2)}°C`;

} else {
    resultMessage = "輸入的單位錯誤，請重新整理頁面並輸入 C 或 F。";
}

//結果以 alert() 與頁面 <pre> 顯示
alert(resultMessage);
document.getElementById('temp-output').textContent = resultMessage;


// --- 作業 2: 猜數字遊戲 ---
//電腦隨機產生 1–100
const targetNumber = Math.floor(Math.random() * 100) + 1;

let guessCount = 0;      
let isCorrect = false;   

alert("開始猜數字遊戲！ (1-100)");

//使用 prompt() 讓使用者輸入數字，提示「再大一點 / 再小一點」。
while (isCorrect === false) {
    let userInput = prompt("請猜一個 1 到 100 之間的數字：");
    let userGuess = parseInt(userInput);

    guessCount++;

    if (userGuess < targetNumber) {
        alert("再大一點！");

    } else if (userGuess > targetNumber) {
        alert("再小一點！");

    } else if (userGuess === targetNumber) {
        
        isCorrect = true;
        
        let finalMessage = `恭喜猜中！答案就是 ${targetNumber}。
            您總共猜了 ${guessCount} 次。`;
        
        alert(finalMessage);
        document.getElementById('guess-output').textContent = finalMessage;
    
    } else {
        alert("請輸入有效的數字。");
        guessCount--;
    }
}