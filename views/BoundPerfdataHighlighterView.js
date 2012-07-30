
define(["./PerfdataHighlighterView"], function(PerfdataHighlighterView) {

	return PerfdataHighlighterView.extend({
		
		events: {
			"mouseover .value": "onValueHover",
			"mouseout .value": "onValueUnhover"
		},
		
		onValueHover: function(evt){
			var target = $(evt.target),
				idx = target.parent().children(".value").index(target);
			
			this.trigger("hover", true, this.matchers[idx]);
		},
		
		onValueUnhover: function(evt){
			var target = $(evt.target),
				idx = target.parent().children(".value").index(target);
			
			this.trigger("hover", false, this.matchers[idx]);
		},
		
		highlightByRegEx: function(regex, color){
			var matchers = this.matchers,
				idx = _.indexOf(matchers, regex),
				$value = this.$el.find(".value").eq(idx);
			
			if (color) {
				$value.attr("style", "background-color: " + color);
			} else {
				$value.attr("style", "");
			}
		}
		
	});
	
});
