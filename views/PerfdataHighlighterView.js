
define(["../utils/PerfdataParser"], function(PerfdataParser) {

	return Backbone.View.extend({
		
		initialize: function(){
			
		},
		
		_wrapTokens: function(){
			var tokens = this.options.tokens,
				perfdata = this.options.perfdata,
				value,
				matchers = PerfdataParser.getMatchers(tokens),
				matcher,
				i,
				wrapped = tokens;
			
			
		    for (i = 0; i < matchers.length; i++) {
		    	matcher = new RegExp(matchers[i]);
		    	value = matcher.exec(perfdata)[1];
		    	wrapped = wrapped.replace(/\{NNN\}/, '</span><span class="value">' + value + '</span><span class="no-value">');
		    } 
		    
		    wrapped = '<span class="no-value">' + wrapped + '</span>';
		    
		    return wrapped;
		},
		
		render: function(){
			var markup = this._wrapTokens();
			
			this.$el.html(markup);
			
			return this;
		}
		
		
	});
	
});
