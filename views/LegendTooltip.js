define([ "./Tooltip", "./LegendView" ], function(Tooltip, LegendView) {
	
	return Tooltip.extend({
		cls : "label-tooltip",
		
		legendViews: [], 
		
		initialize : function() {
			Tooltip.prototype.initialize.apply(this, arguments);

			var $body = this.$body, 
				fields = this.fields,
				collection = this.collection,
				markup, field, view, 
				self = this;

			$body.append($('<div class="header">Legend fields</div>'));
			
			this.legendViews = [];
			
			collection.each(function(model){
				view = new LegendView({model: model});
				self.legendViews.push(view);
				
				$body.append(view.$el)
			});
		},
		
		onRemove: function(){
			_.each(this.legendViews, function(view){
				view.remove();
			});
		}

	});

});
