"use strict";
/* global EJS */

jQuery(document).ready(function($) {

    var template = $('#upload-progress-template').html();
    var progressParent = $('#upload-progress');

    function updateProgress(file, jqProgressParent){
        var prefix = 'upload_progress_';
        var target = $('#' + prefix + file.id, jqProgressParent);
        if(target.length === 1){
            if(file.percent == 100){
                $('.progress-value', target).html(file.percent + '%').fadeOut(2000);
            }else{
                $('.progress-value', target).html(file.percent + '%');
            }    
            if(file.src){
                $('.progress-link', target).attr('href', file.src);
                $('.progress-image', target).attr('src' ,file.thumbnail);
            }                    
        }else{
            var html = new EJS({text: template, type:'['}).render({id: prefix + file.id, name: file.name});
            progressParent.prepend(html);
        }
    };

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'pickfiles', //上传选择的点选按钮，**必需**
        uptoken_url: $('#uptoken_url').val(),
        //unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: $('#domain').val(),
        //bucket 域名，下载资源时用到，**必需**
        container: 'upload-area', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '10mb', //最大文件体积限制
        flash_swf_url: 'js/lib/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'upload-area', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
            mime_types: [{
                title: "Image files",
                extensions: "jpg,gif,png,bmp,jpeg"
            }]
        },
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                    console.log('file added');
                    updateProgress(file, progressParent);
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
                console.log('before file upload');
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                console.log('when file upload');
                updateProgress(file, progressParent);
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                var domain = up.getOption('domain');
                var res = $.parseJSON(info);

                var thumbnailLink = Qiniu.imageView2({
                    mode: 3, // 缩略模式，共6种[0-5]
                    w: 100, // 具体含义由缩略模式决定
                    h: 100, // 具体含义由缩略模式决定
                    q: 100, // 新图的图像质量，取值范围：1-100
                    format: 'png' // 新图的输出格式，取值范围：jpg，gif，png，webp等
                }, res.key);


                var sourceLink = domain + '/' + res.key; //获取上传成功后的文件的Url
                console.log("图片地址：" + sourceLink);
                console.log("缩略图地址：" + thumbnailLink);

                file.src = sourceLink;
                file.thumbnail = thumbnailLink;
                updateProgress(file, progressParent);
            },
            'Error': function(up, err, errTip) {
                console.log("Error");
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
                console.log('queue completed');
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "image_" + plupload.guid();
                // do something with key here
                return key
            }
        }
    });
});