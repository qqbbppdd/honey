//Нужные элементы
//линии
let lines = document.getElementsByClassName('line');
//элементы звезды
let elements = document.getElementsByClassName('element');
//правила, по которым линии соединяют элементы
let rules = [[0,2],[1,0],[2,4],[3,1],[4,3]];
//задний фон
let bg = document.getElementsByClassName("background")[0];
//верхняя панель
let tp = document.getElementsByClassName("top-panel")[0];
//выпадающая панель упрощенного просмотра
let flowpanel = document.getElementsByClassName('flow-panel')[0];
//главный блок сайта
let mainblock = document.getElementsByClassName('main-block')[0];
//область для корректного хранения и расположения линий
let lineArray = document.getElementsByClassName('line-array')[0];
//показатель открытия диалового окна
let dialog_opened = false;

inventory =[1,1,1,1,1]

SaveInventory();
InitItems();
GetInventory();
//UpdateUserPositions();
//PlacePositionsInCartList();
//ToggleCart(true);


window.onload = function() {
    //подготовка окна к рисовке линий
    window.scrollTo(pageXOffset, 0);
    //анимация элементов
    for(a = 0; a < elements.length;a+=1) {
        //анимация
        elements[a].classList.toggle('scale');
    }
    //создание линий
    for(a = 0; a < 5; a+=1) {
        //создание
        var line = document.createElement('div');
        line.className="line";
        //добавление в архив
        lineArray.append(line);
    }
    //первая прорисовка линий
    UpdateLines();
    //инициализация света для корректной работы
    light(true);
}
window.onresize = function(event) {
    //перерисовка линий при масштабировании окна
    UpdateLines();
}
function UpdateLines() {
    //подготовка к прорисовке линий
    window.scrollTo(pageXOffset, 0);
    //получение информации о положении элементов звезды
    var e_bounds = [];
    for(a = 0; a < 5; a+=1) {
        e_bounds.push(elements[a].getBoundingClientRect());
    }
    //расстановка линий по правилам
    for(a = 0; a < rules.length; a+=1) {
        lines[a].style.left = (e_bounds[a].left+e_bounds[a].width/2) + "px";
        lines[a].style.top = (e_bounds[a].top+e_bounds[a].height/2)+ "px";
        lines[a].style.width = Distance(e_bounds[rules[a][0]],e_bounds[rules[a][1]]) + "px";
        lines[a].style.transform = "rotate(" + RotateValue(e_bounds[rules[a][0]],e_bounds[rules[a][1]]) + "deg)";
    }
}

//функция для определения дистанции 1 точки от другой
function Distance(bound1,bound2) {
    return Math.abs(Math.sqrt(Math.pow(bound2.left - bound1.left,2) +Math.pow(bound2.top - bound1.top,2))); 
}
//функция для определения градусной меры поворота от одного элемента к другому
function RotateValue(bound1,bound2) {
    return Math.atan2(bound2.top-bound1.top,bound2.left-bound1.left)/Math.PI*180;
}

//переменная для инициализации выпадающего окна
let bbc_first = false;
function BurgerbuttonClick() {
    //отклонение запроса при открытом диалоговом окне
    if(dialog_opened) return;
    if(flowpanel.style.transform == "translate(110%)" || !bbc_first ) {
        //открыть
        flowpanel.style.transform = "translate(0%)";
        if(!bbc_first)bbc_first = true;
    }
    else {
        //закрыть
        flowpanel.style.transform = "translate(110%)";
    }
}

//функция при наведении курсора на кристалл
function CrystalOver() {
    //получение элементов
    var elements = [document.getElementById("first"),document.getElementById("second"),document.getElementById("third"),document.getElementById("fourth"),document.getElementById("fifth")];
    //применение эффектов
    for(a = 0; a < elements.length;a+=1) {
        elements[a].style.boxShadow="0px 0px 7px 1px white";
    }
}

//функция при схождении курсора с кристалла
function CrystalOut() {
    //получение элементов
    var elements = [document.getElementById("first"),document.getElementById("second"),document.getElementById("third"),document.getElementById("fourth"),document.getElementById("fifth")];
    //применение эффектов
    for(a = 0; a < elements.length;a+=1) {
        elements[a].style.boxShadow="0px 0px 7px 0px black";
    }
}

//функция для управления освещением на странице
function light(value) {
    if(value) {
        //включение света
        document.getElementsByClassName("background")[0].style.filter = "brightness(100%)";
        tp.style.filter = "brightness(100%)";  
        document.getElementsByClassName("main-block")[0].style.filter = "brightness(100%)"; 
        lineArray.style.filter = "brightness(100%)"; 
    }
    else {
        //выключение света
        document.getElementsByClassName("background")[0].style.filter = "brightness(40%)";
        tp.style.filter = "brightness(40%)";  
        document.getElementsByClassName("main-block")[0].style.filter = "brightness(40%)"; 
        lineArray.style.filter = "brightness(40%)";  
    }
}

//функция открытия и закрытия диалогового окна корзины
function ToggleCart(toggle) {
    //получение корзины
    var cart = document.getElementById("cart");
    if(toggle) {
        //открыть
        if(dialog_opened) return;
        dialog_opened = true;
        light(false);
        UpdateUserPositions();
        PlacePositionsInCartList();
        //анимация
        if(!cart.classList.contains("open"))cart.classList.toggle("open");
        if(cart.classList.contains("close"))cart.classList.toggle("close");
    }
    else {
        //закрыть
        dialog_opened = false;
        light(true);
        //анимация
        if(cart.classList.contains("open"))cart.classList.toggle("open");
        if(!cart.classList.contains("close"))cart.classList.toggle("close");
    }
}