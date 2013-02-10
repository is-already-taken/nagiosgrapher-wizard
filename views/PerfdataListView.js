
define(["./PerfdataView"], function(PerfdataView) {
	
	var FN_TYPE_MAP = {"AVERAGE": "avg", "MAX": "max", "MIN": "min", "LAST": "last"};

	return Backbone.View.extend({
		tagName: "div",
		className: "list-wrap",
		
		events: {
			"mouseover .perfdata-item-body": "onItemBodyHover"
		},

		initialize : function() {
			var self = this, $listBody, $removeBtn;
			
			$listBody = this.$listBody = $('<ul />');
			
			this.$el.append($listBody);
			
			this.collection.on("add", this.onAdd, this);
			this.collection.on("reset", this.reRender, this);
			
			this._initSortable();
			
			this.addAll();
		},
		
		_initSortable: function(){
			var self = this;
			this.$listBody.sortable({
				placeholder: "perfdata-item-placeholder",
				stop: function(event, ui){
					self.onSortet(event, ui);
				}
			});
		},
		
		onSortet: function(event, ui){
			var self = this,
				$items = this.$listBody.children(),
				pos = 0;
				
			$items.each(function(idx, itemEl){
				var cid = $(itemEl).attr("data-model-cid"),
					model = self.collection.getByCid(cid);
				
				model.set("position", pos);
				
				pos++;
			});
			
			this.collection.sort();
		},
		
		onAdd: function(model){
			this.$listBody.append(new PerfdataView({model: model}).$el);
		},
		
		onItemBodyHover: function(evt){
			var target = $(evt.target).parents(".perfdata-item"),
				idx, model;
			
			if (!target.length) {
				return;
			}
			
			idx = target.parent().children(".perfdata-item").index(target);
			model = this.collection.at(idx);
		
			this.trigger("hover-item", model.attributes.regex);
		},
		
		highlightByIndex: function(regex, state){
			var model = this.collection.find(function(model){
				return model.get("regex") == regex;
			});
			
			if (!model) {
				return;
			}
			
			model.trigger("view:highlight", state);
		},		
		
		reRender: function(){
			this.$listBody.children().remove();
			this.addAll();
		},
		
		addAll: function(){
			var view, self = this;
			
			this.collection.each(function(perfdata){
				view = new PerfdataView({model: perfdata});
				self.$listBody.append(view.$el);
			});
		}
		
	});

});
