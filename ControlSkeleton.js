var app = app || {};

app.Controls = function (id) {
    this.elem = document.getElementById(id);

    this.buttonsNumber = 0;
    this.rangeNumber = 0;
};

app.Controls.prototype.addButton = function (callback, text) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.addEventListener("click", callback);
    var div = document.createElement("div");
    div.appendChild(button);
    this.elem.appendChild(div);

    this.buttons = this.buttons || [];
    this.buttons.push({
        number: this.buttonsNumber++,
        button: div
    });
};

app.Controls.prototype.addRange = function (callback, text, left, right, step, value) {
    var div = document.createElement("div"),
        t = document.createElement("p"),
        range = document.createElement("input");
    t.innerHTML = text;
    div.appendChild(t);

    range.setAttribute("type", "range");
    range.setAttribute("min", left);
    range.setAttribute("max", right);
    range.setAttribute("step", step);
    range.setAttribute("value", value);
    range.addEventListener("input", function () {
        var value = range.value;
        callback(value);
    });

    div.appendChild(range);
    this.elem.appendChild(div);

    this.ranges = this.ranges || [];
    this.ranges.push({
        number: this.rangeNumber++,
        range: div
    });

    return div;
};