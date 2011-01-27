/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.4.4-vsdoc.js" />

// Pexelu Library (PexLib)
// Version: 0.1.3, Last updated: 1/26/2011
// 
// Project Home - http://www.pexelu.com/lib
// GitHub       - https://github.com/thinkdevcode/Pexelu-Library
// Contact      - gin4lyfe@gmail.com
// 
// See License.txt for full license
// 
// Copyright (c) 2010 Eugene Alfonso,
// Licensed under the MIT license.

(function($, window, undefined) {

    var pex = (function($, window) {

        //our interface
        var that = {},

        //Our lovely library version
        version = "0.1.3",

        //our function extension
        fn = fn || {},

        //local variable for current document
        document = window.document,

        //get the version number of library
        getLibVersion = function() {
            return version;
        };

        //make it accessible to extension functions
        fn.getLibVersion = getLibVersion();

        that.fn = fn;

        return (window.pex = window.$$ = that.fn);

    })($, window);


    //data library extension
    (function() {

        pex.data = (function() {

            return {

                /*
                * This function is used by ASP.NET for registering callback functions on
                * AJAX request. Disregard if you dont plan on using ASP.NET AJAX methods.
                *
                * @param {function} start - a callback for beginning ajax requests
                * @param {function} stop - a callback for ending ajax requests
                */
                registerAjaxEvents: function(start, stop) {
                    if (typeof start === 'function' && typeof stop === 'function' && Sys) {
                        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(start);
                        Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(stop);
                    }
                    return pex.ui;
                }


            };

        })();

    })();


    //user interface library extension
    (function() {

        pex.ui = (function() {

            //name of currently open modal
            var currModal = undefined,

            //the id of the currently open panel
            currPanel = undefined,

            //name of div for modal
            modalBG = undefined,

            //css style to add to the modal box
            cssModalBox = {
                'background-color': 'white',
                'filter': 'alpha(opacity=100)',
                'opacity': 1.0,
                'display': 'none',
                'z-index': 3000,
                'position': 'fixed'
            },

            //css style to add to the background DIV
            cssModalBG = {
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
            },

            //css to be used on the panels
            cssPanel = {
                'z-index': 1000,
                'position': 'absolute',
                'display': 'none'
            },

            //speed of modal (defaults to 'slow')
            modalSpeed,

            //speed of panel (defaults to 'slow')
            panelSpeed,

            //centers the modal on screen
            centerModal = function(box) {
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

            return {

                /*
                * Set the speed of opening the modals
                *
                * @param {string||number} speed - the speed (can be 'fast', 'slow' or a number in milliseconds)
                */
                setModalSpeed: function(speed) {
                    if (typeof speed === 'string' || typeof speed === 'number') {
                        modalSpeed = speed;
                    }
                    return pex.ui;
                },

                /*
                * Set the speed of opening the panels
                *
                * @param {string||number} speed - the speed (can be 'fast', 'slow' or a number in milliseconds)
                */
                setPanelSpeed: function(speed) {
                    if (typeof speed === 'string' || typeof speed === 'number') {
                        panelSpeed = speed;
                    }
                    return pex.ui;
                },

                /*
                * Preps the DIV that will be used as the modal background. Also preps
                * the DIVs to be used as modals. Use this function before using any modals.
                *
                * @param {string} bg - The DIV ID of the modal background to be used
                * @param {string-array} - The DIV ID's of the modal boxes to be used
                */
                prepModal: function(bg) {
                    var index, modalCount;
                    if (typeof bg === 'string') {
                        modalSpeed = modalSpeed || 'slow';
                        $(bg).css(cssModalBG);
                        modalCount = arguments.length;
                        if (modalCount > 1) {
                            for (var index = 1; index < modalCount; index += 1) {
                                if (typeof arguments[index] === 'string') {
                                    $(arguments[index]).css(cssModalBox);
                                }
                            }
                        }
                        modalBG = bg;
                    }
                    return pex.ui;
                },

                /*
                * Display a modal by DIV ID. Use prepModal() before using this.
                *
                * @param {string} box - The DIV ID of the modal to show
                */
                showModal: function(box) {
                    if (box !== undefined && typeof box === 'string' && modalSpeed !== undefined) {
                        centerModal(box);
                        $(modalBG).fadeIn(modalSpeed);
                        $(box).fadeIn(modalSpeed);
                        currModal = box;

                        //this might not work in some browsers 100% unless you use a jQuery resize plugin
                        //Get it at: http://benalman.com/projects/jquery-resize-plugin/
                        $(window).resize(function() {
                            centerModal(box);
                        });
                    }
                    return pex.ui;
                },

              /*
                * Closes the currently open modal as well as the background DIV.
                */
                closeModal: function () {
                    if (modalBG !== undefined && currModal !== undefined && modalSpeed !== undefined) {
                        $(modalBG).fadeOut(modalSpeed);
                        $(currModal).fadeOut(modalSpeed);
                    }
                },

                /*
                * Preps the DIVs that will be used as the panels based off of their
                * parent controls. Use this function at page load before toggling a panel.
                *
                * @param {control, panel, map{offset}} - The jQuery object of the control and the panel
                */
                prepPanel: function(obj) {

                    //set the panels position below the control
                    function updatePosition(panel, ctrl, offset) {
                        panel.css({ 'top': ctrl.top + ctrl.height + offset.top,
                            'left': ctrl.left + offset.left
                        });
                    }

                    panelSpeed = panelSpeed || "slow"; //set default speed if not set already

                    if (typeof obj === 'object' && typeof obj.control === 'object' && typeof obj.panel === 'object') {

                        //set the css of panel
                        obj.panel.css(cssPanel);

                        updatePosition(obj.panel, { top: obj.control.offset().top, left: obj.control.offset().left, height: obj.control.height() }, obj.offset);

                        if (typeof obj.click === 'boolean' && obj.click) {
                            obj.control.bind('click', { panel: obj.panel, offset: obj.offset }, function(e) {
                                pex.ui.togglePanel(e.data.panel.selector);
                            });
                        }

                        //this might not work in IE7/8 - unless you use a jQuery resize plugin
                        //Get it at: http://benalman.com/projects/jquery-resize-plugin/
                        $(window).resize(function() {
                            updatePosition(obj.panel, { top: obj.control.offset().top, left: obj.control.offset().left, height: obj.control.height() }, obj.offset);
                        });
                    }

                    return pex.ui; // so we can chain calls
                },

                /*
                * Toggles the display of the panel. This also sets focus to the first
                * textbox in DIV (if one exists).
                *
                * @param {string} panel - The DIV ID of panel to toggle
                */
                togglePanel: function(panel) {
                    if (panel !== undefined && typeof panel === 'string') {
                        if (currPanel !== undefined && currPanel !== panel) {
                            $(currPanel).css('display', 'none');
                        }
                        $(panel).fadeToggle(panelSpeed, function() {
                            if ($(panel).css('display') != 'none') {
                                $(panel).children().each(function() {
                                    var child = $(this);
                                    if (child.is(":text")) {
                                        child.focus();
                                        return;
                                    }
                                });
                            }
                        });
                        currPanel = panel;
                    }
                    return pex.ui;
                },

                /*
                * Close the currently open panel - if one exists
                */
                closeCurrentPanel: function() {
                    if (currPanel !== null) {
                        $(currPanel).fadeOut(panelSpeed);
                        currPanel = null;
                    }
                },

                /*
                * Changes the background color of a table's TD elements on mouseover
                * and returns the color to the original on mouseout
                *
                * @param {string} table - the id of the table
                * @param {css} - the css background-color to change to
                */
                changeTableBg: function(table, color) {
                    if (typeof table === 'string' && typeof color === 'object') {
                        var origbg;
                        $(table).find('tr:has(td)').
                             mouseover(function() {
                                 origbg = $($(this).
                                           children('td').
                                           get(0)).
                                           css('background-color');
                                 $(this).
                                   children('td').
                                   css(color);
                             }).
                             mouseout(function() {
                                 $(this).
                                   children('td').
                                   css('background-color', origbg);
                             });
                    }
                    return pex.ui;
                }


            };

        })();

    })();


})(jQuery, window);