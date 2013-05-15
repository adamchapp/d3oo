/**
 * Created with JetBrains WebStorm.
 * User: adamchapp
 * Date: 11/05/2013
 * Time: 17:07
 * To change this template use File | Settings | File Templates.
 */
var TimelineView = function(properties, utils, zoom) {
    this.properties = properties;
    this.utils = utils;
    this.zoom = zoom;

    this.zoom.scale(3);

    this.svg = this.createSVG(properties.width, properties.height, properties.margin, this.zoom);
    this.axis = this.createAxis(this.svg, properties.width, properties.height, properties.margin, utils.x_scale);

    this.singleLine = false;
}

TimelineView.prototype.createSVG = function(width, height, margin, zoom) {
    var svg = d3.select("#graph")
        .append("svg")
        .attr("class", "canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoom);

    return svg;
}

TimelineView.prototype.createAxis = function(container, width, height, margin, x_scale) {

    //create axis from x scale above
    var xAxis = d3.svg.axis()
        .scale(x_scale)
        .orient('bottom');

    //add x-axis wrapped in group to svg container
    container.append('g')
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height+margin.bottom) + ")")
        .call(xAxis);

    return xAxis;
}

TimelineView.prototype.draw = function(data_provider) {

    var svg = this.svg;
    var utils = this.utils;
    var events = data_provider.events;
    var lanes = data_provider.lanes;

    var V_BUFFER = this.properties.v_buffer;
    var ROW_HEIGHT = utils.getStaticRowHeight();

    var rect = svg.append('g')
        .selectAll("rect")
        .data(events);

    rect.enter()
        .append("rect")
        .attr("class", "rect")
        .attr("x", function(d) { return utils.getXStartPos(d) })
        .attr("y", function(d) { return utils.getYPos(d, ROW_HEIGHT); })
        .attr("width", function(d) { d.width = utils.getXWidth(d); return d.width; })
        .attr("height", ROW_HEIGHT)
        .on("mouseover", function(d) { d3.select(this).style("fill", "red"); })
        .on("mouseout", function(d) { d3.select(this).style("fill", "#4eafd7"); })
        .on("click", function(d) { alert("This event is called " + d.title + " and starts on " + d.startdate) });

    var text = svg.append('g')
        .selectAll(".text")
        .data(events);

    if ( lanes.length < 30 ) {
        text.enter()
            .append('foreignObject')
            .attr("x", function(d) { return utils.getXStartPos(d) })
            .attr("y", function(d) { return utils.getYPos(d, ROW_HEIGHT) + (ROW_HEIGHT/2) - V_BUFFER })
            .attr("width", function(d) {
                var textWidth = d3.select(this).node().getBBox().width;
                return d.width;
            })
            .attr("height", ROW_HEIGHT-(V_BUFFER *2))
            .attr("dx", "1em")
            .attr("pointer-events", "none")
            .append('xhtml:body')
            .attr("class", "text")
            .html(function(d) { return d.title })

    }

    this.text = text;
    this.rect = rect;
}

TimelineView.prototype.update = function(zoom) {
    var rect = this.rect;
    var text = this.text;
    var svg = this.svg;

    var x_axis = this.axis;
    var singleLine = this.singleLine;
    var utils = this.utils;

    var TEXT_MARGIN = 1;

    this.updateAxisLabels(x_axis, zoom);

    rect.attr("x", function(d) { return utils.getXStartPos(d) })

    if ( !singleLine )
        rect.attr("width", function(d) {
            d.width = utils.getXWidth(d);
            return d.width;
        });

    text.attr("x", function(d) {
            positionText(d)
            return d.start_pos;
        })
        .attr("width", function(d) { return d.end_pos - d.start_pos; });

    function positionText(d) {

        d.start_pos = utils.getXStartPos(d);
        d.end_pos = utils.getXEndPos(d);

        //if rect is still onscreen, move label to
        //left hand side of the screen
        if ( d.start_pos < 0 && d.end_pos > 0 ) {
            d.start_pos = 0;
        }
    }
}

TimelineView.prototype.updateAxisLabels = function(x_axis, zoom) {

    var svg = this.svg;

//    if ( zoom.scale() < 2 ) {
//        x_axis.tickFormat(d3.time.format('%Y'));
//    } else if ( zoom.scale() < 8.6 ) {
//        x_axis.tickFormat(d3.time.format('%b %y'));
//    } else if ( zoom.scale() < 12 ) {
//        x_axis.tickFormat(d3.time.format('%a %d %b %y'));
//        x_axis.ticks(5);
//    }

    svg.select(".axis").call(x_axis);
}