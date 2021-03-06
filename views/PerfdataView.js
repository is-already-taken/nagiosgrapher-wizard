
define(["views/PlotTooltip",
        "views/LegendTooltip"], function(PlotTooltip, LegendTooltip) {
	
	var FN_TYPE_MAP = {"AVERAGE": "avg", "MAX": "max", "MIN": "min", "LAST": "last"};

	return Backbone.View.extend({
		tagName: "li",
		className: "perfdata-item",
		
		events: {
			"mouseover .perfdata-item-body": "onItemBodyHover",
			"mouseout .perfdata-item-body": "onItemBodyUnhover"
		},
		
		template: _.template(
			 '<div class="var-regex">'
			+	'<input type="text" value="<%= variable %>" />'
			+	'<input type="text" value="<%= regex %>" />'
			+'</div>'
			+'<div class="configs">'
			+	'<span class="<%= plotType %>" style="<%= colorStyle %>"></span>'
			+	'<span class="<%= legends %>">'
			+		'<span class="avg"></span>'
			+		'<span class="min"></span>'
			+		'<span class="max"></span>'
			+		'<span class="last"></span>'
			+	'</span>'
			+'</div>'
		),
		
		initialize : function() {
			var self = this, $body, model = this.model, legends = "";
			
			$body = this.$body = $('<div class="perfdata-item-body" />');
			
			this.$el.append($body);
			this.$el.attr("data-model-cid", model.cid);
			
			$body.append(this.template({
				variable: model.get("variable"),
				regex: model.get("regex"),
				colorStyle: this._getColorStyle(),
				plotType: this._getPlotTypeCssClass(),
				legends: this._getLegendsCssClass()
			}));
			
			this.$plotType = this.$el.find(".plot-type");
			this.$legends = this.$el.find(".min-max-avg");

			model.on("remove", this.remove, this);
			model.plot.on("change", this.onPlotTypeChange, this);
			model.legends.on("change", this.onLegendsChange, this);
			
			model.on("view:highlight", this.onHightlight, this);
			
			
			this.$el.find(".configs .min-max-avg, .configs .plot-type").on("click", function(evt){
				if ($(evt.target).hasClass("plot-type")) {
					self.onPlotTypeClick.call(self, evt);
				} else {
					self.onLegendsClick.call(self, evt);
				}				
			});
		},
		
		onItemBodyHover: function(evt){
			var target = $(evt.target).parent(".perfdata-item"),
			model = this.model;
			
			if (!target.length) {
				return;
			}
			
			this.model.trigger("view:hover", true, model.get("regex"), model.plot.get("color"));
		},
		
		onItemBodyUnhover: function(evt){
			var model = this.model;
			
			if (evt.relatedTarget == evt.target || $(evt.relatedTarget).parents(".perfdata-item-body").is(evt.target)) {
				return;
			}
			
			this.model.trigger("view:hover", false, model.get("regex"));
		},
		
		onHightlight: function(state){
			this.$body.toggleClass("highlight", state);
		},
		
		_getPlotTypeCssClass: function(){
			return "plot-type plot-" + this.model.plot.get("type");
		},
		
		_getLegendsCssClass: function(){
			var css = "min-max-avg ";
			
			this.model.legends.each(function(legend){
				if (legend.get("active")) {
					css += FN_TYPE_MAP[legend.get("function")] + " ";
				}
			});
			
			return css;
		},
		
		_getColorStyle: function(){
			return "background-color: " + this.model.plot.get("color");
		},
		
		
		onPlotTypeClick: function(evt){
			var model = this.model, $el = $(evt.target);
			
			$el.addClass("focus");
			
			new PlotTooltip({model: model.plot}).show({by: $el, onHide: function(){
				$el.removeClass("focus");
			}});
			
			return false;
		},
		
		onLegendsClick: function(evt){
			var model = this.model, $el = $(evt.target);
			
			$el.addClass("focus");
			
			new LegendTooltip({collection: model.legends}).show({by: $el, onHide: function(){
				$el.removeClass("focus");
			}});
			
			return false;
		},
		
		_setClassKeepFocus: function($el, cls){
			$el.attr("class", ($el.hasClass("focus") ? "focus " : "") + cls);
		},
		
		onPlotTypeChange: function(model){
			var $plotType = this.$plotType;
			this._setClassKeepFocus($plotType, this._getPlotTypeCssClass());
			$plotType.attr("style", this._getColorStyle());
		},
		
		onLegendsChange: function(model){
			this._setClassKeepFocus(this.$legends, this._getLegendsCssClass());
		}
		
	});

});
