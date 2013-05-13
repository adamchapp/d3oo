/**
 * Created with JetBrains WebStorm.
 * User: adamchapp
 * Date: 11/05/2013
 * Time: 17:46
 * To change this template use File | Settings | File Templates.
 */
var TimelineDataOrganiser = function(properties) {
    this.properties = properties;
    return this;
};

TimelineDataOrganiser.prototype.getOrganisedEvents = function(data, x_scale) {
    var date_format = this.properties.date_format;
    var h_buffer = this.properties.h_buffer;

    var lanes = [];

    data.map(function(item) {
        var start_pos = x_scale(date_format.parse(item.startdate));
        var end_pos = x_scale(date_format.parse(item.enddate));

        item.end_pos = end_pos;

        item.lane = findLane(0, item);

        function findLane(currentLane, event) {

            var end_pos = lanes[currentLane];

            if ( !end_pos ) {
                lanes[currentLane] = event.end_pos;
                return currentLane;
            }

            var startPos = x_scale(date_format.parse(event.startdate));

            if ( ( end_pos + h_buffer ) > start_pos) {
                return findLane(++currentLane, event);
            }

            lanes[currentLane] = event.end_pos;

            return currentLane;
        }
    });

    var data_provider = {
        events: data,
        lanes : lanes
    };

    return data_provider;
}
