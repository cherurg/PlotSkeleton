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
            this.width = this.constants.width;
        }

        if (!this.setHeight(options.height)) {
            this.height = this.constants.height;
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

        return objectInformation;
    };

    p.constants = {
        width: 800,
        height: 600
    };
}(app));

