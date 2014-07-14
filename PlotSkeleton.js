var app = app || {};    //эта конструкция оставит app прежним, если у глобального объекта уже существует такое свойство
// или создаст новый пустой объект, если app еще не существует.

/**
 * Функция создает локальную область вдимости. Внутрь нее передается переменная app. Функция добавляет в app новые
 * свойства.
 */
app.Plotter = (function () {
    /**
     * Конструктор объекта Plotter. Служит для рисования графиков. Конструктор инициализируется как свойство app.
     * @param elementID ID DOM-элемента (т.е. элемента в HTML-странице), на котором будет рисоваться график
     * @param options
     */
    var self;

    function Plotter(elementID, options) {
        var field,
            setter;

        self = this;

        if (typeof elementID !== "string") {
            console.log("elementID должен быть строкой");
            return;
        }
        this.plotElementID = elementID;
        this.plot = d3.select("#" + elementID);
        if (!this.plot[0][0]) {
            console.log("Нет элемента с id " + elementID);
            return;
        }

        //Если options существует, то не трогать его. Если он undefined, то присвоить options пустой объект.
        options = options || {};
        //Внутри цикла встречаются конструкции вроде this[field]. this - это объект, а field - имя поля, к которому
        // нужен доступ. Это второй из возможных способо обращения к полям объекта. Этот способ очень удобен в
        // динамических задачах. Например, здесь используются все свойства из options, которые могут быть у Plotter и
        // отбрасываются все остальные. Для работы этой конструкции необходимо всего лишь гарантировать что у каждого
        // поля из defaults (объект объявлен ниже) есть свой сеттер в объекте Plotter.
        for (field in defaults) {
            //Стандартная проверка при перечислении свойств объекта. Ее нужно делать каждый раз при перечислении свойств
            // объекта. Некоторые свойства могут быть не собственными свойствами, а унаследованными.
            if (!defaults.hasOwnProperty(field)) {
                continue;
            }
            //Если у options нет такого поля, то Plotter'у нужно устанавить соответсвующее свойство стандартным.
            if (!options.hasOwnProperty(field)) {
                this[field] = defaults[field];
                continue;
            }
            //Синтезирование имени сеттера по имени поля. Соглашение Java об именовании (оно применимо и к JS тоже)
            // говорит, что сеттер для поля "имяПоля" должен иметь имя "set[ИмяПоля]". Обратите внимание на регистр.
            setter = "set" + field[0].toUpperCase() + field.substr(1);
            //Вызвать сеттер с соответсвующим аргументом из options.
            this[setter](options[field]);
        }

        console.log("Initialization complete");
        console.log(this.toString());

        this.initialized = false;
        this.redraw();
    }

    //Эта переменная нужна для небольшого сокращения названий методов ниже
    var p = Plotter.prototype;

    p.setWidth = function (width) {
        if (typeof width === "number" && width > 0) {
            this.initialized = false;
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
            this.initialized = false;
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

        objectInformation += "ElementID: " + this.getPlotElementID();
        objectInformation += "\n" + "Width: " + this.getWidth();
        objectInformation += "\n" + "Height: " + this.getHeight();
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

        this.initialized = false;
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

    Plotter.redrawUtilites = {
        tx: function (d) {
            return "translate(" + self.x(d) + ",0)";
        },
        ty: function (d) {
            return "translate(0," + self.y(d) + ")";
        },
        stroke: function (d) {
            return d ? "#ccc" : "#666";
        },
        stroke_width: function (d) {
            return d ? "1" : "2";
        }
    };

    p.redraw = function () {
        if (!self.initialized) {
            init.call(self);
            self.initialized = true;
        }

        var g = self.plot, gx, fx, gxe, ty, gy, gye,
            xTicks,
            yTicks,
            zoom =  d3.behavior.zoom().x(self.x).y(self.y).on("zoom", self.redraw);


        fx = self.x.tickFormat(self.plotTicks);

        xTicks = self.x.ticks(self.plotTicks).map(function (d) { return Math.abs(d) < 1e-10 ? 0 : d; });
        gx = g.selectAll("g.x")
            .data(xTicks, String)
            .attr("transform", Plotter.redrawUtilites.tx);

        gxe = gx.enter().insert("g")
            .attr("class", "x")
            .attr("transform", Plotter.redrawUtilites.tx);

        gxe.append("line")
            .attr("stroke", Plotter.redrawUtilites.stroke)
            .attr("stroke-width", Plotter.redrawUtilites.stroke_width)
            .attr("y1", 0)
            .attr("y2", self.height);

        gxe.append("text")
            .attr("class", "axis")
            .attr("y", self.height)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(fx)
            .style("cursor", "default");

        gx.exit().remove();

        fy = self.y.tickFormat(self.plotTicks);

        yTicks = self.y.ticks(self.plotTicks).map(function (d) { return Math.abs(d) < 1e-10 ? 0 : d; });
        gy = g.selectAll("g.y")
            .data(yTicks, String)
            .attr("transform", Plotter.redrawUtilites.ty);

        gye = gy.enter().insert("g")
            .attr("class", "y")
            .attr("transform", Plotter.redrawUtilites.ty);

        gye.append("line")
            .attr("stroke", Plotter.redrawUtilites.stroke)
            .attr("stroke-width", Plotter.redrawUtilites.stroke_width)
            .attr("x1", 0)
            .attr("x2", self.width);

        gye.append("text")
            .attr("class", "axis")
            .attr("x", self.width)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .text(fy)
            .style("cursor", "default");

        gy.exit().remove();

        g.call(zoom);

        var i, length = self.points.length, point;
        for (i = 0; i < length; i += 1) {
            point = self.points[i];
            point.pointElement
                .attr("cx", self.x(point.x))
                .attr("cy", self.y(point.y));
        }
    };

    var pointsNumber = 0;
    p.addPoint = function (x, y, options) {
        var pointElement = this.plot
            .append("circle")
            .attr("class", function () { return "point num" + pointsNumber;})
            .attr("cx", self.x(x))
            .attr("cy", self.y(y))
            .attr("r", 5)
            .attr("color", "red"),
            point = {
            x: x,
            y: y,
            options: options,
            pointNumber: pointsNumber++,
            pointElement: pointElement
        };
        this.points.push(point);
        self.redraw();

        function getX() {
            return point.x;
        }
        function setX(x) {
            if (typeof x === "number") {
                point.x = x;
                return true;
            }

            return false;
        }
        function getY() {
            return point.y;
        }
        function setY(y) {
            if (typeof y === "number") {
                point.y = y;
                return true;
            }

            return false;
        }


        return {
            getPointNumber: function () { return pointsNumber; },

            getX: getX,
            setX: setX,

            getY: getY,
            setY: setY
        };
    };
    p.removePoint = function (pointNumber) {
        var point = self.points.filter(function (d) { return d.pointNumber == pointNumber; })[0];
        point.pointElement.remove();
        self.points.splice(self.points.indexOf(point), 1);
    };

    Plotter.getDefaults = function () {
        return defaults;
    };

    var defaults = {
        width: 800,
        height: 600,
        planeBorder: [-10, 10, -5, 5],
        plotTicks: 10,
        margin: {
            bottom: 20,
            right: 30
        }
    };

    var init = function () {
        d3.select("#" + this.plotElementID)[0][0].innerHTML = "";
        this.plot = d3.select("#" + this.plotElementID);

        this.x = d3.scale.linear()
            .domain(self.planeBorder.slice(0, 2))
            .range([0, self.width]);
        this.y = d3.scale.linear()
            .domain(self.planeBorder.slice(2, 4).reverse())
            .range([0, self.height]);

        this.plot = this.plot
            .append("svg")
            .attr("width", self.width + self.margin.right)
            .attr("height", self.height + self.margin.bottom);
        this.plot
            .append("rect")
            .attr("width", self.width)
            .attr("height", self.height)
            .attr("stroke-width", 1)
            .attr("stroke", "#000000")
            .attr("fill-opacity", 0);

        this.points = this.points || [];
    };

    return Plotter;
}());