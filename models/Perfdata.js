
define(["./Plot", "../collections/Legends", "text!../templates/plot-cfg.tpl"], function(Plot, Legends, PLOT_CFG_TPL) {

	return Backbone.Model.extend({
		defaults: {
			variable: "var",
			regex: ""
		},
		
		moveUp: function(){
			this.collection.moveUp(this);
		},
		
		moveDown: function(){
			this.collection.moveDown(this);
		},
		
		parse: function(data){
			this.plot = new Plot(data.plot, {parse: true});
			this.legends = new Legends(data.legends, {parse: true});
			
			this.plot.on("change", function(){
				this.trigger("plot.change", this.plot);
			}, this);
			
			this.legends.on("change", function(){
				this.trigger("legends.change", this.lengends);
			}, this);
			
			delete data.plot;
			delete data.legends;
			
			return data;
		},
		
		_getFullColor: function(color){
			return color.replace(/^#(.)(.)(.)$/, "$1$1$2$2$3$3");
		},
		
		_getPlotType: function(){
			var type = this.plot.get("type"),
				idx = this.collection.indexOf(this);
			
			if (type === "area") {
				return (idx === 0 ? "area" : "stack").toUpperCase();
			}
			
			return type;
		},
		
		_isHidden: function(){
			return this.plot.get("type") == "disabled";
		},
		
		_getPlotNgrapherCfg: function(cfg){
			// cfg.serviceName, cfg.units
			
			return _.template(PLOT_CFG_TPL)({
				serviceName: cfg.serviceName,
				regex: this.get("regex"),
				variable: this.get("variable"),
				plotType: this._getPlotType(),
				color: this._getFullColor(this.plot.get("color")),
				// use variable, TODO let the user edit this
				legend: this.get("variable"),
				units: cfg.units || "",
				hide: this._isHidden()
			}) + "\n";
		},
		
		toNgrapherCfg: function(cfg) {
			var str = "";
			
			str += this._getPlotNgrapherCfg(cfg);
			str += this.legends.toNgrapherCfg(this.get("variable"), cfg);
			
			return str + "\n";
		}
		
	});

});
