/**
 * Created with JetBrains WebStorm.
 * User: adamchapp
 * Date: 11/05/2013
 * Time: 16:29
 * To change this template use File | Settings | File Templates.
 */
var Timeline = function(data, container_width, container_height) {

    var margin = {top: 20, right: 5, bottom: 15, left: 0};

    var properties = {
        margin : margin,
        footer_margin: 60,
        row_height: 25,
        width : ( container_width || 1200 ) - margin.left - margin.right,
        height : ( container_height || 800 ) - margin.top - margin.bottom,
        h_buffer: 5,
        v_buffer: 5,
        date_format: d3.time.format("%Y-%m-%d %X")
    }

    var model = new TimelineModel(properties);

    var ext = model.getDateExtents(model.sort(data));

    var x_scale = d3.time.scale()
        .domain([ext[0], ext[1]])
        .range([0, properties.width]);

    var zoom = d3.behavior.zoom()
        .x(x_scale)
        .scale(3)
        .scaleExtent([1, 1000])
        .on("zoom", onZoom)

    data = data.filter(function(d) { return d.enddate.length > 0 && (d.enddate > d.startdate); });

    var utils = new TimelineUtils(properties, x_scale);
    var data_provider = model.update(data, x_scale);



    var view = new TimelineView(properties, utils, zoom);
    view.draw(data_provider);

    function onZoom(e) {
        view.update(zoom);
    }

    return this;
}