"use strict";
/* global EJS */

jQuery(document).ready(function($) {

    var tpls = {};
    var jqels = {};
    var vars = {};
    var funcs = {};

    funcs.init = function() {
        vars.imageLimit = 9;//每次加载图片的数量
        vars.domain = $('#domain').val();
        vars.uptokenUrl = $('#uptoken_url').val();

        jqels.progressParent = $('#upload-progress');
        jqels.newNest = $('#newNest');
        jqels.loadMore = $('#load_more');
        jqels.imageMarker = $('#imageMarker');

        tpls.galleryTplContainer = $('#gallery-tpl-container').html();
        tpls.galleryTplNest = [];
        tpls.galleryTplNest[1] = $('#gallery-tpl-nest1').html();
        tpls.galleryTplNest[2] = $('#gallery-tpl-nest2').html();
        tpls.galleryTplNest[3] = $('#gallery-tpl-nest3').html();
        tpls.galleryTplNest[4] = $('#gallery-tpl-nest4').html();
        tpls.galleryTplNest[5] = $('#gallery-tpl-nest5').html();
        tpls.galleryTplNest[6] = $('#gallery-tpl-nest6').html();
        tpls.galleryTplNest[7] = $('#gallery-tpl-nest7').html();
        tpls.galleryTplNest[8] = $('#gallery-tpl-nest8').html();
        tpls.galleryTplNest[9] = $('#gallery-tpl-nest9').html();
        tpls.uploadProgressTpl = $('#upload-progress-template').html();
    }

    funcs.init();

    funcs.updateProgress = function(file, jqProgressParent) {
        var prefix = 'upload_progress_';
        var target = $('#' + prefix + file.id, jqProgressParent);
        if (target.length === 1) {
            if (file.percent == 100) {
                $('.progress-value', target).html(file.percent + '%').fadeOut(2000);
            } else {
                $('.progress-value', target).html(file.percent + '%');
            }
            if (file.src) {
                $('.progress-link', target).attr('href', file.src);
                $('.progress-image', target).attr('src', file.thumbnail);
            }
        } else {
            var html = new EJS({
                text: tpls.uploadProgressTpl,
                type: '['
            }).render({
                id: prefix + file.id,
                name: file.name
            });
            jqels.progressParent.prepend(html);
        }
    };

    vars.uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'pickfiles', //上传选择的点选按钮，**必需**
        uptoken_url: vars.uptokenUrl,
        //unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: vars.domain,
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
                    funcs.updateProgress(file, jqels.progressParent);
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
                // console.log('before file upload');
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                // console.log('when file upload');
                funcs.updateProgress(file, jqels.progressParent);
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
                    mode: 1, // 缩略模式，共6种[0-5]
                    w: 171, // 具体含义由缩略模式决定
                    h: 180, // 具体含义由缩略模式决定
                }, res.key);


                var sourceLink = domain + '/' + res.key; //获取上传成功后的文件的Url
                console.log("图片地址：" + sourceLink);
                console.log("缩略图地址：" + thumbnailLink);

                file.src = sourceLink;
                file.thumbnail = thumbnailLink;
                funcs.updateProgress(file, jqels.progressParent);

                funcs.addImages([{key: res.key}]);
            },
            'Error': function(up, err, errTip) {
                console.log('error:' + errTip);
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
                // console.log('queue completed');
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "image_" + plupload.guid();
                // do something with key here
                return key;
            }
        }
    });

    funcs.getMainContainer = function() {
        return $('#menu-1');
    }

    funcs.lastGalleryContainer = function() {
        return $('div.gallery-container:last', funcs.getMainContainer());
    }

    funcs.addGalleryContainer = function() {
        jqels.newNest.before(tpls.galleryTplContainer);
        return funcs.lastGalleryContainer();
    }

    funcs.addNest = function(lastGalleryContainer, item, index) {
        var html = new EJS({
            text: tpls.galleryTplNest[index],
            type: '['
        }).render({
            src: vars.domain + '/' + item.key + '?imageView2/2/h/' + Math.round(screen.availHeight * 0.85) + '/interlace/1',
            thumbnail: vars.domain + '/' + item.key + '?imageView2/1/w/500/h/500/interlace/1'
        });
        $('div.row', lastGalleryContainer).append(html);
    }

    funcs.addImage = function(lastGalleryContainer, item) {
        if (lastGalleryContainer.length > 0) {
            var hexCount = $('div.hex', lastGalleryContainer).length;
            if (hexCount < 9) { //一个gallery container最多9个hex
                funcs.addNest(lastGalleryContainer, item, hexCount + 1);
            } else {
                //新加一行
                lastGalleryContainer = funcs.addGalleryContainer();
                //从第2个container开始class需要加templatemo_gallerytop answer_list
                lastGalleryContainer.addClass('templatemo_gallerytop').addClass('answer_list');
                funcs.addNest(lastGalleryContainer, item, 1);
            }
        } else {
            lastGalleryContainer = funcs.addGalleryContainer();
            funcs.addNest(lastGalleryContainer, item, 1);
        }

        return lastGalleryContainer;
    }

    funcs.addImages = function(items) {
        if ($.isArray(items) && items.length > 0) {
            var lastGalleryContainer = funcs.lastGalleryContainer();
            for (var i in items) {
                lastGalleryContainer = funcs.addImage(lastGalleryContainer, items[i]);
            };
            funcs.effect();
        }
    }

    funcs.effect = function() {
        $(".overlay").hide();

        $('.gallery-item').hover(
            function() {
                $(this).find('.overlay').addClass('animated fadeIn').show();
            },
            function() {
                $(this).find('.overlay').removeClass('animated fadeIn').hide();
            }
        );

        $('[data-rel="lightbox"]').lightbox();
    }

    funcs.load = function() {
        $.ajax('/image/load', {
            dataType: 'json',
            type: 'GET',
            data: {
                'imageMarker': jqels.imageMarker.val(),
                'limit': vars.imageLimit
            },
            success: function(data) {
                if (data.error) {
                    console.log('加载图片出错：' + data.error);
                    jqels.loadMore.html('加载更多');
                } else {
                    if ($.isArray(data.items)) {
                        funcs.addImages(data.items);
                        jqels.loadMore.prop('disabled', false);                        
                    }
                    if (data.marker) {
                        jqels.imageMarker.val(data.marker);
                        jqels.loadMore.html('加载更多');
                    } else {
                        jqels.imageMarker.val('');
                        jqels.loadMore.html('没有更多图片了');
                        jqels.loadMore.parent().animate({
                            opacity:'0.1'
                        },1000, function(){
                            jqels.loadMore.parent().css({visibility: 'hidden'});
                        });                   
                    }
                }


            },
            error: function(xhr, status, error) {
                console.log('加载图片出错：' + (status != '' ? status : error));
            }
        });
    };

    funcs.loadMore = function() {
        jqels.loadMore.prop('disabled', true);
        jqels.loadMore.html('加载中...');
        funcs.load();        
    };

    jqels.loadMore.click(funcs.loadMore);

    funcs.loadMore();
});