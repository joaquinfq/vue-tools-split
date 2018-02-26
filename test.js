const assert        = require('assert');
const format        = require('util').format;
const vueToolsSplit = require('./index');
/**
 * Configuración de las secciones.
 * Verificamos que si existe un tag del mismo nombre en alguna parte del
 * código de esa sección, no se rompa el resultado.
 *
 * @type {Object}
 */
const sections      = {
    script   : {
        ext     : 'js',
        order   : 1,
        content : 'export { name : "<script></script>" };'
    },
    style    : {
        ext     : 'css',
        order   : 2,
        content : '#app { margin : 1px; /* <style></style> */}'
    },
    template : {
        ext     : 'html',
        order   : 0,
        content : '<div><template>Verificando</template> mi plantilla</div>'
    },
    vue      : {
        ext     : 'vue',
        order   : 4,
        content : ''
    }
};
//
let numAssertions   = 0;

/**
 * Compara el resultado con los valores predefinidos.
 *
 * @param {Object} result Resultado de la función `vueToolsSplit`.
 */
function cmp(result)
{
    const _sections = Object.keys(result).sort(sort);
    const _tags     = [];
    for (const _section of _sections)
    {
        if (_section !== 'vue')
        {
            _tags.push(vueToolsSplit.sections[_section]);
            assert.equal(result[_section], sections[_section].content);
            ++numAssertions;
        }
    }
    assert.equal(result.vue.trim(), _tags.join('\n'));
    ++numAssertions;
}

/**
 * Ordena las secciones para que el orden de verificación sea el mismo siempre.
 *
 * @param {String} section1 Sección 1 a comparar.
 * @param {String} section2 Sección 2 a comparar.
 *
 * @return {Number} Resultado de la comparación.
 */
function sort(section1, section2)
{
    return sections[section1].order - sections[section2].order;
}

/**
 * Envuelve el contenido en una etiiqueta.
 *
 * @param {String} tag Etiqueta a usar para envolver el contenido.
 *
 * @return {String} Contenido envuelto en la etiqueta.
 */
function wrap(tag)
{
    return format('<%s>\n%s\n</%s>\n', tag, sections[tag].content, tag);
}

//------------------------------------------------------------------------------
// Inicio de las pruebas
//------------------------------------------------------------------------------
const keys = Object.keys(sections).filter(s => s !== 'vue');
keys.forEach(
    key1 =>
    {
        const _wrap1 = wrap(key1);
        keys.forEach(
            key2 =>
            {
                const _wrap2 = wrap(key2);
                keys.forEach(
                    key3 =>
                    {
                        const _k = [_wrap1];
                        if (key2 !== key1)
                        {
                            _k.push(_wrap2);
                        }
                        if (key3 !== key2 && key3 !== key1)
                        {
                            _k.push(wrap(key3));
                        }
                        cmp(vueToolsSplit(_k.join('\n')));
                    }
                )
            }
        )
    }
);
console.log('Total aserciones: %d', numAssertions);
