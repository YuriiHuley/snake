const N = 11;//розміри поля
const middleX = Math.floor(N/2);//початкове положення змійки
let middleY = Math.floor(N/2);
let lastStep = 38;//попердній крок 38 щоб не можна було рухатися вниз
let apple = false;//чи є яблуко на полі
let count = 0;//рахунок
let canPlay = true;
//задаємо змійку масивом
let snake = [
    [middleY++, middleX], //[y, x]
    [middleY++, middleX],
    [middleY++, middleX]
];

//y - рядок x - стовпець
//  x  x  x  x
//y00 01 02 03
//y10 11 12 13
//y20 21 22 23
//y30 31 32 33
function generateApple() {
    let x = Math.floor(Math.random()*N);//генеруємо координати яблука
    let y = Math.floor(Math.random()*N);
    let isSnake = false;//прапорець, припускаєм що яблуко не потрапило на змійку
    for (let s = 0; s < snake.length; s++) {//біжимо по змійці
        if(y == snake[s][0] && x == snake[s][1]){//якщо координати яблука і змійки співпадають
            isSnake = true;//прапорець правда
            break;//перериваєм цикл бо далі перевіряти нема сенсу
        }
    }
    if (isSnake) {//якщо потрапили на змійку
        generateApple();//генеруємо яблуко заново
    }else {//інакше
        apple = [y, x];//залишаємо яблуко як було
    }
}
//головний метод гри
function drawGame() {//промальовка гри
    if(!apple){//якщо яблука нема
        generateApple();//генеруємо яблуко
    }

    //$('.snake').empty();
    let html = '';//змінна в яку записується html, після кожного виклику функції обнуляємо її
    for (let y = 0; y < N; y++) {//заходимо в рядок
        html+='<div class="areaRow">'//відкриваємо тег рядка
        for (let x = 0; x < N; x++) {//біжимо по комірках рядка
            let boxClass = '';//змінна в яку будем записувати клас комірки поля
            for (let s = 0; s < snake.length; s++) {//біжимо по змійці
                if(y == snake[s][0] && x == snake[s][1]){//перевіряєм чи координати комірки поля співпадають з коордтнатами частини змійки
                    boxClass = ' snakeBox ';//якщо так то комірка поля належить змійці
                    break;//перестаємо бігти по змійці бо далі нема сенсу
                }
            }//продовжуємо бігти по комірках рядка
            if (y == apple[0] && x == apple[1]) {//перевіряєм чи координати комірки поля співпадають з коордтнатами яблука
                boxClass = ' appleBox ';//якщо так то комірка поля належить яблуку
            }
            html+='<div class="areaBox'+boxClass+'"></div>'
        }//закінчили бігти по комірках рядка
        html+='</div>';//закриваємо тег рядка
    }
    $('.snake').html(html);//предаємо в html клас snake згенерований вище код
    $('.count').text('Рахунок: '+count);////предаємо в html клас count рахунок
    if (count<5) {//змінюємо швидкість руху змійки залежно від набраних балів
        setTimeout(move, 450);
    }else if (count>=5 && count<10) {
        setTimeout(move, 400);
    }else if (count>=10 && count<15) {
        setTimeout(move, 350);
    }else if(count>=20 && count<25){
        setTimeout(move, 300);
    }else {
        setTimeout(move, 250);
    }
}
//Рух змійки в грі: останній елемент додаємо на початок і видаляємо з кінця
function isValidNextStep(nextStep) {
    if(nextStep[0] == apple[0] && nextStep[1] == apple[1]){//перевіряємо чи змійка натрапить на яблуко
        apple = false;//якщо так то яблуко будем генервуати знову
        count++;//рахунок збільшуємо на 1
    }else{
        snake.pop();//інакше видаляємо останній елемент змійки
    }

        let isSnake = false;//прапорець

    for (let s = 0; s < snake.length; s++) {//біжимо по змійці
        if(nextStep[0] == snake[s][0] && nextStep[1] == snake[s][1]){//перевіряємо чи співпадає наступний крок з координатами змійки
            isSnake = true;//якщо так то змійка потрапила на саму себе
            canPlay = false;//game over
            alert('Game Over');
            break;
        }
    }
    if(canPlay){//якщо можем грати
        snake.unshift(nextStep);//додаємо 'наступний крок' на початок змійки
        drawGame();//промальовуємо гру
    }
}
//клонуємо змійку повністю
function cloneArray(arr) {
    let newArr = [];
    for (let i in arr) {
        newArr[i] = arr[i];
    }
    return newArr;
}
//рух вверх
function up(){
        let nextStep = cloneArray(snake[0]);//створюємо змінну наступногог кроку і присвоюємо туди клоновантй перший елемент змійки
        if(nextStep[0]-1 < 0){//превіряєм чи наступним кроком не буде вихід за межі поля
        nextStep[0] = N-1;
        }else {
            nextStep[0]--;
        }
    isValidNextStep(nextStep);// дізнаємося чи можем грати далі
}

function down(){
    let nextStep = cloneArray(snake[0]);
    if(nextStep[0]+1 >= N){
        nextStep[0] = 0;
    }else {
        nextStep[0]++;
    }
    isValidNextStep(nextStep);
}

function right(){
    let nextStep = cloneArray(snake[0]);
    if(nextStep[1]+1 >= N){
        nextStep[1] = 0;
    }else {
        nextStep[1]++;
    }
    isValidNextStep(nextStep);
}

function left(){
    let nextStep = cloneArray(snake[0]);
    if(nextStep[1]-1 < 0){
        nextStep[1] = N;
    }else {
        nextStep[1]--;
    }
    isValidNextStep(nextStep);
}

$(document).keyup(function(event){//дізнаємся які кнопки натискає гравець
    if(!canPlay){//якщо не можем грати
        return;//game over
    }

    if(event.keyCode == 37 && lastStep!= 39){        //left, не можемо рухатися в протилежний бік
        lastStep = event.keyCode;//записуємо останній крок
    }else if (event.keyCode == 38 && lastStep!= 40) {//up
        lastStep = event.keyCode;
    }else if (event.keyCode == 39 && lastStep!= 37) {//right
        lastStep = event.keyCode;
    }else if (event.keyCode == 40 && lastStep!= 38 ) {//down
        lastStep = event.keyCode;
    }
});
function move(){//метод який дозволяє рухатися змійці самостійно
    if(!canPlay){//якщо не можем грати далі
        return;//game over
    }
    if([37, 38, 39, 40].indexOf(lastStep) !== -1){//перевіряєм чи гравець натискає дозволені кнопки
        switch (lastStep) {
            case 37: left(); break;//викликаємо метод руху
            case 38: up(); break;
            case 39: right(); break;
            case 40: down(); break;
        }
    }
}

drawGame();//викликаємо функцію промальовки гри
