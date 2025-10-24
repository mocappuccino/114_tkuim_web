// example7_script.js
// 以函式封裝 BMI 計算與等級判斷

function calcBMI(heightCm, weightKg) {
  // 轉公尺
  var h = heightCm / 100;
  var bmi = weightKg / (h * h);
  return bmi;
}

function bmiLevel(bmi) {
  var level = '';
  if (bmi < 18.5) {
    level = '過輕';
  } else if (bmi < 24) {
    level = '正常';
  } else if (bmi < 27) {
    level = '過重';
  } else if (bmi < 30) {
    level = '輕度肥胖';
  } else if (bmi < 35) {
    level = '中度肥胖';
  } else {
    level = '重度肥胖';
  }
  return level;
}

var hStr = prompt('請輸入身高（公分）：');
var wStr = prompt('請輸入體重（公斤）：');
var hNum = parseFloat(hStr);
var wNum = parseFloat(wStr);

var text = '';
if (isNaN(hNum) || isNaN(wNum) || hNum <= 0) {
  text = '輸入不正確';
} else {
  var bmi = calcBMI(hNum, wNum);
  text = '身高：' + hNum + ' cm\n'
       + '體重：' + wNum + ' kg\n'
       + 'BMI：' + bmi.toFixed(2) + '\n'
       + '等級：' + bmiLevel(bmi);
}

document.getElementById('result').textContent = text;
//新增一個函式 isIdeal(bmi)，回傳布林，判斷是否在 18.5–24 之間。
function isIdeal(bmi) {
  return bmi >= 18.5 && bmi < 24;
}

if (!isNaN(hNum) && !isNaN(wNum) && hNum > 0) {
  var idealText = isIdeal(bmi) ? '是理想體重' : '不是理想體重';
  text += '\n' + idealText;
  document.getElementById('result').textContent = text;
}
