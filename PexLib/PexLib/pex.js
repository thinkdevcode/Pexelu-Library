/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.4.4-vsdoc.js" />

// Pexelu Library (PexLib)
// Version: 0.1.2, Last updated: 1/13/2011
// 
// Project Home - http://www.pexelu.com/lib
// GitHub       - https://github.com/thinkdevcode/Pexelu-Library
// Contact      - gin4lyfe@gmail.com
// 
// See License.txt for full license
// 
// Copyright (c) 2010 Eugene Alfonso,
// Licensed under the MIT license.

(function ($, window, undefined) {

    var pex = pex || {};    // main namespace

    pex.ui = pex.ui || {};       // user interface namespace
    pex.data = pex.data || {};   // data namespace
    pex.log = pex.log || {};     // logging namespace

    window.$$ = window.$$ || pex;        // provide a shortcut to pex namespace
    window.$$$ = window.$$$ || pex.ui;   // provide a shortcut ui namespace

    var that = this;    // get to private variables

    // You may change these to a number or use "slow"/"fast"
    pex.ui.modalSpeed = undefined;
    pex.ui.panelSpeed = undefined;

    /*
    * This function is used by ASP.NET for registering callback functions on
    * AJAX request. Disregard if you dont plan on using ASP.NET AJAX methods.
    *
    * @param {function} begin - a callback for beginning ajax requests
    * @param {function} end - a callback for ending ajax requests
    */
    pex.data.registerAjaxRequests = function (begin, end) {
        if (typeof begin === 'function' && typeof end === 'function' && Sys) {
            Sys.WebForms.PageRequestManager.getInstance().add_endRequest(begin);
            Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(end);
        }
    };

    /*
    * Preps the DIV that will be used as the modal background. Also preps
    * the DIVs to be used as modals. Use this function before using any modals.
    *
    * @param {string} bg - The DIV ID of the modal background to be used
    * @param {string-array} - The DIV ID's of the modal boxes to be used
    */
    pex.ui.prepModal = function (bg) {
        var index, modalCount;
        if (typeof bg === 'string') {
            pex.ui.modalSpeed = pex.ui.modalSpeed || "slow";
            $(bg).css(that.cssModalBG);
            modalCount = arguments.length;
            if (modalCount > 1) {
                for (var index = 1; index < modalCount; index += 1) {
                    if (typeof arguments[index] === 'string') {
                        $(arguments[index]).css(that.cssModalBox);
                    }
                }
            }
            that.modalBG = bg;
        }
    };

    /*
    * Display a modal by DIV ID. Use prepModal() before using this.
    *
    * @param {string} box - The DIV ID of the modal to show
    */
    pex.ui.showModal = function (box) {
        if (box !== undefined && typeof box === 'string'
                              && pex.ui.modalSpeed !== undefined) {
            pex.ui.centerModal(box);
            $(that.modalBG).fadeIn(pex.ui.modalSpeed);
            $(box).fadeIn(pex.ui.modalSpeed);
            that.currModal = box;

            //this might not work in IE6/7/8 - unless you use a jQuery resize plugin
            //Get it at: http://benalman.com/projects/jquery-resize-plugin/
            $(window).resize(function () {
                pex.ui.centerModal(box);
            });
        }
    };

    /*
    * Closes the currently open modal as well as the background DIV.
    */
    pex.ui.closeModal = function () {
        if (that.modalBG !== undefined && that.currModal !== undefined
                                       && pex.ui.modalSpeed !== undefined) {
            $(that.modalBG).fadeOut(pex.ui.modalSpeed);
            $(that.currModal).fadeOut(pex.ui.modalSpeed);
        }
    };

    /*
    * Centers the modal on screen.
    *
    * @param {string} box - The DIV ID of modal to center on screen
    */
    pex.ui.centerModal = function (box) {
        if (box !== undefined && typeof box === 'string') {
            var con = { width: ($(window).width()),
                height: ($(window).height())
            };
            var offset = {
                'top': ((con.height / 2) - ($(box).height() / 2)),
                'left': ((con.width / 2) - ($(box).width() / 2))
            };
            $(box).css(offset);
        }
    };

    /*
    * Preps the DIVs that will be used as the panels based off of their
    * parent controls. Use this function at page load before toggling a panel.
    *
    * @param {control, panel, map{offset}} - The jQuery object of the
    *                                            control and the panel
    */
    pex.ui.prepPanel = function (obj) {
        //set the panels position below the control
        function updatePosition(panel, ctrl, offset) {
            panel.css({ 'top':  ctrl.top
                              + ctrl.height
                              + offset.top,
                       'left':  ctrl.left
                              + offset.left });
        }
        pex.ui.panelSpeed = pex.ui.panelSpeed || "slow";
        if (typeof obj === 'object' && typeof obj.control === 'object' && typeof obj.panel === 'object') {
            //set the css of panel
            obj.panel.css(that.cssPanel);

            updatePosition(obj.panel, { top: obj.control.offset().top,
                                       left: obj.control.offset().left,
                                     height: obj.control.height() }, obj.offset);

            if (typeof obj.click === 'boolean' && obj.click) {
                obj.control.bind('click', { panel: obj.panel, offset: obj.offset }, function (event) {
                    pex.ui.togglePanel(event.data.panel.selector);
                });
            }
            //this might not work in IE7/8 - unless you use a jQuery resize plugin
            //Get it at: http://benalman.com/projects/jquery-resize-plugin/
            $(window).resize(function () {
                updatePosition(obj.panel, { top: obj.control.offset().top,
                    left: obj.control.offset().left,
                    height: obj.control.height()
                }, obj.offset);
            });
        }
        return pex.ui; // so we can chain calls
    };

    /*
    * Toggles the display of the panel. This also sets focus to the first
    * textbox in DIV (if one exists).
    *
    * @param {string} panel - The DIV ID of panel to toggle
    */
    pex.ui.togglePanel = function (panel) {
        if (panel !== undefined && typeof panel === 'string') {
            if (that.currPanel !== undefined && that.currPanel !== panel) {
                $(that.currPanel).css('display', 'none');
            }
            $(panel).fadeToggle(pex.ui.panelSpeed, function () {
                if ($(panel).css('display') != 'none') {
                    $(panel).children().each(function () {
                        var child = $(this);
                        if (child.is(":text")) {
                            child.focus();
                            return;
                        }
                    });
                }
            });
            that.currPanel = panel;
        }
    };

    /*
    * Close the current panel - if one exists
    */
    pex.ui.closeCurrentPanel = function () {
        if (that.currPanel != null) {
            $(that.currPanel).fadeOut(pex.ui.panelSpeed);
            that.currPanel = null;
        }
    };

    /*
    * Changes the background color of a table's TD elements on mouseover
    * and returns the color to the original on mouseout
    *
    * @param {string} table - the id of the table
    * @param {css} - the css background-color to change to
    */
    pex.ui.changeTableBg = function (table, color) {
        var origbg;
        $(table).find('tr:has(td)').
                 mouseover(function () {
                     origbg = $($(this).
                               children('td').
                               get(0)).
                               css('background-color');
                     $(this).
                       children('td').
                       css(color);
                 }).
                 mouseout(function () {
                     $(this).
                       children('td').
                       css('background-color', origbg);
                 });
    };

    pex.log.assignLog = function (container) {
        if (container !== undefined && typeof container === 'string') {

        }

    }

    var document = window.document; // INTERNAL
    this.currModal = undefined; // INTERNAL : name of currently open modal
    this.currPanel = undefined; // INTERNAL : the id of the currently open panel
    this.modalBG = undefined; // INTERNAL : name of div for modal background
    this.cssModalBox = { // INTERNAL : css style to add to the modal box
        'background-color': 'white',
        'filter': 'alpha(opacity=100)',
        'opacity': 1.0,
        'display': 'none',
        'z-index': 3000,
        'position': 'fixed'
    };
    this.cssModalBG = { // INTERNAL : css style to add to the background DIV
        'background': 'black',
        'filter': 'alpha(opacity=50)',
        'opacity': 0.5,
        'display': 'none',
        'width': '100%',
        'top': 0,
        'left': 0,
        'height': '100%',
        'z-index': 2000,
        'position': 'fixed'
    };
    this.cssPanel = { // INTERNAL : css to be used on the panels
        'z-index': 1000,
        'position': 'absolute',
        'display': 'none'
    };

})(jQuery, window);