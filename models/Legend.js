
/** Represents a legend. 
 *  A legend is the plot's description and value reading below the graph.
 */
define(["text!../templates/legend-cfg.tpl"], function(LEGEND_CFG_TPL) {

	return Backbone.Model.extend({
		
		defaults: {
			"active": false,
			"description": "Avg:",
			"function": "AVERAGE",
			"format": "%2.2lf",
			"eol": "left"
		},
		
		toNgrapherCfg: function(variable, cfg) {
			// cfg.serviceName
			
			if (!this.get("active")) {
				return "";
			}
			
			return _.template(LEGEND_CFG_TPL)({
				serviceName: cfg.serviceName,
				variable: variable,
				description: this.get("description"), 
				fn: this.get("function"), 
				format: this.get("format"), 
				eol: "" // TODO make this configurable
			}) + "\n";
		}
	
	});

});
