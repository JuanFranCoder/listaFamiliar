'use strict';

module.exports = function (Producto) {
    /**
 * Pone a false el atributo comprar de todos los productos de la listaFamiliar asociada al usuario autenticado
 * @param {object} context Objeto context
 * @param {Function(Error)} callback
 */

    Producto.limpiarLista = function (context, callback) {
        //var ListaFamiliar=Producto.app.models.ListaFamiliar;
        var Usuario=Producto.app.models.Usuario;

        var id_usuario = context.req.accessToken.userId;
        var id_listaFamiliar;

        console.log("El id del usuario que ejecuta este método es: "+id_usuario);
        Usuario.findById(id_usuario, function(err, usuario_logueado){
            if(err)callback(err);
            id_listaFamiliar = usuario_logueado.listaFamiliarId;
            console.log("El id de la listaFamiliar del usuario logueado es: "+id_listaFamiliar);
            
            Producto.updateAll({listaFamiliarId:id_listaFamiliar}, {comprar:false}, function(err, productos){
                if(err)callback(err);
                Producto.find({where:{listaFamiliarId:id_listaFamiliar}}, function(err, listaProductos){
                    console.log(listaProductos);
                    if(err)callback(err);
                    callback(null, listaProductos);
                });
            });
        });
    };
};
