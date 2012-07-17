
define(["./PerfdataView"], function(PerfdataView) {
	
	var FN_TYPE_MAP = {"AVERAGE": "avg", "MAX": "max", "MIN": "min", "LAST": "last"};

	return Backbone.View.extend({
		tagName: "div",
		className: "list-wrap",

		initialize : function() {
			var self = this, $listBody, $removeBtn;
			
			$listBody = this.$listBody = $('<ul />');
			$addBtn = $('<span class="add-btn"><a class="btn" href="#"></span>');
			
			this.$el.append($listBody);
			this.$el.append($addBtn);
			
			$addBtn.children().on("click", function(evt){
				self.onAddClick(evt);
			});
			
			this.collection.on("add", this.onAdd, this);
			this.collection.on("sort", this.onSort, this);
			
			this.addAll();
		},
		
		onAddClick: function(){
			this.collection.create();
		},
		
		onAdd: function(model){
			this.$listBody.append(new PerfdataView({model: model}).$el);
		},
		
		onSort: function(){
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
