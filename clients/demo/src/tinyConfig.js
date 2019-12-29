// TinyMCE Configuration
export const getTinyConfig = (readOnly) => ({
    content_style: '.mce-content-body {font-size: 13px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif}',
    plugins: ['advlist autolink lists link charmap',
        'visualchars codesample',
        'media nonbreaking save table contextmenu autoresize',
        'paste textcolor textpattern toc help'],
    menubar: false,
    branding: false,
    elementpath: false,
    forced_root_block: '',
    statusbar: false,
    toolbar1: 'bold italic underline strikethrough | subscript superscript | backcolor | link charmap | bullist numlist | table | codesample | help',
    // This limits the bgColor to yellow only
    textcolor_cols: '2',
    textcolor_rows: '1',
    textcolor_map: ['FFFF00', 'Yellow'],
    readonly: readOnly,
    autoresize_bottom_margin: 1,
    content_css: '/static/tinymce.css',
    table_default_attributes: {
        border: 1,
        cellpadding: 2,
    },
    table_default_styles: {
        borderCollapse: 'collapse',
        width: '250px',
    },
    relative_urls: false,
    remove_script_host: false,
});

