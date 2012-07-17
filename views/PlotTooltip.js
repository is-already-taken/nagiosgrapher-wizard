define([ "./Tooltip" ], function(Tooltip) {

	return Tooltip.extend({
		cls : "plot-tooltip",

		fieldTpl : _.template('<span class="color-field <%= cls %>" data-color="<%= color %>" style="background-color: <%= color %>;"></span>'),

		plotTypeTpl : _.template('<div class="header">Plot type</div>'
			+ '<div class="plot-types">'
			+ '<span><span class="plot-type plot-area" style="background-color: #06f"></span></span>'
			+ '<span><span class="plot-type plot-line-1" style="background-color: #06f"></span></span>'
			+ '<span><span class="plot-type plot-line-2" style="background-color: #06f"></span></span>'
			+ '<span><span class="plot-type plot-line-3" style="background-color: #06f"></span></span>'
			+ '<span><span class="plot-type plot-disabled" style="background-color: #06f"></span></span>'
			+ '</div>'),

		colors : {
			// 1|0 = negate (.neg)
			"000" : 1, "666" : 1, "999" : 0, "f00" : 0, "900" : 1, "600" : 1,
			"0f0" : 0, "0c0" : 0, "090" : 1, "060" : 1, "ff0" : 0, "fc0" : 0,
			"f90" : 0, "f60" : 0, "00f" : 1, "009" : 1, "006" : 1, "0ff" : 0,
			"09f" : 0, "06f" : 1, "f0f" : 0, "90f" : 0, "60f" : 0, "99f" : 0
		},
		
		types: {
			"plot-area": 1, "plot-line-1": 1, "plot-line-2": 1, "plot-line-3": 1, "plot-disabled": 1
		},

		initialize : function() {
			Tooltip.prototype.initialize.apply(this, arguments);

			var $body = this.$body, colors = this.colors, markup, $div1 = $('<div class="color-fields"/>'), cls, self = this;

			for (color in colors) {
				cls = colors[color] ? "neg" : "";
				markup = this.fieldTpl({
					cls : cls,
					color: "#" + color, // browsers might convert the style to rgb() 
					color : "#" + color
				});
				$div1.append($(markup));
			}

			$body.append(this.plotTypeTpl());
			$body.append($div1);

			$body.find(".color-fields").on("click", function(evt) {
				self.onColorFieldsClick.call(self, evt);
			});
			
			$body.find(".plot-types").on("click", function(evt) {
				self.onPlotTypesClick.call(self, evt);
			});

			this.init();
		},
		
		onRemove: function(){
			var $body = this.$body;
			$body.off(".color-fields");
			$body.off(".plot-types");
		},

		init : function() {
			var model = this.model,
				$colors = this.$body.find(".color-field"),
				$types = this.$body.find(".plot-types > span"),
				typeToSelect = model.get("type"),
				colorToSelect = model.get("color");
			
			this._selectBy(this.colors, $colors, colorToSelect, function(color, toSelect){
				return ("#" + color) == toSelect;
			});
	
			this._selectBy(this.types, $types, typeToSelect, function(type, toSelect){
				return type == "plot-" + (toSelect || "disabled");
			});
		},
		
		// generic select method
		_selectBy: function(_enum, $els, value, fn){
			var i = 0, e;
			
			$els.removeClass("selected");
			
			for (e in _enum) {
				if (fn(e, value)) {
					$els.eq(i).addClass("selected");
					break;
				}
				
				i++;
			}
		},
		
		onPlotTypesClick : function(evt) {
			var spans = this.$body.find(".plot-types > span"), target;

			if (evt.target.tagName !== "SPAN") {
				return;
			}
			
			target = $(evt.target);
			
			if (target.hasClass("plot-type")) {
				target = target.parent();
			}
			
			this.model.set({type: target.children().attr("class").replace(/^.*plot-([^\s]*).*$/,"$1")});
			
			spans.removeClass("selected");
			target.addClass("selected");
		},
		
		onColorFieldsClick : function(evt) {
			var spans = this.$body.find(".color-field"), target;

			if (evt.target.tagName !== "SPAN") {
				return;
			}
			
			target = $(evt.target);
			
			this.model.set({color: target.attr("data-color")});
			
			spans.removeClass("selected");
			target.addClass("selected");
		}

	});

});
