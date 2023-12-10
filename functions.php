<?php
function steffestheme_scripts() {
    // Enqueue the main React app script
    wp_enqueue_script('steffestheme-react-app', get_template_directory_uri() . '/dist/main.js', array(), time(), true);
}
add_action('wp_enqueue_scripts', 'steffestheme_scripts');

function steffestheme_register_menus() {
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'steffestheme'), // Registers a primary menu
        'footer'  => __('Footer Menu', 'steffestheme'),  // Registers a footer menu
    ));
}
add_action('after_setup_theme', 'steffestheme_register_menus');

// Register REST API routes for menus
function register_api_menus() {
    register_rest_route('steffestheme/v1', '/menus/(?P<location>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'get_menu_items',
    ));
}
add_action('rest_api_init', 'register_api_menus');

// Get menu items based on location
function get_menu_items($request) {
    $menu_location = $request['location'];
    $menu_items = wp_get_nav_menu_items(get_nav_menu_locations()[$menu_location]);

    if (empty($menu_items)) {
        return new WP_Error('no_menu', 'Invalid menu', array('status' => 404));
    }

    return $menu_items;
}

// Enable CORS
function enable_cors() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
}
add_action('rest_pre_serve_request', 'enable_cors');

// Register custom endpoint for site settings
function register_custom_endpoint() {
    register_rest_route('custom-endpoint', '/site-settings', array(
        'methods'  => 'GET',
        'callback' => 'get_site_settings',
    ));
}

// Retrieve site settings in get_site_settings callback
function get_site_settings() {
    $site_settings = array(
        'front_page_id' => get_option('page_on_front'), // Retrieve the front page ID
        // Add other site settings as needed
    );

    return rest_ensure_response($site_settings);
}
add_action('rest_api_init', 'register_custom_endpoint');




function debug_front_page_id() {
    $front_page_id = get_option('front_page_id');
    error_log('Front Page ID: ' . $front_page_id); // Log to error log
    echo '<script>console.log("Front Page ID: ' . $front_page_id . '");</script>'; // Log to browser console
}
add_action('wp_enqueue_scripts', 'debug_front_page_id');



function get_front_page_id() {
    return (int)get_option('page_on_front');
}















// Custom Walker class for Bootstrap navigation menus
class Bootstrap_Walker_Nav_Menu extends Walker_Nav_Menu {
    // Add custom classes to menu items
    function start_lvl(&$output, $depth = 0, $args = null) {
        if ($depth > 0) {
            $indent = str_repeat("\t", $depth);
            $output .= "\n$indent<ul class=\"dropdown-menu\">\n";
        }
    }

    // Add custom classes to sub-menu items
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $indent = ($depth) ? str_repeat("\t", $depth) : '';

        $li_attributes = '';
        $class_names = $value = '';

        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $classes[] = ($args->walker->has_children) ? 'dropdown' : '';
        $classes[] = 'nav-item';
        if ($depth && $args->walker->has_children) {
            $classes[] = 'dropdown-submenu';
        }

        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args));
        $class_names = ' class="' . esc_attr($class_names) . '"';

        $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args);
        $id = strlen($id) ? ' id="' . esc_attr($id) . '"' : '';

        $output .= $indent . '<li' . $id . $value . $class_names . $li_attributes . '>';

        $atts = array();
        $atts['title'] = !empty($item->attr_title) ? $item->attr_title : '';
        $atts['target'] = !empty($item->target) ? $item->target : '';
        $atts['rel'] = !empty($item->xfn) ? $item->xfn : '';
        $atts['href'] = !empty($item->url) ? $item->url : '';

        // If item has_children add atts to a.
        if ($args->walker->has_children && $depth === 0) {
            $atts['data-bs-toggle'] = 'dropdown';
            $atts['class'] = 'dropdown-toggle';
        }

        $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args);

        $attributes = '';
        foreach ($atts as $attr => $value) {
            if (!empty($value)) {
                $value = ('href' === $attr) ? esc_url($value) : esc_attr($value);
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $item_output = $args->before;
        $item_output .= '<a' . $attributes . '>';
        $item_output .= $args->link_before . apply_filters('the_title', $item->title, $item->ID) . $args->link_after;
        $item_output .= '</a>';
        $item_output .= $args->after;

        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
    }
}
