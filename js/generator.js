/**
 * Random string generator.
 * Outputs to a textarea.
 */
class Generator {

    /**
     * Constructor
     */
    constructor(){
        /**
         * The element wrapper
         * @type {HTMLElement}
         */
        this.wrapper = document.getElementById('generator');

        /**
         * The textarea output
         * @type {HTMLElement}
         */
        this.textarea = this.wrapper.querySelector('[name="random"]');

        /**
         * The length input
         * @type {HTMLElement}
         */
        this.length = this.wrapper.querySelector('[name="length"]');

        /**
         * The generate button
         * @type {HTMLElement}
         */
        this.generate = this.wrapper.querySelector('[name="generate"]');

        // On click generate a random string and output to textarea
        this.generate.addEventListener('click', (event) => {
            this.textarea.value = '';
            let data = this.generateData(this.length.value);
            this.textarea.value = data;
        });
    }

    /**
     * Generate a random string of data
     * @param {Number} length 
     * @returns {String}
     */
    generateData(length){
        return window.btoa(
            Array.from(
                window.crypto.getRandomValues(
                    new Uint8Array(length * 2)
                )
            ).map((b) => String.fromCharCode(b))
             .join(""))
             .replace(/[+/]/g, "")
             .substring(0, length);
    }
}