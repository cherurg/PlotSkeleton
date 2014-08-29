(function (id, id2) {
    //app.Plotter1 = app.Plotter({});
    var plot = Plotter(id, {
        planeBorder: [-5, 5, -5, 5]/*,
        click: function (x, y) {
            plot.addPoint(x, y, {movable: true});
        }*/
    });
    //раскомментируйте эту строчку, если нужен второй график
    //var plot2 = Plotter(id2);

    function example1() {

        var point2 = plot.addPoint(0, 0, { movable: true });
        var point = plot.addPoint(2, 2, { movable: false });
        plot.removePoint(point.getNumber());
        point = plot.addPoint(2, 2, { movable: true });
        plot.removePoint(point.getNumber());

        var line = plot.addLine(0, 0, 1, 1);
        var line2 = plot.addLine(-1, -1, 4, 3, { color: 5, width: 10 });
        plot.setTimeout(function () {
            line.setX1(-2);
            line.setY1(-3);
            plot.removeFunc(func1.getNumber());
            area2.setRangeRight(3.7);
            plot.redraw();
            plot.removeGraphArea(area);
        }, 2000);
        //plot.removeLine(line2.getNumber());
        console.log("point2 number: " + point2.getNumber());
        //plot.removeLine(line.getNumber());

        var badLine = plot.addLine(1, 1, 1, 2);
        console.log("badLine number: " + badLine.getNumber());

        var func1 = plot.addFunc(Math.cos);
        var func2 = plot.addFunc(function (x) {
            return x * x;
        });

        var func3 = plot.addFunc(Math.sin, -20, 20);

        var area = plot.addGraphArea(func2, 0, 1, "x");
        var area2 = plot.addGraphArea(func3, 3.3, 3.5, "y");
        var area3 = plot.addGraphArea(func3, 3.3, 3.5, "x");
    }

    function example2() {
        var t = 0;
        var point = plot.addPoint(Math.cos(t), Math.sin(t), {size: "tiny"});
        var a = plot.setInterval(function () {
            t += 0.1;
            if (t > 1) {
                clearInterval(a);
            }
            point.setX(Math.cos(t));
            point.setY(Math.sin(t));
            point.update();
        }, 40);
    }

    function example3() {
        var line = plot.addLine(0, 0, 2, 2);
        var point = plot.addPoint(1, 1, { movable: line });
    }

    function example4() {
        var controls = new app.Controls("controls");
        controls.addButton(function () {
            alert("hello, world!");
        }, "hello?");

        controls.addRange(function (value) {
            console.log(value);
        }, "Ползунок:", 0, 10, 0.01, 0);
    }

    function example5() {
        var line = plot.addLine(0, 0, 1, 2);
        var func = plot.addFunc(Math.cos, -20, 20);
        var areaX = plot.addGraphArea(func, 3.3, 3.5, "x");
        var areaY = plot.addGraphArea(func, 3.3, 3.5, "y");

        setTimeout(function () {
            line.setY1(5);
            line.setY2(-5);

            areaX.setRangeRight(3.7);
            areaY.setRangeRight(3.7);

            plot.redraw();
        }, 2000);
    }

    function example6() {
        var controls = new app.Controls("controls");
        controls.addCheckbox(function () {
                alert("checked");
            }, function () {
                alert("unchecked");
            },
            false,
            "hello");

        controls.addButton(function () {
            alert("hello, world!");
        }, "hello?");
    }

    function example7() {
        plot.addPoint(1, 1, {
            onclick: function () {
                alert("hello");
            }
        });
    }

    function example8() {
        var controls = new app.Controls("controls");

        var func = plot.addFunc(Math.sin);

        controls.addRange(function (value) {
            plot.removeFunc(func);
            func = plot.addFunc(function (x) {
                return Math.sin(x) * value;
            });
        }, "Ползунок:", 0, 10, 0.01, 1);
    }

    function example9() {
        var func = plot.addFunc(function (x) {
            return 3;
        }, 1, 2, { color: 1, width: 1 });
        var graphArea = plot.addGraphArea(func, 1, 2, "x");
    }

    function example10() {
        var controls = new app.Controls("controls");

        controls.addButton(function () {
        }, "hello");
        controls.addRange(function () {
        }, "Привет!", 10, 12, 0.1, 11);
        controls.addCheckbox(function () {
        }, function () {
        }, true, "checkbox");

        var plot2 = Plotter("new_graph");
        var controls2 = new app.Controls("new_controls");
        controls2.addText("Какой-то текст");
        controls2.addText("Какой-то другой текст с переносом", {newLine: true});

        var smartControl = controls2.addRange(function (value) {
            smartControl.setText("Значение ползунка: " + value);
        }, "Значение ползунка: 0", 0, 10, 1, 0);
    }

    function example11() {
        var arr = [];
        arr.push([0, 0]);
        arr.push([1, 0]);
        arr.push([1, 1]);
        arr.push([0, 1]);

        var arr1 = [];
        arr1.push([1, 0]);
        arr1.push([2, 0]);
        arr1.push([2, 1]);


        var rect = plot.addFigure(arr, {color: 2});
        plot.addFigure(arr1, {color: 3});

        setTimeout(function () {
            plot.removeFigure(rect);
            plot.redraw();
        }, 3000);
        setTimeout(function () {
            plot.addFigure(arr);
        }, 4000);
    }

    function example12() {
        var controls = new app.Controls("controls");
        var text = controls.addText("Привет!");
        var b = controls.addButton(function () {
        }, "0");
        var i = 0;
        setInterval(function () {
            i += 1;
            text.setText(i);
            b.setText(i);
        }, 1000);

        controls.addRange(function () {
        }, "Ползунок", 0, 10, 1, 1);
        controls.addText("", {newLine: true});
        controls.addRange(function () {
        }, "Ползунок", 0, 10, 1, 1);
    }

    //example1();
    //example2();
    //example3();
    //example4();
    //example5();
    //example6();
    //example7();
    //example8();
    //example9();
    //example10();
    //example11();
    example12();

})("graph", "new_graph");