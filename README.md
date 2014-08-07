PlotSkeleton
============

Обертка для построения графиков
============

Plotter(elementID, options)
Конструктор, создающий координатную плоскость. 
elementID - строка, ID элемента в дереве HTML-документа, который превратится в график.
options - необязательный аргумент, объект (напомню, что объект создается с помощью литерала {}), свойства которого описывают некоторые параметры графика. Возможные свойства их значения по-умолчанию (если вы не указываете какое-то свойство, то оно остается со своим значением):

        magicFunctionTop: 100000, - не рекомендуется менять. ограничивает высоту прорисовки функции сверху и снизу

        width: 800, - ширина координатной плоскости в пискелях

        height: 600, - высота

        planeBorder: [-10, 10, -5, 5], - границы несмещенной координатной плоскости. Здесь x изменяется от -10 до 10, а y от -5 до 5

        plotTicks: 10, - не рекомендуется менять. Количество линий в координатной сетке

        margin: { - не рекомендуется менять. объект, описывающий отступы от координатной плоскости. Создается дополнительное пространство для цифр, описывающих координатную сетку.
            bottom: 20,
            right: 30
        },

        magicDrawingRange: 1.2, - не рекомендуется менять. В настоящее время никак не используется.

        pointRadius: 5, - не рекомендуется менять. Радиус точки по-умолчанию.

        graphAccuracy: 300 - не рекомендуется менять. Точность прорисовки графика.


Хочу заметить, что словосочетание "не рекомендуется менять" здесь означает, что "лучше оставить как есть, но если хочется поменять, то можно".

Конструктор возвращает объект Plotter.


Вся дальнейшая работа будет происходить с вернувшимся объектом. У него есть следующие методы:

<b>setWidth(number)</b> - установить ширину графика в пикселях. Возвращает true, если получилось, false иначе.

<b>getWidth()</b> - возвращает текущую ширину в пикселях

<b>setHeight(number)</b>

<b>getHeight()</b>

<b>getPlotElementID()</b> - возвращает строку. ID элемента в HTML-документе, над которым строится график.

<b>toString()</b> - строка, описывающая некоторые свойства объекта.

<b>setPlaneBorder(array)</b> - устанавливает границы плоскости. Массив должен состоять строго из четырех чисел: левая граница, правая граница, нижняя граница, верхняя граница. Вернет true, если получилось, false иначе.

<b>redraw()</b> - перерисовывает все объекты.

<b>addPoint(x, y, options)</b> - возвращает объект-точку. x, y - ее числовые координаты. options - необязательный аргумент.

<strike>options.small - можно присваивать значение true или false. По-умолчанию стоит false. Присваивание true сделает точку меньше.</strike> Свойство больше не работает! Вместо него используйте следующее:

options.size - строка. Можно присваивать значения "large", "medium", "small" и "tiny", что повлияет на размер точки. Если свойство не указать, то по-умолчанию будет стоять "medium".

options.movable: по умолчанию false. Значение true означает, что точку можно перетаскивать мышкой как угодно. Если передать вместо true отрезок прямой (объект-line, описывается здесь ниже), то точку можно будет передвигать только вдоль этого отрезка.

options.color: по умолчанию === 3. Можно передавать значения от 0 до 9. Это изменит цвет точки. Номера соответсвуют следующему набору: https://github.com/mbostock/d3/wiki/Ordinal-Scales#category10

<b>removePoint(point)</b> - принимает объект-точку, либо номер этой точки. Удаляет ее с графика.

<b>addLine(x1, y1, x2, y2, options)</b> - возвращает объект-линию. 
x1, y1, x2, y2 - координаты точек, по котороым строится отрезок
options - объект. Необязательный аргумент.
options.color - цвет линии, число от 0 до 10 включительно. 10 соответсвует черному, и стоит по-умолчанию.
options.width - толщина линии. По-умолчанию === 2.

<b>removeLine(line)</b> - принимает линию или номер линии. Удаляет ее с графика.

<b>addFunc(func, rangeLeft, rangeRight, options)</b> - добавляет график на плоскость, возвращает объект график функции
func - функция, график которой строится
rangeLeft, rangeRight - Границы построения
options - необязательный аргумент. Пока никак не используется.

<b>removeFunc(func) - удаляет указанный график функции</b>

<b>addGraphArea(funcNumber, rangeLeft, rangeRight, axe, options)</b> закрашивает область под графиком, возвращает объект GraphArea
funcNumber - это либо номер обекта график функции, либо сам объект. 
rangeLeft и rangeRight - границы закрашивания (по оси OX!)
axe - строка. Может иметь только два значения "x" и "y". "x" означает, что будет закрашена область от графика функции до оси OX. "y" означает, что будет закрашена область от графика функции до оси OY.
options пока не используется

<b>removeGraphArea(grapharea)</b> - удаляет GraphArea.


Теперь что касается методов объектов.
<b>Point.getNumber()</b> - возвращает номер точки. Уникальный идентификатор.

<b>Point.getX()</b>

<b>Point.setX(number)</b>

<b>Point.getY()</b>

<b>Point.setY(number)</b>

<b>Point.update() - обновляет положения точки на графике. Если вы меняете ее какими-либо методами выше, то предпочтительно использовать этот метод, а не Plotter.redraw().</b>

<b>Line.getX1()</b>

<b>Line.setX1(number)</b>

<b>Line.getX2()</b>

<b>Line.setX2(number)</b>

<b>Line.getY1()</b>

<b>Line.setY1(number)</b>

<b>Line.getY2()</b>

<b>Line.setY2(number)</b>

<b>Line.getNumber()</b>

<b>Line.getFunc()</b>

<b>Line.getNearestPoint(x, y)</b> - возвращает ближайшую к указанной точку на линии

<b>GraphArea.getPoints()</b> - точки, по которым прорисовывается область

<b>GraphArea.getRangeLeft()</b>

<b>GraphArea.setRangeLeft(number)</b>

<b>GraphArea.getRangeRight()</b>

<b>GraphArea.setRangeRight(number)</b>

<b>GraphArea.getNumber()</b>

<b>Func.getFunc()</b> - функция, по которой строится график функции

<b>Func.getPoints()</b> - точки, по которым строится график (они рассчитываются, исходя из функции)

<b>Func.getRangeLeft()</b>

<b>Func.getRangeRight()</b>

<b>Func.getNumber()</b>

<b>Func.getPath()</b> - путь для элемента path svg-графики.



Также в test4() (series.js) проиллюстрирована работа управляющих элементов
Кнопка принимает два аргумента: функцию, которая будет вызываться при ее нажатии (так называемая функция обратного вызова, callback) и текст, который написан на самой кнопке.
Ползунок принимает следующие аргументы: callback, в который передается текущее значение ползунка; название элемента (строка); минимальное значение, максимальное, шаг и начальное значение.
