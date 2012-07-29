
define(["./PerfdataView"], function(PerfdataView) {
	
	var FN_TYPE_MAP = {"AVERAGE": "avg", "MAX": "max", "MIN": "min", "LAST": "last"};

	return Backbone.View.extend({
		tagName: "div",
		className: "list-wrap",

		initialize : function() {
			var self = this, $listBody, $removeBtn;
			
			$listBody = this.$listBody = $('<ul />');
			$addBtn = $('<a class="add-btn" href="#"><span></span>Add new value</a>');
			
			this.$el.append($listBody);
			this.$el.append($addBtn);
			
			$addBtn.on("click", function(evt){
				self.onAddClick(evt);
			});
			
			this.collection.on("add", this.onAdd, this);
			this.collection.on("sort reset", this.reRender, this);
			
			this.addAll();
		},
		
		onAddClick: function(){
			this.collection.create();
		},
		
		onAdd: function(model){
			this.$listBody.append(new PerfdataView({model: model}).$el);
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
