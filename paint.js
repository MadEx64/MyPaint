$(document).ready(function() {

'use strict';

var f_rec;
var f_cir;
var f_line;
var pos_rec;
var pos_cer;
var pos_line;
var erase = false;
var fill = false;
var state = "pen";
var mouse = {x: 0, y: 0};
var zone = $("#zone")[0];
var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");
var disableDeaw = true;
var zone_style = getComputedStyle(zone);

canvas.width = parseInt(zone_style.getPropertyValue("width"));
canvas.height = parseInt(zone_style.getPropertyValue("height"));

//default values//

ctx.lineWidth = 4.18;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#353535";
ctx.fillStyle = "#353535";

// Tool Selector //

$(".select").on("click", function () {
    state = $(this).data("type");
    var li = $(this).parent("li");
    $("li").removeClass("active");
    li.addClass("active");
});

$("#eraser").on("click", function () {
    var li = $(this).parent("li");
    if (!erase) {
        $("li").removeClass("active");
        li.addClass("active_erase");
        erase = true;
        $("[data-type='pen']").parent("li").addClass("active");
        state = "pen";
    } else {
        erase = false;
        state = "pen";
        $("li").removeClass("active");
        li.removeClass("active_erase");
    }
});

$(".draw_type").on("click", function () {
    fill = ($(this)[0].id === "fill") ? true : false;
    $(".draw_type").prop("checked", false);
    this.checked = true;
});

$("#range").on("input", function () {
    var size = $(this).val() / 20 * 10.4;
    ctx.lineWidth = size > 0 ? size : 1;
});

$("#color-picker").on("change", function () {
    ctx.strokeStyle = $(this).val();
    ctx.fillStyle = $(this).val();
});

$("#rgb").on("change", function () {
    ctx.strokeStyle = $(this).val();
    ctx.fillStyle = $(this).val();
});

// Options //

var select_and_draw = function () {
    ctx.globalCompositeOperation = "source-over";
    if (erase) {
        ctx.globalCompositeOperation = "destination-out";
    }
    ctx.closePath();
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

var draw = function () {
    ctx.globalCompositeOperation = "source-over";
    if (erase) {
        ctx.globalCompositeOperation = "destination-out";
    }
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};

var draw_line = function () {
    if (f_line) {
        ctx.beginPath();
        ctx.moveTo(pos_line[0], pos_line[1]);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();
        f_line = false;
    } else {
        pos_line = [mouse.x, mouse.y];
        f_line = true;
    }
};

var draw_rectangle = function () {
    if (f_rec) {
        ctx.beginPath();
        var cur = [pos_rec[0] - mouse.x, pos_rec[1] - mouse.y];
        ctx.rect(mouse.x, mouse.y, cur[0], cur[1]);
        select_and_draw();
        f_rec = false;
    } else {
        pos_rec = [mouse.x, mouse.y];
        f_rec = true;
    }
};

var draw_circle = function () {
    if (f_cir) {
        var diagonal = Math.pow(pos_cer[0] - mouse.x, 2) + Math.pow(pos_cer[1] - mouse.y, 2);
        diagonal = Math.sqrt(diagonal);
        console.log(pos_cer);
        ctx.beginPath();
        ctx.arc(pos_cer[0], pos_cer[1], diagonal, 0, 2 * Math.PI);
        select_and_draw();
        f_cir = false;
    } else {
        pos_cer = [mouse.x, mouse.y];
        f_cir = true;
    }
};

$("#zone").on("mousemove", function (e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

$("#zone").on("mousedown", canvas, function () {
    if (state === "pen" && disableDeaw) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        $("#zone").on("mousemove", canvas, draw);
    }
});

$("#zone").on("click", canvas, function () {
    switch (state) {
    case "line":
        draw_line();
        break;
    case "rectangle":
        draw_rectangle();
        break;
    case "circle":
        draw_circle();
        break;
    }
});

$("#zone").on("mouseup", canvas, function () {
    if (state === "pen") {
        $("#zone").unbind("mousemove", draw);
    }
});

$("#zone").on("mouseenter", canvas, function () {
    if (state === "pen") {
        $("#zone").unbind("mousemove", draw);
    }
});

$("#dl").on("click", function () {
    var data = canvas.toDataURL("image/png");
    this.href = data.replace(/^data:image\/[^;]/, "data:application/octet-stream");
});


$(".clear").on("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

});
