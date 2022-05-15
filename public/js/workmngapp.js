function listsearch() {
    let lists = $('.searchList tr');
    lists.show();
    for (let i = 0; i < $('.searchBox select').length; i++) {
        let item = $('.searchBox select').eq(i).attr('name');
        let target = $('.searchBox select').eq(i).val();
        if (target != '') {
            for (let j = 0; j < lists.length; j++) {
                if (!lists.eq(j).find('.' + item).find('span').hasClass(target)) {
                    lists.eq(j).hide();
                }
            };
        }
    };
}

function WorkHistoryButtonControl() {
    let work_end_enable = $('#inputWorkHistoryStart').val() >= $('#inputWorkHistoryEnd').val();
    if (work_end_enable) {
        $('#inputButtonEnd').prop('disabled', true);
        $('#inputButtonNext').prop('disabled', true);
    } else {
        $('#inputButtonEnd').prop('disabled', false);
        $('#inputButtonNext').prop('disabled', false);
    }
    let work_value = $('#inputWorkHistoryWork').val();
    console.log("work_value " + work_value);
    if (work_value === "null") {
        $('#inputButtonEnd').prop('hidden', false);
        $('#inputButtonNext').prop('hidden', true);
    } else {
        $('#inputButtonEnd').prop('hidden', true);
        $('#inputButtonNext').prop('hidden', false);
    }
}

$(function () {
    $(document).on('change', '.searchBox select', function () {
        listsearch();
    });
    $(document).on('change', '#inputWorkHistoryWork', function () {
        WorkHistoryButtonControl();
    });
    $(document).ready(function () {
        listsearch();
        WorkHistoryButtonControl();
    });
});