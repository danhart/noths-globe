define(["jquery"], function($) {
    $el = $("#hud");
    $ordersEl = $el.find(".orders");

    var addOrder = function(order) {
        $orderEl = $("<li>", {
            "class": "order",
        }).prependTo($ordersEl);

        $("<h3>", {
            text: order.product.title,
            "class": "product_title"
        }).appendTo($orderEl);

        $("<h4>", {
            text: "by " + order.product.partnerName,
            "class": "partner_name"
        }).appendTo($orderEl);

        var imageSrc = "http://www.notonthehighstreet.com" + order.product.imageURL.mini;
        $orderEl.append('<img src="' + imageSrc + '">');

        $("<p>", {
            text: "from: " + order.getSenderAddress(),
            "class": "sender_address"
        }).appendTo($orderEl);

        $("<p>", {
            text: "to: " + order.getDeliveryAddress(),
            "class": "delivery_address"
        }).appendTo($orderEl);

        $orderEl.css("border-color", "#" + order.path.color.toString(16));
    };

    return {
        addOrder: addOrder
    }
});
