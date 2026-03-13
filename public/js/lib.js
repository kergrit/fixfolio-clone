(function () {
    var _t0 = performance.now();
    function _log(msg) { console.log('[lib.js] ' + msg + ': +' + (performance.now() - _t0).toFixed(1) + 'ms'); }

    _log('ready() start');

    var isScrolling = false; // 현재 fullpage 이동 상태를 저장

    var isFullpageActive = false;
    var resizeTimer;

    function initFullpage() {
        $('#fullpage').fullpage({
            navigation: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            normalScrollElements: '.f_normalscroll',
            autoHeight: true,

            afterLoad: function (anchorLink, index) {
                setTimeout(function () {
                    isScrolling = false;
                }, 300);
            },

            onLeave: function (index, nextIndex, direction) {
                var $current = $('.section').eq(index - 1);

                if ($current.hasClass('total')) {
                    var currentVideo = $current.find('video').get(0);
                    if (currentVideo) {
                        currentVideo.pause();
                    }
                }

                var $next = $('.section').eq(nextIndex - 1);

                if ($next.hasClass('total')) {
                    $next.addClass('action');

                    var nextVideo = $next.find('video').get(0);
                    if (nextVideo) {
                        nextVideo.muted = true;
                        nextVideo.play().catch(function (e) {});
                    }
                }

                if ($next.hasClass('knowhow') && $next.hasClass('t1')) {

                    // 다른 영상만 정지 (초기화 X)
                    $('.knowhow.t1 video').each(function () {
                        this.pause();
                    });

                    var $video = $('.knowhow.t1 .fn_video.on video').get(0);

                    if ($video) {
                        $video.muted = true; // iOS 대응

                        var playPromise = $video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(function (e) {
                                console.log('play 실패:', e);
                            });
                        }
                    }
                }

                // 🔥 knowhow에서 나갈 때는 전부 정지
                if ($current.hasClass('knowhow') && $current.hasClass('t1')) {
                    $('.knowhow.t1 video').each(function () {
                        this.pause();
                    });
                }

                if ($next.hasClass('knowhow') && $next.hasClass('t2')) {

                    // 다른 영상만 정지 (초기화 X)
                    $('.knowhow.t2 video').each(function () {
                        this.pause();
                    });

                    var $video = $('.knowhow.t2 .fn_video.on video').get(0);

                    if ($video) {
                        $video.muted = true; // iOS 대응

                        var playPromise = $video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(function (e) {
                                console.log('play 실패:', e);
                            });
                        }
                    }
                }

                // 🔥 knowhow에서 나갈 때는 전부 정지
                if ($current.hasClass('knowhow') && $current.hasClass('t2')) {
                    $('.knowhow.t2 video').each(function () {
                        this.pause();
                    });
                }

                isScrolling = true;
            }
        });

        isFullpageActive = true;
    }

    function controlFullpage() {
        var winW = window.innerWidth;

        if (winW <= 1024) {
            if (isFullpageActive) {
                $.fn.fullpage.destroy('all');
                isFullpageActive = false;
            }
        } else {
            if (!isFullpageActive) {
                initFullpage();   // 👉 destroy 상태면 새로 초기화
            }
        }
    }

    // 최초 실행
    _log('before controlFullpage');
    controlFullpage();
    _log('after controlFullpage');

    // 일반 스크롤 영역 감지
    $('.f_normalscroll').on('wheel', function (e) {
        if (isFullpageActive) {
            checkscroll(e, this);
        }
    });

    $('.f_normalscroll.t1').on('scroll', function () {
        if ($(this).scrollTop() > 30) {
            $("#fullpage .hero .fh_pop").removeClass("open");
        } else {
            $("#fullpage .hero .fh_pop").addClass("open");
        }
    });
    $('.f_normalscroll.t2').on('scroll', function () {
        if ($(this).scrollTop() > 30) {
            $("#fullpage .total .f_total .ft_videowrap").addClass("on");
        } else {
            $("#fullpage .total .f_total .ft_videowrap").removeClass("on");
        }
    });

    $('.f_normalscroll.t4').on('scroll', function () {
        var scrollTop = $(this).scrollTop(); // 요소 내부의 스크롤 위치
        var innerHeight = $(this).innerHeight(); // 요소의 눈에 보이는 높이 (패딩 포함)
        var scrollHeight = $(this).prop('scrollHeight'); // 요소 내부의 실제 전체 콘텐츠 높이


        if (scrollTop + innerHeight >= scrollHeight - $(".f_experience").innerHeight() * 0.3) { // 5px 정도 여유를 둠
            $("#fullpage .charge .f_experience").addClass("on");
        } else {
            $("#fullpage .charge .f_experience").removeClass("on");
        }
    });

    $('.knowhow.t1 .fncl_btn').on('click', function () {

        var $this = $(this);
        var $p = $this.next('div');

        if ($p.is(':visible')) {
            $p.stop().slideUp(300);
            $this.removeClass('on');
        } else {
            $('.knowhow.t1 .fncl_btn').removeClass('on');
            $('.knowhow.t1 .fncl_btn + .fncl_content').stop().slideUp(300);

            $p.stop().slideDown(300);
            $this.addClass('on');
        }
        if (isFullpageActive) {
            var $li = $(this).closest('li');
            var index = $li.index(); // 0,1,2

            // 1️⃣ 모든 영상 정지 + on 제거
            $('.knowhow.t1 .fn_video').removeClass('on');
            $('.knowhow.t1 .fn_video video').each(function () {
                this.pause();
                this.currentTime = 0;
            });

            // 2️⃣ 해당 순서 영상 찾기
            var $targetVideoWrap = $('.knowhow.t1 .fn_video').eq(index);
            var $video = $targetVideoWrap.find('video').get(0);

            // 3️⃣ on 추가 + 재생
            $targetVideoWrap.addClass('on');
            $video.play();
        } else {
            var $currentContent = $this.next('.fncl_content');
            var $currentVideo = $currentContent.find('video').get(0);
            // 🔥 모든 모바일 영상 정지 + 초기화
            $('.knowhow.t1 .fncl_content video').each(function () {
                this.pause();
                this.currentTime = 0;
            });
            // 🔥 현재 열린 경우에만 재생
            if ($p.is(':visible') && $currentVideo) {
                $currentVideo.play();
            }
        }
    });

    $('.knowhow.t2 .fncl_btn').on('click', function () {

        var $this = $(this);
        var $p = $this.next('div');

        if ($p.is(':visible')) {
            $p.stop().slideUp(300);
            $this.removeClass('on');
        } else {
            $('.knowhow.t2 .fncl_btn').removeClass('on');
            $('.knowhow.t2 .fncl_btn + .fncl_content').stop().slideUp(300);

            $p.stop().slideDown(300);
            $this.addClass('on');
        }

        if (isFullpageActive) {
            var $li = $(this).closest('li');
            var index = $li.index(); // 0,1,2

            // 1️⃣ 모든 영상 정지 + on 제거
            $('.knowhow.t2 .fn_video').removeClass('on');
            $('.knowhow.t2 .fn_video video').each(function () {
                this.pause();
                this.currentTime = 0;
            });

            // 2️⃣ 해당 순서 영상 찾기
            var $targetVideoWrap = $('.knowhow.t2 .fn_video').eq(index);
            var $video = $targetVideoWrap.find('video').get(0);

            // 3️⃣ on 추가 + 재생
            $targetVideoWrap.addClass('on');
            $video.play();
        } else {
            var $currentContent = $this.next('.fncl_content');
            var $currentVideo = $currentContent.find('video').get(0);

            // 🔥 모든 모바일 영상 정지 + 초기화
            $('.knowhow.t2 .fncl_content video').each(function () {
                this.pause();
                this.currentTime = 0;
            });
            // 🔥 현재 열린 경우에만 재생
            if ($p.is(':visible') && $currentVideo) {
                $currentVideo.play();
            }
        }
    });

    $('#fullpage .agent .f_agent .fa_box').hover(function () {
        const $parent = $(this).closest('.f_agent');
        // 기존 클래스 제거
        $parent.removeClass('t1 t2');
        // 현재 hover된 박스의 클래스 체크
        if ($(this).hasClass('t1')) {
            $parent.addClass('t1');
        }
        if ($(this).hasClass('t2')) {
            $parent.addClass('t2');
        }
    }, function () {
        // 마우스 나가면 제거
        $(this).closest('.f_agent').removeClass('t1 t2');
    });
    $('#aside .a_topbtn').on('click', function (e) {
        if (isFullpageActive) {
            e.preventDefault();
            $.fn.fullpage.moveTo(1);
        }
    });
    $('button.hn_btn.total').on('click', function (e) {
        if (isFullpageActive) {
            e.preventDefault();
            $.fn.fullpage.moveTo(2);
        } else {
            e.preventDefault();

            var targetTop = $("#section2").offset().top;

            $("html, body").stop().animate({
                scrollTop: targetTop
            }, 600);
            $("#header .h_menubtn").removeClass("open");
            $("body").removeClass("scroll-lock");
        }
    });
    $('button.hn_btn.charge').on('click', function (e) {
        if (isFullpageActive) {
            e.preventDefault();
            $.fn.fullpage.moveTo(8);
        } else {
            e.preventDefault();

            var targetTop = $("#section8").offset().top - 105;

            $("html, body").stop().animate({
                scrollTop: targetTop
            }, 600);
            $("#header .h_menubtn").removeClass("open");
            $("body").removeClass("scroll-lock");
        }
    });

    $('.btn.inquery').on('click', function (e) {
        if (isFullpageActive) {
            e.preventDefault();
            $.fn.fullpage.moveTo(9);
        } else {
            e.preventDefault();

            var targetTop = $("#section9").offset().top - 65;

            $("html, body").stop().animate({
                scrollTop: targetTop
            }, 600);
            $("#header .h_menubtn").removeClass("open");
            $("body").removeClass("scroll-lock");
        }
    });

    if (window.location.hash === '#total') {
        if (isFullpageActive) {
            $.fn.fullpage.moveTo(2);
        } else {
            var targetTop = $("#section2").offset().top;

            $("html, body").stop().animate({
                scrollTop: targetTop
            }, 600);
        }
    }

    if (window.location.hash === '#charge') {
        if (isFullpageActive) {
            $.fn.fullpage.moveTo(8);
        } else {
            var targetTop = $("#section8").offset().top - 105;

            $("html, body").stop().animate({
                scrollTop: targetTop
            }, 600);
        }
    }


    var bottomReachTime = 0;
    var topReachTime = 0;
    var delay = 500; // 0.5초

    function checkscroll(e, that) {
        if (isScrolling) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        var delta = e.originalEvent.deltaY;
        var scrollTop = $(that).scrollTop();
        var innerHeight = $(that).innerHeight();
        var scrollHeight = $(that)[0].scrollHeight;
        var now = new Date().getTime();

        // 🔽 아래로 스크롤
        if (delta > 0) {
            if (scrollTop + innerHeight >= scrollHeight - 1) {
                if (bottomReachTime && (now - bottomReachTime < delay)) {
                    bottomReachTime = 0;
                    $.fn.fullpage.moveSectionDown();
                } else {
                    bottomReachTime = now; // 첫 도달 시간 저장
                }
            } else {
                bottomReachTime = 0;
            }
        }
        // 🔼 위로 스크롤
        else {
            if (scrollTop <= 0) {
                if (topReachTime && (now - topReachTime < delay)) {
                    topReachTime = 0;
                    $.fn.fullpage.moveSectionUp();
                } else {
                    topReachTime = now;
                }
            } else {
                topReachTime = 0;
            }
        }
    }
    if($(".pop.event").hasClass("open")){
        // 이미 open 클래스가 있으면 보여주기 (초기 로딩 시)
        $(".pop.event").show();
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(false);
        }else{
            $("body").addClass("scroll-lock");
        }
    }
    
    $(".pop.event .pe_close").click(function() {
        $(".pop.event").removeClass("open").hide(); // hide() 추가
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(true);
        }else{
            $("body").removeClass("scroll-lock");
        }
    });


    $(".pop.introduce .pi_close").click(function() {
        $(".pop.introduce").removeClass("open").hide(); // hide() 추가
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(true);
        }else{
            $("body").removeClass("scroll-lock");
        }

        var video01 = $(".pop.introduce.t1").find("video").get(0);
        if (video01) {
            video01.pause();
            video01.currentTime = 0;
        }

        var video02 = $(".pop.introduce.t2").find("video").get(0);
        if (video02) {
            video02.pause();
            video02.currentTime = 0;
        }
    });

    $(".btn.introduce01").click(function() {
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(false);
        }else{
            $("body").addClass("scroll-lock");
        }
        
        // show() 추가하여 display:none 해제
        $(".pop.introduce.t1").show().addClass("open");

        var $pop = $(".pop.introduce.t1");
        $pop.addClass("on");

        var video = $pop.find("video").get(0);
        if (video) {
            video.currentTime = 0; // 처음부터
            video.play();
        }
    });

    $(".btn.introduce02").click(function() {
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(false);
        }else{
            $("body").addClass("scroll-lock");
        }
        
        // show() 추가하여 display:none 해제
        $(".pop.introduce.t2").show().addClass("open");

        var $pop = $(".pop.introduce.t2");
        $pop.addClass("on");

        var video = $pop.find("video").get(0);
        if (video) {
            video.currentTime = 0; // 처음부터
            video.play();
        }
    });

    $(".btn.participate").click(function() {
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(false);
        }else{
            $("body").addClass("scroll-lock");
        }
        // show() 추가하여 display:none 해제
        $(".pop.participate").show().addClass("open");
    });

    $(".pop.participate .pp_close").click(function() {
        if(isFullpageActive) {
            $.fn.fullpage.setAllowScrolling(true);
        }else{
            $("body").removeClass("scroll-lock");
        }
        // hide() 추가하여 다시 숨김
        $(".pop.participate").removeClass("open").hide();
    });

    const popup = document.querySelector('.fh_pop');
    const closeBtn = document.querySelector('.fhpc_closebtn'); // 클래스명 오타 확인: fhc_closebtn
    const todayCheck = document.getElementById('todayclose');
    const storageKey = 'fh_popup_today';

    // 1. 페이지 로드 시: '오늘 하루 보지 않기' 기록이 있는지 확인
    const expiryDate = localStorage.getItem(storageKey);
    const today = new Date().toLocaleDateString();
    if(popup) {
        if (expiryDate === today) {
            // 기록이 있다면 'off' 클래스 추가

            popup.classList.add('off');
        }

        // 2. 닫기 버튼 클릭 시 처리
        closeBtn.addEventListener('click', function () {
            if (todayCheck.checked) {
                // [체크 ON] 하루 동안 안 보기: 로컬스토리지 저장 + 'off' 클래스 추가
                localStorage.setItem(storageKey, today);
                popup.classList.add('off');
            } else {
                // [체크 OFF] 그냥 닫기: 'close' 클래스 추가
                popup.classList.add('close');
            }
        });
    }


    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
            controlFullpage();
            if (swiper && !swiper.destroyed) {
                swiper.update();

                if (swiper.params.autoplay && swiper.autoplay) {
                    swiper.autoplay.start();
                }
            }
        }, 200);

    });


    var onTimer = null;
    const hero = document.querySelector(".fs_hero");

    var bannerLoops = [];
    var bannerPrefetchStarted = false;

    function getBannerClassByOffset(swiperInstance, offset) {
        const normalized = (((swiperInstance.realIndex + offset) % 8) + 8) % 8;
        return `t${normalized + 1}`;
    }

    function loadBannerImagesByClasses(classNames, priority) {
        if (!classNames || !classNames.length) return;

        const uniqueClasses = Array.from(new Set(classNames));
        const selector = uniqueClasses.map(function(cls){ return `.fs_banner li.${cls} img`; }).join(', ');
        if (!selector) return;

        $(selector).each(function () {
            const dataSrc = this.getAttribute('data-src');
            if (!dataSrc) return;

            if (priority) {
                this.loading = 'eager';
                this.fetchPriority = 'high';
            } else {
                this.loading = 'lazy';
            }

            this.decoding = 'async';
            this.src = dataSrc;
            this.removeAttribute('data-src');
        });
    }

    function prefetchRemainingBannerImages() {
        if (bannerPrefetchStarted) return;
        bannerPrefetchStarted = true;

        var lazyTargets = Array.from(document.querySelectorAll('.fs_banner img[data-src]'));
        var index = 0;
        var chunkSize = 8;

        function pump() {
            var count = 0;

            while (index < lazyTargets.length && count < chunkSize) {
                var img = lazyTargets[index];
                var dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.src = dataSrc;
                    img.removeAttribute('data-src');
                }
                index += 1;
                count += 1;
            }

            if (index < lazyTargets.length) {
                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback(pump, { timeout: 1200 });
                } else {
                    window.setTimeout(pump, 180);
                }
            }
        }

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(pump, { timeout: 1200 });
        } else {
            window.setTimeout(pump, 400);
        }
    }

    function primeBannerImages(swiperInstance, includePrev) {
        const currentClass = getBannerClassByOffset(swiperInstance, 0);
        const nextClass = getBannerClassByOffset(swiperInstance, 1);
        const targetClasses = includePrev
            ? [currentClass, nextClass, getBannerClassByOffset(swiperInstance, -1)]
            : [currentClass, nextClass];

        loadBannerImagesByClasses(targetClasses, true);
    }

    function getHeroTargetClass(swiperInstance) {
        return `t${(swiperInstance.realIndex % 8) + 1}`;
    }

    function syncBannerToSlide(swiperInstance, duration = 1600) {
        const targetClass = getHeroTargetClass(swiperInstance);

        bannerLoops.forEach(function(loop){
            loop.setPaused(false);
            loop.moveToClass(targetClass, duration);
        });
    }

    function queueInitialBannerSync(swiperInstance) {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                primeBannerImages(swiperInstance, true);

                var initialClasses = [
                    getBannerClassByOffset(swiperInstance, -1),
                    getBannerClassByOffset(swiperInstance, 0),
                    getBannerClassByOffset(swiperInstance, 1)
                ];
                var initialSelector = initialClasses.map(function(cls){ return `.fs_banner li.${cls} img`; }).join(', ');
                var $bannerImgs = $(initialSelector);
                var pending = 0;
                var fired = false;

                function runInitialSync() {
                    if (fired) return;
                    fired = true;
                    syncBannerToSlide(swiperInstance, 0);
                }

                function done() {
                    pending -= 1;
                    if (pending <= 0) {
                        runInitialSync();
                    }
                }

                $bannerImgs.each(function () {
                    if (this.complete && this.naturalWidth > 0) return;
                    pending += 1;
                    $(this).one('load error', done);
                });

                if (pending === 0) {
                    runInitialSync();
                } else {
                    setTimeout(runInitialSync, 500);
                }

                setTimeout(prefetchRemainingBannerImages, 1800);
            });
        });
    }

    var swiper = new Swiper(".fs_hero", {
        effect: "fade",
        loop: true,
        init: false,
        speed: 700,
        updateOnWindowResize: false,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        on: {
            init: function () {
                queueInitialBannerSync(this);
                setTimeout(() => {
                    this.slideToLoop(1, 600, true);
                }, 200);
                setTimeout(() => {
                    $("#fullpage .hero").addClass("on");
                }, 210);

            },
            slideChangeTransitionStart: function () {
                primeBannerImages(this, false);
                syncBannerToSlide(this, this.params.speed || 700);
            }
        }
    });

    function verticalLoop(target, direction = 'up', speed = 0.5, startClass = null) {
        const $el = $(target);
        const el = $el.get(0);
        if (!el) {
            return {
                moveToClass: function(){},
                setPaused: function(){}
            };
        }

        const $ul = $el.find('ul').first();
        const $items = $ul.children('li');
        const originalCount = $items.length;
        let isDuplicated = false;

        if (originalCount > 1 && originalCount % 2 === 0) {
            const half = originalCount / 2;
            isDuplicated = true;
            for (let i = 0; i < half; i += 1) {
                const $a = $items.eq(i);
                const $b = $items.eq(i + half);
                const aSig = `${$a.attr('class') || ''}|${$a.find('img').attr('src') || ''}`;
                const bSig = `${$b.attr('class') || ''}|${$b.find('img').attr('src') || ''}`;
                if (aSig !== bSig) {
                    isDuplicated = false;
                    break;
                }
            }
        }

        if (!isDuplicated) {
            $ul.append($items.clone());
        }

        let pos = 0;
        let totalHeight = 0; // 2배 리스트 기준
        let startPos = null;
        let isPaused = false;
        let jump = null;

        el.style.willChange = 'transform';
        el.style.backfaceVisibility = 'hidden';
        el.style.webkitBackfaceVisibility = 'hidden';

        let _metricsRetryCount = 0;
        const _MAX_METRICS_RETRY = 30; // 최대 30프레임(~500ms)만 재시도

        function refreshMetrics() {
            totalHeight = el.scrollHeight / 2;
            if (!Number.isFinite(totalHeight) || totalHeight <= 0) {
                totalHeight = 0;
            }
        }

        function normalizePos(value) {
            if (totalHeight <= 0) return value;
            while (value > 0) value -= totalHeight;
            while (value < -totalHeight) value += totalHeight;
            return value;
        }

        if (startClass) {
            const $startItem = $el.find(`ul > li.${startClass}`).first();
            if ($startItem.length) {
                startPos = -$startItem.position().top;
                if (direction === 'down' && startPos === 0) {
                    startPos = -totalHeight;
                }
            }
        }

        function animate(now) {
            if (totalHeight <= 0) {
                _metricsRetryCount++;
                if (_metricsRetryCount <= _MAX_METRICS_RETRY) {
                    refreshMetrics();
                    // totalHeight가 잡혔으면 시작 위치 재설정
                    if (totalHeight > 0) {
                        if (direction === 'down' && startPos === 0) {
                            startPos = -totalHeight;
                        }
                        if (startPos !== null) {
                            pos = startPos;
                        } else if (direction === 'down') {
                            pos = -totalHeight;
                        }
                        pos = normalizePos(pos);
                    }
                }
                // totalHeight 여전히 0이면 transform 쓰기/읽기 없이 다음 프레임만 예약
                if (totalHeight <= 0) {
                    requestAnimationFrame(animate);
                    return;
                }
            }

            if (jump) {
                const progress = Math.min((now - jump.startTime) / jump.duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                pos = jump.from + ((jump.to - jump.from) * eased);

                if (progress >= 1) {
                    pos = jump.to;
                    jump = null;
                }
            } else if (!isPaused) {
                if (direction === 'up') {
                    pos -= speed;
                    if (pos <= -totalHeight) {
                        pos += totalHeight;
                    }
                } else {
                    pos += speed;
                    if (pos >= 0) {
                        pos -= totalHeight;
                    }
                }
            } else {
                pos = normalizePos(pos);
            }

            el.style.transform = `translate3d(0, ${pos}px, 0)`;
            requestAnimationFrame(animate);
        }

        function moveToClass(className, duration = 420) {
            if (totalHeight <= 0) {
                refreshMetrics();
            }
            const $targetItem = $el.find(`ul > li.${className}`).first();
            if (!$targetItem.length || totalHeight <= 0) return;

            const baseTarget = normalizePos(-$targetItem.position().top);
            const candidates = [baseTarget, baseTarget - totalHeight, baseTarget + totalHeight];
            const directionCandidates = direction === 'down'
                ? candidates.filter(function(candidate){ return candidate <= 0; })
                : candidates;
            const targetCandidates = directionCandidates.length ? directionCandidates : candidates;

            let nearest = targetCandidates[0];
            let minDiff = Math.abs(nearest - pos);

            for (let i = 1; i < targetCandidates.length; i += 1) {
                const diff = Math.abs(targetCandidates[i] - pos);
                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = targetCandidates[i];
                }
            }

            if (Math.abs(nearest - pos) < 1) {
                jump = null;
                pos = nearest;
                el.style.transform = `translate3d(0, ${pos}px, 0)`;
                return;
            }

            if (duration <= 0) {
                jump = null;
                pos = nearest;
                el.style.transform = `translate3d(0, ${pos}px, 0)`;
                return;
            }

            jump = {
                from: pos,
                to: nearest,
                startTime: performance.now(),
                duration: duration
            };
        }

        function setPaused(flag) {
            isPaused = flag;
        }

        function rescalePosition(beforeHeight) {
            if (!(beforeHeight > 0 && totalHeight > 0)) return;

            const ratio = totalHeight / beforeHeight;
            pos *= ratio;

            // Keep jump continuity when image/viewport metrics change mid-animation.
            if (jump) {
                jump.from *= ratio;
                jump.to *= ratio;
            }

            pos = normalizePos(pos);
            if (jump) {
                jump.from = normalizePos(jump.from);
                jump.to = normalizePos(jump.to);
            }

            el.style.transform = `translate3d(0, ${pos}px, 0)`;
        }

        // 시작 위치 세팅
        refreshMetrics();
        if (direction === 'down' && startPos === 0 && totalHeight > 0) {
            startPos = -totalHeight;
        }
        if (startPos !== null) {
            pos = startPos;
        } else if (direction === 'down') {
            pos = -totalHeight;
        }
        pos = normalizePos(pos);

        $el.find('img').on('load', function () {
            const before = totalHeight;
            refreshMetrics();
            rescalePosition(before);
        });

        $(window).on('resize', function () {
            const before = totalHeight;
            refreshMetrics();
            rescalePosition(before);
        });

        requestAnimationFrame(animate);

        return {
            moveToClass: moveToClass,
            setPaused: setPaused
        };
    }

    // 위 → 아래
    bannerLoops.push(verticalLoop('.fsb_list.t1', 'down', 0.4, 't8'));
    bannerLoops.push(verticalLoop('.fsb_list.t3', 'down', 0.4, 't8'));

    // 아래 → 위
    bannerLoops.push(verticalLoop('.fsb_list.t2', 'up', 0.4, 't8'));
    bannerLoops.push(verticalLoop('.fsb_list.t4', 'up', 0.4, 't8'));

    swiper.init();


    var swiper2 = new Swiper(".fhpl_swiper", {});

    var swiper3 = new Swiper(".fc_swiper", {
        slidesPerView: 1,
        spaceBetween: 15, // 🔥 gap 20px

        pagination: {
            el: ".fc_swiper .swiper-pagination",
            clickable: true, // 🔥 클릭 가능
        }

    });

    const section = document.querySelector('.point');
    const counters = {
        'fp_count01': { start: 1, end: 5, duration: 1000, delay: 300 },
        'fp_count02': { start: 300, end: 600, duration: 1500, delay: 300 },
        'fp_count03': { start: 1500, end: 2000, duration: 1500, delay: 1000 },
        'fp_count04': { start: 100, end: 150, duration: 1000, delay: 1000 }
    };

    let requestIds = {};
    let timeoutIds = {};
    let isAnimated = false;

    function animateCount(el, start, end, duration, delay, key) {
        // 기존 실행 중인 타이머나 프레임이 있다면 즉시 제거
        if (timeoutIds[key]) clearTimeout(timeoutIds[key]);
        if (requestIds[key]) cancelAnimationFrame(requestIds[key]);

        timeoutIds[key] = setTimeout(() => {
            let startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                // 가속도 없이 일정하게 증가하도록 계산
                const current = Math.floor(progress * (end - start) + start);

                el.innerText = current.toLocaleString();

                if (progress < 1) {
                    requestIds[key] = requestAnimationFrame(step);
                } else {
                    el.innerText = end.toLocaleString(); // 마지막 값 보정
                }
            }
            requestIds[key] = requestAnimationFrame(step);
        }, delay);
    }

    function resetCount() {
        isAnimated = false; // 상태 초기화
        Object.keys(counters).forEach(key => {
            const el = document.querySelector(`.${key}`);
            if (el) {
                // 타이머와 애니메이션 모두 취소
                if (timeoutIds[key]) clearTimeout(timeoutIds[key]);
                if (requestIds[key]) cancelAnimationFrame(requestIds[key]);
                // 즉시 시작값으로 변경
                el.innerText = counters[key].start.toLocaleString();
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = section.classList.contains('active');

                if (isActive && !isAnimated) {
                    // active 클래스가 추가되었고, 아직 실행 전일 때만 실행
                    isAnimated = true;
                    Object.keys(counters).forEach(key => {
                        const el = document.querySelector(`.${key}`);
                        if (el) {
                            const data = counters[key];
                            animateCount(el, data.start, data.end, data.duration, data.delay, key);
                        }
                    });
                } else if (!isActive && isAnimated) {
                    // active 클래스가 제거되었을 때 리셋
                    resetCount();
                }
            }
        });

    });

    const boxes = document.querySelectorAll(".fp_box");

    boxes.forEach((box) => {
        let isAnimated = false;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    const isActive = box.classList.contains("active");
                    if (isActive && !isAnimated) {
                        isAnimated = true;
                        // 해당 박스 안에 있는 mark만 실행
                        const marks = box.querySelectorAll("mark");
                        marks.forEach((el) => {
                            const key = el.className; // fp_count01 같은거
                            const data = counters[key];
                            if (data) {
                                animateCount(
                                    el,
                                    data.start,
                                    data.end,
                                    data.duration,
                                    data.delay,
                                    key
                                );
                            }

                        });
                    } else if (!isActive && isAnimated) {
                        isAnimated = false;
                        MresetCount(box); // 해당 박스만 리셋
                    }
                }
            });
        });
        observer.observe(box, { attributes: true });
    });

    function MresetCount(targetBox) {
        const marks = targetBox.querySelectorAll("mark");

        marks.forEach((el) => {
            const key = el.className;
            if (counters[key]) {
                el.textContent = counters[key].start;
            }
        });
    }

    // ✅ 수정: isTermPage()를 observe 전에 호출하도록 함수 순서 변경
    if (section && !isTermPage()) {
        observer.observe(section, { attributes: true });
    }

    if (section) {
        resetCount();
    }

    $(".togglebtn").click(function() {
        var $btn = $(this);
        var $blind = $btn.find("span.blind");

        if ($btn.hasClass("open")) {
            $blind.text("열기");
            if ($btn.hasClass("h_menubtn")) {
                $("body").removeClass("scroll-lock");
            }
        } else {
            $blind.text("닫기");

            if ($btn.hasClass("h_menubtn")) {
                $("body").addClass("scroll-lock");
            }
        }

        $btn.toggleClass("open");
    });


    $(window).scroll(function(){
        if(!isFullpageActive) {
            var scrollTop = $(window).scrollTop();

            if (scrollTop > 10) {
                $("#fullpage .hero .fh_pop").removeClass("open");
            } else {
                $("#fullpage .hero .fh_pop").addClass("open");
            }

            if (scrollTop > $("#section2").offset().top - $(window).height()) {
                $("#fullpage .hero .fh_pop").removeClass("open2");
            }else{
                $("#fullpage .hero .fh_pop").addClass("open2");
            }


            var $videoWrap = $("#fullpage .total .f_total .ft_videowrap");
            var video = $videoWrap.find("video").get(0);

            if ( $("#fullpage .total .f_total .ft_videowrap").offset().top + $videoWrap.height() * 0.9 < scrollTop + $(window).height()) {
                $videoWrap.addClass("on");
                if (video) {
                    if(scrollTop <= $(".section.total").offset().top + $(".section.total").innerHeight()) {
                        video.play();
                    }else {
                        video.pause();
                    }
                }
            } else {
                $videoWrap.removeClass("on");
                if (video) {
                    video.pause();
                }
            }



            var windowHeight = $(window).height();

            $("#fullpage .introduce .f_introduce .fi_list li").each(function(){

                var $this = $(this);
                var elementTop = $this.offset().top;

                // 🔥 화면의 80% 지점에 도달하면 on
                if (scrollTop + windowHeight > elementTop) {
                    $this.addClass("on");
                } else {
                    $this.removeClass("on");
                }

            });

            $("#fullpage .point .f_point .fp_wrap .fp_box").each(function () {

                var $this = $(this);
                var offsetTop = $this.offset().top;
                var boxH = $this.outerHeight();

                // 박스의 중간이 화면 안에 들어오면 active
                if (scrollTop + windowHeight > offsetTop + boxH / 3) {
                    $this.addClass("active");
                } else {
                    $this.removeClass("active");
                }

            });


            if ($("#fullpage .f_experience").offset().top - 400 < scrollTop) {
                $("#fullpage .f_experience").addClass("on");
            }else{
                $("#fullpage .f_experience").removeClass("on");
            }

            var $section = $("#section5");

            var sectionTop = $section.offset().top;
            var sectionBottom = sectionTop + $section.outerHeight();

            // section5 영역 안에 들어왔는지 체크
            if (scrollTop + windowHeight * 0.8 > sectionTop && scrollTop < sectionBottom) {
                console.log("123");

                // 현재 on 되어있는 버튼의 video만 찾기
                var $activeVideo = $section.find(".fncl_btn.on")
                    .closest("li")
                    .find("video");

                if ($activeVideo.length) {
                    $activeVideo.get(0).play();
                }

            } else {
                // 영역 벗어나면 section5 안에 있는 비디오 전체 pause
                $section.find("video").each(function () {
                    this.pause();
                });
            }

            var $section2 = $("#section3");

            var sectionTop2 = $section2.offset().top;
            var sectionBottom2 = sectionTop + $section2.outerHeight();

            // section5 영역 안에 들어왔는지 체크
            if (scrollTop + windowHeight * 0.8 > sectionTop2 && scrollTop < sectionBottom2) {
                console.log("333");
                // 현재 on 되어있는 버튼의 video만 찾기
                var $activeVideo2 = $section2.find(".fncl_btn.on")
                    .closest("li")
                    .find("video");

                if ($activeVideo2.length) {
                    $activeVideo2.get(0).play();
                }

            } else {
                // 영역 벗어나면 section5 안에 있는 비디오 전체 pause
                $section2.find("video").each(function () {
                    this.pause();
                });
            }


        }
    });

    function isTermPage() {
        var path = window.location.pathname;
        // 기존: fileName === 'term.html' 만 체크
        // 수정: /term 경로 포함 여부 체크
        return path.indexOf('/term') !== -1 || path.substring(path.lastIndexOf('/') + 1) === 'term.html';
    }


    function updateChargeClass() {
        var $fcharge = $('#fullpage .charge .f_charge');
        if (!$fcharge.length) return;

        var width = $(window).width();
        var height = $(window).height();

        // 기존 클래스 제거
        $fcharge.removeClass('t1 t2 t3');

        // 1441 ~ 1920
        if (width >= 1441 && width <= 1920) {
            if (height <= 820) {
                $fcharge.addClass('t1');
            }
        }
        // 1281 ~ 1440
        else if (width >= 1281 && width <= 1440) {
            if (height <= 800) {
                $fcharge.addClass('t2');
            }
        }
        // 1025 ~ 1280
        else if (width >= 1025 && width <= 1280) {
            if (height <= 760) {
                $fcharge.addClass('t3');
            }
        }
        // 1024 이하 → 아무것도 안함
    }

    // 최초 실행
    updateChargeClass();

    // 리사이즈 시 재계산
    $(window).on('resize', function () {
        updateChargeClass();
    });

	_log('ready() complete');

    // SvelteKit에 초기화 완료를 알림
    if (window._libReady) {
        window._libReady();
    }
})();
