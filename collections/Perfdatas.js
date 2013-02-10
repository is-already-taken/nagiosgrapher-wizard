
define(["../models/Perfdata"], function(Perfdata) {

	return Backbone.Collection.extend({
		model : Perfdata,
		
		moveUp: function(model){
			var collection = model.collection,
				idx = collection.indexOf(model);
			
			if (idx === 0) {
				return;
			}
			
			this._moveUp(collection.models, idx);
			
			this.trigger("sort", idx, idx - 1);
		},
		
		moveDown: function(model){
			var collection = model.collection,
				idx = collection.indexOf(model);

			if (idx == collection.length - 1) {
				return;
			}
			
			this._moveDown(collection.models, idx);
			
			this.trigger("sort", idx, idx + 1);
		},
		
		_moveUp: function(a, idx){
			x = a[idx - 1];
			a[idx - 1] = a[idx];
			a[idx] = x;
		},
		
		_moveDown: function(a, idx){
			x = a[idx + 1];
			a[idx + 1] = a[idx];
			a[idx] = x;
		},
		
		toNgrapherCfg: function(cfg){
			var str = "";
			
			this.each(function(perfdata){
				str += perfdata.toNgrapherCfg(cfg);
			});
			
			return str;
		}
	});

});
