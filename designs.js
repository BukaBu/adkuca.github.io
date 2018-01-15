$(function() {
    const pCanvas = document.getElementById('pixel-canvas');
    const pHeight = document.getElementById('input-height');
    const pWidth = document.getElementById('input-width');
    const cellHeightWidth = document.getElementById('input-res');
    const colorPicker = document.getElementById('color-input');
    const form = document.getElementById('size-picker');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');
    const btn4 = document.getElementById('btn4');
    const btn5 = document.getElementById('btn5');
    const btn6 = document.getElementById('btn6');
    const btn7 = document.getElementById('btn7');
    const cpH = $('#color-picker-div');
    const checkbox1 = document.getElementById('checkbox1');
    const checkbox2 = document.getElementById('checkbox2');
    const header = document.getElementById('grid');
    const sticky = header.offsetTop;
    const grid = $('#grid');
    const line = $('#vline-container');
    const inputs = document.getElementsByClassName('num-inputs');
    const cells = document.getElementsByTagName('td');
    checkbox1.checked = true;
    checkbox2.checked = true;
    btn1.disabled = true;
    btn2.disabled = true;
    const maxValue = 70;
    pHeight.setAttribute('max', '70');
    pWidth.setAttribute('max', '70');
    cellHeightWidth.setAttribute('max', '70');
    let coloredCells = [];
    let uncoloredCells = [];
    let allCells = [];
    colorPicker.value = '#a16aa1';

    /** ASSIGNING Custom COLOR-PICKER **/
    cpH.ColorPicker({flat: true});
    cpH.ColorPickerSetColor(colorPicker.value);
    const cp = $('.colorpicker');
    const divs = cp.find('div');
    const colorPickerCurrent = $('.colorpicker_current_color');
    const colorPickerNew = $('.colorpicker_new_color');
    const colorPickerColor = $('.colorpicker_color');
    const colorPickerInputs = cp.find('input');
    const colorPickerScrolls = cp.find('span');
    const colorPickerHue = $('.colorpicker_hue').find('div');

    /** EVENT HANDLERS/LISTENERS TO MAKE THE CUSTOM COLOR-PICKER DRAGGABLE cpH **/
    divs.addClass(' childs');
    cpH.mouseover(function() {
        cpH.draggable({cancel: '.childs', cursor: 'grab'});
        divs.on('dragstart', function(event) { event.preventDefault(); }); //prevents colored elements to be dragged
    });
    /** EVENT HANDLERS TO APPLY CURRENT SELECTED COLOR OF THE CUSTOM COLOR-PICKER TO THE STANDARD ONE **/
    colorPickerCurrent.on('click', function () {
        colorPicker.value = rgbToHex(colorPickerCurrent.css('background-color'));
    });
    colorPickerHue.on('mousedown', function() {
        colorPickerHue.on('mousemove', function() {
            colorPicker.value = rgbToHex(colorPickerNew.css('background-color'));
        });
    });
    colorPickerInputs.on('change', function() {
        colorPicker.value = rgbToHex(colorPickerNew.css('background-color'));
    });
    colorPickerScrolls.on('mousedown', function() {
        colorPickerScrolls.on('mousemove', function() {
            colorPicker.value = rgbToHex(colorPickerNew.css('background-color'));
        })
    });
    colorPickerColor.on('mousedown', function() {
        colorPickerColor.on('mousemove', function(evt) {
            if (evt.buttons === 1) {
                colorPicker.value = rgbToHex(colorPickerNew.css('background-color'));
            }
        });
    });
    /** RGB TO HEX CONVERTER **/
    function rgbToHex(rgb) {
        if (rgb.substr(0, 1) === '#') {
            return rgb;
        }
        let digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(rgb);
        let red = parseInt(digits[2]);
        let green = parseInt(digits[3]);
        let blue = parseInt(digits[4]);
        let color = blue | (green << 8) | (red << 16);
        return digits[1] + '#' + color.toString(16);
    }
    /** EVENT HANDLERS TO APPLY CURRENT SELECTED COLOR OF THE STANDARD COLOR-PICKER TO THE CUSTOM ONE **/
    colorPicker.addEventListener('change', function() {
        cpH.ColorPickerSetColor(colorPicker.value);
    });
    /** DISABLES THE ACCIDENTAL DRAG OF IMAGES AND THE CONTEXT MENU ON PIXEL-CANVAS AND COLOR-PICKER **/
    pCanvas.ondragstart = function() { return false; };
    pCanvas.oncontextmenu = function() { return false; };
    document.getElementById('color-picker-div').oncontextmenu = function() { return false; };

    /** EVENT HANDLERS MAKING SURE THE VALUE OF THE 3 INPUT FIELDS STAYS BELOW maxValue (80) **/
    pHeight.addEventListener('change', function() {
       if (this.value > maxValue) { //using pHeight.getAttribute('max') on place of maxValue would't work for some reason ;D
           this.value = pHeight.getAttribute('max');
       }
    });
    pWidth.addEventListener('change', function() {
        if (this.value > maxValue) {
            this.value = pWidth.getAttribute('max');
        }
    });
    /** THE CELL SIZE INPUT FIELD CHANGES THE CELL Height AND Width ON CHANGES**/
    cellHeightWidth.addEventListener('change', function() {
        if (this.value > maxValue) {
            this.value = cellHeightWidth.getAttribute('max');
        }
        for (let i = 0; i < pCanvas.rows.length; i++) {
            pCanvas.rows[i].style.height = cellHeightWidth.value + 'px';
            for (let j = 0; j < pCanvas.rows[i].cells.length; j++) {
                pCanvas.rows[i].cells[j].style.height = cellHeightWidth.value + 'px';
                pCanvas.rows[i].cells[j].style.width = cellHeightWidth.value + 'px';
            }
        }
    });
    /** EVENT HANDLERS ON SUBMIT AND BUTTONS **/
    form.addEventListener('submit', function(evt) {
        evt.preventDefault();
        removeGrid();
        makeGrid();
    });
    btn1.addEventListener('click', function(evt) {
        evt.preventDefault();
        clearGrid();
    });
    btn2.addEventListener('click', function (evt) {
        evt.preventDefault();
        removeGrid();
    });
    btn3.addEventListener('click', function (evt) {
        evt.preventDefault();
        colorPixelCanvasGrid();
    });
    btn4.addEventListener('click', function (evt) {
        evt.preventDefault();
        colorPixelCanvasBg();
    });
    btn5.addEventListener('click', function (evt) {
        evt.preventDefault();
        colorColoredCells();
    });
    btn6.addEventListener('click', function(evt) {
        evt.preventDefault();
        colorUncoloredCells();
    });

    btn7.addEventListener('click', function(evt) {
        evt.preventDefault();
        colorAllCells();
    });

    checkbox1.addEventListener('change',function() {
        this.checked ? cpH.draggable('enable') : cpH.draggable('disable');
    });
    checkbox2.addEventListener('change',function() {
        this.checked ? grid.fadeIn() : grid.fadeOut();
        this.checked ? line.fadeIn() : line.fadeOut();
    });

    /** FUNCTION THAT READS COLORED/UNCOLORED CELLS AND SAVES THEM INTO APPROPRIATE ARRAY **/
    function reloadCells() {
        coloredCells = [];
        uncoloredCells = [];
        allCells = [];
        for (let i = 0; i < cells.length; i++) {
            allCells.push(cells[i]);
            if (cells[i].style.backgroundColor !== '') {
                coloredCells.push(cells[i]);
            } else {
                uncoloredCells.push(cells[i]);
            }
        }
    }
    /** FUNCTION THAT DISABLES/ENABLES THE TWO BUTTONS DEPENDING WHETHER THERE IS A GRID / COLORED CELLS **/
    function btn1Clickable() {
        reloadCells();
        coloredCells.length ? btn1.disabled = false : btn1.disabled = true;
    }
    function btn2Clickable() {
        pCanvas.hasChildNodes() ? btn2.disabled = false : btn2.disabled = true;
    }


    /** FOO NAMES... **/
    function colorColoredCells() {
        reloadCells();
        coloredCells.forEach(function (cell) {
            cell.style.backgroundColor = colorPicker.value;
        })
    }
    function colorUncoloredCells() {
        reloadCells();
        uncoloredCells.forEach(function (cell) {
            cell.style.backgroundColor = colorPicker.value;
        })
    }
    function colorAllCells() {
        reloadCells();
        allCells.forEach(function (cell) {
            cell.style.backgroundColor = colorPicker.value;
        })
    }
    function colorPixelCanvasBg() {
        pCanvas.style.backgroundColor = colorPicker.value;
    }
    function colorPixelCanvasGrid() {
        reloadCells();
        allCells.forEach(function (cell) {
            cell.style.borderColor = colorPicker.value;
        })
    }
    function clearPixelCanvasGrid() {
        allCells.forEach(function (cell) {
            cell.style.borderColor = 'transparent';
        })
    }
    function clearCanvasBackground() {
        pCanvas.style.backgroundColor = 'transparent';
    }
    function clearGrid () {
        reloadCells();
        allCells.forEach(function (cell) {
           cell.style.backgroundColor = '';
        });
        clearPixelCanvasGrid();
        clearCanvasBackground();
        btn1Clickable();
    }
    function removeGrid() {
        while (pCanvas.firstChild) {
            pCanvas.removeChild(pCanvas.firstChild);
        }
        clearCanvasBackground();
        btn1Clickable();
        btn2Clickable();
    }
    function cellHW (row, cell) {
        row.style.height = cellHeightWidth.value + 'px';
        cell.style.width = cellHeightWidth.value + 'px';
        cell.style.height = cellHeightWidth.value + 'px';
    }
    function makeGrid() {
        for (let i = 0; i < pHeight.value; i++) {
            const row = pCanvas.insertRow(i);
            for (let j = 0; j < pWidth.value; j++) {
                const cell = row.insertCell(j);
                cellHW(row, cell);
            }
        }
        btn1Clickable();
        btn2Clickable();
    }
    
    pCanvas.addEventListener('mousedown', cellClickAddColor);
    pCanvas.addEventListener('mouseover', cellHoverAddColor);

    /** ADDS/CLEARS COLOR OF A CELL ON A MOUSEDOWN, ADDS WITH RMB, CLEARS WITH RMB **/
    function cellClickAddColor (evt) {
            if (evt.button === 0) {
                evt.target.style.backgroundColor = colorPicker.value;
            } else if (evt.button === 2) {
                evt.target.style.backgroundColor = '';
            }
            btn1Clickable();
    }
    /** ADDS/CLEARS COLOR OF A CELL ON A MOUSEOVER, ADDS WITH RMB, CLEARS WITH RMB **/
    function cellHoverAddColor (evt) {
            if (evt.buttons === 1 && !(evt.target === pCanvas)) {
                evt.target.style.backgroundColor = colorPicker.value;
            } else if (evt.buttons === 2 && !(evt.target === pCanvas)) {
                evt.target.style.backgroundColor = '';
            }
            btn1Clickable();
    }
    /** ADDS/REMOVES CLASS TO THE 'lamp' WHILE SCROLLING UP/DOWN SO IT STICKS ON TOP **/
    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= sticky) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    /** EVENT HANDLERS THAT ADDS/REMOVES GLOW CLASS ON CERTAIN ELEMENTS **/
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function() {return light(true, inputs[i])});
        inputs[i].addEventListener('focusout', function() {return light(false, inputs[i])});
        inputs[i].addEventListener('mousedown', function() {inputs[i].focus()});
    }

    function light (bool, inputs) {
        if (bool) {
            inputs.classList.add('focus-input');
            inputs.parentElement.parentElement.classList.add('focus-rest');
            inputs.parentElement.querySelector('p').classList.add('focus-rest');
            inputs.parentElement.querySelector('hr').classList.add('focus-rest');
        } else {
            inputs.classList.remove('focus-input');
            inputs.parentElement.parentElement.classList.remove('focus-rest');
            inputs.parentElement.querySelector('p').classList.remove('focus-rest');
            inputs.parentElement.querySelector('hr').classList.remove('focus-rest');
        }
    }

    /** TURNS HEADER GLOW ON/OFF **/
    document.getElementById('header-text').addEventListener('click', function() {
        this.classList.contains('header-glow') ? this.classList.remove('header-glow') : this.classList.add('header-glow');
    });
});
