<?php
/*
Plugin Name: Diana Nails Site
Plugin URI: https://diananails.ro
Description: Servire pagini statice Diana Nails Studio
Version: 1.0
Author: Lucian Balu
Text Domain: diananails
*/

defined('ABSPATH') || exit;

class DianaNailsSite {

    private $plugin_url;
    private $plugin_dir;

    private $pages = [
        '/servicii.html'    => 'servicii.html',
        '/galerie.html'     => 'galerie.html',
        '/despre.html'      => 'despre.html',
        '/programari.html'  => 'programari.html',
        '/blog'             => 'blog/index.html',
        '/blog/'            => 'blog/index.html',
        '/blog/index.html'  => 'blog/index.html',
    ];

    public function __construct() {
        $this->plugin_url = plugin_dir_url(__FILE__);
        $this->plugin_dir = plugin_dir_path(__FILE__);
        add_action('template_redirect', [ $this, 'serve_page' ], 1);
    }

    public function serve_page() {
        $request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        if ( ! isset($this->pages[$request]) ) {
            $trimmed = rtrim($request, '/');
            if ( ! isset($this->pages[$trimmed]) ) {
                return;
            }
            $request = $trimmed;
        }

        $html_file = $this->plugin_dir . $this->pages[$request];

        if ( ! file_exists($html_file) ) return;

        $content = file_get_contents($html_file);
        $content = $this->fix_asset_paths($content);

        status_header(200);
        header('Content-Type: text/html; charset=utf-8');
        echo $content;
        exit;
    }

    private function fix_asset_paths($content) {
        $base = $this->plugin_url;

        // Stylesheet
        $content = str_replace(
            'href="styles.css"',
            'href="' . $base . 'styles.css"',
            $content
        );

        // JavaScript
        $content = str_replace(
            'src="app.js"',
            'src="' . $base . 'app.js"',
            $content
        );

        // Images in src/href attributes
        $content = preg_replace(
            '/\b(src|href)="images\//',
            '$1="' . $base . 'images/',
            $content
        );

        // Blog sub-links
        $content = str_replace(
            'href="blog/',
            'href="' . $base . 'blog/',
            $content
        );

        return $content;
    }
}

new DianaNailsSite();
