var DDL = function () {
    this.init.apply(this, arguments);
}
DDL.prototype = {
    const_arrow: '<span class="ddl-arrow"></span>',
    select: null,
    input: null,
    globalClickBinding: null,
    globalKeyBinding: null,
    init: function (el) {
        this.select = el;
        this.globalClickBinding = this.globalClick.bind(this);
        this.globalKeyBinding = this.globalKey.bind(this);
        this.create_input();
        this.select.hide();
        this.select.bind('forcechange', this.select_changed.bind(this));
    },
    create_input: function () {
        var ddl = $('<div>');
        ddl.html("&nbsp;");
        ddl.addClass("ddl");
        var existingDDL = this.select.parent().find('div.ddl').remove();
        ddl.attr('style', $(existingDDL[0] || this.select).attr('style'));
        var selected = this.select.find("option:selected");
        var def = this.select.data("default");
        if (def) {
            ddl.html(def + this.const_arrow);
        } else if ($(this.select).attr('disabled') != 'disabled' && selected.length > 0) {
            ddl.html(selected.text() + this.const_arrow);
        }
        ddl.attr("tabindex", this.select.attr("tabindex"));
        ddl.click(this.input_click.bind(this));
        this.select.parent().append(ddl, this.select);
        this.input = ddl;
    },
    input_click: function () {
        if (window.currentDdl == this) {
            this.close();
            window.currentDdl = undefined;
            return;
        }
        if (window.currentDdl) {
            window.currentDdl.close();
        }
        if ($(this.select).attr('disabled') == 'disabled')
            return false;
        window.currentDdl = this;
        var ac_results = $('.ac_results');
        ac_results.html('');
        var ul = $("<ul>");
        ac_results.append(ul);
        var options = this.select.find("option");
        var selected = this.select.find("option:selected").attr("value");
        var clickb = this.itemClicked.bind(this);
        var enterb = this.itemEnter.bind(this);
        var leaveb = this.itemLeave.bind(this);
        var $this, li;
        options.each(function () {
            $this = $(this);
            li = $("<li>").addClass("ac_result").html($this.text()).attr("data-val", $this.attr("value"));
            if ($this.attr("value") === selected) {
                li.addClass("ac_over");
            }
            li.click(clickb).mouseenter(enterb).mouseleave(leaveb);
            ul.append(li);
        });
        var offset = this.input.offset();
        ac_results.css({
            width: this.input.outerWidth(),
            left: offset.left,
            top: offset.top + this.input.outerHeight(),
            display: "block"
        });
        setTimeout(function () {
            $(document).bind('click', this.globalClickBinding).bind('keydown', this.globalKeyBinding);
        }.bind(this), 10);
    },
    close: function () {
        window.currentDdl = undefined;
        $(document).unbind('click', this.globalClickBinding).unbind('keydown', this.globalKeyBinding);
        $('.ac_results').hide().html('');
    },
    itemClicked: function (e) {
        this.itemEnter(e);
        this.selectOver();
        this.close();
    },
    itemEnter: function (e) {
        $(e.target).addClass("ac_over").siblings('li').removeClass('ac_over');
    },
    itemLeave: function (e) {
        $(e.target).removeClass("ac_over");
    },
    globalClick: function () {
        this.close();
    },
    selectOver: function () {
        var ac_over = $('.ac_over');
        var overval = ac_over.attr("data-val");
        this.input.html(ac_over.html() + this.const_arrow);
        var options = this.select.find("option");
        options.prop("selected", false);
        var $this;
        options.each(function () {
            $this = $(this);
            if ($this.val() === overval) {
                $this.prop("selected", true);
                return;
            }
        });
        this.select.trigger("change");
    },
    globalKey: function (e) {
        var down = 40;
        var up = 38;
        var enter = 13;
        if (e.which != down && e.which != up && e.which != enter)
            return;
        var ac_over = $('.ac_over');
        if (e.which === enter) {
            this.selectOver();
            this.close();
            return;
        }
        var ac_next = ac_over.next();
        if (ac_next.length === 0) {
            ac_next = ac_over.parent().find(":first");
        }
        if (e.which === up) {
            ac_next = ac_over.prev();
            if (ac_next.length === 0) {
                ac_next = ac_over.parent().find(":last");
            }
        }
        ac_next.addClass("ac_over");
        ac_over.removeClass("ac_over");
    },
    select_changed: function () {
        var val = this.select.val();
        var opt = this.select.find('option[value="' + val + '"]');
        opt.prop("checked", true);
        this.input.html(opt.html() + this.const_arrow);
    }
};