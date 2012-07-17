
define([], function(){
	
	var FN_TYPE_MAP = {"AVERAGE": "avg", "MAX": "max", "MIN": "min", "LAST": "last"};
	
	return Backbone.View.extend({

		template: _.template('<input type="checkbox" />'
							+ '<span class="min-max-avg <%= cls %>"><span class="<%= cls %>"></span></span>'
							+ '<input class="description" type="text" placeholder="Label for <%= fn %> value" />'
							+ '<input class="format" type="text" placeholder="%2.2lf" />'),
		  
		initialize: function(){
			var self = this, model = this.model, cfg = {
					cls: FN_TYPE_MAP[model.get("function")],
					fn: model.get("function")
			};
			
			this.$el.append(this.template(cfg));
			
			this.$check = this.$el.find('input[type="checkbox"]');
			this.$input = this.$el.find('.description, .format');
			
			this.$check.on("click", function(evt) {
				self.onActiveCheck.call(self, evt);
			});
			this.$input.on("blur keypress", function(evt) {
				self.onInputChange.call(self, evt);
			});
			
			this.init();
		},
		
		onActiveCheck: function(evt){
			var model = this.model;
			model.set({"active": !model.get("active")});
		},
		
		onInputChange: function(evt){
			var target = $(evt.target), field, data = {};
			
			// keyCode undefined for blur event
			if (evt.keyCode == 13 || typeof evt.keyCode == "undefined") {
				// field's class equals model's attribute, so get class and set model's property by class name
				field = target.attr("class");
				data[field] = this.$input.filter("." + field).val();
				this.model.set(data);
			}
		},
		
		_setField: function(name){
			// select by class name and get field. both by the same string
			this.$input.filter("." + name).val(this.model.get(name));
		},
		
		init : function(cfg) {
			if (this.model.get("active")) {
				this.$check.attr("checked", "checked");
			}
			
			this._setField("format");
			this._setField("description");
		},
		
		remove: function(){
			this.$check.off();
			this.$input.off();
			
			Backbone.View.prototype.remove.apply(this, arguments);
		}
		
	});
  
});
