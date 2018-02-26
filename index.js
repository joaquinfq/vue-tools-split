/**
 * Crea la etiqueta para la sección especificada.
 *
 * @param {Object} output  Objeto donde se colocará el resultado.
 * @param {String} section Sección del código original a la que pertenece el código extraído.
 * @param {String} content Contenido de la sección extraída.
 *
 * @return {String}
 */
function createTag(output, section, content)
{
    const _sections = vueToolsSplit.sections;
    if (section in _sections)
    {
        let _html = _sections[section] + '\n';
        if (output.vue)
        {
            output.vue += _html;
        }
        else
        {
            output.vue = _html;
        }
        output[section] = content;
    }
}

/**
 * Extrae la sección desde el código fuente.
 * Tanto la etiqueta de apertura de la sección como la de cierre deben empezar en la primera columna.
 *
 * @param {String} source Código fuente del componente.
 * @param {String} name   Nombre de la sección.
 *
 * @returns {null|String}
 */
function extractSection(source, name)
{
    const _regexp  = new RegExp(`(?:^|\n)<${name}>\n*(.*?)\n+</${name}>(?:$|\n)`, 'ms');
    const _section = source.match(_regexp);
    //
    return _section && _section.length === 2
        ? _section[1]
        : null;
}

/**
 * Separa un componente .vue en las secciones que lo componente.
 *
 * @param {String} vueCode Contenido del componente .vue.
 *
 * @return {Object|false} Objeto con las secciones o `false` si no se pudo procesar el archivo.
 */
function vueToolsSplit(vueCode)
{
    let _result;
    if (vueCode)
    {
        _result = {};
        for (const _section of ['template', 'script', 'style'])
        {
            const _code = extractSection(vueCode, _section);
            if (_code)
            {
                createTag(_result, _section, _code);
            }
        }
    }
    else
    {
        _result = false;
    }
    //
    return _result;
}
/**
 * Plantillas para las secciones.
 * Se pueden reemplazar según sea necesario.
 *
 * @type {Object}
 */
vueToolsSplit.sections = {
    script   : '<script   src="./script.js"     />',
    style    : '<style    src="./style.css"     />',
    template : '<template src="./template.html" />'
};
//------------------------------------------------------------------------------
// Exportamos la función.
//------------------------------------------------------------------------------
module.exports = vueToolsSplit;
