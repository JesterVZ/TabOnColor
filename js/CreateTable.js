var MainTablePanel = document.getElementById("TablePanel");
var ShowColorCodeCheckbox = document.getElementById("ShowText");
var TimeEnableCheckbox = document.getElementById("TimeEnable");

var timeBarBlock = document.getElementById("time-block");
var timeBar = document.getElementById("time-bar");
var scoreBlock = document.getElementById("score-block");
var scoreDisplay = document.getElementById("show-score-block");
var buttonPanel = document.getElementById("button-panel");

var ArrayOfColors = new Array();
var ArrayOfChars = new Array('A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'); //массив символов, необходимых для генерации кода
var ArrayOfAddedColors = new Array();
var ArrayOfScors = new Array();

var isShowColorCode = new Boolean(false); //показывать ли код цвета
var RightColorIsChosen = new Boolean(false);
var idLoose = new Boolean(false);

var ChosenSize = 0;

var Score;
var BestScore = 0;

var repeat = 0;
$(document).ready(function(){
    for(var i = 0; i < localStorage.getItem('score').length; i++){
        ArrayOfScors[i] = localStorage.getItem('score')[i];
    }
    BestScore = localStorage.getItem('BestScore');
    if(BestScore == null){
        BestScore = 0;
    }
});
function TimeBarMovement(seconds){  //движение градусника
    if(repeat == 0){
        repeat = 1;
        var width = 100;
        timeBar.style.width = width + "%";
        var id = setInterval(frame, seconds);
        function frame() {
            if(width < 1 || RightColorIsChosen == true || idLoose == true){
                clearInterval(id);
                repeat = 0;
                timeBar.style.width = 100 + "%";
                if(width < 1){
                    Loose();
                    ClearTable();
                }
                RightColorIsChosen = false;
                if(idLoose == false) {
                    TimeBarMovement(seconds);
                } else {
                    clearInterval(id);
                }
            } else {
                width --;
                timeBar.style.width = width + "%";
            }
        }

    }
}

function CheckSize(size){
    Score = 0;
    ChosenSize = size;
    scoreBlock.style.display = "none";
    CreateTablePanel(ChosenSize);
}

function ClearTable(){
    var TargetColorDiv = document.getElementById("target-color");
    MainTablePanel.innerHTML = "";
    TargetColorDiv.style.backgroundColor = "transparent";
    timeBarBlock.style.display = "none";
    scoreDisplay.innerHTML = 0;
    scoreDisplay.style.display = "none";
}

function CreateTablePanel(size){
    ArrayOfColors = new Array();
    ArrayOfAddedColors = new Array();
    scoreDisplay.style.display = "block";
    timeBarBlock.style.display = "block";
    buttonPanel.style.display = "none";
    idLoose = false;
    if(TimeEnableCheckbox.checked == true){
        switch (size){ 
            case 3:
                TimeBarMovement(20);
            case 4:
                TimeBarMovement(40);
            case 5:
                TimeBarMovement(50);
        }
    }

    if(ShowColorCodeCheckbox.checked == true){ 
        isShowColorCode = true;
    } else {
        isShowColorCode = false;
    }
    var AddHtml = "<table><tr>" //Добавления ряда в таблицу
    MainTablePanel.innerHTML = "";
    var indexOfColorBlock = 0;

    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            indexOfColorBlock++;
            AddHtml += "<td id = " + "ColorBlock" + indexOfColorBlock + " onclick=" + "CompareResultsOfColors(ColorBlock"+ indexOfColorBlock + ");" + ">" + "</td>";
        }
        AddHtml += "</tr>";
        MainTablePanel.innerHTML += AddHtml;
        AddHtml = "<tr>"
    }
    indexOfColorBlock = 0;
    GenerateColorHTMLCode(200);  //создать 200 случайных цветовых кодов
    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            var color;
            indexOfColorBlock++;
            var element = document.getElementById("ColorBlock" + (indexOfColorBlock));
            color = ArrayOfColors[GenerateValue(0, ArrayOfColors.length)];
            ArrayOfAddedColors.push(color);
            element.style.backgroundColor = color;
            if(isShowColorCode == true){
                element.innerHTML = color; //показать код цвета
            }
        }
    }

    AddTargetColor();
}

function CompareResultsOfColors(index){
    var TargerColorDiv = document.getElementById("target-color");
    if(index.style.backgroundColor == TargerColorDiv.style.backgroundColor){
        if(timeBar.style.width > "90%"){
            Score = Score + 6;
        }
        if(timeBar.style.width > "60%" && timeBar.style.width < "90%"){
            Score = Score + 3
        }
        if(timeBar.style.width > "30%" && timeBar.style.width < "60%"){
            Score = Score + 2;
        }
        if(timeBar.style.width > "1%" && timeBar.style.width < "30%"){
            Score++;
        }
        scoreDisplay.innerHTML = Score;
        RightColorIsChosen = true;
        CreateTablePanel(ChosenSize);
    } else {
        if(Score > BestScore){
            BestScore = Score;
            document.cookie = BestScore
        }
        Loose();
        ClearTable();
    }
}

function Loose(){
    var textBlock = document.getElementById("score-block-description");
    localStorage.setItem('score', ArrayOfScors.push(Score)); //создание массива счетов за все время 
    localStorage.setItem('BestScore', BestScore);
    textBlock.innerHTML = "Вы набрали " + Score + " очков. Ваш лучший счет: " + BestScore;
    Score = 0;
    idLoose = true;
    repeat = 0;
    $(scoreBlock).fadeIn(600); //плавное появление итоговой таблицы счета
    scoreBlock.style.display = "block";
    buttonPanel.style.display = "block";
}

function AddTargetColor(){
    var TargetColorDiv = document.getElementById("target-color");
    color =  ArrayOfAddedColors[GenerateValue(0, ArrayOfAddedColors.length)]; //Переменная, содержащая случайное значение кода, выбранного из массива
    TargetColorDiv.style.backgroundColor = color;
    if(isShowColorCode == true){
        TargetColorDiv.innerHTML = color;
    } else {
        TargetColorDiv.innerHTML = "";
    }
}

function GenerateValue(min, max){
    return Math.floor(Math.random() * (min, max)) + min;
}

function GenerateColorHTMLCode(size){
    var value = "#";
    for(var i = 0; i < size; i ++){
        for(var j = 0; j < 6; j++){
            value += ArrayOfChars[GenerateValue(0, ArrayOfChars.length)];
        }
        ArrayOfColors.push(value);
        value = '#';
    }
    value = '';
}