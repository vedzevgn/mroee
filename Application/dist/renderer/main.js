"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
setTimeout(() => { var _a; return (_a = document.getElementById('preloader')) === null || _a === void 0 ? void 0 : _a.classList.add('hiddenPreloader'); }, 2000);
setTimeout(() => document.getElementById('logoAnimation').style.display = "none", 2300);
const { SerialPort } = require('serialport');
let connectionWindowOpened = false;
let isConnected = true;
let receivedData = false;
let globalPortName = '';
let globalPort = new SerialPort({
    path: 'COM1',
    baudRate: 115200
});
let port = new SerialPort({
    path: 'COM1',
    baudRate: 115200
});
const portNames = ['/dev/cu.usbserial-0001', '/dev/cu.usbserial-0002', 'COM1', 'COM2', 'COM3', 'COM4'];
let accumulatedData = '';
function parseData(data, portName) {
    const regex = /^SwiftController;S\/N(\d+)/;
    const match = data.match(regex);
    if (match) {
        receivedData = true;
        const [, serialNumber] = match;
        console.log(`Найдено соответствие на порту ${portName}: serialNumber = ${serialNumber}`);
        document.getElementById('serialNumber').innerHTML = "S/N: " + serialNumber;
    }
}
function connectTo(portName) {
    return __awaiter(this, void 0, void 0, function* () {
        port = new SerialPort({
            path: portName,
            baudRate: 115200
        });
        port.write('sendConnect');
        port.on('open', () => {
            globalPort = port;
            globalPortName = portName;
            isConnected = true; //-----
        });
        return new Promise((resolve, reject) => {
            port.on('error', (err) => {
                isConnected = false; //-----
                //console.log(`Ошибка на порту ${portName}: ${err.message}`);
                reject(err);
            });
        });
    });
}
function readData() {
    return __awaiter(this, void 0, void 0, function* () {
        globalPort.on('data', (data) => {
            const dataStr = data.toString();
            accumulatedData += dataStr;
            parseData(accumulatedData, globalPortName);
        });
        globalPort.on('close', function () {
            isConnected = false;
        });
        return new Promise((resolve, reject) => {
            globalPort.on('error', (err) => {
                isConnected = false; //-----
                //console.log(`Ошибка на порту ${globalPortName}: ${err.message}`);
                reject(err);
            });
        });
    });
}
function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("Port opened: " + globalPort.isOpen + " Connected: " + isConnected);
        if (isConnected) {
            closeModalWindow('connection');
            (_a = document.getElementById("disconnectedMessage")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            document.getElementById("connectionIcon").style.backgroundImage = "url(resources/icons/connected.png)";
            (_b = document.getElementById("preview")) === null || _b === void 0 ? void 0 : _b.classList.remove("blurredPreview");
            connectionWindowOpened = false;
        }
        else {
            /*if(!connectionWindowOpened){
              showModalWindow('connection');
              document.getElementById("disconnectedMessage")?.classList.remove("hidden");
              document.getElementById("connectionIcon")!.style.backgroundImage = "url(resources/icons/disconnected.png)";
              document.getElementById("preview")?.classList.add("blurredPreview");
              connectionWindowOpened = true;
            }*/
        }
        if (!isConnected) {
            for (const portName of portNames) {
                try {
                    yield connectTo(portName);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        else {
            if (!receivedData) {
                try {
                    yield readData();
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                //await readData();
                port.removeAllListeners('error');
                port.removeAllListeners('open');
            }
        }
    });
}
globalPort.on('close', function () {
    isConnected = false;
});
globalPort.on('error', function () {
    isConnected = false;
});
setInterval(() => main(), 1500);
const iconNames = ['copy', 'paste', 'mute', 'volumeup', 'volumedown', 'pause', 'play', 'backward', 'forward', 'screenshot', 'search', 'moon', 'lock'];
const names = ['Копировать', 'Вставить', 'Без звука', 'Громкость +', 'Громкость -', 'Пауза', 'Продолжить', 'Назад', 'Вперёд', 'Снимок экрана', 'Поиск', 'Не беспокоить', 'Заблокировать'];
/*addEventListener("load", (event) => {
  let iconsSet: string = `
          <div class="column iconsColumn">
            ${iconNames.map((name, index) => `
                <div class="listElement iconElement button">
                    <div class="icon" style="background-image: url(resources/icons/${name}.png);"></div>
                    <p>${names[index]}</p>
                </div>
            `).join('')}
          </div>`;
  document.getElementById("iconsSectionInner")!.innerHTML = iconsSet;
});*/
class SettingsPopup {
    constructor(element) {
        this.menuOpened = false;
        this.numberOfScreen = "";
        this.element = element;
        this.numberOfScreen = this.element.id.substring(7, 8);
        this.element.addEventListener('click', () => this.operateMenu());
    }
    checkMenu() {
        if (this.menuOpened) {
            this.closeMenu();
        }
    }
    operateMenu() {
        if (this.menuOpened) {
            this.closeMenu();
        }
        else {
            this.openMenu();
        }
    }
    closeMenu() {
        const menu = document.querySelector("#menu" + this.element.id.substring(7, 8));
        this.element.classList.remove('activePreview');
        menu.classList.add('hidden');
        setTimeout(() => menu.remove(), 200);
        this.menuOpened = false;
    }
    openMenu() {
        var _a, _b;
        this.menuOpened = true;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList.add('activePreview');
        let menu = document.createElement("div");
        menu.classList.add("iconMenu");
        menu.classList.add("hidden");
        menu.id = "menu" + this.element.id.substring(7, 8);
        const menuHTML = `
          <div class="categories">
            <div class="category iconsCategory"><p>Значки</p></div>
            <div class="category functionsCategory"><p>Виджеты</p></div>
          </div>
          <div class="column iconsColumn">
            ${iconNames.map((name, index) => `
                <div class="listElement iconElement button" onClick="handleIconClick(${this.numberOfScreen}, ${index});">
                    <div class="icon" style="background-image: url(resources/icons/${name}.png);"></div>
                    <p>${names[index]}</p>
                </div>
            `).join('')}
          </div>
          <div class="column functionsCloumn">

          </div>
    `;
        menu.innerHTML += menuHTML;
        const iconButtons = document.querySelectorAll(".iconElement");
        iconButtons.forEach(button => {
            button.addEventListener('click', () => this.operateMenu());
        });
        menu.style.position = "absolute";
        menu.style.zIndex = "1000";
        menu.style.left = this.element.getBoundingClientRect().left + "px";
        menu.style.top = this.element.getBoundingClientRect().top + "px";
        (_b = document.querySelector("body")) === null || _b === void 0 ? void 0 : _b.appendChild(menu);
        setTimeout(() => menu.classList.remove('hidden'), 10);
    }
}
function handleIconClick(numberOfScreen, index) {
    const innerIcon = document.querySelectorAll(".previewIcon")[numberOfScreen - 1];
    const iconName = iconNames[index];
    console.log("s" + numberOfScreen + "i" + index);
    innerIcon.style.backgroundImage = `url(resources/icons/${iconName}.png)`;
    innerIcon.style.animation = "bounce .2s ease-in-out running";
    globalPort.write("s" + numberOfScreen + "i" + index);
    setTimeout(() => innerIcon.style.animation = "none", 200);
}
const previewIconBoxes = document.querySelectorAll('.previewIconBox');
previewIconBoxes.forEach((previewIconBox) => {
    new SettingsPopup(previewIconBox);
});
const asideButtons = document.querySelectorAll('.asideButton');
const contentBoxes = document.querySelectorAll('.content');
function selectContent(button) {
    var _a, _b;
    setTimeout(() => update(), 300);
    let buttonID = button.id;
    let id = buttonID.substring(0, buttonID.length - 6);
    if (id !== "iconsSet") {
        (_a = document.getElementById("connectionWidget")) === null || _a === void 0 ? void 0 : _a.classList.remove("hiddenAsideWidget");
    }
    else {
        (_b = document.getElementById("connectionWidget")) === null || _b === void 0 ? void 0 : _b.classList.add("hiddenAsideWidget");
    }
    asideButtons.forEach(button => {
        button.classList.remove('activeButton');
    });
    button.classList.add('activeButton');
    contentBoxes.forEach(box => {
        box.classList.add('hiddenContent');
        if (box.id == id) {
            box.classList.remove('hiddenContent');
        }
    });
}
function closeModalWindow(ID) {
    document.getElementById(ID + "Window").classList.add('closedModalWindow');
    document.getElementById("modalWindowBack").classList.add("hiddenModalBack");
}
function showModalWindow(ID) {
    console.log(ID);
    document.getElementById(ID + "Window").classList.remove('closedModalWindow');
    document.getElementById("modalWindowBack").classList.remove("hiddenModalBack");
}
const keysInputBox = document.getElementById("keysInputBox");
const saveButton = document.getElementById("saveButton");
const saveButtonBack = document.querySelectorAll(".saveButtonBack");
const combinationsBox = document.getElementById("combinationsBox");
const clearButton = document.getElementById("clearInputButton");
const combinations = [];
let buttonsCount = 0;
function trackKeyPress(event) {
    buttonsCount++;
    if (buttonsCount > 0) {
        clearButton.style.opacity = "1";
    }
    else {
        clearButton.style.opacity = "0";
    }
    if (buttonsCount < 6) {
        event.preventDefault();
        let keyName = event.key;
        if (keyName == " ") {
            keyName = "space";
        }
        const keyDiv = document.createElement("div");
        keyDiv.textContent = keyName.toUpperCase();
        keyDiv.classList.add("keyBox");
        if (buttonsCount == 1)
            keyDiv.classList.add("firstKey");
        keyDiv.classList.add("hiddenKey");
        keysInputBox.appendChild(keyDiv);
        setTimeout(() => keyDiv.classList.remove("hiddenKey"), 10);
    }
}
function clearCombination() {
    const divs = keysInputBox.querySelectorAll("div");
    const innerTextArray = [];
    buttonsCount = 0;
    divs.forEach((div) => {
        if (div != clearButton && div != saveButton && div != saveButtonBack[0]) {
            div.remove();
        }
    });
    clearButton.style.opacity = "0";
}
const emptyCombinationsHint = document.getElementById('emptyCombinationsHint');
function saveCombination() {
    const divs = keysInputBox.querySelectorAll("div");
    const innerTextArray = [];
    divs.forEach((div) => {
        if (div != clearButton && div != saveButton && div != saveButtonBack[0])
            innerTextArray.push(div.innerText);
    });
    let combinationText = innerTextArray.join(" + ");
    if (combinationText == null) {
        combinationText = "";
    }
    if (divs.length == 3) {
        keysInputBox.classList.add("shake");
        setTimeout(() => keysInputBox.classList.remove("shake"), 400);
        return;
    }
    combinations.push(combinationText);
    emptyCombinationsHint.style.display = "none";
    skeletons.forEach(element => {
        element.style.display = "none";
    });
    //combinationsBox!.style.backgroundImage = "url()";
    divs.forEach((div) => {
        if (div != clearButton && div != saveButton && div != saveButtonBack[0]) {
            div.remove();
        }
    });
    clearButton.style.opacity = "0";
    const combinationDiv = document.createElement("div");
    const combinationTextBlock = document.createElement("p");
    combinationDiv.classList.add("combination");
    combinationDiv.classList.add("hiddenCombination");
    combinationDiv.classList.add("button");
    combinationTextBlock.innerHTML = combinationText;
    const combinationRemoveButton = document.createElement("div");
    combinationRemoveButton.classList.add("combinationRemoveButton");
    combinationDiv.appendChild(combinationRemoveButton);
    combinationDiv.appendChild(combinationTextBlock);
    combinationsBox.appendChild(combinationDiv);
    combinationDiv.addEventListener("click", () => removeCombination(combinationDiv));
    setTimeout(() => combinationDiv.classList.remove("hiddenCombination"), 10);
    buttonsCount = 0;
}
let listenKeys = false;
//keysInputBox.addEventListener("click", keysListener);
saveButton.addEventListener("click", saveCombination);
clearButton.addEventListener("click", clearCombination);
setActive(keysInputBox, document);
function setActive(targetElement, containerElement = document) {
    containerElement.addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (clickedElement === targetElement /*|| targetElement.contains(clickedElement)*/) {
            targetElement.classList.add('active');
            if (!listenKeys)
                keysListener();
        }
        else {
            if (targetElement != null) {
                targetElement.classList.remove('active');
                if (listenKeys)
                    keysListener();
            }
        }
    });
}
function keysListener() {
    if (listenKeys) {
        document.removeEventListener("keydown", trackKeyPress);
        listenKeys = !listenKeys;
    }
    else {
        document.addEventListener("keydown", trackKeyPress);
        listenKeys = !listenKeys;
    }
}
function removeCombination(box) {
    box.classList.add("hiddenCombination");
    setTimeout(() => { box.remove(); update(); }, 200);
}
const terminalInputBox = document.getElementById("terminalInputBox");
const saveTerminalButton = document.getElementById("saveTerminalButton");
const commandsBox = document.getElementById("treminalCommandsBox");
const clearCommandButton = document.getElementById("clearTerminalInputButton");
const commands = [];
let commandLength = 0;
function trackInput(event) {
    commandLength++;
    if (buttonsCount > 0) {
        clearButton.style.opacity = "1";
    }
    else {
        clearButton.style.opacity = "0";
    }
    if (commandLength < 500) {
        event.preventDefault();
        let keyName = event.key;
        if (keyName == " ") {
            keyName = "space";
        }
        const keyDiv = document.createElement("div");
        keyDiv.textContent = keyName.toUpperCase();
        keyDiv.classList.add("keyBox");
        if (buttonsCount == 1)
            keyDiv.classList.add("firstKey");
        keyDiv.classList.add("hiddenKey");
        keysInputBox.appendChild(keyDiv);
        setTimeout(() => keyDiv.classList.remove("hiddenKey"), 10);
    }
}
function clearCommand() {
    commandLength = 0;
    commandsBox.innerText = "";
    clearButton.style.opacity = "0";
}
const emptyCommandsHint = document.getElementById('emptyCommandsHint');
const skeletons = document.querySelectorAll(".combinationSkeleton");
function saveCommand() {
    const commandsArray = [];
    commandsArray.push(commandsBox.innerText);
    if (commandsBox.innerText = "") {
        keysInputBox.classList.add("shake");
        setTimeout(() => keysInputBox.classList.remove("shake"), 400);
        return;
    }
    emptyCommandsHint.style.display = "none";
    skeletons.forEach(element => {
        element.style.display = "none";
    });
    //combinationsBox!.style.backgroundImage = "url()";
    clearCommand();
    clearButton.style.opacity = "0";
    /*const combinationDiv = document.createElement("div");
    const combinationTextBlock = document.createElement("p");
    combinationDiv.classList.add("combination");
    combinationDiv.classList.add("hiddenCombination");
    combinationTextBlock.innerHTML = combinationText;
    
    const combinationRemoveButton = document.createElement("div");
    combinationRemoveButton.classList.add("combinationRemoveButton");
  
    combinationDiv.appendChild(combinationRemoveButton);
    combinationDiv.appendChild(combinationTextBlock);
    combinationsBox.appendChild(combinationDiv);
    combinationDiv.addEventListener("click", () => removeCombination(combinationDiv));
    setTimeout(() => combinationDiv.classList.remove("hiddenCombination"), 10);
    buttonsCount = 0;*/
}
//keysInputBox.addEventListener("click", keysListener);
saveButton.addEventListener("click", saveCombination);
clearButton.addEventListener("click", clearCombination);
setActive(commandsBox);
/*function removeCombination(box: HTMLElement) {
  box.classList.add("hiddenCombination");
  setTimeout(() => {box.remove(); update()}, 200);
}*/
function update() {
    const combinationBoxes = document.querySelectorAll(".combination");
    if (combinationBoxes.length > 0) {
        emptyCombinationsHint.style.display = "none";
        skeletons.forEach(element => {
            element.style.display = "none";
        });
        //combinationsBox!.style.backgroundImage = "url()";
    }
    else {
        emptyCombinationsHint.style.display = "block";
        skeletons.forEach(element => {
            element.style.display = "block";
        });
        //combinationsBox!.style.backgroundImage = "url(resources/images/combinationsSkeleton.png)";
    }
    const combinationsPanel = document.getElementById("combinationsBox");
    const combinationConfigPanel = document.getElementById("combinationsSectionInner");
    copyCombinations(combinationsPanel, combinationConfigPanel);
    let draggables = document.querySelectorAll("#combinationsSectionInner .draggable");
    draggables.forEach(draggable => {
        new DraggableElement(draggable);
    });
}
function copyCombinations(source, target) {
    target.innerHTML = '';
    for (const child of source.children) {
        //child.classList.add("draggable");
        let clone = child.cloneNode(true);
        clone.classList.add("draggable");
        target.appendChild(clone);
    }
    const removeButtons = target.querySelectorAll(".combinationRemoveButton");
    removeButtons.forEach(button => {
        button.remove();
    });
}
/*const noble = require('@abandonware/noble');
const readline = require('readline');

// Инициализация noble
noble.on('stateChange', (state: string) => {
  if (state === 'poweredOn') {
    // Начинаем поиск устройств с заданным именем (например, "mroee")
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

// Обработка обнаруженных устройств
noble.on('discover', (peripheral: { advertisement: { localName: string; txPowerLevel: string }; }) => {
  //console.log("------ " + peripheral.advertisement.localName);
  // Проверяем имя устройства
  if (peripheral.advertisement.localName === 'mroee') {

    // Подключаемся к устройству
    noble.stopScanning();
    connectToDevice(peripheral);
  }
});

// Функция подключения к устройству
function connectToDevice(peripheral: { advertisement?: { localName: string; }; connect?: any; disconnect?: any; }) {
  peripheral.connect((error: any) => {
    if (error) {
      console.error('Ошибка подключения к устройству:', error);
      return;
    }

    console.log('Успешное подключение к устройству!');

    sendStringToDevice(peripheral);
  });
}

function sendStringToDevice(peripheral: { advertisement?: { localName: string; } | undefined; connect?: any; disconnect?: any; discoverServices?: any; }) {
  let characteristics = peripheral.discoverServices();
  //alert(characteristics);
}*/
class DraggableElement {
    constructor(element) {
        this.underDroppable = false;
        this.underElement = null;
        this.currentDroppable = null;
        this.originX = 0;
        this.originY = 0;
        this.shiftX = 0;
        this.shiftY = 0;
        this.element = element;
        this.element.addEventListener('mousedown', (this.onMouseDown.bind(this)));
        this.element.ondragstart = function () {
            return false;
        };
    }
    onMouseDown(event) {
        this.originX = this.element.getBoundingClientRect().left;
        this.originY = this.element.getBoundingClientRect().top;
        const shiftX = event.clientX - this.element.getBoundingClientRect().left;
        const shiftY = event.clientY - this.element.getBoundingClientRect().top;
        //event.clientX - ball!.getBoundingClientRect().left - 42;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.clone = this.element.cloneNode(true);
        document.body.appendChild(this.clone);
        this.clone.style.position = 'absolute';
        this.clone.style.zIndex = '1000';
        this.clone.style.transform = 'scale(1)';
        this.clone.style.transition = ".2s";
        setTimeout(() => this.clone.style.transform = 'scale(1.1)', 10);
        setTimeout(() => this.clone.style.transition = "0s", 300);
        this.clone.id += 'Clone';
        this.element.style.transition = '0s';
        this.element.style.opacity = '0';
        this.moveAt(event.pageX, event.pageY);
        const onMouseMove = (event) => {
            const previews = document.querySelectorAll(".previewIconBox");
            previews.forEach(preview => {
                preview.classList.add("dashedPreview");
            });
            this.moveAt(event.pageX, event.pageY);
            //this.clone!.hidden = true;
            this.clone.style.display = "none";
            const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            this.clone.style.display = "block";
            //this.clone!.hidden = false;
            console.log(elemBelow === null || elemBelow === void 0 ? void 0 : elemBelow.innerHTML);
            if (!elemBelow)
                return;
            const droppableBelow = elemBelow.closest('.droppable');
            if (this.currentDroppable !== droppableBelow) {
                if (this.currentDroppable) {
                    this.leaveDroppable(this.currentDroppable);
                }
                this.currentDroppable = droppableBelow;
                if (this.currentDroppable) {
                    this.enterDroppable(this.currentDroppable);
                }
            }
        };
        document.addEventListener('mousemove', onMouseMove);
        this.clone.onmouseup = () => {
            const previews = document.querySelectorAll(".previewIconBox");
            previews.forEach(preview => {
                preview.classList.remove("dashedPreview");
            });
            document.removeEventListener('mousemove', onMouseMove);
            this.clone.onmouseup = null;
            this.clone.style.transition = '.3s';
            this.element.style.transition = '.3s';
            if (!this.underDroppable) {
                this.clone.style.transform = 'scale(1)';
                this.clone.style.left = this.originX + 'px';
                this.clone.style.top = this.originY + 'px';
            }
            else {
                this.clone.style.left =
                    this.underElement.getBoundingClientRect().left + (this.underElement.offsetWidth - this.clone.offsetWidth) / 2 + 'px';
                this.clone.style.top =
                    this.underElement.getBoundingClientRect().top + (this.underElement.offsetHeight - this.clone.offsetHeight) / 2 + 'px';
                //this.underElement!.style.backdropFilter = "blur(10px)";
                setTimeout(() => {
                    this.clone.style.filter = 'blur(20px)';
                    this.underElement.querySelectorAll(".previewIcon")[0].style.transition = ".2s";
                    this.underElement.querySelectorAll(".previewIcon")[0].style.opacity = "0";
                    this.clone.style.transform = 'scale(.6)';
                    this.underElement.classList.remove('droppableActive');
                }, 200);
                setTimeout(() => { this.underElement.style.backdropFilter = "blur(0px)"; this.underElement.querySelectorAll(".previewIcon")[0].style.opacity = "1"; }, 1300);
                setTimeout(() => this.underElement.querySelectorAll(".previewIcon")[0].style.transition = ".1s", 1500);
            }
            setTimeout(() => (this.clone.style.opacity = '0'), 300);
            setTimeout(() => (this.element.style.opacity = '1'), 200);
            setTimeout(() => { this.clone.remove(); }, 600);
        };
    }
    moveAt(pageX, pageY) {
        this.clone.style.left = pageX - this.shiftX + 'px';
        this.clone.style.top = pageY - this.shiftY + 'px';
    }
    enterDroppable(elem) {
        elem.classList.add('droppableActive');
        this.underDroppable = true;
        this.underElement = elem;
    }
    leaveDroppable(elem) {
        elem.classList.remove('droppableActive');
        this.underDroppable = false;
    }
}
