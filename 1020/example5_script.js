// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var output = '';
for (var i = 1; i <= 9; i++) {
  for (var j = 1; j <= 9; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}
document.getElementById('result').textContent = output;
//讓使用者輸入要顯示的乘法範圍（例如 2 到 5）。
var start = parseInt(prompt("請輸入乘法表的起始數字（1-9）："), 10);
var end = parseInt(prompt("請輸入乘法表的結束數字（1-9）："), 10);
if (isNaN(start) || isNaN(end) || start < 1 || end > 9 || start > end) {
  alert("輸入無效，請輸入1到9之間的數字，且起始數字應小於或等於結束數字。");
}
else {
  output = '';
    for (var i = start; i <= end; i++) {
        for (var j = 1; j <= 9; j++) {
            output += i + 'x' + j + '=' + (i * j) + '\t';
        }
        output += '\n';
    }
    document.getElementById('result').textContent = output;
}