(function () {
    var plot = new app.Plotter("graph", {planeBorder: [-5, 5, -5, 5]});
    var point2 = plot.addPoint(0, 0, { movable: true });
    var point = plot.addPoint(2, 2, { movable: false });
    plot.removePoint(point.getPointNumber());
    point = plot.addPoint(2, 2, { movable: true });
    plot.removePoint(point.getPointNumber());
})();