
define(["../collections/Perfdatas"], function(Perfdatas) {

	return Backbone.Model.extend({
		defaults: {
			serviceName: "no_name",
			units: "secs"
		},
		
		perfdatas: null,
		
		initialize: function(){
			this.perfdatas = new Perfdatas();
		},
		
		resetPerfdata: function(datas){
			this.perfdatas.reset(datas, {parse: true});
		},
		
		toNgrapherCfg: function() {
			var cfg = {
				serviceName: this.get("serviceName"),
				units: this.get("units")
			};
			
			return this.perfdatas.toNgrapherCfg(cfg) + "\n";
		}
		
	});

});
