var sMap = {
    get: function(key, o) {
        return (o ? Util.supplant(this[key], o) : this[key] || (key + " - needs translation"));
    },
    title_login : "Bienvenidos al Simple Mapping System",
    button_no_login : "Salir",    
    mask_waiting_message: "Cargando...",
    email: "Email",
    title_update_settings: "Actualizar Perfíl",
    default_language: "Idioma",
    default_gps_format: "Formato GPS",
    default_measurement_system: "Sistema de Medición",
    button_save_and_start: "Guarduar y continuar",
    button_share: "Compartir",
    button_search: "Buscar",
    button_add_position: "Añadir Posición",
    button_select_project: "Elegir Proyecto",
    update_settings: "Cambiar Configuración",
    button_save: "Guardar",
    button_cancel: "Cancelar",
    latitude_DECIMAL: "Latitud (DEC)",
    longitude_DECIMAL: "Longitud (DEC)",
    latitude_DEGREE: "Latitud (DGR)",
    longitude_DEGREE: "Longitud (DGR)",
    altitude_IMPERIAL: "Altitud (Pies)",
    altitude_METRIC: "Altitude (Metros)",
    new_project: "Crear Nuevo Proyecto",
    title_add_position: "Añadir Posición",
    button_logout: "Salir",
    label_S: "S",
    label_N: "N",
    label_W: "O",
    label_E: "E",
    core_latitude: "Latitud",
    core_longitude: "Longitud",
    altitude: "Altitud",
    next: "Siguiente",
    back: "Atrás",
    cancel: "Cancelar",
    close: "Cerrar",
    button_manage_custom_fields: "Dirigir Campos",
    title_manage_custom_fields: "Dirigir Campos Personales",
    button_add_custom_field: "Añadir Campos Personales",
    no_records_returned: "Disculpe - no tenemos datos.",
    name: "Nombre",
    type: "Tipo",
    order: "Orden",
    button_close: "Cerrar",
    action: "Acción",
    label_DD: "Degree Decimal",
    label_DMS: "Deg/Min/Sec",
    label_UTMWGS84: "UTM (WGS84)",
    label_lat_zone: "Banda Latitud",
    label_lon_zone: "Zona Longitud",
    error_numbers_only: "{label}: Valor debe contener solamente numeros y decimales.",
    error_out_of_range: "{label}: Valor debe caber en el rango: {start} á {end}",
    error_select_latitude_zone: "Elegir una zona latitud.",
    error_select_longitude_zone: "Elegir una zona longitud.",
    error_whole_numbers_only: "{label}: Solamente numeros completos.",
    degree: "Grados",
    minute: "Minutos",
    second: "Secundos",
    northing: "Northing",
    easting: "Easting",
    done: "Hecho",
    sure_want_delete_custom_position_property: "Está seguro que quiere borrar esta propiedad? Los datos serán borrados de todas posiciones en el proyecto.",
    label_STRING: "Texto",
    label_IMAGE: "Imagen",
    label_IMAGE_LIST: "Galería de Imagenes",
    button_select_file: "Elegir Archivo",
    completed: "Completado",
    polyline_length: "Largo de polyline es {len} {unit}.",
    polygon_area: "Area de polygon es {area} {unit}.",
    feet: "pies",
    meters: "metros",
    miles: "millas",
    kilometers: "kilometros",
    core_icon: "Icono",
    upload_queue_full: "Está llena la cola. La cola puede tener {max_size} archivos al maximo.",
    upload_replace_file: "Está seguro que quiere reemplazar {file}?",
    upload_error: "{type} Error",
    upload_complete: "La subida ha sida completada",
    title_share: "Acceso del proyecto",
    invitation_message: "Saludos",
    enter_emails: "Correos (¡solamente Gmail!)",
    hint_invitation_message: "Introducir el texto que será mandado con su invitación.",
    hint_enter_emails: "Pegar o entrar una lista de correos, delimitada con comas",
    access_type: "Tipo de accesso",
    access_OWNER: "Propietario",
    access_READONLY: "Solo leer",
    access_PUBLIC: "Publico en la Red",
    access_COLLABORATOR: "Colaborador",
    existing_collaborators: "Colaboradores actuales (hacer click para removerlos)",
    button_send_invite: "Mandar Invitación",
    lightBox_image: "Imagen",
    lightBox_of: "de",
    button_export: "Exportar",
    remove: "Borrar",
    button_self_send_link: "Mandarme Link a Mi Proyecto",
    self_send_message: "Esto es el link a la vista pública de su proyecto:",
    edit: "Editar",
    already_uploaded_images_warning: "Ya ha subido {number_of_files} archivos. Hacer click aquí para borrarlos.",
    move_up_in_order: "Moverlo arriba",
    move_down_in_order: "Moverlo abajo",
    make_visible: "Revelarlo",
    make_hidden: "Esconderlo",
    visibility_label_Y: "Sí",
    visibility_label_N: "No",
    visible: "Visible",
    positionFields_moveUp: "Mover campo arriba",
    positionFields_moveDown: "Mover campo abajo",
    positionFields_delete: "Borrar campo del proyecto",
    positionFields_toggleVisibility: "Activar o desactivar la visibilidad del campo",
    label_NUMBER: "Número",
    enter_or_import_positions: "Subir Posición(es)",
    add_single_position: "Subir una Posición",
    import_multiple_positions_from_garmin: "Subir de su Garmin",
    import_multiple_positions_from_csv: "Importar de un archivo CSV",
    no_garmin_devices_connected: "¡Vaya! No podemos encontrar su Garmin conectado. Está seguro que está conectado a su compu?",
    no_garmin_communicator_plugin_installed: "Antes de manejar esta parte del sistema, tendrá que instalar el Garmin Communicator plugin. Quiere que le mandemos ahí ahorita?",
    map_garmin_name_field: "Relacionar Garmin nombre con:",
    do_not_map_garmin_field: "No relacionar un campo",
    no_mappable_field: "No tiene campos que pueda relacionar",
    default_google_map_type: "Tipo de Mapa Google",
    map_garmin_elev_field: "Relacionar Garmin altitúd con:",
    elevation: "Altitúd",

    /* duplicate this, because otherwise I dunno how to do it */
    welcome_message_EN_US : "What is the Simple Mapping System you say? <br/><br/>Well, it allows you to: <ul><li>Build</li><li>Annotate</li><li>and Share</li></ul>...collections of position data collected from anywhere in the world.<br/><br/>All you need is a GPS and a computer (which I can see that you have) and you're ready. Build a map of your town, plot out your favorite surfing spots, or collaborate with fellow engineers and build a topo study. Best part? It's free to you - which is pretty cool, eh?<br/><br/>Click \"Log in\" and start mapping!",
    welcome_message_ES_LA : "¿Qué es el Simple Mapping system? <br/><br/>Bueno, es un programa que le permite: <ul><li>Construir</li><li>Actualizar</li><li>y Compartir</li></ul>...colleciones de data recogido de cualquier lugar del mundo.<br/><br/>Solamente lo que necesita es un GPS y una computadora (y veo que tiene una) y está listo. Desarrollar un mapa de su pueblo, notar sus lugares favoritos de surfear, o colaborar con otros ingenieros y realizar un estudio de topografía. Lo mejor - es totalmente gratis. Macanudo, ¿verdad? Hacer click sobre \"Acceder\" para empezar.",
    welcome_message_FR_FR : "Qu'est-ce qu'est le Système Simple de Mapping, demandez-vous? <br/><br/>Bon, il vous permet de: <ul><li>Construire</li><li>Noter</li><li>et Partager</li></ul>...des collections de données de lieu qui sont collectées de partout du monde.<br /><br />Tout ce dont vous avez besoin, c'est un GPS et un ordinateur (et je peux déjà voir que vous avez un), et vous êtes prêt. Construisez une carte de votre village, notez vos lieux favorites de surfer, ou travaillez ensemble avec vos camarades d'ingénierie et faites une étude de topographie. Et la meilleure partie? C'est gratuit--qui est vraiment chouette, n'est-ce pas?<br /><br />Clickez \"Connectez-moi\" et commencez à faire du mapping!",
    EN_US: "English",
    ES_LA: "Español",
    FR_FR: "Français",
    button_login_EN_US : "Log in",
    button_login_ES_LA : "Acceder",
    button_login_FR_FR : "Connectez-moi"
};