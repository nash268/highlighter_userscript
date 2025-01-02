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

    const color_list = {
        'r': '#FF6F61',
        // Soft Coral
        'y': '#FFDE64',
        // Benjamin Moore Yellow
        'g': '#98FF98',
        // Mint Green
        'b': '#87CEEB',
        // Sky Blue
    };

    function colorForKey() {

        document.addEventListener('keypress', (event) => {
            if (color_list[event.key]) {
                highlight_color = color_list[event.key];
            }
        }
        );
    }

    function highlighterColorTray() {

        if (document.body.querySelector('#color-tray') || document.head.querySelector('#color-tray-styles')) {
            document.body.querySelector('#color-tray').remove();
            document.head.querySelector('#color-tray-styles').remove();
            return;
        }
        // Add CSS for the color tray
        const styles = `
        #color-tray {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-wrap: wrap;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }

        .color-item {
            width: 30px;
            height: 30px;
            margin: 5px;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #ddd;
        }

        .color-item:hover {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
    `;
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.id = 'color-tray-styles';
        styleSheet.innerText = styles;

        const colorTray = document.createElement('div');
        colorTray.id = "color-tray";
        Object.entries(color_list).forEach( ([key,color]) => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.backgroundColor = color;
            colorItem.setAttribute('highlight_color', color);
            colorItem.title = key;
            colorTray.appendChild(colorItem);

            colorItem.addEventListener('click', () => {
                console.log(`Selected Color: ${color}`);
                highlight_color = color;
            }
            );
        }
        );

        document.head.appendChild(styleSheet);
        document.body.appendChild(colorTray);
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
        if ((event.altKey || (event.ctrlKey && event.shiftKey)) && (event.key == 'h' || event.key == 'H')) {
            event.preventDefault();
            event.stopPropagation();
            if (!highlighter_script_status) {
                colorForKey();
                highlighterColorTray();
                document.addEventListener('pointerup', applyHighlight);
                highlighter_script_status = true;
            } else {
                highlighterColorTray();
                document.removeEventListener('pointerup', applyHighlight);
                highlighter_script_status = false;
            }
        }
    }
    );

}
)();
