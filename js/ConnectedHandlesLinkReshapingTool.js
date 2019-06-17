"use strict";
/*
*  Copyright (C) 1998-2017 by Northwoods Software Corporation. All Rights Reserved.
*/

// A custom LinkReshapingTool that adds an Adornment with two dashed lines
// that connect the reshaping handles of a Bezier curved Link to their respective end points.
// The behavior is exactly the same as a normal LinkReshapingTool when the Link
// is not Bezier curved with exactly four points in the route.

// Install by replacing the standard Diagram.toolManager.linkReshapingTool:
// $(go.Diagram,
//     { . . .
//       linkReshapingTool: new ConnectedHandlesLinkReshapingTool(),
//       . . . })

/**
* @constructor
* @extends LinkReshapingTool
* @class
*/
function ConnectedHandlesLinkReshapingTool() {
  go.LinkReshapingTool.call(this);
}
go.Diagram.inherit(ConnectedHandlesLinkReshapingTool, go.LinkReshapingTool);

/**
* In addition to the regular "LinkReshaping" Adornment holding two reshape handles for Bezier curved Links,
* add another Adornment holding two dashed-line Shapes.
* Add this Adornment before adding the regular one so that the dashed lines are behind the reshaping handles.
* @override
* @this {ConnectedHandlesLinkReshapingTool}
* @param {Shape} pathshape
* @return {Adornment}
*/
ConnectedHandlesLinkReshapingTool.prototype.makeAdornment = function(pathshape) {
  var link = pathshape.part;
  if (link !== null && link.curve === go.Link.Bezier && link.pointsCount === 4) {
    var connad = new go.Adornment();

    var conn0 = new go.Shape();
    conn0.stroke = "dodgerblue";
    conn0.strokeDashArray = [3, 3];
    connad.add(conn0);

    var conn1 = new go.Shape();
    conn1.stroke = "dodgerblue";
    conn1.strokeDashArray = [3, 3];
    connad.add(conn1);

    link.addAdornment("HandleConnections", connad);
  }
  return go.LinkReshapingTool.prototype.makeAdornment.call(this, pathshape);
};

/**
* Update the Shape.geometry for both of the additional Adornment Shapes,
* so that the first control handle connects with the first point of the route,
* and so that the second control handle connects with the last point of the route.
* @override
* @this {ConnectedHandlesLinkReshapingTool}
* @param {Part} part
*/
ConnectedHandlesLinkReshapingTool.prototype.updateAdornments = function(part) {
  go.LinkReshapingTool.prototype.updateAdornments.call(this, part);
  if (part.isSelected && part instanceof go.Link) {
    var link = part;
    if (link !== null && link.curve === go.Link.Bezier && link.pointsCount === 4) {
      var ad = link.findAdornment("HandleConnections");
      if (ad !== null) {
        this.updateGeometries(link, ad.elt(0), ad.elt(1));
      }
    }
  } else {
    part.removeAdornment("HandleConnections");
  }
};

/**
* @this {ConnectedHandlesLinkReshapingTool}
* @param {Link} link
* @param {Shape} conn0
* @param {Shape} conn1
*/
ConnectedHandlesLinkReshapingTool.prototype.updateGeometries = function(link, conn0, conn1) {
  var start = link.getPoint(0);
  var c0 = link.getPoint(1);
  var c1 = link.getPoint(2);
  var end = link.getPoint(3);

  var ax = Math.min(start.x, Math.min(c0.x, Math.min(c1.x, end.x)));
  var ay = Math.min(start.y, Math.min(c0.y, Math.min(c1.y, end.y)));

  var geo0 = new go.Geometry(go.Geometry.Line);
  geo0.startX = start.x - ax;
  geo0.startY = start.y - ay;
  geo0.endX = c0.x - ax;
  geo0.endY = c0.y - ay;
  conn0.geometry = geo0;

  var geo1 = new go.Geometry(go.Geometry.Line);
  geo1.startX = c1.x - ax;
  geo1.startY = c1.y - ay;
  geo1.endX = end.x - ax;
  geo1.endY = end.y - ay;
  conn1.geometry = geo1;


/*
  var x1 = start.x - ax;
  var y1 = start.y - ay;
  var x2 = c0.x - ax;
  var y2 = c0.y - ay;
  var x3 = c1.x - ax;
  var y3 = c1.y - ay;
  var x4 = end.x - ax;
  var y4 = end.y - ay;
  
  var a1 = 0.75*0.75*0.75*x1+0.25*0.25*0.25*x4-x2;
  var a2 = 3 * 0.75*0.75*0.25;
  var a3 = 6 * 0.75*0.25*0.25;
  var a4 = 0.75*0.75*0.75*y1+0.25*0.25*0.25*y4-y2;
  var a7 = 0.25*0.25*0.25*x1+0.75*0.75*0.75*x4-x3;
  var a8 = 3 * 0.75*0.25*0.25;
  var a9 = 6 * 0.75*0.75*0.25;
  var a10 = 0.25*0.25*0.25*y1+0.75*0.75*0.75*y4-y3;

  var geo0 = new go.Geometry(go.Geometry.Line);
  geo0.startX = start.x - ax;
  geo0.startY = start.y - ay;
  if( a2*a9 == a3*a8 )
  {
    geo0.endX = 0;
    geo0.endY = 0;
  }
  else{
    geo0.endX = (a3*a7-a1*a9) / (a2*a9-a3*a8);
    geo0.endY = (a3*a10-a4*a9) / (a2*a9 - a3*a8);
  }
  conn0.geometry = geo0;

  var geo1 = new go.Geometry(go.Geometry.Line);
  geo1.endX = end.x - ax;
  geo1.endY = end.y - ay;

  if( a3*a8 == a2*a9 )
  {
    geo1.startX = 0;
    geo1.startY = 0;
  }
  else{
    geo1.startX = (a7*a8 - a1*a2) / (a3*a8 - a2*a9);
    geo1.startY = (a2*a10 - a4*a8) / (a3*a8 - a2*a9);
  }
  conn1.geometry = geo1;
*/
  var ad = conn0.part;
  ad.position = new go.Point(ax, ay);
};

/**
* @override
* @this {ConnectedHandlesLinkReshapingTool}
*/
ConnectedHandlesLinkReshapingTool.prototype.doCancel = function() {
  var link = this.adornedLink;
  go.LinkReshapingTool.prototype.doCancel.call(this);
  link.invalidateAdornments();  // delay update until after tool is finished
};