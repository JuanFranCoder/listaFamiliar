'use strict';

module.exports = function (Listafamiliar) {
    Listafamiliar.beforeRemote('create', function (context, listafamiliar, next) {
        context.args.data.owner = context.req.accessToken.userId;
        next();
    });
    Listafamiliar.afterRemote('create', function (context, listafamiliar, next) {
        // obtener id de la lista que se ha creado y guardado en la BD
        var id_listaFamiliar = listafamiliar.id;
        // buscar ne la BD la instancia del usuario autenticado 
        var Usuario = Listafamiliar.app.models.Usuario;
        // también se puede usar listafamiliar.owner dentro del paréntesis
        Usuario.findById(context.req.accessToken.userId, function (err, usuario) {
            if (err) next(err);
            usuario.listaFamiliarId = id_listaFamiliar;
            usuario.save();
        });
        next();
    });

    /**
    * Un usuario crea una solicitud para unirse a una listaFamiliar
    * @param {object} req Objeto que contiene objeto request
    * @param {Function(Error, object)} callback
    */

    Listafamiliar.prototype.solicitar = function (req, callback) {
        var listaFamiliar = this;
        listaFamiliar.solicitudes.add(req.accessToken.userId, function (err) {
            if (err) callback(err);
            var solicitud = {
                listaFamiliarId: listaFamiliar.id,
                usuarioId: req.accessToken.userId
            }
            callback(null, solicitud);
        });
    };


    /**
 * Muestra los usuarios de la listaFamiliar a la que pertenezco
 * @param {object} context Objeto context
 * @param {Function(Error, array)} callback
 */

    Listafamiliar.mostrarUsuarios = function (context, callback) {
        var Usuario = Listafamiliar.app.models.Usuario;
        var idUsuario = context.req.accessToken.userId;

        Usuario.findById(idUsuario, function(err, usuario){
            if(err)callback(err);
            var id_listaFamiliar_usuario = usuario.listaFamiliarId;
            console.log("El id de la lista familiar del usuario logueado es: "+id_listaFamiliar_usuario);
            Usuario.find({where:{listaFamiliarId:id_listaFamiliar_usuario}, fields:["nombre","apellidos"]}, function(err, listaUsuarios){
                if(err)callback(err);
                console.log(listaUsuarios);
                callback(null, listaUsuarios);
            });
        });

        
    };

};
