const fs   = require('fs');
const path = require('path');
//------------------------------------------------------------------------------
// Exportamos un objeto con las funciones para que se puedan personalizar desde
// afuera según sea necesario.
//------------------------------------------------------------------------------
module.exports = {
    /**
     * Plantillas para las secciones.
     * Se pueden reemplazar según sea necesario.
     *
     * @type {Object}
     */
    sections : {
        script   : '<script   src="./script.js"     />',
        style    : '<style    src="./style.css"     />',
        template : '<template src="./template.html" />'
    },
    /**
     * Crea la etiqueta para la sección especificada.
     *
     * @param {Object} output  Objeto donde se colocará el resultado.
     * @param {String} section Sección del código original a la que pertenece el código extraído.
     * @param {String} content Contenido de la sección extraída.
     *
     * @return {String}
     */
    createTag(output, section, content)
    {
        const _sections = this.sections;
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
    },
    /**
     * Extrae la sección desde el código fuente.
     * Tanto la etiqueta de apertura de la sección como la de cierre deben empezar en la primera columna.
     *
     * @param {String} source Código fuente del componente.
     * @param {String} name   Nombre de la sección.
     *
     * @returns {null|String}
     */
    extractSection(source, name)
    {
        const _regexp  = new RegExp(`(?:^|\n)<${name}>\n*(.*?)\n+</${name}>(?:$|\n)`, 'ms');
        const _section = source.match(_regexp);
        //
        return _section && _section.length === 2
            ? _section[1]
            : null;
    },
    /**
     * Lee el archivo y lo divide.
     *
     * @param {String} vuefile Ruta al archivo `.vue`.
     *
     * @return {Object|null}
     */
    fromFile(vuefile)
    {
        return fs.existsSync(vuefile)
            ? this.split(fs.readFileSync(vuefile, 'utf-8'))
            : null;
    },
    /**
     * Separa un componente .vue en las secciones que lo componente.
     *
     * @param {String} vueCode Contenido del componente .vue.
     *
     * @return {Object|false} Objeto con las secciones o `false` si no se pudo procesar el archivo.
     */
    split(vueCode)
    {
        let _result;
        if (vueCode)
        {
            _result = {};
            for (const _section of ['template', 'script', 'style'])
            {
                const _code = this.extractSection(vueCode, _section);
                if (_code)
                {
                    this.createTag(_result, _section, _code);
                }
            }
        }
        else
        {
            _result = false;
        }
        //
        return _result;
    },
    /**
     * Función que permite escribir en un directorio los archivos separados.
     *
     * @param {Object}  result Objeto devuelto por la función `vueToolsSplit`.
     * @param {String?} outdir Directorio donde se colocarán los archivos. Debe existir.
     */
    write(result, outdir = '')
    {
        if (!outdir)
        {
            outdir = process.cwd();
        }
        const _sections = this.sections;
        for (const _section of Object.keys(result))
        {
            let _path;
            if (_section === 'vue')
            {
                _path = path.join(outdir, 'index.vue');
            }
            else
            {
                const _tpl = _sections[_section];
                if (_tpl)
                {
                    const _name = _tpl.match(/="([^"]+)"/);
                    if (_name)
                    {
                        _path = path.join(outdir, _name[1]);
                    }
                }
            }
            if (_path)
            {
                fs.writeFileSync(_path, result[_section], 'utf-8');
            }
        }
    }
};
