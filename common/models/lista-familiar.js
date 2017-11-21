'use strict';

module.exports = function(Listafamiliar) {
    Listafamiliar.beforeRemote('create', function(context, listafamiliar, next){
        context.args.data.owner = context.req.accessToken.userId;
        next();
    });
    Listafamiliar.afterRemote('create', function(context, listafamiliar, next) { 
        // obtener id de la lista que se ha creado y guardado en la BD
        var id_listaFamiliar=listafamiliar.id;
        // buscar ne la BD la instancia del usuario autenticado 
        var Usuario=Listafamiliar.app.models.Usuario;
        // también se puede usar listafamiliar.owner dentro del paréntesis
        Usuario.findById(context.req.accessToken.userId, function(err, usuario){
            if(err) next(err);
            usuario.listaFamiliarId = id_listaFamiliar;
            usuario.save();
        });
        next();
    });
};
