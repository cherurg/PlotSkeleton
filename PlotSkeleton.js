var app = app || {};    //эта конструкция оставит app прежним, если у глобального объекта уже существует такое свойство
// или создаст новый пустой объект, если app еще не существует.

/**
 * Функция создает локальную область вдимости. Внутрь нее передается переменная app. Функция добавляет в app новые
 * свойства.
 */
app.Plotter = function (self) {
    var p = Plotter.prototype,     //Эта переменная нужна для небольшого сокращения названий методов ниже
    defaults = {
        width: 800,
        height: 600,
        planeBorder: [-10, 10, -5, 5],
        plotTicks: 10,
        margin: {
            bottom: 20,
            right: 30
        },
        magicDrawingRange: 1.2,
        pointRadius: 5,
        graphAccuracy: 300
    },
    arrayNamesToInit = [
        "points",
        "lines",
        "functions"
    ];

    /**
     * Конструктор объекта Plotter. Служит для рисования графиков. Конструктор инициализируется как свойство app.
     * @param elementID ID DOM-элемента (т.е. элемента в HTML-странице), на котором будет рисоваться график
     * @param options
     */
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
        var length = 4,
            a = planeBorder,
            i;

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

        var gx, fx, fy, gxe, gy, gye, xTicks, yTicks,
            g = self.plot,
            zoom = d3.behavior.zoom().x(self.x).y(self.y).on("zoom", self.redraw);


        fx = self.x.tickFormat(self.plotTicks);

        xTicks = self.x.ticks(self.plotTicks).map(function (d) {
            return Math.abs(d) < 1e-10 ? 0 : d;
        });
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

        yTicks = self.y.ticks(self.plotTicks).map(function (d) {
            return Math.abs(d) < 1e-10 ? 0 : d;
        });
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
            point.element
                .attr("cx", self.x(point.x))
                .attr("cy", self.y(point.y));
            if (point.movable) {
                (function (point) {
                    point.element
                        .call(d3.behavior.drag()
                            .on("drag", function () {
                                var cx = point.element.attr("cx"),
                                    cy = point.element.attr("cy"),
                                    dx = d3.event.dx,
                                    dy = d3.event.dy;

                                point.element
                                    .attr("cx", +cx + dx)
                                    .attr("cy", +cy + dy);

                                point.x = self.x.invert(point.element.attr("cx"));
                                point.y = self.y.invert(point.element.attr("cy"));
                            }));
                })(point);
            }
        }

        length = self.lines.length;
        var line;
        for (i = 0; i < length; i += 1) {
            line = self.lines[i];
            line.element
                .attr("x1", self.x(line.x1))
                .attr("x2", self.x(line.x2))
                .attr("y1", self.y(line.y1))
                .attr("y2", self.y(line.y2));
        }

        length = self.functions.length;
        var func;
        for (i = 0; i < length; i += 1) {
            func = self.functions[i];
            func.element
                .attr("d", func.path(func.points));
        }

        (function order() {
            self.graphPlace.each(function () {
                this.parentNode.insertBefore(this);
            });

            self.points.forEach(function (e) {
                e.element.each(function () {
                    this.parentNode.insertBefore(this);
                })
            });
        })();
     };

    function findElement(n, arr) {
        var o = arr.filter(function (d) {
            return d.number == n;
        })[0];

        return o ? o : false;
    }
    function removeElement(n, arr, name) {
        var o = findElement(n, arr);
        if (!o) {
            console.log("Нет " + name + " с номером " + n);
            return false;
        }
        o.element.remove();
        arr.splice(arr.indexOf(o), 1);
        return true;
    }
    (function Point() {
        var number = 0;
        p.addPoint = function (x, y, options) {
            var pointElement = self.graphPlace
                    .append("circle")
                    .attr("class", function () {
                        return "point num" + number;
                    })
                    .attr("cx", self.x(x))
                    .attr("cy", self.y(y))
                    .attr("r", defaults.pointRadius)
                    .attr("fill", "red"),
                point = {
                    x: x,
                    y: y,
                    options: options,
                    number: number++,
                    element: pointElement
                };
            if (options && options.movable === true) {
                point.movable = true;
            }
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
            function getNumber() {
                return point.number;
            }

            return {
                getNumber: getNumber,

                getX: getX,
                setX: setX,

                getY: getY,
                setY: setY
            };
        };
        p.removePoint = function (pointNumber) {
            return removeElement(pointNumber, self.points, "point");
        };
    })();
    (function Line() {
        var number = 0;

        p.addLine = function (x1, y1, x2, y2, options) {
            var line = {};
            line.tornLeft = false;
            line.tornRight = false;
            line.k = (y2 - y1) / (x2 - x1);
            line.func = (function (x1, y1, x2, y2, k) {
                var f = function (x) {
                    return k * (x - x1) + y1;
                };
                return k ? f : function () { return undefined; }
            })();
            line.x1 = x1;
            line.x2 = x2;
            line.y1 = y1;
            line.y2 = y2;
            line.number = number++;

            line.element = self.graphPlace
                .append("line")
                .attr("class", function () {
                    return "line num" + line.number;
                })
                .attr("x1", self.x(x1))
                .attr("x2", self.x(x2))
                .attr("y1", self.y(y1))
                .attr("y2", self.y(y2))
                .attr("style", "stroke:rgb(0,0,0);stroke-width:2");

            if (options && options.tornLeft === true) {
                line.tornLeft = true;
            }

            if (options && options.tornRight === true) {
                line.tornRight = true;
            }

            self.lines.push(line);

            if (line.tornLeft || line.tornRight) {
                updateLine(line.number);
            }

            function getX1() {
                return line.x1;
            }
            function setX1(x1) {
                if (typeof x1 === "number") {
                    line.x1 = x1;
                    return true;
                }

                return false;
            }
            function getX2() {
                return line.x2;
            }
            function setX2(x2) {
                if (typeof x2 === "number") {
                    line.x2 = x2;
                    return true;
                }

                return false;
            }
            function getY1() {
                return line.y1;
            }
            function setY1(y1) {
                if (typeof y1 === "number") {
                    line.y1 = y1;
                    return true;
                }

                return false;
            }
            function getY2() {
                return line.y2;
            }
            function setY2(y2) {
                if (typeof y2 === "number") {
                    line.y2 = y2;
                    return true;
                }

                return false;
            }
            function getNumber() {
                return line.number;
            }
            function getFunc() {
                return line.func;
            }

            return {
                getX1: getX1,
                setX1: setX1,
                getX2: getX2,
                setX2: setX2,
                getY1: getY1,
                setY1: setY1,
                getY2: getY2,
                setY2: setY2,
                getNumber: getNumber,
                getFunc: getFunc
            }
        };

        var updateLine = function (n) {
/*            var line = findElement(n, self.lines);
            line.element.remove();
            */
        };

        p.removeLine = function (lineNumber) {
            return removeElement(lineNumber, self.lines, "line");
        }
    })();
    (function Func() {
        var number = 0;
        p.addFunc = function (func, rangeLeft, rangeRight) {
            var i, step, x, y, d3line,
                _rangeLeft = Math.max(self.x.domain()[0], rangeLeft ? rangeLeft : Number.NEGATIVE_INFINITY),
                _rangeRight = Math.min(self.x.domain()[1], rangeRight ? rangeRight : Number.POSITIVE_INFINITY),
                points = [],
                length = defaults.graphAccuracy,
                _ = {};

            _.number = number++;
            _.func = func;

            _rangeLeft *= defaults.magicDrawingRange;
            _rangeRight *= defaults.magicDrawingRange;
            step = (_rangeRight - _rangeLeft)/length;
            x = _rangeLeft;
            for (i = 0; i < length; i += 1) {
                y = func(x);
                points.push([x, y]);
                x += step;
            }
            _.points = points;

            d3line = d3.svg.line()
                .x(function (d) {
                    return self.x(d[0]);
                })
                .y(function (d) {
                    return self.y(d[1]);
                });

            _.element = self.graphPlace
                .append("path")
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", "#000000")
                .attr("class", function () {
                    return "function num" + _.number;
                })
                .attr("d", d3line(points));
            _.path = d3line;

            self.functions.push(_);

            function getFunc() {
                return _.func;
            }
            function getPoints() {
                return _.points;
            }
            function getNumber() {
                return _.number;
            }

            return {
                getFunc: getFunc,
                getPoints: getPoints,
                getNumber: getNumber
            }
        };
        p.removeFunc = function (funcNumber) {
            return removeElement(funcNumber, self.functions, "function");
        };
    })();

    Plotter.getDefaults = function () {
        return defaults;
    };

    function init() {
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

        this.graphPlace = this.plot
            .append("svg")
            .attr("width", self.width)
            .attr("height", self.height)
            .attr("viewBox", "0 0 " + self.width + " " + self.height);

        var i, name,
            length = arrayNamesToInit.length;
        for (i = 0; i < length; i += 1) {
            name = arrayNamesToInit[i];
            this[name] = this[name] || [];
        }
    }

    return Plotter;
};