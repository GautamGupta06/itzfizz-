/**
 * Splits a string into per-character <span class="char"> elements
 * wrapped in overflow:hidden word groups for clean GSAP intro slide-up.
 */
export function splitChars(text) {
  return text
    .split(' ')
    .map((word) => {
      const chars = word
        .split('')
        .map((ch) => `<span class="char" aria-hidden="true" style="display:inline-block">${ch}</span>`)
        .join('')
      return `<span class="char-word" style="display:inline-block;overflow:hidden">${chars}</span>`
    })
    .join('<span aria-hidden="true">&nbsp;</span>')
}
