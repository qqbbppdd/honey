//БИБЛЕОТЕКА ДЛЯ УПРАВЛЕНИЯ КОРЗИНОЙ НА САЙТЕ
//СОЗДАНА 27.12.2020
//ДОПОЛНИТЕЛЬНЫЕ ФАЙЛЫ: cart.css
//В ЭТОЙ ВЕРСИИ МОГУТ БЫТЬ ОШИБКИ,
//ТАК КАК ОНА НАХОДИТСЯ В СОСТОЯНИИ BETA


//список товаров
let items = [];
//список желаемых товаров в корзине покупателя
let inventory = [];
//список корзины
let clist = document.getElementsByClassName("cart-list")[0];

//Прослушиватель событий страницы для определения нажатия
//не по дополнительной панели, за чем следует её закрытие
window.addEventListener("click", function(event) {
    //перечисление всех элементов в списке корзины
    for(a = 0; a < clist.children.length;a+=1) {
        //отклонение запроса при клике кнопки для вызова доп.панели
        if(event.target.id == "toolbar_button" + a) continue;
        //обнаружения нажатия не по кнопке
        if(event.target.id != "toolbar_action" + a)
            CloseUserToolbar(a); // закрытие доп.панели
    }
});
//Прослушиватель событий страницы для обнаружения изменения размера страницы
//При обнаружении все доп.окна закрываются в мерах безопасности
window.addEventListener("resize",function(event) {
    //перечисление всех элементов в списке корзины
    for(a =0; a < clist.children.length;a+=1) {
        //закрытие доп.панели
        CloseUserToolbar(a);
    }
});

//класс товара
class Product {
    //конструктор при создании
    constructor(name,cost,articleId,imagePath,id,iconPath) {
        //имя товара
        this.name = name;
        //цена товара в рублях
        this.cost = cost;
        //номер информационного блока на соответствующей таблице
        this.articleId = articleId;
        //путь к картинке товара
        this.imagePath = imagePath;
        //номер товара для его определения
        this.id = id;
        //путь к иконке товара для определения его типа в корзине
        this.iconPath = iconPath;
    }
}

//позиция товара пользователя
//создана для того, чтобы можно было легко комплектовать одинаковые продукты
class Position {
    //конструктор
    constructor(product,multiply) {
        //товар позиции
        this.product = product;
        //количество данных товаров в позиции
        this.multiply = multiply;
    }
}

//функция инициализации списка товаров
function InitItems() {
    //отклонение запроса при готовности инвентаря
    if(items.length != 0) return;
    //регистрация товаров
    RegisterItem("Гречишный мёд",2000,"a1","images/гречишный_мёд.jpg","images/icons/honey_icon.png");
    RegisterItem("Акациевый мёд",1500,"а2", "images/акациевый_мёд.jpg","images/icons/honey_icon.png");
    RegisterItem("Липовый мёд",500,"а3", "images/липовый_мёд.jpg","images/icons/honey_icon.png");
    RegisterItem("Цветочный мёд",500,"а4", "images/цветочный_мёд.jpg","images/icons/honey_icon.png");
    RegisterItem("Каштановый мёд",2500,"а5", "images/каштановый_мёд.jpg","images/icons/honey_icon.png");
}

//функция для регистрации товара в список
function RegisterItem(name,cost,articleId,imagePath,iconPath) {
    items.push(new Product(name,cost,articleId,imagePath,items.length+1,iconPath));
}

//переменная для хранения текущих покупок пользователя
let user_positions = [];

//функция поиска товара по его индексу
function GetProductById(id) {
    for(i = 0; i < items.length;i+=1) {
        if(items[i].id == id) return items[i];
    }
    return null;
}

//функция для обновления всех позиция пользователя
function UpdateUserPositions() {
    //очищение текущего списка
    user_positions = [];
    //добавление
    for(a = 0; a < inventory.length;a+=1) {
        //признак того, что товар уже укомплектован в одну из позиций.
        var complected = false;
        //получение товара по номеру из инвентаря
        var product = GetProductById(inventory[a]);
        //отклонение действия при отстутствии любых позиций
        if(user_positions.length > 0) {
            //перечисление всех позиций с целью найти подходящую
            for(b = 0; b < user_positions.length;b+=1) {
                //при совпадении названий товаров происходит комплектация
                if(user_positions[b].product.id == product.id) {
                    //комплектация
                    user_positions[b].multiply+=1;
                    complected = true;
                    break;
                }
            }
        }
        //при неукомплектации происходит создание новой позиции
        if(!complected) {
            //добавление в список
            user_positions.push(new Position(product,1));
        }
    }
}

//функция для получения инвентаря пользователя из хранилица
function GetInventory() {
    //получение сырой информации из хранилища
    var inv = localStorage.getItem('inventory');
    //отклонение запроса при пустом инвенторе
    if(inv == null || inv == "") return;
    //разделение инвентаря на сырые цифры
    var inv_ = inv.split(',');
    //очищение текущего инвентаря
    inventory = [];
    //конечное преобразование полученной информации
    for(a = 0; a < inv_.length;a+=1) {
        var i = parseInt(inv_[a]);
        //проверка данных
        if(i != NaN && i != null)
        inventory.push(i);
    }

}

//функция для сохранения текущего инветаря пользователя во внутреннее хранилище
function SaveInventory() {
    //создание конечной информации для сохранения
    var to_save = "";
    //добавление всех индексов
    for(a = 0;a<inventory.length;a+=1) {
        //проверка
        if(inventory[a] == NaN || inventory[a] == null || inventory[a] - 1 < 0 || inventory[a] - 1 > items.length) continue;
        to_save += inventory[a];
        //добавление запятых в нужные места
        if(a + 1 != inventory.length) to_save+=',';
    }
    //конечное сохранение информации
    localStorage.setItem('inventory',to_save);
}

//функция для удаления всех элементов из списка в корзине
function ClearCartListChildren() {
    //признак того, что в списке еще есть объедок
    while(clist.firstChild) {
        //удаление первого дочернего элемента
        clist.removeChild(clist.firstChild);
    }
}
//функция для обновления списка в корзине
function PlacePositionsInCartList() {
    //удаляем все дочерние элементы
    ClearCartListChildren();
    //заполняем информацию
    for(a = 0; a < user_positions.length;a+=1) {
        var header = user_positions[a].product.name;
        if(user_positions[a].multiply > 1) header += ' ' +user_positions[a].multiply.toString() + "x";
        var c_i = document.createElement('div');
        c_i.className = "cart-item";
        c_i.id="cart" + a;
        c_i.innerHTML = '<img src="' + user_positions[a].product.iconPath + '"><p>'+header+'</p><div class="edit_position_buttons"><input title="Убрать один" type="button" class="edit_button" id="minus" onclick="lessMultiplyInPosition(' + a +')"><input title="Добавить один" type="button" class="edit_button" id="plus" onclick="moreMultiplyInPosition(' + a + ')"><input title="Убрать товар из корзины" type="button" class="edit_button" id="delete" onclick="removePosition(' + a + ')"><input type="button" id="toolbar_button' + a +'" class="edit_button toolbar_button" onclick="ToggleUserToolbar(' + a + ')"></div><div class="toolbar"><input id="toolbar_action' + a +'" type="button" value="Прибавить" onclick="moreMultiplyInPosition(' + a +'); CloseUserToolbar(' + a +')"><input id="toolbar_action' + a +'" type="button" value="Убавить" onclick="CloseUserToolbar(' + a +');lessMultiplyInPosition(' + a +')"><input type="button" id="toolbar_action' + a +'" value="Удалить" onclick="CloseUserToolbar(' + a +');removePosition(' + a +')"></div>';
        clist.appendChild(c_i);
    }    
}
//функция для удаления определённой позиции из списка
function removePosition(id) {
    //подтверждение
    var Confirm = confirm("Вы точно хотите удалить этот товар?");
    if(!Confirm) return;
    //поиск номера товара в инвентаре и его удаление
    for(a = inventory.length-1;a>=0;a-=1) {
        if(inventory[a] == user_positions[id].product.id) {
            inventory.splice(a,1);
        }
    }
    //сохранение инвентаря
    SaveInventory();
    //обновление списка позиций
    UpdateUserPositions();
    //обновление списка в корзине
    PlacePositionsInCartList();
}

//функция для уменьшения количества товара в позиции
function lessMultiplyInPosition(id) {
    //при попытке сделать кол-во товара 0, переход в удаление товара
    if(user_positions[id].multiply == 1) {
        removePosition(id);
        return;
    }
    //уменьшение множителя позиции на 1
    user_positions[id].multiply -= 1;
    //создание новой строки оглавления для изменения числа X
    var str = user_positions[id].product.name;
    if(user_positions[id].multiply > 1) str += " " + user_positions[id].multiply + "x";
    //присвоение этой строки
    clist.children[id].children[1].innerHTML = str;
    //поиск и удаление одного товара из инвентаря
    for(a = inventory.length-1;a >= 0;a-=1) {
        if(inventory[a] == user_positions[id].product.id) {
            inventory.splice(a,1);
            break;
        }
    }
    //сохранение
    SaveInventory();
}

//функция для увеличения кол-ва товара в позиции
function moreMultiplyInPosition(id) {
    //отклонение запроса при переполнении позиции
    if(user_positions[id].multiply == 20) {
        alert("Слишком большая позиция!");
        return;
    }
    //увеличение кол-ва товара в позиции на 1
    user_positions[id].multiply += 1;
    //создание новой строки оглавления
    var str = user_positions[id].product.name;
    if(user_positions[id].multiply > 1) str += " " + user_positions[id].multiply + "x";
    //применение нового оглавления
    clist.children[id].children[1].innerHTML = str;
    //добавление в инвентарь соответствующий товар
    inventory.push(user_positions[id].product.id);
    //сохранение инвентаря
    SaveInventory();
}

//выключить ИЛИ включить тулбар пользователя взависимости от его текущего положения.
function ToggleUserToolbar(id) {
    //поиск нужного тулбара
    for(a = 0; a < clist.children[id].children.length;a+=1) {
        //проверка
        if(clist.children[id].children[a].className == "toolbar") {
            //включение\выключение взависимости от ситуации
            if(clist.children[id].children[a].style.display=="block")
                clist.children[id].children[a].style.display="none";
            else
                clist.children[id].children[a].style.display="block";
        }
    }
}

//закрытие тулбара пользователя
function CloseUserToolbar(id) {
    //поиск нужного тулбара
    for(a = 0; a < clist.children[id].children.length;a+=1) {
        //проверка на подлиность
        if(clist.children[id].children[a].className == "toolbar") {
            //закрытие
            clist.children[id].children[a].style.display="none";
        }
    }
}
