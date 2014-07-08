var app = app || {};    //эта конструкция оставит app прежним, если у глобального объекта уже существует такое свойство
// или создаст новый пустой объект, если app еще не существует.

/**
 * Функция создает локальную область вдимости. Внутрь нее передается переменная app. Функция добавляет в app новые
 * свойства.
 */
(function (app) {
     /**
     * Конструктор объекта Plotter. Служит для рисования графиков. Конструктор инициализируется как свойство app.
     * @param elementID ID DOM-элемента (т.е. элемента в HTML-странице), на котором будет рисоваться график
     * @param options
     */
    app.Plotter = function (elementID, options) {

        this.plotElementID = elementID;

        this.plot = document.getElementById(elementID);
        if (!this.plot) {
            console.log("Нет элемента с id " + elementID);
            return;
        }

        if (!this.setWidth(options.width)) {
            this.width = constants.width;
        }

        if (!this.setHeight(options.height)) {
            this.height = constants.height;
        }

        if (!this.setPlaneBorder(options.planeBorder)) {
            this.planeBorder = constants.planeBorder;
        }

        console.log("Initialization complete");
        console.log(this.toString());
    };

    var p = app.Plotter.prototype;

    p.setWidth = function (width) {
        if (typeof width === "number" && width > 0) {
            this.width = width;
            return width;
        } else {
            console.log("Неверное значение width");
            return null;
        }
    };

    p.getWidth = function () {
        return this.width;
    };

    p.setHeight = function (height) {
        if (typeof height === "number" && height > 0) {
            this.height = height;
            return height;
        } else {
            console.log("Неверное значение height");
            return null;
        }
    };

    p.getHeight = function () {
        return this.height;
    };

    p.getPlotElementID = function () {
        return this.plotElementID;
    };

    p.toString = function () {
        var objectInformation = "";

        objectInformation += "Width: " + this.getWidth();
        objectInformation += "\n" + "Height: " + this.getHeight();
        objectInformation += "\n" + "ElementID: " + this.getPlotElementID();
        objectInformation += "\n" + "Plane border: " + this.getPlaneBorder();

        return objectInformation;
    };

    /**
     * Устанавливает границу прорисовки графика по осям
     * @param planeBorder - состоит из 4-х чисел. Левая граница, правая граница, нижняя граница, верхняя граница.
     */
    p.setPlaneBorder = function (planeBorder) {
        const length = 4;
        var i,
            a = planeBorder;

        //Если это не массив или длина != 4 или нарушено взаимное положение границ, то ничего не присваивать.
        if (!Array.isArray(a) || a.length !== length || !(a[1] > a[0] && a[3] > a[2])) {
            return false;
        }

        this.planeBorder = [];
        for (i = 0; i < length; i += 1) {
            if (typeof a[i] === "number") {
                this.planeBorder.push(a[i]);
            } else {
                console.log("Массив границ прорисовки должен состоять только из чисел");
            }
        }

        return true;
    };

    p.getPlaneBorder = function () {
        return this.planeBorder;
    };

    p.getConstants = function () {
        return constants;
    };

    var constants = {
        width: 800,
        height: 600,
        planeBorder: [-10, 10, -5, 5]
    };
}(app));

