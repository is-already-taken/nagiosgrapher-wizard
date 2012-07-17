
define([], function() {
	
	return Backbone.View.extend({
		tagName: "pre",

		initialize : function() {
			this.collection.on("add remove sort change legends.change plot.change", this.onChange, this);
		},
		
		onChange: function(){
			var str = this.collection.toNgrapherCfg({serviceName: "myservice", units: "secs"});
			this.$el.html(str);			
		}
	
	});

});
