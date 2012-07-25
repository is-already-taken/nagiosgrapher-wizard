
define([], function(Tooltip) {

	return Backbone.View.extend({
		el: "#slider-box",
				
		initialize: function(){
			this.$slider = this.$el.children();
			this.$boxes = this.$slider.children();
		},
		
		
		slide: function(idx){
			var self = this;
			
			this.$boxes.eq(1).addClass("no-scrollbar");
			
			this.$slider.animate({left: (idx * -100) + "%"}, {
				duration: 500,
				complete: function(){
					if (idx === 1) {
						self.$boxes.eq(1).removeClass("no-scrollbar");
					}
				}
			});
		},
		
		slideToWizard: function(){
			this.slide(0);
		},
		
		slideToList: function(){
			this.slide(1);
		},

		slideToConfigs: function(){
			this.slide(2);
		}
	
	});
	
});
