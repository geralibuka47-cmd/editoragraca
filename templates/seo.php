<?php

/**
 * Editora Graça — SEO Template
 * Handles dynamic meta tags for SEO and Social Media
 */

// Default values
$defaultTitle = "Editora Graça | Excelência Editorial em Angola";
$defaultDesc = "A Editora Graça é uma casa editorial focada na qualidade literária e na promoção da cultura angolana e lusófona.";
$defaultImage = "https://editoragraca.ao/public/img/og-image.jpg"; // Absolute URL
$currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

// Use page-specific values if defined, otherwise defaults
$seoTitle = isset($pageTitle) ? $pageTitle . " | Editora Graça" : $defaultTitle;
$seoDesc = isset($pageDescription) ? $pageDescription : $defaultDesc;
$seoImage = isset($pageImage) ? $pageImage : $defaultImage;
?>

<!-- Primary Meta Tags -->
<title><?php echo $seoTitle; ?></title>
<meta name="title" content="<?php echo $seoTitle; ?>">
<meta name="description" content="<?php echo $seoDesc; ?>">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="<?php echo $currentUrl; ?>">
<meta property="og:title" content="<?php echo $seoTitle; ?>">
<meta property="og:description" content="<?php echo $seoDesc; ?>">
<meta property="og:image" content="<?php echo $seoImage; ?>">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="<?php echo $currentUrl; ?>">
<meta property="twitter:title" content="<?php echo $seoTitle; ?>">
<meta property="twitter:description" content="<?php echo $seoDesc; ?>">
<meta property="twitter:image" content="<?php echo $seoImage; ?>">

<!-- Canonical -->
<link rel="canonical" href="<?php echo $currentUrl; ?>">