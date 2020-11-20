$(document).ready(function () {
    $("#form").submit(function (e) {
        var content = tinymce.get("texteditor").getContent();
        $("texteditor").html(content);
        return false
    });
});

