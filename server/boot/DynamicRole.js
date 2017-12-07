'use strict';
module.exports = function (app) {
    var Role = app.models.Role;
    var Usuario = app.models.Usuario;

    // definiendo rol miembroLista
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
    
    // definiendo rol propietarioLista
    Role.registerResolver('propietarioLista', function(role, context, callback){
        var listaFamiliar = app.models.ListaFamiliar;

        if(context.modelName !== 'Usuario'){
            return ProcessingInstruction.nextTick(() => cb(null, false));
        }
        // is the user logged in?
        var userId = context.accessToken.userId;
        if(!userId){
            return process.nextTick(() => cb(null, false));
        }

        Usuario.findById(userId, function(err, usuario){
            if(err)callback(err);
            // is the current user logged-in associated with this project?
            console.log(usuario);
            context.model.findById(context.modelId, function(err, instance){
                if(err)callback(err);
                if(!instance)callback("Instance not found");

                if(context.modelName == 'Usuario'){
                    // tenemos que comprobar si el usuario solicitante tiene alguna solicitud en la lista del usuario autenticado
                    if(context.method == 'rechazarSolicitud'){
                        listaFamiliar.find({where:{owner:usuario.listaFamiliarId}}, function(err, listafamiliar){
                            if(err)callback(err);
                            console.log(listafamiliar);
                            var esPropietario = false;
                            console.log(listafamiliar.owner); // no reconoce owner
                            if(usuario.userId == listafamiliar.owner)esPropietario=true;
                            callback(null, esPropietario);
                            console.log(esPropietario);
                        });
                    };
                };
            });
        });
    });
}