/**
 * Created with JetBrains WebStorm.
 * User: adamchapp
 * Date: 11/05/2013
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */
var TimelineModel = function(properties) {
    this.timeline_org = new TimelineDataOrganiser(properties)
    this.properties = properties;
    return this;
}

TimelineModel.prototype.sort = function(data) {
    return data.sort(function(a, b){ return d3.ascending(a.startdate, b.startdate); })
}

TimelineModel.prototype.update = function(data, x_scale) {
    events = this.sort(data);

    this.events = this.timeline_org.getOrganisedEvents(events, x_scale);

    return this.events;
}

TimelineModel.prototype.getDateExtents = function(events) {

    var date_format = this.properties.date_format;

    var minDate = date_format.parse(events[0].startdate),
        maxDate = date_format.parse(events[events.length-1].startdate);

    return [minDate, maxDate];
}