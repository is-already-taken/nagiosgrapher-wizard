
define(["../models/Perfdata"], function(Perfdata) {

	return Backbone.Collection.extend({
		model : Perfdata,
		
		comparator: function(model){
			return model.get("position");
		},
		
		toNgrapherCfg: function(cfg){
			var str = "";
			
			this.each(function(perfdata){
				str += perfdata.toNgrapherCfg(cfg);
			});
			
			return str;
		}
	});

});
