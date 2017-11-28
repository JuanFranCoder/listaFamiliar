'use strict';

module.exports = function (Usuario) {

    /**
 * Aceptar la solicitud de un usuario
 * @param {object} context Objeto context
 * @param {Function(Error, array)} callback
 */

    Usuario.prototype.aceptarSolicitud = function (context, callback) {
        var listaUsuarios = [];
        var usuario_solicitante = this;
        var mi_listaFamiliarId = 0;
        var id_usuario_logueado = context.req.accessToken.userId;
        console.log("id usuario logueado: " + id_usuario_logueado);

        Usuario.findById(id_usuario_logueado, function (err, usuario) {
            if (err) callback(err);
            console.log(usuario);
            mi_listaFamiliarId = usuario.listaFamiliarId;
            console.log("id listaFamiliar del usuario logueado: " + mi_listaFamiliarId);

            usuario_solicitante.solicitudes.findById(mi_listaFamiliarId, function (err, solicitud) {
                if (err) callback(err);
                usuario_solicitante.listaFamiliarId = mi_listaFamiliarId;
                console.log("id listaFamiliar del usuario solicitante: " + usuario_solicitante.listaFamiliarId);
                // guardar usuario en BD 
                usuario_solicitante.save(function (err, usuario_solicitante) {
                    if (err) callback(err);
                    if (usuario_solicitante) console.log("Usuario guardado en la BD");

                    // borrar solicitud
                    usuario_solicitante.solicitudes.remove(mi_listaFamiliarId, function (err) {
                        if (err) callback(err);
                        if (callback) console.log("Usuario borrado de la BD");

                        // mostrar usuarios de la lista
                        Usuario.find({ where: { listaFamiliarId: mi_listaFamiliarId } }, function (err, usuarios) {
                            listaUsuarios.push(usuarios);
                            callback(null, listaUsuarios);
                            console.log(listaUsuarios);
                        });
                    });
                });

            });
        });
    };

     /**
     * Un usuario que participa en una lista puede denegar el acceso a un usuario que lo haya solicitado
     * @param {object} context "Objeto context"
     * @param {Function(Error, array)} callback
     */

    Usuario.prototype.rechazarSolicitud = function (context, callback) {
        /*
        var listaUsuarios;
        // TODO
        callback(null, listaUsuarios);
        */
        var listaUsuarios = [];
        var usuario_solicitante = this;
        var mi_listaFamiliarId = 0;
        var id_usuario_logueado = context.req.accessToken.userId;
        console.log("id usuario logueado: " + id_usuario_logueado);

        Usuario.findById(id_usuario_logueado, function (err, usuario) {
            if (err) callback(err);
            console.log(usuario);
            mi_listaFamiliarId = usuario.listaFamiliarId;
            console.log("id listaFamiliar del usuario logueado: " + mi_listaFamiliarId);

            usuario_solicitante.solicitudes.findById(mi_listaFamiliarId, function (err, solicitud) {
                if(err) callback(err);
                console.log("Mi solicitud: "+solicitud); // echo [object Object]                
                //callback(null, solicitud);

                usuario_solicitante.solicitudes.remove(mi_listaFamiliarId, function (err) {
                    if (err) callback(err);
                    if (callback) console.log("Solicitud borrada de la BD");

                    // mostrar usuarios de la lista
                    Usuario.find({ where: { listaFamiliarId: mi_listaFamiliarId } }, function (err, usuarios) {
                        listaUsuarios.push(usuarios);
                        callback(null, listaUsuarios);
                        console.log(listaUsuarios);
                    });
                });
            });
        });
    };
};
