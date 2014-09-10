noths-globe
===========

Plots real time international orders from the notonthehighstreet.com on a globe using three.js
Paths are plotted from sender address to the delivery address using coordinate data.

Viewable here: http://danhart.co.uk/noths_globe/

The socket.io server that powers this is here: https://github.com/danhart/noths-order-geo

The interface for the three.js globe is simple and allows paths to be plotted between any two sets of coordinates.
This makes it reusable outside of notonthehighstreet.com's use case and I will be splitting it out as a separate open source library.
