//выпадающая панель упрощенного просмотра
let flowpanel = document.getElementsByClassName('flow-panel')[0];
let grid = document.getElementsByClassName("grid")[0];
let dialog_opened = false;
let page_items = [1,5];
//инициализация
darktheme(false);
InitItems();
GetInventory();
PlaceItemsInGrid();

function ToggleArticle(article_id,toggle) {
    var article = document.getElementById(article_id);
    if(article == null) {
        Title("Ошибка");
        return;
    }
    if(toggle) {
        if(dialog_opened) return;
        dialog_opened = true;
        darktheme(true);
        if(!article.classList.contains("open"))article.classList.toggle("open");
        if(article.classList.contains("close"))article.classList.toggle("close");
    }
    else {
        dialog_opened = false;
        darktheme(false);
        if(article.classList.contains("open"))article.classList.toggle("open");
        if(!article.classList.contains("close"))article.classList.toggle("close");
    }
}

function darktheme(value) {
    if(!value) {
        document.getElementsByClassName("grid")[0].style.filter = "brightness(100%)";
        document.getElementsByClassName("background")[0].style.filter = "brightness(100%)";
        document.getElementsByClassName("top-panel")[0].style.filter = "brightness(100%)";      
    }
    else {
        document.getElementsByClassName("grid")[0].style.filter = "brightness(40%)";
        document.getElementsByClassName("background")[0].style.filter = "brightness(40%)";
        document.getElementsByClassName("top-panel")[0].style.filter = "brightness(40%)";
    }
}

function SendToServer(params,func,paramstofunc) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET',"http://localhost/honeysite/script.php?" + params,true);
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4) {
            if(ajax.status == 200) {
                if(func!=null)func(ajax.responseText,paramstofunc);
            }
            else {
                alert("Упс! Что то пошло не так.");
            }
        }
    };
    ajax.send(null);
}

function AddToCart(button,key) {
    if(dialog_opened) return;
    if(key == NaN || key == null || key-1 < 0 || key-1 >= items.length) {
        Title("Ошибка!");
        return;
    }
    button.classList.remove('click');
    void button.offsetWidth;
    button.classList.add('click');
    var count = 0;
    for(a = 0; a < inventory.length;a+=1) {
        if(inventory[a]==key) 
        count += 1;
    }
    if(count >= 20) {
        Title("Слишком много подобных товаров!");
        return;
    }
    inventory.push(key);
    SaveInventory();
    Title("Добавлено!");
}

function AppendProductToGrid(product,key) {
    grid.innerHTML += '<div class="item"><p id="name">' +product.name +'</p><input type="button" id="info" onclick="ToggleArticle(' + "'" + product.articleId + "'" +',true)"><img src="' + product.imagePath +'"><div id="about"><p id="cost">' + product.cost + 'руб.</p><input type="button" class="button" value="В корзину" id="add_to_cart" onclick="AddToCart(this,('+key+' + 1))"></div></div>';
}

let bbc_first = false;
function BurgerbuttonClick(ignore_dialog = false) {
    //отклонение запроса при открытом диалоговом окне
    if(!ignore_dialog)if(dialog_opened) return;
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

//функция открытия и закрытия диалогового окна корзины
function ToggleCart(toggle) {
    //получение корзины
    var cart = document.getElementById("cart");
    if(toggle) {
        //открыть
        if(dialog_opened) return;
        dialog_opened = true;
        darktheme(true);
        UpdateUserPositions();
        PlacePositionsInCartList();
        //анимация
        if(!cart.classList.contains("open"))cart.classList.toggle("open");
        if(cart.classList.contains("close"))cart.classList.toggle("close");
    }
    else {
        //закрыть
        dialog_opened = false;
        darktheme(false);
        //анимация
        if(cart.classList.contains("open"))cart.classList.toggle("open");
        if(!cart.classList.contains("close"))cart.classList.toggle("close");
    }
}

function PlaceItemsInGrid(){
    for(a = 0; a < items.length;a+=1) {
        if(a + 1 >= page_items[0] && a + 1 <= page_items[1])
        AppendProductToGrid(items[a],a);
    }
}

function Title(text) {
    var title = document.getElementsByClassName('alert-title')[0];
    title.innerHTML = text;
    if(title.classList.contains("appear")) title.classList.remove("appear");
    void title.offsetWidth;
    title.classList.add("appear");
}