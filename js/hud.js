define(["jquery"], function($) {
    var $el = $("#hud");
    var $ordersEl = $el.find(".orders");
    var $showHideButton = $el.find(".hide_show_hud");
    var eventBus = $({});
    var unrestrictTimeout;

    $showHideButton.on("click", function(e) {
        e.preventDefault();
        toggle();
    });

    var addOrder = function(order) {
        var $orderEl = $("<li>", {
            "class": "order",
        }).prependTo($ordersEl).hide();

        $orderEl.data("order", order);

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
            text: "sent from: " + order.getSenderAddress(),
            "class": "sender_address"
        }).appendTo($orderEl);

        $("<p>", {
            text: "delivered to: " + order.getDeliveryAddress(),
            "class": "delivery_address"
        }).appendTo($orderEl);

        $orderEl.css("border-color", order.path.lightColor);

        $orderEl.fadeIn();

        $orderEl.on("click", function(e) {
            e.preventDefault();
            setHighlight($orderEl);
        });

        limitOrdersLength();
    };

    var setHighlight = function($orderEl) {
        $orderEl.toggleClass("highlight");

        if ($ordersEl.find(".highlight").length) {
            eventBus.trigger("restrict");
        } else {
            eventBus.trigger("unrestrict");
        }
    };

    eventBus.on("restrict", function() {
        $el.addClass("restricted");
        startAutoUnrestrictTimeout();
    });

    eventBus.on("unrestrict", function() {
        $el.removeClass("restricted");
        clearAutoUnrestrictTimeout();
    });

    var startAutoUnrestrictTimeout = function() {
        clearAutoUnrestrictTimeout();

        unrestrictTimeout = window.setTimeout(function() {
            eventBus.trigger("unrestrict");
            removeAllHighlights();
        }, 1000 * 60 * 5);
    };

    var clearAutoUnrestrictTimeout = function() {
        if (unrestrictTimeout) {
            window.clearTimeout(unrestrictTimeout);
            unrestrictTimeout = undefined;
        }
    };

    var removeAllHighlights = function() {
        $ordersEl.find(".highlight").removeClass("highlight");
    };

    var limitOrdersLength = function() {
        $ordersEl.find(".order").slice(100).remove();
    };

    var toggle = function() {
        $el.toggleClass("closed");
        eventBus.trigger("toggle");
    };

    var isOpen = function() {
        return !$el.hasClass("closed");
    };

    var getHighlightedOrders = function() {
        return $ordersEl.find(".highlight").map(function() {
            return $(this).data("order");
        }).get();
    };

    return {
        addOrder:             addOrder,
        toggle:               toggle,
        isOpen:               isOpen,
        getHighlightedOrders: getHighlightedOrders,
        on:                   eventBus.on.bind(eventBus)
    }
});
