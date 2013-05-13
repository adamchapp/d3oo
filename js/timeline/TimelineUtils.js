/**
 * Created with JetBrains WebStorm.
 * User: adamchapp
 * Date: 11/05/2013
 * Time: 19:22
 * To change this template use File | Settings | File Templates.
 */

var TimelineUtils = function(properties, x_scale) {
    this.properties = properties;
    this.x_scale = x_scale;
    return this;
};

TimelineUtils.prototype.getDatePos = function(date) {
    return this.x_scale(this.properties.date_format.parse(date));
}

TimelineUtils.prototype.getXStartPos = function(d) {
    return this.getDatePos(d.startdate);
};

TimelineUtils.prototype.getXEndPos = function(d) {
    return this.getDatePos(d.enddate);
};

TimelineUtils.prototype.getXWidth = function(d) {
    var end_pos = this.getDatePos(d.enddate);
    var start_pos = this.getDatePos(d.startdate);
    return end_pos - start_pos;
};

TimelineUtils.prototype.getRowHeight = function(numberOfLanes) {
    return ( this.properties.height / numberOfLanes ) - this.properties.v_buffer;
}

TimelineUtils.prototype.getStaticRowHeight = function() {
    return this.properties.row_height;
}

TimelineUtils.prototype.getYPos = function(d, row_height) {
    return this.properties.height - ( ( row_height + this.properties.v_buffer ) * d.lane) - (row_height - this.properties.v_buffer);
}
