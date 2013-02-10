
define([], function() {
	
	return Backbone.View.extend({
		tagName: "pre",

		initialize : function() {
			this.model.on("change", this.onChange, this);
			this.model.perfdatas.on("reset add remove sort change legends.change plot.change", this.onChange, this);
		},
		
		onChange: function(){
			var str = this.model.toNgrapherCfg();
			this.$el.html(str);			
		}
	
	});

});
