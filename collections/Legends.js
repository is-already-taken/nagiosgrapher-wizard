
define(["../models/Legend"], function(Legend) {

	return Backbone.Collection.extend({
		model : Legend,
		
		toNgrapherCfg: function(variable, cfg){
			var str = "";
			
			this.each(function(legend){
				str += legend.toNgrapherCfg(variable, cfg);
			});
			
			return str;
		}
	});

});
