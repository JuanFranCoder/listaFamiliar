'use strict';
module.exports = function (app) {
    var Role = app.models.Role;

    Role.registerResolver('miembroLista', function (role, context, callback) {
        if (context.modelName !== 'Producto') {
            return ProcessingInstruction.nextTick(() => cb(null, false));
        }
        var userId = context.accessToken.userId;
        if (!userId) {
            return process.nextTick(() => cb(null, false));
        }
        context.model.findById(context.modelId, function (err, producto) {
            if (err) return cb(err);
            if (!producto) return cb(new Error("Producto not found"));
        });
        // Step 2: check if User is part of the Team associated with this Project
        // (using count() because we only want to know if such a record exists)
        var Usuario = app.models.Usuario;
        Usuario.findById(userId, function(err, usuario){
            if(err)callback(err);
            if(usuario.listaFamiliarId!=null)var id_lista_usuario = usuario.listaFamiliarId;
            context.model.findById(context.modelId, function(err, producto){
                var id_listaFamiliar_producto = producto.listaFamiliarId;
                if(producto.listaFamiliarId == usuario.listaFamiliarId) callback(null, true);
                else callback(null, false);
            });
        });
    });
}