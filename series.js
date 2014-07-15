(function () {
    var plot = new app.Plotter("graph", {planeBorder: [-5, 5, -5, 5]});
    var point2 = plot.addPoint(0, 0, { movable: true });
    var point = plot.addPoint(2, 2, { movable: false });
    plot.removePoint(point.getNumber());
    point = plot.addPoint(2, 2, { movable: true });
    plot.removePoint(point.getNumber());

    var line = plot.addLine(0, 0, 1, 1);
    var line2 = plot.addLine(-1, -1, 4, 3);
    setTimeout(function () {
        line.setX1(-2);
        plot.redraw();
    }, 2000);
    plot.removeLine(line2.getNumber());
    console.log("point2 number: " + point2.getNumber());
    //plot.removeLine(line.getNumber());
})();