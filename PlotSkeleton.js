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

        init.call(this);

        this.redraw();
    }

    //Эта переменная нужна для небольшого сокращения названий методов ниже
    var p = Plotter.prototype;

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

    p.redraw = function () {
        var g = self.plot, tx, fx, gx, gxe, ty, fy, gy, gye,
            xTicks,
            yTicks,
            zoom =  d3.behavior.zoom().x(self.x).y(self.y).on("zoom", self.redraw),
            stroke = function (d) {
                return d == 0 || d == -0 ? "#666" : "#ccc";
            };

        tx = function (d) {
            return "translate(" + self.x(d) + ",0)";
        };
        fx = self.x.tickFormat(self.plotTicks);

        xTicks = self.x.ticks(self.plotTicks);
        gx = g.selectAll("g.x")
            .data(xTicks, String)
            .attr("transform", tx);

        gxe = gx.enter().insert("g")
            .attr("class", "x")
            .attr("transform", tx);

        gxe.append("line")
            .attr("stroke", stroke)
            .attr("y1", 0)
            .attr("y2", self.height);

        gxe.append("text")
            .attr("class", "axis")
            .attr("y", self.height)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(fx)
            .style("cursor", "default");
           /* .on("mouseover", function (d) {
                d3.select(this).style("font-weight", "bold");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("font-weight", "normal");
            });*/

        gx.exit().remove();

        ty = function (d) {
            return "translate(0," + self.y(d) + ")";
        };
        fy = self.y.tickFormat(self.plotTicks);

        yTicks = self.y.ticks(self.plotTicks);
        gy = g.selectAll("g.y")
            .data(yTicks, String)
            .attr("transform", ty);

        gye = gy.enter().insert("g")
            .attr("class", "y")
            .attr("transform", ty);

        gye.append("line")
            .attr("stroke", stroke)
            .attr("x1", 0)
            .attr("x2", self.width);

        gye.append("text")
            .attr("class", "axis")
            .attr("x", self.width)
            .attr("dx", "1em")
            .attr("text-anchor", "middle")
            .text(fy)
            .style("cursor", "default");
/*            .on("mouseover", function (d) {
                d3.select(this).style("font-weight", "bold");
            })
            .on("mouseout", function (d) {
                d3.select(this).style("font-weight", "normal");
            });*/

        gy.exit().remove();

        g.call(zoom);
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
            right: 25
        }
    };

    var init = function () {
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
    };

    return Plotter;
}());

