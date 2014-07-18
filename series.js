(function () {
    app.Plotter1 = app.Plotter({});
    var plot = new app.Plotter1("graph", {planeBorder: [-5, 5, -5, 5]});

    function test1() {

        var point2 = plot.addPoint(0, 0, { movable: true });
        var point = plot.addPoint(2, 2, { movable: false });
        plot.removePoint(point.getNumber());
        point = plot.addPoint(2, 2, { movable: true });
        plot.removePoint(point.getNumber());

        var line = plot.addLine(0, 0, 1, 1);
        var line2 = plot.addLine(-1, -1, 4, 3);
        setTimeout(function () {
            line.setX1(-2);
            plot.removeFunc(func1.getNumber());
            area2.setRangeRight(3.7);
            plot.redraw();
            plot.removeGraphArea(area);
        }, 2000);
        plot.removeLine(line2.getNumber());
        console.log("point2 number: " + point2.getNumber());
        //plot.removeLine(line.getNumber());

        var badLine = plot.addLine(1, 1, 1, 2);
        console.log("badLine number: " + badLine.getNumber());

        var func1 = plot.addFunc(Math.cos);
        var func2 = plot.addFunc(function (x) { return x*x; });

        var func3 = plot.addFunc(Math.sin, -20, 20);

        var area = plot.addGraphArea(func2, 0, 1, "x");
        var area2 = plot.addGraphArea(func3, 3.3, 3.5, "y");
        var area3 = plot.addGraphArea(func3, 3.3, 3.5, "x");
    }

    function test2() {
        var t = 0;
        var point = plot.addPoint(Math.cos(t), Math.sin(t), {small: true});
        setInterval(function () {
            t += 0.1;
            point.setX(Math.cos(t));
            point.setY(Math.sin(t));
            point.update();
        }, 40);
    }

    test1();
    //test2();
})();