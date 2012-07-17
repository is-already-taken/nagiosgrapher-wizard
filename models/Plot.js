
/** Represents the plot type and its color
 */
define([], function() {

	return Backbone.Model.extend({
		defaults: {
			"type": "plot-disabled", 
			"color": "#000"
		}
	});

});
