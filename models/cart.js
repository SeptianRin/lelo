module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item ,id){
		var storedItem =  this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = {item : item, qty : 0, harga:0};

		}
		storedItem.qty++;
		storedItem.harga = storedItem.item.harga * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.harga;
	};


	this.generateArray = function(){
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};

};