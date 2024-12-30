// ==UserScript==
// @name         Text Highlighter
// @namespace    https://github.com/nash268/highlighter_userscript
// @version      1.0
// @description  Highlight selected text
// @author       nash268
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let highlighter_script_status = false;

    let highlight_color = '#FFDE64';

    function colorForKey() {

        const color_list = {
            'r': '#FF6F61',        // Soft Coral
            'y': '#FFDE64',        // Benjamin Moore Yellow
            'g': '#98FF98',        // Mint Green
            'b': '#87CEEB',        // Sky Blue
            'p': '#FFB6C1',        // Light Pink
            't': '#40E0D0',        // Turquoise
            'l': '#E6E6FA',        // Lavender
            'm': '#1BFC06',        // Pale Green
            's': '#B0C4DE'         // Light Steel Blue
        };

        document.addEventListener('keypress', (event) => {
            if (color_list[event.key]){
                highlight_color = color_list[event.key];
            }
        });
    }

    function applyHighlight() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.extractContents();

            // Create a span to wrap the selected text with persistent styling
            const span = document.createElement('span');
            span.style.color = "black";
            span.style.backgroundColor = highlight_color;
            span.appendChild(selectedText);

            range.insertNode(span);
            selection.removeAllRanges();
        }
    }

    document.addEventListener('keydown', (event) => {
        if ((event.altKey || (event.ctrlKey && event.shiftKey)) && (event.key=='h' || event.key=='H')){
            event.preventDefault();
            if (!highlighter_script_status){
                colorForKey();
                document.addEventListener('mousedown', applyHighlight);
                document.addEventListener('touchdown', applyHighlight);
                highlighter_script_status = true;
            } else {
                document.removeEventListener('mousedown', applyHighlight);
                document.removeEventListener('touchdown', applyHighlight);
                highlighter_script_status = false;
            }
        }
    });

})();
