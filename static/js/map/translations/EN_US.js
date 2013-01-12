var sMap = {
    get: function(key, o) {
        return (o ? Util.supplant(this[key], o) : this[key] || (key + " - needs translation"));
    },
    title_login : "SimpleMappingSystem.com",
    button_no_login : "Nope, I'm outta here",
    mask_waiting_message: "Loading...",
    email: "Email",
    title_update_settings: "Update your profile info",
    default_language: "Language",
    default_gps_format: "GPS Format",
    default_measurement_system: "Measurements",
    button_save_and_start: "Save and start mapping!",
    button_share: "Share",
    button_search: "Search Positions",
    button_add_position: "Add Position",
    button_select_project: "Select Project",
    update_settings: "Update My Settings",
    button_save: "Save",
    button_cancel: "Cancel",
    latitude_DECIMAL: "Latitude (DD)",
    longitude_DECIMAL: "Longitude (DD)",
    latitude_DEGREE: "Latitude (DGR)",
    longitude_DEGREE: "Longitude (DGR)",
    altitude_IMPERIAL: "Altitude (Feet)",
    altitude_METRIC: "Altitude (Meters)",
    new_project: "Create New Project",
    title_add_position: "Add Position",
    button_logout: "Sign Out",
    label_S: "S",
    label_N: "N",
    label_W: "W",
    label_E: "E",
    core_latitude: "Latitude",
    core_longitude: "Longitude",
    altitude: "Altitude",
    next: "Next",
    back: "Back",
    cancel: "Cancel",
    close: "Close",
    button_manage_custom_fields: "Manage Fields",
    title_manage_custom_fields: "Manage Custom Fields",
    button_add_custom_field: "Add Custom Field",
    no_records_returned: "Sorry Hoss, no data.",
    name: "Name",
    type: "Type",
    order: "Order",
    button_close: "Close",
    action: "Action",
    label_DD: "Degree Decimal",
    label_DMS: "Deg/Min/Sec",
    label_UTMWGS84: "UTM (WGS84)",
    label_lat_zone: "Latitude Zone",
    label_lon_zone: "Longitude Zone",
    error_numbers_only: "{label}: Value should be numbers and decimals only; no letters or symbols.",
    error_out_of_range: "{label}: Value should be inside range: {start} to {end}",
    error_select_latitude_zone: "Select a latitude zone.",
    error_select_longitude_zone: "Select a longitude zone.",
    error_whole_numbers_only: "{label}: Whole, positive numbers only.",
    degree: "Degree",
    minute: "Minute",
    second: "Second",
    northing: "Northing",
    easting: "Easting",
    done: "Done",
    sure_want_delete_custom_position_property: "Are you sure you want to delete this property? This data will be removed from all positions already added to the project.",
    label_STRING: "Text",
    label_IMAGE: "Big Image",
    label_IMAGE_LIST: "Image Gallery",
    button_select_file: "Select File",
    completed: "Completed",
    polyline_length: "Polyline length is {len} {unit}.",
    polygon_area: "Polygon area is {area} {unit}.",
    feet: "feet",
    meters: "meters",
    miles: "miles",
    kilometers: "kilometers",
    core_icon: "Position Icon",
    upload_queue_full: "The queue is full. Maximum queue size is {max_size}.",
    upload_replace_file: "Do you want to replace the file {file}?",
    upload_error: "{type} Error",
    upload_complete: "Completed",
    title_share: "Project Access",
    invitation_message: "Greeting",
    enter_emails: "Emails (Gmail only!)",
    hint_invitation_message: "Enter the text that'll be sent out along with your invitation link.",
    hint_enter_emails: "Paste or type in a list of emails, separated by commas",
    access_type: "Access Type",
    access_OWNER: "Owner",
    access_READONLY: "Read-only",
    access_PUBLIC: "Public on the Web",
    access_COLLABORATOR: "Collaborator",
    existing_collaborators: "Existing Collaborators (click to remove)",
    button_send_invite: "Send Invite",
    lightBox_image: "Image",
    lightBox_of: "of",
    button_export: "Export",
    remove: "Remove",
    button_self_send_link: "Send Me Link to My Project",
    self_send_message: "This is the link to the public-facing view of your project. Embed this in a website, mail it to your friends - get creative with it.",
    edit: "Edit",
    already_uploaded_images_warning: "You have already uploaded {number_of_files} files. Click here to remove them.",
    move_up_in_order: "Move up",
    move_down_in_order: "Move down",
    make_visible: "Make visible",
    make_hidden: "Hide",
    visibility_label_Y: "Yes",
    visibility_label_N: "No",
    visible: "Visible",
    positionFields_moveUp: "Move field up",
    positionFields_moveDown: "Move field down",
    positionFields_delete: "Delete field from project",
    positionFields_toggleVisibility: "Toggle visibility of field",
    label_NUMBER: "Number",
    enter_or_import_positions: "Enter Position(s)",
    add_single_position: "Add Single Position",
    import_multiple_positions_from_garmin: "Import from Garmin device",
    import_multiple_positions_from_csv: "Import from a CSV file",
    no_garmin_devices_connected: "Hey! We couldn't find your Garmin device. Is it really connected to your computer?",
    no_garmin_communicator_plugin_installed: "You need to first install the Garmin Communicator plugin before using this feature. Shall we send you there now?",
    map_garmin_name_field: "Map Garmin name field to:",
    do_not_map_garmin_field: "Do not map Garmin field to anything",
    no_mappable_field: "I don't have any mappable fields, actually",
    default_google_map_type: "Default Map Type",
    map_garmin_elev_field: "Map Garmin elev field to:",
    elevation: "Elevation",

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